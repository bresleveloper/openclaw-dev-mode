import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV, i as POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV, n as POST_CORE_UPDATE_ENV, o as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV, r as POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV, s as POST_CORE_UPDATE_STARTED_AT_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-B2x24New.mjs";
import { t as buildUpdateRehearsalPathEnv } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV } from "./update-doctor-result-yVslo54h.mjs";
import { i as UPDATE_RUN_ID_ENV, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { i as tryListenOnPort } from "./ports-probe-DMGtt9dg.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-Cab7F5S1.mjs";
import { a as resolveUpdateCandidateAvatar, l as resolveUpdateCandidateStatePath } from "./update-candidate-paths-CKAg99vX.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-BdJj3P99.mjs";
import { n as prepareUpdateCandidateStateSnapshot } from "./update-candidate-snapshot-DU26WgEW.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/infra/update-candidate-rehearsal.ts
function isolatedConfig(config, sourceRoot, stateDir, port, sourceEnv, pluginPaths, migrationPolicy) {
	const copied = structuredClone(config);
	const projectPluginPath = (value) => {
		const projected = pluginPaths[resolveUserPath(value, sourceEnv)];
		if (!projected) throw new Error("Plugin locator was not included in the update snapshot");
		return projected;
	};
	for (const record of Object.values(copied.plugins?.installs ?? {})) {
		if (record.source === "path" && record.sourcePath) record.sourcePath = projectPluginPath(record.sourcePath);
		if (record.installPath) record.installPath = projectPluginPath(record.installPath);
	}
	if (copied.plugins?.load?.paths) copied.plugins.load.paths = copied.plugins.load.paths.map(projectPluginPath);
	const workspace = path.join(stateDir, "workspace");
	const entries = copied.agents?.entries ?? (migrationPolicy === "startup-only" ? void 0 : Object.fromEntries((copied.agents?.list ?? []).map(({ id, ...agent }) => [id, agent])));
	const isolateAgent = (id, agent) => ({
		...agent,
		...typeof agent.identity?.avatar === "string" ? { identity: {
			...agent.identity,
			avatar: resolveUpdateCandidateAvatar(resolveAgentWorkspaceDir(config, id, sourceEnv), agent.identity.avatar)
		} } : {},
		workspace: path.join(workspace, id),
		cwd: path.join(workspace, id),
		agentDir: agent.agentDir ? resolveUpdateCandidateStatePath(sourceRoot, stateDir, resolveUserPath(agent.agentDir, sourceEnv)) : path.join(stateDir, "agents", id, "agent"),
		heartbeat: { every: "0m" }
	});
	copied.agents = {
		...copied.agents,
		defaults: {
			...copied.agents?.defaults,
			workspace,
			cwd: workspace,
			heartbeat: { every: "0m" }
		},
		...entries ? { entries: Object.fromEntries(Object.entries(entries).map(([id, agent]) => [id, isolateAgent(id, agent)])) } : {},
		...migrationPolicy === "startup-only" && copied.agents?.list ? { list: copied.agents.list.map(({ id, ...agent }) => ({
			id,
			...isolateAgent(id, agent)
		})) } : {}
	};
	if (migrationPolicy !== "startup-only") delete copied.agents.list;
	delete copied.env;
	delete copied.diagnostics;
	delete copied.session?.store;
	copied.logging = {
		...copied.logging,
		file: path.join(stateDir, "canary.log")
	};
	copied.gateway = {
		...copied.gateway,
		mode: "local",
		bind: "loopback",
		port,
		auth: {
			...copied.gateway?.auth,
			mode: "token",
			token: randomUUID(),
			password: void 0,
			allowTailscale: false
		},
		tls: { enabled: false },
		tailscale: { mode: "off" },
		controlUi: { enabled: false }
	};
	copied.cron = {
		...copied.cron,
		enabled: false,
		triggers: { enabled: false }
	};
	copied.hooks = {
		enabled: false,
		internal: { enabled: false }
	};
	copied.transcripts = {
		enabled: false,
		autoStart: []
	};
	copied.discovery = { mdns: { mode: "off" } };
	if (copied.mcp?.apps) copied.mcp.apps.enabled = false;
	return copied;
}
/** Prepare one disposable generation for candidate diagnostics. */
async function prepareUpdateCandidateRehearsal(params) {
	const sourceEnv = params.env ?? process.env;
	const workerEnv = (tempDir) => {
		const copiedAgentDir = (directory) => directory?.trim() ? resolveUpdateCandidateStatePath(path.resolve(params.stateDir), tempDir, resolveUserPath(directory, sourceEnv)) : void 0;
		const env = {
			...sourceEnv,
			...buildUpdateRehearsalPathEnv(tempDir),
			OPENCLAW_DEV_SOURCE_ROOT: params.candidateRoot,
			OPENCLAW_AGENT_DIR: copiedAgentDir(sourceEnv.OPENCLAW_AGENT_DIR),
			PI_CODING_AGENT_DIR: copiedAgentDir(sourceEnv.PI_CODING_AGENT_DIR),
			OPENCLAW_BUNDLED_PLUGINS_DIR: void 0,
			OPENCLAW_DISABLE_BUNDLED_PLUGINS: void 0,
			OPENCLAW_GATEWAY_SERVICE_PID: void 0,
			OPENCLAW_GATEWAY_PORT: void 0,
			OPENCLAW_COMPATIBILITY_HOST_VERSION: void 0,
			OPENCLAW_GATEWAY_TOKEN: void 0,
			OPENCLAW_GATEWAY_PASSWORD: void 0,
			OPENCLAW_PROFILE: void 0,
			OPENCLAW_DIAGNOSTICS_TIMELINE_PATH: void 0,
			OPENCLAW_TEST_MINIMAL_GATEWAY: void 0,
			...buildUpdateDoctorEnv({
				allowGatewayServiceRepair: false,
				allowGatewayActivation: false,
				serviceRepairPolicy: "external",
				deferConfiguredPluginInstallRepair: true
			})
		};
		for (const key of [
			...SUPERVISOR_HINT_ENV_VARS,
			CONTROL_PLANE_UPDATE_SENTINEL_META_ENV,
			UPDATE_RUN_ID_ENV,
			UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV,
			"OPENCLAW_UPDATE_RUN_HANDOFF",
			POST_CORE_UPDATE_ENV,
			POST_CORE_UPDATE_CHANNEL_ENV,
			POST_CORE_UPDATE_RESULT_PATH_ENV,
			POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV,
			POST_CORE_UPDATE_STARTED_AT_ENV,
			POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV,
			POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV
		]) delete env[key];
		return env;
	};
	const { stateDir: tempDir, pluginPaths, pluginCodeLinks, snapshotCapacity, snapshotDiagnostics, snapshotWarnings, cleanupDirectories } = await prepareUpdateCandidateStateSnapshot({
		...params,
		env: sourceEnv,
		workerEnv
	});
	const env = workerEnv(tempDir);
	const configPath = path.join(tempDir, "openclaw.json");
	const workspaceDir = path.join(tempDir, "workspace");
	const databasePath = resolveOpenClawStateSqlitePath({ OPENCLAW_STATE_DIR: tempDir });
	const cleanup = async (assertDirectoryCurrent) => {
		const { closeOpenClawStateDatabaseByPathAsync } = await import("./openclaw-state-db-cache-CumK1G_0.mjs");
		assertDirectoryCurrent?.(tempDir);
		await closeOpenClawStateDatabaseByPathAsync(databasePath);
		for (const directory of cleanupDirectories) {
			assertDirectoryCurrent?.(directory);
			await fs.rm(directory, {
				recursive: true,
				force: true
			});
		}
	};
	try {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		const port = await tryListenOnPort({
			port: 0,
			host: "127.0.0.1",
			signal: params.signal ?? AbortSignal.timeout(params.timeoutMs ?? 3e5)
		});
		const serialized = JSON.stringify(isolatedConfig(params.config, path.resolve(params.stateDir), tempDir, port, sourceEnv, pluginPaths, params.migrationPolicy));
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		await fs.writeFile(configPath, serialized, { mode: 384 });
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		await fs.mkdir(workspaceDir, {
			recursive: true,
			mode: 448
		});
		return {
			stateDir: tempDir,
			configPath,
			workspaceDir,
			env,
			port,
			snapshotCapacity,
			snapshotDiagnostics,
			snapshotWarnings,
			cleanupDirectories,
			pluginCodeLinks,
			cleanup
		};
	} catch (error) {
		await cleanup();
		throw error;
	}
}
//#endregion
export { prepareUpdateCandidateRehearsal as t };
