import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-Jag53zwP.mjs";
import { a as listCoreToolSections, s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-DWHChhWM.mjs";
import { r as createToolPolicyMatcher } from "./tool-policy-match-Dn8gpf-E.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { h as resolveConfiguredModelRef } from "./model-selection-shared-DKlQ1p0S.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-XJMKA8K7.mjs";
import { n as buildDefaultToolPolicyPipelineSteps, t as applyToolPolicyPipeline } from "./tool-policy-pipeline-DFP1wzZs.mjs";
//#region src/agents/tool-access-diagnostics.ts
/** Observe the same expanded policies that filter tools, including later blockers. */
function createToolAccessDiagnostics(params) {
	const candidates = /* @__PURE__ */ new Map();
	const constructed = /* @__PURE__ */ new Set();
	const include = (name) => {
		const id = normalizeToolPolicyName(name);
		if (!candidates.has(id)) candidates.set(id, { reasons: [] });
	};
	for (const name of params.toolNames ?? listCoreToolSections().flatMap((section) => section.tools.map((tool) => tool.id))) include(name);
	const onFilter = (event) => {
		for (const tool of event.before) {
			include(tool.name);
			constructed.add(normalizeToolPolicyName(tool.name));
		}
		const permits = createToolPolicyMatcher(event.policy);
		const notDenied = createToolPolicyMatcher({ deny: event.policy.deny });
		const source = event.step.source;
		for (const [id, candidate] of candidates) {
			if (permits(id)) continue;
			const denied = !notDenied(id);
			const kind = source?.kind === "profile" ? "profile" : source?.kind === "session" || source?.kind === "runtime" ? source.kind : denied ? "deny" : "allowlist";
			const path = source?.path ? `${source.path}${source.kind === "config" ? denied ? ".deny" : ".allow" : ""}` : void 0;
			candidate.reasons.push({
				kind,
				label: kind === "profile" ? `${source?.profile ?? "Selected"} profile` : `${denied ? "Denied by" : "Not included in"} ${path ?? event.step.label}`,
				...path ? { source: path } : {},
				...source?.profile ? { profile: source.profile } : {}
			});
			candidate.alsoAllowPath = candidate.reasons.length === 1 && kind === "profile" ? source?.alsoAllowPath : void 0;
		}
	};
	return {
		onFilter,
		finish(availableToolNames) {
			const available = availableToolNames && new Set(availableToolNames.map(normalizeToolPolicyName));
			available?.forEach(include);
			return {
				checked: available ? "live-session" : "local-config",
				profiles: params.profiles,
				tools: [...candidates].map(([id, candidate]) => {
					if (available?.has(id)) return {
						id,
						status: "available",
						reasons: []
					};
					if (candidate.reasons.length > 0) {
						const tool = {
							id,
							status: "excluded",
							reasons: candidate.reasons
						};
						if (candidate.alsoAllowPath && (!available || constructed.has(id))) tool.alsoAllowPath = candidate.alsoAllowPath;
						return tool;
					}
					return {
						id,
						status: available ? "unavailable" : "allowed",
						reasons: available ? [{
							kind: "runtime",
							label: "Not included in the session preview"
						}] : []
					};
				})
			};
		}
	};
}
/** Local policy can prove exclusion; it cannot prove a live tool was constructed. */
function resolveConfiguredToolAccess(params) {
	const model = params.modelProvider && params.modelId ? void 0 : resolveConfiguredModelRef({
		cfg: params.config,
		agentId: params.agentId,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const policy = resolveEffectiveToolPolicy({
		config: params.config,
		agentId: params.agentId,
		modelProvider: params.modelProvider ?? model?.provider,
		modelId: params.modelId ?? model?.model
	});
	const toolNames = params.toolNames ?? ["exec", "process"];
	const diagnostics = createToolAccessDiagnostics({
		profiles: policy.profiles,
		toolNames
	});
	applyToolPolicyPipeline({
		tools: toolNames.map((name) => ({ name })),
		toolMeta: () => void 0,
		warn: () => void 0,
		steps: buildDefaultToolPolicyPipelineSteps({
			...policy,
			profilePolicy: mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(policy.profile), policy.profileAlsoAllow),
			providerProfilePolicy: mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(policy.providerProfile), policy.providerProfileAlsoAllow)
		}),
		onFilter: diagnostics.onFilter
	});
	return diagnostics.finish();
}
//#endregion
export { resolveConfiguredToolAccess as n, createToolAccessDiagnostics as t };
