import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // constructor(private userService: UserService, private authService: AuthService, private router: Router) {
  //   authService.getUser()(user => {
  //     if (user) {
  //       userService.save(user);

  //       // tslint:disable-next-line:prefer-const
  //       let returnUrl = localStorage.getItem('returnUrl');
  //       router.navigateByUrl(returnUrl);
  //     }
  //   });
  // }
}
