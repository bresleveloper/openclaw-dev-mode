import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { r as MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE, t as LLAMA_CPP_PROVIDER_INSTALL_COMMAND } from "./local-embedding-provider-CrD-cpyE.mjs";
import fs from "node:fs";
import path from "node:path";
//#region extensions/memory-core/src/doctor-vector-index-provider.ts
const MEMORY_INDEX_META_KEY = "memory_index_meta_v1";
function listConfiguredAgentIds(config) {
	const ids = new Set(Object.keys(config.agents?.entries ?? {}));
	for (const entry of config.agents?.list ?? []) if (entry.id.trim()) ids.add(entry.id.trim());
	return ids.size > 0 ? [...ids] : ["main"];
}
async function readExistingVectorModel(databasePath) {
	if (!fs.existsSync(databasePath)) return null;
	const { openNodeSqliteDatabase, prepareSqliteReadOnlyLocation } = await import("./plugin-sdk/sqlite-runtime.js");
	let prepared;
	let db;
	let failure;
	let model = null;
	try {
		prepared = await prepareSqliteReadOnlyLocation(databasePath);
		db = openNodeSqliteDatabase(prepared.location, { readOnly: true });
		if (db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'memory_index_meta'").get()) {
			const row = db.prepare("SELECT value FROM memory_index_meta WHERE key = ?").get(MEMORY_INDEX_META_KEY);
			const parsed = typeof row?.value === "string" ? JSON.parse(row.value) : null;
			const configuredModel = parsed && typeof parsed === "object" && typeof parsed.model === "string" ? parsed.model.trim() : "";
			model = configuredModel && configuredModel !== "fts-only" ? configuredModel : null;
		}
	} catch (error) {
		failure = error;
	} finally {
		try {
			db?.close();
		} catch (error) {
			failure ??= error;
		}
		if (prepared && !await prepared.cleanupAsync()) failure ??= /* @__PURE__ */ new Error("Temporary SQLite inspection snapshot cleanup did not complete.");
	}
	if (failure) throw failure instanceof Error ? failure : new Error("Memory index inspection failed.", { cause: failure });
	return model;
}
function resolveConfigPrefix(config, agentId) {
	if (config.agents?.entries?.[agentId]?.memory?.search) return `agents.entries.${agentId}.memory.search`;
	if (config.agents?.list?.find((entry) => entry.id === agentId)?.memory?.search) return `agents.list[].memory.search (agent id ${agentId})`;
	return "memory.search";
}
async function collectVectorProviderFindings(params, inspectProvider) {
	const findings = [];
	for (const agentId of listConfiguredAgentIds(params.config)) {
		const model = await readExistingVectorModel(path.join(params.stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite"));
		if (!model) continue;
		const failure = await inspectProvider({
			config: params.config,
			agentId,
			env: params.env
		});
		if (failure) findings.push({
			...failure,
			agentId,
			model,
			configPrefix: resolveConfigPrefix(params.config, agentId)
		});
	}
	return findings;
}
//#endregion
//#region extensions/memory-core/src/doctor-health.ts
const MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID = "memory-core/managed-local-embedding-setup";
const pluginStateIsolatedDoctorCheckIds = [MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID];
const registrationsByHost = /* @__PURE__ */ new WeakMap();
function resolveSelectedMemoryProvider(config, agentId) {
	const agent = config.agents?.entries?.[agentId] ?? config.agents?.list?.find((entry) => entry.id === agentId);
	const defaults = config.memory?.search;
	const overrides = agent?.memory?.search;
	if (!(overrides?.enabled ?? defaults?.enabled ?? true)) return null;
	const configured = overrides?.provider ?? defaults?.provider;
	const provider = normalizeOptionalLowercaseString(configured);
	return !provider || provider === "auto" ? "openai" : provider;
}
function createManagedLocalEmbeddingSetupCheck(state) {
	return {
		id: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
		kind: "plugin",
		source: "memory-core",
		defaultEnabled: false,
		description: "Checks existing semantic indexes for required managed local embedding setup.",
		async detect(ctx) {
			if (!state.memoryCoreActive) return [];
			const env = ctx.env ?? process.env;
			let findings;
			try {
				findings = await collectVectorProviderFindings({
					config: ctx.cfg,
					env,
					stateDir: resolveStateDir(env)
				}, async (params) => {
					const provider = resolveSelectedMemoryProvider(params.config, params.agentId);
					if (!provider || provider === "none") return null;
					if (provider !== "local") return null;
					const failure = await state.inspectEmbeddingProviderSetup({
						config: params.config,
						env: params.env,
						agentId: params.agentId,
						provider
					});
					if (failure === void 0) return {
						provider,
						reason: MISSING_LOCAL_MEMORY_EMBEDDING_PROVIDER_MESSAGE,
						requirement: "memory-embedding-provider-plugin",
						fixHint: `Run \`${LLAMA_CPP_PROVIDER_INSTALL_COMMAND}\`, ensure the plugin is enabled, then rerun this check.`
					};
					return failure;
				});
			} catch (error) {
				return [{
					checkId: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
					severity: "error",
					source: "memory-core",
					target: "memory-core",
					requirement: "memory-index-inspection",
					message: `Memory Core semantic-index readiness could not be verified (${formatErrorMessage(error)}).`,
					fixHint: "Keep the current Gateway running, resolve the database inspection error, then rerun this check."
				}];
			}
			return findings.map((finding) => ({
				checkId: MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID,
				severity: "error",
				source: "memory-core",
				path: `${finding.configPrefix}.provider`,
				target: `${finding.agentId}/${finding.provider}`,
				requirement: finding.requirement ?? "managed-local-embedding-setup",
				message: `Memory index for agent ${finding.agentId} uses vector model ${finding.model}, but embedding provider "${finding.provider}" cannot initialize (${finding.reason}).`,
				fixHint: finding.fixHint
			}));
		}
	};
}
function registerMemoryCoreDoctorChecks(host) {
	let registration = registrationsByHost.get(host.registerHealthCheck);
	if (registration) {
		registration.state.inspectEmbeddingProviderSetup = host.inspectEmbeddingProviderSetup;
		registration.state.memoryCoreActive = host.memoryCoreActive;
	} else {
		const state = {
			inspectEmbeddingProviderSetup: host.inspectEmbeddingProviderSetup,
			memoryCoreActive: host.memoryCoreActive
		};
		registration = {
			check: createManagedLocalEmbeddingSetupCheck(state),
			state
		};
		registrationsByHost.set(host.registerHealthCheck, registration);
	}
	if (host.getHealthCheck("memory-core/managed-local-embedding-setup") === registration.check) return;
	host.registerHealthCheck(registration.check);
}
//#endregion
export { pluginStateIsolatedDoctorCheckIds as n, registerMemoryCoreDoctorChecks as r, MEMORY_MANAGED_LOCAL_EMBEDDING_SETUP_CHECK_ID as t };
