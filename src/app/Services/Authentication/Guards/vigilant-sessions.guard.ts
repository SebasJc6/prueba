import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VigilantSessionsGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) { }

  redirect(verify: boolean) {
    if(!verify) {
      this.router.navigate(['/']);
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cookie = this.cookieService.check('token');
    this.redirect(cookie);
    return cookie;
  }
  
}
