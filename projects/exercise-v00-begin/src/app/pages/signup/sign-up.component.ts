import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, FirebaseError } from 'firebase/app';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class='signup-page'>
      <span *ngIf='code.invalid && (code.touched || this.submitted)'>Code not entered</span>
      <input type='text' [class] [formControl]='code'/>
      <form [formGroup]='signUpWithCredentialsForm' (ngSubmit)='handleCredentialSignUp()'>
        <input type='text' name='email' formControlName='email'/>
        <input type='password' name='password' formControlName='password'/>
        <button type='submit'>Sign up</button>
      </form>

      <button type='button' (click)='signUpWithGoogle()'>Login With Google</button>
    </div>
  `,
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  code = new FormControl('', [Validators.required]);
  signUpWithCredentialsForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  submitted = false;

  constructor(private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder, private userService: UserService) {}

  signUpWithGoogle() {
    this.submitted = true;
    if (this.code.invalid) {
      return;
    }

    this.userService.loginWithGoogle(this.code.value);
  }

  handleCredentialSignUp() {
    this.submitted = true;
    if (this.code.invalid || this.signUpWithCredentialsForm.invalid) {
      return;
    }

    this.userService.createUserWithCredentials(this.signUpWithCredentialsForm.get('email')?.value, this.signUpWithCredentialsForm.get('password')?.value, this.code.value);
  }
}
