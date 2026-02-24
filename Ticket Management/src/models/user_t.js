const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    role : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'role_t',
        required : true
    }
},{timestamps: true});

module.exports = mongoose.model('User_t', userSchema);