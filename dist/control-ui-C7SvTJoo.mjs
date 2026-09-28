import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { E as getSubagentSessionListReadSnapshotIdentity, P as prepareSubagentSessionListReadCache } from "./subagent-registry-read-C2SIiLpb.mjs";
import { L as buildGatewaySessionRow } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { E as createSessionListEntryFilter } from "./session-sharing-C_5FkkwM.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import "./session-utils-AxixtEyo.mjs";
import { N as GitHubIdentityError, c as prepareGitHubReadIdentity, p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-BhQVI4mm.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
import { a as loadSessionEntriesForTarget } from "./sessions-shared-DPyHwOCR.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
import { a as resolveControlUiSessionPrTarget, i as prepareControlUiSessionPrRead, n as parseControlUiSessionPullRequestsSubscribeParams, r as withControlUiSessionPrSource } from "./control-ui-session-pr-subscriptions-BTfdUF0S.mjs";
//#region src/gateway/server-methods/control-ui.ts
var GitHubReadRequestInactiveError = class extends Error {
	constructor() {
		super("GitHub request is no longer active. Try again.");
	}
};
async function prepareControlUiGitHubIdentity({ context, client, signal, hasCurrentClientAuthority }, agentId) {
	const config = context.getRuntimeConfig();
	const configuredIdentity = () => {
		const current = context.getRuntimeConfig();
		return resolveConfiguredGitHubToolIdentity({
			config: current,
			agentId,
			scope: "agent"
		}) ?? resolveConfiguredGitHubToolIdentity({
			config: current,
			agentId,
			scope: "system"
		});
	};
	const assertActive = () => {
		if (signal?.aborted || (hasCurrentClientAuthority ? !hasCurrentClientAuthority() : client?.connId && !context.getClientConnIds?.((current) => current === client).has(client.connId))) throw new GitHubReadRequestInactiveError();
	};
	assertActive();
	const identity = configuredIdentity() ? await prepareGitHubReadIdentity({
		config,
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? config,
		agentId,
		getCurrentConfig: () => context.getRuntimeConfig(),
		assertActive,
		refresh: () => requestCurrentGitHubOAuthRefresh(agentId)
	}) : void 0;
	return {
		identity,
		assertSelected: identity?.assertSelected ?? (() => {
			assertActive();
			if (configuredIdentity()) throw new GitHubIdentityError("changed");
		})
	};
}
function createGitHubReadHandler(method, parseTarget, load) {
	return async (options) => {
		const { params, respond, context } = options;
		const target = parseTarget(params);
		if (!target || params.refresh !== void 0 && typeof params.refresh !== "boolean") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params`));
			return;
		}
		const resolved = resolveAgentIdOrRespondError({
			rawAgentId: params.agentId,
			respond,
			cfg: context.getRuntimeConfig(),
			normalize: normalizeOptionalString
		});
		if (!resolved) return;
		try {
			const { identity, assertSelected } = await prepareControlUiGitHubIdentity(options, resolved.agentId);
			assertSelected();
			const result = params.refresh === true ? await load(target, identity, void 0, true) : await load(target, identity);
			assertSelected();
			respond(true, result, void 0);
		} catch (error) {
			const { message, ...details } = error instanceof GitHubReadRequestInactiveError ? {
				message: error.message,
				retryable: true
			} : error instanceof GitHubIdentityError ? {
				message: error.message,
				retryable: error.reason !== "unavailable"
			} : gitHubPublicApi.formatControlUiGitHubPreviewError(error);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, details));
		}
	};
}
const SESSION_PREVIEW_TEXT_MAX_CHARS = 200;
function boundedPreviewText(value, maxChars = SESSION_PREVIEW_TEXT_MAX_CHARS) {
	const trimmed = value?.trim();
	return trimmed ? truncateUtf16Safe(trimmed, maxChars) : void 0;
}
function parseSessionPreviewKey(params) {
	if (!isRecord(params) || Object.keys(params).some((key) => key !== "sessionKey")) return null;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	return sessionKey && sessionKey.length <= 512 ? sessionKey : null;
}
function projectSessionPreview(source) {
	if (!source) return { status: "unavailable" };
	const lastMessagePreview = boundedPreviewText(source.lastMessagePreview ? redactToolPayloadText(source.lastMessagePreview) : void 0);
	const title = boundedPreviewText(source.title);
	const derivedTitle = boundedPreviewText(source.derivedTitle);
	const kind = boundedPreviewText(source.kind, 64);
	const channel = boundedPreviewText(source.channel, 80);
	return {
		status: "ok",
		sessionKey: source.sessionKey,
		agentId: source.agentId,
		...title ? { title } : {},
		...derivedTitle ? { derivedTitle } : {},
		...kind ? { kind } : {},
		...channel ? { channel } : {},
		...typeof source.updatedAt === "number" && Number.isFinite(source.updatedAt) ? { updatedAt: source.updatedAt } : {},
		...lastMessagePreview ? { lastMessagePreview } : {},
		...typeof source.archived === "boolean" ? { archived: source.archived } : {}
	};
}
function loadControlUiSessionPreview(sessionKey, context, client) {
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey);
	if (!requestedAgent.ok) return null;
	const { target, storePath, store, entry } = loadSessionEntriesForTarget({
		key: sessionKey,
		cfg,
		...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
	});
	if (!entry) return null;
	const entryFilter = createSessionListEntryFilter({
		client,
		cfg
	});
	if (entryFilter && !entryFilter(target.canonicalKey, entry)) return null;
	const row = buildGatewaySessionRow({
		cfg,
		agentId: target.agentId,
		storePath,
		store,
		key: target.canonicalKey,
		entry,
		includeDerivedTitles: true,
		includeLastMessage: true,
		skipTranscriptUsageFallback: true
	});
	return {
		sessionKey: row.key,
		agentId: target.agentId,
		title: row.displayName,
		derivedTitle: row.derivedTitle,
		kind: row.kind,
		channel: row.channel,
		updatedAt: row.updatedAt,
		lastMessagePreview: row.lastMessagePreview,
		archived: row.archived
	};
}
function parseCheckDetailsParams(params) {
	if (Object.keys(params).some((key) => ![
		"sessionKey",
		"owner",
		"repo",
		"number",
		"headSha"
	].includes(key))) return null;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	const headSha = typeof params.headSha === "string" ? params.headSha : "";
	const target = gitHubPublicApi.parseControlUiGitHubPreviewTarget({
		...params,
		kind: "pull"
	});
	return target && sessionKey && sessionKey.length <= 512 && /^[0-9a-f]{40}$/i.test(headSha) ? {
		sessionKey,
		owner: target.owner,
		repo: target.repo,
		number: target.number,
		headSha: headSha.toLowerCase()
	} : null;
}
function resolveCheckDetailsSession(sessionKey, context, client) {
	const cfg = context.getRuntimeConfig();
	const requested = resolveRequestedSessionAgentId(cfg, sessionKey);
	if (!requested.ok) return null;
	const { target, entry, storePath } = loadSessionEntriesForTarget({
		key: sessionKey,
		cfg,
		agentId: requested.agentId
	});
	const entryFilter = createSessionListEntryFilter({
		client,
		cfg
	});
	if (!entry?.sessionId || entryFilter && !entryFilter(target.canonicalKey, entry)) return null;
	return resolveControlUiSessionPrTarget({
		cfg,
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		storePath,
		readSource: target.readSource,
		entry
	}) ?? null;
}
const loadSessionCheckDetails = async (params, deps) => {
	deps.assertCurrent();
	const { loadControlUiSessionPullRequestChecks } = await import("./control-ui-session-pr-check-details-Bd2KD7TM.mjs");
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-DE11gS6L.mjs");
	return loadControlUiSessionPullRequestChecks(params, {
		...deps,
		loadPullRequests: (request, options) => loadControlUiSessionPullRequests(request, {
			...options,
			read: deps.read
		})
	});
};
function createControlUiHandlers(loadGitHubPreview = (...args) => gitHubPublicApi.loadControlUiGitHubPreview(...args), loadSessionPreview = loadControlUiSessionPreview, loadChecks = loadSessionCheckDetails) {
	return {
		"controlUi.linkPreview": async ({ params, context, respond, signal }) => {
			const isEnabled = () => context.getRuntimeConfig().gateway?.controlUi?.automaticallyFetchFavicons !== false;
			if (!isEnabled()) {
				respond(true, {}, void 0);
				return;
			}
			const { parseControlUiLinkPreviewUrl, loadControlUiLinkPreview } = await import("./control-ui-link-preview-BJgeuE75.mjs");
			const url = Object.keys(params).every((key) => key === "url") ? parseControlUiLinkPreviewUrl(params.url) : null;
			if (!url) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.linkPreview params"));
				return;
			}
			const preview = await loadControlUiLinkPreview(url, isEnabled);
			respond(true, !signal?.aborted && isEnabled() ? preview : {}, void 0);
		},
		"controlUi.githubPreview": createGitHubReadHandler("controlUi.githubPreview", (params) => gitHubPublicApi.parseControlUiGitHubPreviewTarget(params), loadGitHubPreview),
		"controlUi.githubDetail": createGitHubReadHandler("controlUi.githubDetail", (params) => gitHubPublicApi.parseGitHubTarget(params), (...args) => gitHubPublicApi.loadGitHubDetail(...args)),
		"controlUi.sessionPreview": async ({ params, client, context, respond, signal }) => {
			const sessionKey = parseSessionPreviewKey(params);
			if (!sessionKey) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPreview params"));
				return;
			}
			try {
				while (!getSubagentSessionListReadSnapshotIdentity()) await prepareSubagentSessionListReadCache();
				signal?.throwIfAborted();
				respond(true, projectSessionPreview(loadSessionPreview(sessionKey, context, client)), void 0);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session preview unavailable"));
			}
		},
		"controlUi.sessionPullRequests.checks": async ({ params, client, context, respond, signal }) => {
			const parsed = parseCheckDetailsParams(params);
			if (!parsed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPullRequests.checks params"));
				return;
			}
			try {
				const reader = client ? prepareControlUiSessionPrRead({
					client,
					sessionKey: parsed.sessionKey,
					getRuntimeConfig: context.getRuntimeConfig,
					getSessionRowProjection: () => getSessionRowProjection(context),
					isCurrentClient: () => !client.connId || context.getClientConnIds?.((candidate) => candidate === client).has(client.connId) === true
				}) : void 0;
				const currentBinding = () => {
					if (!client) return resolveCheckDetailsSession(parsed.sessionKey, context, client);
					return reader?.() ?? null;
				};
				const binding = currentBinding();
				if (!binding) throw new gitHubPublicApi.ControlUiGitHubError(404, "Session CI details unavailable");
				const assertCurrent = () => {
					const current = currentBinding();
					if (signal?.aborted || current?.identity !== binding.identity) throw new gitHubPublicApi.ControlUiGitHubError(409, "Session changed; reopen CI details");
				};
				await withControlUiSessionPrSource(binding.readSource, async (assertSourceCurrent, sourceIdentity) => {
					const assertReadCurrent = () => {
						assertSourceCurrent();
						assertCurrent();
					};
					const result = await loadChecks({
						...parsed,
						agentId: binding.params.agentId
					}, {
						sessionScope: binding.identity,
						assertCurrent: assertReadCurrent,
						read: {
							target: binding,
							sourceIdentity,
							assertCurrent: assertReadCurrent
						}
					});
					assertReadCurrent();
					respond(true, result, void 0);
				});
			} catch (error) {
				const message = error instanceof gitHubPublicApi.ControlUiGitHubError && (error.statusCode === 404 || error.statusCode === 409) ? error.message : gitHubPublicApi.formatControlUiGitHubPreviewError(error).message;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
			}
		},
		"controlUi.sessionPullRequests.subscribe": ({ params, client, context, respond }) => {
			const parsed = parseControlUiSessionPullRequestsSubscribeParams(params);
			if (!parsed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPullRequests.subscribe params"));
				return;
			}
			const connId = client?.connId?.trim();
			const subscriptions = context.controlUiSessionPullRequests;
			if (!connId || !subscriptions) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session pull request subscriptions unavailable"));
				return;
			}
			if (parsed.refreshSessionKeys.length > 0) subscriptions.replace(connId, parsed.sessionKeys, new Set(parsed.refreshSessionKeys));
			else subscriptions.replace(connId, parsed.sessionKeys);
			respond(true, { subscribed: parsed.sessionKeys.length > 0 }, void 0);
		}
	};
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers };
