import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Order from '../models/order.ts'
import { queue } from "../utils/Queue.ts";
import mongoose from 'npm:mongoose@~6.7';

const router = new Router()
export default router

router.use(jwtGuard)
router.get('/waiter', waiterGuard, async ({ response }) => {
    response.body = await Order.find()
})


router.get('/customer', async ({ response, state }) => {
    response.body = await Order.find({ customer: new mongoose.Types.ObjectId(state.userId) })
})

router.post('/', jwtGuard, async ({ request, response, state }) => {
    const order = await request.body().value
    order.customer = state.userId
    const newOrder = await Order.create(order)
    queue.push(newOrder?.id)
    response.body = {
        message: "订单成功添加",
        newOrder
    }
})

router.delete('/:id', async ({ request, response, state }) => {
    const { _id } = await request.body().value
    const order = await Order.findById(_id)
    if (order?.isFinished)
        throw Error("订单已经完成")
    if (order?.customer != state.userId)
        throw Error("这不是你的订单")
    queue.deleteOrder(_id)//队列里的订单删除
    response.body = await Order.findByIdAndDelete({ _id }) //数据库里的订单删除
})