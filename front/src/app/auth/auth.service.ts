import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {

    constructor(private api: ApiService) {
    }

    register(registerForm: RegisterForm): Observable<AuthResponse> {
        return this.api.post('auth/sign-up', registerForm)
            .pipe(map(response => response.data));
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
