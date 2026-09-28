import { a as asNullableRecord } from "./string-coerce-Dyy0qgLy.js";
import { s as defineChannelAliasMigration, t as collectChannelAccountScopes, u as stripRetiredChannelKeys, x as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/whatsapp/src/doctor.ts
function resolveLegacyAckScope(ack) {
	const direct = ack.direct !== false;
	const group = ack.group ?? "mentions";
	if (direct) return group === "always" ? "all" : group === "never" ? "direct" : void 0;
	return group === "always" ? "group-all" : group === "mentions" ? "group-mentions" : group === "never" ? "off" : void 0;
}
function resolveDefaultAgentEmoji(cfg) {
	const entries = asNullableRecord(asNullableRecord(cfg.agents)?.entries);
	const agents = entries ? Object.values(entries).flatMap((value) => {
		const entry = asNullableRecord(value);
		return entry ? [entry] : [];
	}) : [];
	const agent = agents.find((entry) => entry.default === true) ?? agents[0];
	const emoji = asNullableRecord(agent?.identity)?.emoji;
	return typeof emoji === "string" ? emoji : void 0;
}
function normalizeCompatibilityConfig$1({ cfg }) {
	const changes = [];
	const sources = [];
	for (const scope of collectChannelAccountScopes({
		cfg,
		channelId: "whatsapp"
	})) {
		const ack = asNullableRecord(scope.account.ackReaction);
		if (!ack) continue;
		sources.push({
			path: `${scope.prefix}.ackReaction`,
			account: scope.account,
			...typeof ack.emoji === "string" ? { emoji: ack.emoji } : {},
			scope: resolveLegacyAckScope(ack),
			unrepresentableScope: ack.direct !== false && (ack.group ?? "mentions") === "mentions"
		});
	}
	if (sources.length === 0) return {
		config: cfg,
		changes
	};
	const messages = cfg.messages ??= {};
	const identityEmoji = resolveDefaultAgentEmoji(cfg) ?? "👀";
	for (const source of sources) {
		messages.ackReaction ??= source.emoji ?? identityEmoji;
		messages.ackReactionScope ??= source.scope;
		delete source.account.ackReaction;
		changes.push(`Moved translatable ${source.path} settings to messages ack settings.`);
	}
	const finalEmoji = messages.ackReaction.trim();
	const finalScope = messages.ackReactionScope ?? "group-mentions";
	const comparableFinalScope = finalScope === "none" ? "off" : finalScope;
	for (const source of sources) {
		const sourceEmoji = source.emoji?.trim();
		if (source.emoji === void 0) changes.push(`${source.path} used a route-dependent agent identity acknowledgement emoji before migration; the final messages.ackReaction is ${JSON.stringify(finalEmoji)}. Review messages.ackReaction.`);
		else if (sourceEmoji !== finalEmoji) changes.push(`${source.path} requested acknowledgement emoji ${JSON.stringify(sourceEmoji)}, but the final messages.ackReaction is ${JSON.stringify(finalEmoji)}. Review messages.ackReaction.`);
		if (source.unrepresentableScope) changes.push(`${source.path} migration cannot preserve both direct-message and mentioned-group acknowledgements; the final messages.ackReactionScope is ${JSON.stringify(finalScope)}. Review messages.ackReactionScope.`);
		else if (source.scope && source.scope !== comparableFinalScope) changes.push(`${source.path} requested acknowledgement scope ${JSON.stringify(source.scope)}, but the final messages.ackReactionScope is ${JSON.stringify(finalScope)}. Review messages.ackReactionScope.`);
	}
	return {
		config: cfg,
		changes
	};
}
//#endregion
//#region extensions/whatsapp/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "whatsapp",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingInheritsDefaultAccount: true
});
const hasExposeErrorText = (value) => Object.hasOwn(asNullableRecord(value) ?? {}, "exposeErrorText");
const hasAckReaction = (value) => Boolean(asNullableRecord(asNullableRecord(value)?.ackReaction));
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: [
			"channels",
			"whatsapp",
			"ackReaction"
		],
		message: "channels.whatsapp.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasAckReaction)
	},
	{
		path: [
			"channels",
			"whatsapp",
			"exposeErrorText"
		],
		message: "channels.whatsapp.exposeErrorText is retired and ignored. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.exposeErrorText is retired and ignored. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasExposeErrorText)
	}
];
function removeExposeErrorText(cfg, changes) {
	return stripRetiredChannelKeys({
		cfg,
		channelId: "whatsapp",
		keys: /* @__PURE__ */ new Set(["exposeErrorText"]),
		scope: "root-and-accounts",
		onRemove: ({ key, pathPrefix }) => changes.push(`Removed retired ${pathPrefix}.${key}.`)
	}).config;
}
function normalizeCompatibilityConfig({ cfg }) {
	const ackReaction = normalizeCompatibilityConfig$1({ cfg });
	const retiredConfig = removeExposeErrorText(ackReaction.config, ackReaction.changes);
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: retiredConfig,
		changes: ackReaction.changes
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
