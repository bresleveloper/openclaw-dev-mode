import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./registry-BKdVEB34.mjs";
import { a as isInternalMessageChannel } from "./message-channel-DDcHHhpX.mjs";
import { i as listLoadedChannelPlugins, r as getLoadedChannelPluginForRead, t as getLoadedChannelPluginById } from "./registry-loaded-CYq2sa_C.mjs";
import { r as resolveUserChannelIdentity } from "./user-channel-identities-0obbn8pH.mjs";
import { r as prepareUserChannelIdentityAuthority } from "./user-channel-identity-operations-DKvRoWkW.mjs";
import { f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-BNrKHiJ3.mjs";
import { i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, s as resolvePreparedGatewayOperatorAccessAuthority } from "./operator-access-policy-Dh1MoHMy.mjs";
import { t as resolveIdentityOperatorScopes } from "./operator-identity-scopes-IJD0CgVb.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { t as getCommandSenderAuthority } from "./command-sender-authority-DZxZmstf.mjs";
//#region src/auto-reply/command-owner-authority.ts
const COMMAND_OWNER_AUTHORITY = Symbol("openclaw.commandOwnerAuthority");
var CommandOwnerCapability = class {
	#checkCurrent;
	constructor(authority) {
		this.isCurrent = () => this.#checkCurrent();
		this.#checkCurrent = authority.isCurrent.bind(authority);
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value) {
		return typeof value === "object" && value !== null && #checkCurrent in value ? value : void 0;
	}
};
const readCapability = CommandOwnerCapability.read;
/** Host ingress binds a live check; ordinary context copies retain it, wire data cannot. */
function bindCommandOwnerAuthority(context, authority) {
	Object.assign(context, { [COMMAND_OWNER_AUTHORITY]: new CommandOwnerCapability(authority) });
}
function getCommandOwnerAuthority(context) {
	return readCapability(Reflect.get(context, COMMAND_OWNER_AUTHORITY));
}
/** Fence a turn that admitted owner tools against later identity or role revocation. */
function captureCommandOwnerAssertion(context) {
	const authority = getCommandOwnerAuthority(context);
	if (!authority) return;
	return () => {
		if (!authority.isCurrent()) throw new Error("Channel operator authority changed; send a new request.");
	};
}
//#endregion
//#region src/gateway/channel-operator-authority.ts
/** One-shot CLI owners retain the grant while checking their original installation's state. */
function resolveChannelOperatorAdminAuthority(cfg, identity, stateOptions = {}) {
	const prepared = resolveChannelOperatorIdentityFacts(cfg, identity, stateOptions);
	return prepared && captureLinkedOperatorAdmin(cfg, prepared.linked, prepared.isCurrent);
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
		isCurrent: () => {
			const current = resolveUserChannelIdentity(capturedIdentity, stateOptions);
			return current !== void 0 && current.profileId === linked.profileId && current.role === linked.role && linked.emails.every((email) => current.emails.includes(email)) && linked.loginIdentities.every((login) => current.loginIdentities.includes(login));
		}
	};
}
function resolveLinkedOperatorAdmin(cfg, linked) {
	const policy = resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, cfg);
	return (policy ? policy.scopes.includes("operator.admin") : linked.loginIdentities.some((login) => resolveIdentityOperatorScopes(login, cfg.gateway?.auth?.identityScopes).includes("operator.admin"))) ? linked.profileId : void 0;
}
function captureLinkedOperatorAdminIdentity(cfg, linked, isIdentityCurrent) {
	if (!resolveLinkedOperatorAdmin(cfg, linked)) return;
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, cfg)?.accessPolicyPlugin;
	let current = true;
	const isCurrent = (currentCfg) => {
		current &&= isIdentityCurrent() && resolveLinkedOperatorAdmin(currentCfg, linked) === linked.profileId && resolveOperatorRolePolicyForAssignment(linked.profileId, linked.role, currentCfg)?.accessPolicyPlugin === requiredPlugin;
		return current;
	};
	return isCurrent(cfg) ? {
		profileId: linked.profileId,
		isCurrent
	} : void 0;
}
function captureLinkedOperatorAdmin(cfg, linked, isIdentityCurrent) {
	const identity = captureLinkedOperatorAdminIdentity(cfg, linked, isIdentityCurrent);
	if (!identity) return;
	try {
		const access = resolvePreparedGatewayOperatorAccessAuthority({
			...linked,
			isCurrent: isIdentityCurrent
		}, cfg);
		let current = true;
		const isCurrent = (currentCfg) => {
			current &&= identity.isCurrent(currentCfg) && hasCurrentGatewayOperatorAccess(access);
			return current;
		};
		return isCurrent(cfg) ? {
			profileId: linked.profileId,
			isCurrent,
			...access ? { signal: access.signal } : {}
		} : void 0;
	} catch (error) {
		if (error instanceof GatewayOperatorAccessDeniedError) return;
		throw error;
	}
}
async function prepareChannelOperatorAdmin(cfg, identity, stateOptions = {}) {
	if (!cfg.gateway?.roles && !cfg.gateway?.auth?.identityScopes) return;
	const prepared = await prepareUserChannelIdentityAuthority(identity, stateOptions);
	return prepared && captureLinkedOperatorAdmin(cfg, prepared.linked, prepared.isCurrent);
}
//#endregion
//#region src/auto-reply/sender-identity.ts
/** Shared sender identity helpers for authorization checks. */
function isConversationLikeIdentity(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return false;
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
	const candidates = [];
	const pushCandidate = (value) => {
		const trimmed = normalizeOptionalString(value) ?? "";
		if (!trimmed) return;
		candidates.push(trimmed);
	};
	if (plugin?.commands?.preferSenderE164ForCommands) {
		pushCandidate(params.senderE164);
		pushCandidate(params.senderId);
	} else {
		pushCandidate(params.senderId);
		pushCandidate(params.senderE164);
	}
	if (candidates.length === 0 && shouldUseFromAsSenderFallback({
		from: params.from,
		chatType: params.chatType
	})) pushCandidate(params.from);
	pushCandidate(params.commandSenderId);
	const normalized = [];
	for (const sender of candidates) {
		const entries = normalizeAllowFromEntry({
			plugin,
			cfg,
			accountId,
			value: sender
		});
		for (const entry of entries) if (!normalized.includes(entry)) normalized.push(entry);
	}
	return normalized;
}
//#endregion
//#region src/auto-reply/command-auth.ts
/** Command authorization helpers for owner and allowlist checks. */
function resolveProviderFromContext(ctx, cfg) {
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
	const inferredProviders = probeInferredProviders(ctx, cfg);
	const inferred = inferredProviders.candidates[0];
	if (inferredProviders.candidates.length === 1 && inferred) return inferred;
	return {
		providerId: void 0,
		hadResolutionError: inferredProviders.droppedResolutionError || inferredProviders.candidates.some((entry) => entry.hadResolutionError)
	};
}
function probeInferredProviders(ctx, cfg) {
	let droppedResolutionError = false;
	const candidates = [];
	for (const plugin of listLoadedChannelPlugins()) {
		const resolved = resolveProviderAllowFrom({
			plugin,
			cfg,
			accountId: ctx.AccountId
		});
		if (resolved.allowFromList.length > 0) candidates.push({
			providerId: plugin.id,
			hadResolutionError: resolved.hadResolutionError
		});
		else if (resolved.hadResolutionError) droppedResolutionError = true;
	}
	return {
		candidates,
		droppedResolutionError
	};
}
function isWildcardAllowFromEntry(entry) {
	return entry.trim() === "*";
}
function hasWildcardAllowFrom(list) {
	return list.some((entry) => isWildcardAllowFromEntry(entry));
}
function stripWildcardAllowFrom(list) {
	return list.filter((entry) => !isWildcardAllowFromEntry(entry));
}
function resolveProviderAllowFrom(params) {
	const { plugin, cfg, accountId } = params;
	const providerId = params.forceFallbackResolutionError ? params.providerId ?? plugin?.id : plugin?.id;
	const resolveFallback = () => resolveFallbackAllowFrom({
		cfg,
		providerId,
		accountId
	});
	let hadResolutionError = Boolean(params.forceFallbackResolutionError);
	let allowFrom;
	if (hadResolutionError || !plugin?.config?.resolveAllowFrom) allowFrom = resolveFallback();
	else try {
		const resolved = plugin.config.resolveAllowFrom({
			cfg,
			accountId
		});
		if (resolved == null || Array.isArray(resolved)) allowFrom = resolved ?? [];
		else {
			console.warn(`[command-auth] resolveAllowFrom returned an invalid allowFrom for provider "${providerId}", falling back to config allowFrom: invalid_result`);
			hadResolutionError = true;
			allowFrom = resolveFallback();
		}
	} catch (err) {
		console.warn(`[command-auth] resolveAllowFrom threw for provider "${providerId}", falling back to config allowFrom: ${describeAllowFromResolutionError(err)}`);
		hadResolutionError = true;
		allowFrom = resolveFallback();
	}
	return {
		allowFrom,
		allowFromList: formatAllowFromList({
			plugin,
			cfg,
			accountId,
			allowFrom
		}),
		hadResolutionError
	};
}
function describeAllowFromResolutionError(err) {
	if (err instanceof Error) return (normalizeOptionalString(err.name) ?? "") || "Error";
	return "unknown_error";
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
		if (!params.providerId || channel !== params.providerId || normalizeChatChannelId(prefix) && /^[^:]+:user:[^:\s*]+$/i.test(trimmed)) continue;
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
function resolveOwnerCandidatesForCommands(params) {
	if (params.allowAll) return [];
	const ownerCandidatesForCommands = stripWildcardAllowFrom(params.allowFromList);
	if (ownerCandidatesForCommands.length > 0 || !params.to) return ownerCandidatesForCommands;
	return normalizeAllowFromEntry({
		...params,
		value: params.to
	});
}
function resolveOwnerAuthorizationState(params) {
	const configOwnerAllowFromList = resolveOwnerAllowFromList({
		...params,
		allowFrom: params.configOwnerAllowFrom
	});
	const contextOwnerAllowFromList = resolveOwnerAllowFromList({
		...params,
		allowFrom: params.contextOwnerAllowFrom
	});
	const allowAll = !params.hadResolutionError && (params.allowFromList.length === 0 || hasWildcardAllowFrom(params.allowFromList));
	const channelCommandOwners = resolveOwnerCandidatesForCommands({
		...params,
		allowAll
	});
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
		const commandsAllowFromList = params.commandsAllowFromList;
		const commandsAllowAll = !params.providerResolutionError && Boolean(commandsAllowFromList && hasWildcardAllowFrom(commandsAllowFromList));
		const matchedCommandsAllowFrom = commandsAllowFromList?.length ? params.senderCandidates.find((candidate) => commandsAllowFromList.includes(candidate)) : void 0;
		return !params.providerResolutionError && (commandsAllowAll || Boolean(matchedCommandsAllowFrom)) ? "commands" : "denied";
	}
	if (!params.commandAuthorized) return "denied";
	return params.isOwnerForCommands ? "commands" : "reset-only";
}
function resolveFallbackAllowFrom(params) {
	const providerId = normalizeOptionalString(params.providerId);
	if (!providerId) return [];
	const channelCfg = params.cfg.channels?.[providerId];
	const accountCfg = resolveFallbackAccountConfig(channelCfg?.accounts, providerId, params.accountId) ?? resolveFallbackDefaultAccountConfig(channelCfg, providerId);
	const allowFrom = accountCfg?.allowFrom ?? accountCfg?.dm?.allowFrom ?? channelCfg?.allowFrom ?? channelCfg?.dm?.allowFrom;
	return Array.isArray(allowFrom) ? allowFrom : [];
}
function resolveFallbackAccountConfig(accounts, channelId, accountId) {
	const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
	if (!accounts || !normalizedAccountId) return;
	return resolveChannelAccountEntry(accounts, normalizedAccountId, channelId);
}
function resolveFallbackDefaultAccountConfig(channelCfg, channelId) {
	const accounts = channelCfg?.accounts;
	if (!accounts) return;
	const preferred = resolveFallbackAccountConfig(accounts, channelId, channelCfg?.defaultAccount) ?? resolveFallbackAccountConfig(accounts, channelId, "default");
	if (preferred) return preferred;
	const definedAccountIds = Object.keys(accounts).filter((id) => accounts[id]);
	const accountId = definedAccountIds.length === 1 ? definedAccountIds[0] : void 0;
	return accountId === void 0 ? void 0 : resolveChannelAccountEntry(accounts, accountId, channelId);
}
function resolveCommandAuthorizationState(params) {
	const { ctx, cfg, commandAuthorized } = params;
	const { providerId, hadResolutionError: providerResolutionError } = resolveProviderFromContext(ctx, cfg);
	const plugin = providerId ? getLoadedChannelPluginById(providerId) : void 0;
	const from = normalizeOptionalString(ctx.From) ?? "";
	const to = normalizeOptionalString(ctx.To) ?? "";
	const commandsAllowFromConfigured = Boolean(cfg.commands?.allowFrom && typeof cfg.commands.allowFrom === "object");
	const commandsAllowFromList = resolveCommandsAllowFromList({
		plugin,
		cfg,
		accountId: ctx.AccountId,
		providerId
	});
	const resolvedAllowFrom = resolveProviderAllowFrom({
		plugin,
		cfg,
		accountId: ctx.AccountId,
		providerId,
		forceFallbackResolutionError: providerResolutionError
	});
	const ownerState = resolveOwnerAuthorizationState({
		plugin,
		cfg,
		accountId: ctx.AccountId,
		providerId,
		to,
		allowFromList: resolvedAllowFrom.allowFromList,
		hadResolutionError: resolvedAllowFrom.hadResolutionError,
		configOwnerAllowFrom: cfg.commands?.ownerAllowFrom,
		contextOwnerAllowFrom: ctx.OwnerAllowFrom
	});
	const senderCandidates = resolveSenderCandidates({
		plugin,
		cfg,
		accountId: ctx.AccountId,
		senderId: ctx.SenderId,
		senderE164: ctx.SenderE164,
		commandSenderId: getCommandSenderAuthority(ctx)?.(),
		from,
		chatType: ctx.ChatType
	});
	const matchedSender = ownerState.explicitOwners.length ? senderCandidates.find((candidate) => ownerState.explicitOwners.includes(candidate)) : void 0;
	const matchedCommandOwner = ownerState.commandOwnerCandidates.length ? senderCandidates.find((candidate) => ownerState.commandOwnerCandidates.includes(candidate)) : void 0;
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
function resolveCommandAuthorization(params) {
	return resolveCommandAuthorizationState(params).authorization;
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
function captureCommandOwnerIdentity(cfg, requester, stateOptions, resolveProfile) {
	const captured = { ...requester };
	if (isConfiguredCommandOwner(cfg, captured)) return Object.freeze({
		source: "configured-owner",
		isCurrent: (currentCfg) => isConfiguredCommandOwner(currentCfg, captured)
	});
	const providerId = normalizeAnyChannelId(captured.channel) ?? captured.channel;
	const authority = providerId && captured.senderId ? resolveProfile(cfg, {
		channelId: providerId,
		accountId: normalizeAccountId(captured.accountId),
		senderId: captured.senderId
	}, stateOptions) : void 0;
	return Object.freeze({
		source: authority ? `profile:${authority.profileId}` : void 0,
		...authority?.signal ? { signal: authority.signal } : {},
		isCurrent: (currentCfg) => authority !== void 0 && !isConfiguredCommandOwner(currentCfg, captured) && authority.isCurrent(currentCfg)
	});
}
/** Worker admission fixes the original person; synchronous final checks never touch SQLite. */
async function prepareCommandOwnerAuthority(cfg, requester, stateOptions = {}) {
	const captured = { ...requester };
	if (isConfiguredCommandOwner(cfg, captured)) return Object.freeze({
		source: "configured-owner",
		isCurrent: (currentCfg) => isConfiguredCommandOwner(currentCfg, captured)
	});
	const providerId = normalizeAnyChannelId(captured.channel) ?? captured.channel;
	const prepared = providerId && captured.senderId ? await prepareChannelOperatorAdmin(cfg, {
		channelId: providerId,
		accountId: normalizeAccountId(captured.accountId),
		senderId: captured.senderId
	}, stateOptions) : void 0;
	return Object.freeze({
		source: prepared ? `profile:${prepared.profileId}` : void 0,
		...prepared?.signal ? { signal: prepared.signal } : {},
		isCurrent: (currentCfg) => prepared !== void 0 && !isConfiguredCommandOwner(currentCfg, captured) && prepared.isCurrent(currentCfg)
	});
}
/** Resolves reset admission without granting other command or owner authority. */
function isResetAuthorizedForContext(params) {
	if (resolveCommandAuthorizationState(params).access === "denied") return false;
	const provider = params.ctx.Provider;
	if (!(provider ? isInternalMessageChannel(provider) : isInternalMessageChannel(params.ctx.Surface))) return true;
	const scopes = params.ctx.GatewayClientScopes;
	if (!Array.isArray(scopes) || scopes.length === 0) return true;
	return scopes.includes("operator.admin");
}
//#endregion
export { resolveCommandOwnerAuthority as a, bindCommandOwnerAuthority as c, resolveCommandAuthorization as i, captureCommandOwnerAssertion as l, isResetAuthorizedForContext as n, resolveUpdateRequesterIdentityAuthority as o, prepareCommandOwnerAuthority as r, shouldUseFromAsSenderFallback as s, isConfiguredCommandOwner as t, getCommandOwnerAuthority as u };
