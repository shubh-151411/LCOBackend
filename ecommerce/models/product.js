const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide product name"],
        trim: true,
        maxLength: [120, "Please provide valid productname"]
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        maxLength: [5, "Please provide valid price"]
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],

        maxLength: [200, "Please provide valid productname"]
    },
    photos: [{
        id: {
            type: String,
            required: [true, "photo id required"]
        },
        url: {
            type: String,
            required: [true, "photo url required"]

        }
    }],
    category: {
        type: String,
        required: [true, "Please select category from short-sleeves,long-sleeves,sweat-shirts,hoodies"],
        enum: {
            values: ['shortSleeves', 'longSleeves', 'sweatShirts', 'hoodies'],
            message: "Please select category from short-sleeves,long-sleeves,sweat-shirts,hoodies"
        }
    },
    brand: {
        type: String,
        required: [true, "Please provide product branc"],

    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
      {  user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,

        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }}
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);