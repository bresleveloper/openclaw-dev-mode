import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
//#region packages/model-catalog-core/src/configured-model-refs.ts
/** Agent config keys that can contain direct model references. */
const AGENT_MODEL_CONFIG_KEYS = [
	"model",
	"utilityModel",
	"imageModel",
	"voiceModel",
	"pdfModel"
];
/** Visit raw selector refs without changing values, order, or fallback indices. */
function visitModelSelectorRefs(value, path, visit) {
	if (typeof value === "string") {
		visit(path, value, "primary");
		return;
	}
	if (!isRecord(value)) return;
	if (typeof value.primary === "string") visit(`${path}.primary`, value.primary, "primary");
	if (Array.isArray(value.fallbacks)) {
		for (const [index, fallback] of value.fallbacks.entries()) if (typeof fallback === "string") visit(`${path}.fallbacks.${index}`, fallback, "fallback");
	}
}
/** List raw refs from one string or primary/fallback model selector. */
function listModelRefsFromConfigValue(value) {
	const refs = [];
	visitModelSelectorRefs(value, "", (_path, ref) => refs.push(ref));
	return refs;
}
/** Collect configured model references from agents, tools, channels, hooks, and message config. */
function collectConfiguredModelRefs(config, options = {}) {
	const refs = [];
	const pushModelRef = (path, value, kind) => {
		if (typeof value === "string" && value.trim()) refs.push({
			path,
			value: value.trim(),
			kind
		});
	};
	const collectModelConfig = (path, value, kind) => visitModelSelectorRefs(value, path, (refPath, ref) => pushModelRef(refPath, ref, kind));
	const collectFromAgent = (path, agent, includeEntrySelectors = false) => {
		if (!isRecord(agent)) return;
		for (const key of AGENT_MODEL_CONFIG_KEYS) collectModelConfig(`${path}.${key}`, agent[key], key === "voiceModel" ? "literal" : "selector");
		const mediaModels = asNonArrayRecord(agent.mediaModels);
		for (const capability of [
			"image",
			"video",
			"music"
		]) collectModelConfig(`${path}.mediaModels.${capability}`, mediaModels[capability], "literal");
		pushModelRef(`${path}.heartbeat.model`, isRecord(agent.heartbeat) ? agent.heartbeat.model : void 0, "selector");
		collectModelConfig(`${path}.subagents.model`, isRecord(agent.subagents) ? agent.subagents.model : void 0, "selector");
		if (isRecord(agent.compaction)) {
			pushModelRef(`${path}.compaction.model`, agent.compaction.model, "selector");
			pushModelRef(`${path}.compaction.memoryFlush.model`, isRecord(agent.compaction.memoryFlush) ? agent.compaction.memoryFlush.model : void 0, "selector");
		}
		if (isRecord(agent.models)) for (const modelRef of Object.keys(agent.models)) pushModelRef(`${path}.models.${modelRef}`, modelRef, "literal");
		if (includeEntrySelectors) {
			const tools = asNonArrayRecord(agent.tools);
			const exec = asNonArrayRecord(tools.exec);
			collectModelConfig(`${path}.tools.exec.reviewer.model`, isRecord(exec.reviewer) ? exec.reviewer.model : void 0, "selector");
			pushModelRef(`${path}.tts.summaryModel`, isRecord(agent.tts) ? agent.tts.summaryModel : void 0, "selector");
		}
	};
	const root = asNonArrayRecord(config);
	const tools = asNonArrayRecord(root.tools);
	const exec = asNonArrayRecord(tools.exec);
	collectModelConfig("tools.exec.reviewer.model", isRecord(exec.reviewer) ? exec.reviewer.model : void 0, "selector");
	const media = asNonArrayRecord(tools.media);
	for (const capability of [
		"image",
		"audio",
		"video"
	]) pushModelRef(`tools.media.${capability}.preferredModel`, isRecord(media[capability]) ? media[capability].preferredModel : void 0, "literal");
	const agents = asNonArrayRecord(root.agents);
	collectFromAgent("agents.defaults", agents.defaults);
	if (Object.hasOwn(agents, "entries")) {
		if (isRecord(agents.entries)) for (const [agentId, entry] of Object.entries(agents.entries)) collectFromAgent(`agents.entries.${agentId}`, entry, true);
	} else if (Array.isArray(agents.list)) for (const [index, entry] of agents.list.entries()) collectFromAgent(`agents.list.${index}`, entry, true);
	if (options.includeChannelModelOverrides !== false) {
		const channels = asNonArrayRecord(root.channels);
		const modelByChannel = asNonArrayRecord(channels.modelByChannel);
		for (const [channelId, channelMap] of Object.entries(modelByChannel)) {
			if (!isRecord(channelMap)) continue;
			for (const [targetId, modelRef] of Object.entries(channelMap)) pushModelRef(`channels.modelByChannel.${channelId}.${targetId}`, modelRef, "selector");
		}
	}
	const hooks = asNonArrayRecord(root.hooks);
	if (Array.isArray(hooks.mappings)) for (const [index, mapping] of hooks.mappings.entries()) pushModelRef(`hooks.mappings.${index}.model`, isRecord(mapping) ? mapping.model : void 0, "selector");
	pushModelRef("hooks.gmail.model", isRecord(hooks.gmail) ? hooks.gmail.model : void 0, "selector");
	pushModelRef("tts.summaryModel", isRecord(root.tts) ? root.tts.summaryModel : void 0, "selector");
	const discord = asNonArrayRecord(asNonArrayRecord(root.channels).discord);
	const collectDiscordVoice = (path, value) => {
		const voice = asNonArrayRecord(value);
		pushModelRef(`${path}.model`, voice.model, "selector");
		pushModelRef(`${path}.tts.summaryModel`, isRecord(voice.tts) ? voice.tts.summaryModel : void 0, "selector");
	};
	collectDiscordVoice("channels.discord.voice", discord.voice);
	if (isRecord(discord.accounts)) for (const [accountId, account] of Object.entries(discord.accounts)) collectDiscordVoice(`channels.discord.accounts.${accountId}.voice`, isRecord(account) ? account.voice : void 0);
	return refs;
}
/** Collect only configured model reference values. */
function collectConfiguredModelRefValues(config, options) {
	return collectConfiguredModelRefs(config, options).map((ref) => ref.value);
}
//#endregion
export { visitModelSelectorRefs as a, listModelRefsFromConfigValue as i, collectConfiguredModelRefValues as n, collectConfiguredModelRefs as r, AGENT_MODEL_CONFIG_KEYS as t };
