import"./net-Dvn8LP7m.mjs";
//!src/plugin-sdk/request-url.ts
function resolveRequestUrl(e){if(typeof e===`string`)return e;if(e instanceof URL)return e.toString();if(typeof e===`object`&&e&&`url`in e&&typeof e.url===`string`)return e.url;return``}export{resolveRequestUrl as t};