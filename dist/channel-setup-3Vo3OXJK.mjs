import "./session-key-C09ow4h0.mjs";
import "./account-id-DbRsdayc.mjs";
import "./setup-contract-CSCVWILe.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import "./setup-CndW71k-.mjs";
//#region src/plugin-sdk/optional-channel-setup.ts
function buildOptionalChannelSetupMessage(params) {
	const installTarget = params.npmSpec ?? `the ${params.label} plugin`;
	const message = [`${params.label} setup requires ${installTarget} to be installed.`];
	if (params.docsPath) message.push(`Docs: ${formatDocsLink(params.docsPath, params.docsPath.replace(/^\/+/u, ""))}`);
	return message.join(" ");
}
/**
* Creates a setup adapter for optional channel plugins that are not installed.
* Validation returns install guidance, while config mutation fails with the same
* message so setup flows cannot silently create partial channel config.
*/
function createOptionalChannelSetupAdapter(params) {
	const message = buildOptionalChannelSetupMessage(params);
	return {
		resolveAccountId: ({ accountId }) => accountId ?? "default",
		applyAccountConfig: () => {
			throw new Error(message);
		},
		validateInput: () => message
	};
}
/**
* Creates a wizard surface for optional channel plugins that are not installed.
* The wizard is always unconfigured and stops finalize with install guidance.
*/
function createOptionalChannelSetupWizard(params) {
	const message = buildOptionalChannelSetupMessage(params);
	return {
		channel: params.channel,
		status: {
			configuredLabel: `${params.label} plugin installed`,
			unconfiguredLabel: `install ${params.label} plugin`,
			configuredHint: message,
			unconfiguredHint: message,
			unconfiguredScore: 0,
			resolveConfigured: () => false,
			resolveStatusLines: () => [message],
			resolveSelectionHint: () => message
		},
		credentials: [],
		finalize: async () => {
			throw new Error(message);
		}
	};
}
//#endregion
//#region src/plugin-sdk/channel-setup.ts
/** Build both optional setup surfaces from one metadata object. */
function createOptionalChannelSetupSurface(params) {
	return {
		setupAdapter: createOptionalChannelSetupAdapter(params),
		setupWizard: createOptionalChannelSetupWizard(params)
	};
}
//#endregion
export { createOptionalChannelSetupAdapter as n, createOptionalChannelSetupWizard as r, createOptionalChannelSetupSurface as t };
