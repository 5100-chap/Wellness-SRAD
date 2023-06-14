import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private currentTokenSubject = new BehaviorSubject<string | null>(null);
    public currentToken = this.currentTokenSubject.asObservable();

    constructor() {
        const token = sessionStorage.getItem('token');
        if (token) {
            this.currentTokenSubject.next(token);
        }
    }

    public get currentTokenValue(): string | null {
        return this.currentTokenSubject.value;
    }

    public updateToken(newToken: string) {
        sessionStorage.setItem('token', newToken);
        this.currentTokenSubject.next(newToken);
    }

    public clearToken() {
        sessionStorage.removeItem('token');
        this.currentTokenSubject.next(null);
    }
}
