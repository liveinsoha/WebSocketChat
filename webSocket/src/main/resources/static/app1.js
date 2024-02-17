var stompClient = null;

let myName = prompt("아이디를 입력하세요");
console.log(myName);

setMyName();

function setMyName() {

    if (myName !== null) {
        document.getElementById('name').value = myName;
        document.getElementById('name').readOnly = true;
    }
}

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/user/' + myName, function (message) { //나를 구독한다
            addMessage(JSON.parse(message.body), false); //자바 스크립트 객체로 변환
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({ 'name': $("#name").val() }));
}

function sendMessage() {

    var toUser = document.getElementById("toUser").value;
    var content = document.getElementById("message").value;


    var today = new Date();
    var date = today.toLocaleString();


    var message =
    {
        sender: myName,
        content: content,
        date: date
    };

    stompClient.send("/topic/user/" + toUser, {}, JSON.stringify(message));
    addMessage(message, true)
}


function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}


function addMessage(message, isMe) {

    let chatBox = document.querySelector("#chat-box");
    let messageBox = document.createElement("div");

    if (isMe) {
        messageBox.className = "outgoing_msg";
        messageBox.innerHTML = getSendMsgBox(message);
    } else {
        messageBox.className = "received_msg";
        messageBox.innerHTML = getReceiveMsgBox(message);
    }
    chatBox.append(messageBox);
}



function getSendMsgBox(data) {
    return `<div class="sent_msg">
    <p>${data.content}</p>
    <span class="time_date"> ${data.date} | ${data.sender}</span>
    </div>`;
}

function getReceiveMsgBox(data) {
    return `<div class="received_withd_msg">
    <p>${data.content}</p>
    <span class="time_date"> ${data.date} / ${data.sender} </span>
    </div>`;
}


$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () { connect(); });
    $("#disconnect").click(function () { disconnect(); });
    $("#send").click(function () { sendMessage(); });
});