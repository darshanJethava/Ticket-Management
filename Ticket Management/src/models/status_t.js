const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    ticket : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Ticket_t',
        required : true
    },
    oldStatus : {
        type : String,
        enum : ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'],
        required : true
    },
    newStatus : {
        type : String ,
        enum : ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'],
        required : true
    },
    changedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_t',
        required: true
    }
},{timestamps : true});

module.exports = mongoose.model('Status_t', statusSchema);