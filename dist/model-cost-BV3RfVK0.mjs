//!src/config/model-cost.ts
function mergeModelCost(e,t){if(!e||!t)return t??e;if(Object.keys(t).length===0)return e;const{tieredPricing:n,...r}=e;return{...r,...t}}export{mergeModelCost as t};