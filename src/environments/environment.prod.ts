export const environment = {
  production: true,
  clientId :'32a9c775-6b60-4214-aa1b-020f435a15f0',
  baseUrl:{
       /** DEV */
    auth : "https://wa-aeu-sds-dev-wapi-back.azurewebsites.net/api/v1/",
    logic:"https://wa-aeu-sds-dev-wapi-back.azurewebsites.net/api/v1/",
    generic:"https://wa-aeu-sds-dev-wapi-canonical.azurewebsites.net/api/v1/"
    // /**QA */
    // auth : "https://login-appservice-back2.azurewebsites.net/",
    // logic:"https://wa-aeu-sds-qas-wapi-back.azurewebsites.net/api/v1/",
    // generic:"https://wa-aeu-sds-qas-wapi-canonical.azurewebsites.net/api/v1/"
  },
  PROCEDURE_SHARED_URI: 'https://apm-aeu-sds-dev-shared.azure-api.net/tramites-shared/api',
  PROCEDURE_SECURITY_URI: 'https://apm-aeu-sds-dev-shared.azure-api.net/security/api/v2/Security'
};
