import { a as resolveDefaultSlackAccountId, s as resolveSlackAccountAllowFrom } from "./accounts-BBHvg0pY.mjs";
import { t as inspectSlackAccount } from "./account-inspect-DP1Bcwj4.mjs";
import "./shared-CJ3arAFL.mjs";
import { o as SLACK_CHANNEL, r as createSlackSetupWizardBase } from "./channel.setup-BVoUtdPn.mjs";
import { t as resolveSlackChannelAllowlist } from "./resolve-channels-BXbMBbJD.mjs";
import { t as resolveSlackUserAllowlist } from "./resolve-users-65WqvIqD.mjs";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveBasicAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createSetupTranslator, noteChannelLookupFailure, noteChannelLookupSummary, parseMentionOrPrefixedId, patchChannelConfigForAccount, promptResolvedAllowFrom, resolveEntriesWithOptionalToken, resolveSetupAccountId, splitSetupEntries } from "openclaw/plugin-sdk/setup-runtime";
import { formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
//#region extensions/slack/src/setup-surface.ts
const t = createSetupTranslator();
function resolveSlackSetupAuth(account, credentialValues) {
	if (account.config.postAs === "user") return credentialValues.userToken || account.userToken;
	return credentialValues.botToken || account.botToken;
}
async function resolveSlackAllowFromEntries(params) {
	return await resolveBasicAllowFromEntries({
		token: params.token,
		entries: params.entries,
		resolveEntries: async ({ token, entries }) => await resolveSlackUserAllowlist({
			token,
			entries
		})
	});
}
async function promptSlackAllowFrom(params) {
	const parseId = (value) => parseMentionOrPrefixedId({
		value,
		mentionPattern: /^<@([A-Z0-9]+)>$/i,
		prefixPattern: /^(slack:|user:)/i,
		idPattern: /^[A-Z][A-Z0-9]+$/i,
		normalizeId: (id) => id.toUpperCase()
	});
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg)
	});
	const account = inspectSlackAccount({
		cfg: params.cfg,
		accountId
	});
	const noteTitle = t("wizard.slack.allowlistTitle");
	await params.prompter.note([
		t("wizard.slack.allowlistIntro"),
		t("wizard.slack.examples"),
		"- U12345678",
		"- @alice",
		t("wizard.slack.multipleEntries"),
		t("wizard.channels.docs", { link: formatDocsLink("/slack", "slack") })
	].join("\n"), noteTitle);
	const allowFrom = await promptResolvedAllowFrom({
		prompter: params.prompter,
		existing: resolveSlackAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}) ?? [],
		token: account.userToken ?? account.botToken ?? "",
		message: t("wizard.slack.allowFromPrompt"),
		placeholder: "@alice, U12345678",
		label: noteTitle,
		parseInputs: splitSetupEntries,
		parseId,
		invalidWithoutTokenNote: t("wizard.slack.allowFromInvalidWithoutToken"),
		resolveEntries: async ({ token, entries }) => (await resolveSlackUserAllowlist({
			token,
			entries
		})).map((entry) => ({
			input: entry.input,
			resolved: entry.resolved,
			id: entry.id ?? null
		}))
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
			resolveEntries: async ({ token, entries }) => await resolveSlackChannelAllowlist({
				token,
				entries
			})
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
		return await resolveSlackAllowFromEntries({
			token: resolveSlackSetupAuth(inspectSlackAccount({
				cfg,
				accountId
			}), credentialValues),
			entries
		});
	},
	resolveGroupAllowlist: async ({ cfg, accountId, credentialValues, entries, prompter }) => await resolveSlackGroupAllowlist({
		cfg,
		accountId,
		credentialValues,
		entries,
		prompter
	})
});
//#endregion
export { slackSetupWizard };
