import { Context, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { key } from "./jwt.ts";
import { State } from "../main.ts";
export const jwtGuard = async ({ request, response, state }: Context<State>, next: () => Promise<unknown>) => {
    const jwt = request.headers.get('Authorization')?.slice(7)
    try {
        const payload = await verify(jwt || '', key)
        state.userId = payload.userId as string
        state.userRole = payload.userRole as string
    } catch (e) {
        console.error(e)
        response.body = "请先登录"
        response.status = Status.Forbidden
        return
    }
    await next()
}

export const waiterGuard = async ({ response, state }: Context<State>, next: () => Promise<unknown>) => {
    if (state.userRole != 'waiter') {
        response.body = {
            message: "非服务员无法访问"
        }
        response.status = Status.Forbidden
        return
    }

    await next()
}