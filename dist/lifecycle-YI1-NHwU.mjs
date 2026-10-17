import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { c as readChannelContextAdmissionEvidence } from "./admission-evidence-D2DaumE3.mjs";
import { i as closeAdmittedRunDelegatedAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { n as toAcpRuntimeErrorText } from "./error-text-BII6md-i.mjs";
import { i as resolveAcpThreadSessionDetailLines, n as resolveAcpSessionCwd } from "./session-identifiers-Bm1zQpah.mjs";
import "./errors-DDGkdHjR.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-C2kPc7n-.mjs";
import { u as resolveAcpSessionResolutionError } from "./manager.utils-Cuk8oQ5a.mjs";
import { n as getAcpSessionManager } from "./manager-daMVnzH0.mjs";
import "./session-meta-DUw-8Na0.mjs";
import { t as getSessionBindingService, w as resolveChannelDefaultBindingPlacement } from "./session-binding-service-DzGpg6K8.mjs";
import { i as normalizeConversationRef } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
import { n as commandReply } from "./command-gates-BzqqR9SG.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-Ct0iaaFP.mjs";
import { i as resolveAcpDispatchPolicyMessage, n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError, t as isAcpEnabledByPolicy } from "./policy-DlIDudm0.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, n as formatThreadBindingSpawnDisabledError, s as resolveThreadBindingMaxAgeMsForChannel, t as formatThreadBindingDisabledError } from "./thread-bindings-policy-DE7-D4c0.mjs";
import { i as resolveSpawnedWorkspaceInheritance } from "./spawned-context-BjFFoRwI.mjs";
import { i as resolveThreadBindingThreadName, r as resolveThreadBindingIntroText } from "./thread-bindings-messages-BhQOhR26.mjs";
import { i as cleanupFailedAcpSpawn, r as resolveRuntimeCwdForAcpSpawn, t as resolveAcpSpawnRuntimePolicyError } from "./acp-spawn-DL7oFqHO.mjs";
import { t as prepareChannelRunAdmission } from "./channel-run-admission-DJ-TNzJl.mjs";
import { r as resolveAcpCommandBindingContext, t as resolveAcpTargetSessionKey } from "./targets-DlcxH53h.mjs";
import { _ as parseSpawnInput, b as resolveCommandRequestId, v as parseSteerInput, x as withAcpCommandErrorBoundary } from "./shared-2sVFmUvF.mjs";
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
	if (placement === "current") {
		const existingBinding = bindingService.resolveByConversation(conversationRef);
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
		return {
			ok: true,
			bound: {
				binding: await bindingService.bind({
					targetSessionKey: params.sessionKey,
					targetKind: "session",
					conversation: conversationRef,
					placement,
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
				}),
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
	const runtimePolicyError = resolveAcpSpawnRuntimePolicyError({
		cfg: params.cfg,
		requesterAgentId: params.agentId,
		requesterSessionKey: params.sessionKey
	});
	if (runtimePolicyError) return commandReply(`⚠️ ${runtimePolicyError}`);
	const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, spawn.agentId);
	if (agentPolicyError) return commandReply(toAcpRuntimeErrorText({
		error: agentPolicyError,
		fallbackCode: "ACP_SESSION_INIT_FAILED",
		fallbackMessage: "ACP target agent is not allowed by policy."
	}));
	const acpManager = getAcpSessionManager();
	const sessionKey = `agent:${spawn.agentId}:acp:${randomUUID()}`;
	const resolvedCwd = resolveSpawnedWorkspaceInheritance({
		config: params.cfg,
		targetAgentId: spawn.agentId,
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
		return commandReply(toAcpRuntimeErrorText({
			error,
			fallbackCode: "ACP_SESSION_INIT_FAILED",
			fallbackMessage: "Could not resolve ACP session workspace."
		}));
	}
	let initializedBackend;
	let initializedMeta;
	let sessionEntry;
	let closeRuntimeOnFailure;
	try {
		const initialized = await acpManager.initializeSession({
			assertActive: params.command.assertOwnerCurrent,
			cfg: params.cfg,
			sessionKey,
			agentId: spawn.agentId,
			agent: spawn.agentId,
			mode: spawn.mode,
			cwd: runtimeCwd
		});
		sessionEntry = initialized.sessionEntry;
		closeRuntimeOnFailure = initialized.closeRuntimeOnFailure;
		initializedBackend = initialized.handle.backend || initialized.meta.backend;
		initializedMeta = initialized.meta;
	} catch (err) {
		return commandReply(toAcpRuntimeErrorText({
			error: err,
			fallbackCode: "ACP_SESSION_INIT_FAILED",
			fallbackMessage: "Could not initialize ACP session runtime."
		}));
	}
	let boundSession;
	if (spawn.bind !== "off" || spawn.thread !== "off") {
		const result = await bindSpawnedAcpSession({
			commandParams: params,
			sessionKey,
			agentId: spawn.agentId,
			label: spawn.label,
			mode: spawn.bind !== "off" ? "conversation" : spawn.thread === "here" ? "thread-here" : "thread-auto",
			sessionMeta: initializedMeta
		});
		if (!result.ok) {
			await cleanupFailedAcpSpawn({
				cfg: params.cfg,
				sessionKey,
				agentId: spawn.agentId,
				sessionEntry,
				deleteTranscript: false,
				closeRuntimeOnFailure
			});
			return commandReply(`⚠️ ${result.error}`);
		}
		boundSession = result.bound;
	}
	try {
		await persistSpawnedSessionLabel({
			commandParams: params,
			sessionKey,
			agentId: spawn.agentId,
			label: spawn.label
		});
	} catch (err) {
		await cleanupFailedAcpSpawn({
			cfg: params.cfg,
			sessionKey,
			agentId: spawn.agentId,
			sessionEntry,
			deleteTranscript: false,
			closeRuntimeOnFailure
		});
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
		if (boundReplyPayload) return {
			shouldContinue: false,
			reply: {
				text: parts.join(" "),
				...boundReplyPayload
			}
		};
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
	if (error) return commandReply(toAcpRuntimeErrorText({
		error,
		fallbackCode: "ACP_SESSION_INIT_FAILED",
		fallbackMessage: error.message
	}));
	return null;
}
async function withResolvedAcpSessionTarget(params) {
	const acpManager = getAcpSessionManager();
	const target = await resolveAcpTargetSessionKey({
		commandParams: params.commandParams,
		token: normalizeOptionalString(params.restTokens.join(" "))
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
		restTokens,
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
async function handleAcpSteerAction(params, restTokens) {
	const dispatchPolicyError = resolveAcpDispatchPolicyError(params.cfg);
	if (dispatchPolicyError) return commandReply(toAcpRuntimeErrorText({
		error: dispatchPolicyError,
		fallbackCode: "ACP_DISPATCH_DISABLED",
		fallbackMessage: dispatchPolicyError.message
	}));
	const parsed = parseSteerInput(restTokens);
	if (!parsed.ok) return commandReply(`⚠️ ${parsed.error}`);
	const acpManager = getAcpSessionManager();
	const target = await resolveAcpTargetSessionKey({
		commandParams: params,
		token: parsed.value.sessionToken
	});
	if (!target.ok) return commandReply(`⚠️ ${target.error}`);
	const guardFailure = await resolveAcpSessionForCommandOrStop({
		acpManager,
		cfg: params.cfg,
		...target,
		assertCurrent: params.command.assertOwnerCurrent
	});
	params.command.assertOwnerCurrent?.();
	if (guardFailure) return guardFailure;
	return await withAcpCommandErrorBoundary({
		run: async () => {
			const requestId = `${resolveCommandRequestId(params)}:steer`;
			const steeringManager = getAcpSessionManager();
			let output = "";
			const admittedRunContext = await prepareChannelRunAdmission({
				assertSourceCurrent: params.command.assertOwnerCurrent,
				cfg: params.cfg,
				runId: requestId,
				agentId: target.agentId,
				ingressKind: "acp",
				boundary: "acp.command.steer",
				evidence: readChannelContextAdmissionEvidence(params.rootCtx ?? params.ctx),
				gatewayLocalUserIngress: getGatewayLocalUserIngress(params.rootCtx ?? params.ctx)
			}).admit("acp");
			try {
				await steeringManager.runTurn({
					admittedRunContext,
					cfg: params.cfg,
					sessionKey: target.sessionKey,
					agentId: target.agentId,
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
			if (!steerOutput) return commandReply(`✅ ACP steer sent to ${target.sessionKey}.`);
			return commandReply(`✅ ACP steer sent to ${target.sessionKey}.\n${steerOutput}`);
		},
		fallbackMessage: "ACP steer failed before completion."
	});
}
async function handleAcpCloseAction(params, restTokens) {
	return await withResolvedAcpSessionTarget({
		commandParams: params,
		restTokens,
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
				return commandReply(toAcpRuntimeErrorText({
					error,
					fallbackCode: "ACP_TURN_FAILED",
					fallbackMessage: "ACP close failed before completion."
				}));
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
