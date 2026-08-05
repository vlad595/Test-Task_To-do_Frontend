import { HttpInterceptorFn } from "@angular/common/http";
import { Auth } from "./auth";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);

    const token = authService.get_token();

    if (token){
        const cloneReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloneReq);
    }
    return next(req);
}