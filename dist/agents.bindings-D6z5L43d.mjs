import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import "./account-id-DbRsdayc.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-JwCDUODD.mjs";
import "./registry-B3Y-vjit.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-DN3obb3J.mjs";
import "./plugin-registry-Cl9kmLsR.mjs";
import { n as getLoadedChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { i as listRouteBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-BaRMqGR7.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
//#region src/commands/agents.bindings.ts
function bindingMatchKey(match) {
	const accountId = normalizeOptionalString(match.accountId) || "default";
	const identityKey = bindingMatchIdentityKey(match);
	return JSON.stringify([identityKey, accountId]);
}
function bindingMatchIdentityKey(match) {
	const roles = Array.isArray(match.roles) ? normalizeSortedUniqueStringEntries(match.roles) : [];
	return JSON.stringify([
		match.channel,
		match.peer?.kind ?? "",
		match.peer?.id ?? "",
		match.guildId ?? "",
		match.teamId ?? "",
		roles.join(",")
	]);
}
function applyAgentBindings(cfg, bindings) {
	const existingRoutes = [...listRouteBindings(cfg)];
	const nonRouteBindings = (cfg.bindings ?? []).filter((binding) => !isRouteBinding(binding));
	const existingMatchMap = /* @__PURE__ */ new Map();
	for (const binding of existingRoutes) {
		const key = bindingMatchKey(binding.match);
		if (!existingMatchMap.has(key)) existingMatchMap.set(key, normalizeAgentId(binding.agentId));
	}
	const added = [];
	const updated = [];
	const skipped = [];
	const conflicts = [];
	for (const binding of bindings) {
		const agentId = normalizeAgentId(binding.agentId);
		const key = bindingMatchKey(binding.match);
		const existingAgentId = existingMatchMap.get(key);
		if (existingAgentId) {
			if (existingAgentId === agentId) skipped.push(binding);
			else conflicts.push({
				binding,
				existingAgentId
			});
			continue;
		}
		const upgradeIndex = normalizeOptionalString(binding.match.accountId) ? existingRoutes.findIndex((candidate) => !normalizeOptionalString(candidate.match.accountId) && normalizeAgentId(candidate.agentId) === agentId && bindingMatchIdentityKey(candidate.match) === bindingMatchIdentityKey(binding.match)) : -1;
		if (upgradeIndex >= 0) {
			const current = existingRoutes[upgradeIndex];
			if (!current) continue;
			const previousKey = bindingMatchKey(current.match);
			const upgradedBinding = {
				...current,
				agentId,
				match: {
					...current.match,
					accountId: binding.match.accountId?.trim()
				}
			};
			existingRoutes[upgradeIndex] = upgradedBinding;
			existingMatchMap.delete(previousKey);
			existingMatchMap.set(bindingMatchKey(upgradedBinding.match), agentId);
			updated.push(upgradedBinding);
			continue;
		}
		existingMatchMap.set(key, agentId);
		added.push({
			...binding,
			agentId
		});
	}
	if (added.length === 0 && updated.length === 0) return {
		config: cfg,
		added,
		updated,
		skipped,
		conflicts
	};
	return {
		config: {
			...cfg,
			bindings: [
				...existingRoutes,
				...added,
				...nonRouteBindings
			]
		},
		added,
		updated,
		skipped,
		conflicts
	};
}
function removeAgentBindings(cfg, bindings) {
	const existingRoutes = listRouteBindings(cfg);
	const nonRouteBindings = (cfg.bindings ?? []).filter((binding) => !isRouteBinding(binding));
	const removeIndexes = /* @__PURE__ */ new Set();
	const removed = [];
	const missing = [];
	const conflicts = [];
	for (const binding of bindings) {
		const desiredAgentId = normalizeAgentId(binding.agentId);
		const key = bindingMatchKey(binding.match);
		let matchedIndex = -1;
		let conflictingAgentId = null;
		for (const [i, current] of existingRoutes.entries()) {
			if (removeIndexes.has(i)) continue;
			if (bindingMatchKey(current.match) !== key) continue;
			const currentAgentId = normalizeAgentId(current.agentId);
			if (currentAgentId === desiredAgentId) {
				matchedIndex = i;
				break;
			}
			conflictingAgentId = currentAgentId;
		}
		if (matchedIndex >= 0) {
			const matched = existingRoutes[matchedIndex];
			if (matched) {
				removeIndexes.add(matchedIndex);
				removed.push(matched);
			}
			continue;
		}
		if (conflictingAgentId) {
			conflicts.push({
				binding,
				existingAgentId: conflictingAgentId
			});
			continue;
		}
		missing.push(binding);
	}
	if (removeIndexes.size === 0) return {
		config: cfg,
		removed,
		missing,
		conflicts
	};
	const nextBindings = [...existingRoutes.filter((_, index) => !removeIndexes.has(index)), ...nonRouteBindings];
	return {
		config: {
			...cfg,
			bindings: nextBindings.length > 0 ? nextBindings : void 0
		},
		removed,
		missing,
		conflicts
	};
}
function getBindingChannelPlugin(channel) {
	return getLoadedChannelPlugin(channel) ?? getBundledChannelSetupPlugin(channel);
}
function resolveBindingAccountId(params) {
	const explicitAccountId = params.explicitAccountId?.trim();
	if (explicitAccountId) return explicitAccountId;
	const plugin = getBindingChannelPlugin(params.channel);
	const pluginAccountId = (plugin?.setupContract?.resolveBindingAccountId ?? plugin?.setup?.resolveBindingAccountId)?.({
		cfg: params.config,
		agentId: params.agentId
	});
	if (pluginAccountId?.trim()) return pluginAccountId.trim();
	if (plugin && plugin.config.listAccountIds(params.config).length > 1) return "*";
	if (plugin?.meta.forceAccountBinding) return resolveChannelDefaultAccountId({
		plugin,
		cfg: params.config
	});
}
function buildChannelBindings(params) {
	const bindings = [];
	const agentId = normalizeAgentId(params.agentId);
	for (const channel of params.selection) {
		const match = { channel };
		const accountId = resolveBindingAccountId({
			channel,
			config: params.config,
			agentId,
			explicitAccountId: params.accountIds?.[channel]
		});
		if (accountId) match.accountId = accountId;
		bindings.push({
			type: "route",
			agentId,
			match
		});
	}
	return bindings;
}
function parseBindingSpecs(params) {
	const bindings = [];
	const errors = [];
	const specs = params.specs ?? [];
	const agentId = normalizeAgentId(params.agentId);
	let manifestChannelIds;
	for (const raw of specs) {
		const trimmed = raw?.trim();
		if (!trimmed) continue;
		const [channelRaw, accountRaw, ...extraSegments] = trimmed.split(":");
		if (extraSegments.length > 0) {
			errors.push(`Invalid binding "${trimmed}". Account id cannot contain ":". Use <channel>:<account>, for example telegram:default.`);
			continue;
		}
		let channel = normalizeChatChannelId(channelRaw);
		if (!channel) {
			const normalized = normalizeOptionalString(channelRaw)?.toLowerCase();
			if (normalized) {
				manifestChannelIds ??= new Set(listPluginContributionIds({
					contribution: "channels",
					includeDisabled: true,
					config: params.config,
					env: process.env
				}));
				channel = manifestChannelIds.has(normalized) ? normalized : null;
			}
		}
		if (!channel) {
			errors.push(formatUnknownChannelMessage({ channel: expectDefined(channelRaw, "agents.bindings channel raw") }));
			continue;
		}
		let accountId = accountRaw?.trim();
		if (accountRaw !== void 0 && !accountId) {
			errors.push(`Invalid binding "${trimmed}". Account id is empty. Use <channel>:<account>, for example telegram:default.`);
			continue;
		}
		accountId = resolveBindingAccountId({
			channel,
			config: params.config,
			agentId,
			explicitAccountId: accountId
		});
		const match = { channel };
		if (accountId) match.accountId = accountId;
		bindings.push({
			type: "route",
			agentId,
			match
		});
	}
	return {
		bindings,
		errors
	};
}
//#endregion
export { removeAgentBindings as i, buildChannelBindings as n, parseBindingSpecs as r, applyAgentBindings as t };
