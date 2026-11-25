//!src/shared/account-enabled.ts
function isAccountEnabled(e){if(!e||typeof e!==`object`)return true;return e.enabled!==false}export{isAccountEnabled as t};