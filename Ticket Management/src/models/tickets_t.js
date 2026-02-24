const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength: 5
    },
    description:{
        type : String,
        required : true,
        minlength : 10
    },
    status:{
        type : String,
        enum : ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'],
        default :'OPEN'
    },
    priority:{
        type : String,
        enum : ['LOW','MEDIUM','HIGH'],
        default : 'MEDIUM'
    },
    created_by:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User_t',
        required : true
    },
    assigned_to:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User_t',
        default : null
    },
},{timestamps: true});

module.exports = mongoose.model('Ticket_t', ticketSchema);