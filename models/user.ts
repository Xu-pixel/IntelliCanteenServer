import { model, Schema } from 'npm:mongoose@~6.7';

const userSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    passwd: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'waiter', 'customer']
    }
})

export default model('User', userSchema)