# Instructions for exercise-v00.

Exercise will be given around 25 minutes, you will be an over achiever if you finish on time!

**Please feel free to use this time to ask any questions especially if you get stuck. Don't stay on one problem for too long if you
are stuck, just go ahead and try the next one.**

## Tasks
1. Implement /login route to go to the [login component](./exercise-v00-begin/src/app/pages/login/login.component.ts).

    **Resources**
    * https://angular.io/guide/router#define-routes
    
2. Prevent a user from going to any page except /login and /signup unless the user is authenticated, you can use the /home route as a test.
  
    **Resources**
    * Route Guards - https://angular.io/guide/router#milestone-5-route-guards.
    * `canActivate` Route Guard - https://angular.io/api/router/CanActivate.
    * **hint** to check if a user is logged in or not check out the `currentUserSubject` in the [user service](./exercise-v00-begin/src/app/services/user.service.ts).

3. Redirect all users that are not authenticated to /login when they try to go to any app page except /login and /signup.

    **Resources**
    * Use `this.router.createUrlTree([ROUTE]);` to create a URLTree for the CanActivate guard navigation.

4. Implement the loginWithCredentials method in the [user service](./exercise-v00-begin/src/app/services/user.service.ts) which 
should take a email and password and login the user with the firebase function `this.firebaseAuth.auth.signInWithEmailAndPassword`.

5. Implement functionality on the [login component](./exercise-v00-begin/src/app/pages/login/login.component.ts) to make the
login submit work with both email/password and Google login. You can go the extra mile by showing for validation errors if the
user submits the form with invalid data or the user touched the field but left it invalid.

    **Resources**
    * Check out the [sign-up component] for examples of handling form input and using the user service.
    * extra mile "form field touched" - https://angular.io/guide/form-validation#why-check-dirty-and-touched

6. Once a user has logged in add the users name to the top of the [sidebar component](./exercise-v00-begin/src/app/components/sidebar/sidebar.component.ts).    
