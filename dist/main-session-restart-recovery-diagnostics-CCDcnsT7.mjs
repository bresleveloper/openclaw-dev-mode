import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
//#region src/agents/main-session-recovery/main-session-restart-recovery-diagnostics.ts
function skippedMainSessionRecoveryDecision(reason) {
	switch (reason) {
		case "exhausted":
		case "tombstoned":
		case "message_action_authority_unavailable":
		case "delegated_authority_unavailable":
		case "work_start_blocked":
		case "dispatch_target_unavailable": return {
			decision: "blocked",
			reason,
			nextOwner: "operator"
		};
		case "work_start_pending": return {
			decision: "deferred",
			reason,
			nextOwner: "session-preparation"
		};
		case "pending_delivery": return {
			decision: "deferred",
			reason,
			nextOwner: "outbound-delivery"
		};
		case "archived": return {
			decision: "deferred",
			reason,
			nextOwner: "none"
		};
		case "live_owner":
		case "blocked":
		case "already_handled":
		case "inactive": return {
			decision: "deferred",
			reason,
			nextOwner: "session-owner"
		};
		case "invalid_harness_completion": return {
			decision: "settled",
			reason,
			nextOwner: "none"
		};
		case "stopped": return {
			decision: "deferred",
			reason,
			nextOwner: "next-startup"
		};
		default: return {
			decision: "deferred",
			reason,
			nextOwner: "main-session-recovery"
		};
	}
}
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
export { skippedMainSessionRecoveryDecision as i, recordStartupRecoveryStoreResult as n, restartRecoveryStoreTargetKey as r, readStartupRecoveryWarning as t };
