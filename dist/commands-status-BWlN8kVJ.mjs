import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { D as setReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as logError } from "./logger-DHVmYOKs.mjs";
import { l as requireCommandFlagEnabled } from "./command-gates-Dcr0LjaJ.mjs";
import { i as formatDetailedPluginHealth } from "./status-plugin-health-BgNllFFR.mjs";
import { t as buildStatusReplyParts } from "./status-text-DdpLHUyT.mjs";
//#region src/auto-reply/reply/commands-status.ts
/** Builds /status replies using the command's authorized channel context. */
function markStatusReply(payload) {
	return setReplyPayloadMetadata(payload, { contextFreeCommand: true });
}
/** Builds a status reply or suppresses unauthorized status requests. */
async function buildStatusReply(params) {
	const { command } = params;
	if (!command.isAuthorizedSender) {
		logVerbose(`Ignoring /status from unauthorized sender: ${command.senderId || "<unknown>"}`);
		return;
	}
	try {
		const { text, presentation } = await buildStatusReplyParts({
			...params,
			statusChannel: command.channel,
			statusAccountId: command.accountId
		});
		return markStatusReply({
			text,
			presentation,
			presentationTextMode: "fallback"
		});
	} catch (error) {
		logError(`/status render failed: ${formatErrorMessage(error)}`);
		return markStatusReply({ text: "⚠️ Status: error rendering response" });
	}
}
async function buildStatusPluginsReply(params) {
	const { command } = params;
	if (!command.isAuthorizedSender) {
		logVerbose(`Ignoring /status plugins from unauthorized sender: ${command.senderId || "<unknown>"}`);
		return;
	}
	const disabled = requireCommandFlagEnabled(params.cfg, {
		label: "/status plugins",
		configKey: "plugins"
	});
	if (disabled) return disabled.reply ? markStatusReply(disabled.reply) : void 0;
	try {
		const { collectInstalledPluginHealthSnapshot } = await import("./status-plugin-health.runtime.js");
		const snapshot = await collectInstalledPluginHealthSnapshot({
			config: params.cfg,
			workspaceDir: params.workspaceDir
		});
		return markStatusReply({ text: formatDetailedPluginHealth(snapshot) });
	} catch (error) {
		logError(`/status plugins render failed: ${formatErrorMessage(error)}`);
		return markStatusReply({ text: "⚠️ Plugins: health unavailable" });
	}
}
//#endregion
export { buildStatusReply as n, buildStatusPluginsReply as t };
