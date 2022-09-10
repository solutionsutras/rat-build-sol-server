const { OrderItems } = require('../models/orderitems');
const { Logistics } = require('../models/logistics');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET ALL
router.get(`/`, async (req, res) => {
  const orderItemsList = await OrderItems.find()
    .populate({ path: 'item', populate: 'itemCategory quality' })
    .populate('selectedUnit vehicle')
    // .populate({
    //   path: 'logistics',
    // });
    .exec();

  if (!orderItemsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(orderItemsList);
});

// GET BY ID
router.get(`/:id`, async (req, res) => {
  const orderItem = await OrderItems.findById(req.params.id)
    .populate({ path: 'item', populate: 'itemCategory quality' })
    .populate('selectedUnit vehicle')
    // .populate({
    //   path: 'logistics',
    // });

  if (!orderItem) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(orderItem);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const orderItem = await OrderItems.findByIdAndUpdate(
    req.params.id,
    {
      logistics: req.body.logistics,
    },
    { new: true }
  );
  if (!orderItem) {
    return res
      .status(400)
      .send('Error while updating Order Item details in order items!');
  }

  res.send(orderItem);
});

// DELETE
router.delete('/:id', (req, res) => {
  OrderItems.findByIdAndRemove(req.params.id)
    .then((orderItem) => {
      if (orderItem) {
        return res
          .status(200)
          .json({ success: true, message: 'the Order Item record is deleted' });
      } else {
        return res
          .status(404)
          .json({
            success: false,
            message: 'the Order Item record not found!',
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
