import { l as IMESSAGE_CHAT_TARGET_PREFIX_RE, o as normalizeIMessageHandle } from "./targets-B4oU7n-v.mjs";
import { a as resolveDefaultIMessageAccountId, o as resolveIMessageAccount } from "./accounts-DacCvDBt.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createCliPathTextInput, createDelegatedSetupWizardProxy, createDelegatedTextInputShouldPrompt, createPatchedAccountSetupAdapter, createSetupTranslator, promptParsedAllowFromForAccount, setAccountAllowFromForChannel, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup-runtime";
import { formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
//#region extensions/imessage/src/setup-core.ts
const t = createSetupTranslator();
const channel = "imessage";
const IMESSAGE_INSTALL_COMMAND = "brew install steipete/tap/imsg";
const IMESSAGE_UPDATE_COMMAND = "brew update && brew upgrade imsg";
const HOMEBREW_IMSG_PATHS = /* @__PURE__ */ new Set([
	"/opt/homebrew/bin/imsg",
	"/opt/homebrew/opt/imsg/bin/imsg",
	"/usr/local/bin/imsg",
	"/usr/local/opt/imsg/bin/imsg"
]);
function normalizeIMessageCliPathForSetup(cliPath) {
	return cliPath?.trim() || "imsg";
}
function isAutoManagedIMessageCliPath(cliPath, opts) {
	const normalized = normalizeIMessageCliPathForSetup(cliPath);
	return !opts?.explicit && normalized === "imsg" || HOMEBREW_IMSG_PATHS.has(normalized);
}
function parseIMessageAllowFromEntries(raw) {
	return parseAllowFromEntries(raw, (entry) => {
		const lower = normalizeLowercaseStringOrEmpty(entry).replace(/^(?:(?:imessage|sms|auto):\s*)+/, "");
		if (IMESSAGE_CHAT_TARGET_PREFIX_RE.test(lower)) return { error: `iMessage allowFrom entries must be sender handles: ${entry}` };
		if (!normalizeIMessageHandle(entry)) return { error: `Invalid handle: ${entry}` };
		return { value: entry };
	});
}
function buildIMessageSetupPatch(input) {
	return {
		...input.cliPath ? { cliPath: input.cliPath } : {},
		...input.dbPath ? { dbPath: input.dbPath } : {},
		...input.service ? { service: input.service } : {},
		...input.region ? { region: input.region } : {}
	};
}
const imessageDmPolicy = createChannelDmPolicy({
	label: "iMessage",
	channel,
	resolveAccount: (cfg, accountId) => resolveIMessageAccount({
		cfg,
		accountId
	}),
	setupSurface: () => imessageSetupAdapter,
	promptAllowFrom: async (params) => promptParsedAllowFromForAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		defaultAccountId: resolveDefaultIMessageAccountId(params.cfg),
		prompter: params.prompter,
		noteTitle: "iMessage allowlist",
		noteLines: [
			"Allowlist iMessage DMs by sender handle.",
			"Examples:",
			"- +15555550123",
			"- user@example.com",
			"Multiple entries: comma-separated.",
			`Docs: ${formatDocsLink("/imessage", "imessage")}`
		],
		message: "iMessage allowFrom (sender handle)",
		placeholder: "+15555550123, user@example.com",
		parseEntries: parseIMessageAllowFromEntries,
		getExistingAllowFrom: ({ cfg, accountId }) => resolveIMessageAccount({
			cfg,
			accountId
		}).config.allowFrom ?? [],
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => setAccountAllowFromForChannel({
			cfg,
			channel,
			accountId,
			allowFrom,
			setupSurface: imessageSetupAdapter
		})
	})
});
function createIMessageCliPathTextInput(shouldPrompt) {
	return createCliPathTextInput({
		inputKey: "cliPath",
		message: "imsg CLI path",
		resolvePath: ({ cfg, accountId }) => resolveIMessageAccount({
			cfg,
			accountId
		}).config.cliPath ?? "imsg",
		shouldPrompt,
		helpTitle: "iMessage",
		helpLines: [
			"imsg CLI path required to enable iMessage.",
			`Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`,
			`Update imsg when channel checks report missing RPC or private API capabilities: ${IMESSAGE_UPDATE_COMMAND}`
		]
	});
}
const imessageCompletionNote = {
	title: "iMessage next steps",
	lines: [
		"For the usual setup, run OpenClaw on the Mac signed into Messages.",
		"If the Gateway runs elsewhere, set cliPath to a transparent SSH wrapper that runs imsg on the Messages Mac.",
		`Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`,
		`Update imsg after imsg fixes or missing-capability errors: ${IMESSAGE_UPDATE_COMMAND}`,
		"Private API mode is strongly encouraged for replies, tapbacks, effects, polls, attachments, and group actions.",
		"After Private API setup, run `imsg launch`, then `openclaw channels status --probe`.",
		"Give OpenClaw Full Disk Access to the Messages database.",
		"Grant Automation permission for Messages when prompted.",
		"List chats with: imsg chats --limit 20",
		`Docs: ${formatDocsLink("/imessage", "imessage")}`
	]
};
const imessageSetupAdapter = {
	...createPatchedAccountSetupAdapter({
		channelKey: channel,
		buildPatch: (input) => buildIMessageSetupPatch(input)
	}),
	singleAccountKeysToMove: [
		"cliPath",
		"dbPath",
		"service",
		"region"
	]
};
const imessageSetupContract = defineChannelSetupContract({
	fields: {
		cliPath: {
			kind: "string",
			cli: {
				flags: "--cli-path <path>",
				description: "iMessage CLI path"
			}
		},
		dbPath: {
			kind: "string",
			cli: {
				flags: "--db-path <path>",
				description: "iMessage database path"
			}
		},
		service: {
			kind: "choice",
			choices: [
				"imessage",
				"sms",
				"auto"
			],
			cli: {
				flags: "--service <service>",
				description: "iMessage service"
			}
		},
		region: {
			kind: "string",
			cli: {
				flags: "--region <region>",
				description: "SMS region"
			}
		}
	},
	legacyAdapter: imessageSetupAdapter
});
const imessageSetupStatusLabels = {
	configuredLabel: t("wizard.channels.statusConfigured"),
	unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
	configuredHint: t("wizard.imessage.imsgFound"),
	unconfiguredHint: t("wizard.imessage.imsgMissing"),
	configuredScore: 1,
	unconfiguredScore: 0
};
const imessageSetupStatusBase = {
	...imessageSetupStatusLabels,
	resolveConfigured: ({ cfg, accountId }) => resolveIMessageAccount({
		cfg,
		accountId
	}).configured
};
function createIMessageSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: imessageSetupStatusLabels,
		delegatePrepare: true,
		credentials: [],
		textInputs: [createIMessageCliPathTextInput(createDelegatedTextInputShouldPrompt({
			loadWizard,
			inputKey: "cliPath"
		}))],
		completionNote: imessageCompletionNote,
		dmPolicy: imessageDmPolicy,
		disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
	});
}
//#endregion
export { imessageCompletionNote as a, imessageSetupStatusBase as c, parseIMessageAllowFromEntries as d, createIMessageSetupWizardProxy as i, isAutoManagedIMessageCliPath as l, IMESSAGE_UPDATE_COMMAND as n, imessageDmPolicy as o, createIMessageCliPathTextInput as r, imessageSetupContract as s, IMESSAGE_INSTALL_COMMAND as t, normalizeIMessageCliPathForSetup as u };
