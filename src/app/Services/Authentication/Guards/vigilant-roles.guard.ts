import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class VigilantRolesGuard implements CanActivate {

  constructor( private authService: AuthenticationService, private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      const rol = this.authService.getRolUser();
      if (rol === 'Referente_PAA') {
        return true;
      } else {
        this.router.navigate(['/WAPI/Home']);
        return false;
      }
  }
  
}
