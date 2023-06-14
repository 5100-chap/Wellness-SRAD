import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import jwtDecode from 'jwt-decode';

import { AuthService } from '../services/auth.service';

interface DecodedToken {
    username: string;
    role: string;
    exp: number;
    iat: number;
}

export function authGuard(allowedRoles: string[]) {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const currentUser = authService.currentUserValue;

        
        const decodedToken = jwtDecode<DecodedToken>(currentUser.token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            console.log('Token expired');
            authService.logout();
            return router.parseUrl('/login');
        }

        if (currentUser && allowedRoles.includes(currentUser.user.role)) {
            return true;
        }

        return router.parseUrl('/login');
    };
}
