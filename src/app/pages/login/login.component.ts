import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { UserAuthService } from 'src/app/shared/services/user-auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
export class DefaultStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users: Array<IUser> = [];
  emailFormControl = new FormControl('', [Validators.required, Validators.email,]);
  passFormControl = new FormControl('', [Validators.required]);
  matcher = new DefaultStateMatcher();
  hide: Boolean = true;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  private getUsers(): void {
    this.userAuthService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      err => {
        console.log(err);
      });
  }

  login(): void {
    if (this.emailFormControl.valid && this.passFormControl.valid) {
      this.userAuthService.signIn(this.users.length, this.emailFormControl.value, this.passFormControl.value, this.users).subscribe((data) => {
        localStorage.setItem('user', JSON.stringify(data));
        this.router.navigateByUrl('news');
      },
        err => {
          console.log(err);
        });
    }
  }
}
