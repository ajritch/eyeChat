var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
	name: {type: String, unique: true},
	messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
}, {timestamps: true});

mongoose.model('Room', RoomSchema);