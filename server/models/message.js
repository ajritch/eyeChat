var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	name: {type: String},
	chat: {type: String},
	alert: {type: String},
	room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'}
}, {timestamps: true});

mongoose.model('Message', MessageSchema);