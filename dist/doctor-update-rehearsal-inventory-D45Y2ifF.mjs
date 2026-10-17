import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isWithinRehearsal, r as refuseRehearsal, t as createRehearsalPathInspector } from "./doctor-update-rehearsal-paths-Bu_Z53RK.mjs";
import { lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/commands/doctor-update-rehearsal-inventory.ts
function valueAt(value, keys) {
	let current = value;
	for (const key of keys.split(".")) {
		if (!isRecord(current)) return;
		current = current[key];
	}
	return current;
}
function assertConfigLayout(config, stateDir) {
	const workspace = path.join(stateDir, "workspace");
	const expected = {
		"agents.defaults.workspace": workspace,
		"agents.defaults.cwd": workspace,
		"agents.defaults.heartbeat.every": "0m",
		"logging.file": path.join(stateDir, "canary.log"),
		"gateway.mode": "local",
		"gateway.bind": "loopback",
		"gateway.auth.mode": "token",
		"gateway.tls.enabled": false,
		"gateway.tailscale.mode": "off",
		"gateway.controlUi.enabled": false,
		"cron.enabled": false,
		"cron.triggers.enabled": false,
		"hooks.enabled": false,
		"hooks.internal.enabled": false,
		"transcripts.enabled": false,
		"discovery.mdns.mode": "off"
	};
	if (Object.entries(expected).some(([key, value]) => valueAt(config, key) !== value)) refuseRehearsal("configuration does not preserve the shipped isolated layout");
	for (const key of [
		"env",
		"diagnostics",
		"session.store",
		"agents.list"
	]) if (valueAt(config, key) !== void 0) refuseRehearsal(`configuration retains ${key}`);
	const port = valueAt(config, "gateway.port");
	const token = valueAt(config, "gateway.auth.token");
	const autoStart = valueAt(config, "transcripts.autoStart");
	const agents = valueAt(config, "agents.entries");
	if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535 || typeof token !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/iu.test(token) || !Array.isArray(autoStart) || autoStart.length !== 0 || !isRecord(agents)) refuseRehearsal("configuration is missing its isolated Gateway or agent projection");
	for (const [id, agent] of Object.entries(agents)) {
		const agentWorkspace = path.join(workspace, id);
		const agentDir = valueAt(agent, "agentDir");
		if (!isWithinRehearsal(workspace, agentWorkspace) || valueAt(agent, "workspace") !== agentWorkspace || valueAt(agent, "cwd") !== agentWorkspace || valueAt(agent, "heartbeat.every") !== "0m" || typeof agentDir !== "string" || !path.isAbsolute(agentDir) || !isWithinRehearsal(stateDir, agentDir)) refuseRehearsal("an agent points outside its copied layout");
	}
	const pending = [config];
	while (pending.length > 0) {
		const value = pending.pop();
		if (Array.isArray(value)) pending.push(...value);
		else if (isRecord(value)) {
			if (Object.hasOwn(value, "$include")) refuseRehearsal("configuration retains an include graph");
			pending.push(...Object.values(value));
		}
	}
}
/** Inspect an already prepared physical disposable copy, never live recovery coverage.
* The caller owns the original updater/parent and rechecks this admission directly
* before launching Doctor. Inventory does not run plugin detection or migration.
*/
async function inspectPreparedDoctorRehearsal(params) {
	const stateDir = params.stateDir;
	const env = params.env;
	const assertOwner = params.assertCurrent;
	assertOwner();
	if (env.OPENCLAW_STATE_DIR !== stateDir || !/^openclaw-update-canary-[a-z0-9]{6}$/iu.test(path.basename(stateDir))) refuseRehearsal("the selected root is not a prepared disposable copy");
	const [markers, postCore, sentinel, doctorResult] = await Promise.all([
		import("./supervisor-markers-TEk1GA11.mjs"),
		import("./update-post-core-context-BViCQwr1.mjs"),
		import("./update-control-plane-sentinel-Ce-pu9Od.mjs"),
		import("./update-doctor-result-Co_hELNl.mjs")
	]);
	assertOwner();
	const required = {
		OPENCLAW_UPDATE_IN_PROGRESS: "0",
		OPENCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR: "1",
		OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE: "1",
		OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART: "1",
		OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR: "0",
		OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION: "0",
		OPENCLAW_SERVICE_REPAIR_POLICY: "external",
		HOME: stateDir,
		USERPROFILE: stateDir,
		OPENCLAW_HOME: stateDir,
		OPENCLAW_STATE_DIR: stateDir,
		TMPDIR: stateDir,
		TMP: stateDir,
		TEMP: stateDir,
		OPENCLAW_CONFIG_PATH: path.join(stateDir, "openclaw.json"),
		OPENCLAW_OAUTH_DIR: env.OPENCLAW_OAUTH_DIR,
		OPENCLAW_WORKSPACE_DIR: path.join(stateDir, "workspace"),
		XDG_CONFIG_HOME: path.join(stateDir, "config"),
		XDG_CACHE_HOME: path.join(stateDir, "cache"),
		XDG_DATA_HOME: path.join(stateDir, "data"),
		XDG_STATE_HOME: path.join(stateDir, "state"),
		OPENCLAW_SKIP_CHANNELS: "1",
		OPENCLAW_SKIP_PROVIDERS: "1",
		OPENCLAW_SKIP_CRON: "1",
		OPENCLAW_SKIP_GMAIL_WATCHER: "1",
		OPENCLAW_SKIP_CANVAS_HOST: "1",
		OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
		OPENCLAW_SKIP_STARTUP_MODEL_PREWARM: "1",
		OPENCLAW_NO_AUTO_UPDATE: "1",
		NODE_DISABLE_COMPILE_CACHE: "1"
	};
	const cleared = [
		...markers.SUPERVISOR_HINT_ENV_VARS,
		sentinel.CONTROL_PLANE_UPDATE_SENTINEL_META_ENV,
		sentinel.UPDATE_RUN_ID_ENV,
		doctorResult.UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV,
		"OPENCLAW_UPDATE_RUN_HANDOFF",
		postCore.POST_CORE_UPDATE_ENV,
		postCore.POST_CORE_UPDATE_CHANNEL_ENV,
		postCore.POST_CORE_UPDATE_RESULT_PATH_ENV,
		postCore.POST_CORE_UPDATE_INSTALL_RECORDS_PATH_ENV,
		postCore.POST_CORE_UPDATE_STARTED_AT_ENV,
		postCore.POST_CORE_UPDATE_REQUESTED_CHANNEL_ENV,
		postCore.POST_CORE_UPDATE_SOURCE_CONFIG_PATH_ENV,
		"OPENCLAW_BUNDLED_PLUGINS_DIR",
		"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
		"OPENCLAW_GATEWAY_SERVICE_PID",
		"OPENCLAW_GATEWAY_PORT",
		"OPENCLAW_COMPATIBILITY_HOST_VERSION",
		"OPENCLAW_GATEWAY_TOKEN",
		"OPENCLAW_GATEWAY_PASSWORD",
		"OPENCLAW_PROFILE",
		"OPENCLAW_DIAGNOSTICS_TIMELINE_PATH",
		"OPENCLAW_TEST_MINIMAL_GATEWAY"
	];
	for (const key of cleared) required[key] = void 0;
	for (const key of ["OPENCLAW_AGENT_DIR", "PI_CODING_AGENT_DIR"]) {
		if (env[key] && (!path.isAbsolute(env[key]) || !isWithinRehearsal(stateDir, env[key]))) refuseRehearsal("an agent environment selector escapes the copy");
		required[key] = env[key];
	}
	const assertEnv = () => {
		if (Object.entries(required).some(([key, value]) => env[key] !== value)) refuseRehearsal("the isolated environment changed or retained live selectors");
	};
	assertEnv();
	const { identities, inspectPath } = createRehearsalPathInspector(stateDir, params.pluginCodeLinks ?? []);
	const rootIdentity = inspectPath(stateDir);
	if (!rootIdentity?.isDirectory() || path.resolve(stateDir) !== stateDir || realpathSync(stateDir) !== stateDir) refuseRehearsal("the rehearsal root is not a private canonical directory");
	for (const fact of params.pluginCodeLinks ?? []) if (!inspectPath(fact.path, false, true)) refuseRehearsal(`copied plugin code link disappeared: ${fact.path}`);
	const configPath = path.join(stateDir, "openclaw.json");
	if (!inspectPath(configPath, true)?.isFile()) refuseRehearsal("the copied configuration is missing");
	const raw = await fs$1.readFile(configPath, "utf8");
	inspectPath(configPath, true);
	const parsed = JSON.parse(raw);
	assertConfigLayout(parsed, stateDir);
	const legacyCanvasHost = valueAt(parsed, "canvasHost");
	const pluginCanvasHost = valueAt(parsed, "plugins.entries.canvas.config.host");
	const canvasRoot = {
		...isRecord(legacyCanvasHost) ? legacyCanvasHost : {},
		...isRecord(pluginCanvasHost) ? pluginCanvasHost : {}
	}.root;
	const voiceStore = ["voice-call", "@openclaw/voice-call"].map((id) => valueAt(parsed, `plugins.entries.${id}.config.store`)).find((value) => typeof value === "string" && value.trim());
	const lanceDbPath = valueAt(parsed, "plugins.entries.memory-lancedb.config.dbPath");
	const wikiPath = valueAt(parsed, "plugins.entries.memory-wiki.config.vault.path");
	const reefPath = valueAt(parsed, "channels.reef.stateDir");
	for (const locator of [
		canvasRoot,
		voiceStore,
		lanceDbPath,
		wikiPath,
		reefPath
	]) {
		if (typeof locator === "string" && locator.includes("${")) refuseRehearsal("migration locator retains an unresolved environment template");
		if (typeof locator === "string" && locator.trim().split(/[\\/]/u).includes("..")) refuseRehearsal("migration locator retains parent traversal");
	}
	if (typeof lanceDbPath === "string" && lanceDbPath.trim() && (lanceDbPath.includes("://") || !path.isAbsolute(lanceDbPath.trim()) && !/^~(?:$|[\\/])/u.test(lanceDbPath.trim()))) refuseRehearsal("LanceDB migration requires an absolute copied path");
	const configuredMigrationRoots = [
		["canvas", canvasRoot],
		["voice-call", voiceStore],
		["memory-lancedb", lanceDbPath],
		["reef", reefPath]
	].flatMap(([pluginId, value]) => typeof value === "string" && value.trim() ? [{
		pluginId,
		path: path.resolve(resolveUserPath(value, env))
	}] : []);
	if (typeof wikiPath === "string") {
		const expandedWikiPath = wikiPath === "~" ? stateDir : wikiPath.startsWith("~/") ? path.join(stateDir, wikiPath.slice(2)) : wikiPath;
		configuredMigrationRoots.push({
			pluginId: "memory-wiki",
			path: path.resolve(expandedWikiPath)
		});
	}
	const [{ createConfigIO }, registryApi, targets, stateReader, sqlite, schema, paths, sqliteFiles, configPaths] = await Promise.all([
		import("./io.factory-B0CIPoCU.mjs"),
		import("./openclaw-agent-db-registry-listing-DKNvjJD3.mjs"),
		import("./targets-Be8sKF4o.mjs"),
		import("./openclaw-state-db-readonly-B2Lj8_jL.mjs"),
		import("./kysely-sync-CoevGH3_.mjs"),
		import("./openclaw-state-db-schema-helpers-kV9mC_lK.mjs"),
		import("./openclaw-state-db.paths-BEzdbteY.mjs"),
		import("./sqlite-files-CP2dUHSm.mjs"),
		import("./paths-CEShgFTd.mjs")
	]);
	const { preparePluginDoctorMigrationBackupResources } = await import("./doctor-contract-registry-n0tz_-yc.mjs");
	const { collectDoctorSkillWorkshopBackupResources } = await import("./doctor-update-rehearsal-workshop-CilNhmLu.mjs");
	const { isSqliteSnapshotFile } = await import("./sqlite-file-header-Cp7FdxuI.mjs");
	const shared = paths.resolveOpenClawStateSqlitePath(env);
	if (!inspectPath(shared)?.isFile()) refuseRehearsal("the copied shared database is missing");
	for (const companion of sqliteFiles.resolveSqliteDatabaseFilePaths(shared)) inspectPath(companion);
	await stateReader.withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(({ db }) => {
		const queries = sqlite.getNodeSqliteKysely(db);
		for (const table of ["state_leases", "agent_database_leases"]) if (schema.tableExists(db, table) && sqlite.executeSqliteQueryTakeFirstSync(db, queries.selectFrom(table).selectAll().limit(1))) refuseRehearsal("the copied shared database retains process leases");
	}, { env });
	const snapshot = await createConfigIO({
		env: { ...env },
		observe: false,
		pluginValidation: "skip"
	}).readConfigFileSnapshot();
	if (snapshot.path !== configPath || snapshot.raw !== raw) refuseRehearsal("the copied configuration changed during inspection");
	const config = snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	const registered = await registryApi.inspectOpenClawRegisteredAgentDatabases({
		env,
		includeIncompatibleSchemaVersions: true
	});
	const databases = [...registered, ...targets.resolveConfiguredAgentDatabaseTargets(config, {
		env,
		registeredDatabases: registered
	})];
	for (const root of configuredMigrationRoots) if (isWithinRehearsal(stateDir, root.path)) inspectPath(root.path);
	const resourceWarnings = [];
	const [pluginInventory, workshopInventory] = await Promise.allSettled([preparePluginDoctorMigrationBackupResources({
		config,
		env,
		stateDir,
		warnings: resourceWarnings,
		requireLocalResources: true
	}), collectDoctorSkillWorkshopBackupResources({
		config,
		env
	})]);
	if (pluginInventory.status === "rejected") {
		if (workshopInventory.status === "rejected") throw new AggregateError([pluginInventory.reason, workshopInventory.reason], "Migration resource inventories failed.");
		throw pluginInventory.reason;
	}
	if (workshopInventory.status === "rejected") throw workshopInventory.reason;
	const pluginScope = pluginInventory.value;
	const resources = [...pluginScope.resources, ...workshopInventory.value];
	const selectedMigrationRoots = configuredMigrationRoots.filter(({ pluginId }) => !pluginScope.deferredPluginIds.has(pluginId)).map((root) => root.path);
	for (const root of selectedMigrationRoots) inspectPath(root);
	const pendingPaths = [
		...selectedMigrationRoots,
		configPath,
		configPaths.resolveOAuthDir(env, stateDir),
		...sqliteFiles.resolveSqliteDatabaseFilePaths(shared),
		path.join(stateDir, "workspace"),
		path.join(stateDir, "canary.log"),
		...Object.values(config.agents?.entries ?? {}).flatMap((agent) => [
			agent.workspace,
			agent.cwd,
			agent.agentDir
		].filter((entry) => typeof entry === "string")),
		...[env.OPENCLAW_AGENT_DIR, env.PI_CODING_AGENT_DIR].filter((entry) => typeof entry === "string"),
		...databases.flatMap((database) => sqliteFiles.resolveSqliteDatabaseFilePaths(database.path)),
		...resources.flatMap((resource) => resource.kind === "sqlite" ? sqliteFiles.resolveSqliteDatabaseFilePaths(resource.path) : [resource.path])
	];
	const pending = [{
		filename: stateDir,
		code: true
	}, ...pendingPaths.map((companion) => ({
		filename: companion,
		code: false
	}))];
	const visited = /* @__PURE__ */ new Map();
	while (pending.length > 0) {
		const { filename, code } = pending.pop();
		if (visited.has(filename) && (!visited.get(filename) || code)) continue;
		visited.set(filename, code);
		if (visited.size > 1e5) refuseRehearsal("the migration data inventory exceeds bounded inspection");
		const stat = inspectPath(filename, false, code);
		if (stat?.isDirectory()) pending.push(...(await fs$1.readdir(filename)).map((name) => ({
			filename: path.join(filename, name),
			code
		})));
		else if (stat?.isFile() && await isSqliteSnapshotFile(filename)) pending.push(...sqliteFiles.resolveSqliteDatabaseFilePaths(filename).map((companion) => ({
			filename: companion,
			code: false
		})));
	}
	const assertCurrent = () => {
		assertEnv();
		assertOwner();
		const current = lstatSync(stateDir);
		if (current.dev !== rootIdentity.dev || current.ino !== rootIdentity.ino || !current.isDirectory() || current.isSymbolicLink() || process.platform !== "win32" && (current.mode & 63) !== 0 || current.uid !== rootIdentity.uid || realpathSync(stateDir) !== stateDir) refuseRehearsal("the admitted rehearsal root changed");
	};
	const assertPrepared = () => {
		assertCurrent();
		for (const filename of identities.keys()) if (!inspectPath(filename, filename === configPath, true)) refuseRehearsal(`copied data disappeared before admission: ${filename}`);
		for (const [filename, code] of visited) inspectPath(filename, filename === configPath, code);
		const remaining = [stateDir];
		let checked = 0;
		while (remaining.length) {
			const filename = remaining.pop();
			if (++checked > 1e5) refuseRehearsal("the migration data inventory exceeds bounded inspection");
			if (inspectPath(filename, false, true)?.isDirectory()) remaining.push(...readdirSync(filename).map((name) => path.join(filename, name)));
		}
		if (readFileSync(configPath, "utf8") !== raw) refuseRehearsal("the copied configuration changed before admission");
	};
	assertPrepared();
	return {
		fact: {
			kind: "doctor-schema-rehearsal",
			stateDir,
			warnings: resourceWarnings,
			...pluginScope.notices.length > 0 ? { notices: pluginScope.notices } : {}
		},
		assertPrepared,
		assertCurrent
	};
}
//#endregion
export { inspectPreparedDoctorRehearsal };
