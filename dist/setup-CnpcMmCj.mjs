import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { S as toAgentEntriesRecord, m as resolveAmbientOwnerAgentId, o as resolveAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { t as applyImplicitAgentRosterDefaults } from "./implicit-agent-roster-D39ONJLa.mjs";
import { t as getConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { r as hasResolvedRosterBeforeMigrations, t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-COeXJqiY.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/setup.ts
async function setupCommand(opts, runtime = defaultRuntime) {
	return await runWithLocalStateOwner({
		method: "setup",
		params: {},
		target: "agent roster and workspace",
		onForeignOwner: (scope) => setupWithGatewayOwner(opts, runtime, scope),
		runLocal: () => setupUnderOwner(opts, runtime)
	});
}
async function readSetupConfig(opts, runtime, read) {
	const { createConfigIO } = await import("./config/config.js");
	const io = createConfigIO();
	const prepared = await io.readConfigFileSnapshotForWrite(read);
	const snapshot = prepared.snapshot;
	if (!snapshot.exists || snapshot.valid) return {
		...prepared,
		configPath: io.configPath
	};
	if (opts?.json) {
		const [{ formatCliJsonFailure }, { normalizeConfigIssues }] = await Promise.all([import("./failure-output-DuWfXOiW.mjs"), import("./issue-format-BthLOJ3-.mjs")]);
		writeRuntimeJson(runtime, {
			...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(io.configPath)}`),
			issues: normalizeConfigIssues(snapshot.issues)
		});
	}
	runtime.error(`Config invalid at ${(await import("./logging-pCROUbfb.mjs")).formatConfigFilePath(io.configPath)}. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run setup.`);
	runtime.exit(1);
}
/** The config change setup owns, shared by the offline writer and the Gateway-routed patch. */
async function planSetupConfig(snapshot, opts) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const resolvedConfig = snapshot.config;
	const shouldPersistRoster = !snapshot.exists || !hasResolvedRosterBeforeMigrations(snapshot) && !configIncludeOwnsAgentRoster(snapshot);
	const cfg = shouldPersistRoster ? applyImplicitAgentRosterDefaults(snapshot.sourceConfig) : snapshot.sourceConfig;
	const authoredDefaults = cfg.agents?.defaults ?? {};
	const resolvedDefaults = resolvedConfig.agents?.defaults ?? authoredDefaults;
	const skipBootstrap = opts?.skipBootstrap === true || resolvedDefaults.skipBootstrap === true;
	const shouldWriteSkipBootstrap = opts?.skipBootstrap === true && resolvedDefaults.skipBootstrap !== true;
	const skipBootstrapPath = [
		"agents",
		"defaults",
		"skipBootstrap"
	];
	if (shouldWriteSkipBootstrap && snapshot.includeProvenance?.some(({ path }) => path.length === skipBootstrapPath.length && path.every((part, index) => part === skipBootstrapPath[index]))) throw new Error("Baseline setup cannot override an included agents.defaults.skipBootstrap value. Edit the included file directly.");
	const isInheritedPath = (defaultPath) => {
		return isRecord(snapshot.parsed) && getConfigValueAtPath(snapshot.parsed, defaultPath) === void 0 && snapshot.includeProvenance?.some(({ path }) => path.length < defaultPath.length && path.every((part, index) => part === defaultPath[index])) === true;
	};
	const writeInheritedSkipBootstrapOverride = shouldWriteSkipBootstrap && isInheritedPath(skipBootstrapPath);
	const selectedAgentId = resolveAmbientOwnerAgentId(resolvedConfig, void 0, {
		surface: "baseline setup",
		hint: "Set agents.defaults.systemAgent.agentId."
	});
	const defaultEntryWorkspace = resolveAgentEntry(resolvedConfig, selectedAgentId)?.workspace?.trim();
	const configuredWorkspace = defaultEntryWorkspace || resolvedDefaults.workspace;
	const workspace = desiredWorkspace ?? configuredWorkspace ?? (await import("./workspace-BwFahBIw.mjs")).DEFAULT_AGENT_WORKSPACE_DIR;
	const shouldWriteWorkspace = !snapshot.exists || desiredWorkspace !== void 0 && configuredWorkspace !== workspace;
	const shouldWriteGatewayMode = resolvedConfig.gateway?.mode === void 0;
	const writeInheritedGatewayModeOverride = shouldWriteGatewayMode && isInheritedPath(["gateway", "mode"]);
	const writeInheritedWorkspaceOverride = snapshot.exists && shouldWriteWorkspace && !defaultEntryWorkspace && isInheritedPath([
		"agents",
		"defaults",
		"workspace"
	]);
	const applyWrites = (base) => {
		let next = base;
		if (shouldPersistRoster) next = {
			...next,
			agents: {
				...next.agents,
				entries: toAgentEntriesRecord(listAgentEntries(cfg))
			}
		};
		if (shouldWriteWorkspace && !writeInheritedWorkspaceOverride) {
			const roster = structuredClone(listAgentEntries(next));
			if (snapshot.exists && defaultEntryWorkspace) {
				for (const entry of roster) if (normalizeAgentId(entry.id) === selectedAgentId) entry.workspace = workspace;
			}
			const entries = roster.length > 0 ? toAgentEntriesRecord(roster) : void 0;
			next = {
				...next,
				agents: {
					...next.agents,
					defaults: {
						...next.agents?.defaults,
						workspace
					},
					...entries ? { entries } : {}
				}
			};
		}
		if (shouldWriteGatewayMode && !writeInheritedGatewayModeOverride) next = {
			...next,
			gateway: {
				...next.gateway,
				mode: "local"
			}
		};
		if (shouldWriteSkipBootstrap && !writeInheritedSkipBootstrapOverride) next = {
			...next,
			agents: {
				...next.agents,
				defaults: {
					...next.agents?.defaults,
					skipBootstrap: true
				}
			}
		};
		return next;
	};
	const explicitSetPaths = [];
	if (snapshot.exists && shouldPersistRoster) explicitSetPaths.push(["agents", "entries"]);
	if (writeInheritedWorkspaceOverride) explicitSetPaths.push([
		"agents",
		"defaults",
		"workspace"
	]);
	if (shouldWriteSkipBootstrap) explicitSetPaths.push(skipBootstrapPath);
	if (shouldWriteGatewayMode) explicitSetPaths.push(["gateway", "mode"]);
	const updates = [];
	if (shouldWriteWorkspace) updates.push("set agents.defaults.workspace");
	if (shouldWriteGatewayMode) updates.push("set gateway.mode");
	if (shouldWriteSkipBootstrap) updates.push("set agents.defaults.skipBootstrap");
	return {
		cfg,
		workspace,
		selectedAgentId,
		skipBootstrap,
		skipOptionalBootstrapFiles: resolvedDefaults.skipOptionalBootstrapFiles,
		applyWrites,
		configChanged: !snapshot.exists || shouldPersistRoster || shouldWriteWorkspace || shouldWriteGatewayMode || shouldWriteSkipBootstrap,
		updateSuffix: updates.length > 0 ? `(${updates.join(", ")})` : void 0,
		explicitSetPaths,
		writesInheritedOverride: writeInheritedWorkspaceOverride || writeInheritedGatewayModeOverride || writeInheritedSkipBootstrapOverride,
		explicitSetValueSource: {
			...shouldWriteGatewayMode ? { gateway: { mode: "local" } } : {},
			agents: {
				...snapshot.exists && shouldPersistRoster ? { entries: cfg.agents?.entries } : {},
				defaults: {
					...writeInheritedWorkspaceOverride ? { workspace } : {},
					...shouldWriteSkipBootstrap ? { skipBootstrap: true } : {}
				}
			}
		},
		allowIncludeAncestorExplicitSetPaths: writeInheritedWorkspaceOverride || shouldWriteSkipBootstrap || shouldWriteGatewayMode
	};
}
async function setupUnderOwner(opts, runtime) {
	const prepared = await readSetupConfig(opts, runtime);
	if (!prepared) return;
	const { snapshot, configPath } = prepared;
	const plan = await planSetupConfig(snapshot, opts);
	const { workspace, selectedAgentId } = plan;
	let next = plan.applyWrites(snapshot.exists ? snapshot.config : plan.cfg);
	let creationConfigHash;
	if (!snapshot.exists) {
		const { ensureOnboardingAgent } = await import("./onboard-agent-ZZ4T2b03.mjs");
		const onboardingAgent = await ensureOnboardingAgent({
			config: next,
			workspace,
			baseConfig: plan.cfg,
			expectedConfigHash: snapshot.hash ?? null
		});
		next = onboardingAgent.config;
		creationConfigHash = onboardingAgent.configHash;
		for (const warning of onboardingAgent.sessionMigrationWarnings ?? []) runtime.log(`Warning: ${warning}`);
	}
	if (plan.configChanged) {
		const { replaceConfigFile } = await import("./config/config.js");
		await replaceConfigFile({
			nextConfig: next,
			...creationConfigHash ? { baseHash: creationConfigHash } : { snapshot },
			afterWrite: { mode: "auto" },
			writeOptions: {
				...prepared.writeOptions,
				explicitSetPaths: plan.explicitSetPaths,
				explicitSetValueSource: plan.explicitSetValueSource,
				allowIncludeAncestorExplicitSetPaths: plan.allowIncludeAncestorExplicitSetPaths
			}
		});
		if (!opts?.json && !snapshot.exists) runtime.log(`Wrote ${(await import("./logging-pCROUbfb.mjs")).formatConfigFilePath(configPath)}`);
		else if (!opts?.json) (await import("./logging-pCROUbfb.mjs")).logConfigUpdated(runtime, {
			path: configPath,
			suffix: plan.updateSuffix
		});
	} else if (!opts?.json) runtime.log(`Config OK: ${(await import("./logging-pCROUbfb.mjs")).formatConfigFilePath(configPath)}`);
	const ws = await (await import("./workspace-BwFahBIw.mjs")).ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !plan.skipBootstrap,
		skipOptionalBootstrapFiles: plan.skipOptionalBootstrapFiles
	});
	if (!opts?.json) runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = await ensureSessionsDir(selectedAgentId);
	finishSetup(opts, runtime, {
		configPath,
		configStatus: plan.configChanged ? snapshot.exists ? "updated" : "created" : "unchanged",
		workspaceDir: ws.dir,
		sessionsDir
	});
}
/**
* A running Gateway owns config, the state database and workspace setup state. Setup sends
* only its config change, as the offline writer would save it, through config.patch. The
* Gateway seeds the workspace when the agent first runs.
*/
async function setupWithGatewayOwner(opts, runtime, scope) {
	const { bindConfigOwner, prepareConfigOwnerChange } = await import("./config-cli-owner-patch-DoIT5Cd_.mjs");
	const commit = await bindConfigOwner(scope.requestOwner, scope.env);
	const prepared = await readSetupConfig(opts, runtime, { observe: false });
	if (!prepared) return;
	const { snapshot, configPath, writeOptions } = prepared;
	const offlineOnly = (reason) => /* @__PURE__ */ new Error(`${reason} Nothing was sent and no settings were saved. Stop the Gateway through its service owner, wait for ownership to release, then rerun this exact command.`);
	if (!snapshot.exists) throw offlineOnly("The running Gateway has no config file, so setup must create it offline.");
	const plan = await planSetupConfig(snapshot, opts);
	if (plan.writesInheritedOverride) throw offlineOnly("Setup would override a value inherited from an included config file.");
	let configChanged = plan.configChanged;
	let restartHint;
	if (configChanged) {
		const [{ assertConfigWriteAllowedInCurrentMode }, { prepareConfigWriteValues }] = await Promise.all([import("./config-write-guard-BgXOVsHJ.mjs"), import("./io.write-prepare-CddBxehs.mjs")]);
		assertConfigWriteAllowedInCurrentMode({ configPath: snapshot.path });
		const env = writeOptions.envSnapshotForRestore ?? process.env;
		const author = (nextConfig, explicitSetPaths) => prepareConfigWriteValues({
			snapshot,
			nextConfig,
			explicitSetPaths,
			env
		}).authoredConfig;
		const change = await prepareConfigOwnerChange({
			snapshot,
			pluginMetadataSnapshot: writeOptions.basePluginMetadataSnapshot,
			previous: author(snapshot.resolved),
			next: author(plan.applyWrites(snapshot.resolved), plan.explicitSetPaths),
			explicitSetPaths: plan.explicitSetPaths,
			unsetPaths: [],
			env
		});
		configChanged = !isDeepStrictEqual(change.previous, change.next);
		if (configChanged) restartHint = await commit(change);
	}
	if (!opts?.json) {
		const logging = await import("./logging-pCROUbfb.mjs");
		if (configChanged) logging.logConfigUpdated(runtime, {
			path: configPath,
			suffix: plan.updateSuffix
		});
		else runtime.log(`Config OK: ${logging.formatConfigFilePath(configPath)}`);
		if (restartHint) runtime.log(restartHint);
		runtime.log(`Workspace: ${shortenHomePath(resolveUserPath(plan.workspace))} (owned by the running Gateway, which seeds missing files on the agent's first run)`);
	}
	finishSetup(opts, runtime, {
		configPath,
		configStatus: configChanged ? "updated" : "unchanged",
		workspaceDir: resolveUserPath(plan.workspace),
		sessionsDir: await ensureSessionsDir(plan.selectedAgentId)
	});
}
async function ensureSessionsDir(agentId) {
	const { resolveSessionTranscriptsDirForAgent } = await import("./sessions-CijCbMrK.mjs");
	const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
	await fs.mkdir(sessionsDir, { recursive: true });
	return sessionsDir;
}
function finishSetup(opts, runtime, result) {
	if (opts?.json) {
		writeRuntimeJson(runtime, {
			ok: true,
			...result
		});
		return;
	}
	runtime.log(`Sessions OK: ${shortenHomePath(result.sessionsDir)}`);
	runtime.log("");
	runtime.log("Setup complete: config, workspace, and session directories are ready.");
	runtime.log(`Next guided path: ${formatCliCommand("openclaw onboard")}.`);
	runtime.log(`Next targeted changes: ${formatCliCommand("openclaw configure")} for models, channels, Gateway, plugins, skills, and health checks.`);
	runtime.log(`Add a chat channel later: ${formatCliCommand("openclaw channels add")}.`);
}
//#endregion
export { setupCommand };
