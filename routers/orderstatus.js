const {OrderStatus} = require('../models/orderstatus');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const orderStatusList = await OrderStatus.find();
    if(!orderStatusList){
        res.status(500).json({success:false})
    }
    res.status(200).send(orderStatusList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const orderStatus = await OrderStatus.findById(req.params.id);
    if (!orderStatus) {
      res
        .status(500)
        .json({
          success: false,
          message: 'The Order Status with the given ID not found!',
        });
    }
    res.status(200).send(orderStatus);
})

// GET BY ORDER STAUS TEXT
router.get('/getbytext/:text', async (req, res) => {
  const orderStatus = await OrderStatus.find({
    statusText: req.params.text,
  });
  if (!orderStatus) {
    res.status(500).json({
      success: false,
      message: 'No status record found for the selected text!',
    });
  }
  res.status(200).send(orderStatus);
});

// POST
router.post(`/`, async (req,res)=>{
    let orderStatus = new OrderStatus({
      statusText: req.body.statusText,
      statusCode: req.body.statusCode,
      colorCode: req.body.colorCode,
    });
    orderStatus = await orderStatus.save();

    if (!orderStatus) {
      return res.status(400).send('the Order Status cannot be created!');
    }

    res.send(orderStatus);
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const orderStatus = await OrderStatus.findByIdAndUpdate(
      req.params.id,
      {
        statusText: req.body.statusText,
        statusCode: req.body.statusCode,
        colorCode: req.body.colorCode,
      },
      { new: true }
    );
    if (!orderStatus) {
      return res.status(400).send('the Order Status cannot be updated!');
    }

    res.send(orderStatus);
})

// DELETE
router.delete('/:id', (req,res)=>{
    OrderStatus.findByIdAndRemove(req.params.id)
      .then((orderStatus) => {
        if (orderStatus) {
          return res
            .status(200)
            .json({ success: true, message: 'the Order Status is deleted' });
        } else {
          return res
            .status(404)
            .json({ success: false, message: 'the Order Status not found!' });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
})

module.exports = router;