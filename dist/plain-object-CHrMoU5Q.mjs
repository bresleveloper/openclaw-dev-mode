//!src/infra/plain-object.ts
function isPlainObject(e){return typeof e===`object`&&e!==null&&!Array.isArray(e)&&Object.prototype.toString.call(e)===`[object Object]`}export{isPlainObject as t};