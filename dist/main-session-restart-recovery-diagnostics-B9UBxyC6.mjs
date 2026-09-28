import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-DO6Dg2r0.mjs";
//#region src/agents/main-session-recovery/main-session-restart-recovery-diagnostics.ts
let failureGeneration;
const failures = /* @__PURE__ */ new Map();
function restartRecoveryStoreTargetKey(target) {
	return JSON.stringify([target.agentId, target.storePath]);
}
function currentFailures() {
	const generation = getAgentRunLifecycleGeneration();
	if (failureGeneration !== generation) {
		failures.clear();
		failureGeneration = generation;
	}
	return failures;
}
/** The marker records its outcome; diagnostics never infer successful recovery from a reread. */
function recordStartupRecoveryStoreResult(params) {
	if (params.lifecycleGeneration !== getAgentRunLifecycleGeneration()) return;
	const pending = currentFailures();
	const key = restartRecoveryStoreTargetKey(params.target);
	if (params.outcome.ok) pending.delete(key);
	else pending.set(key, truncateWithMarker(sanitizeTerminalText(redactSensitiveText(`${params.target.agentId ?? "session store"}: ${String(params.outcome.error)}`, { mode: "tools" })), 2e3, {
		marker: "… (see recovery log)",
		reserve: 22,
		trimEnd: true
	}));
}
function readStartupRecoveryWarning(includeSensitive = true) {
	const pending = currentFailures();
	if (pending.size === 0) return;
	const summary = `Startup session recovery is incomplete for ${pending.size} session store(s).`;
	const hint = "Inspect the Gateway recovery logs and retry the affected session after repairing its store.";
	return `${summary}${includeSensitive ? `\n${truncateWithMarker([...pending.values()].map((failure) => `- ${failure}`).join("\n"), 2e3, {
		marker: "… (see recovery log)",
		reserve: 22,
		trimEnd: true
	})}` : ""}\n${hint}`;
}
//#endregion
export { recordStartupRecoveryStoreResult as n, restartRecoveryStoreTargetKey as r, readStartupRecoveryWarning as t };
