const mongoose = require('mongoose');

const role_t = new mongoose.Schema({
    name:{
        type : String,
        enum: ["manager", "support", "user"],
        required : true
    }
});

module.exports = mongoose.model('role_t', role_t);