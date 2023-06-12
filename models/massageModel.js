const mongoose = require('mongoose');

const massageSchema = new mongoose.Schema({

    message:{

        text: {
            type: String,
            required: true
        },
    },

    users : Array,

    flag : {
        type: String,
        required: true
    },

    sender:{
        type : mongoose.Schema.Types.ObjectId,
        //type : String,
        ref:"User",
        required : true
    }, 

    },

    {
        timestamps : true,
    }     
);


module.exports = mongoose.model('Massages', massageSchema);