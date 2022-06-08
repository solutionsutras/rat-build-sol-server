const mongoose = require('mongoose');
const { Schema } = mongoose;
const itemsSchema = Schema({
    itemId: {
        type: Number,
    },
    itemCategory:{
        type: Schema.Types.ObjectId,
        ref:'Categories',
        required: true,
    } ,
    itemName:{
        type: String,
        required: true,
    },
    itemDesc:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    unit:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    discountPercent:{
        type: Number,
        required: false,
        default: 0,
    },
    isFeatured:{
        type:Boolean,
        default:false,
    },
    dateCreated:{
        type:Date,
        default: Date.now,
    },
	isAvailable:{
        type:Boolean,
        default:true,
    },
	numOfReviews:{
		type:Number,
		default:0,
	},
	ratings:{
		type:Number,
		default:0,
	},
});

itemsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

itemsSchema.set('toJSON', {
    virtuals:true,
});

exports.Item_Details = mongoose.model('Item_Details', itemsSchema)