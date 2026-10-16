import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { a as listLoadedChannelPlugins, i as getLoadedChannelPluginForRead, n as getLoadedChannelPluginById } from "./registry-loaded-BugfxX6l.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { a as isInternalMessageChannel } from "./message-channel-j-k-Nup3.mjs";
import { f as resolveOperatorRolePolicyForAssignment, m as resolveOperatorRoleSelection } from "./operator-role-policy-BqPaarjx.mjs";
import { d as resolveUserChannelIdentity, s as parseUserChannelAuthorizationReference, u as resolveUserChannelAuthorizationPolicy } from "./user-channel-identities-B5nWYNy7.mjs";
import { a as prepareUserChannelIdentityAuthority, i as prepareConfiguredCommandOwnerAuthority, t as authorizeCanonicalUserChannelIdentity } from "./user-channel-identity-operations-COzOBly4.mjs";
import { c as resumeGatewayOperatorAccessGrant, i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, s as resolvePreparedGatewayOperatorAccessAuthority } from "./operator-access-policy-DIBw5efa.mjs";
import { t as resolveIdentityOperatorScopes } from "./operator-identity-scopes-IJD0CgVb.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { t as getCommandSenderAuthority } from "./command-sender-authority-DZxZmstf.mjs";
//#region src/auto-reply/command-owner-authority.ts
const COMMAND_OWNER_AUTHORITY = Symbol("openclaw.commandOwnerAuthority");
var CommandOwnerRevokedError = class extends Error {};
var CommandOwnerCapability = class {
	#checkCurrent;
	constructor(authority) {
		this.isCurrent = () => this.#checkCurrent();
		this.#checkCurrent = authority.isCurrent.bind(authority);
		this.operatorAuthority = authority.operatorAuthority;
		this.recoveryReference = authority.recoveryReference && Object.freeze({ ...authority.recoveryReference });
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
	return Object.assign(() => {
		if (!authority.isCurrent()) throw new CommandOwnerRevokedError("Channel operator authority changed; send a new request.");
	}, { recoveryReference: authority.recoveryReference ?? null });
}
//#endregion
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
	const providerId = normalizeAnyChannelId(captured?.channel) ?? captured?.channel;
	const identity = reference ?? (providerId && captured?.senderId ? {
		channelId: providerId,
		accountId: normalizeAccountId(captured.accountId),
		senderId: captured.senderId
	} : void 0);
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
function isResetAuthorizedForContext(params) {
	if (resolveCommandAuthorizationState(params).access === "denied") return false;
	const provider = params.ctx.Provider;
	if (!(provider ? isInternalMessageChannel(provider) : isInternalMessageChannel(params.ctx.Surface))) return true;
	const scopes = params.ctx.GatewayClientScopes;
	if (!Array.isArray(scopes) || scopes.length === 0) return true;
	return scopes.includes("operator.admin");
}
//#endregion
export { resolveCommandOwnerAuthority as a, CommandOwnerRevokedError as c, getCommandOwnerAuthority as d, resolveCommandAuthorization as i, bindCommandOwnerAuthority as l, isResetAuthorizedForContext as n, resolveUpdateRequesterIdentityAuthority as o, prepareCommandOwnerAuthority as r, shouldUseFromAsSenderFallback as s, isConfiguredCommandOwner as t, captureCommandOwnerAssertion as u };
