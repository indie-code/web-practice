import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorageService {

    constructor() {
    }

    setToken(token: string) {
        localStorage.setItem('api-token', token);
    }

    token() {
        return localStorage.getItem('api-token');
    }

    deleteToken() {
        localStorage.removeItem('api-token');
    }
}
