//!src/plugins/http-path-prefix.ts
function prefixMatchPath(e,t){return e===t||e.startsWith(`${t}/`)||e.startsWith(`${t}%`)}export{prefixMatchPath as t};