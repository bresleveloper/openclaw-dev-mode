import { createTokenjuiceOpenClawEmbeddedExtension } from "./runtime-api.js";
import process from "node:process";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/tokenjuice/tool-result-middleware.ts
const retainedRuleScopes = /* @__PURE__ */ new Set();
function normalizeDetails(event, current) {
	if (event.toolName !== "exec" && event.toolName !== "bash" || typeof event.args.command !== "string" || !event.args.command) return current.details;
	const metadata = isRecord(current.details) ? { ...current.details } : {};
	delete metadata.aggregated;
	if (typeof metadata.status === "string" && metadata.status.trim()) return metadata;
	const rawExitCode = metadata.exitCode;
	const failed = event.isError === true || metadata.ok === false || metadata.success === false || metadata.timedOut === true || Boolean(metadata.error) || typeof rawExitCode === "number" && Number.isFinite(rawExitCode) && rawExitCode !== 0;
	const exitCode = typeof rawExitCode === "number" && Number.isFinite(rawExitCode) ? rawExitCode : failed ? 1 : 0;
	metadata.status = failed ? "failed" : "completed";
	metadata.exitCode = exitCode;
	return metadata;
}
function createTokenjuiceAgentToolResultMiddleware() {
	let handler;
	createTokenjuiceOpenClawEmbeddedExtension()({ on(event, registeredHandler) {
		if (event === "tool_result") handler = registeredHandler;
	} });
	return async (event) => {
		const current = event.result;
		const workdir = event.args.workdir;
		const details = normalizeDetails(event, current);
		const detailsCwd = isRecord(details) ? details.cwd : void 0;
		const cwd = typeof workdir === "string" && workdir.trim() ? workdir : typeof detailsCwd === "string" && detailsCwd.trim() ? detailsCwd : event.cwd?.trim() ? event.cwd : process.cwd();
		try {
			const next = await handler?.({
				toolName: event.toolName,
				input: event.args,
				content: current.content,
				details,
				isError: event.isError
			}, { cwd });
			if (!next) return;
			const nextDetails = next.details ?? details;
			return { result: Object.assign({}, current, {
				content: next.content ?? current.content,
				details: next.content && isRecord(nextDetails) ? {
					...nextDetails,
					aggregated: next.content.filter((block) => block.type === "text").map((block) => block.text).join("\n")
				} : nextDetails
			}) };
		} finally {
			retainedRuleScopes.add(cwd);
			if (retainedRuleScopes.size >= 128) {
				const { clearRuleCache } = await import("tokenjuice");
				clearRuleCache();
				retainedRuleScopes.clear();
			}
		}
	};
}
export { createTokenjuiceAgentToolResultMiddleware };
