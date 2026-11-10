import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeSortedUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as listPluginContributionIds } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { i as getBundledChannelSetupPlugin } from "./bundled-CEh6W_x7.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import "./plugin-registry-BKRXR0Si.mjs";
import { i as listRouteBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { c as formatUnknownChannelMessage } from "./error-format-Cd0oOG4L.mjs";
//#region src/commands/agents.bindings.ts
function bindingMatchKey(match) {
	const accountId = normalizeOptionalString(match.accountId);
	const identityKey = bindingMatchIdentityKey(match);
	return JSON.stringify([identityKey, accountId === "*" ? "*" : normalizeAccountId(accountId)]);
}
function bindingMatchIdentityKey(match) {
	const roles = Array.isArray(match.roles) ? normalizeSortedUniqueStringEntries(match.roles) : [];
	return JSON.stringify([
		normalizeLowercaseStringOrEmpty(match.channel),
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
function buildChannelBinding(params) {
	let accountId = params.explicitAccountId?.trim();
	if (!accountId) {
		const plugin = getLoadedChannelPlugin(params.channel) ?? getBundledChannelSetupPlugin(params.channel);
		const pluginAccountId = (plugin?.setupContract?.resolveBindingAccountId ?? plugin?.setup?.resolveBindingAccountId)?.({
			cfg: params.config,
			agentId: params.agentId
		});
		if (pluginAccountId?.trim()) accountId = pluginAccountId.trim();
		else if (plugin && plugin.config.listAccountIds(params.config).length > 1) accountId = "*";
		else if (plugin?.meta.forceAccountBinding) accountId = resolveChannelDefaultAccountId({
			plugin,
			cfg: params.config
		});
	}
	const match = { channel: params.channel };
	if (accountId) match.accountId = accountId;
	return {
		type: "route",
		agentId: params.agentId,
		match
	};
}
function buildChannelBindings(params) {
	const agentId = normalizeAgentId(params.agentId);
	return Array.from(params.selection, (channel) => buildChannelBinding({
		channel,
		config: params.config,
		agentId,
		explicitAccountId: params.accountIds?.[channel]
	}));
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
		const accountId = accountRaw?.trim();
		if (accountRaw !== void 0 && !accountId) {
			errors.push(`Invalid binding "${trimmed}". Account id is empty. Use <channel>:<account>, for example telegram:default.`);
			continue;
		}
		bindings.push(buildChannelBinding({
			channel,
			config: params.config,
			agentId,
			explicitAccountId: accountId
		}));
	}
	return {
		bindings,
		errors
	};
}
//#endregion
export { removeAgentBindings as i, buildChannelBindings as n, parseBindingSpecs as r, applyAgentBindings as t };
