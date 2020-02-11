# Instructions for exercise-v00

## Tasks
* Implement /login route to go to the loginComponent.
* Prevent a user from going to any page except /login and /signup unless the user is authenticated, you can use the /home route as a test.
    * Redirect all users that are not authenticated to /login when they try to go to the app.
* Implement the loginWithCredentials method in the [user service](./exercise-v00-begin/src/app/services/user.service.ts) which should take a email and password and login the
user with the firebase function `this.firebaseAuth.auth.signInWithEmailAndPassword`.
    * Implement functionality on the [login component](./exercise-v00-begin/src/app/pages/login/login.component.ts) to make the login submit work. 
* Once a user has logged in add the persons name to the top of the [sidebar component](./exercise-v00-begin/src/app/components/sidebar/sidebar.component.ts).    

## Resources
* Set up basic route - https://angular.io/guide/router#define-routes
* Route Guards - https://angular.io/guide/router#milestone-5-route-guards. 
    * **hint** use canActivate route guard - https://angular.io/api/router/CanActivate
        * In order to navigate from a canActivate guard return a URL tree with the router `this.router.createUrlTree([ROUTE]);`
    * **hint** use the checkIfLoginFinished method in the [user service](./exercise-v00-begin/src/app/services/user.service.ts) to know if the auth
    process has finished or not. The auth process is asynchronous when a page loads so this method returns a promise.
