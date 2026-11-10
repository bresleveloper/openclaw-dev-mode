import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-BzVT3JSM.mjs";
import { c as resolveCliRuntimeExecutionProvider, i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { r as listModelCatalogObservedRoutes, t as createModelCatalogSnapshotView } from "./model-catalog-view-UkLRAY5C.mjs";
import { r as resolveAgentHarnessSelectionDecision } from "./selection-decision-CRh-vMBN.mjs";
import { n as resolveEmbeddedCliBackendDispatchEligibilityAsync } from "./cli-backend-dispatch-eligibility-BMWTSYsM.mjs";
import { i as preparedAgentRuntimeProfileAttemptHasCandidate, n as canRunPreparedAgentRuntimeAuthAttempt, r as prepareAgentRuntimeAuth } from "./prepare-auth-B180a1GD.mjs";
//#region src/agents/isolated-completion-route.ts
/** A CLI runtime ref canonicalizes to its model provider but keeps the CLI as its explicit owner. */
function resolveIsolatedCompletionProvider(params) {
	const canonicalProvider = resolveCliRuntimeCanonicalProvider({
		runtime: params.provider,
		config: params.config,
		includeSetupRegistry: true
	});
	const runtimeOverride = params.agentHarnessRuntimeOverride ?? (canonicalProvider ? params.provider : void 0);
	return {
		provider: canonicalProvider ?? params.provider,
		...runtimeOverride ? { runtimeOverride } : {}
	};
}
/** Harness selection plus the CLI backend, when one owns this completion instead of a harness. */
async function resolveIsolatedCompletionRoute(params) {
	const selection = resolveAgentHarnessSelectionDecision({
		provider: params.provider,
		modelId: params.model,
		config: params.config,
		agentId: params.agentId,
		agentHarnessRuntimeOverride: params.runtimeOverride
	});
	const runtime = params.runtimeOverride ?? selection.policy.runtime;
	if (isCliRuntimeAliasForProvider({
		runtime,
		provider: params.provider,
		cfg: params.config
	})) return {
		selection,
		cliOwner: runtime
	};
	if (params.explicitRuntimeOverride) return { selection };
	const cliOwner = resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.config,
		agentId: params.agentId,
		modelId: params.model,
		authProfileId: params.authProfileId,
		preparedAuthStore: params.preparedAuthStore
	}) ?? (await resolveEmbeddedCliBackendDispatchEligibilityAsync({
		provider: params.provider,
		model: params.model,
		agentId: params.agentId,
		authProfileId: params.authProfileId,
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		preparedAuthStore: params.preparedAuthStore
	}))?.provider;
	return cliOwner ? {
		selection,
		cliOwner
	} : { selection };
}
/** Scope profile checks and dispatch to the same single physical auth attempt. */
function selectIsolatedHarnessAuthAttempt(attempt) {
	if (attempt.kind !== "profile") return attempt;
	return {
		...attempt,
		plan: {
			...attempt.plan,
			forwardedAuthProfileId: attempt.profileId,
			forwardedAuthProfileCandidateIds: [attempt.profileId]
		}
	};
}
/** The auth planner owns this choice for both dispatch and its read-only projection. */
function resolveIsolatedCompletionAuthorizationOwner(plan) {
	return plan?.harnessAuthProvider && plan.modelRoute?.authRequirement !== "api-key" ? "harness" : "host";
}
/**
* Planned runtime for an isolated completion in the supplied prepared generation.
* Undefined when no owner or runnable auth attempt can serve the request.
*/
async function resolveIsolatedCompletionRuntime(params) {
	const config = params.config ?? {};
	try {
		const agentId = params.agentId ?? resolveDefaultAgentId(config);
		const { provider, runtimeOverride } = resolveIsolatedCompletionProvider({
			provider: params.provider,
			config,
			agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
		});
		const route = await resolveIsolatedCompletionRoute({
			config,
			provider,
			model: params.model,
			authProfileId: params.authProfileId,
			agentId,
			agentDir: params.agentDir ?? resolveAgentDir(config, agentId),
			workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId),
			runtimeOverride,
			explicitRuntimeOverride: params.agentHarnessRuntimeOverride,
			preparedAuthStore: params.preparedAuth?.preparedAuthStore
		});
		if (route.cliOwner) return {
			id: route.cliOwner,
			kind: "cli"
		};
		const { harness, selectedHarnessId } = route.selection;
		if (!harness) return {
			id: selectedHarnessId,
			kind: "api"
		};
		if (!harness.runIsolatedCompletionV2 && !harness.runIsolatedCompletion) return;
		if (harness.resolveIsolatedCompletionRuntime) {
			let authorizationOwner = "host";
			if (harness.runIsolatedCompletionV2 && harness.authBootstrap === "harness") {
				const prepared = params.preparedAuth;
				if (!prepared) return;
				const variants = createModelCatalogSnapshotView(config, prepared.snapshot).variantsOf({
					provider,
					id: params.model
				});
				const { attempts } = prepareAgentRuntimeAuth({
					provider,
					modelId: params.model,
					observedRoutes: variants ? listModelCatalogObservedRoutes(variants) : void 0,
					config,
					agentId,
					agentDir: params.agentDir,
					workspaceDir: params.workspaceDir,
					metadataSnapshot: prepared.metadataSnapshot,
					authProfileStore: prepared.preparedAuthStore,
					sessionAuthProfileId: params.authProfileId,
					sessionAuthProfileSource: params.authProfileId ? "user" : void 0,
					...params.authProfileId ? { allowAuthProfileFallback: false } : {},
					harnessId: harness.id,
					harnessRuntime: harness.id,
					harnessAuthBootstrap: harness.authBootstrap
				});
				const selectedAttempt = attempts.find((candidate) => {
					const attempt = selectIsolatedHarnessAuthAttempt(candidate);
					return canRunPreparedAgentRuntimeAuthAttempt({
						attempt,
						priorProfileAttempted: false
					}) && (attempt.kind !== "profile" || preparedAgentRuntimeProfileAttemptHasCandidate({
						attempt,
						store: prepared.preparedAuthStore,
						modelId: params.model
					}));
				});
				if (!selectedAttempt) return;
				authorizationOwner = resolveIsolatedCompletionAuthorizationOwner(selectedAttempt.plan);
			}
			if (harness.resolveIsolatedCompletionRuntime({ authorizationOwner }) === "openclaw") return {
				id: "openclaw",
				kind: "api"
			};
		}
		return {
			id: selectedHarnessId,
			kind: "harness",
			harnessLabel: harness.label
		};
	} catch {
		return;
	}
}
//#endregion
export { selectIsolatedHarnessAuthAttempt as a, resolveIsolatedCompletionRuntime as i, resolveIsolatedCompletionProvider as n, resolveIsolatedCompletionRoute as r, resolveIsolatedCompletionAuthorizationOwner as t };
