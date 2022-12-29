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