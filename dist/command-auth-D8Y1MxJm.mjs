import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { i as normalizeChatChannelId } from "./ids-DhLNdNuz.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { a as listLoadedChannelPlugins, i as getLoadedChannelPluginForRead, n as getLoadedChannelPluginById } from "./registry-loaded-B-WQB-l0.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DmAdWHmL.mjs";
import { h as resolveOperatorRoleSelection, p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
import { i as getCommandOwnerAuthority, r as captureCommandOwnerAssertion } from "./command-owner-authority-DGt-GTro.mjs";
import { t as getCommandSenderAuthority } from "./command-sender-authority-DZxZmstf.mjs";
import { d as resolveUserChannelIdentity, s as parseUserChannelAuthorizationReference, u as resolveUserChannelAuthorizationPolicy } from "./user-channel-identities-B1CU1eh6.mjs";
import { a as prepareUserChannelIdentityAuthority, i as prepareConfiguredCommandOwnerAuthority, t as authorizeCanonicalUserChannelIdentity } from "./user-channel-identity-operations-CAjJ0iFU.mjs";
import { i as resolveChannelAllowFrom } from "./account-resolution-akTcFkRf.mjs";
import { c as resumeGatewayOperatorAccessGrant, i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, s as resolvePreparedGatewayOperatorAccessAuthority } from "./operator-access-policy-D9L4Y9uO.mjs";
import { t as resolveIdentityOperatorScopes } from "./operator-identity-scopes-IJD0CgVb.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
//#region src/gateway/channel-operator-authority.ts
/** One-shot CLI owners retain the grant while checking their original installation's state. */
function resolveChannelOperatorAdminAuthority(cfg, identity, stateOptions = {}) {
	const prepared = resolveChannelOperatorIdentityFacts(cfg, identity, stateOptions);
	return prepared && captureLinkedOperatorAdmin(cfg, prepared.linked, prepared.isCurrent)?.authority;
}
/** The update owner must prove accepted native custody before using identity-only checks. */
function resolveUpdateChannelOperatorAdminIdentityAuthority(cfg, identity, stateOptions = {}) {
	const prepared = resolveChannelOperatorIdentityFacts(cfg, identity, stateOptions);
	return prepared && captureLinkedOperatorAdminIdentity(cfg, prepared.linked, prepared.isCurrent);
}
function resolveChannelOperatorIdentityFacts(cfg, identity, stateOptions) {
	if (!cfg.gateway?.roles && !cfg.gateway?.auth?.identityScopes) return;
	const capturedIdentity = { ...identity };
	const linked = resolveUserChannelIdentity(capturedIdentity, stateOptions);
	if (!linked) return;
	return {
		linked,
		isCurrent: (currentCfg = cfg) => {
			const current = resolveUserChannelIdentity(capturedIdentity, stateOptions);
			const usesGithubAssignment = Object.keys(currentCfg.gateway?.roles?.assignments?.byGithubLogin ?? {}).length > 0 && resolveOperatorRoleSelection(linked.profileId, linked.role, currentCfg, linked.githubLogin ?? null).roleSource !== "assigned";
			return current !== void 0 && current.profileId === linked.profileId && current.role === linked.role && (!usesGithubAssignment || current.githubLogin === linked.githubLogin) && linked.emails.every((email) => current.emails.includes(email)) && linked.loginIdentities.every((login) => current.loginIdentities.includes(login));
		}
	};
}
function resolveLinkedOperatorAdmin(cfg, linked) {
	const policy = resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, cfg, linked.githubLogin ?? null);
	return (policy ? policy.scopes.includes("operator.admin") : linked.loginIdentities.some((login) => resolveIdentityOperatorScopes(login, cfg.gateway?.auth?.identityScopes).includes("operator.admin"))) ? linked.profileId : void 0;
}
function captureLinkedOperatorAdminIdentity(cfg, linked, isIdentityCurrent) {
	if (!resolveLinkedOperatorAdmin(cfg, linked)) return;
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, cfg, linked.githubLogin ?? null)?.accessPolicyPlugin;
	let current = true;
	const isCurrent = (currentCfg) => {
		current &&= isIdentityCurrent(currentCfg) && resolveLinkedOperatorAdmin(currentCfg, linked) === linked.profileId && resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, currentCfg, linked.githubLogin ?? null)?.accessPolicyPlugin === requiredPlugin;
		return current;
	};
	return isCurrent(cfg) ? {
		profileId: linked.profileId,
		isCurrent
	} : void 0;
}
function captureLinkedOperatorAdmin(cfg, linked, isIdentityCurrent, original) {
	const identity = captureLinkedOperatorAdminIdentity(cfg, linked, isIdentityCurrent);
	if (!identity) return;
	try {
		const access = original ? null : resolvePreparedGatewayOperatorAccessAuthority({
			...linked,
			githubLogin: linked.githubLogin ?? null,
			isCurrent: () => isIdentityCurrent(cfg)
		}, cfg);
		let current = true;
		const isCurrent = (currentCfg) => {
			current &&= identity.isCurrent(currentCfg) && hasCurrentGatewayOperatorAccess(access);
			if (current && original) {
				resumeGatewayOperatorAccessGrant({
					profileId: linked.profileId,
					emails: linked.emails,
					githubAccountIds: linked.githubAccountIds,
					assignedRole: linked.role,
					githubLogin: linked.githubLogin ?? null
				}, currentCfg, original.grant);
				current &&= isIdentityCurrent(currentCfg);
			}
			return current;
		};
		return isCurrent(cfg) ? {
			authority: {
				profileId: linked.profileId,
				isCurrent,
				...access ? { signal: access.signal } : {}
			},
			grant: access === null ? null : access.gatewayAccessGrant
		} : void 0;
	} catch (error) {
		if (error instanceof GatewayOperatorAccessDeniedError) return;
		throw error;
	}
}
async function prepareChannelOperatorAdmin(cfg, input, stateOptions = {}) {
	if (!cfg.gateway?.roles && !cfg.gateway?.auth?.identityScopes) return;
	const identity = "identity" in input ? input.identity : input;
	const policy = resolveUserChannelAuthorizationPolicy(cfg.gateway);
	const reference = "version" in identity ? parseUserChannelAuthorizationReference(identity) : void 0;
	if ("version" in identity && !reference) return;
	const prepared = "identity" in input ? input.prepared : await prepareUserChannelIdentityAuthority("version" in identity ? {
		authorizationId: identity.id,
		policy
	} : identity, stateOptions);
	if (!prepared) return;
	const captured = captureLinkedOperatorAdmin(cfg, prepared.linked, prepared.isCurrent, prepared.linked.authorization);
	if (!captured) return;
	const original = prepared.linked.authorization;
	const assertCurrent = () => {
		if (!captured.authority.isCurrent(cfg)) throw new GatewayOperatorAccessDeniedError();
	};
	const recoveryReference = original?.reference ?? (!("version" in identity) && captured.grant !== void 0 ? await authorizeCanonicalUserChannelIdentity({
		action: "authorize",
		identity,
		profileId: prepared.linked.profileId,
		policy,
		grant: captured.grant
	}, {
		...stateOptions,
		assertCurrent
	}) : void 0);
	assertCurrent();
	return {
		...captured.authority,
		recoveryReference,
		operatorProfile: {
			profileId: prepared.linked.profileId,
			assignedRole: prepared.linked.role,
			githubLogin: prepared.linked.githubLogin ?? null,
			scopes: resolveOperatorRolePolicyForAssignment(prepared.linked.profileId, prepared.linked.role, cfg, prepared.linked.githubLogin ?? null)?.scopes ?? ["operator.admin"],
			gatewayAccessGrant: captured.grant
		}
	};
}
//#endregion
//#region src/auto-reply/sender-identity.ts
/** Shared sender identity helpers for authorization checks. */
function isConversationLikeIdentity(value) {
	const normalized = value.toLowerCase();
	if (normalized.startsWith("chat_id:")) return true;
	return /(^|:)(channel|group|thread|topic|room|space|spaces):/.test(normalized);
}
function shouldUseFromAsSenderFallback(params) {
	const from = normalizeOptionalString(params.from) ?? "";
	if (!from) return false;
	const chatType = normalizeLowercaseStringOrEmpty(params.chatType);
	if (chatType && chatType !== "direct") return false;
	return !isConversationLikeIdentity(from);
}
function formatAllowFromList(params) {
	const { plugin, cfg, accountId, allowFrom } = params;
	if (!allowFrom || allowFrom.length === 0) return [];
	if (plugin?.config?.formatAllowFrom) return plugin.config.formatAllowFrom({
		cfg,
		accountId,
		allowFrom
	});
	return normalizeStringEntries(allowFrom);
}
function normalizeAllowFromEntry(params) {
	return formatAllowFromList({
		...params,
		allowFrom: [params.value]
	}).filter((entry) => Boolean(entry.trim()));
}
function resolveSenderCandidates(params) {
	const { plugin, cfg, accountId } = params;
	const candidates = normalizeTrimmedStringList(plugin?.commands?.preferSenderE164ForCommands ? [params.senderE164, params.senderId] : [params.senderId, params.senderE164]);
	if (candidates.length === 0 && shouldUseFromAsSenderFallback({
		from: params.from,
		chatType: params.chatType
	})) candidates.push(...normalizeTrimmedStringList([params.from]));
	candidates.push(...normalizeTrimmedStringList([params.commandSenderId]));
	return [...new Set(candidates.flatMap((sender) => normalizeAllowFromEntry({
		plugin,
		cfg,
		accountId,
		value: sender
	})))];
}
//#endregion
//#region src/auto-reply/command-auth.ts
function resolveExplicitProviderFromContext(ctx) {
	const explicitMessageChannels = [
		ctx.Surface,
		ctx.OriginatingChannel,
		ctx.Provider
	].map((value) => normalizeMessageChannel(value)).filter((value) => Boolean(value));
	const explicitMessageChannel = explicitMessageChannels.find((value) => value !== INTERNAL_MESSAGE_CHANNEL);
	if (!explicitMessageChannel && explicitMessageChannels.includes("webchat")) return {
		providerId: void 0,
		hadResolutionError: false
	};
	const direct = normalizeAnyChannelId(explicitMessageChannel ?? void 0) ?? explicitMessageChannel ?? normalizeAnyChannelId(ctx.Provider) ?? normalizeAnyChannelId(ctx.Surface) ?? normalizeAnyChannelId(ctx.OriginatingChannel);
	if (direct) return {
		providerId: direct,
		hadResolutionError: false
	};
	const candidates = [ctx.From, ctx.To].filter((value) => Boolean(value?.trim())).flatMap((value) => value.split(":").map((part) => part.trim()));
	for (const candidate of candidates) {
		const normalizedCandidateChannel = normalizeMessageChannel(candidate);
		if (normalizedCandidateChannel === "webchat") return {
			providerId: void 0,
			hadResolutionError: false
		};
		const normalized = normalizeAnyChannelId(normalizedCandidateChannel ?? void 0) ?? normalizedCandidateChannel ?? normalizeAnyChannelId(candidate);
		if (normalized) return {
			providerId: normalized,
			hadResolutionError: false
		};
	}
}
function resolveInferredProvider(candidates) {
	let droppedResolutionError = false;
	const inferredCandidates = [];
	for (const { providerId, resolved } of candidates) if (resolved.allowFromList.length > 0) inferredCandidates.push({
		providerId,
		hadResolutionError: resolved.hadResolutionError
	});
	else if (resolved.hadResolutionError) droppedResolutionError = true;
	const inferred = inferredCandidates[0];
	if (inferredCandidates.length === 1 && inferred) return inferred;
	return {
		providerId: void 0,
		hadResolutionError: droppedResolutionError || inferredCandidates.some((entry) => entry.hadResolutionError)
	};
}
function isWildcardAllowFromEntry(entry) {
	return entry.trim() === "*";
}
function stripWildcardAllowFrom(list) {
	return list.filter((entry) => !isWildcardAllowFromEntry(entry));
}
function resolveProviderAllowFromResult(params, result) {
	const { plugin, cfg, accountId } = params;
	const providerId = params.forceFallbackResolutionError ? params.providerId ?? plugin?.id : plugin?.id;
	let hadResolutionError = Boolean(params.forceFallbackResolutionError);
	let allowFrom;
	if ("error" in result) {
		console.warn(`[command-auth] resolveAllowFrom threw for provider "${providerId}", falling back to config allowFrom: ${describeAllowFromResolutionError(result.error)}`);
		hadResolutionError = true;
	} else if (result.value != null && !Array.isArray(result.value)) {
		console.warn(`[command-auth] resolveAllowFrom returned an invalid allowFrom for provider "${providerId}", falling back to config allowFrom: invalid_result`);
		hadResolutionError = true;
	}
	if (hadResolutionError) allowFrom = resolveFallbackAllowFrom({
		cfg,
		providerId,
		accountId
	});
	else allowFrom = "value" in result && Array.isArray(result.value) ? result.value : [];
	return {
		allowFromList: formatAllowFromList({
			plugin,
			cfg,
			accountId,
			allowFrom
		}),
		hadResolutionError
	};
}
function resolveProviderAllowFrom(params) {
	const { plugin, cfg, accountId } = params;
	let result;
	if (params.forceFallbackResolutionError || !plugin?.config?.resolveAllowFrom) result = { value: resolveFallbackAllowFrom({
		cfg,
		providerId: params.forceFallbackResolutionError ? params.providerId ?? plugin?.id : plugin?.id,
		accountId
	}) };
	else try {
		result = { value: plugin.config.resolveAllowFrom({
			cfg,
			accountId
		}) };
	} catch (error) {
		result = { error };
	}
	return resolveProviderAllowFromResult(params, result);
}
async function resolveProviderAllowFromAsync(params) {
	const { plugin, cfg, accountId } = params;
	if (params.forceFallbackResolutionError || !plugin) return resolveProviderAllowFrom(params);
	let result;
	try {
		result = { value: plugin.config.resolveAllowFromAsync || plugin.config.resolveAllowFrom ? await resolveChannelAllowFrom({
			plugin,
			cfg,
			accountId
		}) : resolveFallbackAllowFrom({
			cfg,
			providerId: plugin.id,
			accountId
		}) };
	} catch (error) {
		result = { error };
	}
	return resolveProviderAllowFromResult(params, result);
}
function describeAllowFromResolutionError(err) {
	return err instanceof Error ? normalizeOptionalString(err.name) ?? "Error" : "unknown_error";
}
function resolveOwnerAllowFromList(params) {
	const raw = params.allowFrom ?? params.cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(raw) || raw.length === 0) return [];
	const filtered = [];
	for (const trimmed of normalizeStringEntries(raw.map((entry) => entry ?? ""))) {
		const separatorIndex = trimmed.indexOf(":");
		const prefix = trimmed.slice(0, separatorIndex);
		const channel = separatorIndex > 0 ? normalizeAnyChannelId(prefix) : void 0;
		if (!channel) {
			filtered.push(trimmed);
			continue;
		}
		if (!params.providerId || channel !== params.providerId || normalizeChatChannelId(prefix) && /^[^:]+:user:[^:\s*]+$/i.test(trimmed) && params.plugin?.messaging?.directTargetStyle !== "user-prefixed") continue;
		const remainder = trimmed.slice(separatorIndex + 1).trim();
		if (remainder) filtered.push(remainder);
	}
	return formatAllowFromList({
		...params,
		allowFrom: filtered
	});
}
/**
* Resolves the commands.allowFrom list for a given provider.
* Returns the provider-specific list if defined, otherwise the "*" global list.
* Returns null if commands.allowFrom is not configured at all (fall back to channel allowFrom).
*/
function resolveCommandsAllowFromList(params) {
	const commandsAllowFrom = params.cfg.commands?.allowFrom;
	if (!commandsAllowFrom || typeof commandsAllowFrom !== "object") return null;
	const providerList = commandsAllowFrom[params.providerId ?? ""];
	const globalList = commandsAllowFrom["*"];
	const rawList = Array.isArray(providerList) ? providerList : globalList;
	if (!Array.isArray(rawList)) return null;
	return formatAllowFromList({
		...params,
		allowFrom: rawList
	});
}
function resolveOwnerAuthorizationState(params) {
	const configOwnerAllowFromList = resolveOwnerAllowFromList(params);
	const contextOwnerAllowFromList = resolveOwnerAllowFromList({
		...params,
		allowFrom: params.contextOwnerAllowFrom
	});
	const allowAll = !params.hadResolutionError && (params.allowFromList.length === 0 || params.allowFromList.some(isWildcardAllowFromEntry));
	const channelCommandOwners = allowAll ? [] : stripWildcardAllowFrom(params.allowFromList);
	if (!allowAll && channelCommandOwners.length === 0 && params.to) channelCommandOwners.push(...normalizeAllowFromEntry({
		...params,
		value: params.to
	}));
	const explicitOwners = Array.from(new Set(stripWildcardAllowFrom(configOwnerAllowFromList)));
	const contextCommandOwners = stripWildcardAllowFrom(contextOwnerAllowFromList);
	return {
		commandOwnerCandidates: Array.from(new Set(explicitOwners.length > 0 ? explicitOwners : contextCommandOwners.length > 0 ? contextCommandOwners : channelCommandOwners)),
		explicitOwners
	};
}
function resolveCommandSenderAuthorization(params) {
	if (params.enforceOwnerForCommands && !params.isOwnerForCommands) return "denied";
	if (params.commandsAllowFromList !== null || params.providerResolutionError && params.commandsAllowFromConfigured) {
		if (params.providerResolutionError) return "denied";
		return params.commandsAllowFromList?.some((entry) => isWildcardAllowFromEntry(entry) || params.senderCandidates.includes(entry)) ? "commands" : "denied";
	}
	if (!params.commandAuthorized) return "denied";
	return params.isOwnerForCommands ? "commands" : "reset-only";
}
function resolveFallbackAllowFrom(params) {
	const providerId = normalizeOptionalString(params.providerId);
	if (!providerId) return [];
	const channelCfg = params.cfg.channels?.[providerId];
	let accountCfg = resolveFallbackAccountConfig(channelCfg?.accounts, providerId, params.accountId);
	if (accountCfg == null) {
		const accounts = channelCfg?.accounts;
		if (accounts) {
			accountCfg = resolveFallbackAccountConfig(accounts, providerId, channelCfg?.defaultAccount) ?? resolveFallbackAccountConfig(accounts, providerId, "default");
			if (!accountCfg) {
				const definedAccountIds = Object.keys(accounts).filter((id) => accounts[id]);
				const accountId = definedAccountIds.length === 1 ? definedAccountIds[0] : void 0;
				accountCfg = accountId === void 0 ? void 0 : resolveChannelAccountEntry(accounts, accountId, providerId);
			}
		}
	}
	const allowFrom = accountCfg?.allowFrom ?? accountCfg?.dm?.allowFrom ?? channelCfg?.allowFrom ?? channelCfg?.dm?.allowFrom;
	return Array.isArray(allowFrom) ? allowFrom : [];
}
function resolveFallbackAccountConfig(accounts, channelId, accountId) {
	const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
	if (!accounts || !normalizedAccountId) return;
	return resolveChannelAccountEntry(accounts, normalizedAccountId, channelId);
}
function resolveCommandAuthorizationState(params, prepared) {
	const { ctx, cfg, commandAuthorized } = params;
	const { providerId, hadResolutionError: providerResolutionError } = prepared?.provider ?? resolveExplicitProviderFromContext(ctx) ?? resolveInferredProvider(listLoadedChannelPlugins().map((plugin) => ({
		providerId: plugin.id,
		resolved: resolveProviderAllowFrom({
			plugin,
			cfg,
			accountId: ctx.AccountId
		})
	})));
	const plugin = providerId ? getLoadedChannelPluginById(providerId) : void 0;
	const from = normalizeOptionalString(ctx.From) ?? "";
	const to = normalizeOptionalString(ctx.To) ?? "";
	const commandsAllowFromConfigured = Boolean(cfg.commands?.allowFrom && typeof cfg.commands.allowFrom === "object");
	const providerContext = {
		plugin,
		cfg,
		accountId: ctx.AccountId,
		providerId
	};
	const commandsAllowFromList = resolveCommandsAllowFromList(providerContext);
	const resolvedAllowFrom = prepared?.allowFrom ?? resolveProviderAllowFrom({
		...providerContext,
		forceFallbackResolutionError: providerResolutionError
	});
	const ownerState = resolveOwnerAuthorizationState({
		...providerContext,
		to,
		allowFromList: resolvedAllowFrom.allowFromList,
		hadResolutionError: resolvedAllowFrom.hadResolutionError,
		contextOwnerAllowFrom: ctx.OwnerAllowFrom
	});
	const senderCandidates = resolveSenderCandidates({
		...providerContext,
		senderId: ctx.SenderId,
		senderE164: ctx.SenderE164,
		commandSenderId: getCommandSenderAuthority(ctx)?.(),
		from,
		chatType: ctx.ChatType
	});
	const matchedSender = senderCandidates.find((candidate) => ownerState.explicitOwners.includes(candidate));
	const matchedCommandOwner = senderCandidates.find((candidate) => ownerState.commandOwnerCandidates.includes(candidate));
	const senderId = matchedSender ?? matchedCommandOwner ?? senderCandidates[0];
	const enforceOwner = Boolean(plugin?.commands?.enforceOwnerForCommands);
	const senderIsOwnerByIdentity = Boolean(matchedSender);
	const senderIsOwnerByScope = isInternalMessageChannel(ctx.Provider) && Array.isArray(ctx.GatewayClientScopes) && ctx.GatewayClientScopes.includes("operator.admin");
	const ownerAllowlistConfigured = ownerState.explicitOwners.length > 0;
	const assertOwnerCurrent = captureCommandOwnerAssertion(ctx);
	const senderIsOwner = senderIsOwnerByIdentity || senderIsOwnerByScope || getCommandOwnerAuthority(ctx)?.isCurrent() === true;
	const isOwnerForCommands = !(enforceOwner || ownerAllowlistConfigured) ? true : ownerAllowlistConfigured ? senderIsOwner : senderIsOwner || Boolean(matchedCommandOwner);
	const access = ctx.CommandInterpretationSuppressed === true ? "denied" : resolveCommandSenderAuthorization({
		commandAuthorized,
		enforceOwnerForCommands: enforceOwner,
		isOwnerForCommands,
		senderCandidates,
		commandsAllowFromList,
		providerResolutionError,
		commandsAllowFromConfigured
	});
	return {
		authorization: {
			providerId,
			ownerList: ownerState.explicitOwners,
			senderId: senderId || void 0,
			senderIsOwner,
			...assertOwnerCurrent ? { assertOwnerCurrent } : {},
			isAuthorizedSender: access === "commands",
			from: from || void 0,
			to: to || void 0
		},
		access
	};
}
/** @deprecated Await resolveCommandAuthorizationAsync for worker-owned channel allowlists. Supported through 2026-12-31. */
function resolveCommandAuthorization(params) {
	warnPluginSdkDeprecation({
		family: "command-authorization-sync",
		method: "resolveCommandAuthorization",
		replacement: "resolveCommandAuthorizationAsync"
	});
	return resolveCommandAuthorizationState(params).authorization;
}
async function prepareCommandAuthorization(params) {
	const { ctx, cfg } = params;
	const provider = resolveExplicitProviderFromContext(ctx) ?? resolveInferredProvider(await Promise.all(listLoadedChannelPlugins().map(async (plugin) => ({
		providerId: plugin.id,
		resolved: await resolveProviderAllowFromAsync({
			plugin,
			cfg,
			accountId: ctx.AccountId
		})
	}))));
	return {
		provider,
		allowFrom: await resolveProviderAllowFromAsync({
			plugin: provider.providerId ? getLoadedChannelPluginById(provider.providerId) : void 0,
			cfg,
			accountId: ctx.AccountId,
			providerId: provider.providerId,
			forceFallbackResolutionError: provider.hadResolutionError
		})
	};
}
/** Prepares channel allowlists through their worker-owned runtime before evaluating live authority. */
async function resolveCommandAuthorizationAsync(params) {
	return resolveCommandAuthorizationState(params, await prepareCommandAuthorization(params)).authorization;
}
function isConfiguredCommandOwner(cfg, requester) {
	const providerId = normalizeAnyChannelId(requester.channel) ?? requester.channel;
	const params = {
		cfg,
		plugin: providerId ? getLoadedChannelPluginForRead(providerId) : void 0,
		providerId,
		accountId: requester.accountId
	};
	const owners = stripWildcardAllowFrom(resolveOwnerAllowFromList(params));
	return resolveSenderCandidates({
		...params,
		senderId: requester.senderId
	}).some((sender) => owners.includes(sender));
}
/** Synchronous CLI capture; deferred effects retain its original person-access grant. */
function resolveCommandOwnerAuthority(cfg, requester, stateOptions = {}) {
	return captureCommandOwnerIdentity(cfg, requester, stateOptions, resolveChannelOperatorAdminAuthority);
}
/** Additional person policy stays with the original Gateway's accepted update operation. */
function resolveUpdateRequesterIdentityAuthority(cfg, requester, stateOptions = {}) {
	return captureCommandOwnerIdentity(cfg, requester, stateOptions, resolveUpdateChannelOperatorAdminIdentityAuthority);
}
function resolveCommandOwnerIdentity(requester) {
	const providerId = normalizeAnyChannelId(requester?.channel) ?? requester?.channel;
	return providerId && requester?.senderId ? {
		channelId: providerId,
		accountId: normalizeAccountId(requester.accountId),
		senderId: requester.senderId
	} : void 0;
}
function captureCommandOwnerIdentity(cfg, requester, stateOptions, resolveProfile) {
	const captured = { ...requester };
	if (isConfiguredCommandOwner(cfg, captured)) return Object.freeze({
		source: "configured-owner",
		isCurrent: (currentCfg) => isConfiguredCommandOwner(currentCfg, captured)
	});
	const identity = resolveCommandOwnerIdentity(captured);
	const authority = identity ? resolveProfile(cfg, identity, stateOptions) : void 0;
	return Object.freeze({
		source: authority ? `profile:${authority.profileId}` : void 0,
		...authority?.signal ? { signal: authority.signal } : {},
		isCurrent: (currentCfg) => authority !== void 0 && !isConfiguredCommandOwner(currentCfg, captured) && authority.isCurrent(currentCfg)
	});
}
/** Admission and recovery share the original authority owner; final checks never touch SQLite. */
async function prepareCommandOwnerAuthority(cfg, requester, stateOptions = {}) {
	const resolved = "identity" in requester ? requester : void 0;
	const captured = "identity" in requester ? {
		channel: requester.identity.channelId,
		accountId: requester.identity.accountId,
		senderId: requester.identity.senderId
	} : "version" in requester ? void 0 : { ...requester };
	const reference = "version" in requester ? requester : void 0;
	if (reference?.version === 2 || captured && isConfiguredCommandOwner(cfg, captured)) {
		const prepared = await prepareConfiguredCommandOwnerAuthority(cfg.commands?.ownerAllowFrom, stateOptions);
		const accepted = !reference || prepared?.recoveryReference.id === reference.id;
		return Object.freeze({
			source: accepted ? "configured-owner" : void 0,
			recoveryReference: prepared?.recoveryReference,
			isCurrent: (currentCfg) => accepted && (prepared ? prepared.isCurrent() : !reference) && (!captured || isConfiguredCommandOwner(currentCfg, captured))
		});
	}
	const identity = reference ?? resolveCommandOwnerIdentity(captured);
	const prepared = identity && await prepareChannelOperatorAdmin(cfg, resolved ?? identity, stateOptions);
	return Object.freeze({
		source: prepared ? `profile:${prepared.profileId}` : void 0,
		operatorProfile: prepared?.operatorProfile,
		recoveryReference: prepared?.recoveryReference,
		...prepared?.signal ? { signal: prepared.signal } : {},
		isCurrent: (currentCfg) => prepared !== void 0 && (!captured || !isConfiguredCommandOwner(currentCfg, captured)) && prepared.isCurrent(currentCfg)
	});
}
/** Resolves reset admission without granting other command or owner authority. */
async function isResetAuthorizedForContext(params) {
	return resolveCommandAuthorizationState(params, await prepareCommandAuthorization(params)).access !== "denied" && isResetAllowedForGatewayScopes(params.ctx);
}
function isResetAllowedForGatewayScopes(ctx) {
	const provider = ctx.Provider;
	if (!(provider ? isInternalMessageChannel(provider) : isInternalMessageChannel(ctx.Surface))) return true;
	const scopes = ctx.GatewayClientScopes;
	if (!Array.isArray(scopes) || scopes.length === 0) return true;
	return scopes.includes("operator.admin");
}
//#endregion
export { resolveCommandAuthorizationAsync as a, shouldUseFromAsSenderFallback as c, resolveCommandAuthorization as i, isResetAuthorizedForContext as n, resolveCommandOwnerAuthority as o, prepareCommandOwnerAuthority as r, resolveUpdateRequesterIdentityAuthority as s, isConfiguredCommandOwner as t };
