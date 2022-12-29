import { RouterMiddleware } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { key } from "./jwt.ts";
import { Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";


export const jwtGuard: RouterMiddleware<string> = async ({ request, response, state }, next) => {
    const jwt = request.headers.get('Authorization')?.slice(7)
    try {
        const payload = await verify(jwt || '', key);
        state.payload = payload
    } catch (e) {
        console.error(e)
        response.body = "请先登录"
        response.status = Status.Forbidden
        return
    }
    await next()
}

export const waiterGuard: RouterMiddleware<string> = async ({ response, state }, next) => {
    if (state.payload.user.role != 'waiter') {
        response.body = {
            message: "非服务员无法访问"
        }
        response.status = Status.Forbidden
        return
    }

    await next()
}