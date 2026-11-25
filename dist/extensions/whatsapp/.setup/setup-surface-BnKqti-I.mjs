import { o as resolveWhatsAppAuthDir } from "./accounts-Czb9k6cU.mjs";
import { t as listAccountIds } from "./account-ids-ENToBTTq.mjs";
import { a as formatWhatsAppWebAuthStatusState, m as readWebAuthState } from "./auth-store-BEF_fEGA.mjs";
import { DEFAULT_ACCOUNT_ID, createSetupTranslator, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
// extensions/whatsapp/src/setup-surface.ts
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
			return [`${labelAccountId ? `WhatsApp (${labelAccountId === DEFAULT_ACCOUNT_ID ? "default" : labelAccountId})` : "WhatsApp"}: ${configured ? formatWhatsAppWebAuthStatusState("linked") : formatWhatsAppWebAuthStatusState(linkedAccountId?.state ?? "not-linked")}`];
		}
	},
	resolveShouldPromptAccountIds: ({ shouldPromptAccountIds }) => shouldPromptAccountIds,
	credentials: [],
	finalize: async (params) => await (await import("./setup-finalize-D-5qEXxX.mjs")).finalizeWhatsAppSetup(params),
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false),
	onAccountRecorded: (accountId, options) => {
		options?.onAccountId?.(channel, accountId);
	}
};
export { whatsappSetupWizard };
