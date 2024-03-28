// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
declare var require: any
const packageJson = require('../../package.json');

export const environment = {
  appName: 'test',
  envName: 'DEV',
  production: true,
  test: false,
  i18nPrefix: '/statics',
  baseFileServer: 'http://localhost:4200/api/document/',
  baseApiUrl: '/api/',
  assetURL: '/statics/assets/',
  versions: {
    app: packageJson.version,
    build: packageJson.build,
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiYmFiYWtpciIsImEiOiJja28wZ28xeHUwZm1wMnFvYmlkdXFobXEwIn0.CeHCMjif1_QM1GqlYvgtZQ',
    mapToken: 'pk.eyJ1IjoiaGVqYXppIiwiYSI6ImNsMzdwM2ljNjB5ZnYzbHJ1cDZrZzJlc3kifQ.pUeayzeMva54vrDo0GcwwA',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
