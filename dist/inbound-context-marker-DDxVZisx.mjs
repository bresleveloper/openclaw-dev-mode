//#region src/auto-reply/reply/inbound-context-marker.ts
/**
* Provenance marker appended to every OpenClaw-injected inbound context header
* (see `buildInboundUserContextPrefix`). Strippers key on this marker rather
* than on label text so detection is label-agnostic and never collides with
* user-typed headings. Fixed (not per-turn random): strippers run on stored
* text with no out-of-band value, and forging it only strips the forger's own
* text — no trust boundary depends on it.
*
* Duplicated (never imported) in:
*   - extensions/memory-lancedb/memory-capture-sanitization.ts (extension boundary
*     forbids core imports)
*   - apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatMarkdownPreprocessor.swift, which spells the
*     same two code points as `\u{27E6}`/`\u{27E7}` escapes
* Keep every copy equal to this value; a drifted copy silently stops stripping.
*/
const INBOUND_CONTEXT_MARKER = "⟦openclaw:ctx⟧";
/** Appends the provenance marker to a context header label. */
function markInboundContextLabel(label) {
	return `${label} ${INBOUND_CONTEXT_MARKER}`;
}
//#endregion
export { markInboundContextLabel as n, INBOUND_CONTEXT_MARKER as t };
