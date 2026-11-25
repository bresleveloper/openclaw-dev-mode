//!src/shared/largest-fitting-value.ts
function largestFittingValue(e,t,n){let r=e;let i=t;while(r<i){const e=Math.ceil((r+i)/2);if(n(e))r=e;else i=e-1}return r}export{largestFittingValue as t};