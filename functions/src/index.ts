import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();
// const db = admin.firestore();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
// https://firebase.google.com/docs/functions/callable#write_and_deploy_the_callable_function

export const addCode = functions.https.onCall((data, context) => {
  if (!data.code) {
    return new functions.https.HttpsError('failed-precondition', 'The function must be called with a "code".');
  }
  if (!context.auth) {
    return new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  console.log('context.auth', context.auth);
  // https://firebase.google.com/docs/auth/admin/custom-claims#set_and_validate_custom_user_claims_via_the_admin_sdk
  return admin.auth().setCustomUserClaims(context.auth.uid, {angularWorkshopCode: data.code})
    .then(() => {
      return {
        message: 'Successfully stored code.'
      };
    })
    .catch(() => {
      return new functions.https.HttpsError('internal', 'Failed to store code.');
    });
});
