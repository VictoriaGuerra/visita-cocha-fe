// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyBle9Kr-mI4-GQGIDMd9QsXZwFafoRzFvM',
    authDomain: 'cocha-turismo.firebaseapp.com',
    projectId: 'cocha-turismo',
    storageBucket: 'cocha-turismo.appspot.com',
    messagingSenderId: '814334659870',
    appId: '1:814334659870:web:8a8f2c7a4cb40598af8d0f',
    measurementId: 'G-X052853P53'
  }
  ,
  weatherApiKey: '',
  gamcPushUrl: '',
  weatherCacheTtl: 600000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
