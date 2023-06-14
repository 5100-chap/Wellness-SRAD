import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

interface DecodedToken {
    username: string;
    role: string;
    exp: number;
    iat: number;
}

export function authGuard(allowedRoles: string[]) {
    return () => {
        const authService = inject(AuthService);
        const tokenService = inject(TokenService);
        const router = inject(Router);
        const currentToken = tokenService.currentTokenValue;
        const currentUser = authService.currentUserValue;

        if (!currentToken) {
            return router.parseUrl('/login');
        }

        const decodedToken = jwtDecode<DecodedToken>(currentToken);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            tokenService.clearToken();
            return router.parseUrl('/login');
        }
        
        if (currentUser && currentUser.user && allowedRoles.includes(currentUser.user.role)) {
            return true;
        }
        

        return router.parseUrl('/login');
    };
}
