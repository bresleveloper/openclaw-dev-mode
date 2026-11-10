import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Pn as number, Zt as email, or as union, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as GUARD_RULES_MAX_CHARS } from "./guard-AJ321bgO.mjs";
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
function resolveReefConfig(cfg) {
	return ReefChannelConfigSchema.parse(cfg.channels?.reef ?? {});
}
function normalizeReefTarget(raw) {
	const target = raw.trim().replace(/^(reef:|@)/i, "").toLowerCase();
	return HandleSchema.safeParse(target).success ? target : void 0;
}
function parseReefRelayUrl(raw) {
	return new URL(RelayUrlSchema.parse(raw)).origin;
}
function autonomyBudget(autonomy) {
	return {
		notifyOnly: autonomy === "notify-only",
		botLoopProtection: {
			enabled: true,
			maxEventsPerWindow: autonomy === "extended" ? 12 : autonomy === "bounded" ? 3 : 1,
			windowSeconds: autonomy === "extended" ? 3600 : 86400,
			cooldownSeconds: 86400
		}
	};
}
//#endregion
export { parseReefRelayUrl as a, normalizeReefTarget as i, ReefChannelConfigSchema as n, resolveReefConfig as o, autonomyBudget as r, OpenAiOAuthProfileIdSchema as t };
