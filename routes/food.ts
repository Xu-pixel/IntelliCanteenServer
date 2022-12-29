import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Food from '../models/food.ts'
const router = new Router()
export default router

router.get('/', async ({ response }) => {
    response.body = await Food.find()
})

router.post('/', jwtGuard, waiterGuard, async ({ request, response }) => {
    try {
        const food = await request.body().value
        await Food.create(food)
        response.body = food
    } catch (e) {
        console.log(e.errors)
        response.status = Status.BadRequest
    }
})

router.delete('/:id', jwtGuard, waiterGuard, async ({ response, params }) => {
    try {
        const food = await Food.findByIdAndDelete(params.id)
        response.body = {
            message: "删除成功",
            food
        }
    } catch (e) {
        response.body = {
            message: e.message
        }
        response.status = Status.BadRequest
    }
})


router.put('/:id', jwtGuard, waiterGuard, async ({ request, response, params }) => {
    try {
        const food = await request.body().value
        await Food.findByIdAndUpdate(params.id, food)

        response.body = {
            message: "修改成功",
            food: await Food.findById(params.id)
        }
    } catch (e) {
        response.body = {
            message: e.message
        }
        response.status = Status.BadRequest
    }
})