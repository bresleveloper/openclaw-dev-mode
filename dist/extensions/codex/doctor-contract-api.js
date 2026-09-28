import { n as CODEX_APP_SERVER_BINDING_NAMESPACE } from "./.setup/session-binding-meta-B7aEMU7g.mjs";
import { asNullableRecord, asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region extensions/codex/src/migration/session-binding-orphans.ts
const PAGE_SIZE = 512;
const KEY_PREFIXES = ["session-key:", "session:"];
function readBindingCandidate(row, prefix) {
	const identity = /^([a-z0-9][a-z0-9_-]{0,63}):(.+)$/u.exec(row.key.slice(prefix.length));
	if (!identity) return;
	const agentId = identity[1];
	const keyIdentity = identity[2];
	const stored = asOptionalRecord(row.value);
	const sessionId = typeof stored?.sessionId === "string" ? stored.sessionId.trim() : "";
	const stable = prefix === "session-key:";
	if (!stored || stored.version !== 1 || !sessionId || (stable ? !/^[A-Za-z0-9_-]{43}$/u.test(keyIdentity) : sessionId !== keyIdentity)) return;
	if (stored.state === "cleared") {
		if (stored.binding !== void 0 || stored.retired !== void 0 && stored.retired !== true) return;
	} else if (stored.state === "active") {
		const binding = asOptionalRecord(stored.binding);
		if (!binding || typeof binding.threadId !== "string" || !binding.threadId.trim() || typeof binding.cwd !== "string" || binding.connectionScope !== void 0 || binding.supervisionSourceThreadId !== void 0 || binding.pendingSupervisionBranch !== void 0 || stored.retired !== void 0) return;
	} else return;
	if (stored.lease !== void 0) {
		const lease = asOptionalRecord(stored.lease);
		if (!lease || typeof lease.token !== "string" || !lease.token.trim() || typeof lease.expiresAt !== "number" || !Number.isFinite(lease.expiresAt) || lease.expiresAt > Date.now()) return;
	}
	return {
		row,
		agentId,
		sessionId,
		stable
	};
}
async function* iterateOrphanBindingPages({ context }) {
	const readPage = context.readPluginStateEntriesInKeyRange;
	const readEvidence = context.readSessionIdentityEvidenceBatch;
	if (!readPage || !readEvidence) return;
	for (const prefix of KEY_PREFIXES) {
		let after;
		while (true) {
			const rows = readPage(CODEX_APP_SERVER_BINDING_NAMESPACE, {
				prefix,
				...after ? { after } : {},
				limit: PAGE_SIZE
			});
			if (rows.length === 0) break;
			after = rows.at(-1)?.key;
			const candidates = rows.flatMap((row) => {
				const candidate = readBindingCandidate(row, prefix);
				return candidate ? [candidate] : [];
			});
			if (candidates.length > 0) {
				const identities = new Map(candidates.map(({ agentId, sessionId }) => [`${agentId}\0${sessionId}`, {
					agentId,
					sessionId
				}]));
				const evidence = new Map((await readEvidence([...identities.values()])).map((owner) => [`${owner.agentId}\0${owner.sessionId}`, owner]));
				const stale = candidates.filter(({ row, agentId, sessionId, stable }) => {
					const owner = evidence.get(`${agentId}\0${sessionId}`);
					if (!owner || owner.state === "unknown") return false;
					if (owner.state !== "current") return true;
					if (!stable) return false;
					const digest = createHash("sha256").update(owner.sessionKey).digest("base64url");
					return row.key !== `session-key:${agentId}:${digest}`;
				}).map(({ row }) => row);
				if (stale.length > 0) yield stale;
			}
			if (rows.length < PAGE_SIZE) break;
			await setImmediate();
		}
	}
}
const codexOrphanedSessionBindingMigration = {
	id: "codex-app-server-orphaned-session-bindings",
	label: "Codex app-server orphaned session bindings",
	doctorOnly: true,
	phase: "after-session-repair",
	async detectLegacyState(params) {
		for await (const _ of iterateOrphanBindingPages(params)) return { preview: ["- Codex app-server bindings: remove orphaned session ownership"] };
		return null;
	},
	async migrateLegacyState(params) {
		const remove = params.context.deletePluginStateEntriesIfUnchanged;
		if (!remove) return {
			changes: [],
			warnings: ["Codex session binding repair requires locked SQLite maintenance ownership"]
		};
		let deleted = 0;
		let changed = 0;
		for await (const rows of iterateOrphanBindingPages(params)) {
			const result = remove(CODEX_APP_SERVER_BINDING_NAMESPACE, rows);
			deleted += result.deleted;
			changed += result.changed;
		}
		return {
			changes: deleted > 0 ? [`Removed ${deleted} orphaned Codex app-server session binding(s)`] : [],
			warnings: changed > 0 ? [`Preserved ${changed} Codex app-server session binding(s) changed during repair`] : []
		};
	}
};
//#endregion
//#region extensions/codex/doctor-contract-api.ts
function hasRetiredDynamicToolsProfile(value) {
	return Object.hasOwn(asNullableRecord(value) ?? {}, "codexDynamicToolsProfile");
}
function hasLegacyPluginDestructivePolicy(value) {
	const codexPlugins = asNullableRecord(value);
	if (!codexPlugins) return false;
	if (codexPlugins.allow_destructive_actions === "on-request") return true;
	const plugins = asNullableRecord(codexPlugins.plugins);
	return Object.values(plugins ?? {}).some((plugin) => asNullableRecord(plugin)?.allow_destructive_actions === "on-request");
}
function hasRetiredApprovalPolicy(value) {
	const approvalPolicy = asNullableRecord(value)?.approvalPolicy;
	return approvalPolicy === "on-failure" || approvalPolicy === "untrusted";
}
const RETIRED_TURN_IDLE_TIMEOUT_KEYS = [
	"turnCompletionIdleTimeoutMs",
	"turnAssistantCompletionIdleTimeoutMs",
	"postToolRawAssistantCompletionIdleTimeoutMs"
];
function hasRetiredTurnIdleTimeout(value) {
	const appServer = asNullableRecord(value);
	return appServer !== null && RETIRED_TURN_IDLE_TIMEOUT_KEYS.some((key) => Object.hasOwn(appServer, key));
}
/** Legacy Codex config keys that doctor should report or repair. */
const legacyConfigRules = [
	{
		path: [
			"plugins",
			"entries",
			"codex",
			"config"
		],
		message: "plugins.entries.codex.config.codexDynamicToolsProfile is retired; Codex app-server always keeps Codex-native workspace tools native. Run \"openclaw doctor --fix\".",
		match: hasRetiredDynamicToolsProfile
	},
	{
		path: [
			"plugins",
			"entries",
			"codex",
			"config",
			"codexPlugins"
		],
		message: "plugins.entries.codex.config.codexPlugins.allow_destructive_actions=\"on-request\" was renamed to \"auto\". Run \"openclaw doctor --fix\".",
		match: hasLegacyPluginDestructivePolicy
	},
	{
		path: [
			"plugins",
			"entries",
			"codex",
			"config",
			"appServer"
		],
		message: "plugins.entries.codex.config.appServer.approvalPolicy values \"on-failure\" and \"untrusted\" are retired; use \"on-request\". Run \"openclaw doctor --fix\".",
		match: hasRetiredApprovalPolicy
	},
	{
		path: [
			"plugins",
			"entries",
			"codex",
			"config",
			"appServer"
		],
		message: "Codex app-server turn idle timeouts are retired; native Codex owns provider liveness and turn completion. The existing agents.defaults.timeoutSeconds run limit remains unchanged. Run \"openclaw doctor --fix\" to remove the old settings.",
		match: hasRetiredTurnIdleTimeout
	}
];
/**
* Removes retired Codex plugin config keys while preserving unrelated config.
*/
function normalizeCompatibilityConfig({ cfg }) {
	const rawEntry = asNullableRecord(cfg.plugins?.entries?.codex);
	const rawPluginConfig = asNullableRecord(rawEntry?.config);
	const rawCodexPlugins = asNullableRecord(rawPluginConfig?.codexPlugins);
	const rawAppServer = asNullableRecord(rawPluginConfig?.appServer);
	const shouldRemoveDynamicToolsProfile = rawPluginConfig !== null && hasRetiredDynamicToolsProfile(rawPluginConfig);
	const shouldRewriteDestructivePolicy = hasLegacyPluginDestructivePolicy(rawCodexPlugins);
	const shouldRewriteApprovalPolicy = hasRetiredApprovalPolicy(rawAppServer);
	const shouldRemoveTurnIdleTimeouts = hasRetiredTurnIdleTimeout(rawAppServer);
	if (!rawPluginConfig || !shouldRemoveDynamicToolsProfile && !shouldRewriteDestructivePolicy && !shouldRewriteApprovalPolicy && !shouldRemoveTurnIdleTimeouts) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextPlugins = asNullableRecord(nextConfig.plugins);
	const nextEntries = asNullableRecord(nextPlugins?.entries);
	const nextEntry = asNullableRecord(nextEntries?.codex);
	const nextPluginConfig = asNullableRecord(nextEntry?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	const changes = [];
	if (shouldRemoveDynamicToolsProfile) {
		delete nextPluginConfig.codexDynamicToolsProfile;
		changes.push("Removed retired plugins.entries.codex.config.codexDynamicToolsProfile; Codex app-server always keeps Codex-native workspace tools native.");
	}
	if (shouldRewriteDestructivePolicy) {
		const nextCodexPlugins = asNullableRecord(nextPluginConfig.codexPlugins);
		if (nextCodexPlugins?.allow_destructive_actions === "on-request") nextCodexPlugins.allow_destructive_actions = "auto";
		const nextPluginPolicies = asNullableRecord(nextCodexPlugins?.plugins);
		for (const plugin of Object.values(nextPluginPolicies ?? {})) {
			const nextPlugin = asNullableRecord(plugin);
			if (nextPlugin?.allow_destructive_actions === "on-request") nextPlugin.allow_destructive_actions = "auto";
		}
		changes.push("Renamed plugins.entries.codex.config.codexPlugins allow_destructive_actions=\"on-request\" values to \"auto\".");
	}
	const nextAppServer = asNullableRecord(nextPluginConfig.appServer);
	if (nextAppServer && shouldRemoveTurnIdleTimeouts) {
		for (const key of RETIRED_TURN_IDLE_TIMEOUT_KEYS) if (Object.hasOwn(nextAppServer, key)) {
			delete nextAppServer[key];
			changes.push(`Removed retired plugins.entries.codex.config.appServer.${key}; native Codex owns provider liveness and turn completion. agents.defaults.timeoutSeconds was not changed.`);
		}
	}
	if (shouldRewriteApprovalPolicy) {
		if (nextAppServer?.approvalPolicy === "on-failure" || nextAppServer?.approvalPolicy === "untrusted") nextAppServer.approvalPolicy = "on-request";
		changes.push("Renamed retired plugins.entries.codex.config.appServer.approvalPolicy to \"on-request\".");
	}
	return {
		config: nextConfig,
		changes
	};
}
const stateMigrations = [{
	id: "codex-app-server-sidecars-to-plugin-state",
	label: "Codex app-server thread bindings",
	detectLegacyState: async (params) => (await import("./.setup/session-binding-sidecars-BlB5EvIS.mjs")).detectLegacySessionBindingSidecars(params),
	migrateLegacyState: async (params) => (await import("./.setup/session-binding-sidecars-BlB5EvIS.mjs")).migrateLegacySessionBindingSidecars(params)
}, codexOrphanedSessionBindingMigration];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
