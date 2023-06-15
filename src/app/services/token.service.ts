import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
    username: string;
    role: string;
    exp: number;
    iat: number;
}

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private currentTokenSubject = new BehaviorSubject<string | null>(null);
    public currentToken = this.currentTokenSubject.asObservable();

    constructor() {
        const token = localStorage.getItem('token');
        if (token) {
            this.currentTokenSubject.next(token);
        }
    }

    public get currentTokenValue(): string | null {
        return this.currentTokenSubject.value;
    }

    public updateToken(newToken: string) {
        localStorage.setItem('token', newToken);
        this.currentTokenSubject.next(newToken);
    }

    public clearToken() {
        localStorage.removeItem('token');
        this.currentTokenSubject.next(null);
    }

    public isTokenExpired(token: string): boolean {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }
}
