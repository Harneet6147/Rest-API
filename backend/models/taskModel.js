const mongoose = require('mongoose');

const taskModel = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'

    },
    text: {
        type: String,
        required: [true, 'Please Enter a valid text']
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Task', taskModel);