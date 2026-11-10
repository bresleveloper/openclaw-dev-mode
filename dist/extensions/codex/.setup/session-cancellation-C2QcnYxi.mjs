import { T as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-aTVcxfbh.mjs";
import "./shared-client-BEHXwqz5.mjs";
import { t as isSameCodexAppServerThreadOwner } from "./thread-ownership-D2aUUPS_.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-CQk9y8zO.mjs";
//#region extensions/codex/src/app-server/session-cancellation.ts
/** Stop owns admitted descendants, without retiring the session or its native history. */
async function withCodexSessionDescendantCancellation(bindingStore, params, run) {
	const identity = {
		kind: "session",
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	};
	params.assertCurrent();
	const binding = await bindingStore.readAsync(identity);
	params.assertCurrent();
	if (!binding?.clientId) return run(async () => ({
		killed: 0,
		cancelledRequesters: []
	}));
	const lease = await retainSharedCodexAppServerClientByInstanceId(binding.clientId, { waitForExit: false });
	const assertCurrent = () => {
		params.assertCurrent();
		const current = bindingStore.read(identity);
		if (!current || !isSameCodexAppServerThreadOwner(current, binding)) throw new Error("Codex descendant cancellation binding changed");
	};
	try {
		assertCurrent();
		if (!lease) return run(async () => ({
			killed: 0,
			cancelledRequesters: []
		}));
		return await codexNativeSubagentMonitorRuntime.withDescendantCancellation(lease.client, {
			...params,
			parentThreadId: binding.threadId,
			assertCurrent
		}, run);
	} finally {
		await lease?.release();
	}
}
//#endregion
export { withCodexSessionDescendantCancellation };
