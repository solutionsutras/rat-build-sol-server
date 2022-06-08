const mongoose = require('mongoose');
const categoriesSchema = mongoose.Schema({
    categName:{
        type: String,
        required: true,
    } ,
    icon:{
        type: String,
        default:'',
    },
    image:{
        type: String,
        default:'',
    }
    
});

categoriesSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

categoriesSchema.set('toJSON', {
    virtuals:true,
});

exports.Categories = mongoose.model('Categories', categoriesSchema)