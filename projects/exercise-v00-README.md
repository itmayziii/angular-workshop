# Instructions for exercise-v00

## Tasks
* Implement /login route to go to the loginComponent.    
* Prevent a user from going to any page except /login and /signup unless the user is authenticated, you can use the /home route as a test.
    * Redirect all users that are not authenticated to /login when they try to go to the app.
* Implement functionality on the login component to make the login submit work.
    * Implement the loginWithCredentials method in the [user service](./exercise-v00-begin/src/app/services/user.service.ts).
* Once a user has logged in add the persons name to the top of the [sidebar component](./exercise-v00-begin/src/app/components/sidebar/sidebar.component.ts).    

## Resources
* Set up basic route - https://angular.io/guide/router#define-routes
* Route Guards - https://angular.io/guide/router#milestone-5-route-guards
* Navigate users programmatically - https://angular.io/guide/router#navigate-to-crisis-list-with-a-relative-url
