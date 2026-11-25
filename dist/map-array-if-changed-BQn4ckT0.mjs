//!src/shared/map-array-if-changed.ts
function mapArrayIfChanged(e,t){let n=false;const r=e.map(e=>{const r=t(e);n||=r!==e;return r});return n?r:e}export{mapArrayIfChanged as t};