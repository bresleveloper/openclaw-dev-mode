//!src/routing/peer-kind-match.ts
function peerKindMatches(e,t){if(e===t)return true;return e===`group`&&t===`channel`||e===`channel`&&t===`group`}export{peerKindMatches as t};