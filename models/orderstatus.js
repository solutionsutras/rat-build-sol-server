const mongoose = require('mongoose');
const { Schema } = mongoose;	
const orderStatusSchema = mongoose.Schema({
  statusText: {
    type: String,
    required: true,
  },
  statusCode: {
    type: String,
    required: true,
    default: '00',
  },
  colorCode: {
    type: String,
    required: true,
  },
});

orderStatusSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderStatusSchema.set('toJSON', {
  virtuals: true,
});

exports.OrderStatus = mongoose.model('OrderStatus', orderStatusSchema);