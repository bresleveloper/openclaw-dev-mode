import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.mjs";
//#region src/shared/provider-login-command.ts
function formatProviderLoginCommand(providerRef) {
	return !providerRef || /^(?:refresh|access|cancel|choice)$/iu.test(providerRef) ? "/login" : `/login ${providerRef}`;
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-error-format.ts
function redactOAuthCredentialSecrets(message, secrets) {
	let redacted = message;
	for (const secret of secrets) redacted = redacted.split(secret).join("[redacted]");
	return redacted;
}
function formatRawErrorMessage(error) {
	if (error instanceof Error) {
		let formatted = error.message || error.name || "Error";
		let cause = error.cause;
		const seen = /* @__PURE__ */ new Set([error]);
		while (cause && !seen.has(cause)) {
			seen.add(cause);
			if (cause instanceof Error) {
				if (cause.message) formatted += ` | ${cause.message}`;
				cause = cause.cause;
			} else if (typeof cause === "string") {
				formatted += ` | ${cause}`;
				break;
			} else break;
		}
		return formatted;
	}
	if (typeof error === "string" || typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") return String(error);
	try {
		return JSON.stringify(error) ?? String(error);
	} catch {
		return Object.prototype.toString.call(error);
	}
}
function formatRedactedOAuthRefreshError(error, secrets) {
	return redactSensitiveText(redactOAuthCredentialSecrets(formatRawErrorMessage(error), secrets));
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-failure.ts
/**
* OAuth refresh failure classification and operator hints.
* Parses provider/reason codes from refresh failures and formats safe login
* commands without trusting raw provider text.
*/
const oauthRefreshCleanupAggregates = /* @__PURE__ */ new WeakSet();
const settledRefreshFailures = resolveGlobalSingleton(Symbol.for("openclaw.settledOAuthRefreshFailures"), () => /* @__PURE__ */ new WeakMap());
function appendOAuthRefreshCleanupErrors(error, cleanupErrors) {
	const primaryError = toErrorObject(error, "OAuth refresh failed");
	if (cleanupErrors.length === 0) return primaryError;
	const normalizedCleanupErrors = cleanupErrors.map((cleanupError) => toErrorObject(cleanupError, "OAuth refresh cleanup failed"));
	const errors = primaryError instanceof AggregateError && oauthRefreshCleanupAggregates.has(primaryError) ? [...primaryError.errors, ...normalizedCleanupErrors] : [primaryError, ...normalizedCleanupErrors];
	const aggregate = new AggregateError(errors, "OAuth refresh failed and cleanup could not be completed.", { cause: errors[0] });
	oauthRefreshCleanupAggregates.add(aggregate);
	return aggregate;
}
function readSettledOAuthRefreshCause(error) {
	return error instanceof Error ? settledRefreshFailures.get(error) ?? error : error;
}
function readOAuthRefreshInitiatingError(error) {
	const cause = readSettledOAuthRefreshCause(error);
	return cause instanceof AggregateError && oauthRefreshCleanupAggregates.has(cause) && cause.errors.length > 0 ? readSettledOAuthRefreshCause(cause.errors[0]) : cause;
}
const OAUTH_REFRESH_FAILURE_ERROR_TYPE_MAX_CHARS = 100;
const OAUTH_REFRESH_FAILURE_SUMMARY_MAX_CHARS = 500;
/** The refresh owner records failed external work only after its durable cleanup settles. */
function markOAuthRefreshFailureSettled(error, initiatingError = error) {
	settledRefreshFailures.set(error, initiatingError);
}
/** Internal provenance survives transformed module graphs without trusting provider metadata. */
function isSettledOAuthRefreshFailure(error) {
	return error instanceof Error && settledRefreshFailures.has(error);
}
function readProviderOAuthRefreshFailure(error) {
	const presentation = asOptionalRecord(asOptionalRecord(error)?.oauthRefreshFailure);
	if (!presentation) return null;
	const summary = normalizeBoundedOptionalString(presentation.summary, OAUTH_REFRESH_FAILURE_SUMMARY_MAX_CHARS);
	const errorType = normalizeBoundedOptionalString(presentation.errorType, OAUTH_REFRESH_FAILURE_ERROR_TYPE_MAX_CHARS);
	const reason = typeof presentation.reason === "string" ? classifyOAuthRefreshFailureReason(presentation.reason) : null;
	const status = typeof presentation.status === "number" && Number.isInteger(presentation.status) && presentation.status >= 100 && presentation.status <= 599 ? presentation.status : void 0;
	if (!summary && !errorType && !reason && !status) return null;
	return {
		...errorType ? { errorType } : {},
		...reason ? { reason } : {},
		...status ? { status } : {},
		...summary ? { summary } : {}
	};
}
/** Error type that carries provider and classified OAuth refresh failure reason. */
var OAuthRefreshFailureError = class OAuthRefreshFailureError extends Error {
	constructor(params) {
		super(params.message, { cause: params.cause });
		const inherited = params.cause instanceof OAuthRefreshFailureError ? params.cause : readProviderOAuthRefreshFailure(params.cause);
		this.name = "OAuthRefreshFailureError";
		this.errorType = normalizeBoundedOptionalString(params.errorType ?? inherited?.errorType, OAUTH_REFRESH_FAILURE_ERROR_TYPE_MAX_CHARS);
		this.provider = params.provider;
		this.profileId = params.profileId;
		this.reason = params.reason !== void 0 ? params.reason : inherited?.reason ?? classifyOAuthRefreshFailureReason(params.message);
		this.status = params.status ?? inherited?.status;
		this.summary = normalizeBoundedOptionalString(params.summary ?? inherited?.summary, OAUTH_REFRESH_FAILURE_SUMMARY_MAX_CHARS);
	}
};
function createOAuthRefreshUserFacingCause(cause) {
	if (cause instanceof Error && "code" in cause && cause.code === "refresh_contention") return new Error(cause.message);
	return cause;
}
/** Refresh failure that preserves a redacted refreshed store and credential. */
var OAuthManagerRefreshError = class extends OAuthRefreshFailureError {
	#refreshedStore;
	#credential;
	constructor(params) {
		const initiatingCause = readOAuthRefreshInitiatingError(params.cause);
		const structuredCause = asOptionalObjectRecord(initiatingCause);
		const surfacedCause = createOAuthRefreshUserFacingCause(initiatingCause);
		const storedCredential = params.refreshedStore.profiles[params.profileId];
		const secrets = collectOAuthCredentialSecrets(params.credential, ...params.attemptedCredentials ?? [], storedCredential?.type === "oauth" ? storedCredential : void 0);
		const presentation = initiatingCause instanceof OAuthRefreshFailureError ? initiatingCause : readProviderOAuthRefreshFailure(initiatingCause);
		const causeMessage = formatRedactedOAuthRefreshError(surfacedCause, secrets);
		super({
			provider: params.credential.provider,
			profileId: params.profileId,
			message: `OAuth token refresh failed for ${params.credential.provider}: ${causeMessage}`,
			cause: createRedactedOAuthRefreshCause(params.cause, secrets),
			errorType: presentation?.errorType,
			reason: presentation?.reason,
			status: presentation?.status,
			summary: presentation?.summary ? formatRedactedOAuthRefreshError(presentation.summary, secrets) : void 0
		});
		this.name = "OAuthManagerRefreshError";
		this.#credential = params.credential;
		this.profileId = params.profileId;
		this.#refreshedStore = params.refreshedStore;
		if (isSettledOAuthRefreshFailure(params.cause)) markOAuthRefreshFailureSettled(this);
		if (structuredCause) {
			this.code = typeof structuredCause.code === "string" ? structuredCause.code : void 0;
			if (typeof structuredCause.lockPath === "string") this.lockPath = structuredCause.lockPath;
			else if (typeof structuredCause.cause === "object" && structuredCause.cause !== null && "lockPath" in structuredCause.cause && typeof structuredCause.cause.lockPath === "string") this.lockPath = structuredCause.cause.lockPath;
		}
	}
	getRefreshedStore() {
		return this.#refreshedStore;
	}
	getCredential() {
		return this.#credential;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			profileId: this.profileId,
			provider: this.provider
		};
	}
};
function collectOAuthCredentialSecrets(...credentials) {
	const secrets = /* @__PURE__ */ new Set();
	for (const credential of credentials) for (const secret of [
		credential?.access,
		credential?.refresh,
		credential?.idToken
	]) if (secret) secrets.add(secret);
	return Array.from(secrets).toSorted((a, b) => b.length - a.length);
}
function createRedactedOAuthRefreshCause(value, secrets) {
	const cause = readSettledOAuthRefreshCause(value);
	if (cause instanceof AggregateError) {
		const errors = cause.errors.map((error) => createRedactedOAuthRefreshCause(error, secrets));
		const sanitized = new AggregateError(errors, formatRedactedOAuthRefreshError(cause.message, secrets), errors.length > 0 ? { cause: errors[0] } : void 0);
		sanitized.name = cause.name;
		return sanitized;
	}
	const surfacedCause = createOAuthRefreshUserFacingCause(cause);
	const redacted = formatRedactedOAuthRefreshError(surfacedCause, secrets);
	const sanitized = new Error(redacted);
	if (surfacedCause instanceof Error && surfacedCause.name) sanitized.name = surfacedCause.name;
	return sanitized;
}
const OAUTH_REFRESH_FAILURE_PROVIDER_RE = /OAuth token refresh failed for ([^:]+):/i;
const SAFE_PROVIDER_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
const CLAUDE_CLI_AUTH_FAILURE_RE = /\bclaude-cli\b.+?\b(failed to authenticate|401\s+invalid authentication credentials)\b/is;
function isClaudeCliExpiredOAuthMessage(message) {
	return CLAUDE_CLI_AUTH_FAILURE_RE.test(message);
}
function readStructuredClaudeCliAuthFailure(err) {
	if (!err || typeof err !== "object") return null;
	const candidate = err;
	if (candidate.name !== "FailoverError" || candidate.provider !== "claude-cli" || candidate.reason !== "auth" || candidate.status !== 401) return null;
	return candidate;
}
function classifyStructuredClaudeCliOAuthFailureReason(err) {
	const failure = readStructuredClaudeCliAuthFailure(err);
	if (!failure) return null;
	const rawError = typeof failure.rawError === "string" ? failure.rawError : "";
	const combined = `${err instanceof Error ? err.message : ""}\n${rawError}`;
	const lower = combined.toLowerCase();
	if (/\bnot logged in\b\s*·\s*please run \/login\b/i.test(combined)) return "sign_in_again";
	return lower.includes("failed to authenticate") || lower.includes("invalid authentication credentials") ? "revoked" : null;
}
function isOAuthRefreshFailureMessage(message) {
	const lower = message.toLowerCase();
	return lower.includes("oauth token refresh failed") || lower.includes("access token could not be refreshed") || lower.includes("authentication session could not be refreshed automatically") || isClaudeCliExpiredOAuthMessage(message);
}
function extractOAuthRefreshFailureProvider(message) {
	if (isClaudeCliExpiredOAuthMessage(message)) return "claude-cli";
	const provider = message.match(OAUTH_REFRESH_FAILURE_PROVIDER_RE)?.[1]?.trim();
	return provider && provider.length > 0 ? provider : null;
}
function sanitizeOAuthRefreshFailureProvider(provider) {
	const sanitized = provider ? sanitizeForLog(provider).replaceAll("`", "").trim() : "";
	const normalized = normalizeProviderId(sanitized);
	return normalized && SAFE_PROVIDER_ID_RE.test(normalized) ? normalized : null;
}
function sanitizeOAuthRefreshFailureProfileId(profileId) {
	return (profileId ? sanitizeForLog(profileId).trim() : "") || null;
}
function quoteShellArg(value) {
	return `'${process.platform === "win32" ? value.replaceAll("'", "''") : value.replaceAll("'", "'\\''")}'`;
}
/** Wrap a rendered login command in a Markdown code span that survives embedded backticks. */
function formatOAuthRefreshFailureLoginCommandMarkdown(command) {
	return formatInlineCodeSpan(command);
}
/** Classify a raw OAuth refresh failure message into a stable reason code. */
function classifyOAuthRefreshFailureReason(message) {
	const lower = message.toLowerCase();
	if (lower.includes("refresh_token_reused")) return "refresh_token_reused";
	if (lower.includes("refresh_token_expired")) return "expired";
	if (lower.includes("invalid_grant")) return "invalid_grant";
	if (lower.includes("token_invalidated")) return "token_invalidated";
	if (lower.includes("sign_in_again") || lower.includes("signing in again") || lower.includes("sign in again") || lower.includes("log in again")) return "sign_in_again";
	if (lower.includes("invalid_refresh_token") || lower.includes("invalid refresh token")) return "invalid_refresh_token";
	if (lower.includes("expired or revoked") || lower.includes("revoked")) return "revoked";
	if (isClaudeCliExpiredOAuthMessage(message)) return "revoked";
	return null;
}
/** Classify provider/reason from a user-facing OAuth refresh failure message. */
function classifyOAuthRefreshFailure(message) {
	if (!isOAuthRefreshFailureMessage(message)) return null;
	return {
		provider: sanitizeOAuthRefreshFailureProvider(extractOAuthRefreshFailureProvider(message)),
		reason: classifyOAuthRefreshFailureReason(message)
	};
}
/** Classify provider/reason from the structured OAuth refresh failure error. */
function classifyOAuthRefreshFailureError(err) {
	const seen = /* @__PURE__ */ new Set();
	let rawFallback = null;
	let candidate = err;
	while (candidate && typeof candidate === "object") {
		const claudeCliReason = classifyStructuredClaudeCliOAuthFailureReason(candidate);
		if (claudeCliReason) return {
			provider: "claude-cli",
			reason: claudeCliReason
		};
		if (candidate instanceof OAuthRefreshFailureError) {
			const profileId = sanitizeOAuthRefreshFailureProfileId(candidate.profileId);
			return {
				...candidate.errorType ? { errorType: candidate.errorType } : {},
				provider: sanitizeOAuthRefreshFailureProvider(candidate.provider),
				...profileId ? { profileId } : {},
				reason: candidate.reason,
				...candidate.status ? { status: candidate.status } : {},
				...candidate.summary ? { summary: candidate.summary } : {}
			};
		}
		const record = asOptionalRecord(candidate);
		const rawError = record?.rawError;
		if (typeof rawError === "string") {
			const classified = classifyOAuthRefreshFailure(rawError);
			if (classified) {
				const rawProfileId = record?.profileId;
				const profileId = sanitizeOAuthRefreshFailureProfileId(typeof rawProfileId === "string" ? rawProfileId : void 0);
				rawFallback ??= {
					...classified,
					...profileId ? { profileId } : {}
				};
			}
		}
		if (seen.has(candidate)) return rawFallback;
		seen.add(candidate);
		candidate = candidate.cause;
	}
	return rawFallback;
}
/** Build the login command operators should run after OAuth refresh failure. */
function buildOAuthRefreshFailureLoginCommand(provider, options) {
	const sanitizedProvider = sanitizeOAuthRefreshFailureProvider(provider);
	if (options?.surface === "chat") return formatProviderLoginCommand(sanitizedProvider === "claude-cli" ? null : sanitizedProvider);
	const sanitizedProfileId = sanitizeOAuthRefreshFailureProfileId(options?.profileId);
	const agentId = options?.agentId ? sanitizeForLog(options.agentId).trim() : void 0;
	const agentOption = agentId ? ` --agent ${quoteShellArg(agentId)}` : "";
	if (sanitizedProvider === "claude-cli") return `${formatCliCommand("claude auth login")} && ${formatCliCommand(sanitizedProfileId ? `openclaw models auth login --provider anthropic --method cli --profile-id ${quoteShellArg(sanitizedProfileId)}${agentOption}` : `openclaw models auth login --provider anthropic --method cli${agentOption}`)}`;
	return sanitizedProvider ? formatCliCommand(sanitizedProfileId ? `openclaw models auth login --provider ${sanitizedProvider} --profile-id ${quoteShellArg(sanitizedProfileId)}${agentOption}` : `openclaw models auth login --provider ${sanitizedProvider}${agentOption}`) : formatCliCommand(`openclaw models auth login${agentOption}`);
}
/** Build operator guidance for an active profile cooldown or disable window. */
function buildAuthProfileUnusableHint(params) {
	if (params.reason === "auth" || params.reason === "auth_permanent" || params.reason === "session_expired") {
		if (params.provider === "google-gemini-cli") return `Gemini CLI OAuth cannot be repaired by OpenClaw. Connect Google with an AI Studio API key using ${formatOAuthRefreshFailureLoginCommandMarkdown(formatCliCommand("openclaw models auth login --provider google"))}, then select that Google profile for the Gemini CLI runtime.`;
		return `Re-authenticate with ${formatOAuthRefreshFailureLoginCommandMarkdown(buildOAuthRefreshFailureLoginCommand(params.provider, { profileId: params.profileId }))}.`;
	}
	if (params.kind === "disabled" && params.reason === "billing") return "Top up credits (provider billing) or switch provider.";
	return "Wait for cooldown or switch provider.";
}
//#endregion
export { buildOAuthRefreshFailureLoginCommand as a, classifyOAuthRefreshFailureReason as c, markOAuthRefreshFailureSettled as d, formatProviderLoginCommand as f, buildAuthProfileUnusableHint as i, formatOAuthRefreshFailureLoginCommandMarkdown as l, OAuthRefreshFailureError as n, classifyOAuthRefreshFailure as o, appendOAuthRefreshCleanupErrors as r, classifyOAuthRefreshFailureError as s, OAuthManagerRefreshError as t, isSettledOAuthRefreshFailure as u };
