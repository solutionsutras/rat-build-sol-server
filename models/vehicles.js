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
	fuelType:{
		type: String,
	},
	farePerKm:{
		type: Number,
        required: true,
	},
	minFare:{
		type: Number,
        required: true,
	},
    capacityInFoot:{
        type: Number,
        required: true,
    },
    capacityInCm:{
        type: Number,
        required: true,
    },
    capacityInTon:{
        type: Number,
        required: true,
    },
	loadUnloadCost:{
		type: Number,
		default: 0,
	},
	tollApplicable:{
		type: Boolean,
        default: false,
	},
    tollTax:{
        type: Number,
    }
});

vehiclesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

vehiclesSchema.set('toJSON', {
    virtuals:true,
});

exports.VehiclesModel = mongoose.model('Vehicles', vehiclesSchema);