import { a as resolveWhatsAppGroupToolPolicy, i as resolveWhatsAppGroupRequireMention, o as resolveWhatsAppGroupIntroHint, r as whatsappSetupWizardProxy, t as createWhatsAppPluginBase } from "./shared-DEL655XX.js";
import { t as whatsappSetupAdapter } from "./setup-core-BEZOJHh3.js";
import { t as detectWhatsAppLegacyStateMigrations } from "./state-migrations-BeEd5bz_.js";
//#region extensions/whatsapp/src/channel.setup.ts
async function isWhatsAppAuthConfigured(account) {
	const { readWebAuthState } = await import("./auth-store-DA3eMPrR.js");
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
