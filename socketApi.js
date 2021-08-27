const io = require('socket.io')();
const socketApi = {
	io: io
};

// const botName = 'Server';
const users = {};

const { format } = require('date-fns')

io.on('connection', (socket) => {
	socket.on('new-user', (name, time) => {
		users[socket.id] = name;
		time = format(new Date(), 'HH:mm');
		socket.broadcast.emit('user-connected', name, time);
	});

	socket.on('send-chat-message', (message) => {
		io.emit('chat-message', {
			message: message,
			name: users[socket.id],
			time: format(new Date(), 'HH:mm')
	});
	});

	socket.on('disconnect', (time) => {
		time = format(new Date(), 'HH:mm');;
		io.emit('user-disconnected', users[socket.id], time);
		delete users[socket.id];
	});

});

module.exports = socketApi;
