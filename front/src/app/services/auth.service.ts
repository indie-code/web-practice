import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable ,  of as observableOf ,  BehaviorSubject } from 'rxjs';
import { flatMap, map, publishReplay, refCount, tap } from 'rxjs/operators';
import { TokenStorageService } from '../token-storage.service';
import { AuthUser } from '../models/user';

@Injectable()
export class AuthService {
    private user$: BehaviorSubject<AuthUser> = new BehaviorSubject<AuthUser>(undefined);
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
        if (! this.tokenStorageService.token()) {
            return observableOf(undefined);
        }

        return this.api.get('auth/user').pipe(
            map(response => response.data),
            tap((auth: AuthResponse) => this.user$.next(auth.user)),
        );
    }

    register(registerForm: SignUpForm): Observable<AuthResponse> {
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

export interface SignUpForm {
    email: string;
    password: string;
    password_confirmation: string;
}

export interface SignInForm {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: AuthUser;
}
