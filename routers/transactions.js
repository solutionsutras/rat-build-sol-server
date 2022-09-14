const {Users} = require('../models/users')
const { Transactions } = require('../models/transactions');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET
router.get(`/`, async (req, res) => {
  const transactionsList = await Transactions.find().populate('user');
  if (!transactionsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(transactionsList);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const transaction = await Transactions.findById(req.params.id).populate(
    'user'
  );
  if (!transaction) {
    res.status(500).json({
      success: false,
      message: 'The transaction with the given ID not found!',
    });
  }
  res.status(200).send(transaction);
});

// GET BY USER
router.get('/getbyuser/:user', async (req, res) => {
  const transactionsList = await Transactions.find({
    user: req.params.user,
  }).populate('user');
  if (!transactionsList) {
    res.status(500).json({
      success: false,
      message: 'No transactions found for the selected user!',
    });
  }
  res.status(200).send(transactionsList);
});

// GET BY DATE RANGE
router.get('/getbydate/:fromdate/:todate', async (req, res) => {
  const transactionsList = await Transactions.find({
    transactionDate: { $gte: parseInt(req.params.fromdate) },
    capacityInFoot: { $lte: parseInt(req.params.todate) },
  }).populate('user');
  if (!transactionsList) {
    res.status(500).json({
      success: false,
      message: 'No transactions found for the selected date range!',
    });
  }
  res.status(200).send(transactionsList);
});

// GET COUNT
router.get('/get/count', async (req, res) => {
    const transactionsCount = await Transactions.countDocuments()
    if (!transactionsCount) {
      res.status(500).json({ success: false });
    }
    res.send({ transactionsCount: transactionsCount });
})

// POST
router.post('/', async (req, res) => {
  const chksUser = await Users.findById(req.body.user);
  if (!chksUser) return res.status(400).send('Invalid user selected');

  let transction = new Transactions({
    transactionNo: req.body.transactionNo,
    transactionType: req.body.transactionType,
    amount: req.body.amount,
    remarks: req.body.remarks,
    user: req.body.user,
  });
  transction = await transction.save();

  if (!transction) {
    return res.status(400).send('the transaction record cannot be created!');
  }

  res.send(transction);
});

// GET COUNT
router.get('/get/count', async (req, res) => {
  const transactionCount = await Transactions.countDocuments();
  if (!transactionCount) {
    res.status(500).json({ success: false });
  }
  res.send({ transactionCount: transactionCount });
});

// DELETE
router.delete('/:id', (req, res) => {
  Transactions.findByIdAndRemove(req.params.id)
    .then((tran) => {
      if (tran) {
        return res
          .status(200)
          .json({ success: true, message: 'the transaction is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'the transaction not found!' });
      }
    })
    .catch((err) => {
      return res.status.apply(400).json({ success: false, error: err });
    });
});

module.exports = router;
