import { b as createCodexNativeSubagentHistoryOwner } from "./native-subagent-pending-assignments-4pHbxy_i.mjs";
import { i as matchesCodexNativeSubagentSubmissionBinding, v as sessionBindingIdentity } from "./session-binding-record-BiLa2g9Y.mjs";
import { A as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-DS0mnvrR.mjs";
import "./shared-client-DhJ31S_8.mjs";
import "./session-binding-_y0fotvm.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-B5NQE7x0.mjs";
// extensions/codex/src/app-server/native-subagent-roster.ts
/** Reads only a current binding's already retained monitor; unavailable owners stay unavailable. */
async function readCodexNativeSubagents(params, options) {
	params.assertCurrent();
	const identity = sessionBindingIdentity(params);
	const binding = await options.bindingStore.readAsync(identity);
	params.assertCurrent();
	if (!binding?.clientId) return;
	const historyOwner = createCodexNativeSubagentHistoryOwner({
		parentThreadId: binding.threadId,
		sessionId: params.sessionId,
		lifecycleRevision: params.lifecycleRevision,
		binding
	});
	if (!historyOwner || !matchesCodexNativeSubagentSubmissionBinding(binding, historyOwner)) return;
	const reader = await options.bindingStore.prepareRead(identity);
	try {
		params.assertCurrent();
		if (!reader) return;
		const assertCurrent = () => {
			params.assertCurrent();
			const current = reader.read();
			if (current?.clientId !== binding.clientId || !current || !matchesCodexNativeSubagentSubmissionBinding(current, historyOwner)) throw new Error("Codex native subagent observation binding changed");
		};
		assertCurrent();
		const retained = await retainSharedCodexAppServerClientByInstanceId(binding.clientId, { waitForExit: false });
		let snapshot;
		try {
			assertCurrent();
			if (retained) snapshot = codexNativeSubagentMonitorRuntime.readNativeSubagents({
				...params,
				client: retained.client,
				parentThreadId: binding.threadId,
				historyOwner,
				assertCurrent
			});
		} finally {
			await retained?.release();
		}
		assertCurrent();
		return snapshot;
	} finally {
		reader?.release();
	}
}
export { readCodexNativeSubagents };
