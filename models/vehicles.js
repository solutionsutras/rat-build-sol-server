const mongoose = require('mongoose');
const { Schema } = mongoose;
const vehiclesSchema = Schema({
    regNo:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true,
    },
    capacityInFoot:{
        type: String,
        required: true,
    },
    capacityInCm:{
        type: String,
        required: true,
    },
    capacityInTon:{
        type: String,
        required: true,
    },
    tollTax:{
        type: String,
    }
});

vehiclesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

vehiclesSchema.set('toJSON', {
    virtuals:true,
});

exports.VehiclesModel = mongoose.model('vehicles', vehiclesSchema)