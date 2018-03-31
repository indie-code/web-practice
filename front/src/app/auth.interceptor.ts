import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TokenStorageService } from './token-storage.service';
import { filter, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private apiTokenName = 'Api-Token';

    constructor(
        private tokenStorage: TokenStorageService,
        private router: Router,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenStorage.token();

        if (token) {
            req = req.clone({setHeaders: {Authorization: `Bearer ${token}`}});
        }

        return next.handle(req).pipe(
            filter(response => response instanceof HttpResponse),
            tap(
                (response: HttpResponse<any>) => {
                    if (response.headers.get(this.apiTokenName)) {
                        this.tokenStorage.setToken(response.headers.get(this.apiTokenName));
                    }
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        this.tokenStorage.deleteToken();
                        this.router.navigateByUrl('/sign-in');
                    }
                },
            ),
        );
    }
}
