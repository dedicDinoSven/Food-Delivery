const socket = io();
const chatMessages = $('.chat-messages');
const chatForm = $('#chat-form');
const messageInput = $('#msg');
const roomName = $('#room-name');
const userList = $('#users');

const botName = 'Server';

socket.emit('new-user', user.fullName);

socket.on('chat-message', (data) => {
	appendMessage(
		`<p class="meta">${data.name}<span> ${data.time}</span></p><p class="text">${data.message}</p>`
	);
	chatMessages.scrollTop(chatMessages[0].scrollHeight);
});

socket.on('user-connected', (name, time) => {
	appendMessage(
		`<p class="meta">${botName}: <span> ${time}</span></p><p class="text">${name} connected</p>`
	);
});

socket.on('user-disconnected', (name, time) => {
	appendMessage(
		`<p class="meta">${botName}: <span> ${time}</span></p><p class="text">${name} disconnected</p>`
	);
});

chatForm.on('submit', (e) => {
	e.preventDefault();
	const message = messageInput.val();
	socket.emit('send-chat-message', message); //emit msg to server
	messageInput.val('');
	messageInput.focus();
});

const appendMessage = (message) => {
	const messageElement = $('<div></div>')
		.addClass('message')
		.html(message)
		.appendTo(chatMessages);
};
