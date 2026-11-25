import"./src-0ci69Prg.mjs";import{r as formatCompactTokenCount}from"./format-66SdinIu.mjs";
//!src/utils/token-format.ts
function formatTokenCount(e){if(e===void 0||!Number.isFinite(e))return`0`;const t=Math.max(0,e);return formatCompactTokenCount(t,{thousandsPrecision:t>=1e4?0:1})}export{formatTokenCount as t};