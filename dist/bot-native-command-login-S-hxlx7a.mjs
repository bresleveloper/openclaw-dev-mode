import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as isProviderLoginPatchPersisted, t as decideProviderLoginSessionAdoption } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { f as formatProviderLoginCommand } from "./oauth-refresh-failure-H1_-S915.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import { i as resolveCommandAuthorization } from "./command-auth-D8Y1MxJm.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { n as formatProviderLoginCompletion, r as formatProviderLoginFailure } from "./provider-login-recovery-DpeT8C8O.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { f as prepareSessionEntryPatch } from "./session-store-runtime-DVNFhqCK.mjs";
import "./command-auth-native-DcOXNEhg.mjs";
import { a as createDeferred } from "./extension-shared-Bp_Ziw8S.mjs";
import { a as offerProviderLoginModelAccess, c as releaseProviderLoginFlow, d as runProviderChannelLoginFlow, i as createProviderLoginFlowRegistry, l as reserveProviderLoginFlow, o as prepareProviderChannelLogin, r as cancelProviderLoginFlow, s as refreshProviderLoginAuthState, t as answerProviderLoginModelAccess } from "./provider-auth-login-flow-runtime-oASEP25B.mjs";
import { s as buildTelegramRoutingTarget } from "./helpers-amKpwD-6.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { t as defaultTelegramNativeCommandDeps } from "./bot-native-command-deps.runtime.js";
//#region extensions/telegram/src/bot-native-command-login.ts
const activeTelegramProviderLoginFlows = createProviderLoginFlowRegistry();
function formatTelegramLoginDeviceCode(params) {
	return [
		`<b>${escapeHtml(params.title)}</b>`,
		"",
		...params.message ? [escapeHtml(params.message)] : [],
		`Code: <code>${escapeHtml(params.code)}</code>`,
		...params.expiresInMinutes ? [`Code expires in ${params.expiresInMinutes} minutes. Never share it.`] : []
	].join("\n");
}
async function executeTelegramLoginCommand(params) {
	const { dispatch } = params;
	const threadKey = dispatch.threadSpec.id == null ? dispatch.threadSpec.scope : `${dispatch.threadSpec.scope}:${dispatch.threadSpec.id}`;
	const flow = {
		flows: activeTelegramProviderLoginFlows,
		flowKey: [
			"telegram",
			dispatch.route.accountId,
			String(dispatch.chatId),
			threadKey,
			dispatch.route.agentId
		].join(":")
	};
	let deliveredReply = 0;
	const sendLoginMessage = async (text, parseMode) => {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, text, {
				...dispatch.threadParams,
				...parseMode ? { parse_mode: parseMode } : {}
			})
		});
		await dispatch.recordDeliveredReply(params.commandText, parseMode === "HTML" ? text.replace(/<[^>]*>/g, "") : text, String(++deliveredReply));
	};
	const assertCurrent = (config = dispatch.telegramDeps.getRuntimeConfig()) => {
		dispatch.assertOwnerCurrent?.();
		const authorization = resolveCommandAuthorization({
			cfg: config,
			ctx: dispatch.ownerContext,
			commandAuthorized: dispatch.commandAuthorized
		});
		if (!dispatch.senderIsOwner || !authorization.senderIsOwner || !authorization.isAuthorizedSender) throw new Error("Provider login authority is no longer active.");
	};
	const sendLoginReply = async (reply) => {
		const { deliverReplies } = await dispatch.loadDeliveryRuntime();
		const result = await deliverReplies({
			replies: [reply],
			...dispatch.deliveryOptions
		});
		if (result.delivered && reply.text) await dispatch.recordDeliveredReply(params.commandText, reply.text, String(++deliveredReply));
		return result.delivered;
	};
	const prepared = await prepareProviderChannelLogin({
		commandText: params.commandText,
		commandAuthorized: dispatch.commandAuthorized,
		senderIsOwner: dispatch.senderIsOwner,
		isPrivateChat: dispatch.msg.chat.type === "private",
		config: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		signal: dispatch.opts.accountAbortSignal,
		refreshAuth: () => refreshProviderLoginAuthState({
			agentId: dispatch.route.agentId,
			readConfig: dispatch.telegramDeps.getRuntimeConfig,
			assertCurrent: (config) => {
				dispatch.opts.accountAbortSignal?.throwIfAborted();
				assertCurrent(config);
			}
		}),
		cancelLogin: () => cancelProviderLoginFlow(flow),
		answerChoice: (command) => answerProviderLoginModelAccess({
			...flow,
			command,
			agentId: dispatch.route.agentId,
			readConfig: dispatch.telegramDeps.getRuntimeConfig,
			runtime: dispatch.runtime,
			signal: dispatch.opts.accountAbortSignal,
			assertCurrent
		})
	});
	if (!prepared) return false;
	if (prepared.status !== "ready") {
		if (!prepared.reply.presentation) {
			await sendLoginMessage(prepared.reply.text);
			return prepared.status === "reply";
		}
		return await sendLoginReply(prepared.reply) && prepared.status === "reply";
	}
	const loginChoice = prepared.choice;
	const reservation = reserveProviderLoginFlow({
		...flow,
		providerLabel: loginChoice.providerLabel,
		signal: dispatch.opts.accountAbortSignal
	});
	if (reservation.status === "active") {
		await sendLoginMessage(`${reservation.providerLabel} sign-in is already in progress. Finish it, or send /login cancel to cancel.`);
		return true;
	}
	const flowSignal = reservation.record.signal;
	const signInActionDelivered = createDeferred();
	let signInActionWasDelivered = false;
	const sendLoginAction = async (send) => {
		flowSignal.throwIfAborted();
		if (await send() === false) throw new Error("Provider sign-in action could not be delivered.");
		flowSignal.throwIfAborted();
		signInActionWasDelivered = true;
		signInActionDelivered.resolve();
	};
	const completion = (async () => {
		let terminalMessage;
		let modelAccess;
		try {
			const targetSessionEntryAtStart = await dispatch.nativeCommandRuntime.getSessionEntryAsync({
				agentId: dispatch.route.agentId,
				sessionKey: dispatch.targetSessionKey,
				storePath: resolveSessionStorePathCore(dispatch.runtimeCfg.session?.store, { agentId: dispatch.route.agentId })
			});
			const loginResult = await runProviderChannelLoginFlow({
				runLoginFlow: dispatch.telegramDeps.runModelsAuthLoginFlow ?? defaultTelegramNativeCommandDeps.runModelsAuthLoginFlow,
				choice: loginChoice,
				agentId: dispatch.route.agentId,
				config: dispatch.runtimeCfg,
				readConfig: dispatch.telegramDeps.getRuntimeConfig,
				runtime: dispatch.runtime,
				signal: flowSignal,
				assertCurrent,
				sendMessage: sendLoginMessage,
				sendReply: (reply) => sendLoginAction(() => sendLoginReply(reply)),
				onModelAccessRequested: (request) => {
					modelAccess = request;
				},
				sendDeviceCode: (deviceCode) => sendLoginAction(() => sendLoginMessage(formatTelegramLoginDeviceCode(deviceCode), "HTML")),
				unsupportedPromptMessage: "This provider needs input that Telegram cannot collect. Open Control UI → Models and choose Sign in."
			});
			flowSignal.throwIfAborted();
			const nextProfileId = loginResult.profiles.find((profile) => normalizeLowercaseStringOrEmpty(profile.provider) === normalizeLowercaseStringOrEmpty(loginChoice.providerId))?.profileId;
			let sessionSwitchFailed = !nextProfileId;
			if (nextProfileId && normalizeLowercaseStringOrEmpty(params.currentProvider) === normalizeLowercaseStringOrEmpty(loginChoice.providerId)) {
				const storePath = resolveSessionStorePathCore(dispatch.runtimeCfg.session?.store, { agentId: dispatch.route.agentId });
				let adoptionDecision;
				try {
					const persisted = await prepareSessionEntryPatch({
						sessionKey: dispatch.targetSessionKey,
						storePath,
						requireWriteSuccess: true,
						skipMaintenance: true,
						authority: {
							kind: "host",
							assertCurrent() {
								flowSignal.throwIfAborted();
								assertCurrent();
							}
						},
						prepare: (entry) => {
							adoptionDecision = decideProviderLoginSessionAdoption({
								currentModelProvider: params.currentProvider,
								loginProvider: loginChoice.providerId,
								nextProfileId,
								snapshot: targetSessionEntryAtStart,
								current: entry
							});
							return adoptionDecision.status === "patch" ? adoptionDecision.patch : null;
						}
					});
					flowSignal.throwIfAborted();
					if (adoptionDecision && (adoptionDecision.status === "rejected" || !persisted || adoptionDecision.status === "patch" && !isProviderLoginPatchPersisted(persisted, nextProfileId))) sessionSwitchFailed = true;
				} catch (error) {
					flowSignal.throwIfAborted();
					dispatch.runtime.error?.(danger(`telegram ${formatProviderLoginCommand(loginChoice.command)} completed but failed to update session auth profile: ${String(error)}`));
					sessionSwitchFailed = true;
				}
			}
			const sessionModel = targetSessionEntryAtStart?.modelOverride ?? targetSessionEntryAtStart?.model;
			terminalMessage = formatProviderLoginCompletion(loginChoice, loginResult.authRefresh, sessionSwitchFailed, nextProfileId && sessionModel ? {
				model: sessionModel,
				profileId: nextProfileId
			} : void 0);
		} catch (error) {
			modelAccess = void 0;
			if (flowSignal.aborted) return;
			dispatch.runtime.error?.(danger(`telegram ${formatProviderLoginCommand(loginChoice.command)} failed: ${String(error)}`));
			terminalMessage = formatProviderLoginFailure(loginChoice, error);
		}
		if (flowSignal.aborted) return;
		try {
			if (modelAccess) {
				const reply = offerProviderLoginModelAccess({
					...flow,
					prepared: modelAccess,
					terminalMessage
				});
				await sendLoginAction(() => sendLoginReply(reply));
			} else {
				await dispatch.telegramDeps.sendMessageTelegram(buildTelegramRoutingTarget(dispatch.chatId, dispatch.threadSpec), terminalMessage, {
					cfg: dispatch.runtimeCfg,
					token: dispatch.opts.token,
					accountId: dispatch.route.accountId
				});
				await dispatch.recordDeliveredReply(params.commandText, terminalMessage, String(++deliveredReply));
			}
		} catch (error) {
			dispatch.runtime.error?.(danger(`telegram ${formatProviderLoginCommand(loginChoice.command)} result notification failed: ${String(error)}`));
		}
	})().finally(() => {
		releaseProviderLoginFlow({
			...flow,
			record: reservation.record
		});
	});
	await Promise.race([signInActionDelivered.promise, completion]);
	return signInActionWasDelivered;
}
//#endregion
export { executeTelegramLoginCommand };
