import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Wcwajg7Y.mjs";
import { n as createCompactionNoticePayload } from "./compaction-notice-BOmn1Ybv.mjs";
//#region src/commands/sessions-compact.ts
function describeCompaction(result, fallbackKey) {
	const sessionKey = result.key ?? fallbackKey;
	if (!result.compacted) {
		if ((result.result?.details)?.pending === true) return `Compaction started for session ${sessionKey} (pending; completion is reported asynchronously by the backend).`;
		return `No compaction needed for session ${sessionKey}${result.reason ? ` (${result.reason})` : ""}.`;
	}
	const before = result.result?.tokensBefore;
	const after = result.result?.tokensAfter;
	let detail = "";
	if (typeof before === "number" && typeof after === "number") detail = ` (${before} → ${after} tokens)`;
	else if (typeof result.kept === "number") detail = ` (kept ${result.kept} lines)`;
	const notice = result.result?.details?.qualityDegraded === true ? `\n${createCompactionNoticePayload({ phase: "degraded" }).text}` : "";
	return `Compacted session ${sessionKey}${detail}.${notice}`;
}
async function sessionsCompactCommand(opts, runtime) {
	const agent = opts.agent?.trim();
	if (opts.agent !== void 0 && !agent) throw new Error("--agent must not be blank");
	const rpcOpts = {
		url: opts.url,
		token: opts.token,
		password: opts.password,
		timeout: opts.timeout ?? null,
		json: opts.json
	};
	const params = {
		key: opts.key,
		...agent ? { agentId: agent } : {},
		...opts.maxLines !== void 0 ? { maxLines: opts.maxLines } : {}
	};
	let result;
	try {
		result = await callGatewayFromCliWithTransport("sessions.compact", rpcOpts, params, { defaultTimeoutMs: 1e4 });
	} catch (err) {
		rethrowExpectedCliError(err);
		const message = formatErrorMessage(err);
		if (opts.json) writeRuntimeJson(runtime, {
			...formatCliJsonFailure(message),
			key: opts.key
		});
		else runtime.error(`Compaction failed: ${message}`);
		runtime.exit(1);
		return;
	}
	const failed = result?.ok !== true;
	if (opts.json) {
		writeRuntimeJson(runtime, result);
		if (failed) runtime.exit(1);
		return;
	}
	if (failed) {
		const sessionKey = result?.key ?? opts.key;
		const reason = result?.reason ? `: ${result.reason}` : "";
		runtime.error(`Compaction failed for session ${sessionKey}${reason}.`);
		runtime.exit(1);
		return;
	}
	runtime.log(describeCompaction(result ?? {}, opts.key));
}
//#endregion
export { sessionsCompactCommand };
