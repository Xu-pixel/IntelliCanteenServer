import { model, Schema, SchemaTypes } from 'npm:mongoose@^6.7';

const foodSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: ['pork', 'beef', 'mutton', 'aquatic', 'soy', 'vegetables', 'eggs', 'main']
    },
    imgs: [String],
    comments: [{
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
            require: true
        },
        content: String,
        likes: Number
    }],
    likes: {
        type: Number,
        default: 0
    }
})

export default model('Food', foodSchema)