import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Order from '../models/order.ts'
import { queue } from "../utils/Queue.ts";
import mongoose from 'npm:mongoose@^6.7';

const router = new Router()

router.use(jwtGuard)
router.get('/waiter', waiterGuard, async ({ response }) => {
    response.body = await Order.find()
})


router.get('/customer', async ({ response, state }) => {
    response.body = await Order.find({ customer: new mongoose.Types.ObjectId(state.payload.user._id) })
})

router.post('/', jwtGuard, async ({ request, response, state }) => {
    const order = await request.body().value
    order.customer = state.payload.user._id
    try {
        const newOrder = await Order.create(order)
        queue.push(newOrder?.id)
        response.body = {
            message: "订单成功添加",
            newOrder
        }
    } catch (e) {
        console.log(e)
    }

})

router.delete('/:id', async ({ request, response }) => {
    try {
        const { _id } = await request.body().value
        const order = await Order.findById(_id)
        if (order?.isFinished) {
            response.body = {
                message: "订单已经完成"
            }
            response.status = Status.BadRequest
            return
        }
        queue.deleteOrder(_id)//队列里的订单删除
        await Order.findByIdAndDelete({ _id }) //数据库里的订单删除
        response.body
    } catch (e) {
        response.body = {
            message: e.message
        }
        response.status = Status.BadRequest
    }
})


export default router