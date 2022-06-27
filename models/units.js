const mongoose = require('mongoose');
const { Schema } = mongoose;
const unitsSchema = Schema({
    item:{
        type: Schema.Types.ObjectId,
        ref: "Item_Details",
        required: true,
    },
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