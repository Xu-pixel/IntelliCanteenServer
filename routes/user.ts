import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import User from '../models/user.ts'
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { key } from '../utils/jwt.ts'

const router = new Router()
export default router


router.post('/register', async ({ request, response }) => {
    const { name, passwd, role } = await request.body().value
    if (await User.findOne({ name })) {
        response.body = {
            message: "用户名已被使用"
        }
        response.status = Status.BadRequest
        return
    }
    try {
        const newUser = new User({
            name,
            passwd,
            role
        })
        console.log(newUser.toObject())
        response.body = await newUser.save()
    } catch (e) {
        console.log(e)
        response.status = Status.BadRequest
    }
})

router.post('/login', async ({ request, response }) => {
    const { name, passwd } = await request.body().value
    const user = await User.findOne({ name })
    if (user?.passwd === passwd) {
        const jwt = await create({ alg: "HS512", typ: "JWT" }, { user }, key);
        response.body = {
            message: "登录成功",
            jwt
        }
    }
    else {
        response.body = {
            message: "密码错误"
        }
        response.status = Status.BadRequest
    }
})


router.get('/', async ({ response }) => {
    response.body = await User.find()
})

