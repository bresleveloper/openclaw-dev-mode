import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CvOi7xsU.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { t as CHANNEL_MESSAGE_ACTION_NAMES } from "./message-action-names-cweW7syH.mjs";
import { n as resolveMessageBroadcastAccountPlan, r as validateExplicitMessageAccountSelection } from "./message-account-selection-CWcFAbys.mjs";
import { u as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-C_0e9XHi.mjs";
import { t as resolveMessageSecretScope } from "./message-secret-scope-CPKk7Eg6.mjs";
import { i as resolveMessageActionOutcome, r as resolveMessageActionMessageId } from "./message-action-contracts-CNqJc02D.mjs";
import { n as runMessageAction } from "./message-action-runner-DVO8q4sH.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-yepx543B.mjs";
//#region src/commands/message.ts
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
async function messageCommand(opts, deps, runtime) {
	const loadedRaw = await captureRuntimeConfigAsyncReader()();
	const actionInput = (normalizeOptionalString(opts.action) ?? "") || "send";
	const normalizedActionInput = normalizeLowercaseStringOrEmpty(actionInput);
	const scope = resolveMessageSecretScope({
		channel: opts.channel,
		target: opts.target,
		targets: opts.targets,
		accountId: opts.accountId
	});
	const explicitAccountId = await validateExplicitMessageAccountSelection({
		cfg: loadedRaw,
		channel: scope.channel,
		accountId: opts.accountId,
		checkResolvedAccount: false
	});
	if (explicitAccountId) {
		scope.accountId = explicitAccountId;
		opts.accountId = explicitAccountId;
	}
	const broadcastAccountPlan = normalizedActionInput === "broadcast" && !scope.channel && explicitAccountId ? await resolveMessageBroadcastAccountPlan({
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
	const action = CHANNEL_MESSAGE_ACTION_NAMES.find((name) => normalizeLowercaseStringOrEmpty(name) === normalizedActionInput);
	if (!action) throw new Error(`Unknown message action "${actionInput}". Use one of ${CHANNEL_MESSAGE_ACTION_NAMES.join(", ")}. Example: ${formatCliCommand("openclaw message send --channel <channel> --target <id> --text <message>")}.`);
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
	const { formatMessageCliText } = await import("./message-format-CrleUa38.mjs");
	const displayLimit = parseStrictPositiveInteger(opts.limit);
	for (const line of formatMessageCliText(result, { displayLimit })) runtime.log(line);
	return result;
}
//#endregion
export { messageCommand };
