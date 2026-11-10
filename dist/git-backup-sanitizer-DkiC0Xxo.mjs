import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as stripPluginModelCatalogCredentials } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
//#region src/state/secret-state-tables.ts
/** Redaction policy surface: Git snapshots may omit these credential-bearing tables. */
const STATE_SECRET_TABLE_NAMES = [
	"audit_identity_keys",
	"apns_registrations",
	"channel_ingress_events",
	"channel_pairing_requests",
	"clawhub_promotion_claims",
	"config_revision_keys",
	"device_auth_tokens",
	"device_bootstrap_tokens",
	"device_identities",
	"device_pairing_join_codes",
	"device_pairing_paired",
	"gateway_origin_device_tokens",
	"mcp_oauth_pending_authorizations",
	"mcp_oauth_stores",
	"native_hook_relay_bridges",
	"secret_store_entries",
	"web_push_approval_deliveries",
	"web_push_subscriptions",
	"worker_environment_credentials"
];
/** Secret-redacted Git backups must never carry machine-state values under these prefixes. */
const STATE_SECRET_CONFIG_STATE_KEY_PREFIXES = [
	"authProfiles.",
	"nodeHost.",
	"webPush.vapidKeys"
];
/** Omit bundled plugin credentials without discarding unrelated durable plugin state. */
const STATE_SECRET_PLUGIN_SCOPES = [
	{
		pluginId: "discord",
		namespace: /^activities-(?:sessions|doc-tokens)$/u
	},
	{
		pluginId: "discord",
		namespace: /^thread-bindings$/u,
		jsonFields: ["webhookToken"]
	},
	{
		pluginId: "google-meet",
		namespace: /^oauth-credential$/u
	},
	{
		pluginId: "matrix",
		namespace: /^(?:credentials|recovery-key|idb-snapshot)$/u
	},
	{
		pluginId: "mcp-events",
		namespace: /^subscriptions-v1$/u
	},
	{
		pluginId: "mcp-relay",
		namespace: /^mcp-relay-authority$/u,
		entryKey: "identity"
	},
	{
		pluginId: "msteams",
		namespace: /^(?:delegated-token|sso-tokens)(?:-[a-f0-9]{64})?$/u
	},
	{
		pluginId: "reef",
		namespace: /^identity$/u
	},
	{
		pluginId: "reef",
		namespace: /^registration$/u,
		entryKey: "setup-session"
	},
	{
		pluginId: "sms",
		namespace: /^hosted-outbound-media-[a-f0-9]{16}$/u
	},
	{
		pluginId: "synology-chat",
		namespace: /^hosted-outbound-media-[a-f0-9]{16}$/u
	},
	{
		pluginId: "twitch",
		namespace: /^oauth-/u
	},
	{
		pluginId: "x",
		namespace: /^x\.oauth$/u
	},
	{
		pluginId: "zalo",
		namespace: /^hosted-outbound-media$/u
	},
	{
		pluginId: "zalouser",
		namespace: /^credentials$/u
	}
];
/** Redaction policy surface for credential-bearing per-agent database tables. */
const AGENT_SECRET_TABLE_NAMES = [
	"auth_profile_state",
	"auth_profile_store",
	"session_suggestions"
];
//#endregion
//#region src/snapshot/git-backup-sanitizer.ts
const modelCatalogScopes = ["plugin-model-catalog-v1", "plugin-model-catalog-migration-v1"];
function resolveRedactionIdentity(identity, postgresFamily) {
	return { role: postgresFamily === "state" ? "global" : postgresFamily === "agent" ? "agent" : identity.role };
}
function gitBackupRedaction(identity, tables, excludeSecrets, postgresFamily) {
	const owner = resolveRedactionIdentity(identity, postgresFamily);
	const secretTables = owner.role === "global" ? STATE_SECRET_TABLE_NAMES : AGENT_SECRET_TABLE_NAMES;
	return {
		excludedTables: excludeSecrets ? secretTables.filter((table) => tables.has(table)).toSorted() : [],
		excludedConfigStateKeyPrefixes: excludeSecrets && owner.role === "global" && tables.has("config_machine_state") ? [...STATE_SECRET_CONFIG_STATE_KEY_PREFIXES] : []
	};
}
/** Shared by serialized SQLite rows and the portable PostgreSQL image. */
function redactGitBackupRow(table, row, identity, prefixes) {
	if (table === "plugin_state_entries" || table === "plugin_blob_entries") {
		if (typeof row.namespace !== "string") return false;
		const namespace = row.namespace.replace(/^@retained\./u, "");
		const scope = STATE_SECRET_PLUGIN_SCOPES.find((candidate) => candidate.pluginId === row.plugin_id && candidate.namespace.test(namespace) && (candidate.entryKey === void 0 || candidate.entryKey === row.entry_key));
		if (!scope) return true;
		if (!scope.jsonFields || table === "plugin_blob_entries") return false;
		row.value_json = redactPluginJsonFields(row.value_json, scope.jsonFields);
		return row.value_json !== null;
	}
	if (table === "config_machine_state" && prefixes.length > 0) {
		const stateKey = row.state_key;
		if (typeof stateKey !== "string" || prefixes.some((prefix) => stateKey.startsWith(prefix))) return false;
	}
	if (identity.role === "agent" && table === "cache_entries" && modelCatalogScopes.some((scope) => row.scope === scope) && typeof row.value_json === "string") {
		row.value_json = stripPluginModelCatalogCredentials(row.value_json);
		return row.value_json !== null;
	}
	return true;
}
function redactPluginJsonFields(value, fields) {
	if (typeof value !== "string") return null;
	try {
		const parsed = JSON.parse(value);
		if (!isRecord(parsed)) return null;
		for (const field of fields) delete parsed[field];
		return JSON.stringify(parsed);
	} catch {
		return null;
	}
}
/** Redact before materialization so credential bytes never enter the portable image. */
function createGitBackupRowTransform(identity, postgresFamily, tables) {
	const owner = resolveRedactionIdentity(identity, postgresFamily);
	const redaction = gitBackupRedaction(owner, tables, true);
	const excludedTables = new Set(redaction.excludedTables);
	return (table, row) => {
		if (excludedTables.has(table) || !redactGitBackupRow(table, row, owner, redaction.excludedConfigStateKeyPrefixes)) return;
		return row;
	};
}
//#endregion
export { gitBackupRedaction as n, redactGitBackupRow as r, createGitBackupRowTransform as t };
