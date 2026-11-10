import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { f as disposeContextEngineSources, l as resolveLogicalTurnContextEngines, r as hasSameContextEngineInstance } from "./registry-BNFZRyO5.mjs";
import { n as recordAgentCleanupFailure, r as runAgentCleanupStep } from "./run-cleanup-timeout-CjK4qQ1w.mjs";
import { a as evaluateContextEngineHostSupport, o as supportsContextEngineDurableTurnAdvancement } from "./host-compat-DWLjZN89.mjs";
import { t as registerLegacyContextEngine } from "./init-g-4TXKd7.mjs";
//#region src/agents/harness/context-engine-logical-turn.ts
async function createContextEngineLogicalTurnLease(params) {
	const { runId, sessionId } = params.identity;
	const resolution = await resolveLogicalTurnContextEngines(params.config, {
		initialize: registerLegacyContextEngine,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		beforeCustomEngine: params.awaitSessionDiffBaseline,
		onCleanupFailure: recordAgentCleanupFailure
	});
	let state = "unselected";
	let effective = resolution.configured;
	let degradedReason = resolution.configuredFailure;
	let warned = false;
	const disposalHolds = /* @__PURE__ */ new Set();
	const settlements = /* @__PURE__ */ new Map();
	const isBaselineEngineSelection = resolution.configuredFailure === void 0 && resolution.configured.registeredId === resolution.fallback.registeredId;
	const asEffective = () => Object.freeze({
		...effective,
		mode: degradedReason ? "legacy-degraded" : "configured",
		...degradedReason ? { reason: degradedReason } : {}
	});
	const warnOnce = (reason) => {
		if (warned) return;
		warned = true;
		(params.warn ?? console.warn)(`[context-engine] Context engine "${sanitizeForLog(resolution.configuredId)}" degraded to "${sanitizeForLog(resolution.fallback.registeredId)}" for this logical turn: ${sanitizeForLog(reason)}. The "${sanitizeForLog(resolution.fallback.registeredId)}" engine will handle only this turn; configuration is unchanged, and "${sanitizeForLog(resolution.configuredId)}" will be retried next turn.`);
	};
	const degradeBeforeStart = (reason) => {
		if (state === "disposed") throw new Error("context-engine logical turn selection is already pinned");
		if (isBaselineEngineSelection) {
			if (state === "unselected") state = "selected";
			return asEffective();
		}
		if (state === "started") throw new Error("context-engine logical turn selection is already pinned");
		degradedReason ??= reason;
		effective = resolution.fallback;
		state = "selected";
		warnOnce(degradedReason);
		return asEffective();
	};
	const resolveSelectionIssue = (selection) => {
		const support = evaluateContextEngineHostSupport({
			contextEngineInfo: effective.engine.info,
			operation: selection.operation,
			host: selection.host
		});
		if (!support.ok) return `host "${selection.host.id}" is missing ${support.missingCapabilities.join(", ")}`;
		if (isBaselineEngineSelection) return;
		if (selection.requiresDurableCommit && effective.engine.info.transcriptSemantics?.currentTurnFence !== "before-current-turn-entry-v1") return "current-turn transcript fencing is not declared";
		if (selection.requiresDurableCommit && !supportsContextEngineDurableTurnAdvancement(effective.engine)) return "atomic idempotent turn advancement is not declared";
	};
	if (resolution.configuredFailure) degradeBeforeStart(resolution.configuredFailure);
	return {
		get engine() {
			return effective.engine;
		},
		get effectiveEngine() {
			return effective.engine;
		},
		get effectiveEngineId() {
			return effective.registeredId;
		},
		get effectiveEnginePluginId() {
			return effective.ownerPluginId;
		},
		get degraded() {
			return degradedReason !== void 0;
		},
		get degradedReason() {
			return degradedReason;
		},
		get disposed() {
			return state === "disposed";
		},
		selectForHost(selection) {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			if (degradedReason) return asEffective();
			const issue = resolveSelectionIssue(selection);
			if (issue) {
				if (state === "started") throw new Error(`context-engine logical turn cannot change to incompatible ${selection.host.label}: ${issue}`);
				return degradeBeforeStart(issue);
			}
			if (state === "unselected") state = "selected";
			return asEffective();
		},
		degradeBeforeStart,
		begin() {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			state = "started";
			return asEffective();
		},
		onDispose(key, settle) {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			settlements.set(key, settle);
		},
		deferDisposalUntil(promise) {
			if (state === "disposed") throw new Error("context-engine logical turn lease is already disposed");
			disposalHolds.add(promise);
			promise.finally(() => disposalHolds.delete(promise)).catch(() => {});
		},
		async dispose() {
			if (state === "disposed") return;
			state = "disposed";
			await Promise.all([...settlements.values()].map((cleanup) => runAgentCleanupStep({
				runId,
				sessionId,
				step: "context-engine-turn-settlement",
				log: { warn: params.warn ?? console.warn },
				cleanup
			})));
			settlements.clear();
			const engines = [resolution.configured.engine, resolution.fallback.engine];
			const distinctEngines = engines.filter((engine, index) => engines.slice(0, index).every((other) => !hasSameContextEngineInstance(engine, other)));
			const disposeEngines = async () => {
				await Promise.allSettled(distinctEngines.map((engine) => runAgentCleanupStep({
					runId,
					sessionId,
					step: "context-engine-dispose",
					log: { warn: params.warn ?? console.warn },
					cleanup: async () => {
						const sources = new Set(engines.filter((other) => hasSameContextEngineInstance(engine, other)).flatMap((other) => resolution.sourceResources?.get(other) ?? []));
						await disposeContextEngineSources(engine, [...sources]);
					}
				})));
			};
			if (disposalHolds.size > 0) {
				Promise.allSettled(disposalHolds).then(disposeEngines);
				return;
			}
			await disposeEngines();
		}
	};
}
//#endregion
export { createContextEngineLogicalTurnLease as t };
