// ==UserScript==
// @name         SelectCourse
// @namespace    http://nogeek.top/
// @version      0.2
// @description  Automatic course selector
// @author       Nogeek
// @match        http://zhjwxk.cic.tsinghua.edu.cn/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @run-at      document-end
// ==/UserScript==

var aimNumber = '';
var aimCNumber = '';
var queryed = '';
var hwnd_Move = 0;
var hwnd_Opacity = 0;
var htm = '';
var workingflag = 0;

function tree_main() {
    openEx("selc_disp");
    htm += `
    <style type="text/css">
    .inp {
        padding: 5px 8px;
        height: 10px;
        border: 1px solid #D9D9D9;
        box-shadow: 1px 1px 1px #E1E1E1 inset;
    }

    .btn {
        display: block;
        background: url(../images/xk/souSuobg_16.png) repeat-x;
        height: 20px;
        border: 1px solid #D9D9D9;
        border-radius: 3px;
        float: left;
        /* font-size: 15px; */
        /* line-height: 32px; */
        color: #E95C0D;
        text-align: center;
        /* margin: 10px 10px 0 10px; */
    }
    </style>
    <p>
        课程号
        <input class="inp" style="width: 60px;" name="cnumber" type="text" value=""> 序号
        <input class="inp" style="width: 15px;" name="cxnumber" type="text" value="x">
    </p>
    <p>
        <button id="btnDoit" name="doit" class="btn" href="javascript:void(0)"  style="width:50px;" s="0">开始</button>
        <button id="btnStopit" name="stopit" class="btn" href="javascript:void(0)"  style="width:50px;">停止</button>间隔
        <input class="inp" style="width: 30px" name="itvtime" type="text" value="1500">
    </p>
    `;
    document.getElementById("selc_disp").innerHTML = htm;
    setTimeout(function() { opacityEx("selc_disp"); }, 20);

    document.getElementById("btnDoit").addEventListener("click", tree_startSelect, false);
    document.getElementById("btnDoit").disabled = false;
    document.getElementById("btnStopit").addEventListener("click", tree_stopSelect, false);
}

function tree_startSelect() {
    document.getElementsByName('cnumber')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('cxnumber')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('itvtime')[0].setAttribute('readonly', 'readonly');
    this.setAttribute('s', 1);
    self.queryed='';
    rwindow = self.parent.frames['right'];
    rwindow.location.href = window.$('#showcz > li:nth-child(2) > a').attr('href');
}

function tree_stopSelect() {
    document.getElementsByName('cnumber')[0].removeAttribute('readonly');
    document.getElementsByName('cxnumber')[0].removeAttribute('readonly');
    document.getElementsByName('itvtime')[0].removeAttribute('readonly');
    workingflag = 0;
    $('#btnDoit')[0].setAttribute('s', 0);
}

function top_handle() {
    rwindow = self.frames['right'];
    twindow = self.frames['tree'];
    addEventListener(rwindow.onload);
}

function topfunc() {
    if (window.top === window.self) { top_handle(); }
    if (window.self.frameElement.name === 'tree') {
        tree_main();
    } else if (window.self.frameElement.name === 'bxFrm') {
        bx_main();
    }
}

function bx_chkstate() {
    var twindow = self.parent.parent.frames['tree'];
    var btnDoit = twindow.document.getElementById('btnDoit');
    return (btnDoit.getAttribute('s') != '0');
}

function bx_main() {
    if (!bx_chkstate()) return;
    var twindow = self.parent.parent.frames['tree'];
    var itvtime;
    window.alert = function() {};
    if (window.$('.current').attr('id') != 'mod2') window.location.href = window.$('#mod2').attr('href');
    else {
        window.$('#p_kch')[0].value = aimNumber = twindow.document.getElementsByName('cnumber')[0].value;
        var res = window.$('#table_t > tbody > tr > td:nth-child(2) > span')[0];
        if (res === undefined || res.innerHTML != aimNumber) {
            var twindow = self.parent.parent.frames['tree'];
            if(twindow.queryed==aimNumber) {
                twindow.alert('CANNOT FIND IT!');
                twindow.document.getElementById('btnStopit').click();
                return;
            }
            doQuery();
            twindow.queryed=aimNumber;
        }else {
            itvtime = parseInt(twindow.document.getElementsByName('itvtime')[0].value);
            window.setInterval(bx_submitIt, itvtime);
        }
    }
}

function bx_submitIt() {
    if (!bx_chkstate()) return;
    var courses = window.$('#table_t > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
    var twindow = self.parent.parent.frames['tree'];
    aimCNumber = twindow.document.getElementsByName('cxnumber')[0].value;
    if (courses.size() < 1) return;
    if (aimCNumber == 'x') courses[0].click();
    else {
        for (i = 0; i < courses.size(); i++) {
            if (courses[i].value.endsWith(aimCNumber + ';')) courses[i].click();
        }
    }
    var frm = window.frm;
    frm.m.value = 'saveRxKc';
    frm.submit();
    //alert('submitted');
}

function openEx(name) {
    var newwin = document.createElement("div");
    newwin.setAttribute("id", name);
    newwin.style.top = "10px";
    newwin.style.right = "10px";
    newwin.style.opacity = 0.85;

    window.addEventListener("scroll", function() {
        var newpos = document.body.scrollTop + 10;
        newwin.setAttribute("tarpos", newpos);
        setTimeout(function() {
            if (!hwnd_Move) moveEx(name);
        }, 50);
    }, false);

    var newpos = document.body.scrollTop + 10;
    newwin.setAttribute("tarpos", newpos);
    setTimeout(function() {
        if (!hwnd_Move) moveEx(name);
    }, 50);
    htm = "";
    var divTree = $('body > div > div')[0];
    divTree.appendChild(newwin);
    newwin.setAttribute("taropc", 0.1);
    newwin.addEventListener("mouseover", function() {
        this.style.opacity = 2;
        newwin.setAttribute("taropc", 2);
    }, false);
    newwin.addEventListener("mouseout", function() {
        this.style.opacity = 2;
        newwin.setAttribute("taropc", 0.1);
    }, false);
}

function moveEx(name) {
    var target = document.getElementById(name);
    var newpos = target.getAttribute("tarpos");
    var curr_pos = parseInt(target.style.top);
    if (curr_pos < newpos) {
        if (curr_pos - newpos < -8)
            curr_pos -= (curr_pos - newpos) / 4;
        else
            curr_pos += 1;
        target.style.top = curr_pos;
        hwnd_Move = setTimeout(function() { moveEx(name); }, 50);
    } else if (curr_pos > newpos) {
        if (curr_pos - newpos > 8)
            curr_pos -= (curr_pos - newpos) / 4;
        else
            curr_pos -= 1;
        target.style.top = curr_pos;
        hwnd_Move = setTimeout(function() { moveEx(name); }, 50);
    } else
        hwnd_Move = 0;
}

function opacityEx(name) {
    var target = document.getElementById(name);
    var newpos = target.getAttribute("taropc");
    var curr_pos = parseFloat(target.style.opacity);
    if (curr_pos < newpos) {
        if (curr_pos - newpos < -0.2)
            curr_pos += 0.2;
        else
            curr_pos = newpos;
        target.style.opacity = curr_pos;
    } else if (curr_pos > newpos) {
        if (curr_pos - newpos > 0.02)
            curr_pos -= 0.02;
        else
            curr_pos = newpos;
        target.style.opacity = curr_pos;
    }
    hwnd_Opacity = setTimeout(function() { opacityEx(name) ;}, 20);
}

topfunc();

