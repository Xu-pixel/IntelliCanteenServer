import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Order from '../models/order.ts'
import { queue } from "../utils/Queue.ts";
const router = new Router()

router.use(jwtGuard)
router.get('/', waiterGuard, async ({ response }) => {
    response.body = await Order.find()
})

router.post('/', async ({ request, response }) => {
    const order = await request.body().value

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

router

export default router