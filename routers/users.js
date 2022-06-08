const {Users} = require('../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET
router.get(`/`, async (req,res)=>{
    const userList = await Users.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success:false})
    }
    res.status(200).send(userList);
})

// GET BY ID
router.get('/:id', async (req,res)=>{
    const user = await Users.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(500).json({success:false, message:'The uesr with the given ID not found!'})
    }
    res.status(200).send(user);
})

// POST
router.post(`/register`, async (req,res)=>{
    let user= new Users({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        city: req.body.city,
        pin: req.body.pin,
        state: req.body.state,
        country: req.body.country,
        avtar: req.body.avtar,

    })
    user = await user.save();

    if(!user){
        return res.status(400).send('the user cannot be created!')
    }

    res.send(user);
})

//LOGIN

router.post('/login', async (req, res)=>{
    const user = await Users.findOne({email:req.body.email});
    const secret = process.env.secret;
    if(!user){
        res.status(400).send('The uesr not found!!!')
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            secret,
            {expiresIn:'1d'}
        )
        res.status(200).send({email:user.email, token: token})
    }else{
        res.status(400).send('wrong password entered!!!')
    }
})

// GET COUNT
router.get('/get/count', async (req,res)=>{
    const userCount = await Users.countDocuments()
    if(!userCount){
        res.status(500).json({success:false})
    }
    res.send({userCount:userCount});
})

// DELETE
router.delete('/:id', (req,res)=>{
    Users.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true,message: 'the user is deleted'})
        } else {
            return res.status(404).json({success:false,message: 'the user not found!'})
        }
    }).catch(err=>{
        return res.status.apply(400).json({success:false,error:err})
    })
})

module.exports = router;