//#region extensions/browser/src/browser-gateway-contract.ts
/**
* Node-hosted browser control uses these values on both sides of the gateway
* contract, so keep them as literal exports instead of duplicated strings.
*/
const BROWSER_REQUEST_GATEWAY_METHOD = "browser.request";
const SESSION_BROWSER_REQUEST_GATEWAY_METHOD = "browser.dashboard.request";
const BROWSER_REQUEST_GATEWAY_SCOPE = "operator.admin";
const BROWSER_REQUEST_GATEWAY_SCOPES = [BROWSER_REQUEST_GATEWAY_SCOPE];
//#endregion
export { SESSION_BROWSER_REQUEST_GATEWAY_METHOD as i, BROWSER_REQUEST_GATEWAY_SCOPE as n, BROWSER_REQUEST_GATEWAY_SCOPES as r, BROWSER_REQUEST_GATEWAY_METHOD as t };
