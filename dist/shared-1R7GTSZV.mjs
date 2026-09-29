import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { s as getChannelsCommandSecretTargetIds } from "./command-secret-targets-DAUWRpL2.mjs";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DOX1XwQ9.mjs";
import { t as requireValidConfig } from "./config-validation-CdWq9kXm.mjs";
//#region src/commands/channels/shared.ts
const NO_CONFIGURED_CHAT_CHANNELS_LINE = "- no configured chat channels (run `openclaw channels list --all` to see installable channels)";
/** Load valid channel command config with read-only secret resolution applied. */
async function requireValidChannelConfig(runtime = defaultRuntime, secretResolution) {
	const cfg = await requireValidConfig(runtime, secretResolution?.skipPluginValidation ? { skipPluginValidation: true } : void 0);
	if (!cfg) return null;
	const { effectiveConfig } = await resolveCommandConfigWithSecrets({
		config: cfg,
		commandName: secretResolution?.commandName ?? "channels",
		targetIds: getChannelsCommandSecretTargetIds(),
		mode: secretResolution?.mode,
		runtime
	});
	return effectiveConfig;
}
function formatAccountLabel(params) {
	const base = sanitizeTerminalText(params.accountId || "default");
	if (params.name?.trim()) return `${base} (${sanitizeTerminalText(params.name.trim())})`;
	return base;
}
/** Format a channel/account label with optional display styles for terminal output. */
function formatChannelAccountLabel(params) {
	const channelText = sanitizeTerminalText(params.channelLabel ?? params.channel);
	const accountText = formatAccountLabel({
		accountId: params.accountId,
		name: params.name
	});
	return `${params.channelStyle ? params.channelStyle(channelText) : channelText} ${params.accountStyle ? params.accountStyle(accountText) : accountText}`;
}
/** Append canonical state fragments and genuine runtime failures for account output. */
function appendEnabledConfiguredLinkedBits(bits, account) {
	if (typeof account.enabled === "boolean") bits.push(account.enabled ? "enabled" : "disabled");
	if (typeof account.configured === "boolean") {
		if (account.configured) {
			bits.push("configured");
			if (hasConfiguredUnavailableCredentialStatus(account)) bits.push("secret unavailable in this command path");
		} else bits.push("not configured");
	}
	if (typeof account.linked === "boolean") bits.push(account.linked ? "linked" : "not linked");
	const reason = typeof account.stateReason === "string" ? account.stateReason : "";
	const duplicatesState = account.enabled === false && reason === "disabled" || account.configured === false && reason === "not configured" || account.linked === false && reason === "not linked";
	if (reason && !duplicatesState) bits.push(`reason:${reason}`);
	const error = typeof account.lastError === "string" ? account.lastError : "";
	if (error) bits.push(`error:${error}`);
}
/** Append account mode metadata when present. */
function appendModeBit(bits, account) {
	if (typeof account.mode === "string" && account.mode.length > 0) bits.push(`mode:${account.mode}`);
}
/** Append credential source fragments, preserving unavailable-secret state. */
function appendTokenSourceBits(bits, account) {
	const appendSourceBit = (label, sourceKey, statusKey) => {
		const source = account[sourceKey];
		if (typeof source !== "string" || !source || source === "none") return;
		const unavailable = account[statusKey] === "configured_unavailable" ? " (unavailable)" : "";
		bits.push(`${label}:${source}${unavailable}`);
	};
	appendSourceBit("token", "tokenSource", "tokenStatus");
	appendSourceBit("bot", "botTokenSource", "botTokenStatus");
	appendSourceBit("app", "appTokenSource", "appTokenStatus");
	appendSourceBit("signing", "signingSecretSource", "signingSecretStatus");
}
/** Append account base URL metadata when present. */
function appendBaseUrlBit(bits, account) {
	if (typeof account.baseUrl === "string" && account.baseUrl) bits.push(`url:${account.baseUrl}`);
}
/** Build a complete human-readable channel account status line. */
function buildChannelAccountLine(provider, account, bits, opts) {
	return `- ${formatChannelAccountLabel({
		channel: provider,
		accountId: typeof account.accountId === "string" ? account.accountId : DEFAULT_ACCOUNT_ID,
		name: typeof account.name === "string" ? account.name : void 0,
		channelLabel: opts?.channelLabel
	})}: ${bits.join(", ")}`;
}
/** Return true when the command should use its interactive wizard path. */
function shouldUseWizard(params) {
	return params?.hasFlags === false;
}
//#endregion
export { appendTokenSourceBits as a, requireValidChannelConfig as c, appendModeBit as i, shouldUseWizard as l, appendBaseUrlBit as n, buildChannelAccountLine as o, appendEnabledConfiguredLinkedBits as r, formatChannelAccountLabel as s, NO_CONFIGURED_CHAT_CHANNELS_LINE as t };
