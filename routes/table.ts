import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import Table from '../models/table.ts'
import { jwtGuard } from "../utils/Guards.ts"

const router = new Router()
export default router

//每张桌子的计时器，前端1分钟不请求续占就会释放
const tableTimers = new Map<string, number>()

//添加桌子
router.post('/', async ({ request, response }) => {
    const { sno } = await request.body().value
    try {
        const table = await Table.create({
            sno
        })
        response.body = {
            message: "添加成功",
            table
        }
    } catch {
        throw Error(`添加失败,sno:${sno}的桌子已经存在`)
    }
})

//删除桌子
router.delete('/', async ({ request, response }) => {
    const { sno } = await request.body().value
    await Table.deleteOne({ sno })
    response.body = {
        message: `${sno}号桌子删除成功`
    }
})

//返回所有桌子
router.get('/', async ({ response }) => {
    response.body = await Table.find()
})


//占桌子(前端需要不断请求续占)
router.post('/occupy/:id', jwtGuard, async ({ params, response, state }) => {
    const table = await Table.findById(params.id)
    if (table?.occupiedBy && table.occupiedBy != state.userId) {
        throw Error(`${table.sno} 已有顾客了`)
    }
    table!.occupiedBy = state.userId
    await table?.save()
    clearTimeout(tableTimers.get(table?.id)) // 续占，清除原来的计时器
    tableTimers.set(table?.id, setTimeout(async () => {
        table!.occupiedBy = null  //解除座位
        await table?.save()
        console.log(`${table?.sno} 被解除`)
    }, 60_000))
    response.body = {
        message: `${table?.sno} 使用/续占成功`,
        sno: table?.sno
    }
})

router.post('/leave/:id', jwtGuard, async ({ params, state, response }) => {
    const table = await Table.findById(params.id)
    if (table?.occupiedBy != state.userId) //如果当前座位不是本用户的
        throw Error("该座位不是你的")
    table!.occupiedBy = null
    await table?.save()
    response.body = {
        message: state.userId + "离开座位"
    }
})

