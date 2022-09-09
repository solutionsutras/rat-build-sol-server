const {Logistics} = require('../models/logistics');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const logisticsList = await Logistics.find();
    if (!logisticsList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(logisticsList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const logistic = await Logistics.findById(req.params.id);
    if (!logistic) {
      res.status(500).json({
        success: false,
        message: 'The Logistics record with the given ID not found!',
      });
    }
    res.status(200).send(logistic);
})

// POST
router.post(`/`, async (req,res)=>{
    let logistic = new Logistics({
      vehicles: req.body.vehicles,
      order: req.body.order,
      orderItem: req.body.orderItem,
    });
    logistic = await logistic.save();

    if (!logistic) {
      return res.status(400).send('the Logistic record cannot be created!');
    }

    res.send(logistic);
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const logistic = await Logistics.findByIdAndUpdate(
      req.params.id,
      {
        vehicles: req.body.vehicles,
        order: req.body.order,
        orderItem: req.body.orderItem,
      },
      { new: true }
    );
    if (!logistic) {
      return res.status(400).send('the Logistic record cannot be updated!');
    }

    res.send(logistic);
})

// DELETE
router.delete('/:id', (req,res)=>{
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
})

module.exports = router;