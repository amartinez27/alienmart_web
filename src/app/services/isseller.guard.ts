import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssellerGuard implements CanActivate {
  userInfo: any;
  constructor(private _router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userInfo = JSON.parse(localStorage.getItem('user'));

    if (this.userInfo.roles.includes("admin") || this.userInfo.roles.includes("vendedor")) {
      return true;
    } else {
      this._router.navigate(['/admin'])
    }
  }

}
