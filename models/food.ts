import { model, Schema } from 'npm:mongoose@^6.7';

const foodSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    type: {
        type: String,
        enum: {
            values: ['pork', 'beef', 'mutton', 'aquatic', 'soy', 'vegetables', 'eggs', 'main'],
            message: "你这啥类型"
        }
    },
    img: String,
    price: Number
})

export default model('Food', foodSchema)