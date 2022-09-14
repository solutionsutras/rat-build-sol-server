const { Logistics } = require('../models/logistics');
const express = require('express');
const { VehiclesModel } = require('../models/vehicles');
const { Orders } = require('../models/orders');
const { OrderItems } = require('../models/orderitems');
const { Users } = require('../models/users');
const router = express.Router();

// GET
router.get(`/`, async (req, res) => {
  const logisticsList = await Logistics.find()
    .populate('vehicle')
    .populate('order')
    // .populate('orderItem')
    // .populate({
    //   path: 'orderItem',
    //   model: 'OrderItems',
    //   populate: [{ path: 'item' }],
    // })
    .populate({
      path: 'orderItem',
      model: 'OrderItems',
      populate: ({ path: 'item', populate: 'quality' }),
    })
    .populate('driver');
  if (!logisticsList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(logisticsList);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const logistic = await Logistics.findById(req.params.id)
    .populate('vehicle')
    .populate('order')
    .populate('orderItem')
    .populate('driver');
  if (!logistic) {
    res.status(500).json({
      success: false,
      message: 'The Logistics record with the given ID not found!',
    });
  }
  res.status(200).send(logistic);
});

// GET COUNT
router.get('/get/count', async (req, res) => {
    const logisticsCount = await Logistics.countDocuments()
    if (!logisticsCount) {
      res.status(500).json({ success: false });
    }
    res.send({ logisticsCount: logisticsCount });
})


// POST
router.post(`/`, async (req, res) => {
  const vehicle = await VehiclesModel.findById(req.body.vehicle);
  if (!vehicle) return res.status(400).send('Invalid Vehicle selected');

  const order = await Orders.findById(req.body.order);
  if (!order) return res.status(400).send('Invalid Order selected');

  const orderItem = await OrderItems.findById(req.body.orderItem);
  if (!orderItem) return res.status(400).send('Invalid Order Item selected');

  const driver = await Users.findById(req.body.driver);
  if (!driver) return res.status(400).send('Invalid Driver selected');

  let logistic = new Logistics({
    vehicle: req.body.vehicle,
    order: req.body.order,
    orderItem: req.body.orderItem,
    driver: req.body.driver,
  });
  logistic = await logistic.save();

  if (!logistic) {
    return res.status(400).send('the Logistic record cannot be created!');
  }

  res.send(logistic);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const vehicle = await VehiclesModel.findById(req.body.vehicle);
  if (!vehicle) return res.status(400).send('Invalid Vehicle selected');

  const order = await Orders.findById(req.body.order);
  if (!order) return res.status(400).send('Invalid Order selected');

  const orderItem = await OrderItems.findById(req.body.orderItem);
  if (!orderItem) return res.status(400).send('Invalid Order Item selected');

  const driver = await Users.findById(req.body.driver);
  if (!driver) return res.status(400).send('Invalid Driver selected');
  
  const logistic = await Logistics.findByIdAndUpdate(
    req.params.id,
    {
      vehicle: req.body.vehicle,
      order: req.body.order,
      orderItem: req.body.orderItem,
      driver: req.body.driver,
    },
    { new: true }
  );
  if (!logistic) {
    return res.status(400).send('the Logistic record cannot be updated!');
  }

  res.send(logistic);
});

// DELETE
router.delete('/:id', (req, res) => {
  Logistics.findByIdAndRemove(req.params.id)
    .then((logistic) => {
      if (logistic) {
        return res
          .status(200)
          .json({ success: true, message: 'the Logistic record is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'the Logistic record not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
