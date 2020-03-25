const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const userList = document.querySelector("#users");

// Get username and room from the url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", message => {
  // console.log(message);
  outputMessage(message);
});

// Message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  // Getting message text
  const msg = e.target.elements.msg.value;
  // console.log(msg);
  // Emitting a message to the server
  socket.emit("chatMessage", msg);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
  // Clear the chat input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// outputs message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add roomname to dom
function outputRoomName(room) {
  const text = document.createTextNode(room);
  roomName.innerHTML = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        user => `
      <li>
        ${user.username}
      </li>
    `
      )
      .join("")}
  `;
}
