import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { flatMap, map, publishReplay, refCount, tap } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TokenStorageService } from '../token-storage.service';
import { of as observableOf } from 'rxjs/observable/of';

@Injectable()
export class AuthService {
    private user$: ReplaySubject<User> = new ReplaySubject<User>(1);
    private loadUser$ = this.loadUser().pipe(publishReplay(), refCount());

    constructor(
        private api: ApiService,
        private tokenStorageService: TokenStorageService,
    ) {
    }

    user() {
        return this.loadUser$.pipe(flatMap(() => this.user$.asObservable()));
    }

    loadUser(): Observable<AuthResponse> {
        if (!this.tokenStorageService.token()) {
            // TODO: поискать нормальный способ
            return observableOf(undefined);
        }

        return this.api.get('auth/user').pipe(
            map(response => response.data),
            tap((auth: AuthResponse) => this.user$.next(auth.user)),
        );
    }

    register(registerForm: RegisterForm): Observable<AuthResponse> {
        return this.api.post('auth/sign-up', registerForm).pipe(
            map(response => response.data),
            tap((auth: AuthResponse) => this.user$.next(auth.user)),
        );
    }

    signIn(signInForm: SignInForm): Observable<AuthResponse> {
        return this.api.post('auth/sign-in', signInForm).pipe(
            map(response => response.data),
            tap((auth: AuthResponse) => this.user$.next(auth.user)),
        );
    }

    signOut() {
        this.tokenStorageService.deleteToken();
        this.user$.next(undefined);
    }
}

export interface RegisterForm {
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ApiResponse<T> {
    data: T;
}

export interface AuthResponse {
    user: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface SignInForm {
    email: string;
    password: string;
}
