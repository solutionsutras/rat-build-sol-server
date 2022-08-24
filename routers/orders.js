const { OrderItems } = require('../models/orderitems');
const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET
router.get(`/`, async (req, res) => {
  const ordersList = await Orders.find()
    .populate({
      path: 'orderItems',
      model: 'OrderItems',
      polulate: 'selectedUnit',
      populate: {
        path: 'item',
        populate: 'itemCategory quality',
      },
    })
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });

  if (!ordersList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(ordersList);
});

// GET BY ID
router.get(`/:id`, async (req, res) => {
  const singleOrder = await Orders.findById(req.params.id)
    .populate({
      path: 'orderItems',
      populate: {
        path: 'item',
        populate: 'itemCategory quality',
      },
    })
    .populate('user', 'name');

  if (!singleOrder) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(singleOrder);
});

// GET ORDERS BY USER
router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrdersList = await Orders.find({ user: req.params.userid })
    .populate({
      path: 'orderItems',
      populate: {
        path: 'item',
        populate: 'itemCategory',
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrdersList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userOrdersList);
});

// POST
router.post(`/`, async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItems({
        item: orderItem.item,
        selectedUnit: orderItem.selectedUnit,
        unitName: orderItem.unitName,
        rate: orderItem.rate,
        quantity: orderItem.qty,
        materialCost: orderItem.materialCost,
        vehicle: orderItem.vehicle,
        fromLocationCode: orderItem.fromLocationCode,
        toLocationCode: orderItem.toLocationCode,
        tripDistance: orderItem.tripDistance,
        transportationCost: orderItem.transportationCost,
        itemTotal: orderItem.itemTotal,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  // console.log(orderItemsIds);

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItems.findById(orderItemId);
      const totalPrice = orderItem.itemTotal;
      return totalPrice;
    })
  );

  const totalPriceSummed = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Orders({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    state: req.body.state,
    pin: req.body.pin,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPriceSummed,
    transactions: req.body.transactions,
    discountPercent: req.body.discountPercent,
    advanceToPay: req.body.advanceToPay,
    advancePaid: req.body.advancePaid,
    balanceToPay: req.body.balanceToPay,
    user: req.body.user,
  });

  order = await order.save();

  if (!order) {
    return res.status(400).send('the order cannot be created!');
  }

  res.send(order);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      discountPercent: req.body.discountPercent,
      advancePaid: req.body.advancePaid,
      balanceToPay: req.body.balanceToPay,
    },
    { new: true }
  );
  if (!order) {
    return res.status(400).send('the order cannot be updated!');
  }

  res.send(order);
});

// DELETE
router.delete('/:id', (req, res) => {
  Orders.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItems.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: 'the order is deleted' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'the order not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// GET TOTAL SALES
router.get('/get/totalsales', async (req, res) => {
  const totalSales = await Orders.aggregate([
    { $group: { _id: null, totalSalesAmount: { $sum: '$totalPrice' } } },
  ]);

  if (!totalSales) {
    return res.status(400).send('unable to generate the total sales!');
  }

  res.send({ totalSalesAmount: totalSales.pop().totalSalesAmount });
});

// GET ORDER COUNT
router.get('/get/count', async (req, res) => {
  const ordersCount = await Orders.countDocuments();
  if (!ordersCount) {
    res.status(500).json({ success: false });
  }
  res.send({ ordersCount: ordersCount });
});

module.exports = router;
