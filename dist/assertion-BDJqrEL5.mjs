//!src/shared/assertion.ts
function assertionSucceeds(e){try{e();return true}catch{return false}}export{assertionSucceeds as t};