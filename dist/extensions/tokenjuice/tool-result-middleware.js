import { createTokenjuiceOpenClawEmbeddedExtension } from "./runtime-api.js";
import process from "node:process";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/tokenjuice/tool-result-middleware.ts
function normalizeDetails(event, current) {
	if (event.toolName !== "exec" && event.toolName !== "bash" || typeof event.args.command !== "string" || !event.args.command) return current.details;
	const metadata = isRecord(current.details) ? { ...current.details } : {};
	delete metadata.aggregated;
	if (typeof metadata.status === "string" && metadata.status.trim()) return metadata;
	const rawExitCode = metadata.exitCode;
	const failed = event.isError === true || metadata.ok === false || metadata.success === false || metadata.timedOut === true || Boolean(metadata.error) || typeof rawExitCode === "number" && Number.isFinite(rawExitCode) && rawExitCode !== 0;
	const exitCode = typeof rawExitCode === "number" && Number.isFinite(rawExitCode) ? rawExitCode : failed ? 1 : 0;
	return {
		...metadata,
		status: failed ? "failed" : "completed",
		exitCode
	};
}
function createTokenjuiceAgentToolResultMiddleware() {
	const handlers = [];
	createTokenjuiceOpenClawEmbeddedExtension()({ on(event, handler) {
		if (event === "tool_result") handlers.push(handler);
	} });
	return async (event) => {
		let current = event.result;
		const workdir = event.args.workdir;
		const cwd = event.cwd?.trim() ? event.cwd : typeof workdir === "string" && workdir.trim() ? workdir : process.cwd();
		for (const handler of handlers) {
			const next = await handler({
				toolName: event.toolName,
				input: event.args,
				content: current.content,
				details: normalizeDetails(event, current),
				isError: event.isError
			}, { cwd });
			if (next) current = Object.assign({}, current, {
				content: next.content ?? current.content,
				details: next.details ?? current.details
			});
		}
		return current === event.result ? void 0 : { result: current };
	};
}
//#endregion
export { createTokenjuiceAgentToolResultMiddleware };
