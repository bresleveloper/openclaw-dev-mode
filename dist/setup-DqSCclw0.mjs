import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries, d as resolveAmbientOwnerAgentId, o as resolveAgentEntry, v as toAgentEntriesRecord } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./legacy-2ovrASa7.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { r as hasResolvedRosterBeforeMigrations, t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import fs from "node:fs/promises";
//#region src/commands/setup.ts
/**
* Minimal setup command.
*
* Ensures config, default workspace, and session directories exist without
* running the full onboarding wizard.
*/
const loadAgentWorkspaceModule = createLazyPromise(() => import("./workspace-BOloB4w1.mjs"));
const loadConfigIOModule = createLazyPromise(() => import("./config/config.js"));
const loadConfigLoggingModule = createLazyPromise(() => import("./logging-B5OcKoGx.mjs"));
async function createDefaultConfigIO() {
	const { createConfigIO } = await loadConfigIOModule();
	return createConfigIO();
}
async function ensureDefaultAgentWorkspace(params) {
	const { ensureAgentWorkspace } = await loadAgentWorkspaceModule();
	return ensureAgentWorkspace(params);
}
async function writeDefaultConfigFile(params) {
	const { replaceConfigFile } = await loadConfigIOModule();
	await replaceConfigFile(params);
}
async function formatDefaultConfigPath(configPath) {
	const { formatConfigFilePath } = await loadConfigLoggingModule();
	return formatConfigFilePath(configPath);
}
async function logDefaultConfigUpdated(runtime, opts) {
	const { logConfigUpdated } = await loadConfigLoggingModule();
	logConfigUpdated(runtime, opts);
}
async function resolveDefaultSessionTranscriptsDir(agentId) {
	const { resolveSessionTranscriptsDirForAgent } = await import("./sessions-DI4gYxe-.mjs");
	return resolveSessionTranscriptsDirForAgent(agentId);
}
/** Prepares config, workspace, and session directories for a usable installation. */
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const io = await createDefaultConfigIO();
	const configPath = io.configPath;
	const prepared = await io.readConfigFileSnapshotForWrite();
	const snapshot = prepared.snapshot;
	if (snapshot.exists && !snapshot.valid) {
		if (opts?.json) {
			const [{ formatCliJsonFailure }, { normalizeConfigIssues }] = await Promise.all([import("./failure-output-Tnld8e4L.mjs"), import("./issue-format-q3XEPmIM.mjs")]);
			writeRuntimeJson(runtime, {
				...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(configPath)}`),
				issues: normalizeConfigIssues(snapshot.issues)
			});
		}
		runtime.error(`Config invalid at ${await formatDefaultConfigPath(configPath)}. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run setup.`);
		runtime.exit(1);
		return;
	}
	const resolvedConfig = snapshot.config;
	const shouldPersistRoster = !snapshot.exists || !hasResolvedRosterBeforeMigrations(snapshot) && !configIncludeOwnsAgentRoster(snapshot);
	const cfg = shouldPersistRoster ? migratePersistedImplicitMainRoster(snapshot.sourceConfig).config : snapshot.sourceConfig;
	const authoredDefaults = cfg.agents?.defaults ?? {};
	const resolvedDefaults = resolvedConfig.agents?.defaults ?? authoredDefaults;
	const selectedAgentId = resolveAmbientOwnerAgentId(resolvedConfig, void 0, {
		surface: "baseline setup",
		hint: "Set agents.defaults.systemAgent.agentId."
	});
	const defaultEntryWorkspace = resolveAgentEntry(resolvedConfig, selectedAgentId)?.workspace?.trim();
	const configuredWorkspace = defaultEntryWorkspace || resolvedDefaults.workspace;
	const workspace = desiredWorkspace ?? configuredWorkspace ?? (await loadAgentWorkspaceModule()).DEFAULT_AGENT_WORKSPACE_DIR;
	const shouldWriteWorkspace = !snapshot.exists || desiredWorkspace !== void 0 && configuredWorkspace !== workspace;
	const shouldWriteGatewayMode = resolvedConfig.gateway?.mode === void 0;
	const writeInheritedWorkspaceOverride = snapshot.exists && shouldWriteWorkspace && !defaultEntryWorkspace && configIncludeOwnsAgentRoster(snapshot);
	let next = snapshot.exists ? resolvedConfig : cfg;
	if (shouldPersistRoster) {
		const { list: _legacyList, ...agents } = next.agents ?? {};
		next = {
			...next,
			agents: {
				...agents,
				entries: toAgentEntriesRecord(listAgentEntries(cfg))
			}
		};
	}
	if (shouldWriteWorkspace) {
		if (!writeInheritedWorkspaceOverride) {
			const roster = structuredClone(listAgentEntries(next));
			if (!snapshot.exists || Boolean(defaultEntryWorkspace)) {
				for (const entry of roster) if (snapshot.exists && defaultEntryWorkspace && normalizeAgentId(entry.id) === selectedAgentId) entry.workspace = workspace;
			}
			const entries = roster.length > 0 ? toAgentEntriesRecord(roster) : void 0;
			const { list: _legacyList, ...agents } = next.agents ?? {};
			next = {
				...next,
				agents: {
					...agents,
					defaults: {
						...agents.defaults,
						workspace
					},
					...entries ? { entries } : {}
				}
			};
		}
	}
	if (shouldWriteGatewayMode) next = {
		...next,
		gateway: {
			...next.gateway,
			mode: "local"
		}
	};
	let creationConfigHash;
	if (!snapshot.exists) {
		const { ensureOnboardingAgent } = await import("./onboard-agent-wGih_UzJ.mjs");
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
	const configChanged = !snapshot.exists || shouldPersistRoster || shouldWriteWorkspace || shouldWriteGatewayMode;
	let configStatus;
	if (configChanged) {
		await writeDefaultConfigFile({
			nextConfig: next,
			...creationConfigHash ? { baseHash: creationConfigHash } : { snapshot },
			afterWrite: { mode: "auto" },
			writeOptions: {
				...prepared.writeOptions,
				...snapshot.exists && shouldPersistRoster ? {
					explicitSetPaths: [["agents", "entries"]],
					explicitSetValueSource: cfg
				} : {},
				...writeInheritedWorkspaceOverride ? {
					allowIncludeAncestorExplicitSetPaths: true,
					explicitSetPaths: [[
						"agents",
						"defaults",
						"workspace"
					]],
					explicitSetValueSource: { agents: { defaults: { workspace } } }
				} : {}
			}
		});
		configStatus = snapshot.exists ? "updated" : "created";
		if (!opts?.json && !snapshot.exists) runtime.log(`Wrote ${await formatDefaultConfigPath(configPath)}`);
		else if (!opts?.json) {
			const updates = [];
			if (shouldWriteWorkspace) updates.push("set agents.defaults.workspace");
			if (shouldWriteGatewayMode) updates.push("set gateway.mode");
			await logDefaultConfigUpdated(runtime, {
				path: configPath,
				suffix: updates.length > 0 ? `(${updates.join(", ")})` : void 0
			});
		}
	} else {
		configStatus = "unchanged";
		if (!opts?.json) runtime.log(`Config OK: ${await formatDefaultConfigPath(configPath)}`);
	}
	const ws = await ensureDefaultAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !resolvedDefaults.skipBootstrap,
		skipOptionalBootstrapFiles: resolvedDefaults.skipOptionalBootstrapFiles
	});
	if (!opts?.json) runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = await resolveDefaultSessionTranscriptsDir(selectedAgentId);
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
