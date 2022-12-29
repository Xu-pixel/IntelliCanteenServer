import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { queue } from "../utils/Queue.ts";
import Waiter from "../utils/Waiter.ts";
import { waiters } from "../utils/Waiters.ts";

const router = new Router()
export default router


router.use(jwtGuard, waiterGuard)
router.get('/deal', async ({ response, state }) => {
    const order = await waiters.get(state.payload.user._id)?.deal()
    if (!order) {
        response.status = Status.NotFound
        return
    }
    response.body = {
        order
    }
})

router.get('/receive', ({ response, state }) => {
    const waiter = waiters.get(state.payload.user._id)
    waiter?.receive()
    if (waiter?.current) {
        response.body = {
            orderId: waiter?.current
        }
    } else {
        response.body = {
            message: "暂时没有订单"
        }
        response.status = Status.NotFound
    }
})

router.get('/rest', jwtGuard, waiterGuard, ({ response, state }) => {
    const id = state.payload.user._id
    queue.push(waiters.get(id)!.current!)
    waiters.delete(id)
    response.body = {
        message: `服务员:${id}开始休息`
    }
})


router.get('/work', jwtGuard, waiterGuard, ({ response, state }) => {
    const id = state.payload.user._id
    if (!waiters.get(id))
        waiters.set(id, new Waiter())
    response.body = {
        message: `服务员:${id}开始工作`
    }
})