import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as buildSystemRunApprovalEnvBinding } from "./system-run-approval-binding-DJ0HBEkx.mjs";
//#region src/gateway/operator-approval-standing-grants.ts
/**
* Exact gateway-exec operation binding: trimmed command text, cwd, and the
* env-override hash. Both mint (approval creation) and use (allowlist
* evaluation) derive it from the same raw inputs, so matching is byte-exact —
* the same semantics as systemRunBinding digest matching.
*/
function buildCronExecOperationBinding(params) {
	return stableStringify({
		v: 1,
		command: params.command.trim(),
		cwd: params.cwd?.trim() || null,
		envHash: buildSystemRunApprovalEnvBinding(params.env).envHash
	});
}
/** Parses a stored operation binding back into its display facts. */
function parseCronExecOperationBinding(binding) {
	try {
		const parsed = JSON.parse(binding);
		if (parsed.v !== 1 || typeof parsed.command !== "string") return null;
		return {
			command: parsed.command,
			cwd: typeof parsed.cwd === "string" ? parsed.cwd : null
		};
	} catch {
		return null;
	}
}
//#endregion
export { parseCronExecOperationBinding as n, buildCronExecOperationBinding as t };
