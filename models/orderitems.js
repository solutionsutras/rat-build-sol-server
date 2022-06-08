const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderItemsSchema = Schema({
    item:{
        type: Schema.Types.ObjectId,
        ref: "Item_Details"
    },
    quantity:{
        type: Number,
        required: true,
    }
})

orderItemsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

orderItemsSchema.set('toJSON', {
    virtuals:true,
});

exports.OrderItems = mongoose.model('OrderItems', orderItemsSchema)