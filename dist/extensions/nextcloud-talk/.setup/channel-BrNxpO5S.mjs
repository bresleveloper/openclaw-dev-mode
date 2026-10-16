import { a as __exportAll, n as legacyConfigRules, o as __reExport, r as normalizeCompatibilityConfig } from "./doctor-contract-DwH950tH.mjs";
import { listNextcloudTalkAccountIds as listNextcloudTalkAccountIds$1, mergeNextcloudTalkAccountConfig, resolveDefaultNextcloudTalkAccountId } from "../configured-state.js";
import { a as logInboundDrop, c as warnMissingProviderGroupPolicyFallbackOnce, i as fetchWithSsrFGuard, l as getNextcloudTalkRuntime, n as createChannelPairingController, o as resolveAllowlistProviderRuntimeGroupPolicy, r as deliverFormattedTextWithAttachments, s as resolveDefaultGroupPolicy, t as GROUP_POLICY_BLOCKED_LABEL, u as getOptionalNextcloudTalkRuntime } from "./runtime-api-DVkVOUSo.mjs";
import { n as collectRuntimeConfigAssignments, r as secretTargetRegistryEntries } from "./secret-contract-Bvm0PmP3.mjs";
import { describeWebhookAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin } from "openclaw/plugin-sdk/channel-core";
import { createLoggedPairingApprovalNotifier, createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { createAllowlistProviderRouteAllowlistWarningCollector, createConditionalWarningCollector, resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { buildWebhookChannelStatusSummary, createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { convertMarkdownTables, sanitizeAssistantVisibleText } from "openclaw/plugin-sdk/text-chunking";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, resolveAccountWithDefaultFallback } from "openclaw/plugin-sdk/account-core";
import { isTruthyEnvValue } from "openclaw/plugin-sdk/runtime-env";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { buildSecretInputSchema, hasConfiguredSecretInput, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringEntries, readNonEmptyStringPreservingWhitespace } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { parseStrictNonNegativeInteger, parseStrictPositiveInteger } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { resolveChannelInboundRouteEnvelope } from "openclaw/plugin-sdk/channel-inbound";
import { SsrFBlockedError, ssrfPolicyFromPrivateNetworkOptIn, ssrfPolicyFromPrivateNetworkOptIn as ssrfPolicyFromPrivateNetworkOptIn$1 } from "openclaw/plugin-sdk/ssrf-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { createHmac, randomBytes } from "node:crypto";
import { safeEqualSecret } from "openclaw/plugin-sdk/security-runtime";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2 } from "openclaw/plugin-sdk/account-id";
import { DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, ReplyRuntimeConfigSchemaShape, ReplyToModeSchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema, requireOpenAllowFrom } from "openclaw/plugin-sdk/channel-config-schema";
import { formatAllowFromLowercase, resolveAllowlistMatchByCandidates } from "openclaw/plugin-sdk/allow-from";
import { adaptScopedAccountAccessor, clearAccountFieldsFromConfigSection, createScopedChannelConfigAdapter, createScopedDmSecurityResolver } from "openclaw/plugin-sdk/channel-config-helpers";
import { createDeferred, requireChannelOpenAllowFrom, resolveLoggerBackedRuntime } from "openclaw/plugin-sdk/extension-shared";
import { z } from "zod";
import os from "node:os";
import path from "node:path";
import { fileExists } from "openclaw/plugin-sdk/file-access-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { bindIngressLifecycleToReplyOptions, createAccountStatusSink, createChannelIngressMonitor, createMessageReceiptFromOutboundResults, defineChannelMessageAdapter, resolveChannelStreamingBlockEnabled, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { channelIngressRoutes } from "openclaw/plugin-sdk/channel-ingress-runtime";
import { safeParseJson, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { buildChannelKeyCandidates, normalizeChannelSlug, resolveChannelEntryMatchWithFallback } from "openclaw/plugin-sdk/channel-targets";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { WEBHOOK_RATE_LIMIT_DEFAULTS, createAuthRateLimiter, createWebhookInFlightLimiter, getWebhookLegacyListener, isRequestBodyLimitError, readRequestBodyWithLimit, requestBodyErrorToText, resolveRequestClientIp } from "openclaw/plugin-sdk/webhook-ingress";
import { sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { canonicalizeWebhookRouteKey, registerPluginHttpRoute, registerWebhookTarget, resolveSingleWebhookTarget } from "openclaw/plugin-sdk/webhook-targets";
import { isRecord as isRecord$1 } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { resolvePersistentDedupePluginStateNamespace } from "openclaw/plugin-sdk/persistent-dedupe";
import { jsonResult, readStringParam, resolveReactionMessageId } from "openclaw/plugin-sdk/channel-actions";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1 } from "openclaw/plugin-sdk/routing";
import { applyAccountNameToChannelSection, baseUrlTextInput, createPromptParsedAllowFromForAccount, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, patchScopedAccountConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { createSetupInputPresenceValidator, createSetupTranslator as createSetupTranslator$1, mergeAllowFromEntries } from "openclaw/plugin-sdk/setup-runtime";
import { formatDocsLink as formatDocsLink$1 } from "openclaw/plugin-sdk/setup-tools";
//#region extensions/nextcloud-talk/src/api-credentials.ts
function resolveNextcloudTalkApiCredentialsResult(params) {
	const apiUser = params.apiUser?.trim();
	if (!apiUser) return { status: "missing" };
	const inlinePassword = resolveSecretInputString({
		value: params.apiPassword,
		path: "channels.nextcloud-talk.apiPassword",
		mode: params.mode
	});
	if (inlinePassword.status === "available") return {
		status: "available",
		value: {
			apiUser,
			apiPassword: inlinePassword.value
		}
	};
	if (inlinePassword.status === "configured_unavailable") return { status: "configured_unavailable" };
	if (!params.apiPasswordFile?.trim()) return { status: "missing" };
	const result = tryReadSecretFileSync(params.apiPasswordFile, "Nextcloud Talk API password", { rejectHardlinks: false }, { configPath: params.configPath ?? "channels.nextcloud-talk.apiPasswordFile" });
	if (result.status === "available") return result.value ? {
		status: "available",
		value: {
			apiUser,
			apiPassword: result.value
		}
	} : { status: "missing" };
	return result;
}
function resolveNextcloudTalkApiCredentials(params) {
	const result = resolveNextcloudTalkApiCredentialsResult(params);
	return result.status === "available" ? result.value : void 0;
}
//#endregion
//#region extensions/nextcloud-talk/src/accounts.ts
const debugAccounts = (...args) => {
	if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_NEXTCLOUD_TALK_ACCOUNTS)) console.warn("[nextcloud-talk:accounts]", ...args);
};
function listNextcloudTalkAccountIds(cfg) {
	const ids = listNextcloudTalkAccountIds$1(cfg);
	debugAccounts("listNextcloudTalkAccountIds", ids);
	return ids;
}
function resolveNextcloudTalkSecret(accountId, merged) {
	const configuredSecret = resolveSecretInputString({
		value: merged.botSecret,
		path: `channels.nextcloud-talk.accounts.${accountId}.botSecret`,
		mode: "inspect"
	});
	if (configuredSecret.status === "configured_unavailable") return {
		secret: "",
		source: "config",
		status: "configured_unavailable"
	};
	const envSecret = normalizeOptionalString(process.env.NEXTCLOUD_TALK_BOT_SECRET);
	if (envSecret && accountId === DEFAULT_ACCOUNT_ID) return {
		secret: envSecret,
		source: "env",
		status: "available"
	};
	const botSecretFile = normalizeOptionalString(merged.botSecretFile);
	if (botSecretFile) {
		const result = tryReadSecretFileSync(botSecretFile, "Nextcloud Talk bot secret file", { rejectSymlink: true }, { configPath: `channels.nextcloud-talk.accounts.${accountId}.botSecretFile` });
		return result.status === "available" ? {
			secret: result.value,
			source: "secretFile",
			status: "available"
		} : {
			secret: "",
			source: "secretFile",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (configuredSecret.status === "available") return {
		secret: configuredSecret.value,
		source: "config",
		status: "available"
	};
	return {
		secret: "",
		source: "none",
		status: "missing"
	};
}
function resolveNextcloudTalkAccount(params) {
	const baseEnabled = params.cfg.channels?.["nextcloud-talk"]?.enabled !== false;
	const resolvedAccountId = params.accountId ?? resolveDefaultNextcloudTalkAccountId(params.cfg);
	const resolve = (accountId) => {
		const merged = mergeNextcloudTalkAccountConfig(params.cfg, accountId);
		const accountEnabled = merged.enabled !== false;
		const enabled = baseEnabled && accountEnabled;
		const secretResolution = resolveNextcloudTalkSecret(accountId, merged);
		const baseUrl = merged.baseUrl?.trim()?.replace(/\/$/, "") ?? "";
		debugAccounts("resolve", {
			accountId,
			enabled,
			secretSource: secretResolution.source,
			baseUrl: baseUrl ? "[set]" : "[missing]"
		});
		return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			baseUrl,
			secret: secretResolution.secret,
			secretSource: secretResolution.source,
			tokenStatus: secretResolution.status,
			...secretResolution.diagnostic ? { credentialDiagnostics: [secretResolution.diagnostic] } : {},
			config: merged
		};
	};
	return resolveAccountWithDefaultFallback({
		accountId: resolvedAccountId,
		normalizeAccountId,
		resolvePrimary: resolve,
		hasCredential: (account) => account.tokenStatus !== "missing",
		resolveDefaultAccountId: () => resolveDefaultNextcloudTalkAccountId(params.cfg)
	});
}
function inspectNextcloudTalkAccount(params) {
	const account = resolveNextcloudTalkAccount(params);
	const apiCredentialResolution = resolveNextcloudTalkApiCredentialsResult({
		apiUser: account.config.apiUser,
		apiPassword: account.config.apiPassword,
		apiPasswordFile: account.config.apiPasswordFile,
		configPath: `channels.nextcloud-talk.accounts.${account.accountId}.apiPasswordFile`,
		mode: "inspect"
	});
	const credentialDiagnostics = [...account.credentialDiagnostics ?? [], ...apiCredentialResolution.status === "configured_unavailable" && apiCredentialResolution.diagnostic ? [apiCredentialResolution.diagnostic] : []];
	return {
		...account,
		configured: isNextcloudTalkAccountConfigured(account),
		mode: "webhook",
		apiCredentialStatus: apiCredentialResolution.status,
		...credentialDiagnostics.length > 0 ? { credentialDiagnostics } : {}
	};
}
function isNextcloudTalkAccountConfigured(account) {
	return Boolean(account.tokenStatus !== "missing" && account.baseUrl?.trim());
}
//#endregion
//#region extensions/nextcloud-talk/src/approval-auth.ts
function normalizeNextcloudTalkApproverId(value) {
	return normalizeOptionalLowercaseString(String(value).trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, ""));
}
const nextcloudTalkApprovalAuth = createChannelApprovalAuth({
	channelLabel: "Nextcloud Talk",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveNextcloudTalkAccount({
			cfg,
			accountId
		}).config.allowFrom };
	},
	normalizeApprover: normalizeNextcloudTalkApproverId
}).approvalAuth;
//#endregion
//#region extensions/nextcloud-talk/src/guarded-response.ts
async function readNextcloudTalkErrorBody(response, ...credentials) {
	try {
		let body = await readProviderTextResponse(response, "Nextcloud Talk error", {
			maxBytes: 8192,
			chunkTimeoutMs: 1e4
		});
		for (const credential of credentials) body = body.replaceAll(credential, "***");
		return redactToolPayloadText(body);
	} catch {
		return "";
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/signature.ts
const SIGNATURE_HEADER = "x-nextcloud-talk-signature";
const RANDOM_HEADER = "x-nextcloud-talk-random";
const BACKEND_HEADER = "x-nextcloud-talk-backend";
/**
* Verify the HMAC-SHA256 signature of an incoming webhook request.
* Signature is calculated as: HMAC-SHA256(random + body, secret)
*/
function verifyNextcloudTalkSignature(params) {
	const { signature, random, body, secret } = params;
	if (!signature || !random || !secret) return false;
	const expected = createHmac("sha256", secret).update(random + body).digest("hex");
	return safeEqualSecret(signature, expected);
}
function extractNextcloudTalkHeaders(headers) {
	const getHeader = (name) => {
		const value = headers[name];
		return Array.isArray(value) ? value[0] : value;
	};
	const signature = getHeader(SIGNATURE_HEADER);
	const random = getHeader(RANDOM_HEADER);
	const backend = getHeader(BACKEND_HEADER);
	if (!signature || !random || !backend) return null;
	return {
		signature,
		random,
		backend
	};
}
/**
* Generate signature headers for an outbound request to Nextcloud Talk.
*/
function generateNextcloudTalkSignature(params) {
	const { body, secret } = params;
	const random = randomBytes(32).toString("hex");
	return {
		random,
		signature: createHmac("sha256", secret).update(random + body).digest("hex")
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/bot-preflight.ts
const BOT_FEATURE_RESPONSE = 2;
function normalizeUrlForMatch(value) {
	if (!value?.trim()) return "";
	try {
		const url = new URL(value.trim());
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return value.trim().replace(/\/$/, "");
	}
}
function formatMissingResponseFeatureMessage(bot, features) {
	const id = bot.id == null ? "unknown" : String(bot.id);
	return `Nextcloud Talk bot "${bot.name?.trim() || "matching bot"}" (${id}) is missing the response feature${typeof features === "number" ? ` (features=${features})` : ""}; outbound replies will fail. Run ./occ talk:bot:state --feature webhook --feature response --feature reaction ${id} 1 or reinstall the bot with --feature response.`;
}
async function probeNextcloudTalkBotResponseFeature(params) {
	const { account, timeoutMs } = params;
	const baseUrl = account.baseUrl?.trim();
	if (!baseUrl) return {
		ok: true,
		skipped: true,
		code: "missing_base_url",
		message: "Nextcloud Talk bot response feature probe skipped: baseUrl is not configured."
	};
	const webhookUrl = normalizeUrlForMatch(account.config.webhookPublicUrl);
	if (!webhookUrl) return {
		ok: true,
		skipped: true,
		code: "missing_webhook_url",
		message: "Nextcloud Talk bot response feature probe skipped: webhookPublicUrl is not configured."
	};
	const credentials = resolveNextcloudTalkApiCredentials({
		apiUser: account.config.apiUser,
		apiPassword: account.config.apiPassword,
		apiPasswordFile: account.config.apiPasswordFile
	});
	if (!credentials) return {
		ok: true,
		skipped: true,
		code: "missing_api_credentials",
		message: "Nextcloud Talk bot response feature probe skipped: apiUser/apiPassword are not configured."
	};
	const url = `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/admin`;
	const auth = Buffer.from(`${credentials.apiUser}:${credentials.apiPassword}`, "utf-8").toString("base64");
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url,
			init: {
				method: "GET",
				headers: {
					Authorization: `Basic ${auth}`,
					"OCS-APIRequest": "true",
					Accept: "application/json"
				}
			},
			auditContext: "nextcloud-talk.bot-response-preflight",
			policy: ssrfPolicyFromPrivateNetworkOptIn$1(account.config),
			timeoutMs
		});
		try {
			if (!response.ok) {
				const body = await readNextcloudTalkErrorBody(response, auth, credentials.apiPassword);
				return {
					ok: false,
					code: "api_error",
					status: response.status,
					message: `Nextcloud Talk bot response feature probe failed (${response.status})${body ? `: ${body}` : ""}`
				};
			}
			const payload = await readProviderJsonResponse(response, "Nextcloud Talk bot response feature probe failed");
			const bot = (Array.isArray(payload.ocs?.data) ? payload.ocs.data : []).find((entry) => normalizeUrlForMatch(entry.url) === webhookUrl);
			if (!bot) return {
				ok: false,
				code: "bot_not_found",
				message: `Nextcloud Talk bot response feature probe could not find a bot with webhook URL ${webhookUrl}.`
			};
			const features = parseStrictNonNegativeInteger(bot.features);
			if (features == null || (features & BOT_FEATURE_RESPONSE) !== BOT_FEATURE_RESPONSE) return {
				ok: false,
				code: "missing_response_feature",
				botId: bot.id == null ? void 0 : String(bot.id),
				botName: bot.name,
				features,
				message: formatMissingResponseFeatureMessage(bot, features)
			};
			return {
				ok: true,
				code: "ok",
				botId: bot.id == null ? void 0 : String(bot.id),
				botName: bot.name,
				features,
				message: `Nextcloud Talk bot "${bot.name ?? bot.id ?? "matching bot"}" has the response feature.`
			};
		} finally {
			await release();
		}
	} catch (error) {
		return {
			ok: false,
			code: "request_failed",
			message: `Nextcloud Talk bot response feature probe failed: ${error instanceof Error ? error.message : formatErrorMessage(error)}`
		};
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/channel.adapters.ts
const nextcloudTalkConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "nextcloud-talk",
	listAccountIds: listNextcloudTalkAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveNextcloudTalkAccount),
	inspectAccount: (cfg, accountId) => {
		const account = inspectNextcloudTalkAccount({
			cfg,
			accountId
		});
		return {
			...account,
			baseUrl: account.baseUrl ? "[set]" : "[missing]"
		};
	},
	defaultAccountId: resolveDefaultNextcloudTalkAccountId,
	clearBaseFields: [
		"botSecret",
		"botSecretFile",
		"baseUrl",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(nextcloud-talk|nc-talk|nc):/i
	})
});
const nextcloudTalkSecurityAdapter = { resolveDmPolicy: createScopedDmSecurityResolver({
	channelKey: "nextcloud-talk",
	resolvePolicy: (account) => account.config.dmPolicy,
	resolveAllowFrom: (account) => account.config.allowFrom,
	policyPathSuffix: "dmPolicy",
	normalizeEntry: (raw) => normalizeLowercaseStringOrEmpty(raw.trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, ""))
}) };
const nextcloudTalkPairingTextAdapter = {
	idLabel: "nextcloudUserId",
	message: "OpenClaw: your access has been approved.",
	normalizeAllowEntry: createPairingPrefixStripper(/^(nextcloud-talk|nc-talk|nc):/i, (entry) => normalizeLowercaseStringOrEmpty(entry))
};
//#endregion
//#region extensions/nextcloud-talk/src/config-schema.ts
const NextcloudTalkRoomSchema = buildGroupEntrySchema({ allowFrom: z.array(z.string()).optional() }).omit({ toolsBySender: true });
const NextcloudTalkNetworkSchema = z.object({ 
/** Dangerous opt-in for self-hosted Nextcloud Talk on trusted private/internal hosts. */
dangerouslyAllowPrivateNetwork: z.boolean().optional() }).strict().optional();
const NextcloudTalkAccountSchemaBase = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	replyToMode: ReplyToModeSchema.optional(),
	markdown: MarkdownConfigSchema,
	baseUrl: z.string().optional(),
	botSecret: buildSecretInputSchema().optional(),
	botSecretFile: z.string().optional(),
	apiUser: z.string().optional(),
	apiPassword: buildSecretInputSchema().optional(),
	apiPasswordFile: z.string().optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	legacyWebhook: z.union([z.literal(false), z.object({
		port: z.number().int().min(1).max(65535),
		host: z.string().optional()
	}).strict()]).optional(),
	webhookPath: z.string().optional(),
	webhookPublicUrl: z.string().optional(),
	allowFrom: z.array(z.string()).optional(),
	groupAllowFrom: z.array(z.string()).optional(),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	rooms: z.record(z.string(), NextcloudTalkRoomSchema.optional()).optional(),
	/** Network policy overrides for self-hosted Nextcloud Talk on trusted private/internal hosts. */
	network: NextcloudTalkNetworkSchema,
	...ReplyRuntimeConfigSchemaShape
}).strict();
const NextcloudTalkConfigSchema = buildMultiAccountChannelSchema(NextcloudTalkAccountSchemaBase, {
	optionalAccount: true,
	refine: (value, ctx) => {
		requireChannelOpenAllowFrom({
			channel: "nextcloud-talk",
			policy: value.dmPolicy,
			allowFrom: value.allowFrom,
			ctx,
			requireOpenAllowFrom
		});
	}
});
//#endregion
//#region src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString$1(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString$1(value) {
	return normalizeOptionalString$1(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty$1(value) {
	return normalizeOptionalLowercaseString$1(value) ?? "";
}
//#endregion
//#region src/plugins/http-path-prefix.ts
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
//#endregion
//#region src/gateway/security-path.ts
const MAX_PATH_DECODE_PASSES = 32;
function normalizePathSeparators(pathname) {
	const collapsed = pathname.replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed;
	return collapsed.replace(/\/+$/, "");
}
function resolveDotSegments(pathname) {
	try {
		return new URL(pathname, "http://localhost").pathname;
	} catch {
		return pathname;
	}
}
function normalizePathForSecurity(pathname) {
	return normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(resolveDotSegments(pathname))) || "/";
}
function buildCanonicalPathCandidates(pathname, maxDecodePasses = MAX_PATH_DECODE_PASSES) {
	const candidates = /* @__PURE__ */ new Set([normalizePathForSecurity(pathname)]);
	let decoded = pathname;
	let malformedEncoding = false;
	let decodePasses = 0;
	for (let pass = 0; pass < maxDecodePasses; pass++) {
		let nextDecoded;
		try {
			nextDecoded = decodeURIComponent(decoded);
		} catch {
			malformedEncoding = true;
			break;
		}
		if (nextDecoded === decoded) break;
		decodePasses += 1;
		decoded = nextDecoded;
		candidates.add(normalizePathForSecurity(decoded));
	}
	let decodePassLimitReached = false;
	if (!malformedEncoding) try {
		decodePassLimitReached = decodeURIComponent(decoded) !== decoded;
	} catch {
		malformedEncoding = true;
	}
	return {
		candidates: [...candidates],
		decodePasses,
		decodePassLimitReached,
		malformedEncoding
	};
}
function canonicalizePathForSecurity(pathname) {
	const { candidates, decodePasses, decodePassLimitReached, malformedEncoding } = buildCanonicalPathCandidates(pathname);
	return {
		canonicalPath: candidates[candidates.length - 1] ?? "/",
		candidates,
		decodePasses,
		decodePassLimitReached,
		malformedEncoding,
		rawNormalizedPath: normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(pathname)) || "/"
	};
}
const PROTECTED_PLUGIN_ROUTE_PREFIXES = ["/api/channels"];
//#endregion
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty$1(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/gateway-config-runtime
var gateway_config_runtime_exports = /* @__PURE__ */ __exportAll({
	classifyGatewayProbePath: () => classifyGatewayProbePath,
	isProtectedPluginRoutePathFromContext: () => isProtectedPluginRoutePathFromContext,
	resolvePluginRoutePathContext: () => resolvePluginRoutePathContext
});
import * as import_openclaw_plugin_sdk_gateway_config_runtime from "openclaw/plugin-sdk/gateway-config-runtime";
__reExport(gateway_config_runtime_exports, import_openclaw_plugin_sdk_gateway_config_runtime);
//#endregion
//#region extensions/nextcloud-talk/src/webhook-route.ts
const DEFAULT_NEXTCLOUD_TALK_WEBHOOK_PATH = "/nextcloud-talk-webhook";
function resolveNextcloudTalkLegacyWebhook(config) {
	const listener = config.legacyWebhook;
	return listener ? {
		port: listener.port,
		host: listener.host ?? "0.0.0.0"
	} : void 0;
}
function describeNextcloudTalkWebhookRouteConflict(path, gatewayPort) {
	const pathname = URL.parse(path, "http://localhost")?.pathname ?? path;
	const probe = classifyGatewayProbePath(pathname);
	const reason = probe !== "outside" && probe !== "namespace" ? "is reserved for Gateway probes" : isProtectedPluginRoutePathFromContext(resolvePluginRoutePathContext(pathname)) ? "requires Gateway authentication" : void 0;
	if (!reason) return;
	return `Webhook path "${path}" ${reason} and cannot receive Nextcloud callbacks on the Gateway port. Set webhookPath to "${DEFAULT_NEXTCLOUD_TALK_WEBHOOK_PATH}" and update the Nextcloud bot callback and reverse-proxy upstream to Gateway port ${gatewayPort}${DEFAULT_NEXTCLOUD_TALK_WEBHOOK_PATH}.`;
}
//#endregion
//#region extensions/nextcloud-talk/src/doctor.ts
function sanitizeLegacyReplaySegment(value) {
	const trimmed = value.trim();
	if (!trimmed) return "default";
	return trimmed.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function runNextcloudTalkDoctorSequence(params) {
	const infoNotes = [];
	const warningNotes = [];
	for (const accountId of listNextcloudTalkAccountIds(params.cfg)) {
		const account = resolveNextcloudTalkAccount({
			cfg: params.cfg,
			accountId
		});
		if (!account.enabled || !isNextcloudTalkAccountConfigured(account)) continue;
		const gatewayPort = (0, gateway_config_runtime_exports.resolveGatewayPort)({ gateway: params.cfg.gateway }, params.env);
		const webhookPath = account.config.webhookPath ?? "/nextcloud-talk-webhook";
		const destination = `Gateway port ${gatewayPort}${webhookPath}`;
		const legacyListener = resolveNextcloudTalkLegacyWebhook(account.config);
		const routeConflict = describeNextcloudTalkWebhookRouteConflict(webhookPath, gatewayPort);
		if (routeConflict) warningNotes.push(`- channels.nextcloud-talk.${account.accountId}: ${routeConflict}` + (legacyListener ? ` Legacy webhook listener ${legacyListener.host}:${legacyListener.port} remains available; verify the new route before removing the legacyWebhook pin.` : " This account cannot start until the callback path is changed."));
		else if (legacyListener) infoNotes.push(`- channels.nextcloud-talk.${account.accountId}: legacy webhook listener ${legacyListener.host}:${legacyListener.port} forwards to the Gateway route. Point the Nextcloud callback or reverse-proxy upstream to ${destination}, verify delivery, then remove the legacyWebhook pin; use legacyWebhook: false to override an inherited endpoint.`);
		else infoNotes.push(`- channels.nextcloud-talk.${account.accountId}: no legacy listener is configured; use ${destination} for the Nextcloud callback or reverse-proxy upstream.`);
	}
	return {
		changeNotes: [],
		warningNotes,
		infoNotes
	};
}
async function collectNextcloudTalkBotResponseWarnings(params) {
	const warnings = [];
	for (const accountId of listNextcloudTalkAccountIds(params.cfg)) {
		const account = resolveNextcloudTalkAccount({
			cfg: params.cfg,
			accountId
		});
		if (!account.enabled || !account.secret || !account.baseUrl) continue;
		const result = await probeNextcloudTalkBotResponseFeature({
			account,
			timeoutMs: 5e3
		});
		if (!result.ok) warnings.push(`- channels.nextcloud-talk.${account.accountId}: ${result.message}`);
	}
	return warnings;
}
const nextcloudTalkDoctor = {
	legacyConfigRules,
	normalizeCompatibilityConfig,
	runConfigSequence: runNextcloudTalkDoctorSequence,
	collectPreviewWarnings: collectNextcloudTalkBotResponseWarnings,
	repairConfig: ({ cfg, doctorFixCommand, env = process.env }) => {
		const replayDir = path.join(resolveStateDir(env, os.homedir), "nextcloud-talk", "replay-dedupe");
		for (const accountId of listNextcloudTalkAccountIds(cfg)) {
			const legacyPath = path.join(replayDir, `${sanitizeLegacyReplaySegment(accountId)}.json`);
			if (fileExists(legacyPath)) throw new Error(`Retired pre-July Nextcloud Talk replay state at ${legacyPath} was left unchanged. Install OpenClaw 2026.9.5, run "${doctorFixCommand}", then upgrade to latest. See https://docs.openclaw.ai/install/updating#upgrading-very-old-versions.`);
		}
		return {
			config: cfg,
			changes: []
		};
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/policy.ts
function normalizeNextcloudTalkAllowEntry(raw) {
	return raw.trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, "").toLowerCase();
}
function normalizeNextcloudTalkAllowlist(values) {
	return (values ?? []).map((value) => normalizeNextcloudTalkAllowEntry(String(value))).filter(Boolean);
}
function resolveNextcloudTalkAllowlistMatch(params) {
	const allowFrom = normalizeNextcloudTalkAllowlist(params.allowFrom);
	const senderId = normalizeNextcloudTalkAllowEntry(params.senderId);
	return resolveAllowlistMatchByCandidates({
		allowList: allowFrom,
		candidates: [{
			value: senderId,
			source: "id"
		}]
	});
}
function resolveNextcloudTalkRoomMatch(params) {
	const rooms = params.rooms ?? {};
	const allowlistConfigured = Object.keys(rooms).length > 0;
	const match = resolveChannelEntryMatchWithFallback({
		entries: rooms,
		keys: buildChannelKeyCandidates(params.roomToken),
		wildcardKey: "*",
		normalizeKey: normalizeChannelSlug
	});
	const roomConfig = match.entry;
	const allowed = !allowlistConfigured || Boolean(roomConfig);
	return {
		roomConfig,
		wildcardConfig: match.wildcardEntry,
		roomKey: match.matchKey ?? match.key,
		matchSource: match.matchSource,
		allowed,
		allowlistConfigured
	};
}
function resolveNextcloudTalkGroupToolPolicy(params) {
	const roomToken = params.groupId?.trim();
	if (!roomToken) return;
	const { tree, toolsPath } = buildNextcloudTalkRoomScope(resolveNextcloudTalkAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.rooms, roomToken);
	return resolveScopeToolsPolicy({
		tree,
		path: toolsPath
	});
}
function buildNextcloudTalkRoomScope(rooms, roomToken) {
	const { "*": defaults, ...scopes } = rooms ?? {};
	const tree = {
		defaults,
		scopes
	};
	const exactPath = Object.hasOwn(scopes, roomToken) ? [roomToken] : [];
	const toolsMatch = resolveChannelEntryMatchWithFallback({
		entries: scopes,
		keys: buildChannelKeyCandidates(roomToken),
		normalizeKey: normalizeChannelSlug
	});
	return {
		tree,
		exactPath,
		toolsPath: toolsMatch.matchKey ? [toolsMatch.matchKey] : []
	};
}
function resolveNextcloudTalkGroupRequireMention(params) {
	if (!params.groupId) return true;
	const { tree, exactPath } = buildNextcloudTalkRoomScope(resolveNextcloudTalkAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.rooms, params.groupId);
	return resolveScopeRequireMention({
		tree,
		path: exactPath
	});
}
//#endregion
//#region extensions/nextcloud-talk/src/room-info.ts
const ROOM_CACHE_TTL_MS = 3e5;
const ROOM_CACHE_ERROR_TTL_MS = 3e4;
const ROOM_CACHE_MAX_ENTRIES = 1e3;
const NEXTCLOUD_TALK_ROOM_INFO_TIMEOUT_MS = 3e4;
const roomCache = /* @__PURE__ */ new Map();
function cacheRoomInfo(key, kind, ttlMs) {
	roomCache.set(key, {
		kind,
		expiresAt: Date.now() + ttlMs
	});
	pruneMapToMaxSize(roomCache, ROOM_CACHE_MAX_ENTRIES);
	return kind;
}
function resolveRoomKindFromType(type) {
	if (!type) return;
	if (type === 1 || type === 5 || type === 6) return "direct";
	return "group";
}
async function resolveNextcloudTalkRoomKind(params) {
	const { account, roomToken, runtime } = params;
	const key = `${account.accountId}:${roomToken}`;
	const cached = roomCache.get(key);
	if (cached && Date.now() < cached.expiresAt) return cached.kind;
	roomCache.delete(key);
	const apiCredentials = resolveNextcloudTalkApiCredentials({
		apiUser: account.config.apiUser,
		apiPassword: account.config.apiPassword,
		apiPasswordFile: account.config.apiPasswordFile
	});
	const baseUrl = account.baseUrl?.trim();
	if (!apiCredentials || !baseUrl) return;
	const fallback = (error) => {
		runtime?.error?.(`nextcloud-talk: room lookup error: ${String(error)}`);
		return cacheRoomInfo(key, void 0, ROOM_CACHE_ERROR_TTL_MS);
	};
	const parsedBaseUrl = URL.parse(baseUrl);
	if (!parsedBaseUrl || !["http:", "https:"].includes(parsedBaseUrl.protocol)) return fallback(/* @__PURE__ */ new Error("Nextcloud Talk room lookup requires an HTTP(S) base URL"));
	const auth = Buffer.from(`${apiCredentials.apiUser}:${apiCredentials.apiPassword}`, "utf-8").toString("base64");
	let guarded;
	try {
		guarded = await fetchWithSsrFGuard({
			url: `${baseUrl}/ocs/v2.php/apps/spreed/api/v4/room/${roomToken}`,
			init: {
				method: "GET",
				headers: {
					Authorization: `Basic ${auth}`,
					"OCS-APIRequest": "true",
					Accept: "application/json"
				}
			},
			auditContext: "nextcloud-talk.room-info",
			policy: ssrfPolicyFromPrivateNetworkOptIn(account.config),
			timeoutMs: params.timeoutMs ?? NEXTCLOUD_TALK_ROOM_INFO_TIMEOUT_MS
		});
	} catch (error) {
		if (error instanceof SsrFBlockedError) return fallback(error);
		throw error;
	}
	const { response, release } = guarded;
	try {
		if (!response.ok) {
			const status = response.status;
			if (status === 408 || status === 429 || status >= 500 && status <= 599) throw new Error(`Nextcloud Talk room lookup failed (${status})`);
			runtime?.log?.(`nextcloud-talk: room lookup failed (${status}) token=${roomToken}`);
			return cacheRoomInfo(key, void 0, ROOM_CACHE_ERROR_TTL_MS);
		}
		try {
			const payload = await readProviderJsonResponse(response, "Nextcloud Talk room info failed");
			const kind = resolveRoomKindFromType(parseStrictPositiveInteger(payload.ocs?.data?.type));
			return kind ? cacheRoomInfo(key, kind, ROOM_CACHE_TTL_MS) : void 0;
		} catch (error) {
			return fallback(error);
		}
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/normalize.ts
function stripNextcloudTalkTargetPrefix(raw) {
	return raw.trim().replace(/^(nextcloud-talk|nc-talk|nc):/i, "").trim().replace(/^room:/i, "").trim() || void 0;
}
function normalizeNextcloudTalkMessagingTarget(raw) {
	const normalized = stripNextcloudTalkTargetPrefix(raw);
	return normalized ? `nextcloud-talk:${normalized}`.toLowerCase() : void 0;
}
function looksLikeNextcloudTalkTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^(nextcloud-talk|nc-talk|nc|room):/i.test(trimmed)) return true;
	return /^[a-z0-9]{8,}$/i.test(trimmed);
}
//#endregion
//#region extensions/nextcloud-talk/src/send.ts
const NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS = 200;
const NEXTCLOUD_TALK_SEND_TIMEOUT_MS = 3e4;
/** Collapses and caps an already-redacted error body for display. */
function collapseErrorSnippet(text) {
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (collapsed.length > NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS) return `${truncateUtf16Safe(collapsed, NEXTCLOUD_TALK_ERROR_SNIPPET_MAX_CHARS)}…`;
	return collapsed;
}
function resolveNextcloudTalkSendContext(opts) {
	const cfg = requireRuntimeConfig(opts.cfg, "Nextcloud Talk send");
	const account = resolveNextcloudTalkAccount({
		cfg,
		accountId: opts.accountId
	});
	const baseUrl = opts.baseUrl?.trim() ?? account.baseUrl;
	const secret = opts.secret?.trim() ?? account.secret;
	if (!baseUrl) throw new Error(`Nextcloud Talk baseUrl missing for account "${account.accountId}" (set channels.nextcloud-talk.baseUrl).`);
	if (!secret) throw new Error(account.tokenStatus === "configured_unavailable" ? `Nextcloud Talk bot secret is configured but unavailable for account "${account.accountId}" (check the configured channels.nextcloud-talk.botSecret/botSecretFile).` : `Nextcloud Talk bot secret missing for account "${account.accountId}" (set channels.nextcloud-talk.botSecret/botSecretFile or NEXTCLOUD_TALK_BOT_SECRET for default).`);
	return {
		cfg,
		account,
		baseUrl,
		secret
	};
}
function normalizeRoomToken(to) {
	const normalized = stripNextcloudTalkTargetPrefix(to);
	if (!normalized) throw new Error("Room token is required for Nextcloud Talk sends");
	return normalized;
}
async function sendMessageNextcloudTalk(to, text, opts) {
	const { cfg, account, baseUrl, secret } = resolveNextcloudTalkSendContext(opts);
	const roomToken = normalizeRoomToken(to);
	if (!text?.trim()) throw new Error("Message must be non-empty for Nextcloud Talk sends");
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "nextcloud-talk",
		accountId: account.accountId
	});
	const message = convertMarkdownTables(text.trim(), tableMode);
	const body = { message };
	if (opts.replyTo) body.replyTo = opts.replyTo;
	const bodyStr = JSON.stringify(body);
	const { random, signature } = generateNextcloudTalkSignature({
		body: message,
		secret
	});
	const url = `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/${roomToken}/message`;
	await opts.onPlatformSendDispatch?.();
	const { response, release } = await fetchWithSsrFGuard({
		url,
		beforeRequest: opts.assertDirectAdapterHandoff,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"OCS-APIRequest": "true",
				"X-Nextcloud-Talk-Bot-Random": random,
				"X-Nextcloud-Talk-Bot-Signature": signature
			},
			body: bodyStr
		},
		auditContext: "nextcloud-talk-send",
		policy: ssrfPolicyFromPrivateNetworkOptIn$1(account.config),
		timeoutMs: opts.timeoutMs ?? NEXTCLOUD_TALK_SEND_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			const errorBody = collapseErrorSnippet(await readNextcloudTalkErrorBody(response, signature));
			const status = response.status;
			let errorMsg = `Nextcloud Talk send failed (${status})`;
			if (status === 400) errorMsg = `Nextcloud Talk: bad request - ${errorBody || "invalid message format"}`;
			else if (status === 401) errorMsg = "Nextcloud Talk: bot send was rejected - check the bot secret and ensure the bot was installed with --feature response";
			else if (status === 403) errorMsg = "Nextcloud Talk: forbidden - bot may not have permission in this room";
			else if (status === 404) errorMsg = `Nextcloud Talk: room not found (token=${roomToken})`;
			else if (errorBody) errorMsg = `Nextcloud Talk send failed: ${errorBody}`;
			throw new Error(errorMsg);
		}
		let messageId = "unknown";
		let timestamp;
		try {
			const data = await readProviderJsonResponse(response, "Nextcloud Talk send");
			if (data.ocs?.data?.id != null) messageId = String(data.ocs.data.id);
			if (typeof data.ocs?.data?.timestamp === "number") timestamp = data.ocs.data.timestamp;
		} catch {}
		if (opts.verbose) console.log(`[nextcloud-talk] Sent message ${messageId} to room ${roomToken}`);
		getOptionalNextcloudTalkRuntime()?.channel.activity.record({
			channel: "nextcloud-talk",
			accountId: account.accountId,
			direction: "outbound"
		});
		const receiptMessageId = messageId.trim();
		return {
			messageId,
			roomToken,
			receipt: createMessageReceiptFromOutboundResults({
				results: receiptMessageId && receiptMessageId !== "unknown" ? [{
					channel: "nextcloud-talk",
					messageId: receiptMessageId,
					conversationId: roomToken
				}] : [],
				kind: "text",
				...opts.replyTo ? { replyToId: opts.replyTo } : {}
			}),
			timestamp
		};
	} finally {
		await release();
	}
}
async function sendReactionNextcloudTalk(roomToken, messageId, reaction, opts) {
	const { account, baseUrl, secret } = resolveNextcloudTalkSendContext(opts);
	const normalizedToken = normalizeRoomToken(roomToken);
	const body = JSON.stringify({ reaction });
	const { random, signature } = generateNextcloudTalkSignature({
		body: reaction,
		secret
	});
	const url = `${baseUrl}/ocs/v2.php/apps/spreed/api/v1/bot/${normalizedToken}/reaction/${messageId}`;
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"OCS-APIRequest": "true",
				"X-Nextcloud-Talk-Bot-Random": random,
				"X-Nextcloud-Talk-Bot-Signature": signature
			},
			body
		},
		auditContext: "nextcloud-talk-reaction",
		policy: ssrfPolicyFromPrivateNetworkOptIn$1(account.config),
		timeoutMs: opts.timeoutMs ?? NEXTCLOUD_TALK_SEND_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			const errorBody = collapseErrorSnippet(await readNextcloudTalkErrorBody(response, signature));
			throw new Error(`Nextcloud Talk reaction failed: ${response.status} ${errorBody}`.trim());
		}
		return { ok: true };
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/inbound.ts
const CHANNEL_ID = "nextcloud-talk";
function hasAllowEntries(entries) {
	return normalizeNextcloudTalkAllowlist(entries).length > 0;
}
function roomRoutes(params) {
	if (!params.isGroup) return [];
	const roomSenderConfigured = params.groupPolicy === "allowlist" && hasAllowEntries(params.roomAllowFrom);
	return channelIngressRoutes(params.roomMatch.allowlistConfigured && {
		id: "nextcloud-talk:room",
		allowed: params.roomMatch.allowed,
		precedence: 0,
		matchId: "nextcloud-talk-room",
		blockReason: "room_not_allowlisted"
	}, params.roomConfig?.enabled === false && {
		id: "nextcloud-talk:room-enabled",
		enabled: false,
		precedence: 10,
		blockReason: "room_disabled"
	}, roomSenderConfigured && {
		id: "nextcloud-talk:room-sender",
		kind: "nestedAllowlist",
		precedence: 20,
		blockReason: "room_sender_not_allowlisted",
		...!hasAllowEntries(params.outerGroupAllowFrom) ? {
			senderPolicy: "replace",
			senderAllowFrom: params.roomAllowFrom
		} : {
			allowed: resolveNextcloudTalkAllowlistMatch({
				allowFrom: params.roomAllowFrom,
				senderId: params.senderId
			}).allowed,
			matchId: "nextcloud-talk-room-sender"
		}
	});
}
async function handleNextcloudTalkInbound(params) {
	const { message, account, config, runtime, statusSink } = params;
	const core = getNextcloudTalkRuntime();
	const pairing = createChannelPairingController({
		core,
		channel: CHANNEL_ID,
		accountId: account.accountId
	});
	const rawBody = message.text?.trim() ?? "";
	if (!rawBody) {
		logInboundDrop({
			log: (messageLocal) => runtime.log?.(messageLocal),
			channel: CHANNEL_ID,
			reason: `empty message body (mediaType=${message.mediaType})`,
			target: message.senderId
		});
		return;
	}
	const roomKind = await resolveNextcloudTalkRoomKind({
		account,
		roomToken: message.roomToken,
		runtime
	});
	const isGroup = roomKind === "direct" ? false : roomKind === "group" ? true : message.isGroupChat;
	const senderId = message.senderId;
	const senderName = message.senderName;
	const roomToken = message.roomToken;
	const roomName = message.roomName;
	statusSink?.({ lastInboundAt: message.timestamp });
	const roomMatch = resolveNextcloudTalkRoomMatch({
		rooms: account.config.rooms,
		roomToken
	});
	const roomConfig = roomMatch.roomConfig;
	const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
		cfg: config,
		surface: CHANNEL_ID
	});
	const structuredBody = rawBody.startsWith("{") ? safeParseJson(rawBody) : void 0;
	const structuredText = isRecord(structuredBody) && Object.hasOwn(structuredBody, "parameters") ? normalizeOptionalString(structuredBody.message) : void 0;
	const commandBody = structuredText?.startsWith("/") ? structuredText : rawBody;
	const hasControlCommand = core.channel.text.hasControlCommand(commandBody, config);
	const shouldRequireMention = isGroup ? resolveNextcloudTalkGroupRequireMention({
		cfg: config,
		accountId: account.accountId,
		groupId: roomToken
	}) : false;
	const { groupPolicy, providerMissingFallbackApplied } = resolveAllowlistProviderRuntimeGroupPolicy({
		providerConfigPresent: (config.channels?.[CHANNEL_ID] ?? void 0) !== void 0,
		groupPolicy: account.config.groupPolicy,
		defaultGroupPolicy: resolveDefaultGroupPolicy(config)
	});
	const allowFrom = normalizeStringEntries(account.config.allowFrom);
	const outerGroupAllowFrom = account.config.groupAllowFrom?.length ? normalizeStringEntries(account.config.groupAllowFrom) : allowFrom;
	const roomAllowFrom = normalizeStringEntries(roomConfig?.allowFrom);
	const resolveAccess = async (wasMentioned, contextBinding) => await core.channel.inbound.ingress.resolveStable({
		channelId: CHANNEL_ID,
		accountId: account.accountId,
		identity: {
			key: "nextcloud-talk-user-id",
			normalize: (value) => normalizeNextcloudTalkAllowEntry(value) || null,
			sensitivity: "pii",
			entryIdPrefix: "nextcloud-talk-entry"
		},
		cfg: config,
		readStoreAllowFrom: async () => await pairing.readStoreForDmPolicy(CHANNEL_ID, account.accountId),
		subject: { stableId: senderId },
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId
		},
		contextBinding,
		route: roomRoutes({
			isGroup,
			groupPolicy,
			roomMatch,
			roomConfig,
			senderId,
			outerGroupAllowFrom,
			roomAllowFrom
		}),
		dmPolicy: account.config.dmPolicy ?? "pairing",
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: true,
			activation: {
				requireMention: isGroup && shouldRequireMention,
				allowTextCommands
			}
		},
		mentionFacts: isGroup && wasMentioned !== void 0 ? {
			canDetectMention: true,
			wasMentioned,
			hasAnyMention: wasMentioned
		} : void 0,
		allowFrom,
		groupAllowFrom: account.config.groupAllowFrom,
		command: {
			allowTextCommands,
			hasControlCommand
		}
	});
	let access = await resolveAccess();
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied,
		providerKey: "nextcloud-talk",
		accountId: account.accountId,
		blockedLabel: GROUP_POLICY_BLOCKED_LABEL.room,
		log: (messageValue) => runtime.log?.(messageValue)
	});
	const commandAuthorized = access.commandAccess.authorized;
	const accessReason = access.ingress.reasonCode === "route_blocked" ? "route blocked" : access.senderAccess.reasonCode;
	if (isGroup) {
		if (access.routeAccess.reason === "room_not_allowlisted") {
			runtime.log?.(`nextcloud-talk: drop room ${roomToken} (not allowlisted)`);
			return;
		}
		if (access.routeAccess.reason === "room_disabled") {
			runtime.log?.(`nextcloud-talk: drop room ${roomToken} (disabled)`);
			return;
		}
		if (access.routeAccess.reason === "room_sender_not_allowlisted") {
			runtime.log?.(`nextcloud-talk: drop group sender ${senderId} (policy=${groupPolicy})`);
			return;
		}
		if (access.senderAccess.decision !== "allow") {
			runtime.log?.(`nextcloud-talk: drop group sender ${senderId} (reason=${accessReason})`);
			return;
		}
	} else if (access.senderAccess.decision !== "allow") {
		if (access.senderAccess.decision === "pairing") await pairing.issueChallenge({
			senderId,
			senderIdLine: `Your Nextcloud user id: ${senderId}`,
			meta: { name: senderName || void 0 },
			sendPairingReply: async (text) => {
				await sendMessageNextcloudTalk(roomToken, text, {
					cfg: config,
					accountId: account.accountId
				});
				statusSink?.({ lastOutboundAt: Date.now() });
			},
			onReplyError: (err) => {
				runtime.error?.(`nextcloud-talk: pairing reply failed for ${senderId}: ${String(err)}`);
			}
		});
		runtime.log?.(`nextcloud-talk: drop DM sender ${senderId} (reason=${accessReason})`);
		return;
	}
	if (access.commandAccess.shouldBlockControlCommand) {
		logInboundDrop({
			log: (messageLocal) => runtime.log?.(messageLocal),
			channel: CHANNEL_ID,
			reason: "control command (unauthorized)",
			target: senderId
		});
		return;
	}
	const mentionRegexes = core.channel.mentions.buildMentionRegexes(config);
	const wasMentioned = mentionRegexes.length ? core.channel.mentions.matchesMentionPatterns(rawBody, mentionRegexes) : false;
	const { route, buildEnvelope } = resolveChannelInboundRouteEnvelope({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		peer: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId
		}
	});
	access = await resolveAccess(isGroup ? wasMentioned : void 0, {
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		messageId: message.messageId,
		inboundEventKind: "user_request"
	});
	if (access.ingress.admission !== "dispatch") {
		runtime.log?.(isGroup && access.activationAccess.shouldSkip ? `nextcloud-talk: drop room ${roomToken} (no mention)` : `nextcloud-talk: drop ${isGroup ? "room" : "DM"} ${roomToken} (authorization changed)`);
		return;
	}
	const fromLabel = isGroup ? `room:${roomName || roomToken}` : senderName || `user:${senderId}`;
	const body = buildEnvelope({
		channel: "Nextcloud Talk",
		from: fromLabel,
		timestamp: message.timestamp,
		body: rawBody
	});
	const groupSystemPrompt = normalizeOptionalString(roomConfig?.systemPrompt);
	const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(account.config);
	const ctxPayload = core.channel.inbound.buildContext({
		channelIngress: access,
		channel: CHANNEL_ID,
		accountId: route.accountId,
		messageId: message.messageId,
		timestamp: message.timestamp,
		from: isGroup ? `nextcloud-talk:room:${roomToken}` : `nextcloud-talk:${senderId}`,
		sender: {
			id: senderId,
			name: senderName || void 0
		},
		conversation: {
			kind: isGroup ? "group" : "direct",
			id: isGroup ? roomToken : senderId,
			label: fromLabel
		},
		route: {
			agentId: route.agentId,
			dmScope: route.dmScope,
			accountId: route.accountId,
			routeSessionKey: route.sessionKey
		},
		reply: {
			to: `nextcloud-talk:${roomToken}`,
			originatingTo: `nextcloud-talk:${roomToken}`
		},
		message: {
			body,
			bodyForAgent: rawBody,
			rawBody,
			commandBody
		},
		access: {
			commands: { authorized: commandAuthorized },
			mentions: {
				canDetectMention: isGroup,
				wasMentioned: isGroup && wasMentioned
			}
		},
		extra: {
			GroupSubject: isGroup ? roomName || roomToken : void 0,
			GroupSystemPrompt: isGroup ? groupSystemPrompt : void 0
		}
	});
	await core.channel.inbound.dispatch({
		cfg: config,
		channel: CHANNEL_ID,
		accountId: account.accountId,
		route: {
			agentId: route.agentId,
			sessionKey: route.sessionKey
		},
		ctxPayload,
		delivery: {
			preparePayload: (payload) => payload.text === void 0 ? payload : {
				...payload,
				text: sanitizeAssistantVisibleText(payload.text)
			},
			deliver: async (payload) => {
				return { visibleReplySent: await deliverFormattedTextWithAttachments({
					payload,
					send: async ({ text, replyToId }) => {
						await sendMessageNextcloudTalk(roomToken, text, {
							cfg: config,
							accountId: account.accountId,
							replyTo: replyToId
						});
						statusSink?.({ lastOutboundAt: Date.now() });
					}
				}) };
			},
			onError: (err, info) => {
				runtime.error?.(`nextcloud-talk ${info.kind} reply failed: ${String(err)}`);
			}
		},
		replyPipeline: {},
		replyOptions: {
			...params.turnAdoptionLifecycle ? bindIngressLifecycleToReplyOptions(params.turnAdoptionLifecycle) : {},
			skillFilter: roomConfig?.skills,
			disableBlockStreaming: typeof blockStreamingEnabled === "boolean" ? !blockStreamingEnabled : void 0
		},
		record: { onRecordError: (err) => {
			runtime.error?.(`nextcloud-talk: failed updating session meta: ${String(err)}`);
		} }
	});
}
var NextcloudTalkWebhookPayloadError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "NextcloudTalkWebhookPayloadError";
	}
};
function parseRawObject(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook contains invalid JSON.", { cause: error });
	}
	if (!isRecord$1(parsed)) throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook must be a JSON object.");
	return parsed;
}
function requiredString(value, field) {
	if (typeof value === "string" && value.trim()) return value.trim();
	throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk webhook is missing ${field}.`);
}
function inspectNextcloudTalkWebhookEnvelope(rawEvent) {
	const envelope = parseRawObject(rawEvent);
	if (envelope.type !== "Create") return null;
	const object = isRecord$1(envelope.object) ? envelope.object : null;
	if (object?.type !== void 0 && object.type !== "Note") return null;
	if (!object) throw new NextcloudTalkWebhookPayloadError("Nextcloud Talk webhook is missing object.");
	const target = isRecord$1(envelope.target) ? envelope.target : null;
	return {
		eventId: requiredString(object.id, "object.id"),
		laneKey: `room:${requiredString(target?.id, "target.id")}`
	};
}
function parseLegacyReplayKey(key) {
	const separator = key.lastIndexOf(":");
	const roomId = key.slice(0, separator).trim();
	const messageId = key.slice(separator + 1).trim();
	return separator > 0 && roomId && messageId ? {
		messageId,
		roomId
	} : null;
}
/** Convert the shipped replay guard's live window into durable completion tombstones. */
async function migrateNextcloudTalkLegacyReplayState(params) {
	const entries = await params.store.entries();
	let migrated = 0;
	for (const entry of entries) {
		const identity = parseLegacyReplayKey(entry.value.key);
		if (!identity || !Number.isFinite(entry.value.seenAt)) continue;
		const marker = {
			version: 1,
			receivedAt: entry.value.seenAt,
			rawEvent: ""
		};
		const result = await params.queue.enqueue(identity.messageId, marker, {
			receivedAt: entry.value.seenAt,
			laneKey: `room:${identity.roomId}`
		});
		if (result.kind === "accepted" || result.kind === "pending" && result.record.payload.rawEvent === "") {
			if (!await params.queue.complete(identity.messageId, { completedAt: entry.value.seenAt })) throw new Error(`Failed to migrate Nextcloud Talk replay key ${entry.value.key}.`);
		}
		migrated += 1;
	}
	await params.store.clear();
	return migrated;
}
//#endregion
//#region extensions/nextcloud-talk/src/monitor.ts
const PREAUTH_WEBHOOK_MAX_BODY_BYTES = 65536;
const NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_HEADER = "x-openclaw-delivery-accepted";
const NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_VALUE = "durable";
const PREAUTH_WEBHOOK_BODY_TIMEOUT_MS = 5e3;
const PREAUTH_WEBHOOK_MAX_IN_FLIGHT = 64;
const WEBHOOK_IN_FLIGHT_KEY = "nextcloud-talk-webhook";
const WEBHOOK_AUTH_RATE_LIMIT_SCOPE = "nextcloud-talk-webhook-auth";
function writeWebhookError(res, status, error) {
	if (res.headersSent) return;
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error }));
}
async function rejectWebhookRequest(req, res, status, error) {
	if (res.headersSent) return;
	await sendHttpRequestRejection(req, res, status, JSON.stringify({ error }), "application/json");
}
function createWebhookGuards() {
	return {
		authRateLimiter: createAuthRateLimiter({
			maxAttempts: WEBHOOK_RATE_LIMIT_DEFAULTS.maxRequests,
			windowMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
			lockoutMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs,
			exemptLoopback: false,
			pruneIntervalMs: WEBHOOK_RATE_LIMIT_DEFAULTS.windowMs
		}),
		inFlightLimiter: createWebhookInFlightLimiter({
			maxInFlightPerKey: PREAUTH_WEBHOOK_MAX_IN_FLIGHT,
			maxTrackedKeys: 1
		})
	};
}
async function handleWebhookRequest(req, res, targetsByPath, path) {
	const legacyListener = getWebhookLegacyListener(req);
	const requestTargets = (targetsByPath.get(path) ?? []).filter((entry) => entry.rawPath === req.url && (!legacyListener || entry.legacyListener?.port === legacyListener.port && entry.legacyListener.host === legacyListener.host));
	if (req.method !== "POST" || requestTargets.length === 0) {
		res.writeHead(404);
		res.end();
		return;
	}
	const servingTargets = requestTargets.filter((entry) => !entry.stopping);
	const firstTarget = servingTargets[0];
	if (!firstTarget) {
		res.writeHead(503, { "Retry-After": "1" });
		res.end();
		return;
	}
	const responseOwners = /* @__PURE__ */ new Map();
	if (!res.destroyed && !res.writableFinished) {
		for (const entry of servingTargets) {
			const responseDone = createDeferred();
			entry.pendingResponses.add(responseDone.promise);
			responseOwners.set(entry, () => {
				entry.pendingResponses.delete(responseDone.promise);
				responseOwners.delete(entry);
				responseDone.resolve();
			});
		}
		const complete = () => {
			res.off("finish", complete);
			res.off("close", complete);
			for (const release of responseOwners.values()) release();
		};
		res.once("finish", complete);
		res.once("close", complete);
	}
	const guards = legacyListener ? firstTarget.legacyGuards : firstTarget.gatewayGuards;
	if (!guards) {
		res.writeHead(503, { "Retry-After": "1" });
		res.end();
		return;
	}
	const { authRateLimiter: webhookAuthRateLimiter, inFlightLimiter: webhookInFlightLimiter } = guards;
	const { onError, trustedProxies, allowRealIpFallback } = firstTarget;
	const clientIp = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback) ?? req.socket.remoteAddress ?? "unknown";
	if (!webhookAuthRateLimiter.check(clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE).allowed) {
		res.writeHead(429);
		res.end("Too Many Requests");
		return;
	}
	if (!webhookInFlightLimiter.tryAcquire(WEBHOOK_IN_FLIGHT_KEY)) {
		await sendHttpRequestRejection(req, res, 429, "Too Many Requests");
		return;
	}
	let body;
	let target;
	try {
		const headers = extractNextcloudTalkHeaders(req.headers);
		if (!headers) {
			writeWebhookError(res, 400, "Missing signature headers");
			return;
		}
		const targets = requestTargets.filter((entry) => !entry.isBackendAllowed || entry.isBackendAllowed(headers.backend));
		if (targets.length === 0) {
			writeWebhookError(res, 401, "Invalid backend");
			return;
		}
		body = await readRequestBodyWithLimit(req, {
			maxBytes: PREAUTH_WEBHOOK_MAX_BODY_BYTES,
			timeoutMs: PREAUTH_WEBHOOK_BODY_TIMEOUT_MS,
			destroyOnLimit: false
		});
		const matchesSignature = (entry) => verifyNextcloudTalkSignature({
			...headers,
			body,
			secret: entry.secret
		});
		const match = resolveSingleWebhookTarget(targets, (entry) => servingTargets.includes(entry) && matchesSignature(entry));
		if (match.kind === "none" && targets.some((entry) => !servingTargets.includes(entry) && matchesSignature(entry))) {
			res.writeHead(503, { "Retry-After": "1" });
			res.end();
			return;
		}
		if (match.kind !== "single") {
			webhookAuthRateLimiter.recordFailure(clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE);
			writeWebhookError(res, 401, "Invalid signature");
			return;
		}
		target = match.target;
		for (const [entry, release] of responseOwners) if (entry !== target) release();
		if (!targetsByPath.get(path)?.includes(target)) {
			res.writeHead(503, { "Retry-After": "1" });
			res.end();
			return;
		}
		webhookAuthRateLimiter.reset(clientIp, WEBHOOK_AUTH_RATE_LIMIT_SCOPE);
	} catch (err) {
		if (isRequestBodyLimitError(err, "PAYLOAD_TOO_LARGE")) {
			await rejectWebhookRequest(req, res, 413, "Payload too large");
			return;
		}
		if (isRequestBodyLimitError(err, "REQUEST_BODY_TIMEOUT")) {
			await rejectWebhookRequest(req, res, 408, requestBodyErrorToText("REQUEST_BODY_TIMEOUT"));
			return;
		}
		const error = err instanceof Error ? err : new Error(formatErrorMessage(err));
		onError?.(error);
		writeWebhookError(res, 500, "Internal server error");
		return;
	} finally {
		webhookInFlightLimiter.release(WEBHOOK_IN_FLIGHT_KEY);
	}
	try {
		if (await target.onWebhook(body) === "accepted") res.setHeader(NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_HEADER, NEXTCLOUD_TALK_WEBHOOK_ACCEPTED_VALUE);
		res.writeHead(200);
		res.end();
	} catch (err) {
		if (err instanceof NextcloudTalkWebhookPayloadError) {
			writeWebhookError(res, 400, "Invalid payload format");
			return;
		}
		const error = err instanceof Error ? err : new Error(formatErrorMessage(err));
		target.onError?.(error);
		writeWebhookError(res, 500, "Internal server error");
	}
}
const webhookState = createPluginRuntimeStore({
	key: "nextcloud-talk:webhook-routes",
	errorMessage: "Nextcloud Talk webhook routes are not registered"
});
function registerNextcloudTalkWebhook(target) {
	let targets = webhookState.tryGetRuntime();
	if (!targets) {
		targets = /* @__PURE__ */ new Map();
		webhookState.setRuntime(targets);
	}
	const path = canonicalizeWebhookRouteKey(target.path);
	const gatewayGuards = targets.get(path)?.[0]?.gatewayGuards ?? createWebhookGuards();
	const endpoint = target.legacyListener;
	const legacyGuards = endpoint ? [...targets.values()].flat().find((entry) => entry.legacyListener?.port === endpoint.port && entry.legacyListener.host === endpoint.host)?.legacyGuards ?? createWebhookGuards() : void 0;
	const registration = registerWebhookTarget(targets, {
		...target,
		path,
		rawPath: target.path,
		stopping: false,
		pendingResponses: /* @__PURE__ */ new Set(),
		gatewayGuards,
		legacyGuards
	});
	const removeTarget = () => {
		registration.unregister();
		const remaining = [...targets.values()].flat();
		for (const guards of [gatewayGuards, legacyGuards]) if (guards && !remaining.some((entry) => entry.gatewayGuards === guards || entry.legacyGuards === guards)) guards.authRateLimiter.dispose();
	};
	try {
		const unregister = registerPluginHttpRoute({
			path,
			auth: "plugin",
			pluginId: "nextcloud-talk",
			source: "webhook",
			accountId: target.accountId,
			handler: (req, res) => handleWebhookRequest(req, res, targets, path),
			legacyListener: target.legacyListener ? {
				...target.legacyListener,
				health: {
					path: "/healthz",
					contentType: "text/plain"
				}
			} : void 0,
			reuseExistingSameOwner: true,
			throwOnFailure: true
		});
		let stopPromise;
		return () => {
			if (stopPromise) return stopPromise;
			registration.target.stopping = true;
			const release = () => {
				removeTarget();
				unregister();
			};
			const pending = registration.target.pendingResponses;
			if (pending.size === 0) {
				release();
				stopPromise = Promise.resolve();
			} else stopPromise = Promise.all(pending).then(release);
			return stopPromise;
		};
	} catch (error) {
		removeTarget();
		throw error;
	}
}
//#endregion
//#region extensions/nextcloud-talk/src/webhook-spool.ts
const NEXTCLOUD_TALK_INGRESS_POLL_INTERVAL_MS = 500;
function describeIgnoredWebhookEvent(rawEvent) {
	const envelope = parseRawObject(rawEvent);
	const type = typeof envelope.type === "string" ? envelope.type : "unknown";
	const object = isRecord$1(envelope.object) ? envelope.object : null;
	return `type=${type} objectType=${typeof object?.type === "string" ? object.type : "unknown"}`;
}
const NextcloudTalkWebhookPayloadSchema = z.object({
	type: z.enum([
		"Create",
		"Update",
		"Delete"
	]),
	actor: z.object({
		type: z.literal("Person"),
		id: z.string().min(1),
		name: z.string()
	}),
	object: z.object({
		type: z.literal("Note"),
		id: z.string().min(1),
		name: z.string(),
		content: z.string(),
		mediaType: z.string()
	}),
	target: z.object({
		type: z.literal("Collection"),
		id: z.string().min(1),
		name: z.string()
	})
});
function parseClaimedMessage(payload, claimedId, claimedLaneKey) {
	if (payload.version !== 1) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} has an unsupported version.`);
	const result = NextcloudTalkWebhookPayloadSchema.safeParse(parseRawObject(payload.rawEvent));
	if (!result.success || result.data.type !== "Create" || result.data.object.id !== claimedId) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} has invalid message identity.`);
	const webhook = result.data;
	const roomId = requiredString(webhook.target.id, "target.id");
	if (claimedLaneKey !== `room:${roomId}`) throw new NextcloudTalkWebhookPayloadError(`Nextcloud Talk ingress row ${claimedId} changed room identity.`);
	return {
		messageId: webhook.object.id,
		roomToken: roomId,
		roomName: webhook.target.name,
		senderId: webhook.actor.id,
		senderName: webhook.actor.name,
		text: webhook.object.content || webhook.object.name,
		mediaType: webhook.object.mediaType || "text/plain",
		timestamp: payload.receivedAt,
		isGroupChat: true
	};
}
function resolveNonRetryableFailure(error) {
	if (error instanceof NextcloudTalkWebhookPayloadError) return {
		reason: "invalid-event",
		message: error.message
	};
	const message = formatErrorMessage(error);
	if (message.includes("Nextcloud Talk: bot send was rejected") || message.includes("Nextcloud Talk: forbidden")) return {
		reason: "nextcloud-talk-auth",
		message
	};
	return null;
}
function createNextcloudTalkWebhookSpool(options) {
	let queue = options.queue;
	const getQueue = () => {
		queue ??= getNextcloudTalkRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
		return queue;
	};
	const legacyReplayStore = options.legacyReplayStore === null ? null : options.legacyReplayStore ?? getNextcloudTalkRuntime().state.openKeyedStore({
		namespace: resolvePersistentDedupePluginStateNamespace({
			namespace: options.accountId,
			namespacePrefix: "replay-dedupe"
		}),
		maxEntries: 1e4,
		defaultTtlMs: 864e5
	});
	const legacyMigration = legacyReplayStore ? migrateNextcloudTalkLegacyReplayState({
		queue: getQueue(),
		store: legacyReplayStore
	}) : Promise.resolve();
	const monitor = createChannelIngressMonitor({
		queue: getQueue,
		inspect: (rawEvent) => inspectNextcloudTalkWebhookEnvelope(rawEvent),
		payload: {
			version: 1,
			serialize: (rawEvent, { receivedAt }) => ({
				receivedAt,
				rawEvent
			}),
			deserialize: (body) => body.rawEvent,
			encode: ({ body }) => ({
				version: 1,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: {
					receivedAt: payload.receivedAt,
					rawEvent: payload.rawEvent
				}
			}),
			createClaimError: (kind, claim) => new NextcloudTalkWebhookPayloadError(kind === "invalid-version" ? `Nextcloud Talk ingress row ${claim.id} has an unsupported version.` : `Nextcloud Talk ingress row ${claim.id} has invalid message identity.`)
		},
		deliver: async (_rawEvent, lifecycle, claim) => {
			const message = parseClaimedMessage(claim.payload, claim.id, claim.laneKey);
			await options.deliver(message, lifecycle);
		},
		pollIntervalMs: options.pollIntervalMs ?? NEXTCLOUD_TALK_INGRESS_POLL_INTERVAL_MS,
		retention: {
			completedMaxEntries: 1e4,
			failedMaxEntries: 1e4
		},
		drain: {
			startLimit: 32,
			resolveNonRetryableFailure,
			...options.adoptionStallTimeoutMs === void 0 ? {} : { adoptionStallTimeoutMs: options.adoptionStallTimeoutMs },
			onLog: (message) => options.runtime.log?.(`nextcloud-talk ${message}`)
		},
		...options.abortSignal ? { abortSignal: options.abortSignal } : {},
		createStoppedError: () => /* @__PURE__ */ new Error("Nextcloud Talk ingress stopped"),
		onError: (error) => options.runtime.error?.(`nextcloud-talk ingress drain failed: ${formatErrorMessage(error)}`)
	});
	let stopping = false;
	const inFlightReceives = /* @__PURE__ */ new Set();
	const startAfterMigration = legacyMigration.then(() => {
		if (!stopping) monitor.start();
	});
	return {
		ready: async () => await startAfterMigration,
		receive: (rawEvent) => {
			if (stopping) return Promise.reject(/* @__PURE__ */ new Error("Nextcloud Talk ingress stopped"));
			const receiveTask = (async () => {
				await startAfterMigration;
				if ((await monitor.admit(rawEvent)).kind === "ignored") {
					options.runtime.log?.(`nextcloud-talk: ignored non-message webhook event (${describeIgnoredWebhookEvent(rawEvent)})`);
					return "ignored";
				}
				return "accepted";
			})();
			inFlightReceives.add(receiveTask);
			receiveTask.then(() => inFlightReceives.delete(receiveTask), () => inFlightReceives.delete(receiveTask));
			return receiveTask;
		},
		stop: async () => {
			stopping = true;
			const pendingReceives = [...inFlightReceives];
			const pauseTask = monitor.pause();
			await startAfterMigration.catch(() => void 0);
			await Promise.allSettled(pendingReceives);
			await monitor.stop();
			await pauseTask;
		},
		waitForIdle: async () => {
			await startAfterMigration.catch(() => void 0);
			await monitor.waitForIdle();
		}
	};
}
//#endregion
//#region extensions/nextcloud-talk/src/monitor-runtime.ts
function normalizeOrigin(value) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(value).origin);
	} catch {
		return null;
	}
}
async function monitorNextcloudTalkProvider(opts) {
	const core = getNextcloudTalkRuntime();
	const cfg = opts.config ?? core.config.current();
	const account = resolveNextcloudTalkAccount({
		cfg,
		accountId: opts.accountId
	});
	const runtime = resolveLoggerBackedRuntime(opts.runtime, core.logging.getChildLogger());
	if (!account.secret) throw new Error(`Nextcloud Talk bot secret not configured for account "${account.accountId}"`);
	const path = account.config.webhookPath ?? "/nextcloud-talk-webhook";
	const gatewayPort = (0, gateway_config_runtime_exports.resolveGatewayPort)({ gateway: cfg.gateway });
	const legacyListener = resolveNextcloudTalkLegacyWebhook(account.config);
	const routeConflict = describeNextcloudTalkWebhookRouteConflict(path, gatewayPort);
	if (routeConflict && !legacyListener) throw new Error(`[nextcloud-talk:${account.accountId}] ${routeConflict}`);
	const logger = core.logging.getChildLogger({
		channel: "nextcloud-talk",
		accountId: account.accountId
	});
	const expectedBackendOrigin = normalizeOrigin(account.baseUrl);
	const spool = (opts.createSpool ?? createNextcloudTalkWebhookSpool)({
		accountId: account.accountId,
		runtime,
		abortSignal: opts.abortSignal,
		deliver: async (message, lifecycle) => {
			core.channel.activity.record({
				channel: "nextcloud-talk",
				accountId: account.accountId,
				direction: "inbound",
				at: message.timestamp
			});
			if (opts.onMessage) await opts.onMessage(message, lifecycle);
			else await handleNextcloudTalkInbound({
				message,
				account,
				config: cfg,
				runtime,
				statusSink: opts.statusSink,
				turnAdoptionLifecycle: lifecycle
			});
		}
	});
	let unregister;
	let stopPromise;
	const stop = () => {
		stopPromise ??= (async () => {
			await unregister?.();
			unregister = void 0;
			await spool.stop();
		})();
		return stopPromise;
	};
	if (opts.abortSignal && !opts.abortSignal.aborted) opts.abortSignal.addEventListener("abort", () => void stop(), { once: true });
	if (opts.abortSignal?.aborted) {
		await stop();
		return { stop };
	}
	try {
		await spool.ready();
		if (opts.abortSignal?.aborted) {
			await stop();
			return { stop };
		}
		unregister = registerNextcloudTalkWebhook({
			accountId: account.accountId,
			legacyListener,
			path,
			secret: account.secret,
			isBackendAllowed: (backend) => {
				if (!expectedBackendOrigin) return true;
				return normalizeOrigin(backend) === expectedBackendOrigin;
			},
			onWebhook: spool.receive,
			onError: (error) => {
				logger.error(`[nextcloud-talk:${account.accountId}] webhook error: ${error.message}`);
			},
			trustedProxies: cfg.gateway?.trustedProxies,
			allowRealIpFallback: cfg.gateway?.allowRealIpFallback
		});
	} catch (error) {
		await stop();
		throw error;
	}
	if (opts.abortSignal?.aborted) {
		await stop();
		return { stop };
	}
	opts.statusSink?.(channelReadyPatch());
	if (routeConflict && legacyListener) {
		logger.warn(`[nextcloud-talk:${account.accountId}] ${routeConflict} Legacy webhook listener ${legacyListener.host}:${legacyListener.port} remains available; verify the new route before removing the legacyWebhook pin.`);
		return { stop };
	}
	logger.info(`[nextcloud-talk:${account.accountId}] Gateway webhook route ready at port ${gatewayPort}${path}; point the Nextcloud bot callback or reverse-proxy upstream here.`);
	if (legacyListener) logger.info(`[nextcloud-talk:${account.accountId}] legacy webhook listener ${legacyListener.host}:${legacyListener.port} forwards to the Gateway route. After verifying the callback or proxy upstream uses the Gateway port, remove the legacyWebhook pin; use legacyWebhook: false to override an inherited endpoint.`);
	return { stop };
}
//#endregion
//#region extensions/nextcloud-talk/src/gateway.ts
const nextcloudTalkGatewayAdapter = {
	startAccount: async (ctx) => {
		const account = ctx.account;
		if (!account.secret || !account.baseUrl) throw new Error(`Nextcloud Talk not configured for account "${account.accountId}" (missing secret or baseUrl)`);
		ctx.log?.info(`[${account.accountId}] starting Nextcloud Talk Gateway webhook route`);
		const statusSink = createAccountStatusSink({
			accountId: ctx.accountId,
			setStatus: ctx.setStatus
		});
		await runPassiveAccountLifecycle({
			abortSignal: ctx.abortSignal,
			start: async () => await monitorNextcloudTalkProvider({
				accountId: account.accountId,
				config: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				statusSink
			}),
			stop: async (monitor) => {
				await monitor.stop();
			}
		});
	},
	logoutAccount: async ({ accountId, cfg }) => {
		const { nextConfig, changed, cleared } = clearAccountFieldsFromConfigSection({
			cfg,
			sectionKey: "nextcloud-talk",
			accountId,
			fields: ["botSecret"]
		});
		const loggedOut = resolveNextcloudTalkAccount({
			cfg: nextConfig,
			accountId
		}).secretSource === "none";
		if (changed) await getNextcloudTalkRuntime().config.replaceConfigFile({
			nextConfig,
			afterWrite: { mode: "auto" }
		});
		return {
			cleared,
			envSecret: Boolean(process.env.NEXTCLOUD_TALK_BOT_SECRET?.trim()),
			loggedOut
		};
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/message-actions.ts
const providerId = "nextcloud-talk";
function isAccountConfigured(account) {
	return Boolean(account.enabled && account.secret?.trim() && account.baseUrl?.trim());
}
function hasConfiguredAccount(cfg, accountId) {
	if (accountId) return isAccountConfigured(resolveNextcloudTalkAccount({
		cfg,
		accountId
	}));
	return listNextcloudTalkAccountIds(cfg).map((id) => resolveNextcloudTalkAccount({
		cfg,
		accountId: id
	})).some(isAccountConfigured);
}
const nextcloudTalkMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		if (!hasConfiguredAccount(cfg, accountId)) return null;
		return { actions: ["send", "react"] };
	},
	supportsAction: ({ action }) => action === "react",
	handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
		if (action === "send") throw new Error("Send should be handled by outbound, not actions handler.");
		if (action === "react") {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			if (!isAccountConfigured(account)) throw new Error(`Nextcloud Talk account "${account.accountId}" is disabled or not configured.`);
			const target = readStringParam(params, "to", {
				required: true,
				label: "to (room token)"
			});
			const messageIdRaw = resolveReactionMessageId({
				args: params,
				toolContext
			});
			if (messageIdRaw == null) throw new Error("messageId required");
			const messageId = String(messageIdRaw);
			const emoji = readStringParam(params, "emoji", { required: true });
			if (params.remove === true) throw new Error("Nextcloud Talk reaction removal is not supported yet; only adding reactions is implemented.");
			await sendReactionNextcloudTalk(target, messageId, emoji, {
				accountId: accountId ?? void 0,
				cfg
			});
			return jsonResult({
				ok: true,
				added: emoji
			});
		}
		throw new Error(`Action ${action} not supported for ${providerId}.`);
	}
};
//#endregion
//#region extensions/nextcloud-talk/src/message-adapter.ts
function sendNextcloudTalkMessage(ctx, text = ctx.text) {
	return sendMessageNextcloudTalk(ctx.to, text, {
		accountId: ctx.accountId ?? void 0,
		replyTo: ctx.replyToId ?? void 0,
		cfg: ctx.cfg,
		onPlatformSendDispatch: ctx.onPlatformSendDispatch,
		assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff
	});
}
const nextcloudTalkMessageAdapter = defineChannelMessageAdapter({
	id: "nextcloud-talk",
	durableFinal: { capabilities: {
		text: true,
		media: true,
		replyTo: true
	} },
	send: {
		text: sendNextcloudTalkMessage,
		media: (ctx) => sendNextcloudTalkMessage(ctx, ctx.mediaUrl ? `${ctx.text}\n\nAttachment: ${ctx.mediaUrl}` : ctx.text)
	}
});
//#endregion
//#region extensions/nextcloud-talk/src/session-route.ts
function resolveNextcloudTalkOutboundSessionRoute(params) {
	const roomId = stripNextcloudTalkTargetPrefix(params.target);
	if (!roomId) return null;
	return buildChannelOutboundSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "nextcloud-talk",
		accountId: params.accountId,
		recipientSessionExact: false,
		peer: {
			kind: "group",
			id: roomId
		},
		chatType: "group",
		from: `nextcloud-talk:room:${roomId}`,
		to: `nextcloud-talk:${roomId}`
	});
}
//#endregion
//#region extensions/nextcloud-talk/src/setup-core.ts
const t$1 = createSetupTranslator$1();
const channel$1 = "nextcloud-talk";
function normalizeNextcloudTalkBaseUrl(value) {
	return value?.trim().replace(/\/+$/, "") ?? "";
}
function validateNextcloudTalkBaseUrl(value) {
	if (!value) return "Required";
	if (!value.startsWith("http://") && !value.startsWith("https://")) return "URL must start with http:// or https://";
}
function setNextcloudTalkAccountConfig(cfg, accountId, updates, clearFields) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel$1,
		accountId,
		patch: updates,
		...clearFields ? { clearFields } : {}
	});
}
const promptNextcloudTalkAllowFrom = async (params) => await createPromptParsedAllowFromForAccount({
	defaultAccountId: resolveDefaultNextcloudTalkAccountId,
	noteTitle: t$1("wizard.nextcloudTalk.userIdTitle"),
	noteLines: [
		t$1("wizard.nextcloudTalk.userIdHelpAdmin"),
		t$1("wizard.nextcloudTalk.userIdHelpLogs"),
		t$1("wizard.nextcloudTalk.userIdHelpLowercase"),
		t$1("wizard.channels.docs", { link: formatDocsLink$1("/channels/nextcloud-talk", "nextcloud-talk") })
	],
	message: t$1("wizard.nextcloudTalk.allowFromPrompt"),
	placeholder: "username",
	parseEntries: (raw) => ({ entries: raw.split(/[\n,;]+/g).map(normalizeLowercaseStringOrEmpty).filter(Boolean) }),
	getExistingAllowFrom: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
		cfg,
		accountId
	}).config.allowFrom ?? [],
	mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing.map((value) => normalizeLowercaseStringOrEmpty(String(value))), parsed),
	applyAllowFrom: ({ cfg, accountId, allowFrom }) => setNextcloudTalkAccountConfig(cfg, accountId, {
		dmPolicy: "allowlist",
		allowFrom
	})
})(params);
const nextcloudTalkDmPolicy = createChannelDmPolicy({
	label: "Nextcloud Talk",
	channel: channel$1,
	resolveAccount: (cfg, accountId) => resolveNextcloudTalkAccount({
		cfg,
		accountId: accountId ?? resolveDefaultNextcloudTalkAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => setNextcloudTalkAccountConfig(cfg, account.accountId, patch),
	promptAllowFrom: promptNextcloudTalkAllowFrom
});
const nextcloudTalkSetupAdapter = {
	singleAccountKeysToMove: ["rooms"],
	resolveAccountId: ({ accountId }) => normalizeAccountId$1(accountId),
	prepareAccountConfigInput: ({ input }) => {
		const setupInput = input;
		return {
			...setupInput,
			baseUrl: setupInput.baseUrl ?? readNonEmptyStringPreservingWhitespace(setupInput.url),
			secret: setupInput.secret ?? readNonEmptyStringPreservingWhitespace(setupInput.token) ?? readNonEmptyStringPreservingWhitespace(setupInput.password),
			secretFile: setupInput.secretFile ?? readNonEmptyStringPreservingWhitespace(setupInput.tokenFile)
		};
	},
	applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "NEXTCLOUD_TALK_BOT_SECRET can only be used for the default account.",
		validate: ({ input }) => {
			const setupInput = input;
			if (!setupInput.useEnv && !setupInput.secret && !setupInput.secretFile) return "Nextcloud Talk requires bot secret or --secret-file (or --use-env).";
			const normalizedBaseUrl = normalizeNextcloudTalkBaseUrl(setupInput.baseUrl);
			if (!normalizedBaseUrl) return "Nextcloud Talk requires --base-url.";
			const baseUrlError = validateNextcloudTalkBaseUrl(normalizedBaseUrl);
			if (baseUrlError) return baseUrlError;
			return null;
		}
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		return setNextcloudTalkAccountConfig(applyAccountNameToChannelSection({
			cfg,
			channelKey: channel$1,
			accountId,
			name: setupInput.name
		}), accountId, {
			baseUrl: normalizeNextcloudTalkBaseUrl(setupInput.baseUrl),
			...setupInput.useEnv ? {} : setupInput.secretFile ? { botSecretFile: setupInput.secretFile } : setupInput.secret ? { botSecret: setupInput.secret } : {}
		}, setupInput.useEnv ? ["botSecret", "botSecretFile"] : void 0);
	}
};
const nextcloudTalkSetupContract = defineChannelSetupContract({
	fields: {
		baseUrl: {
			kind: "string",
			cli: {
				flags: "--base-url <url>",
				description: "Nextcloud base URL"
			}
		},
		url: {
			kind: "string",
			cli: {
				flags: "--url <url>",
				description: "Legacy Nextcloud base URL alias"
			}
		},
		secret: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--secret <secret>",
				description: "Nextcloud Talk bot secret"
			}
		},
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <secret>",
				description: "Legacy Nextcloud bot secret alias"
			}
		},
		password: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--password <secret>",
				description: "Legacy Nextcloud bot secret alias"
			}
		},
		secretFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--secret-file <path>",
				description: "Nextcloud Talk bot secret file"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Legacy Nextcloud bot secret file alias"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Nextcloud Talk environment credentials"
			},
			envVars: ["NEXTCLOUD_TALK_BOT_SECRET"]
		}
	},
	legacyAdapter: nextcloudTalkSetupAdapter
});
//#endregion
//#region extensions/nextcloud-talk/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "nextcloud-talk";
const CONFIGURE_API_FLAG = "__nextcloudTalkConfigureApiCredentials";
const nextcloudTalkSetupWizard = {
	channel,
	stepOrder: "text-first",
	status: createStandardChannelSetupStatus({
		channelLabel: "Nextcloud Talk",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusSelfHostedChat"),
		configuredScore: 1,
		unconfiguredScore: 5,
		resolveConfigured: ({ cfg, accountId }) => {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			return Boolean(account.secret && account.baseUrl);
		}
	}),
	introNote: {
		title: t("wizard.nextcloudTalk.setupTitle"),
		lines: [
			t("wizard.nextcloudTalk.helpSsh"),
			t("wizard.nextcloudTalk.helpInstallCommand"),
			t("wizard.nextcloudTalk.helpCopySecret"),
			t("wizard.nextcloudTalk.helpEnableRoom"),
			t("wizard.nextcloudTalk.helpEnvTip"),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/nextcloud-talk", "channels/nextcloud-talk") })
		],
		shouldShow: ({ cfg, accountId }) => {
			const account = resolveNextcloudTalkAccount({
				cfg,
				accountId
			});
			return !account.secret || !account.baseUrl;
		}
	},
	prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
		const resolvedAccount = resolveNextcloudTalkAccount({
			cfg,
			accountId
		});
		const hasApiCredentials = Boolean(resolvedAccount.config.apiUser?.trim() && (hasConfiguredSecretInput(resolvedAccount.config.apiPassword) || resolvedAccount.config.apiPasswordFile));
		if (!await prompter.confirm({
			message: t("wizard.nextcloudTalk.configureApiCredentials"),
			initialValue: hasApiCredentials
		})) return;
		return { credentialValues: {
			...credentialValues,
			[CONFIGURE_API_FLAG]: "1"
		} };
	},
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "botSecret",
		configuredFields: ["botSecret", "botSecretFile"],
		providerHint: channel,
		credentialLabel: t("wizard.nextcloudTalk.botSecret"),
		preferredEnvVar: "NEXTCLOUD_TALK_BOT_SECRET",
		envPrompt: t("wizard.nextcloudTalk.botSecretEnvPrompt"),
		keepPrompt: t("wizard.nextcloudTalk.botSecretKeep"),
		inputPrompt: t("wizard.nextcloudTalk.botSecretInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1,
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => Boolean(account.secret && account.baseUrl),
		hasConfiguredValue: (account) => Boolean(hasConfiguredSecretInput(account.config.botSecret) || account.config.botSecretFile),
		resolvedValue: (account) => account.secret || void 0,
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1 ? normalizeOptionalString(process.env.NEXTCLOUD_TALK_BOT_SECRET) : void 0,
		patchAccount: ({ cfg, accountId, patch, clearFields }) => setNextcloudTalkAccountConfig(cfg, accountId, patch, clearFields),
		useEnv: {
			clearFields: ["botSecret", "botSecretFile"],
			patch: (account) => ({ baseUrl: account.baseUrl })
		},
		set: { clearFields: ["botSecret", "botSecretFile"] }
	}), defineTokenCredential({
		inputKey: "password",
		configKey: "apiPassword",
		configuredFields: ["apiPassword", "apiPasswordFile"],
		providerHint: "nextcloud-talk-api",
		credentialLabel: t("wizard.nextcloudTalk.apiPassword"),
		preferredEnvVar: "NEXTCLOUD_TALK_API_PASSWORD",
		envPrompt: "",
		keepPrompt: t("wizard.nextcloudTalk.apiPasswordKeep"),
		inputPrompt: t("wizard.nextcloudTalk.apiPasswordInput"),
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => Boolean(account.config.apiUser?.trim() && (hasConfiguredSecretInput(account.config.apiPassword) || account.config.apiPasswordFile)),
		hasConfiguredValue: (account) => Boolean(hasConfiguredSecretInput(account.config.apiPassword) || account.config.apiPasswordFile),
		shouldPrompt: ({ credentialValues }) => credentialValues[CONFIGURE_API_FLAG] === "1",
		patchAccount: ({ cfg, accountId, patch, clearFields }) => setNextcloudTalkAccountConfig(cfg, accountId, patch, clearFields),
		set: { clearFields: ["apiPassword", "apiPasswordFile"] }
	})],
	textInputs: [baseUrlTextInput({
		inputKey: "httpUrl",
		configKey: "baseUrl",
		message: t("wizard.nextcloudTalk.instanceUrlPrompt"),
		resolveAccount: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}),
		currentValue: (account) => account.baseUrl || void 0,
		shouldPrompt: ({ currentValue }) => !currentValue,
		validate: validateNextcloudTalkBaseUrl,
		normalize: normalizeNextcloudTalkBaseUrl,
		patchAccount: ({ cfg, accountId, patch }) => setNextcloudTalkAccountConfig(cfg, accountId, patch)
	}), {
		inputKey: "userId",
		message: t("wizard.nextcloudTalk.apiUserPrompt"),
		currentValue: ({ cfg, accountId }) => resolveNextcloudTalkAccount({
			cfg,
			accountId
		}).config.apiUser?.trim() || void 0,
		shouldPrompt: ({ credentialValues }) => credentialValues[CONFIGURE_API_FLAG] === "1",
		validate: ({ value }) => value ? void 0 : t("common.required"),
		applySet: async (params) => setNextcloudTalkAccountConfig(params.cfg, params.accountId, { apiUser: params.value })
	}],
	dmPolicy: nextcloudTalkDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
//#region extensions/nextcloud-talk/src/channel.ts
const meta = {
	id: "nextcloud-talk",
	label: "Nextcloud Talk",
	selectionLabel: "Nextcloud Talk (self-hosted)",
	docsPath: "/channels/nextcloud-talk",
	docsLabel: "nextcloud-talk",
	blurb: "Self-hosted chat via Nextcloud Talk webhook bots.",
	aliases: ["nc-talk", "nc"],
	order: 65,
	quickstartAllowFrom: true
};
const collectNextcloudTalkSecurityWarnings = createAllowlistProviderRouteAllowlistWarningCollector({
	providerConfigPresent: (cfg) => cfg.channels?.["nextcloud-talk"] !== void 0,
	resolveGroupPolicy: (account) => account.config.groupPolicy,
	resolveRouteAllowlistConfigured: (account) => Boolean(account.config.rooms) && Object.keys(account.config.rooms ?? {}).length > 0,
	restrictSenders: {
		surface: "Nextcloud Talk rooms",
		openScope: "any member in allowed rooms",
		groupPolicyPath: "channels.nextcloud-talk.groupPolicy",
		groupAllowFromPath: "channels.nextcloud-talk.groupAllowFrom"
	},
	noRouteAllowlist: {
		surface: "Nextcloud Talk rooms",
		routeAllowlistPath: "channels.nextcloud-talk.rooms",
		routeScope: "room",
		groupPolicyPath: "channels.nextcloud-talk.groupPolicy",
		groupAllowFromPath: "channels.nextcloud-talk.groupAllowFrom"
	}
});
const collectNextcloudTalkOpenGroupFindings = createConditionalWarningCollector.findings({
	collectWarnings: collectNextcloudTalkSecurityWarnings,
	checkId: "channels.nextcloud-talk.groups.open",
	severity: "warn",
	title: "Nextcloud Talk security warning"
});
const nextcloudTalkPlugin = createChatChannelPlugin({
	base: {
		id: "nextcloud-talk",
		meta,
		setupWizard: nextcloudTalkSetupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			reactions: true,
			threads: false,
			media: true,
			nativeCommands: false,
			blockStreaming: true
		},
		reload: { configPrefixes: ["channels.nextcloud-talk"] },
		configSchema: buildChannelConfigSchema(NextcloudTalkConfigSchema),
		config: {
			...nextcloudTalkConfigAdapter,
			isConfigured: isNextcloudTalkAccountConfigured,
			describeAccount: (account) => describeWebhookAccountSnapshot({
				account,
				configured: isNextcloudTalkAccountConfigured(account),
				extra: {
					secretSource: account.secretSource,
					tokenStatus: account.tokenStatus,
					apiCredentialStatus: account.apiCredentialStatus,
					baseUrl: account.baseUrl ? "[set]" : "[missing]"
				}
			})
		},
		approvalCapability: nextcloudTalkApprovalAuth,
		doctor: nextcloudTalkDoctor,
		groups: {
			resolveRequireMention: resolveNextcloudTalkGroupRequireMention,
			resolveToolPolicy: resolveNextcloudTalkGroupToolPolicy
		},
		messaging: {
			targetPrefixes: [
				"nextcloud-talk",
				"nc-talk",
				"nc"
			],
			normalizeTarget: normalizeNextcloudTalkMessagingTarget,
			inferTargetChatType: ({ to }) => normalizeNextcloudTalkMessagingTarget(to) ? "group" : void 0,
			resolveOutboundSessionRoute: resolveNextcloudTalkOutboundSessionRoute,
			targetResolver: {
				looksLikeId: looksLikeNextcloudTalkTargetId,
				hint: "<roomToken>"
			}
		},
		secrets: {
			secretTargetRegistryEntries,
			collectRuntimeConfigAssignments
		},
		setupContract: nextcloudTalkSetupContract,
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$2),
			buildChannelSummary: ({ snapshot }) => buildWebhookChannelStatusSummary(snapshot, { secretSource: snapshot.secretSource ?? "none" }),
			collectStatusIssues: (accounts) => accounts.flatMap((account) => {
				const probe = account.probe;
				if (!probe || probe.ok !== false || probe.code !== "missing_response_feature" || !probe.message) return [];
				return [{
					channel: "nextcloud-talk",
					accountId: account.accountId ?? DEFAULT_ACCOUNT_ID$2,
					kind: "config",
					message: probe.message,
					fix: "Add --feature response to the Talk bot."
				}];
			}),
			probeAccount: async ({ account, timeoutMs }) => await probeNextcloudTalkBotResponseFeature({
				account,
				timeoutMs
			}),
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				name: account.name,
				enabled: account.enabled,
				configured: isNextcloudTalkAccountConfigured(account),
				extra: {
					secretSource: account.secretSource,
					tokenStatus: account.tokenStatus,
					apiCredentialStatus: account.apiCredentialStatus,
					baseUrl: account.baseUrl ? "[set]" : "[missing]",
					mode: "webhook"
				}
			})
		}),
		gateway: nextcloudTalkGatewayAdapter,
		message: nextcloudTalkMessageAdapter,
		actions: nextcloudTalkMessageActions
	},
	pairing: { text: {
		...nextcloudTalkPairingTextAdapter,
		notify: createLoggedPairingApprovalNotifier(({ id }) => `[nextcloud-talk] User ${id} approved for pairing`)
	} },
	security: {
		...nextcloudTalkSecurityAdapter,
		collectWarnings: collectNextcloudTalkOpenGroupFindings
	},
	outbound: {
		base: {
			deliveryMode: "direct",
			chunker: (text, limit) => getNextcloudTalkRuntime().channel.text.chunkMarkdownText(text, limit),
			chunkerMode: "markdown",
			textChunkLimit: 4e3,
			sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text)
		},
		attachedResults: {
			channel: "nextcloud-talk",
			sendText: nextcloudTalkMessageAdapter.send.text,
			sendMedia: (ctx) => nextcloudTalkMessageAdapter.send.media({
				...ctx,
				mediaUrl: ctx.mediaUrl ?? "",
				onDeliveryResult: void 0
			})
		}
	}
});
//#endregion
export { nextcloudTalkPlugin as t };
