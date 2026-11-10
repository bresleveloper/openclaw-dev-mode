import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as safeChannelKey, n as resolveAllowFromAccountId } from "./pairing-store-keys-BTumx1Bd.mjs";
//#region src/pairing/pairing-store.read.ts
/** Prepare current allowlist facts; the channel owner still admits the message. */
async function readChannelAllowFromStore(channel, env = process.env, accountId) {
	const resolvedAccountId = resolveAllowFromAccountId(accountId);
	const channelKey = safeChannelKey(channel);
	const context = captureOpenClawStateReadWorkerContext({ env });
	const result = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "pairing.allowFrom",
		input: {
			channel: channelKey,
			accountId: resolvedAccountId
		}
	}, {
		context,
		current: true
	});
	if (result === void 0) return ({}[resolvedAccountId] ?? []).slice();
	if (result.ok && result.type === "pairing.allowFrom") return result.entries;
	throw new Error("Unexpected channel pairing allowlist result");
}
//#endregion
export { readChannelAllowFromStore as t };
