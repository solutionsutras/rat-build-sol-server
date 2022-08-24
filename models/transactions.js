const mongoose = require('mongoose');
const { Schema } = mongoose;
const transactionsSchema = Schema({
  transactionNo: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  transactionType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    default: '',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  }
});

transactionsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

transactionsSchema.set('toJSON', {
    virtuals:true,
});

exports.Transactions = mongoose.model('Transactions', transactionsSchema);