import{root}from"@openclaw/fs-safe/root";
//!src/infra/root-walk.ts
async function*walkRootDirectory(e,t,n){yield*(await root(e)).walk(t,n)}export{walkRootDirectory as t};