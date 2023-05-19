import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

export const authGuard = (allowedRoles: string[]) => {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        const currentUser = authService.currentUserValue;

        if (currentUser && allowedRoles.includes(currentUser.role)) {
            return true;
        }

        return router.parseUrl('/login');
    }
};
