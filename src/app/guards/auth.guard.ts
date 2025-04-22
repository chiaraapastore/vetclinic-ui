import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private keycloakService: KeycloakService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    try {
      const isAuthenticated = await this.keycloakService.isLoggedIn();

      if (!isAuthenticated) {
        await this.keycloakService.login({ redirectUri: window.location.origin + state.url });
        return false;
      }

      const userRoles = this.keycloakService.getUserRoles();


      const requiredRoles: string[] = route.data['roles'] || [];


      if (requiredRoles.length === 0 || requiredRoles.some((role) => userRoles.includes(role))) {

        return true;
      }


      this.router.navigate(['/not-authorized']);
      return false;
    } catch (error) {

      this.router.navigate(['/error']);
      return false;
    }
  }
}
