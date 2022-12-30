import { jwtGuard, waiterGuard } from "../utils/Guards.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Food from '../models/food.ts'
const router = new Router()
export default router

router.get('/', async ({ response }) => {
    response.body = await Food.find()
})

router.post('/', jwtGuard, waiterGuard, async ({ request, response }) => {
    const food = await request.body().value
    await Food.create(food)
    response.body = food
})

router.delete('/:id', jwtGuard, waiterGuard, async ({ response, params }) => {
    const food = await Food.findByIdAndDelete(params.id)
    if (!food) throw new Error('食物不存在')
    response.body = {
        message: "删除成功",
    }
})


router.put('/:id', jwtGuard, waiterGuard, async ({ request, response, params }) => {
    const food = await request.body().value
    await Food.findByIdAndUpdate(params.id, food)
    const newFood = await Food.findById(params.id)
    if (!newFood) throw new Error('食物不存在')
    response.body = {
        message: "修改成功",
        food: newFood
    }
})