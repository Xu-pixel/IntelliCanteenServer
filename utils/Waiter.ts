import { queue } from "./Queue.ts";
import Order from '../models/order.ts'

export default class Waiter {
    private _current: string | undefined = undefined

    receive() {
        if (this._current) return
        this._current = queue.pop()
    }

    async deal() {
        if (this._current) {
            const order = await Order.findByIdAndUpdate(this._current, { isFinished: 1 })
            return order
        }
    }

    get current() {
        return this._current
    }
}