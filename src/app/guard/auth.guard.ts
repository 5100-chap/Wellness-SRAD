import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

export function authGuard(allowedRoles: string[]) {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const currentUser = authService.currentUserValue;

        if (currentUser && allowedRoles.includes(currentUser.role)) {
            return true;
        }

        return router.parseUrl('/login');
    };
}
