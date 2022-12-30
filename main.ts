import { Application, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import mongoose from 'npm:mongoose@^6.7'
import "https://deno.land/std@0.168.0/dotenv/load.ts";
import userRouter from './routes/user.ts'
import foodRouter from './routes/food.ts'
import tableRouter from './routes/table.ts'
import waiterRouter from './routes/waiter.ts'
import orderRouter from './routes/order.ts'
import { queue } from "./utils/Queue.ts";

//数据库连接
await mongoose.connect(Deno.env.get('DATABASE_URI') || 'mongodb://localhost:27017')
console.log('%c Mongodb connected successfully !!', 'color: black; background-color:green')

await queue.init()


// 定义服务器全局变量
export interface State {
    userId: string
    userRole: string
}

// 服务器
const app = new Application<State>();
// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(async ({ response }, next) => {
    try {
        await next()
    } catch (e) {
        response.body = { message: e.message }
        response.status = e.status || Status.BadRequest
    }
})

//路由注册
app.use(userRouter.prefix('/user').routes())
app.use(foodRouter.prefix('/food').routes())
app.use(tableRouter.prefix('/table').routes())
app.use(waiterRouter.prefix('/waiter').routes())
app.use(orderRouter.prefix('/order').routes())
//服务器启动
console.log('Oak 服务器工作在 http://localhost:8000')
await app.listen({ port: 8000 });