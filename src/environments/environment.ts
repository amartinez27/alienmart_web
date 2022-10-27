// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCmfFNMVS3khOH0Iw3k5CSJ8Cm0zYQmZb0",
    authDomain: "alienmart-shop.firebaseapp.com",
    databaseURL: "https://alienmart-shop.firebaseio.com",
    projectId: "alienmart-shop",
    storageBucket: "alienmart-shop.appspot.com",
    messagingSenderId: "992872877584",
    appId: "1:992872877584:web:dfcb79e0ec5fb24adc8495"
  },
  //apiUrl: 'https://alienmart-shop.herokuapp.com/api/v1/'
  apiUrl: 'http://localhost:3000/api/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
