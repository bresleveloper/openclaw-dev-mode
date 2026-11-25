import{Writable}from"node:stream";
//!src/shared/null-writer.ts
function createNullWriter(){return new Writable({write(e,t,n){n()}})}export{createNullWriter as t};