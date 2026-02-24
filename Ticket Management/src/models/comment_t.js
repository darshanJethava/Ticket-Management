const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
ticket:{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Ticket_t',
    required : true
},
user:{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User_t',
    required : true
},
content:{
    type : String,
    required:true,
    minlength: 1
}
},{timestamps : true});

module.exports = mongoose.model('Comment_t', commentSchema);
