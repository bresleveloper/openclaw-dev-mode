import "./account-id-5IgE9UKY.js";
import { t as createSetupTranslator } from "./i18n-C0k1rM_n.js";
import { J as setSetupChannelEnabled } from "./setup-wizard-helpers-DwVV1XKU.js";
import "./setup-CzvlhT1K.js";
import { t as listAccountIds } from "./account-ids-Bgg1wvIw.js";
import { o as resolveWhatsAppAuthDir } from "./accounts-D4l-iMIF.js";
import { i as formatWhatsAppWebAuthStatusState, m as readWebAuthState } from "./auth-store-BERBvAOr.js";
//#region extensions/whatsapp/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "whatsapp";
async function readWhatsAppSetupLinkState(cfg, accountId) {
	const { authDir } = resolveWhatsAppAuthDir({
		cfg,
		accountId
	});
	return await readWebAuthState(authDir);
}
const whatsappSetupWizard = {
	channel,
	status: {
		configuredLabel: t("wizard.channels.statusLinked"),
		unconfiguredLabel: t("wizard.channels.statusNotLinked"),
		configuredHint: t("wizard.channels.statusLinked"),
		unconfiguredHint: t("wizard.channels.statusNotLinked"),
		configuredScore: 5,
		unconfiguredScore: 4,
		resolveConfigured: async ({ cfg, accountId }) => {
			for (const resolvedAccountId of accountId ? [accountId] : listAccountIds(cfg)) if (await readWhatsAppSetupLinkState(cfg, resolvedAccountId) === "linked") return true;
			return false;
		},
		resolveStatusLines: async ({ cfg, accountId, configured }) => {
			const linkedAccountId = (await Promise.all((accountId ? [accountId] : listAccountIds(cfg)).map(async (resolvedAccountId) => ({
				accountId: resolvedAccountId,
				state: await readWhatsAppSetupLinkState(cfg, resolvedAccountId)
			})))).find((entry) => entry.state === "linked" || entry.state === "unstable");
			const labelAccountId = accountId ?? linkedAccountId?.accountId;
			return [`${labelAccountId ? `WhatsApp (${labelAccountId === "default" ? "default" : labelAccountId})` : "WhatsApp"}: ${configured ? formatWhatsAppWebAuthStatusState("linked") : formatWhatsAppWebAuthStatusState(linkedAccountId?.state ?? "not-linked")}`];
		}
	},
	resolveShouldPromptAccountIds: ({ shouldPromptAccountIds }) => shouldPromptAccountIds,
	credentials: [],
	finalize: async (params) => await (await import("./setup-finalize-CQMpDqfX.js")).finalizeWhatsAppSetup(params),
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false),
	onAccountRecorded: (accountId, options) => {
		options?.onAccountId?.(channel, accountId);
	}
};
//#endregion
export { whatsappSetupWizard as t };
