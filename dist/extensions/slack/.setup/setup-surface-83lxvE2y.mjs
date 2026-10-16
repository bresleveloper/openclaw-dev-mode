import { c as resolveSlackAccountAllowFrom, o as resolveDefaultSlackAccountId } from "./accounts-CDgkV7Cm.mjs";
import { t as inspectSlackAccount } from "./account-inspect-Cs-7DXXW.mjs";
import "./shared-VtmYNj-v.mjs";
import { a as buildSlackAllowFromPrompt, i as SLACK_CHANNEL, n as createSlackSetupWizardBase } from "./channel.setup-BYIlwbQ7.mjs";
import { t as resolveSlackChannelAllowlist } from "./resolve-channels-HR0TgArR.mjs";
import { t as resolveSlackUserAllowlist } from "./resolve-users-BNYBhF0q.mjs";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveBasicAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createSetupTranslator, noteChannelLookupFailure, noteChannelLookupSummary, patchChannelConfigForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
//#region extensions/slack/src/setup-surface.ts
const t = createSetupTranslator();
function resolveSlackSetupAuth(account, credentialValues) {
	if (account.config.postAs === "user") return credentialValues.userToken || account.userToken;
	return credentialValues.botToken || account.botToken;
}
async function promptSlackAllowFrom(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg)
	});
	const account = inspectSlackAccount({
		cfg: params.cfg,
		accountId
	});
	const prompt = buildSlackAllowFromPrompt();
	await params.prompter.note(prompt.helpLines.join("\n"), prompt.helpTitle);
	const allowFrom = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: resolveSlackAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}) ?? [],
		token: account.userToken ?? account.botToken ?? "",
		message: prompt.message,
		placeholder: prompt.placeholder,
		label: prompt.helpTitle,
		parseInputs: splitSetupEntries,
		parseId: prompt.parseId,
		invalidWithoutTokenNote: prompt.invalidWithoutCredentialNote,
		resolveEntries: async ({ token, entries }) => await resolveBasicAllowFromEntries({
			token,
			entries,
			resolveEntries: resolveSlackUserAllowlist
		})
	});
	return patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: SLACK_CHANNEL,
		accountId: account.accountId,
		patch: {
			allowFrom,
			dm: {
				...account.config.dm,
				enabled: typeof account.config.dm?.enabled === "boolean" ? account.config.dm.enabled : true
			}
		}
	});
}
async function resolveSlackGroupAllowlist(params) {
	let keys = params.entries;
	const auth = resolveSlackSetupAuth(inspectSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}), params.credentialValues) || "";
	if (params.entries.length > 0) try {
		const resolved = await resolveEntriesWithOptionalToken({
			token: auth,
			entries: params.entries,
			buildWithoutToken: (input) => ({
				input,
				resolved: false,
				id: void 0
			}),
			resolveEntries: resolveSlackChannelAllowlist
		});
		const resolvedKeys = resolved.filter((entry) => entry.resolved && entry.id).map((entry) => entry.id);
		const unresolved = resolved.filter((entry) => !entry.resolved).map((entry) => entry.input);
		keys = [...resolvedKeys, ...normalizeStringEntries(unresolved)];
		await noteChannelLookupSummary({
			prompter: params.prompter,
			label: t("wizard.slack.channelsLabel"),
			resolvedSections: [{
				title: t("wizard.channels.resolvedTitle"),
				values: resolvedKeys
			}],
			unresolved
		});
	} catch (error) {
		await noteChannelLookupFailure({
			prompter: params.prompter,
			label: t("wizard.slack.channelsLabel"),
			error
		});
	}
	return keys;
}
const slackSetupWizard = createSlackSetupWizardBase({
	promptAllowFrom: promptSlackAllowFrom,
	resolveAllowFromEntries: async ({ cfg, accountId, credentialValues, entries }) => {
		const auth = resolveSlackSetupAuth(inspectSlackAccount({
			cfg,
			accountId
		}), credentialValues);
		return resolveBasicAllowFromEntries({
			token: auth,
			entries,
			resolveEntries: resolveSlackUserAllowlist
		});
	},
	resolveGroupAllowlist: resolveSlackGroupAllowlist
});
//#endregion
export { slackSetupWizard };
