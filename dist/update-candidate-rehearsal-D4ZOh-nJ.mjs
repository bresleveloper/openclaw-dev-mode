import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as buildUpdateRehearsalPathEnv } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV } from "./update-doctor-result-oZ38327j.mjs";
import { i as tryListenOnPort } from "./ports-probe-FuJ7VYyD.mjs";
import { a as POST_CORE_UPDATE_RESULT_PATH_ENV, i as POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV, n as POST_CORE_UPDATE_ENV, o as POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV, r as POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV, s as POST_CORE_UPDATE_STARTED_AT_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-D3kte0je.mjs";
import { i as UPDATE_RUN_ID_ENV, n as CONTROL_PLANE_UPDATE_SENTINEL_META_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-D4rfU3wJ.mjs";
import { a as resolveUpdateCandidateAvatar, l as resolveUpdateCandidateStatePath } from "./update-candidate-paths-C60j7F-O.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-CqKjyCJ3.mjs";
import { n as prepareUpdateCandidateStateSnapshot } from "./update-candidate-snapshot-CXUOq_kW.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import JSON5 from "json5";
//#region src/infra/update-candidate-rehearsal.ts
function isolatedConfig(config, sourceRoot, stateDir, sourceEnv, pluginPaths, migrationPolicy) {
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
	delete copied.session?.store;
	const auth = copied.gateway?.auth;
	for (const key of ["token", "password"]) if (auth?.[key] !== void 0 && !coerceSecretRef(auth[key], copied.secrets?.defaults)) auth[key] = randomUUID();
	const headers = copied.diagnostics?.otel?.headers;
	for (const [key, value] of Object.entries(headers ?? {})) if (!coerceSecretRef(value, copied.secrets?.defaults)) headers[key] = randomUUID();
	copied.logging = {
		...copied.logging,
		file: path.join(stateDir, "canary.log")
	};
	return copied;
}
/** Apply runtime-only isolation after deployment config checks have finished. */
function isolatedRuntimeConfig(config, port) {
	delete config.diagnostics;
	config.gateway = {
		...config.gateway,
		mode: "local",
		bind: "loopback",
		port,
		auth: {
			...config.gateway?.auth,
			mode: "token",
			token: randomUUID(),
			password: void 0,
			allowTailscale: false
		},
		tls: { enabled: false },
		tailscale: { mode: "off" },
		controlUi: { enabled: false }
	};
	config.cron = {
		...config.cron,
		enabled: false,
		triggers: { enabled: false }
	};
	config.hooks = {
		enabled: false,
		internal: { enabled: false }
	};
	config.transcripts = {
		enabled: false,
		autoStart: []
	};
	config.discovery = { mdns: { mode: "off" } };
	if (config.mcp?.apps) config.mcp.apps.enabled = false;
	return config;
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
		const { closeOpenClawStateDatabaseByPathAsync } = await import("./openclaw-state-db-cache-CDpUFjDp.mjs");
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
		const serialized = JSON.stringify(isolatedConfig(params.config, path.resolve(params.stateDir), tempDir, sourceEnv, pluginPaths, params.migrationPolicy));
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
			prepareRuntime: async (assertCurrent) => {
				const config = JSON5.parse(await fs.readFile(configPath, "utf8"));
				assertCurrent();
				await fs.writeFile(configPath, JSON.stringify(isolatedRuntimeConfig(config, port)), { mode: 384 });
			},
			cleanup
		};
	} catch (error) {
		await cleanup();
		throw error;
	}
}
//#endregion
export { prepareUpdateCandidateRehearsal as t };
