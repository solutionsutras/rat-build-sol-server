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
      populate: [
        { path: 'item', populate: 'itemCategory quality' },
        { path: 'selectedUnit' },
        { path: 'vehicle', populate: 'selectedVehicle'},
        { path: 'status' },
      ],
    })
    .populate('status')
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
      model: 'OrderItems',
      populate: [
        { path: 'item', populate: 'itemCategory quality' },
        { path: 'selectedUnit' },
        { path: 'vehicle', populate: 'selectedVehicle' },
        { path: 'status' },
      ],
    })
    .populate('status')
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
      model: 'OrderItems',
      populate: [
        { path: 'item', populate: 'itemCategory quality' },
        { path: 'selectedUnit' },
        { path: 'vehicle', populate: 'selectedVehicle' },
        { path: 'status' },
      ],
    })
    .populate('status')
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
        quantityShipped: 0,
        materialCost: orderItem.materialCost,
        vehicle: orderItem.vehicle,
        fromLocationCode: orderItem.fromLocationCode,
        toLocationCode: orderItem.toLocationCode,
        minTripDistance: orderItem.minTripDistance,
        tripDistance: orderItem.tripDistance,
        requiredNoOfTrips: orderItem.requiredNoOfTrips,
        itemTotalTransportationCost: orderItem.itemTotalTransportationCost,
        discountPercent: orderItem.discountPercent,
        discountAmount: orderItem.discountAmount,
        itemTotal: orderItem.itemTotal,
        status: req.body.status,
        user: req.body.user,
        lastUpdated: req.body.lastUpdated,
        lastUpdatedByUser: req.body.lastUpdatedByUser,
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
    billingAddress: req.body.billingAddress,
    shippingAddress: req.body.shippingAddress,
    status: req.body.status,
    totalPrice: totalPriceSummed,
    advanceToPay: req.body.advanceToPay,
    advancePaid: req.body.advancePaid,
    balanceToPay: req.body.balanceToPay,
    transactions: req.body.transactions,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
    lastUpdated: req.body.lastUpdated,
    lastUpdatedByUser: req.body.lastUpdatedByUser,
  });

  order = await order.save();

  if (!order) {
    return res.status(400).send('the order cannot be created!');
  }

  res.send(order);
});

// UPDATE ORDER STATUS
router.put('/changestatus/:id', async (req, res) => {
  const orderItems = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      const singleOrderItem = await OrderItems.findByIdAndUpdate(
        orderItem.id,
        {
          status: req.body.status,
          lastUpdated: req.body.lastUpdated,
          lastUpdatedByUser: req.body.user,
        },
        { new: true }
      );
      if (!singleOrderItem) {
        return res.status(400).send('Error while updating order item status!');
      }
      return singleOrderItem;
    })
  );

  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      lastUpdated: req.body.lastUpdated,
      lastUpdatedByUser: req.body.user,
    },
    { new: true }
  );
  if (!order) {
    return res.status(400).send('Error while updating order status!');
  }

  res.send(order);
});

// // UPDATE SINGLE ORDER ITEM STATUS
// router.put('/changestatus/:id', async (req, res) => {
//   const orderItems = Promise.all(
//     req.body.orderItems.map(async (orderItem) => {

//       const singleOrderItem = await OrderItems.findByIdAndUpdate(
//         orderItem.id,
//         {
//           status: req.body.status,
//           lastUpdated: req.body.lastUpdated,
//           lastUpdatedByUser: req.body.user,
//         },
//         { new: true }
//       );
//       if (!singleOrderItem) {
//         return res.status(400).send('Error while updating order item status!');
//       }

//       // res.send(singleOrderItem);
//       return singleOrderItem;
//     })
//   );

//   const order = await Orders.findByIdAndUpdate(
//     req.params.id,
//     {
//       status: req.body.status,
//       lastUpdated: req.body.lastUpdated,
//       lastUpdatedByUser: req.body.user,
//     },
//     { new: true }
//   );
//   if (!order) {
//     return res.status(400).send('Error while updating order status!');
//   }

//   res.send(order);
// });

// UPDATE TRANSACTION
router.put('/transaction/:id', async (req, res) => {
  const order = await Orders.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      advancePaid: req.body.advancePaid,
      balanceToPay: req.body.balanceToPay,
      transactions: req.body.transactions,
      lastUpdated: req.body.lastUpdated,
      lastUpdatedByUser: req.body.user,
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
  if (!ordersCount && ordersCount !== 0) {
    res.status(500).json({ success: false });
  }
  res.send({ ordersCount: ordersCount });
});

module.exports = router;
