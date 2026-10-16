import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as resolveAgentEntry, p as resolveAmbientOwnerAgentId, x as toAgentEntriesRecord } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { t as applyImplicitAgentRosterDefaults } from "./implicit-agent-roster-D39ONJLa.mjs";
import { t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { r as hasResolvedRosterBeforeMigrations, t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-CHtmWQjc.mjs";
import fs from "node:fs/promises";
//#region src/commands/setup.ts
/**
* Minimal setup command.
*
* Ensures config, default workspace, and session directories exist without
* running the full onboarding wizard.
*/
const loadAgentWorkspaceModule = createLazyPromise(() => import("./workspace-DBG3_Hy1.mjs"));
const loadConfigIOModule = createLazyPromise(() => import("./config/config.js"));
const loadConfigLoggingModule = createLazyPromise(() => import("./logging-n-0MDc5D.mjs"));
/** Prepares config, workspace, and session directories for a usable installation. */
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const { createConfigIO, replaceConfigFile } = await loadConfigIOModule();
	const io = createConfigIO();
	const configPath = io.configPath;
	const prepared = await io.readConfigFileSnapshotForWrite();
	const snapshot = prepared.snapshot;
	if (snapshot.exists && !snapshot.valid) {
		if (opts?.json) {
			const [{ formatCliJsonFailure }, { normalizeConfigIssues }] = await Promise.all([import("./failure-output-CKN7Q5cE.mjs"), import("./issue-format-Bj4Iwq7G.mjs")]);
			writeRuntimeJson(runtime, {
				...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(configPath)}`),
				issues: normalizeConfigIssues(snapshot.issues)
			});
		}
		runtime.error(`Config invalid at ${(await loadConfigLoggingModule()).formatConfigFilePath(configPath)}. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run setup.`);
		runtime.exit(1);
		return;
	}
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
	const workspace = desiredWorkspace ?? configuredWorkspace ?? (await loadAgentWorkspaceModule()).DEFAULT_AGENT_WORKSPACE_DIR;
	const shouldWriteWorkspace = !snapshot.exists || desiredWorkspace !== void 0 && configuredWorkspace !== workspace;
	const shouldWriteGatewayMode = resolvedConfig.gateway?.mode === void 0;
	const writeInheritedGatewayModeOverride = shouldWriteGatewayMode && isInheritedPath(["gateway", "mode"]);
	const writeInheritedWorkspaceOverride = snapshot.exists && shouldWriteWorkspace && !defaultEntryWorkspace && isInheritedPath([
		"agents",
		"defaults",
		"workspace"
	]);
	let next = snapshot.exists ? resolvedConfig : cfg;
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
	let creationConfigHash;
	if (!snapshot.exists) {
		const { ensureOnboardingAgent } = await import("./onboard-agent-Ck7FknBa.mjs");
		const onboardingAgent = await ensureOnboardingAgent({
			config: next,
			workspace,
			baseConfig: cfg,
			expectedConfigHash: snapshot.hash ?? null
		});
		next = onboardingAgent.config;
		creationConfigHash = onboardingAgent.configHash;
		for (const warning of onboardingAgent.sessionMigrationWarnings ?? []) runtime.log(`Warning: ${warning}`);
	}
	const configChanged = !snapshot.exists || shouldPersistRoster || shouldWriteWorkspace || shouldWriteGatewayMode || shouldWriteSkipBootstrap;
	let configStatus;
	if (configChanged) {
		const explicitSetPaths = [];
		if (snapshot.exists && shouldPersistRoster) explicitSetPaths.push(["agents", "entries"]);
		if (writeInheritedWorkspaceOverride) explicitSetPaths.push([
			"agents",
			"defaults",
			"workspace"
		]);
		if (shouldWriteSkipBootstrap) explicitSetPaths.push(skipBootstrapPath);
		if (shouldWriteGatewayMode) explicitSetPaths.push(["gateway", "mode"]);
		await replaceConfigFile({
			nextConfig: next,
			...creationConfigHash ? { baseHash: creationConfigHash } : { snapshot },
			afterWrite: { mode: "auto" },
			writeOptions: {
				...prepared.writeOptions,
				explicitSetPaths,
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
			}
		});
		configStatus = snapshot.exists ? "updated" : "created";
		if (!opts?.json && !snapshot.exists) runtime.log(`Wrote ${(await loadConfigLoggingModule()).formatConfigFilePath(configPath)}`);
		else if (!opts?.json) {
			const updates = [];
			if (shouldWriteWorkspace) updates.push("set agents.defaults.workspace");
			if (shouldWriteGatewayMode) updates.push("set gateway.mode");
			if (shouldWriteSkipBootstrap) updates.push("set agents.defaults.skipBootstrap");
			const suffix = updates.length > 0 ? `(${updates.join(", ")})` : void 0;
			(await loadConfigLoggingModule()).logConfigUpdated(runtime, {
				path: configPath,
				suffix
			});
		}
	} else {
		configStatus = "unchanged";
		if (!opts?.json) runtime.log(`Config OK: ${(await loadConfigLoggingModule()).formatConfigFilePath(configPath)}`);
	}
	const ws = await (await loadAgentWorkspaceModule()).ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !skipBootstrap,
		skipOptionalBootstrapFiles: resolvedDefaults.skipOptionalBootstrapFiles
	});
	if (!opts?.json) runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const { resolveSessionTranscriptsDirForAgent } = await import("./sessions-DtX3fs0m.mjs");
	const sessionsDir = resolveSessionTranscriptsDirForAgent(selectedAgentId);
	await fs.mkdir(sessionsDir, { recursive: true });
	if (opts?.json) {
		writeRuntimeJson(runtime, {
			ok: true,
			configPath,
			configStatus,
			workspaceDir: ws.dir,
			sessionsDir
		});
		return;
	}
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
	runtime.log("");
	runtime.log("Setup complete: config, workspace, and session directories are ready.");
	runtime.log(`Next guided path: ${formatCliCommand("openclaw onboard")}.`);
	runtime.log(`Next targeted changes: ${formatCliCommand("openclaw configure")} for models, channels, Gateway, plugins, skills, and health checks.`);
	runtime.log(`Add a chat channel later: ${formatCliCommand("openclaw channels add")}.`);
}
//#endregion
export { setupCommand };
