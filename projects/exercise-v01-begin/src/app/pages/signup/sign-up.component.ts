import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  template: `
    <div class='login-shell'>
      <div class='form-field'>
        <input type='text' [formControl]='code' class='form-field'/>
        <label for='password'>Workshop Code</label>
      </div>
      <span class='error' *ngIf='code.invalid && ((credentialSignInAttempted || googleSignInAttempted) || code.touched)'>
          Code is Required
      </span>
      <form (ngSubmit)='signUpWithCredentials()' [formGroup]='signUpWithCredentialsForm'>
        <h1>Sign Up</h1>
        <div class='form-field'>
          <svg t='1580186443851' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1262'
            width='20' height='20'>
            <path
              d='M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-938.666667C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333z m0 768a340.650667 340.650667 0 0 1-266.24-128A340.650667 340.650667 0 0 1 512 597.333333a340.48 340.48 0 0 1 266.197333 128A340.48 340.48 0 0 1 512 853.333333z m0-298.666666a170.666667 170.666667 0 1 1 0-341.333334 170.666667 170.666667 0 0 1 0 341.333334z'
              p-id='1263' fill='#ffffff'></path>
          </svg>
          <input type='text' name='email' formControlName='email' class='form-field' placeholder=''>
          <label for='username'>Username</label>
        </div>
        <span class='error' *ngIf='signUpWithCredentialsForm.get("email").invalid && (credentialSignInAttempted || signUpWithCredentialsForm.get("email").touched)'>
          Invalid Email
        </span>
        <div class='form-field'>
          <svg t='1580186496086' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='885' width='20'
            height='20'>
            <path
              d='M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-938.666667C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333z m170.666667 725.333334H341.333333a170.666667 170.666667 0 0 1-170.666666-170.666667v-85.333333a170.538667 170.538667 0 0 1 139.050666-167.466667A105.386667 105.386667 0 0 1 298.666667 341.333333c0-70.698667 71.637333-128 160-128h106.666666C653.696 213.333333 725.333333 270.634667 725.333333 341.333333c0 15.018667-3.84 29.269333-9.813333 42.666667H682.666667a170.666667 170.666667 0 0 1 170.666666 170.666667v85.333333a170.666667 170.666667 0 0 1-170.666666 170.666667zM512 298.666667c-70.698667 0-128 38.186667-128 85.333333h256c0-47.146667-57.301333-85.333333-128-85.333333z m256 256a85.333333 85.333333 0 0 0-85.333333-85.333334H341.333333a85.333333 85.333333 0 0 0-85.333333 85.333334v85.333333a85.333333 85.333333 0 0 0 85.333333 85.333333h341.333334a85.333333 85.333333 0 0 0 85.333333-85.333333v-85.333333z'
              p-id='886' fill='#ffffff'></path>
          </svg>
          <input type='password' name='password' formControlName='password' class='form-field' placeholder=''>
          <label for='password'>Password</label>
        </div>
        <span class='error' *ngIf='signUpWithCredentialsForm.get("password").invalid && (credentialSignInAttempted || signUpWithCredentialsForm.get("password").touched)'>
          Invalid Password
        </span>
        <button type='submit' value='Sign Up' class='btn'>Sign Up</button>
      </form>
      <div class='social-section'>
        <img class='google-btn' (click)='signUpWithGoogle()' src='../../../assets/google-signin-button.png' alt='google sign-in button'/>
      </div>
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
  googleSignInAttempted = false;
  credentialSignInAttempted = false;

  constructor(private firebaseAuth: AngularFireAuth, private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

  signUpWithGoogle() {
    this.googleSignInAttempted = true;
    if (this.code.invalid) {
      return;
    }

    this.userService.createUserThroughGoogle(this.code.value)
      .then(() => this.router.navigate(['home']));
  }

  signUpWithCredentials() {
    this.credentialSignInAttempted = true;
    if (this.code.invalid || this.signUpWithCredentialsForm.invalid) {
      return;
    }

    this.userService.createUserWithCredentials(this.signUpWithCredentialsForm.get('email')?.value, this.signUpWithCredentialsForm.get('password')?.value, this.code.value)
      .then(() => this.router.navigate(['home']));
  }
}
