import { a as normalizeSignalTransportUrl, i as normalizeSignalTransportHost, o as resolveSignalAccountEntry, s as resolveSignalAccountKey, t as assertSignalSocketTransport } from "./transport-url-CAC0JcuI.mjs";
import { a as isSignalManagedNativeConnectionUrlForBind, i as assignSignalManagedNativePort, o as isValidSignalManagedNativePort, r as allocateSignalManagedNativePort, s as resolveLocalSignalTransportPort } from "./transport-policy-5VSnj5ma.mjs";
import { a as resolveSignalAccountConfig, i as resolveSignalAccount, n as listSignalAccountIds, o as resolveSignalReplyToMode, r as resolveDefaultSignalAccountId, s as resolveSignalTransport } from "./accounts-BV6tDOTc.mjs";
import { n as normalizeSignalMessagingTarget, t as looksLikeSignalTargetId } from "./normalize-l_b99hap.mjs";
import { a as resolveSignalTarget, r as listSignalAliasDirectoryEntries } from "./approval-auth-BBI9BTRm.mjs";
import { c as resolveSignalSender, l as looksLikeUuid, o as resolveSignalPeerId, s as resolveSignalRecipient } from "./identity-YXPmgFMu.mjs";
import { c as signalMessageActions, f as markdownToSignalTextChunks, h as signalApprovalCapability, l as resolveSignalReactionLevel, m as shouldSuppressLocalSignalExecApprovalPrompt, r as resolveSignalReplyContextWithPersistence, s as materializeSignalPresentationFallback, t as detectSignalTransport, u as formatSignalMediaText } from "./transport-detection-CoiRl7Gx.mjs";
import { a as migrateLegacySignalTransportConfig, i as clearLegacySignalTransportFieldsForAccount, n as normalizeCompatibilityConfig, r as repairSignalAccountKeys } from "./doctor-contract-api-Rbq_sRTI.mjs";
import { t as SignalChannelConfigSchema } from "./config-schema-aQwwMGUj.mjs";
import { describeAccountSnapshot, resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { buildDmGroupAccountAllowlistAdapter } from "openclaw/plugin-sdk/allowlist-config-edit";
import { createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createAccountStatusSink, createReplyToFanout, defineChannelMessageAdapter, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import { createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { attachChannelToResult } from "openclaw/plugin-sdk/channel-send-result";
import { PAIRING_APPROVED_MESSAGE } from "openclaw/plugin-sdk/channel-status";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { chunkText, resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import { buildOutboundBaseSessionKey } from "openclaw/plugin-sdk/routing";
import { buildBaseChannelStatusSummary, collectStatusIssuesFromLastError, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringifiedEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/account-resolution";
import { normalizeE164 } from "openclaw/plugin-sdk/text-utility-runtime";
import { createChannelPluginBase, getChatChannelMeta } from "openclaw/plugin-sdk/core";
import { parseAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { patchTopLevelChannelConfigSection } from "openclaw/plugin-sdk/setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2, createCliPathTextInput, createDelegatedSetupWizardProxy, createDelegatedTextInputShouldPrompt, createPatchedAccountSetupAdapter, createSetupInputPresenceValidator, createSetupTranslator as createSetupTranslator$1, patchChannelConfigForAccount, promptParsedAllowFromForAccount, setAccountAllowFromForChannel, setSetupChannelEnabled as setSetupChannelEnabled$1 } from "openclaw/plugin-sdk/setup-runtime";
import { formatCliCommand, formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createRestrictSendersChannelSecurity } from "openclaw/plugin-sdk/channel-policy";
//#region extensions/signal/src/outbound-session.ts
function resolveSignalOutboundTarget(target) {
	const normalized = normalizeSignalMessagingTarget(target);
	if (!normalized) return null;
	const lowered = normalizeLowercaseStringOrEmpty(normalized);
	if (lowered.startsWith("group:")) {
		const groupId = normalized.slice(6);
		return {
			peer: {
				kind: "group",
				id: groupId
			},
			chatType: "group",
			from: `group:${groupId}`,
			to: `group:${groupId}`
		};
	}
	if (lowered.startsWith("username:")) return {
		peer: {
			kind: "direct",
			id: normalized
		},
		chatType: "direct",
		from: `signal:${normalized}`,
		to: `signal:${normalized}`
	};
	const recipient = normalized;
	const uuidCandidate = normalizeLowercaseStringOrEmpty(recipient).startsWith("uuid:") ? recipient.slice(5) : recipient;
	const sender = resolveSignalSender({
		sourceUuid: looksLikeUuid(uuidCandidate) ? uuidCandidate : null,
		sourceNumber: looksLikeUuid(uuidCandidate) ? null : recipient
	});
	const peerId = sender ? resolveSignalPeerId(sender) : recipient;
	const displayRecipient = sender ? resolveSignalRecipient(sender) : recipient;
	return {
		peer: {
			kind: "direct",
			id: peerId
		},
		chatType: "direct",
		from: `signal:${displayRecipient}`,
		to: `signal:${displayRecipient}`
	};
}
//#endregion
//#region extensions/signal/src/setup-transport.ts
function managedTransportOptions(transport) {
	const { kind: _kind, ...options } = transport;
	return options;
}
function normalizeTransport(transport) {
	if (transport.kind === "managed-native") {
		assertSignalSocketTransport(transport);
		return {
			...transport,
			...transport.url ? { url: normalizeSignalTransportUrl(transport.url) } : {},
			...transport.httpHost ? { httpHost: normalizeSignalTransportHost(transport.httpHost) } : {}
		};
	}
	return {
		...transport,
		url: normalizeSignalTransportUrl(transport.url)
	};
}
function assertSignalContainerTransportHasAccount(params) {
	if (params.transport.kind !== "container" || params.cfg.channels?.signal?.enabled === false) return;
	const account = resolveSignalAccountConfig(params.cfg, normalizeAccountId$1(params.accountId));
	if (account.enabled === false || normalizeOptionalString(account.account)) return;
	throw new Error("Signal container transport requires an account number for an enabled account.");
}
function assertSignalLocalEndpointDoesNotConflictWithManagedSibling(params) {
	if (params.transport.kind === "managed-native") return;
	const localPort = resolveLocalSignalTransportPort(params.transport.url);
	if (localPort === void 0) return;
	const targetAccountId = normalizeAccountId$1(params.accountId);
	for (const accountId of listSignalAccountIds(params.cfg)) {
		if (normalizeAccountId$1(accountId) === targetAccountId) continue;
		if (resolveSignalAccountEntry(params.cfg.channels?.signal?.accounts, accountId)?.enabled === false) continue;
		const siblingAccount = resolveSignalAccount({
			cfg: params.cfg,
			accountId
		});
		if (!siblingAccount.configured) continue;
		const siblingTransport = siblingAccount.transport;
		if (siblingTransport?.kind !== "managed-native" || siblingTransport.socketPath !== void 0 || siblingTransport.httpPort !== localPort) continue;
		throw new Error(`Signal ${params.transport.kind} account "${targetAccountId}" uses local port ${localPort}, which conflicts with managed native account "${accountId}". Choose a distinct transport URL.`);
	}
}
function resolveConfiguredSignalTransport(cfg, accountId) {
	const signal = cfg.channels?.signal;
	const normalizedAccountId = normalizeAccountId$1(accountId);
	return normalizedAccountId === DEFAULT_ACCOUNT_ID$2 ? signal?.transport ?? resolveSignalAccountEntry(signal?.accounts, normalizedAccountId)?.transport : resolveSignalAccountEntry(signal?.accounts, normalizedAccountId)?.transport;
}
function alignManagedConnectionUrlAfterBindChange(params) {
	if (params.hasUrlOverride || !params.existing?.url || !isSignalManagedNativeConnectionUrlForBind(params.existing)) return assignSignalManagedNativePort(params.prepared, params.httpPort);
	const connectionUrl = new URL(params.existing.url);
	connectionUrl.port = String(params.httpPort);
	const alignedPortUrl = normalizeSignalTransportUrl(connectionUrl.toString());
	const next = {
		...params.prepared,
		url: alignedPortUrl,
		httpPort: params.httpPort
	};
	if (isSignalManagedNativeConnectionUrlForBind(next)) return next;
	const bindHost = params.prepared.httpHost ?? "127.0.0.1";
	const connectionHost = bindHost === "0.0.0.0" ? "127.0.0.1" : bindHost === "::" ? "::1" : bindHost;
	connectionUrl.hostname = connectionHost.includes(":") ? `[${connectionHost}]` : connectionHost;
	return {
		...next,
		url: normalizeSignalTransportUrl(connectionUrl.toString())
	};
}
function prepareSignalManagedNativeTransport(params) {
	const existing = resolveConfiguredSignalTransport(params.cfg, params.accountId);
	const existingManaged = existing?.kind === "managed-native" ? existing : void 0;
	const socketCandidate = {
		kind: "managed-native",
		...existingManaged,
		...params.overrides
	};
	if (socketCandidate.socketPath !== void 0) {
		assertSignalSocketTransport(socketCandidate);
		return socketCandidate;
	}
	const preferredPort = params.overrides?.httpPort ?? existingManaged?.httpPort;
	const prepared = {
		kind: "managed-native",
		...existingManaged,
		...params.overrides,
		httpHost: params.overrides?.httpHost ?? existingManaged?.httpHost ?? "127.0.0.1"
	};
	const portsByAccountId = /* @__PURE__ */ new Map();
	const implicitManagedAccountIds = [];
	for (const accountId of listSignalAccountIds(params.cfg)) {
		const normalizedAccountId = normalizeAccountId$1(accountId);
		const accountConfig = resolveSignalAccountConfig(params.cfg, accountId);
		if (!normalizeOptionalString(accountConfig.account) && !accountConfig.transport) continue;
		const accountPorts = portsByAccountId.get(normalizedAccountId) ?? /* @__PURE__ */ new Set();
		portsByAccountId.set(normalizedAccountId, accountPorts);
		const transport = accountConfig.transport;
		if (transport?.kind === "managed-native") {
			if (transport.socketPath !== void 0) continue;
			if (transport.httpPort !== void 0) accountPorts.add(transport.httpPort);
			else implicitManagedAccountIds.push(normalizedAccountId);
			if (transport.url && !isSignalManagedNativeConnectionUrlForBind(transport)) {
				const localConnectionPort = resolveLocalSignalTransportPort(transport.url);
				if (localConnectionPort !== void 0) accountPorts.add(localConnectionPort);
			}
			continue;
		}
		if (transport?.kind === "external-native" || transport?.kind === "container") {
			const localPort = resolveLocalSignalTransportPort(transport.url);
			if (localPort !== void 0) accountPorts.add(localPort);
			continue;
		}
		implicitManagedAccountIds.push(normalizedAccountId);
	}
	const currentReservedPorts = /* @__PURE__ */ new Set();
	for (const accountPorts of portsByAccountId.values()) for (const httpPort of accountPorts) currentReservedPorts.add(httpPort);
	for (const accountId of implicitManagedAccountIds) {
		const accountPorts = portsByAccountId.get(accountId);
		if (!accountPorts) continue;
		const httpPort = allocateSignalManagedNativePort({ reservedPorts: currentReservedPorts });
		currentReservedPorts.add(httpPort);
		accountPorts.add(httpPort);
	}
	const targetAccountId = normalizeAccountId$1(params.accountId);
	const reservedPorts = /* @__PURE__ */ new Set();
	for (const [accountId, accountPorts] of portsByAccountId) {
		if (accountId === targetAccountId) continue;
		for (const httpPort of accountPorts) reservedPorts.add(httpPort);
	}
	if (prepared.url && (params.overrides?.url !== void 0 ? !isSignalManagedNativeConnectionUrlForBind(prepared) : Boolean(existingManaged?.url && !isSignalManagedNativeConnectionUrlForBind(existingManaged))) && prepared.url) {
		const localConnectionPort = resolveLocalSignalTransportPort(prepared.url);
		if (localConnectionPort !== void 0) reservedPorts.add(localConnectionPort);
	}
	if (params.overrides?.httpPort !== void 0 && reservedPorts.has(params.overrides.httpPort)) throw new Error(`Signal managed native port ${params.overrides.httpPort} is already reserved by another account or local transport endpoint.`);
	return alignManagedConnectionUrlAfterBindChange({
		existing: existingManaged,
		prepared,
		httpPort: allocateSignalManagedNativePort({
			reservedPorts,
			preferredPort
		}),
		hasUrlOverride: params.overrides?.url !== void 0
	});
}
async function probeSignalTransport(params) {
	const timeoutMs = params.timeoutMs ?? 1e4;
	const transport = params.transport.kind === "managed-native" ? prepareSignalManagedNativeTransport({
		cfg: params.cfg,
		accountId: params.accountId,
		overrides: managedTransportOptions(params.transport)
	}) : params.transport;
	const resolved = resolveSignalTransport(transport);
	if (resolved.kind === "container") return (params.probeContainer ?? (await import("./transport-probes.runtime-WprAyBbL.mjs")).containerCheck)(resolved.baseUrl, timeoutMs, params.account);
	return (params.probeNative ?? (await import("./transport-probes.runtime-WprAyBbL.mjs")).nativeCheck)(resolved.baseUrl, timeoutMs);
}
function writeSignalAccountTransport(params) {
	const transport = normalizeTransport(params.transport);
	assertSignalContainerTransportHasAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		transport
	});
	assertSignalLocalEndpointDoesNotConflictWithManagedSibling({
		cfg: params.cfg,
		accountId: params.accountId,
		transport
	});
	const next = patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: "signal",
		accountId: params.accountId,
		patch: { transport }
	});
	const canonical = clearLegacySignalTransportFieldsForAccount({
		cfg: next,
		accountId: params.accountId
	});
	if (transport.kind === "managed-native") resolveSignalAccount({
		cfg: canonical,
		accountId: params.accountId
	});
	return canonical;
}
//#endregion
//#region extensions/signal/src/setup-core.ts
const t = createSetupTranslator$1();
const channel = "signal";
const signalSetupFields = {
	signalNumber: {
		kind: "string",
		cli: {
			flags: "--signal-number <e164>",
			description: "Signal account number (E.164)"
		}
	},
	signalTransport: {
		kind: "choice",
		choices: ["external-native", "container"],
		cli: {
			flags: "--signal-transport <kind>",
			description: "Signal HTTP transport (external-native or container)"
		}
	},
	cliPath: {
		kind: "string",
		cli: {
			flags: "--cli-path <path>",
			description: "signal-cli executable path"
		}
	},
	httpUrl: {
		kind: "string",
		cli: {
			flags: "--http-url <url>",
			description: "Signal HTTP service URL"
		}
	},
	httpHost: {
		kind: "string",
		cli: {
			flags: "--http-host <host>",
			description: "Signal HTTP daemon host"
		}
	},
	httpPort: {
		kind: "string",
		cli: {
			flags: "--http-port <port>",
			description: "Signal HTTP daemon port"
		}
	}
};
const MIN_E164_DIGITS = 5;
const MAX_E164_DIGITS = 15;
const DIGITS_ONLY = /^\d+$/;
const INVALID_SIGNAL_ACCOUNT_ERROR = "Invalid E.164 phone number (must start with + and country code, e.g. +15555550123)";
function normalizeSignalAccountInput(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return null;
	const phoneInput = trimmed.replace(/^signal:/i, "").trim();
	const plusCount = phoneInput.match(/\+/g)?.length ?? 0;
	if (plusCount > 1 || plusCount === 1 && !phoneInput.startsWith("+")) return null;
	const digits = normalizeE164(phoneInput).slice(1);
	if (!DIGITS_ONLY.test(digits)) return null;
	if (digits.length < MIN_E164_DIGITS || digits.length > MAX_E164_DIGITS) return null;
	return `+${digits}`;
}
function isUuidLike(value) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
function parseSignalAllowFromEntries(raw) {
	return parseAllowFromEntries(raw, (entry) => {
		if (normalizeLowercaseStringOrEmpty(entry).startsWith("uuid:")) {
			const id = entry.slice(5).trim();
			if (!id) return { error: "Invalid uuid entry" };
			return { value: `uuid:${id}` };
		}
		if (isUuidLike(entry)) return { value: `uuid:${entry}` };
		const normalized = normalizeSignalAccountInput(entry);
		if (!normalized) return { error: `Invalid entry: ${entry}` };
		return { value: normalized };
	});
}
function buildSignalSetupPatch(input) {
	const account = normalizeSignalAccountInput(input.signalNumber);
	const transport = input.httpUrl ? {
		kind: input.signalTransport ?? "external-native",
		url: normalizeSignalTransportUrl(input.httpUrl)
	} : input.cliPath || input.httpHost || input.httpPort ? {
		kind: "managed-native",
		...input.cliPath ? { cliPath: input.cliPath } : {},
		...input.httpHost ? { httpHost: input.httpHost } : {},
		...input.httpPort ? { httpPort: Number(input.httpPort) } : {}
	} : void 0;
	return {
		...account ? { account } : {},
		...transport ? { transport } : {}
	};
}
async function prepareSignalSetupInput(params) {
	if (!params.input.httpUrl || params.input.signalTransport) return params.input;
	const account = normalizeSignalAccountInput(params.input.signalNumber) ?? normalizeSignalAccountInput(resolveSignalSetupAccount({
		cfg: params.cfg,
		accountId: params.accountId
	})) ?? void 0;
	try {
		const detected = await detectSignalTransport({
			url: params.input.httpUrl,
			...account ? { account } : {}
		});
		return {
			...params.input,
			signalTransport: detected.kind === "container" ? "container" : "external-native"
		};
	} catch {
		const existing = resolveConfiguredSignalTransport(params.cfg, params.accountId);
		if (existing?.kind === "container" || existing?.kind === "external-native") return params.input;
		throw new Error("Signal could not detect the HTTP transport; start the endpoint or pass --signal-transport external-native|container.");
	}
}
function managedTransportOverridesFromSetupInput(input) {
	return {
		...input.cliPath ? { cliPath: input.cliPath } : {},
		...input.httpHost ? { httpHost: input.httpHost } : {},
		...input.httpPort ? { httpPort: Number(input.httpPort) } : {}
	};
}
function resolveSignalSetupAccount(params) {
	const accountId = normalizeAccountId$1(params.accountId ?? resolveDefaultSignalAccountId(params.cfg));
	const signal = params.cfg.channels?.signal;
	return resolveSignalAccountEntry(signal?.accounts, accountId)?.account ?? signal?.account;
}
async function promptSignalAllowFrom(params) {
	return promptParsedAllowFromForAccount({
		cfg: params.cfg,
		accountId: params.accountId,
		defaultAccountId: resolveDefaultSignalAccountId(params.cfg),
		prompter: params.prompter,
		noteTitle: t("wizard.signal.allowlistTitle"),
		noteLines: [
			t("wizard.signal.allowlistIntro"),
			t("wizard.signal.examples"),
			"- +15555550123",
			"- uuid:123e4567-e89b-12d3-a456-426614174000",
			t("wizard.signal.multipleEntries"),
			`Docs: ${formatDocsLink("/signal", "signal")}`
		],
		message: t("wizard.signal.allowFromPrompt"),
		placeholder: "+15555550123, uuid:123e4567-e89b-12d3-a456-426614174000",
		parseEntries: parseSignalAllowFromEntries,
		getExistingAllowFrom: ({ cfg, accountId }) => resolveSignalAccount({
			cfg,
			accountId
		}).config.allowFrom ?? [],
		applyAllowFrom: ({ cfg, accountId, allowFrom }) => setAccountAllowFromForChannel({
			cfg,
			channel,
			accountId,
			allowFrom,
			setupSurface: signalSetupAdapter
		})
	});
}
const signalDmPolicy = createChannelDmPolicy({
	label: "Signal",
	channel,
	resolveAccount: (cfg, accountId) => resolveSignalAccount({
		cfg,
		accountId: accountId ?? resolveDefaultSignalAccountId(cfg)
	}),
	setupSurface: () => signalSetupAdapter,
	promptAllowFrom: promptSignalAllowFrom
});
function resolveSignalCliPath(params) {
	const transport = resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).transport;
	if (transport.kind !== "managed-native") return;
	return typeof params.credentialValues.cliPath === "string" ? params.credentialValues.cliPath : transport.cliPath;
}
function createSignalCliPathTextInput(shouldPrompt) {
	return createCliPathTextInput({
		inputKey: "cliPath",
		message: "signal-cli path",
		resolvePath: ({ cfg, accountId, credentialValues }) => resolveSignalCliPath({
			cfg,
			accountId,
			credentialValues
		}),
		shouldPrompt
	});
}
const signalNumberTextInput = {
	inputKey: "signalNumber",
	message: t("wizard.signal.botNumberPrompt"),
	currentValue: ({ cfg, accountId }) => normalizeSignalAccountInput(resolveSignalAccount({
		cfg,
		accountId
	}).config.account) ?? void 0,
	keepPrompt: (value) => t("wizard.signal.accountKeep", { value }),
	validate: ({ value }) => normalizeSignalAccountInput(value) ? void 0 : INVALID_SIGNAL_ACCOUNT_ERROR,
	normalizeValue: ({ value }) => normalizeSignalAccountInput(value) ?? value
};
const signalCompletionNote = {
	title: t("wizard.signal.nextStepsTitle"),
	lines: [
		t("wizard.signal.nextLinkDevice"),
		t("wizard.signal.nextScanQr"),
		`Then run: ${formatCliCommand("openclaw gateway call channels.status --params '{\"probe\":true}'")}`,
		`Docs: ${formatDocsLink("/signal", "signal")}`
	]
};
const signalSetupAdapterBase = createPatchedAccountSetupAdapter({
	channelKey: channel,
	validateInput: createSetupInputPresenceValidator({ validate: ({ cfg, accountId, input }) => {
		if (input.signalTransport && input.signalTransport !== "external-native" && input.signalTransport !== "container") return "Signal --signal-transport must be external-native or container.";
		if (input.signalTransport && !input.httpUrl) return "Signal --signal-transport requires --http-url.";
		if (input.httpPort !== void 0 && !isValidSignalManagedNativePort(Number(input.httpPort))) return "Signal --http-port must be an integer between 1 and 65535.";
		if (input.httpHost) try {
			normalizeSignalTransportHost(input.httpHost);
		} catch {
			return "Signal --http-host must be a hostname or IP address.";
		}
		if (input.signalNumber !== void 0 && !normalizeSignalAccountInput(input.signalNumber)) return INVALID_SIGNAL_ACCOUNT_ERROR;
		if (input.signalTransport === "container" && !normalizeSignalAccountInput(input.signalNumber) && !normalizeSignalAccountInput(resolveSignalSetupAccount({
			cfg,
			accountId
		}))) return "Signal container transport requires --signal-number or an existing account.";
		if (!input.signalNumber && !input.httpUrl && !input.httpHost && !input.httpPort && !input.cliPath) return "Signal requires --signal-number or --http-url/--http-host/--http-port/--cli-path.";
		return null;
	} }),
	buildPatch: (input) => buildSignalSetupPatch(input)
});
function restorePromotedSignalDefaultAccount(cfg) {
	const signal = cfg.channels?.signal;
	const promotedKey = resolveSignalAccountKey(signal?.accounts, DEFAULT_ACCOUNT_ID$2);
	const promoted = promotedKey === void 0 ? void 0 : signal?.accounts?.[promotedKey];
	if (!signal?.transport || signal.account || !promoted?.account || promotedKey === void 0) return cfg;
	const { account, transport: _shadowedTransport, ...remainingDefault } = promoted;
	const accounts = { ...signal.accounts };
	delete accounts[promotedKey];
	accounts[DEFAULT_ACCOUNT_ID$2] = remainingDefault;
	return patchTopLevelChannelConfigSection({
		cfg,
		channel,
		patch: {
			account,
			accounts
		}
	});
}
const signalSetupAdapter = {
	...signalSetupAdapterBase,
	namedAccountPromotionKeys: [],
	prepareAccountConfigInput: ({ cfg, accountId, input }) => prepareSignalSetupInput({
		cfg,
		accountId,
		input
	}),
	singleAccountKeysToMove: [
		"signalNumber",
		"account",
		"cliPath",
		"httpUrl",
		"httpHost",
		"httpPort"
	],
	applyAccountConfig: (params) => {
		const accountId = normalizeAccountId$1(params.accountId);
		const cfg = restorePromotedSignalDefaultAccount(params.cfg);
		const previousTransport = resolveConfiguredSignalTransport(cfg, accountId);
		const next = signalSetupAdapterBase.applyAccountConfig?.({
			...params,
			cfg,
			accountId
		}) ?? cfg;
		const configuredTransport = resolveConfiguredSignalTransport(next, accountId);
		if (configuredTransport && configuredTransport.kind !== "managed-native") return writeSignalAccountTransport({
			cfg: next,
			accountId,
			transport: params.input.httpUrl && !params.input.signalTransport && (previousTransport?.kind === "container" || previousTransport?.kind === "external-native") ? {
				...configuredTransport,
				kind: previousTransport.kind
			} : configuredTransport
		});
		return writeSignalAccountTransport({
			cfg: next,
			accountId,
			transport: prepareSignalManagedNativeTransport({
				cfg,
				accountId,
				overrides: managedTransportOverridesFromSetupInput(params.input)
			})
		});
	}
};
const signalSetupContract = defineChannelSetupContract({
	fields: signalSetupFields,
	adapter: signalSetupAdapter
});
function createSignalSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: {
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
			configuredHint: t("wizard.channels.statusSignalCliFound"),
			unconfiguredHint: t("wizard.channels.statusSignalCliMissing"),
			configuredScore: 1,
			unconfiguredScore: 0
		},
		delegatePrepare: true,
		credentials: [],
		textInputs: [createSignalCliPathTextInput(createDelegatedTextInputShouldPrompt({
			loadWizard,
			inputKey: "cliPath"
		})), signalNumberTextInput],
		completionNote: signalCompletionNote,
		dmPolicy: signalDmPolicy,
		disable: (cfg) => setSetupChannelEnabled$1(cfg, channel, false)
	});
}
//#endregion
//#region extensions/signal/src/doctor.ts
const signalDoctor = {
	normalizeCompatibilityConfig,
	cleanStaleConfig: async ({ cfg }) => {
		const { detectSignalTransport } = await import("./transport-detection.runtime-Tlhuv3T_.mjs");
		const transport = await migrateLegacySignalTransportConfig({
			cfg,
			detect: detectSignalTransport
		});
		return {
			...transport,
			warnings: [...repairSignalAccountKeys({ cfg: transport.config }).warnings ?? [], ...transport.warnings ?? []]
		};
	}
};
//#endregion
//#region extensions/signal/src/shared.ts
const SIGNAL_CHANNEL = "signal";
async function loadSignalChannelRuntime() {
	return await import("./channel.runtime-CG79z_Vy.mjs");
}
const signalSetupWizard = createSignalSetupWizardProxy(async () => (await loadSignalChannelRuntime()).signalSetupWizard);
const signalConfigAdapter = {
	...createScopedChannelConfigAdapter({
		sectionKey: SIGNAL_CHANNEL,
		listAccountIds: (cfg) => listSignalAccountIds(cfg),
		resolveAccount: adaptScopedAccountAccessor((params) => resolveSignalAccount(params)),
		defaultAccountId: (cfg) => resolveDefaultSignalAccountId(cfg),
		clearBaseFields: [
			"account",
			"accountUuid",
			"transport",
			"name"
		],
		resolveAllowFrom: (account) => account.config.allowFrom,
		formatAllowFrom: (allowFrom) => normalizeStringifiedEntries(allowFrom).map((entry) => entry === "*" ? "*" : normalizeE164(entry.replace(/^signal:/i, ""))).filter(Boolean),
		resolveDefaultTo: (account) => account.config.defaultTo
	}),
	resolveDefaultTo({ cfg, accountId }) {
		const raw = resolveSignalAccount({
			cfg,
			accountId
		}).config.defaultTo;
		if (typeof raw !== "string" || !raw.trim()) return;
		try {
			return resolveSignalTarget({
				cfg,
				accountId,
				input: raw
			})?.to ?? raw.trim();
		} catch {
			return raw.trim();
		}
	}
};
const signalSecurityAdapter = createRestrictSendersChannelSecurity({
	channelKey: SIGNAL_CHANNEL,
	resolveDmPolicy: (account) => account.config.dmPolicy,
	resolveDmAllowFrom: (account) => account.config.allowFrom,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	surface: "Signal groups",
	openScope: "any member",
	groupPolicyPath: "channels.signal.groupPolicy",
	groupAllowFromPath: "channels.signal.groupAllowFrom",
	mentionGated: false,
	findingTitle: "Signal security warning",
	policyPathSuffix: "dmPolicy",
	normalizeDmEntry: (raw) => normalizeE164(raw.replace(/^signal:/i, "").trim())
});
function createSignalPluginBase(params) {
	return {
		...createChannelPluginBase({
			id: SIGNAL_CHANNEL,
			meta: { ...getChatChannelMeta(SIGNAL_CHANNEL) },
			setupWizard: params.setupWizard,
			capabilities: {
				chatTypes: ["direct", "group"],
				media: true,
				reactions: true
			},
			streaming: { blockStreamingCoalesceDefaults: {
				minChars: 1500,
				idleMs: 1e3
			} },
			reload: {
				configPrefixes: ["channels.signal"],
				noopPrefixes: ["messages.inbound", "messages.ackReactionScope"]
			},
			configSchema: SignalChannelConfigSchema,
			doctor: signalDoctor,
			config: {
				...signalConfigAdapter,
				isConfigured: (account) => account.configured,
				describeAccount: (account) => describeAccountSnapshot({
					account,
					configured: account.configured,
					extra: { baseUrl: account.baseUrl }
				})
			},
			security: signalSecurityAdapter,
			setupContract: params.setupContract
		}),
		messaging: { defaultMarkdownTableMode: "bullets" }
	};
}
//#endregion
//#region extensions/signal/src/channel.ts
const loadSignalMonitorModule = createLazyRuntimeModule(() => import("./monitor-Dnz6Ygz5.mjs").then((n) => n.n));
const loadSignalProbeModule = createLazyRuntimeModule(() => import("./probe-DXT2eLnw.mjs").then((n) => n.n));
const loadSignalSendRuntime = createLazyRuntimeModule(() => import("./send.runtime-CLnCWvrM.mjs"));
const loadSignalApprovalReactionsModule = createLazyRuntimeModule(() => import("./approval-reactions-DDQvPP_z.mjs").then((n) => n.n));
async function resolveSignalSendContext(params) {
	return {
		send: resolveOutboundSendDep(params.deps, "signal") ?? (await loadSignalSendRuntime()).sendMessageSignal,
		maxBytes: resolveChannelMediaMaxBytes({
			cfg: params.cfg,
			resolveChannelLimitMb: () => resolveSignalAccount(params).config.mediaMaxMb
		})
	};
}
function resolveSignalSendTarget(params) {
	return resolveSignalTarget({
		cfg: params.cfg,
		accountId: params.accountId,
		input: params.to
	})?.to ?? params.to.trim();
}
async function sendSignalOutbound(params) {
	const accountId = params.accountId ?? void 0;
	const { send, maxBytes } = await resolveSignalSendContext({
		...params,
		accountId
	});
	const to = resolveSignalSendTarget({
		...params,
		accountId
	});
	const replyOptions = await resolveSignalReplyOptions({
		cfg: params.cfg,
		to,
		accountId,
		replyToId: params.replyToId
	});
	return await send(to, params.text, {
		cfg: params.cfg,
		...params.mediaUrl ? { mediaUrl: params.mediaUrl } : {},
		...params.mediaAccess ? { mediaAccess: params.mediaAccess } : {},
		...params.mediaLocalRoots?.length ? { mediaLocalRoots: params.mediaLocalRoots } : {},
		...params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {},
		maxBytes,
		accountId,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		...replyOptions
	});
}
function resolveSignalReplyOptions(params) {
	const replyToId = normalizeOptionalString(params.replyToId);
	if (!replyToId) return Promise.resolve({});
	const accountId = resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).accountId;
	return resolveSignalReplyContextWithPersistence({
		accountId,
		to: params.to,
		replyToId
	}).then((persistedContext) => {
		const replyToAuthor = persistedContext?.ambiguous === true ? void 0 : persistedContext?.author;
		const replyToBody = persistedContext?.ambiguous === true ? "" : [persistedContext?.body, formatSignalMediaText(persistedContext?.media ?? [])].filter(Boolean).join("\n");
		return {
			replyToId,
			...replyToAuthor ? { replyToAuthor } : {},
			...replyToBody ? { replyToBody } : {}
		};
	});
}
function inferSignalTargetChatType(rawTo) {
	let to = rawTo.trim();
	if (!to) return;
	if (/^signal:/i.test(to)) to = to.replace(/^signal:/i, "").trim();
	if (!to) return;
	if (normalizeLowercaseStringOrEmpty(to).startsWith("group:")) return "group";
	return "direct";
}
function attachSignalVisibleText(result, visibleText) {
	const meta = "meta" in result && result.meta && typeof result.meta === "object" ? result.meta : {};
	return {
		...result,
		meta: {
			...meta,
			visibleText,
			signalVisibleText: visibleText
		}
	};
}
const signalMessageAdapter = defineChannelMessageAdapter({
	id: "signal",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		payload: true,
		replyTo: true,
		messageSendingHooks: true
	} },
	send: {
		text: sendSignalOutbound,
		media: sendSignalOutbound
	}
});
function buildSignalBaseSessionKey(params) {
	return buildOutboundBaseSessionKey({
		...params,
		channel: "signal"
	});
}
function resolveSignalOutboundSessionRoute(params) {
	const target = params.resolvedTarget?.to ?? params.target;
	const resolved = resolveSignalOutboundTarget(target);
	if (!resolved) return null;
	const normalizedTarget = target.replace(/^signal:/i, "").trim();
	const recipientSessionExact = resolved.chatType === "group" || /^\+?\d{3,15}$/.test(normalizedTarget) ? true : "direct-alias";
	const baseSessionKey = buildSignalBaseSessionKey({
		cfg: params.cfg,
		agentId: params.agentId,
		accountId: params.accountId,
		peer: resolved.peer
	});
	return {
		sessionKey: baseSessionKey,
		baseSessionKey,
		recipientSessionExact,
		...resolved
	};
}
async function sendFormattedSignalText(ctx) {
	const { send, maxBytes } = await resolveSignalSendContext({
		cfg: ctx.cfg,
		accountId: ctx.accountId ?? void 0,
		deps: ctx.deps
	});
	const limit = resolveTextChunkLimit(ctx.cfg, "signal", ctx.accountId ?? void 0, { fallbackLimit: 4e3 });
	const to = resolveSignalSendTarget({
		cfg: ctx.cfg,
		accountId: ctx.accountId ?? void 0,
		to: ctx.to
	});
	const tableMode = resolveMarkdownTableMode({
		cfg: ctx.cfg,
		channel: "signal",
		accountId: ctx.accountId ?? void 0
	});
	let chunks = limit === void 0 ? markdownToSignalTextChunks(ctx.text, Number.POSITIVE_INFINITY, { tableMode }) : markdownToSignalTextChunks(ctx.text, limit, { tableMode });
	if (chunks.length === 0 && ctx.text) chunks = [{
		text: ctx.text,
		styles: []
	}];
	const effectiveReplyToMode = ctx.replyToMode ?? resolveSignalReplyToMode({
		cfg: ctx.cfg,
		accountId: ctx.accountId,
		chatType: inferSignalTargetChatType(to)
	});
	const nextReplyToId = createReplyToFanout({
		replyToId: ctx.replyToId,
		replyToIdSource: ctx.replyToIdSource,
		replyToMode: effectiveReplyToMode
	});
	const results = [];
	for (const chunk of chunks) {
		ctx.abortSignal?.throwIfAborted();
		const replyToId = nextReplyToId();
		const replyOptions = await resolveSignalReplyOptions({
			cfg: ctx.cfg,
			to,
			accountId: ctx.accountId,
			replyToId
		});
		const result = await send(to, chunk.text, {
			cfg: ctx.cfg,
			maxBytes,
			accountId: ctx.accountId ?? void 0,
			textMode: "plain",
			textStyles: chunk.styles,
			assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
			...replyOptions
		});
		const deliveryResult = attachChannelToResult("signal", attachSignalVisibleText(result, chunk.text));
		results.push(deliveryResult);
		await ctx.onDeliveryResult?.(deliveryResult);
	}
	return results;
}
async function sendFormattedSignalMedia(ctx) {
	ctx.abortSignal?.throwIfAborted();
	const { send, maxBytes } = await resolveSignalSendContext({
		cfg: ctx.cfg,
		accountId: ctx.accountId ?? void 0,
		deps: ctx.deps
	});
	const to = resolveSignalSendTarget({
		cfg: ctx.cfg,
		accountId: ctx.accountId ?? void 0,
		to: ctx.to
	});
	const tableMode = resolveMarkdownTableMode({
		cfg: ctx.cfg,
		channel: "signal",
		accountId: ctx.accountId ?? void 0
	});
	const formatted = markdownToSignalTextChunks(ctx.text, Number.POSITIVE_INFINITY, { tableMode })[0] ?? {
		text: ctx.text,
		styles: []
	};
	const replyOptions = await resolveSignalReplyOptions({
		cfg: ctx.cfg,
		to,
		accountId: ctx.accountId,
		replyToId: ctx.replyToId
	});
	const result = await send(to, formatted.text, {
		cfg: ctx.cfg,
		mediaUrl: ctx.mediaUrl,
		...ctx.mediaAccess ? { mediaAccess: ctx.mediaAccess } : {},
		mediaLocalRoots: ctx.mediaLocalRoots,
		...ctx.mediaReadFile ? { mediaReadFile: ctx.mediaReadFile } : {},
		maxBytes,
		accountId: ctx.accountId ?? void 0,
		textMode: "plain",
		textStyles: formatted.styles,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
		...replyOptions
	});
	return attachChannelToResult("signal", attachSignalVisibleText(result, formatted.text));
}
async function registerDeliveredSignalApprovalPayloadForReactions(params) {
	const account = resolveSignalAccount({
		cfg: params.cfg,
		accountId: params.target.accountId ?? void 0
	});
	const targetAuthor = normalizeOptionalString(account.config.account);
	const targetAuthorUuid = normalizeOptionalString(account.config.accountUuid);
	if (!targetAuthor && !targetAuthorUuid) return;
	const { registerSignalQuestionReactionTargetForDeliveredPayload } = await import("./question-reactions-C8cSEjVf.mjs").then((n) => n.n);
	registerSignalQuestionReactionTargetForDeliveredPayload({
		cfg: params.cfg,
		target: {
			...params.target,
			accountId: account.accountId
		},
		payload: params.payload,
		results: params.results,
		targetAuthor,
		targetAuthorUuid
	});
	const { registerSignalApprovalReactionTargetForDeliveredPayload } = await loadSignalApprovalReactionsModule();
	await registerSignalApprovalReactionTargetForDeliveredPayload({
		cfg: params.cfg,
		target: {
			...params.target,
			accountId: account.accountId
		},
		payload: params.payload,
		results: params.results,
		targetAuthor,
		targetAuthorUuid
	});
}
async function renderSignalApprovalPayloadForReactions(params) {
	const account = resolveSignalAccount({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId ?? void 0
	});
	const targetAuthor = normalizeOptionalString(account.config.account);
	const targetAuthorUuid = normalizeOptionalString(account.config.accountUuid);
	if (!targetAuthor && !targetAuthorUuid) return null;
	const { addSignalApprovalReactionHintToStructuredPayload } = await loadSignalApprovalReactionsModule();
	const payload = materializeSignalPresentationFallback(params.payload, params.presentation);
	const questionPayload = questionGatewayRuntime.prepareReactionPayloadForDelivery({
		payload: params.payload,
		presentation: params.presentation
	});
	if (questionPayload) return questionPayload;
	return addSignalApprovalReactionHintToStructuredPayload({
		cfg: params.ctx.cfg,
		accountId: params.ctx.accountId ?? void 0,
		to: params.ctx.to,
		payload,
		targetAuthor,
		targetAuthorUuid
	});
}
const signalPlugin = createChatChannelPlugin({
	base: {
		...createSignalPluginBase({
			setupWizard: signalSetupWizard,
			setupContract: signalSetupContract
		}),
		actions: signalMessageActions,
		approvalCapability: signalApprovalCapability,
		allowlist: buildDmGroupAccountAllowlistAdapter({
			channelId: "signal",
			resolveAccount: resolveSignalAccount,
			normalize: ({ cfg, accountId, values }) => signalConfigAdapter.formatAllowFrom({
				cfg,
				accountId,
				allowFrom: values
			}),
			resolveDmAllowFrom: (account) => account.config.allowFrom,
			resolveGroupAllowFrom: (account) => account.config.groupAllowFrom,
			resolveDmPolicy: (account) => account.config.dmPolicy,
			resolveGroupPolicy: (account) => account.config.groupPolicy
		}),
		agentPrompt: { reactionGuidance: ({ cfg, accountId }) => {
			const level = resolveSignalReactionLevel({
				cfg,
				accountId: accountId ?? void 0
			}).agentReactionGuidance;
			return level ? {
				level,
				channelLabel: "Signal"
			} : void 0;
		} },
		messaging: {
			targetPrefixes: ["signal"],
			normalizeTarget: normalizeSignalMessagingTarget,
			inferTargetChatType: ({ to }) => inferSignalTargetChatType(to),
			resolveOutboundSessionRoute: (params) => resolveSignalOutboundSessionRoute(params),
			targetResolver: {
				looksLikeId: looksLikeSignalTargetId,
				hint: "<E.164|uuid:ID|group:ID|signal:group:ID|signal:+E.164>",
				resolveTarget: async ({ cfg, accountId, input }) => {
					let target;
					try {
						target = resolveSignalTarget({
							cfg,
							accountId,
							input
						});
					} catch {
						return null;
					}
					if (!target) return null;
					return {
						to: target.to,
						kind: target.kind,
						display: target.source === "alias" ? target.alias : void 0,
						source: target.source === "alias" ? "directory" : "normalized"
					};
				}
			}
		},
		directory: {
			listPeers: async ({ cfg, accountId, query, limit }) => listSignalAliasDirectoryEntries({
				cfg,
				accountId,
				query,
				limit,
				kind: "user"
			}),
			listGroups: async ({ cfg, accountId, query, limit }) => listSignalAliasDirectoryEntries({
				cfg,
				accountId,
				query,
				limit,
				kind: "group"
			})
		},
		heartbeat: {
			sendTyping: async ({ cfg, to, accountId }) => {
				await (await loadSignalSendRuntime()).sendTypingSignal(to, {
					cfg,
					...accountId ? { accountId } : {}
				});
			},
			clearTyping: async ({ cfg, to, accountId }) => {
				await (await loadSignalSendRuntime()).sendTypingSignal(to, {
					cfg,
					...accountId ? { accountId } : {},
					stop: true
				});
			}
		},
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID),
			collectStatusIssues: (accounts) => collectStatusIssuesFromLastError("signal", accounts),
			buildChannelSummary: ({ snapshot }) => buildBaseChannelStatusSummary(snapshot, {
				baseUrl: snapshot.baseUrl ?? null,
				probe: snapshot.probe,
				lastProbeAt: snapshot.lastProbeAt ?? null
			}),
			probeAccount: async ({ account, timeoutMs }) => {
				const { probeSignalAccount } = await loadSignalProbeModule();
				return await probeSignalAccount({
					baseUrl: account.baseUrl,
					timeoutMs,
					transportKind: account.transport.kind,
					account: account.config.account
				});
			},
			formatCapabilitiesProbe: ({ probe }) => probe?.version ? [{ text: `Signal daemon: ${probe.version}` }] : [],
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: account.configured,
				extra: { baseUrl: account.baseUrl }
			})
		}),
		gateway: { startAccount: async (ctx) => {
			const account = ctx.account;
			const statusSink = createAccountStatusSink({
				accountId: account.accountId,
				setStatus: ctx.setStatus
			});
			statusSink({ baseUrl: account.baseUrl });
			ctx.log?.info(`[${account.accountId}] starting provider (${account.baseUrl})`);
			const { monitorSignalProvider } = await loadSignalMonitorModule();
			return await monitorSignalProvider({
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				channelRuntime: ctx.channelRuntime,
				abortSignal: ctx.abortSignal,
				mediaMaxMb: account.config.mediaMaxMb,
				statusSink
			});
		} },
		message: signalMessageAdapter
	},
	pairing: { text: {
		idLabel: "signalNumber",
		message: PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: createPairingPrefixStripper(/^signal:/i),
		notify: async ({ cfg, id, message, accountId }) => {
			await (await loadSignalSendRuntime()).sendMessageSignal(id, message, {
				cfg,
				accountId
			});
		}
	} },
	security: signalSecurityAdapter,
	threading: {
		resolveReplyToMode: (params) => resolveSignalReplyToMode(params),
		matchesToolContextTarget: ({ target, toolContext }) => {
			const normalizedTarget = normalizeSignalMessagingTarget(target);
			if (!normalizedTarget) return false;
			return [toolContext.currentMessagingTarget, toolContext.currentChannelId].some((currentTarget) => currentTarget != null && normalizeSignalMessagingTarget(currentTarget) === normalizedTarget);
		},
		buildToolContext: ({ cfg, accountId, context, hasRepliedRef }) => {
			const currentMessagingTarget = normalizeOptionalString(context.To);
			const currentChatType = context.ChatType === "direct" || context.ChatType === "group" ? context.ChatType : void 0;
			return {
				currentChannelId: normalizeOptionalString(context.NativeChannelId) ?? currentMessagingTarget,
				currentChatType,
				currentMessagingTarget,
				currentMessageId: context.ReplyToId ?? context.CurrentMessageId,
				replyToMode: resolveSignalReplyToMode({
					cfg,
					accountId,
					chatType: currentChatType
				}),
				hasRepliedRef
			};
		}
	},
	outbound: {
		base: {
			deliveryMode: "direct",
			resolveTarget: ({ cfg, to, accountId }) => {
				const raw = to?.trim();
				if (!raw) return {
					ok: false,
					error: /* @__PURE__ */ new Error("Signal target is required")
				};
				let target;
				try {
					target = resolveSignalTarget({
						cfg: cfg ?? {},
						accountId,
						input: raw
					});
				} catch (error) {
					return {
						ok: false,
						error: error instanceof Error ? error : new Error(String(error))
					};
				}
				if (!target) return {
					ok: false,
					error: /* @__PURE__ */ new Error(`Unknown Signal alias or target "${raw}". Configure channels.signal.aliases.${raw.replace(/^signal:/i, "")} or use E.164, uuid:<id>, username:<name>, or group:<id>.`)
				};
				return {
					ok: true,
					to: target.to
				};
			},
			chunker: chunkText,
			chunkerMode: "text",
			textChunkLimit: 4e3,
			sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
			shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) => shouldSuppressLocalSignalExecApprovalPrompt({
				cfg,
				accountId,
				payload,
				hint
			}),
			afterDeliverPayload: registerDeliveredSignalApprovalPayloadForReactions,
			renderPresentation: renderSignalApprovalPayloadForReactions,
			sendFormattedText: sendFormattedSignalText,
			sendFormattedMedia: sendFormattedSignalMedia
		},
		attachedResults: {
			channel: "signal",
			sendText: sendSignalOutbound,
			sendMedia: sendSignalOutbound
		}
	}
});
//#endregion
export { normalizeSignalAccountInput as a, signalNumberTextInput as c, probeSignalTransport as d, writeSignalAccountTransport as f, createSignalCliPathTextInput as i, signalSetupContract as l, createSignalPluginBase as n, signalCompletionNote as o, resolveSignalOutboundTarget as p, signalSetupWizard as r, signalDmPolicy as s, signalPlugin as t, prepareSignalManagedNativeTransport as u };
