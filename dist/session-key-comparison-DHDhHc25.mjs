import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region packages/normalization-core/src/session-key-comparison.ts
function normalizeSessionKeyForComparison(sessionKey) {
	const raw = normalizeOptionalString(sessionKey);
	if (!raw) return "";
	if (!/(?:^|:)(?:catalog|matrix|signal)(?=:|$)/i.test(raw)) return raw.toLowerCase();
	const parts = raw.split(":");
	let bodyStart = 0;
	while (parts.length - bodyStart >= 3 && parts[bodyStart]?.toLowerCase() === "agent") {
		parts[bodyStart] = "agent";
		parts[bodyStart + 1] = parts[bodyStart + 1]?.toLowerCase() ?? "";
		bodyStart += 2;
	}
	while (bodyStart < parts.length && !parts[bodyStart]?.trim()) bodyStart += 1;
	const channel = parts[bodyStart]?.toLowerCase();
	if (channel === "catalog") return parts.join(":");
	const peerKind = parts[bodyStart + 1]?.toLowerCase();
	const preservesMatrixTail = channel === "matrix" && (peerKind === "channel" || peerKind === "group");
	if (!preservesMatrixTail && !(channel === "signal" && peerKind === "group")) return raw.toLowerCase();
	parts[bodyStart] = channel;
	parts[bodyStart + 1] = peerKind;
	if (preservesMatrixTail) {
		for (let index = parts.length - 2; index >= bodyStart + 2; index -= 1) if (parts[index]?.toLowerCase() === "thread") {
			parts[index] = "thread";
			break;
		}
	} else {
		parts[bodyStart + 2] = parts[bodyStart + 2]?.trim() ?? "";
		for (let index = bodyStart + 3; index < parts.length; index += 1) parts[index] = parts[index]?.toLowerCase() ?? "";
	}
	return parts.join(":");
}
//#endregion
export { normalizeSessionKeyForComparison as t };
