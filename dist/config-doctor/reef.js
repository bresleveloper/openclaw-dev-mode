import { c as isRecord } from "./string-coerce-Dyy0qgLy.js";
import { r as defineStrayPluginEntryConfigMigration } from "./runtime-doctor-migrations-8XPPImoy.js";
import { _ as union, c as literal, d as object, h as string, i as boolean, s as email, t as _enum, u as number, v as unknown } from "./schemas-BDyHDkT2.js";
import "./string-coerce-runtime-BSQ-eR6f.js";
new TextDecoder("utf-8", { fatal: true });
//#endregion
//#region extensions/reef/protocol/guard.ts
const GUARD_RULES_MAX_CHARS = 2e3;
//#endregion
//#region extensions/reef/src/config-schema.ts
const HandleSchema = string().regex(/^[a-z0-9][a-z0-9_-]{0,62}$/);
const GuardRuleTextSchema = string().max(GUARD_RULES_MAX_CHARS).regex(/\S/, "rules text must not be blank");
const RelayUrlSchema = string().regex(/^[hH][tT][tT][pP][sS]?:\/\/[^\\/?#@]+\/?$/, "Reef relay URL must be an HTTP(S) origin without credentials, path, query, or hash").url();
const OpenAiOAuthProfileIdSchema = string().regex(/^openai:[^\s:/][^\s/]*$/);
const GuardCommonSchema = {
	pinnedModel: string().min(1),
	policyVersion: string().min(1),
	timeoutMs: number().int().min(100).max(12e4),
	rules: object({
		outbound: GuardRuleTextSchema.optional(),
		inbound: GuardRuleTextSchema.optional()
	}).strict().optional()
};
const GuardSchema = union([object({
	provider: literal("openai"),
	authMode: literal("oauth"),
	authProfileId: OpenAiOAuthProfileIdSchema,
	...GuardCommonSchema
}).strict(), object({
	provider: _enum(["anthropic", "openai"]),
	authMode: literal("api-key").optional(),
	apiKeyEnv: string().regex(/^[A-Z_][A-Z0-9_]*$/),
	...GuardCommonSchema
}).strict()]);
const ReefChannelConfigSchema = object({
	enabled: boolean().default(true),
	configWrites: boolean().optional(),
	relayUrl: RelayUrlSchema.default("https://reefwire.ai"),
	handle: HandleSchema.optional(),
	email: email().optional(),
	guard: GuardSchema.optional(),
	stateDir: string().min(1).optional(),
	requestPolicy: _enum([
		"code-only",
		"friends-of-friends",
		"open"
	]).default("code-only"),
	friends: unknown().optional()
}).strict();
//#endregion
//#region extensions/reef/config-doctor-api.ts
function hasRetiredReefPolicyConfig(value) {
	return isRecord(value) && ["dmPolicy", "allowFrom"].some((key) => Object.hasOwn(value, key));
}
const reefStrayEntryConfigMigration = defineStrayPluginEntryConfigMigration({
	pluginId: "reef",
	channelId: "reef",
	validateMergedChannelConfig: (merged) => ReefChannelConfigSchema.safeParse(merged).success
});
const legacyConfigRules = [{
	path: ["channels", "reef"],
	message: "channels.reef dmPolicy/allowFrom are legacy; run \"openclaw doctor --fix\" to remove them. Peer trust is SQLite-backed.",
	match: hasRetiredReefPolicyConfig
}, reefStrayEntryConfigMigration.legacyConfigRule];
function normalizeCompatibilityConfig({ cfg }) {
	const reef = cfg.channels?.reef;
	let config = cfg;
	const changes = [];
	if (isRecord(reef) && hasRetiredReefPolicyConfig(reef)) {
		const next = structuredClone(cfg);
		const nextReef = next.channels?.reef;
		if (isRecord(nextReef)) {
			for (const key of ["dmPolicy", "allowFrom"]) if (Object.hasOwn(nextReef, key)) {
				delete nextReef[key];
				changes.push(`Removed retired Reef ${key} field.`);
			}
			config = next;
		}
	}
	const stray = reefStrayEntryConfigMigration.normalizeConfig({ cfg: config });
	return {
		config: stray.config,
		changes: [...changes, ...stray.changes]
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
