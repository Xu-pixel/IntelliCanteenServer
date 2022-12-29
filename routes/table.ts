import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
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
    } catch (e) {
        console.log(e)
        response.body = {
            message: `添加失败,sno:${sno}的桌子已经存在`
        }
        response.status = Status.BadRequest
    }
})

//删除桌子
router.delete('/', async ({ request, response }) => {
    try {
        const { sno } = await request.body().value
        await Table.deleteOne({ sno })
        response.body = {
            message: `${sno}号桌子删除成功`
        }
    } catch (e) {
        response.body = {
            message: e.message
        }
        response.status = Status.BadRequest
    }
})

//返回所有桌子
router.get('/', async ({ response }) => {
    response.body = await Table.find()
})


//占桌子(前端需要不断请求续占)
router.post('/occupy', jwtGuard, async ({ response, request, state }) => {
    const { sno } = await request.body().value
    try {
        const table = await Table.findOne({ sno })
        if (table?.occupiedBy) {
            response.body = {
                message: `${table.sno} 已有顾客了`
            }
            return
        }
        table!.occupiedBy = state.payload.user._id
        await table?.save()
        clearTimeout(tableTimers.get(table?.id)) // 续占，清除原来的计时器
        tableTimers.set(table?.id, setTimeout(async () => {
            table!.occupiedBy = null  //解除座位
            await table?.save()
            console.log(`${table?.sno} 被解除`)
        }, 60_000))
        response.body = {
            message: `${table?.sno} 使用成功`
        }
    } catch (e) {
        response.body = {
            message: e.name + ':' + e.message
        }
        response.status = Status.BadRequest
    }
})

router.post('leave', jwtGuard)

