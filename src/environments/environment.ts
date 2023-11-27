// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  baseUrl:{
    /** DEV */
    // auth : "https://login-appservice-back2.azurewebsites.net/",
    auth : "https://wa-aeu-sds-dev-wapi-back.azurewebsites.net/api/v1/",
    logic:"https://wa-aeu-sds-dev-wapi-back.azurewebsites.net/api/v1/",
    generic:"https://wa-aeu-sds-dev-wapi-canonical.azurewebsites.net/api/v1/"

  },
  PROCEDURE_SHARED_URI: 'https://apm-aeu-sds-dev-shared.azure-api.net/tramites-shared/api',
  PROCEDURE_SECURITY_URI: 'https://apm-aeu-sds-dev-shared.azure-api.net/security/api/v2/Security'

  };





/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
