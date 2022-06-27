const {ItemQuality} = require('../models/itemquality');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const iqList = await ItemQuality.find();
    if(!iqList){
        res.status(500).json({success:false})
    }
    res.status(200).send(iqList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const iq = await ItemQuality.findById(req.params.id);
    if(!iq){
        res.status(500).json({success:false, message:'The Item Quality with the given ID not found!'})
    }
    res.status(200).send(iq);
})

// POST
router.post(`/`, async (req,res)=>{
    let iq= new ItemQuality({
        qualityName: req.body.qualityName,
        image: req.body.image
    })
    iq = await iq.save();

    if(!iq){
        return res.status(400).send('the Item Quality cannot be created!')
    }

    res.send(iq);
    
    // iq.save().then((creatediq => {
    //     res.status(201).json(creatediq)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const iq = await ItemQuality.findByIdAndUpdate(
        req.params.id,
        {
            qualityName: req.body.qualityName,
            image: req.body.image
        },
        {new:true}
    )
    if(!iq){
        return res.status(400).send('the Item Quality cannot be updated!')
    }

    res.send(iq);
})

// DELETE
router.delete('/:id', (req,res)=>{
    ItemQuality.findByIdAndRemove(req.params.id).then(iq=>{
        if(iq){
            return res.status(200).json({success:true,message: 'the Item Quality is deleted'})
        } else {
            return res.status(404).json({success:false,message: 'the Item Quality not found!'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
})

module.exports = router;