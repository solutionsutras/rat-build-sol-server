const {UnitModel} = require('../models/units');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const unitList = await UnitModel.find().populate('item');
    if(!unitList){
        res.status(500).json({success:false})
    }
    res.status(200).send(unitList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const unit = await UnitModel.findById(req.params.id).populate('item');
    if(!unit){
        res.status(500).json({success:false, message:'The Measurement Unit with the given ID not found!'})
    }
    res.status(200).send(unit);
})

// GET BY ITEM ID
router.get('/getbyitem/:itemid', async (req,res)=>{
    const unit = await UnitModel.find({"item":req.params.itemid}).populate('item');
    if(!unit){
        res.status(500).json({success:false, message:'The Measurement Unit with the given Item ID not found!'})
    }
    res.status(200).send(unit);
})

// POST
router.post(`/`, async (req,res)=>{
    let unit= new UnitModel({
        item: req.body.item,
        unitName: req.body.unitName
    })
    unit = await unit.save();

    if(!unit){
        return res.status(400).send('the Measurement Unit cannot be created!')
    }

    res.send(unit);
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const unit = await UnitModel.findByIdAndUpdate(
        req.params.id,
        {
            item: req.body.item,
            unitName: req.body.unitName
        },
        {new:true}
    )
    if(!unit){
        return res.status(400).send('the Measurement Unit cannot be updated!')
    }

    res.send(unit);
})

// DELETE
router.delete('/:id', (req,res)=>{
    UnitModel.findByIdAndRemove(req.params.id).then(unit=>{
        if(unit){
            return res.status(200).json({success:true,message: 'the Measurement Unit is deleted'})
        } else {
            return res.status(404).json({success:false,message: 'the Measurement Unit not found!'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
})

module.exports = router;