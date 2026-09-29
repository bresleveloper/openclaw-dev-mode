import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { d as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { V as withPluginCommandExecution } from "./runtime-BvdPUus5.mjs";
import { i as canExposeSenderIsOwner, o as isTrustedReservedCommandOwner, t as isReservedCommandName } from "./command-registration-vCqATNjA.mjs";
import { n as resolveCommandConversationResolution } from "./conversation-resolution-BQfeG7hv.mjs";
import { c as getCurrentPluginConversationBinding, f as requestPluginConversationBinding, s as detachPluginConversationBinding } from "./conversation-binding-6xSU5aQc.mjs";
import { t as pluginCommandSupportsChannel } from "./plugin-command-metadata-DBJKw3Pr.mjs";
//#region src/agents/session-agent-binding.ts
/**
* Session-to-agent binding resolver.
*
* Derives the trusted active agent from explicit agent ids, agent session keys, or configured main-session aliases.
*/
/**
* Resolve the trusted active agent bound to a host-owned session reference.
*/
function resolveBoundAgentIdForSession(params) {
	const config = params.config ?? {};
	const agentId = normalizeOptionalString(params.agentId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!agentId && !sessionKey) return;
	if (agentId) return resolveSessionAgentId({
		config,
		sessionKey,
		agentId
	});
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
	const loweredSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	const mainKey = normalizeMainKey(config.session?.mainKey);
	return Boolean(parseAgentSessionKey(sessionKey)?.agentId) || persistedOwner.kind !== "none" || loweredSessionKey === "main" || loweredSessionKey === mainKey ? resolveSessionAgentId({
		config,
		sessionKey
	}) : void 0;
}
//#endregion
//#region src/plugins/plugin-command-execution.ts
/** Exact-registry plugin command execution shared by focused and compatibility runtimes. */
const MAX_ARGS_LENGTH = 4096;
const blockedCompaction = (reason) => ({
	compacted: false,
	reason
});
function sanitizeArgs(args) {
	if (!args) return;
	let sanitized = "";
	for (const char of truncateUtf16Safe(args, MAX_ARGS_LENGTH)) {
		const code = char.charCodeAt(0);
		if (!(code <= 31 && code !== 9 && code !== 10 || code === 127)) sanitized += char;
	}
	return sanitized;
}
function resolveBindingConversation(params) {
	const channelPlugin = params.registry.channels.find((entry) => entry.plugin.id === params.channel)?.plugin;
	if (!channelPlugin?.bindings?.resolveCommandConversation) return null;
	return resolveCommandConversationResolution({
		cfg: params.config,
		plugin: channelPlugin,
		channel: params.channel,
		accountId: params.accountId,
		threadId: params.messageThreadId,
		threadParentId: params.threadParentId,
		senderId: params.senderId,
		originatingTo: params.originatingTo ?? params.from,
		commandTo: params.to,
		fallbackTo: params.to ?? params.from
	});
}
function buildRuntimeContext(command, params, invocationSignal, assertOwnerCurrent) {
	const sessionKey = params.sessionKey?.trim();
	const agentId = resolveBoundAgentIdForSession({
		config: params.config,
		agentId: params.agentId,
		sessionKey
	});
	const compactCurrent = params.runtimeContext?.compactCurrent;
	if (!sessionKey && !agentId) return;
	return {
		llm: { complete: async (request) => {
			const { createRuntimeLlm } = await import("./runtime-llm.runtime.js");
			return await createRuntimeLlm({
				getConfig: () => params.config,
				authority: {
					caller: {
						kind: "plugin",
						id: command.pluginId,
						name: command.pluginName
					},
					pluginIdForPolicy: command.pluginId,
					requiresBoundAgent: true,
					...sessionKey ? { sessionKey } : {},
					...agentId ? { agentId } : {},
					...params.authProfileId ? { preferredProfile: params.authProfileId } : {},
					allowAgentIdOverride: false,
					allowModelOverride: false,
					allowComplete: true
				}
			}).complete(request);
		} },
		...compactCurrent && params.sessionTarget ? { compactCurrent: async () => {
			if (invocationSignal.aborted) return blockedCompaction("command invocation closed");
			return await compactCurrent(invocationSignal, assertOwnerCurrent);
		} } : {}
	};
}
async function executeRegisteredPluginCommand(registry, params) {
	const assertAdmittedOwner = params.assertOwnerCurrent;
	const { command, args, senderId, channel, isAuthorizedSender, commandBody, config } = params;
	if (!pluginCommandSupportsChannel(command, channel)) {
		logVerbose(`Plugin command /${command.name} skipped on unsupported channel ${channel}`);
		return { continueAgent: true };
	}
	if (command.requireAuth !== false && !isAuthorizedSender) {
		logVerbose(`Plugin command /${command.name} blocked: unauthorized sender ${senderId || "<unknown>"}`);
		return { text: "⚠️ This command requires authorization." };
	}
	if (command.requiredScopes !== void 0 && !Array.isArray(command.requiredScopes)) {
		logVerbose(`Plugin command /${command.name} blocked: invalid requiredScopes configuration`);
		return { text: "⚠️ This command has invalid gateway scope configuration." };
	}
	const requiredScopes = command.requiredScopes ?? [];
	if (requiredScopes.find((scope) => !isOperatorScope(scope))) {
		logVerbose(`Plugin command /${command.name} blocked: unknown gateway scope`);
		return { text: "⚠️ This command has invalid gateway scope configuration." };
	}
	if (requiredScopes.length > 0) {
		const scopes = Array.isArray(params.gatewayClientScopes) ? new Set(params.gatewayClientScopes) : void 0;
		const hasAdmin = scopes?.has(ADMIN_SCOPE) === true;
		const missingScope = scopes ? requiredScopes.find((scope) => !hasAdmin && !scopes.has(scope)) : requiredScopes[0];
		if (missingScope && (scopes !== void 0 || params.senderIsOwner !== true)) {
			logVerbose(`Plugin command /${command.name} blocked: missing gateway scope ${missingScope}`);
			return { text: `⚠️ This command requires gateway scope: ${missingScope}.` };
		}
	}
	const bindingConversation = resolveBindingConversation({
		registry,
		config,
		channel,
		senderId,
		from: params.from,
		to: params.to,
		originatingTo: params.originatingTo,
		accountId: params.accountId,
		messageThreadId: params.messageThreadId,
		threadParentId: params.threadParentId
	});
	const trustedReservedOwner = isTrustedReservedCommandOwner(command) && command.ownership === "reserved" && isReservedCommandName(command.name) && command.pluginId === normalizeLowercaseStringOrEmpty(command.name);
	const senderIsOwner = canExposeSenderIsOwner(command) || trustedReservedOwner ? params.senderIsOwner : void 0;
	const commandInvocationAbort = new AbortController();
	const assertOwnerCurrent = senderIsOwner === true ? () => {
		if (commandInvocationAbort.signal.aborted) throw new Error("Plugin command invocation closed.");
		assertAdmittedOwner?.();
	} : void 0;
	const ctx = {
		senderId,
		channel,
		channelId: params.channelId,
		isAuthorizedSender,
		...senderIsOwner === void 0 ? {} : { senderIsOwner },
		...assertOwnerCurrent ? { assertOwnerCurrent } : {},
		gatewayClientScopes: params.gatewayClientScopes,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		args: sanitizeArgs(args),
		commandBody,
		config,
		from: params.from,
		to: params.to,
		accountId: bindingConversation?.accountId ?? params.accountId,
		messageThreadId: params.messageThreadId,
		threadParentId: params.threadParentId,
		diagnosticsSessions: params.diagnosticsSessions,
		runtimeContext: buildRuntimeContext(command, params, commandInvocationAbort.signal, assertOwnerCurrent),
		...trustedReservedOwner && params.diagnosticsUploadApproved !== void 0 ? { diagnosticsUploadApproved: params.diagnosticsUploadApproved } : {},
		...trustedReservedOwner && params.diagnosticsPreviewOnly !== void 0 ? { diagnosticsPreviewOnly: params.diagnosticsPreviewOnly } : {},
		...trustedReservedOwner && params.diagnosticsPrivateRouted !== void 0 ? { diagnosticsPrivateRouted: params.diagnosticsPrivateRouted } : {},
		requestConversationBinding: async (bindingParams) => {
			if (!command.pluginRoot || !bindingConversation) return {
				status: "error",
				message: "This command cannot bind the current conversation."
			};
			return requestPluginConversationBinding({
				pluginId: command.pluginId,
				pluginName: command.pluginName,
				pluginRoot: command.pluginRoot,
				requestedBySenderId: senderId,
				conversation: bindingConversation,
				binding: bindingParams,
				assertCurrent: assertOwnerCurrent
			});
		},
		detachConversationBinding: async () => command.pluginRoot && bindingConversation ? detachPluginConversationBinding({
			pluginRoot: command.pluginRoot,
			conversation: bindingConversation
		}) : { removed: false },
		getCurrentConversationBinding: async () => command.pluginRoot && bindingConversation ? getCurrentPluginConversationBinding({
			pluginRoot: command.pluginRoot,
			conversation: bindingConversation
		}) : null
	};
	try {
		if (requiredScopes.length > 0 && !Array.isArray(params.gatewayClientScopes)) assertOwnerCurrent?.();
		const execution = await withPluginCommandExecution(registry, () => command.handler(ctx));
		if (!execution.admitted) return { text: "⚠️ This command is no longer available after the plugin registry changed. Please try again." };
		const result = execution.value;
		logVerbose(`Plugin command /${command.name} executed successfully for ${senderId || "unknown"}`);
		if (!result || typeof result !== "object") {
			logVerbose(`Plugin command /${command.name} returned no reply payload`);
			return {};
		}
		return result;
	} catch (error) {
		logVerbose(`Plugin command /${command.name} error: ${error.message}`);
		return { text: "⚠️ Command failed. Please try again later." };
	} finally {
		commandInvocationAbort.abort("command invocation closed");
	}
}
//#endregion
export { resolveBoundAgentIdForSession as n, executeRegisteredPluginCommand as t };
