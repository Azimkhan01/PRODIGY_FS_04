let socket = io();
let username = prompt("Enter your name");
if (username != undefined && username != "") {
  socket.emit("username", username);
} else {
  window.location.reload();
}

socket.on("add-username", (msg) => {
  console.log(msg);
  let userCount = document.getElementById("userCount");
  userCount.textContent = Object.keys(msg).length;
  let userList = document.getElementById("user-list");
  userList.textContent = "";
  for (let key in msg) {
    userList.append(msg[key] + ",");
  }
});

let ChatBox = document.getElementById("chatBox");
let messageSent = document.getElementById("messageSent");
let messageReceived = document.getElementById("messageReceived");
let sendmsg = document.getElementById("sendmsg");
let submit = document.getElementById("submit");
let now = new Date();
const hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();
submit.addEventListener("click", (e) => {
  if (sendmsg.value != undefined && sendmsg.value != "") {
    let div = document.createElement("div");
    div.className = "message sent";
    div.innerHTML = ` <span class="name">You</span>
                <p>${sendmsg.value}</p>
                <span class="time">${
                  hours + ":" + minutes + ":" + seconds
                }</span>`;
    ChatBox.appendChild(div);
    let receive = {
      message: sendmsg.value,
      id: socket.id,
    };
    socket.emit("message", receive);
  }
 sendmsg.value = "" 
});

socket.on("message", (msg) => {
  let div = document.createElement("div");
  div.className = "message received";
  div.innerHTML = ` <span class="name">${msg["name"]}</span>
                 <p>${msg["message"]}</p>
                 <span class="time">${
                   hours + ":" + minutes + ":" + seconds
                 }</span>`;
  ChatBox.appendChild(div);
});

socket.on("disconnection", (msg) => {
  console.log("disconnect" + msg);
  let userCount = document.getElementById("userCount");
  userCount.textContent = Object.keys(msg).length;
  let userList = document.getElementById("user-list");
  userList.textContent = "";
  for (let key in msg) {
    userList.append(msg[key] + ",");
  }
});
