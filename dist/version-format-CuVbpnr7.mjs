//!src/cli/version-format.ts
function formatVersionLabel(e){const t=e.trim();return/^\d/.test(t)?`v${t}`:t||e}export{formatVersionLabel as t};