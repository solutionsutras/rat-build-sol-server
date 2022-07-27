const mongoose = require('mongoose');
const { Schema } = mongoose;
const smsSchema = Schema({
    sender_id:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    route:{
        type: String,
        required: true,
    },
    numbers:{
        type: String,
        required: true,
    },
});

smsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

smsSchema.set('toJSON', {
    virtuals:true,
});

exports.SmsModel = mongoose.model('sms', smsSchema)