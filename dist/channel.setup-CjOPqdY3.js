import { a as resolveWhatsAppGroupToolPolicy, i as resolveWhatsAppGroupRequireMention, o as resolveWhatsAppGroupIntroHint, r as whatsappSetupWizardProxy, t as createWhatsAppPluginBase } from "./shared-BLN9xWTV.js";
import { t as whatsappSetupAdapter } from "./setup-core-Bz4Xjc4v.js";
import { t as detectWhatsAppLegacyStateMigrations } from "./state-migrations-CJAXArZs.js";
//#region extensions/whatsapp/src/channel.setup.ts
async function isWhatsAppAuthConfigured(account) {
	const { readWebAuthState } = await import("./auth-store-C01X3Dqo.js");
	return await readWebAuthState(account.authDir) === "linked";
}
const whatsappSetupPlugin = {
	...createWhatsAppPluginBase({
		groups: {
			resolveRequireMention: resolveWhatsAppGroupRequireMention,
			resolveToolPolicy: resolveWhatsAppGroupToolPolicy,
			resolveGroupIntroHint: resolveWhatsAppGroupIntroHint
		},
		setupWizard: whatsappSetupWizardProxy,
		setup: whatsappSetupAdapter,
		isConfigured: isWhatsAppAuthConfigured
	}),
	lifecycle: { detectLegacyStateMigrations: ({ oauthDir }) => detectWhatsAppLegacyStateMigrations({ oauthDir }) }
};
//#endregion
export { whatsappSetupPlugin as t };
