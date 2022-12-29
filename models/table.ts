import { model, Schema, SchemaTypes } from 'npm:mongoose@^6.7';

const tableSchema = new Schema({
    sno: {
        type: Number,
        require: true,
        unique: true
    },
    occupiedBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        default: null
    }
})

export default model('Table', tableSchema)