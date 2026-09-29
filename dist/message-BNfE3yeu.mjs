import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-BPz1joQd.mjs";
import { n as resolveMessageBroadcastAccountPlan, r as validateExplicitMessageAccountSelection } from "./message-account-selection-DKo1WWcf.mjs";
import { f as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-DAUWRpL2.mjs";
import { t as resolveMessageSecretScope } from "./message-secret-scope-CK3XwSUQ.mjs";
import { n as resolveMessageActionOutcome, t as resolveMessageActionMessageId } from "./message-action-contracts-B8BlEOFc.mjs";
import { n as runMessageAction } from "./message-action-runner-CuesXrI4.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-DOTLPxsJ.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DOX1XwQ9.mjs";
//#region src/commands/message.ts
/** CLI entrypoint for channel message actions. */
function buildMessageCliJson(result) {
	const messageId = resolveMessageActionMessageId(result.payload);
	const sendResult = result.kind === "send" ? result.sendResult : void 0;
	const outcome = resolveMessageActionOutcome(result);
	return {
		...result.kind === "broadcast" ? { ok: outcome.ok } : !outcome.ok ? {
			...formatCliJsonFailure(outcome.error),
			...sendResult ? { deliveryStatus: sendResult.deliveryStatus } : {},
			...outcome.sentBeforeError ? { sentBeforeError: true } : {}
		} : {},
		action: result.action,
		channel: result.channel,
		dryRun: result.dryRun,
		handledBy: result.handledBy,
		...messageId ? { messageId } : {},
		payload: result.payload
	};
}
/** Resolves config/secrets, runs a channel message action, then renders JSON or text. */
async function messageCommand(opts, deps, runtime) {
	const loadedRaw = getRuntimeConfig();
	const actionInput = (normalizeOptionalString(opts.action) ?? "") || "send";
	const normalizedActionInput = normalizeLowercaseStringOrEmpty(actionInput);
	const scope = resolveMessageSecretScope({
		channel: opts.channel,
		target: opts.target,
		targets: opts.targets,
		accountId: opts.accountId
	});
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg: loadedRaw,
		channel: scope.channel,
		accountId: opts.accountId,
		checkResolvedAccount: false
	});
	if (explicitAccountId) {
		scope.accountId = explicitAccountId;
		opts.accountId = explicitAccountId;
	}
	const broadcastAccountPlan = normalizedActionInput === "broadcast" && !scope.channel && explicitAccountId ? resolveMessageBroadcastAccountPlan({
		cfg: loadedRaw,
		accountId: explicitAccountId
	}) : void 0;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: loadedRaw,
		channel: scope.channel,
		...broadcastAccountPlan ? { channels: broadcastAccountPlan.secretChannels } : {},
		accountId: scope.accountId
	});
	const { effectiveConfig: cfg } = await resolveCommandConfigWithSecrets({
		config: loadedRaw,
		commandName: "message",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {},
		runtime,
		autoEnable: true
	});
	const agentId = resolveAmbientOwnerAgentId(cfg, void 0, {
		surface: "message CLI",
		hint: `Run ${formatCliCommand("openclaw config set agents.defaults.systemAgent.agentId <id>")} with a configured agent ID.`
	});
	const actionMatch = CHANNEL_MESSAGE_ACTION_NAMES.find((name) => normalizeLowercaseStringOrEmpty(name) === normalizedActionInput);
	if (!actionMatch) throw new Error(`Unknown message action "${actionInput}". Use one of ${CHANNEL_MESSAGE_ACTION_NAMES.join(", ")}. Example: ${formatCliCommand("openclaw message send --channel <channel> --target <id> --text <message>")}.`);
	const action = actionMatch;
	const outboundDeps = createOutboundSendDeps(deps);
	const run = async () => await runMessageAction({
		cfg,
		action,
		params: opts,
		deps: outboundDeps,
		agentId,
		senderIsOwner: opts.senderIsOwner !== false,
		conversationReadOrigin: "direct-operator",
		broadcastAccountPlan,
		gateway: {
			clientName: GATEWAY_CLIENT_NAMES.CLI,
			mode: GATEWAY_CLIENT_MODES.CLI
		}
	});
	const json = opts.json === true;
	const dryRun = opts.dryRun === true;
	const result = !json && !dryRun && (action === "send" || action === "poll") ? await withProgress({
		label: action === "poll" ? "Sending poll..." : "Sending...",
		indeterminate: true,
		enabled: true
	}, run) : await run();
	if (json) {
		writeRuntimeJson(runtime, buildMessageCliJson(result));
		return result;
	}
	const { formatMessageCliText } = await import("./message-format-BmnNetTZ.mjs");
	const displayLimit = parseStrictPositiveInteger(opts.limit);
	for (const line of formatMessageCliText(result, { displayLimit })) runtime.log(line);
	return result;
}
//#endregion
export { messageCommand };
