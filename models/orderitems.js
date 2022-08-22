const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderItemsSchema = Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item_Details',
  },
  selectedUnit: {
    type: Schema.Types.ObjectId,
    ref: 'Units',
  },
  unitName: {
    type: String,
  },
  rate: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  materialCost: {
    type: Number,
    required: true,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicles',
  },
  fromLocationCode: {
    type: String,
  },
  toLocationCode: {
    type: String,
  },
  tripDistance: {
    type: Number,
    required: true,
  },
  transportationCost: {
    type: Number,
    required: true,
  },
  itemTotal: {
    type: Number,
    required: true,
  },
});

orderItemsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderItemsSchema.set('toJSON', {
  virtuals: true,
});

exports.OrderItems = mongoose.model('OrderItems', orderItemsSchema);
