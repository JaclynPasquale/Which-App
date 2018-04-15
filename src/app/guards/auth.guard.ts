import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService} from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    return true;
  }

  // canActivate(): Observable<boolean> {
  //   return this.authService.getUser()
  //     .map(user => {
  //       if (user && user.uid) {
  //         return true;
  //       } else {
  //         this.router.navigate(['./home']);
  //         return false;
  //       }
  //     });
  // }
}
