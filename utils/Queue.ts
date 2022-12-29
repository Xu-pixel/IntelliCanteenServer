import Order from "../models/order.ts"
// @deno-types="npm:@types/lodash"
import _ from "npm:lodash";

class Queue {
    private items: string[] = [] // 订单id

    async init() {
        const unfinishedOrders = JSON.parse(JSON.stringify(await Order.find({ isFinished: 0 }, "_id")))
        for (const order of unfinishedOrders)
            this.push(order._id)
    }

    push(item: string) {
        this.items.push(item)
        console.log(this.items)
    }

    pop() {
        const item = this.items.shift()
        console.log(this.items)
        return item
    }

    deleteOrder(orderId: string): boolean {
        const index = this.items.findIndex(v => v === orderId)
        if (index === -1) return false
        _.remove(this.items, v => v === orderId)
        return true
    }
}


export const queue = new Queue()