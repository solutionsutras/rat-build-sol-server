const mongoose = require('mongoose');
const { Schema } = mongoose;
const ordersSchema = Schema({    
    orderItems:[{
        type: Schema.Types.ObjectId,
        ref:'OrderItems',
        required: true,
    }],
    shippingAddress1:{
        type: String,
        required: true,
    },
    shippingAddress2:{
        type: String,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    pin:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice:{
        type: Number,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'Users',
        required: true,
    },
    dateOrdered:{
        type: Date,
        default: Date.now,
    },
});

ordersSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

ordersSchema.set('toJSON', {
    virtuals:true,
});

exports.Orders = mongoose.model('Orders', ordersSchema)