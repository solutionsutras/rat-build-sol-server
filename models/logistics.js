const mongoose = require('mongoose');
const { Schema } = mongoose;
const logisticsSchema = Schema({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicles',
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Orders',
    required: true,
  },
  orderItem: {
    type: Schema.Types.ObjectId,
    ref: 'OrderItems',
    required: true,
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  dateOfBooking: {
    type: Date,
    default: Date.now,
  },
});

logisticsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

logisticsSchema.set('toJSON', {
  virtuals: true,
});

exports.Logistics = mongoose.model('Logistics', logisticsSchema);
