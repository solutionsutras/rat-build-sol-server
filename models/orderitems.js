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
  vehicle: [
    {
      kmWiseFare: {
        type: Number,
        required: true,
      },
      minTripDistance: {
        type: Number,
        required: true,
      },
      quantityByThisVehicle: {
        type: Number,
        required: true,
      },
      requiredNoOfTrips: {
        type: Number,
        required: true,
      },
      selectedUnitName: {
        type: String,
        required: true,
      },
      selectedVehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicles',
        required: true,
      },
      totalTransportationCost: {
        type: Number,
        required: true,
      },
      tripDistance: {
        type: Number,
        required: true,
      },
      unitTransportationCost: {
        type: Number,
        required: true,
      },
    },
  ],
  fromLocationCode: {
    type: String,
  },
  toLocationCode: {
    type: String,
  },
  minTripDistance: {
    type: Number,
  },
  tripDistance: {
    type: Number,
    required: true,
  },
  requiredNoOfTrips: {
    type: Number,
    required: true,
  },
  itemTotalTransportationCost: {
    type: Number,
    required: true,
  },
  discountPercent: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  itemTotal: {
    type: Number,
    required: true,
  },
  logistics: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Logistics',
    },
  ],
  quantityShipped: {
    type: Number,
    required: true,
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'OrderStatus',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
  lastUpdatedByUser: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
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
