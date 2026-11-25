import { A as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-DS0mnvrR.mjs";
import "./shared-client-DhJ31S_8.mjs";
import { t as isSameCodexAppServerThreadOwner } from "./thread-ownership-CO0Yx4QG.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-B5NQE7x0.mjs";
// extensions/codex/src/app-server/session-cancellation.ts
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
	const prepared = await bindingStore.prepareRead(identity);
	if (!prepared) throw new Error("Codex descendant cancellation binding reader is unavailable");
	using reader = {
		read: prepared.read,
		[Symbol.dispose]: prepared.release
	};
	const lease = await retainSharedCodexAppServerClientByInstanceId(binding.clientId, { waitForExit: false });
	const assertBindingCurrent = () => {
		const current = reader.read();
		if (!current || !isSameCodexAppServerThreadOwner(current, binding)) throw new Error("Codex descendant cancellation binding changed");
	};
	try {
		params.assertCurrent();
		assertBindingCurrent();
		if (!lease) return run(async () => ({
			killed: 0,
			cancelledRequesters: []
		}));
		return await codexNativeSubagentMonitorRuntime.withDescendantCancellation(lease.client, {
			...params,
			parentThreadId: binding.threadId,
			assertBindingCurrent
		}, run);
	} finally {
		await lease?.release();
	}
}
export { withCodexSessionDescendantCancellation };
