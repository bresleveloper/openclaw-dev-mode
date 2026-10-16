Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_rolldown_runtime = require("./.setup/rolldown-runtime-BloeesfJ.cjs");
const require_token_config = require("./.setup/token-config-DOt3XwVa.cjs");
const require_doctor_backup_resources = require("./doctor-backup-resources.cjs");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_path = require("node:path");
node_path = require_rolldown_runtime.__toESM(node_path, 1);
let node_fs_promises = require("node:fs/promises");
node_fs_promises = require_rolldown_runtime.__toESM(node_fs_promises, 1);
let openclaw_plugin_sdk_session_store_paths = require("openclaw/plugin-sdk/session-store-paths");
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord$1(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord$1(value) ? value : null;
}
//#endregion
//#region src/config/channel-config-normalization.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
//#endregion
//#region src/plugin-sdk/legacy-webhook-listener-migration.ts
/** Preserve explicitly configured webhook listeners while moving ingress onto Gateway routes. */
function createLegacyWebhookListenerDoctorContract(params) {
	const portKey = params.portKey ?? "webhookPort";
	const hostKey = params.hostKey === void 0 ? "webhookHost" : params.hostKey;
	const source = (entry) => params.webhookKey ? asNullableRecord(entry[params.webhookKey]) : entry;
	const hasLegacy = (value) => {
		const entry = asNullableRecord(value);
		const listener = entry && source(entry);
		return Boolean(listener && (Object.hasOwn(listener, portKey) || hostKey && Object.hasOwn(listener, hostKey)));
	};
	const prefix = `channels.${params.channelKey}`;
	return {
		historicalWebhookListener: {
			channelId: params.channelKey,
			port: params.defaultPort,
			preserveAuthoredActivation: params.preserveAuthoredActivation,
			...params.defaultHost === void 0 ? {} : { host: params.defaultHost }
		},
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${prefix} webhook listeners moved to Gateway routes. Run "openclaw doctor --fix" to preserve explicitly configured listener settings as legacyWebhook.`,
			match: (value) => {
				const accounts = asNullableRecord(asNullableRecord(value)?.accounts);
				return hasLegacy(value) || Object.values(accounts ?? {}).some(hasLegacy);
			}
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			const root = asNullableRecord(asNullableRecord(cfg.channels)?.[params.channelKey]);
			const inherited = root && source(root);
			const canonicalRoot = asNullableRecord(root?.legacyWebhook);
			return normalizeChannelConfigEntries({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: ({ entry, accountId, pathPrefix, changes }) => {
					const listener = source(entry);
					if (!listener || !hasLegacy(entry)) return {
						entry,
						changed: false
					};
					const next = { ...entry };
					const port = Object.hasOwn(listener, portKey) ? listener[portKey] : (accountId ? canonicalRoot?.port ?? inherited?.[portKey] : void 0) ?? params.defaultPort;
					const inheritedHost = accountId ? canonicalRoot ? canonicalRoot.host : (hostKey ? inherited?.[hostKey] : void 0) ?? params.defaultHost : params.defaultHost;
					const host = hostKey ? listener[hostKey] ?? inheritedHost : inheritedHost;
					const legacyPath = [pathPrefix, params.webhookKey].filter(Boolean).join(".");
					if (Object.hasOwn(entry, "legacyWebhook")) changes.push(`Removed ${legacyPath} legacy listener keys; ${pathPrefix}.legacyWebhook is already configured.`);
					else if (accountId && root?.legacyWebhook === false) changes.push(`Removed ${legacyPath} legacy listener keys; ${prefix}.legacyWebhook: false keeps this account's inherited listener disabled.`);
					else {
						next.legacyWebhook = {
							port,
							...host !== void 0 ? { host } : {}
						};
						changes.push(`Moved ${legacyPath} listener settings to ${pathPrefix}.legacyWebhook. Point the external callback or reverse proxy at the Gateway port and webhook path, verify delivery, then set legacyWebhook: false to disable legacy forwarding.`);
					}
					const updated = params.webhookKey ? { ...listener } : next;
					delete updated[portKey];
					if (hostKey) delete updated[hostKey];
					if (params.webhookKey) {
						if (Object.keys(updated).length) next[params.webhookKey] = updated;
						else delete next[params.webhookKey];
					}
					return {
						entry: next,
						changed: true
					};
				}
			});
		}
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/runtime-doctor-migrations
var runtime_doctor_migrations_exports = /* @__PURE__ */ require_rolldown_runtime.__exportAll({ createLegacyWebhookListenerDoctorContract: () => createLegacyWebhookListenerDoctorContract });
require_rolldown_runtime.__reExport(runtime_doctor_migrations_exports, require("openclaw/plugin-sdk/runtime-doctor-migrations"));
//#endregion
//#region extensions/msteams/config-doctor-api.ts
const webhookMigration = createLegacyWebhookListenerDoctorContract({
	channelKey: "msteams",
	defaultPort: 3978,
	webhookKey: "webhook",
	portKey: "port",
	hostKey: null,
	preserveAuthoredActivation: true
});
const { historicalWebhookListener } = webhookMigration;
const streamingAliasMigration = (0, runtime_doctor_migrations_exports.defineChannelAliasMigration)({
	channelId: "msteams",
	streaming: { defaultMode: "partial" }
});
const legacyConfigRules = [...webhookMigration.legacyConfigRules, ...streamingAliasMigration.legacyConfigRules];
function normalizeHistoricalWebhookConfig({ cfg }) {
	return {
		...webhookMigration.normalizeCompatibilityConfig({ cfg }),
		historicalWebhookAccountIds: cfg.channels?.msteams === void 0 && !require_token_config.resolveMSTeamsCredentials() ? null : cfg.channels?.msteams?.enabled === false ? [] : [void 0]
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const webhook = normalizeHistoricalWebhookConfig({ cfg });
	return {
		...streamingAliasMigration.normalizeChannelConfig({
			cfg: webhook.config,
			changes: webhook.changes
		}),
		historicalWebhookAccountIds: webhook.historicalWebhookAccountIds
	};
}
//#endregion
//#region extensions/msteams/doctor-contract-api.ts
const MSTEAMS_PLUGIN_ID = "Microsoft Teams";
function listAgentIds(config) {
	const ids = /* @__PURE__ */ new Set(["main"]);
	const agents = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(config) && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(config.agents) ? config.agents : void 0;
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(agents?.entries)) {
		for (const agentId of Object.keys(agents.entries)) if (agentId.trim()) ids.add(agentId.trim());
	}
	const legacyList = Object.prototype.propertyIsEnumerable.call(agents ?? {}, "list") && Array.isArray(agents?.list) ? agents.list : [];
	for (const agent of legacyList) if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(agent) && typeof agent.id === "string" && agent.id.trim()) ids.add(agent.id.trim());
	return [...ids];
}
function listCandidateStorePaths(params) {
	const paths = /* @__PURE__ */ new Set();
	for (const agentId of listAgentIds(params.config)) paths.add((0, openclaw_plugin_sdk_session_store_paths.resolveStorePath)(params.config.session?.store, {
		agentId,
		env: params.env
	}));
	return [...paths];
}
async function hasRetiredSource(filePath) {
	try {
		await node_fs_promises.default.lstat(filePath);
		return true;
	} catch (error) {
		if ((0, openclaw_plugin_sdk_error_runtime.extractErrorCode)(error) === "ENOENT") return false;
		throw error;
	}
}
async function hasRetiredLearnings(params) {
	for (const storePath of listCandidateStorePaths(params)) try {
		if ((await node_fs_promises.default.stat(storePath)).isDirectory() && (await node_fs_promises.default.readdir(storePath)).some((name) => name.endsWith(".learnings.json"))) return true;
	} catch (error) {
		if ((0, openclaw_plugin_sdk_error_runtime.extractErrorCode)(error) !== "ENOENT") throw error;
	}
	return false;
}
function retiredJsonMigration(name, label, hasSource) {
	const guidance = `Microsoft Teams ${label} JSON state predates June 2026. Install OpenClaw 2026.9.5, run "openclaw doctor --fix", then upgrade to latest. The legacy source was left untouched.`;
	return {
		id: `msteams-${name}-json-to-plugin-state`,
		label: `Microsoft Teams ${label}`,
		collectBackupResources: () => [],
		async detectLegacyState(params) {
			return await hasSource(params) ? { preview: [guidance] } : null;
		},
		async migrateLegacyState(params) {
			return {
				changes: [],
				warnings: await hasSource(params) ? [guidance] : []
			};
		}
	};
}
const stateMigrations = [
	retiredJsonMigration("conversations", "conversations", (params) => hasRetiredSource(node_path.default.join(params.stateDir, "msteams-conversations.json"))),
	retiredJsonMigration("polls", "polls", (params) => hasRetiredSource(node_path.default.join(params.stateDir, "msteams-polls.json"))),
	retiredJsonMigration("sso-tokens", "SSO tokens", (params) => hasRetiredSource(node_path.default.join(params.stateDir, "msteams-sso-tokens.json"))),
	{
		id: "msteams-delegated-token-json-to-plugin-state",
		label: "Microsoft Teams delegated OAuth token",
		collectBackupResources: ({ stateDir }) => require_doctor_backup_resources.stateFileBackupResources(stateDir, require_token_config.MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME),
		async detectLegacyState(params) {
			const filePath = node_path.default.join(params.stateDir, require_token_config.MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME);
			try {
				return (await node_fs_promises.default.stat(filePath)).isFile() ? { preview: [`- ${MSTEAMS_PLUGIN_ID} delegated OAuth token -> plugin state (${require_token_config.MSTEAMS_DELEGATED_TOKEN_NAMESPACE})`] } : null;
			} catch {
				return null;
			}
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const filePath = node_path.default.join(params.stateDir, require_token_config.MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME);
			let token;
			try {
				token = require_token_config.normalizeMSTeamsDelegatedTokens(JSON.parse(await node_fs_promises.default.readFile(filePath, "utf8")));
			} catch (error) {
				if (error.code === "ENOENT") return {
					changes,
					warnings
				};
				warnings.push(`Failed reading ${MSTEAMS_PLUGIN_ID} delegated OAuth token legacy source; left it in place`);
				return {
					changes,
					warnings
				};
			}
			if (!token) {
				warnings.push(`Invalid ${MSTEAMS_PLUGIN_ID} delegated OAuth token legacy source; left it in place`);
				return {
					changes,
					warnings
				};
			}
			const store = params.context.openPluginStateKeyedStore({
				namespace: require_token_config.MSTEAMS_DELEGATED_TOKEN_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const existing = await store.lookup(require_token_config.MSTEAMS_DELEGATED_TOKEN_KEY);
			if (existing && JSON.stringify(existing) !== JSON.stringify(token)) {
				warnings.push(`Kept existing ${MSTEAMS_PLUGIN_ID} delegated OAuth token in plugin state; left differing legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			if (!existing) try {
				await store.registerIfAbsent(require_token_config.MSTEAMS_DELEGATED_TOKEN_KEY, token);
			} catch (error) {
				warnings.push(`Failed importing ${MSTEAMS_PLUGIN_ID} delegated OAuth token: ${String(error)}; left legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			const persisted = require_token_config.normalizeMSTeamsDelegatedTokens(await store.lookup(require_token_config.MSTEAMS_DELEGATED_TOKEN_KEY));
			if (!persisted || JSON.stringify(persisted) !== JSON.stringify(token)) {
				warnings.push(`Failed verifying ${MSTEAMS_PLUGIN_ID} delegated OAuth token in plugin state; left legacy source in place`);
				return {
					changes,
					warnings
				};
			}
			changes.push(`Migrated ${MSTEAMS_PLUGIN_ID} delegated OAuth token -> plugin state`);
			await (0, runtime_doctor_migrations_exports.archiveLegacyStateSource)({
				filePath,
				archiveDirectory: require_doctor_backup_resources.stateFileArchiveDirectory(filePath),
				label: `${MSTEAMS_PLUGIN_ID} delegated OAuth token`,
				changes,
				warnings
			});
			return {
				changes,
				warnings
			};
		}
	},
	retiredJsonMigration("feedback-learnings", "feedback learnings", hasRetiredLearnings)
];
//#endregion
exports.historicalWebhookListener = historicalWebhookListener;
exports.legacyConfigRules = legacyConfigRules;
exports.normalizeCompatibilityConfig = normalizeCompatibilityConfig;
exports.normalizeHistoricalWebhookConfig = normalizeHistoricalWebhookConfig;
exports.stateMigrations = stateMigrations;
