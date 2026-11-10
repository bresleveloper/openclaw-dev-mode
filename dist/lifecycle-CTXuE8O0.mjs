import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as closeAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { l as updateSessionEntry } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { c as readChannelContextAdmissionEvidence } from "./admission-evidence-CcY0jAvs.mjs";
import { i as resolveAcpThreadSessionDetailLines, n as resolveAcpSessionCwd } from "./session-identifiers-2CkhpQUq.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DksRcpO8.mjs";
import { u as resolveAcpSessionResolutionError } from "./manager.utils-L7wnnIwz.mjs";
import { i as resolveAcpDispatchPolicyMessage, n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError, t as isAcpEnabledByPolicy } from "./policy-C2Xkhgxq.mjs";
import { n as getAcpSessionManager } from "./manager-Cge77N9B.mjs";
import "./session-meta-DC-FqIqd.mjs";
import { x as normalizeConversationRef } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { T as expectedCurrentSessionBinding, k as resolveChannelDefaultBindingPlacement, t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { n as commandReply } from "./command-gates-Dcr0LjaJ.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, n as formatThreadBindingSpawnDisabledError, s as resolveThreadBindingMaxAgeMsForChannel, t as formatThreadBindingDisabledError } from "./thread-bindings-policy-Hq7cocye.mjs";
import { i as resolveSpawnedWorkspaceInheritance } from "./spawned-context-B5FDP6Bm.mjs";
import { i as resolveThreadBindingThreadName, r as resolveThreadBindingIntroText } from "./thread-bindings-messages-BiGDDOIC.mjs";
import { i as resolveRuntimeCwdForAcpSpawn, o as resolveAcpSpawnRuntimePolicyError, s as cleanupFailedAcpSpawn } from "./acp-spawn-runtime-DB6RooaU.mjs";
import { t as prepareChannelRunAdmission } from "./channel-run-admission-DxkX5ChJ.mjs";
import { r as resolveAcpCommandBindingContext, t as resolveAcpTargetSessionKey } from "./targets-IvXrw_Bb.mjs";
import { _ as parseSpawnInput, b as resolveCommandRequestId, f as acpCommandErrorReply, v as parseSteerInput, x as withAcpCommandErrorBoundary } from "./shared-DV-dBFts.mjs";
import { randomUUID } from "node:crypto";
//#region src/auto-reply/reply/commands-acp/bindings.ts
async function resolveBoundReplyPayload(params) {
	const channelId = normalizeAnyChannelId(params.binding.conversation.channel);
	if (!channelId) return;
	const buildPayload = getChannelPlugin(channelId)?.conversationBindings?.buildBoundReplyPayload;
	if (!buildPayload) return;
	return await buildPayload({
		operation: "acp-spawn",
		placement: params.placement,
		conversation: params.binding.conversation
	}) ?? void 0;
}
async function bindSpawnedAcpSession(params) {
	const { commandParams } = params;
	const currentConversation = params.mode === "conversation";
	const bindingContext = resolveAcpCommandBindingContext(commandParams);
	const { channel, accountId, conversationId, threadId } = bindingContext;
	if (!channel) return {
		ok: false,
		error: `ACP ${currentConversation ? "current-conversation" : "thread"} binding requires a channel context.`
	};
	const policy = resolveThreadBindingSpawnPolicy({
		cfg: commandParams.cfg,
		channel,
		accountId,
		kind: "acp"
	});
	if (!policy.enabled) return {
		ok: false,
		error: formatThreadBindingDisabledError({
			...policy,
			kind: "acp"
		})
	};
	if (!currentConversation && !policy.spawnEnabled) return {
		ok: false,
		error: formatThreadBindingSpawnDisabledError({
			...policy,
			kind: "acp"
		})
	};
	const bindingService = getSessionBindingService();
	const capabilities = bindingService.getCapabilities({
		channel: policy.channel,
		accountId: policy.accountId
	});
	const bindingLabel = currentConversation ? "Conversation" : "Thread";
	if (!capabilities.adapterAvailable || !capabilities.bindSupported) return {
		ok: false,
		error: `${bindingLabel} bindings are unavailable for ${channel}.`
	};
	const defaultPlacement = currentConversation ? "current" : resolveChannelDefaultBindingPlacement(channel) ?? "current";
	if (params.mode === "thread-here") {
		if (!(defaultPlacement === "child" ? threadId : conversationId)) return {
			ok: false,
			error: `--thread here requires running /acp spawn inside an active ${channel} thread/conversation.`
		};
	}
	const placement = currentConversation || threadId ? "current" : defaultPlacement;
	if (!capabilities.placements.includes(placement)) return {
		ok: false,
		error: `${bindingLabel} bindings do not support ${placement} placement for ${channel}.`
	};
	if (!conversationId) return {
		ok: false,
		error: currentConversation ? `--bind here requires running /acp spawn inside an active ${channel} conversation.` : `Could not resolve a ${channel} conversation for ACP thread spawn.`
	};
	const senderId = normalizeOptionalString(commandParams.command.senderId) ?? "";
	const conversationRef = normalizeConversationRef({
		channel: policy.channel,
		accountId: policy.accountId,
		conversationId,
		parentConversationId: bindingContext.parentConversationId
	});
	const labelNoun = placement === "child" || threadId && conversationId === threadId ? "thread" : "conversation";
	let existingBinding;
	if (placement === "current") {
		existingBinding = await bindingService.resolveByConversationAsync(conversationRef);
		const boundBy = normalizeOptionalString(existingBinding?.metadata?.boundBy) ?? "";
		if (existingBinding && boundBy && boundBy !== "system" && senderId && senderId !== boundBy) return {
			ok: false,
			error: `Only ${boundBy} can rebind this ${labelNoun}.`
		};
	}
	try {
		commandParams.command.assertOwnerCurrent?.();
		const label = params.label || params.agentId;
		const lifecycleScope = {
			cfg: commandParams.cfg,
			channel: policy.channel,
			accountId: policy.accountId
		};
		const bindingInput = {
			[expectedCurrentSessionBinding]: existingBinding,
			targetSessionKey: params.sessionKey,
			targetKind: "session",
			conversation: conversationRef,
			placement,
			assertCurrent: commandParams.command.assertOwnerCurrent,
			metadata: {
				threadName: resolveThreadBindingThreadName({
					agentId: params.agentId,
					label
				}),
				agentId: params.agentId,
				label,
				boundBy: senderId || "unknown",
				introText: resolveThreadBindingIntroText({
					agentId: params.agentId,
					label,
					idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel(lifecycleScope),
					maxAgeMs: resolveThreadBindingMaxAgeMsForChannel(lifecycleScope),
					sessionCwd: resolveAcpSessionCwd(params.sessionMeta),
					sessionDetails: resolveAcpThreadSessionDetailLines({
						sessionKey: params.sessionKey,
						meta: params.sessionMeta
					})
				})
			}
		};
		return {
			ok: true,
			bound: {
				binding: await bindingService.bind(bindingInput),
				placement,
				labelNoun
			}
		};
	} catch (error) {
		return {
			ok: false,
			error: formatErrorMessage(error) || (currentConversation ? `Failed to bind the current ${channel} conversation to the new ACP session.` : `Failed to bind a ${channel} thread/conversation to the new ACP session.`)
		};
	}
}
//#endregion
//#region src/auto-reply/reply/commands-acp/lifecycle.ts
async function persistSpawnedSessionLabel(params) {
	const label = normalizeOptionalString(params.label);
	if (!label) return;
	const now = Date.now();
	const { storePath, agentId } = resolveSessionStorePathForAcp({
		cfg: params.commandParams.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	params.commandParams.command.assertOwnerCurrent?.();
	if (params.commandParams.sessionStore && params.commandParams.storePath === storePath) {
		const existing = params.commandParams.sessionStore[params.sessionKey];
		if (existing) params.commandParams.sessionStore[params.sessionKey] = {
			...existing,
			label,
			updatedAt: now
		};
	}
	await updateSessionEntry({
		storePath,
		agentId,
		sessionKey: params.sessionKey
	}, () => {
		params.commandParams.command.assertOwnerCurrent?.();
		return {
			label,
			updatedAt: now
		};
	});
}
async function handleAcpSpawnAction(params, restTokens) {
	if (!isAcpEnabledByPolicy(params.cfg)) return commandReply("ACP is disabled by policy (`acp.enabled=false`).");
	const parsed = parseSpawnInput(params, restTokens);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	const spawn = parsed.value;
	const runtimePolicyError = await resolveAcpSpawnRuntimePolicyError({
		cfg: params.cfg,
		requesterAgentId: params.agentId,
		requesterSessionKey: params.sessionKey
	});
	if (runtimePolicyError) return commandReply(`⚠️ ${runtimePolicyError}`);
	const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, spawn.agentId);
	if (agentPolicyError) return acpCommandErrorReply(agentPolicyError, "ACP target agent is not allowed by policy.", "ACP_SESSION_INIT_FAILED");
	const acpManager = getAcpSessionManager();
	const ownerAgentId = listAgentIds(params.cfg).includes(spawn.agentId) ? spawn.agentId : params.agentId;
	const sessionKey = `agent:${ownerAgentId}:acp:${randomUUID()}`;
	const resolvedCwd = resolveSpawnedWorkspaceInheritance({
		config: params.cfg,
		targetAgentId: ownerAgentId,
		requesterSessionKey: params.sessionKey,
		explicitWorkspaceDir: spawn.cwd
	});
	let runtimeCwd;
	try {
		runtimeCwd = await resolveRuntimeCwdForAcpSpawn({
			resolvedCwd,
			explicitCwd: spawn.cwd
		});
	} catch (error) {
		return acpCommandErrorReply(error, "Could not resolve ACP session workspace.", "ACP_SESSION_INIT_FAILED");
	}
	let initialized;
	try {
		initialized = await acpManager.initializeSession({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			sessionKey,
			agentId: ownerAgentId,
			agent: spawn.agentId,
			mode: spawn.mode,
			cwd: runtimeCwd
		});
	} catch (err) {
		return acpCommandErrorReply(err, "Could not initialize ACP session runtime.", "ACP_SESSION_INIT_FAILED");
	}
	const { sessionEntry, closeRuntimeOnFailure, meta: initializedMeta } = initialized;
	const initializedBackend = initialized.handle.backend || initializedMeta.backend;
	const cleanupSpawn = () => cleanupFailedAcpSpawn({
		cfg: params.cfg,
		sessionKey,
		agentId: ownerAgentId,
		sessionEntry,
		deleteTranscript: false,
		closeRuntimeOnFailure
	});
	let boundSession;
	if (spawn.bind !== "off" || spawn.thread !== "off") {
		const result = await bindSpawnedAcpSession({
			commandParams: params,
			sessionKey,
			agentId: ownerAgentId,
			label: spawn.label ?? spawn.agentId,
			mode: spawn.bind !== "off" ? "conversation" : spawn.thread === "here" ? "thread-here" : "thread-auto",
			sessionMeta: initializedMeta
		});
		if (!result.ok) {
			await cleanupSpawn();
			return commandReply(`⚠️ ${result.error}`);
		}
		boundSession = result.bound;
	}
	try {
		await persistSpawnedSessionLabel({
			commandParams: params,
			sessionKey,
			agentId: ownerAgentId,
			label: spawn.label
		});
	} catch (err) {
		await cleanupSpawn();
		const message = formatErrorMessage(err);
		return commandReply(`⚠️ ACP spawn failed: ${message}`);
	}
	const parts = [`✅ Spawned ACP session ${sessionKey} (${spawn.mode}, backend ${initializedBackend}).`];
	if (boundSession) {
		const { binding, placement, labelNoun } = boundSession;
		const boundConversationId = binding.conversation.conversationId.trim();
		if (placement === "current") parts.push(`Bound this ${labelNoun} to ${sessionKey}.`);
		else parts.push(`Created ${labelNoun} ${boundConversationId} and bound it to ${sessionKey}.`);
		const boundReplyPayload = await resolveBoundReplyPayload({
			binding,
			placement
		});
		if (boundReplyPayload) return commandReply({
			text: parts.join(" "),
			...boundReplyPayload
		});
	} else parts.push("Session is unbound (use /acp spawn ... --bind here to create a session bound to this conversation).");
	const dispatchNote = resolveAcpDispatchPolicyMessage(params.cfg);
	if (dispatchNote) parts.push(`ℹ️ ${dispatchNote}`);
	return commandReply(parts.join(" "));
}
async function resolveAcpSessionForCommandOrStop(params) {
	const resolved = await params.acpManager.resolveSessionAsync({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		assertCurrent: params.assertCurrent
	});
	params.assertCurrent?.();
	const error = resolveAcpSessionResolutionError(resolved);
	if (error) return acpCommandErrorReply(error, error.message, "ACP_SESSION_INIT_FAILED");
	return null;
}
async function withResolvedAcpSessionTarget(params) {
	const acpManager = getAcpSessionManager();
	const target = await resolveAcpTargetSessionKey({
		commandParams: params.commandParams,
		token: params.token
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	const guardFailure = await resolveAcpSessionForCommandOrStop({
		acpManager,
		cfg: params.commandParams.cfg,
		...target,
		assertCurrent: params.commandParams.command.assertOwnerCurrent
	});
	params.commandParams.command.assertOwnerCurrent?.();
	if (guardFailure) return guardFailure;
	return await params.run({
		acpManager,
		...target
	});
}
async function handleAcpCancelAction(params, restTokens) {
	return await withResolvedAcpSessionTarget({
		commandParams: params,
		token: normalizeOptionalString(restTokens.join(" ")),
		run: async ({ acpManager, sessionKey, agentId }) => await withAcpCommandErrorBoundary({
			run: async () => {
				await acpManager.cancelSession({
					assertActive: params.command.assertOwnerCurrent,
					cfg: params.cfg,
					sessionKey,
					agentId,
					reason: "manual-cancel"
				});
				return commandReply(`✅ Cancel requested for ACP session ${sessionKey}.`);
			},
			fallbackMessage: "ACP cancel failed before completion."
		})
	});
}
async function handleAcpSteerAction(params, _restTokens, restText) {
	const dispatchPolicyError = resolveAcpDispatchPolicyError(params.cfg);
	if (dispatchPolicyError) return acpCommandErrorReply(dispatchPolicyError, dispatchPolicyError.message, "ACP_DISPATCH_DISABLED");
	const parsed = parseSteerInput(restText);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	return await withResolvedAcpSessionTarget({
		commandParams: params,
		token: parsed.value.sessionToken,
		run: async ({ sessionKey, agentId }) => withAcpCommandErrorBoundary({
			run: async () => {
				const requestId = `${resolveCommandRequestId(params)}:steer`;
				const steeringManager = getAcpSessionManager();
				let output = "";
				const admittedRunContext = await prepareChannelRunAdmission({
					assertSourceCurrent: params.command.assertOwnerCurrent,
					cfg: params.cfg,
					runId: requestId,
					agentId,
					ingressKind: "acp",
					boundary: "acp.command.steer",
					evidence: readChannelContextAdmissionEvidence(params.rootCtx ?? params.ctx),
					gatewayLocalUserIngress: getGatewayLocalUserIngress(params.rootCtx ?? params.ctx)
				}).admit("acp");
				try {
					await steeringManager.runTurn({
						admittedRunContext,
						cfg: params.cfg,
						sessionKey,
						agentId,
						provenance: "agent",
						text: parsed.value.instruction,
						mode: "steer",
						requestId,
						onEvent: (event) => {
							if (event.type !== "text_delta" || event.stream && event.stream !== "output") return;
							if (event.text) {
								output += event.text;
								if (output.length > 800) output = `${truncateUtf16Safe(output, 800)}…`;
							}
						}
					});
				} finally {
					closeAdmittedRunDelegatedAuthority(admittedRunContext);
				}
				const steerOutput = output.trim();
				return commandReply(`✅ ACP steer sent to ${sessionKey}.${steerOutput ? `\n${steerOutput}` : ""}`);
			},
			fallbackMessage: "ACP steer failed before completion."
		})
	});
}
async function handleAcpCloseAction(params, restTokens) {
	return await withResolvedAcpSessionTarget({
		commandParams: params,
		token: normalizeOptionalString(restTokens.join(" ")),
		run: async ({ acpManager, sessionKey, agentId }) => {
			let runtimeNotice;
			try {
				const closed = await acpManager.closeSession({
					assertActive: params.command.assertOwnerCurrent,
					cfg: params.cfg,
					sessionKey,
					agentId,
					reason: "manual-close",
					allowBackendUnavailable: true,
					clearMeta: true
				});
				runtimeNotice = closed.runtimeNotice ? ` (${closed.runtimeNotice})` : "";
			} catch (error) {
				return acpCommandErrorReply(error, "ACP close failed before completion.");
			}
			const removedBindings = await getSessionBindingService().unbind({
				targetSessionKey: sessionKey,
				reason: "manual"
			});
			return commandReply(`✅ Closed ACP session ${sessionKey}${runtimeNotice}. Removed ${removedBindings.length} binding${removedBindings.length === 1 ? "" : "s"}.`);
		}
	});
}
//#endregion
export { handleAcpCancelAction, handleAcpCloseAction, handleAcpSpawnAction, handleAcpSteerAction };
