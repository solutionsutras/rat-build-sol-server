const mongoose = require('mongoose');
const { Schema } = mongoose;
const ordersSchema = Schema({
  orderItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'OrderItems',
      required: true,
    },
  ],
  billingAddress: {
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  shippingAddress: {
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'OrderStatus',
  },
  totalPrice: {
    type: Number,
  },
  advanceToPay: {
    type: Number,
    default: 0,
  },
  advancePaid: {
    type: Number,
    default: 0,
  },
  balanceToPay: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transactions',
    },
  ],
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
  },
  lastUpdatedByUser: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
});

ordersSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

ordersSchema.set('toJSON', {
    virtuals:true,
});

exports.Orders = mongoose.model('Orders', ordersSchema)