const mongoose = require('mongoose');
const itemqualitySchema = mongoose.Schema({
    qualityName:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default:'',
    },
});

itemqualitySchema.virtual('id').get(function() {
    return this._id.toHexString();
});

itemqualitySchema.set('toJSON', {
    virtuals:true,
});

exports.ItemQuality = mongoose.model('ItemQualities', itemqualitySchema)