const {VehiclesModel} = require('../models/vehicles');
const express = require('express');
const router = express.Router();

// GET
router.get(`/`, async (req,res)=>{
    const VehiclesList = await VehiclesModel.find();
    if(!VehiclesList){
        res.status(500).json({success:false})
    }
    res.status(200).send(VehiclesList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const vehicle = await VehiclesModel.findById(req.params.id);
    if(!vehicle){
        res.status(500).json({success:false, message:'The Vehicle with the given ID not found!'})
    }
    res.status(200).send(vehicle);
})

// GET BY VEHICLE BY CAPACITY IN FOOT
router.get('/get/byfoot/:capacity', async (req,res)=>{
    const vehicle = await VehiclesModel.find({ capacityInFoot: { $gte: req.params.capacity } });
    if(!vehicle){
        res.status(500).json({success:false, message:'The Vehicle with the given capcity not found!'})
    }
    res.status(200).send(vehicle);
})

// GET BY VEHICLE BY CAPACITY IN CM
router.get('/get/bycm/:capacity', async (req,res)=>{
    const vehicle = await VehiclesModel.find({ capacityInCm: { $gte: req.params.capacity } });
    if(!vehicle){
        res.status(500).json({success:false, message:'The Vehicle with the given capcity not found!'})
    }
    res.status(200).send(vehicle);
})

// GET BY VEHICLE BY CAPACITY IN TON
router.get('/get/byton/:capacity', async (req,res)=>{
    const vehicle = await VehiclesModel.find({ capacityInTon: { $gte: req.params.capacity } });
    if(!vehicle){
        res.status(500).json({success:false, message:'The Vehicle with the given capcity not found!'})
    }
    res.status(200).send(vehicle);
})

// POST
router.post(`/`, async (req,res)=>{
    let vehicle= new VehiclesModel({
        regNo: req.body.regNo,
        brand: req.body.brand,
        model: req.body.model,
        capacityInFoot: req.body.capacityInFoot,
        capacityInCm: req.body.capacityInCm,
        capacityInTon: req.body.capacityInTon,
        tollTax: req.body.tollTax
    })
    vehicle = await vehicle.save();

    if(!vehicle){
        return res.status(400).send('the Vehicle cannot be created!')
    }

    res.send(vehicle);
})


// UPDATE
router.put('/:id', async (req,res)=>{
    const vehicle = await VehiclesModel.findByIdAndUpdate(
        req.params.id,
        {
            regNo: req.body.regNo,
            brand: req.body.brand,
            model: req.body.model,
            capacityInFoot: req.body.capacityInFoot,
            capacityInCm: req.body.capacityInCm,
            capacityInTon: req.body.capacityInTon,
            tollTax: req.body.tollTax
        },
        {new:true}
    )
    if(!vehicle){
        return res.status(400).send('the Vehicle cannot be updated!')
    }

    res.send(vehicle);
})

// DELETE
router.delete('/:id', (req,res)=>{
    VehiclesModel.findByIdAndRemove(req.params.id).then(vehicle=>{
        if(vehicle){
            return res.status(200).json({success:true,message: 'the Vehicle is deleted'})
        } else {
            return res.status(404).json({success:false,message: 'the Vehicle not found!'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,error:err})
    })
})

module.exports = router;