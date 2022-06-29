const mongoose = require('mongoose');
const { Schema } = mongoose;
const unitsSchema = Schema({
    unitName:{
        type: String,
        required: true,
    }
});

unitsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

unitsSchema.set('toJSON', {
    virtuals:true,
});

exports.UnitModel = mongoose.model('Units', unitsSchema)