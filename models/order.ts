import { model, Schema, SchemaTypes } from 'npm:mongoose@^6.7';

const orderSchema = new Schema({
    customer: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        require: true,
        validate: (v: { role: string; }) => v.role === 'customer'
    },
    waiter: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        require: true,
        validate: (v: { role: string; }) => v.role === 'waiter'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
    updatedAt: Date,
    table: {
        type: SchemaTypes.ObjectId,
        ref: 'Table',
        require: true
    },
    isFinished: {
        type: Number,
        default: 0
    },
    foods: [{
        food: {
            type: SchemaTypes.ObjectId,
            ref: 'Food',
            required: true,
        },
        count: {
            type: Number,
            default: 1,
            min: 1,
            required: true
        }
    }]
})

export default model('Order', orderSchema)