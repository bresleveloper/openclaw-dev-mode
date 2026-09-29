import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as formatExternalSupervisorActionRequired } from "./gateway-supervision-dG8swyHC.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { p as resolveConfigSnapshotHash } from "./io.read-helpers-N26RjV2V.mjs";
import { o as validateConfigObjectWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { c as readConfigFileSnapshot, d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { g as isReservedSystemAgentId } from "./agent-database-admission-BFwcs62N.mjs";
import { o as sameSetupConfiguredRoute, r as projectInferenceRoute, s as sameSetupInferenceRoute, t as assertSetupTarget } from "./inference-route-BPA-rq9w.mjs";
import { c as resolveOnboardingAgentTarget, u as resolveSystemAgentOnboardingTarget } from "./onboard-agent-target-pGC2ybZv.mjs";
import { r as matchesLocalSetupWorkspace } from "./setup-recovery-CEuEvd06.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-config-snapshot.ts
function requireValidSystemAgentSetupSnapshot(snapshot) {
	if (snapshot.exists && !snapshot.valid) {
		const issue = snapshot.issues?.[0];
		const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
		throw new Error(`OpenClaw config ${shortenHomePath(snapshot.path)} is invalid${detail}. Fix it before running setup.`);
	}
	const sourceConfig = snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
	const runtimeConfig = snapshot.exists ? snapshot.runtimeConfig ?? snapshot.config : {};
	const reservedAgent = listAgentEntries(runtimeConfig).find((entry) => isReservedSystemAgentId(entry.id));
	if (reservedAgent) throw new Error(`Agent id "${normalizeAgentId(reservedAgent.id)}" is reserved for the system agent. Rename that configured agent, then retry setup.`);
	return {
		sourceConfig,
		runtimeConfig
	};
}
//#endregion
//#region src/system-agent/setup-apply.ts
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
function createQuickstartNotePrompter(runtime) {
	const unexpected = (kind) => {
		throw new Error(`openclaw setup hit an interactive ${kind} prompt; quickstart must not ask`);
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message, title) => {
			runtime.log(title ? `${title}: ${message}` : message);
		},
		select: async (params) => {
			if (params.initialValue !== void 0) return params.initialValue;
			return unexpected("select");
		},
		multiselect: async () => unexpected("multiselect"),
		text: async () => unexpected("text"),
		confirm: async (params) => params.initialValue ?? true,
		progress: (label) => {
			runtime.log(label);
			return {
				update: (message) => runtime.log(message),
				stop: (message) => {
					if (message) runtime.log(message);
				}
			};
		}
	};
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
async function applySystemAgentSetup(params, hooks) {
	const { workspace, expectedAgentId, expectedAgentDir, expectedModelRef, expectedConfigHash, finalizeConfig, assertCommitPreconditions, surface, runtime } = params;
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	const beforePersistentApply = hooks?.beforePersistentApply;
	const [{ readSetupConfigFileSnapshot, resolveQuickstartGatewayDefaults }, onboardHelpers, { applyLocalSetupWorkspaceConfig, resolveOnboardingWorkspaceConflict }, { transformConfigWithPendingPluginInstalls }] = await Promise.all([
		import("./setup.shared-iQVFZJd6.mjs"),
		import("./onboard-helpers-Bs3xm5rG.mjs"),
		import("./onboard-config-luhByLu5.mjs"),
		import("./install-record-commit-Beb9YGNI.mjs")
	]);
	let snapshot = await readSetupConfigFileSnapshot();
	let snapshotConfig = requireValidSystemAgentSetupSnapshot(snapshot);
	assertCommitPreconditions?.(snapshotConfig.sourceConfig);
	const configHashBefore = resolveConfigSnapshotHash(snapshot);
	const startedWithoutAuthoredRoster = !hasResolvedRosterBeforeMigrations(snapshot);
	if (params.firstAgent?.team && !startedWithoutAuthoredRoster) throw new Error("The requested team was not created because an agent roster already exists. Use `openclaw agents team create` to add a team.");
	const onboardingSourceConfig = snapshot.sourceConfigBeforeMigrations ?? snapshotConfig.sourceConfig;
	const initialWorkspaceConflict = resolveOnboardingWorkspaceConflict(onboardingSourceConfig, workspace);
	const setupWorkspace = initialWorkspaceConflict && !params.allowWorkspaceChange ? initialWorkspaceConflict.currentWorkspaceDir : workspace;
	let teamCoordinatorId = params.teamCoordinatorId ?? (params.firstAgent?.team ? normalizeAgentId(params.firstAgent.name) : void 0);
	if (!teamCoordinatorId && assertCommitPreconditions) {
		const candidateId = resolveSystemAgentOnboardingTarget(snapshotConfig.runtimeConfig).agentId;
		if (await matchesLocalSetupWorkspace(snapshotConfig.runtimeConfig, setupWorkspace, candidateId)) teamCoordinatorId = candidateId;
	}
	let verifiedRoute = params.expectedInferenceRoute;
	let guardedExpectedAgentId = expectedAgentId;
	let guardedExpectedAgentDir = expectedAgentDir;
	let sessionMigrationWarnings = [];
	let coordinatorId;
	const resolveSetupTarget = (config) => coordinatorId ? resolveOnboardingAgentTarget(config, coordinatorId) : resolveSystemAgentOnboardingTarget(config);
	if (hasExpectedConfigHash && resolveConfigSnapshotHash(snapshot) !== expectedConfigHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
	let guardModules = expectedAgentId || expectedAgentDir || expectedModelRef ? await Promise.all([import("./agent-scope-C4CYkKyC.mjs"), import("./model-selection-D5bTO0w2.mjs")]) : void 0;
	const assertExpectedTarget = (config) => {
		if (!guardModules) return;
		assertSetupTarget({
			config,
			expectedAgentId: guardedExpectedAgentId,
			expectedAgentDir: guardedExpectedAgentDir,
			expectedModelRef,
			resolveAgentDir: guardModules[0].resolveAgentDir,
			resolveDefaultAgentId: (currentConfig) => resolveSetupTarget(currentConfig).agentId,
			resolveDefaultModelForAgent: guardModules[1].resolveDefaultModelForAgent
		});
	};
	assertExpectedTarget(snapshotConfig.runtimeConfig);
	const assertVerifiedRoute = async (setupSnapshot, expectedRoute = verifiedRoute, phase = "before", ignoreAgentIdentity = false) => {
		if (!expectedRoute) return;
		const verifiedSnapshot = await readConfigFileSnapshot();
		const setupSource = setupSnapshot.exists ? setupSnapshot.sourceConfig ?? setupSnapshot.config : {};
		const verifiedSource = verifiedSnapshot.exists ? verifiedSnapshot.sourceConfig ?? verifiedSnapshot.config : {};
		const currentRoute = verifiedSnapshot.exists && verifiedSnapshot.valid && verifiedSnapshot.path === setupSnapshot.path && verifiedSnapshot.hash === setupSnapshot.hash && isDeepStrictEqual(verifiedSource, setupSource) ? await projectInferenceRoute(verifiedSnapshot.runtimeConfig ?? verifiedSnapshot.config, coordinatorId) : null;
		if (!currentRoute || !sameSetupInferenceRoute(currentRoute, expectedRoute, ignoreAgentIdentity)) throw new Error(phase === "before" ? "The default-agent inference route changed before setup could start, so no workspace or Gateway settings were changed. Retry setup from the current OpenClaw session." : "The default-agent inference route changed after the config write, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
		return currentRoute;
	};
	await assertVerifiedRoute(snapshot);
	let expectedWriteHash = expectedConfigHash;
	if (startedWithoutAuthoredRoster) {
		const { ensureOnboardingAgent } = await import("./onboard-agent-wGih_UzJ.mjs");
		beforePersistentApply?.();
		const created = await ensureOnboardingAgent({
			config: onboardingSourceConfig,
			workspace: setupWorkspace,
			baseConfig: onboardingSourceConfig,
			firstAgent: params.firstAgent ?? { name: "main" },
			expectedConfigHash: configHashBefore ?? null,
			beforePersistentApply
		});
		if (!created.createdAgent || !created.configHash) throw new Error("OpenClaw did not create the approved first agent because the roster changed. Retry setup.");
		snapshot = await readSetupConfigFileSnapshot();
		snapshotConfig = requireValidSystemAgentSetupSnapshot(snapshot);
		assertCommitPreconditions?.(snapshotConfig.sourceConfig);
		if ((resolveConfigSnapshotHash(snapshot) ?? null) !== created.configHash) throw new Error("OpenClaw config changed after first-agent creation. Retry setup.");
		const createdRoster = listAgentEntries(snapshotConfig.sourceConfig);
		const expectedAgentIds = created.createdAgentIds ?? [created.agentId];
		if (createdRoster.length !== expectedAgentIds.length || createdRoster.some((entry) => !expectedAgentIds.includes(normalizeAgentId(entry.id)))) throw new Error("OpenClaw first-agent ownership changed during setup. Retry setup.");
		coordinatorId = params.firstAgent?.team ? created.agentId : void 0;
		verifiedRoute = await assertVerifiedRoute(snapshot, verifiedRoute, "before", true) ?? verifiedRoute;
		guardModules ??= await Promise.all([import("./agent-scope-C4CYkKyC.mjs"), import("./model-selection-D5bTO0w2.mjs")]);
		guardedExpectedAgentId = created.agentId;
		guardedExpectedAgentDir = guardModules[0].resolveAgentDir(snapshotConfig.runtimeConfig, created.agentId);
		assertExpectedTarget(snapshotConfig.runtimeConfig);
		expectedWriteHash = created.configHash;
		sessionMigrationWarnings = created.sessionMigrationWarnings ?? [];
	}
	const prompter = createQuickstartNotePrompter(runtime);
	const { configureGatewayForSetup } = await import("./setup.gateway-config-DpGI7Ekg.mjs");
	const buildSetupCandidate = async (currentBaseConfig, hasAuthoredRosterEntries) => {
		const roster = listAgentEntries(currentBaseConfig);
		const currentHasRoster = hasAuthoredRosterEntries && roster.length > 0;
		const allowWorkspaceWrite = params.allowWorkspaceChange || !currentHasRoster;
		let setupBaseConfig = currentBaseConfig;
		if (currentHasRoster) {
			const { list: _legacyList, ...agents } = setupBaseConfig.agents ?? {};
			setupBaseConfig = {
				...setupBaseConfig,
				agents: {
					...agents,
					entries: toAgentEntriesRecord(roster)
				}
			};
		}
		const preserveWorkspace = currentHasRoster && !params.allowWorkspaceChange;
		if (preserveWorkspace) {
			const defaults = { ...setupBaseConfig.agents?.defaults };
			const currentDefaults = currentBaseConfig.agents?.defaults;
			if (currentDefaults && Object.hasOwn(currentDefaults, "workspace")) defaults.workspace = currentDefaults.workspace;
			else delete defaults.workspace;
			setupBaseConfig = {
				...setupBaseConfig,
				agents: {
					...setupBaseConfig.agents,
					defaults
				}
			};
		}
		let candidate = applyLocalSetupWorkspaceConfig(setupBaseConfig, setupWorkspace, {
			allowWorkspaceChange: allowWorkspaceWrite,
			preserveWorkspace
		});
		candidate = applySecurityAcknowledgement(candidate);
		const gateway = await configureGatewayForSetup({
			flow: "quickstart",
			baseConfig: currentBaseConfig,
			nextConfig: candidate,
			localPort: resolveGatewayPort(currentBaseConfig),
			quickstartGateway: resolveQuickstartGatewayDefaults(currentBaseConfig),
			prompter,
			runtime
		});
		return {
			nextConfig: onboardHelpers.applyWizardMetadata(gateway.nextConfig, {
				command: "onboard",
				mode: "local"
			}),
			settings: gateway.settings
		};
	};
	beforePersistentApply?.();
	const committed = await transformConfigWithPendingPluginInstalls({
		afterWrite: { mode: "auto" },
		writeOptions: {
			auditOrigin: "system-agent",
			allowConfigSizeDrop: false,
			assertConfigPathForWrite: beforePersistentApply
		},
		transform: async (currentConfig, context) => {
			const currentSnapshot = requireValidSystemAgentSetupSnapshot(context.snapshot);
			if ((hasExpectedConfigHash || startedWithoutAuthoredRoster) && context.previousHash !== expectedWriteHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
			await assertVerifiedRoute(context.snapshot);
			assertExpectedTarget(currentSnapshot.runtimeConfig);
			const setupCandidate = await buildSetupCandidate(currentConfig, startedWithoutAuthoredRoster ? false : hasResolvedRosterBeforeMigrations(context.snapshot));
			const finalizedConfig = finalizeConfig ? finalizeConfig(setupCandidate.nextConfig, currentSnapshot.sourceConfig) : setupCandidate.nextConfig;
			const expectedSourceRoute = verifiedRoute ? await projectInferenceRoute(finalizedConfig, coordinatorId) : void 0;
			if (verifiedRoute && (!verifiedRoute.route || !expectedSourceRoute?.route || !sameSetupConfiguredRoute(expectedSourceRoute.route, verifiedRoute.route, false))) throw new Error("The setup candidate no longer preserves the exact verified inference route, so it was not saved. Retry setup from the current OpenClaw session.");
			if (assertCommitPreconditions) {
				const matchesWorkspace = await matchesLocalSetupWorkspace(finalizedConfig, setupWorkspace, teamCoordinatorId);
				assertCommitPreconditions(currentSnapshot.sourceConfig);
				if (!matchesWorkspace) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
			}
			return {
				nextConfig: finalizedConfig,
				result: { settings: setupCandidate.settings }
			};
		}
	});
	const nextConfig = committed.nextConfig;
	const settings = committed.result?.settings;
	if (!settings) throw new Error("OpenClaw setup committed without resolved Gateway settings.");
	const onboardingTarget = resolveSetupTarget(nextConfig);
	const effectiveWorkspace = onboardingTarget.workspaceDir;
	if (verifiedRoute) {
		const afterRead = await readConfigFileSnapshotWithPluginMetadata();
		const afterSnapshot = afterRead.snapshot;
		requireValidSystemAgentSetupSnapshot(afterSnapshot);
		const expectedRuntime = validateConfigObjectWithPlugins(committed.nextConfig, {
			env: process.env,
			pluginMetadataSnapshot: afterRead.pluginMetadataSnapshot
		});
		if (!expectedRuntime.ok) {
			const issue = expectedRuntime.issues[0];
			const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
			throw new Error(`OpenClaw could not validate the setup route after its config write${detail}. No further setup effects were applied. Retry setup from the current OpenClaw session.`);
		}
		const expectedPersistedRoute = await projectInferenceRoute(expectedRuntime.config, coordinatorId);
		await assertVerifiedRoute(afterSnapshot, expectedPersistedRoute, "after");
		if (!sameSetupConfiguredRoute(expectedPersistedRoute.route, verifiedRoute.route, false)) throw new Error("The materialized inference route no longer matches the exact verified route, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
	}
	const lines = [...sessionMigrationWarnings, `Workspace: ${shortenHomePath(effectiveWorkspace)}`];
	const runCommittedFollowUp = async (effect, onFailure) => {
		beforePersistentApply?.();
		try {
			return await effect();
		} catch (error) {
			beforePersistentApply?.();
			onFailure(error);
			return;
		}
	};
	const effectiveAgentId = onboardingTarget.agentId;
	const workspaceResult = await runCommittedFollowUp(async () => await onboardHelpers.ensureWorkspaceAndSessions(effectiveWorkspace, runtime, {
		agentId: effectiveAgentId,
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
		beforePersistentApply
	}), (error) => lines.push(`Workspace files: ${formatErrorMessage(error)}`));
	await runCommittedFollowUp(async () => {
		const { updateExecApprovals } = await import("./exec-approvals-CcP_Znli.mjs");
		beforePersistentApply?.();
		await updateExecApprovals({ update: (approvals) => approvals.agents?.openclaw ? null : {
			...approvals,
			agents: {
				...approvals.agents,
				openclaw: {
					security: "full",
					ask: "off"
				}
			}
		} });
	}, (error) => lines.push(`OpenClaw exec approval: ${formatErrorMessage(error)}; local model harnesses may ask again.`));
	let gateway = {
		status: "ready",
		action: "reused"
	};
	if (surface === "cli") await runCommittedFollowUp(async () => {
		const { ensureGatewayServiceForOnboarding } = await import("./setup.finalize-Bs_9Vhui.mjs");
		beforePersistentApply?.();
		gateway = (await ensureGatewayServiceForOnboarding({
			flow: "quickstart",
			opts: { installDaemon: params.installDaemon },
			nextConfig,
			settings,
			prompter,
			runtime,
			loadedAction: params.resume ? "resume" : "restart"
		})).gateway;
		if (gateway.status === "failed") lines.push(`Gateway service: ${gateway.error}`);
		else if (gateway.status === "ready") {
			const probeLinks = onboardHelpers.resolveLocalControlUiProbeLinks({
				bind: settings.bind,
				port: settings.port,
				customBindHost: settings.customBindHost,
				basePath: void 0,
				tlsEnabled: nextConfig.gateway?.tls?.enabled === true
			});
			const probe = await onboardHelpers.waitForGatewayReachable({
				url: probeLinks.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				password: settings.authMode === "password" ? await (await import("./setup.secret-input-CjLX3VWq.mjs")).resolveSetupSecretInputString({
					config: nextConfig,
					value: nextConfig.gateway?.auth?.password,
					path: "gateway.auth.password",
					env: process.env
				}) : void 0,
				...gateway.action === "reused" ? { deadlineMs: 15e3 } : resolveGatewayStartupTiming()
			});
			if (probe.ok) lines.push(`Gateway: running at ${probeLinks.wsUrl}`);
			else {
				const detail = probe.detail ?? "still starting";
				gateway = {
					status: "failed",
					error: `Gateway is not reachable yet (${detail}).`
				};
				lines.push(`Gateway: not reachable yet (${detail}) — say \`gateway status\` to check`);
			}
		} else if (gateway.reason === "external") lines.push(`Gateway: ${formatExternalSupervisorActionRequired("start the gateway")}`);
		else if (params.installDaemon === false) lines.push("Gateway: service installation skipped. Run `openclaw gateway run` to start it in the foreground.");
		else lines.push("Gateway: service install skipped — say `start gateway` when you want it running.");
	}, (error) => {
		const message = formatErrorMessage(error);
		gateway = {
			status: "failed",
			error: message
		};
		lines.push(`Gateway service: ${message}`);
	});
	else lines.push("Gateway: running (managed by this app).");
	return {
		configPath: committed.path,
		configHashBefore,
		configHashAfter: committed.persistedHash,
		bootstrapPending: workspaceResult?.bootstrapPending === true,
		workspaceReady: workspaceResult !== void 0,
		gateway,
		lines
	};
}
//#endregion
export { createQuickstartNotePrompter as n, applySystemAgentSetup as t };
