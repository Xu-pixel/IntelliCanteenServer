import { queue } from "./Queue.ts";
import Order from '../models/order.ts'

export default class Waiter {
    private _current: string | undefined = undefined

    receive() {
        if (this._current) return
        this._current = queue.pop()
    }

    async deal(waiterId: string) {
        if (this._current) {
            const order = await Order.findByIdAndUpdate(this._current, { isFinished: 1, waiter: waiterId })
            this._current = undefined
            return order
        }
    }

    get current() {
        return this._current
    }
}