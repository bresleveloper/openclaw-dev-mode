import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import "./utils-DgZn2dLu.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as resolveConfiguredGitHubHost } from "./github-host-CaivEi-a.mjs";
import { n as GitHubIdentityError } from "./github-read-identity-DR7T7KI1.mjs";
import { c as prepareGitHubReadIdentity, p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { c as getSubagentSessionListReadSnapshotIdentity, g as prepareSubagentSessionListReadCache } from "./subagent-registry-state-CVSclnHX.mjs";
import { P as buildGatewaySessionRow } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { r as resolveControlUiSessionPrTarget, t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-FCVdRRgl.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-CxoSdLOZ.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { i as loadAccessorSessionEntryForGatewayTarget } from "./sessions-shared-CRlp7L3V.mjs";
import { n as parseControlUiSessionPullRequestsSubscribeParams, r as withControlUiSessionPrSource } from "./control-ui-session-pr-subscriptions-BnVT-jXp.mjs";
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
		if (resolveConfiguredGitHubHost(current) !== "github.com") return;
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
	const { target, storePath, store, entry } = loadAccessorSessionEntryForGatewayTarget({
		key: sessionKey,
		cfg,
		clone: false,
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
async function prepareCheckDetailsSession(sessionKey, context, client) {
	const readSelected = () => {
		const cfg = context.getRuntimeConfig();
		const requested = resolveRequestedSessionAgentId(cfg, sessionKey);
		if (!requested.ok) return;
		const { target, entry, storePath } = loadAccessorSessionEntryForGatewayTarget({
			key: sessionKey,
			cfg,
			clone: false,
			agentId: requested.agentId
		});
		const entryFilter = createSessionListEntryFilter({
			client,
			cfg
		});
		if (!entry?.sessionId || entryFilter && !entryFilter(target.canonicalKey, entry)) return;
		return {
			cfg,
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			storePath,
			readSource: target.readSource,
			entry
		};
	};
	const initial = readSelected();
	if (!initial) return null;
	const workspaceId = initial.entry.repositoryWorkspaceId;
	const prepared = workspaceId ? await getSessionRepositoryWorkspaceStore().prepare(workspaceId) : void 0;
	const current = () => {
		const selected = readSelected();
		if (!selected || selected.entry.sessionId !== initial.entry.sessionId || selected.entry.lifecycleRevision !== initial.entry.lifecycleRevision || selected.entry.repositoryWorkspaceId !== workspaceId) return;
		const repository = prepared?.current();
		return resolveControlUiSessionPrTarget(selected, repository?.workspaceId === workspaceId && repository?.agentId === selected.agentId && repository.sessionKey === selected.canonicalKey ? repository : null);
	};
	const target = current();
	return target ? {
		...target,
		assertCurrent() {
			if (current()?.identity !== target.identity) throw new Error("Session pull-request target changed");
		}
	} : null;
}
const loadSessionCheckDetails = async (params, deps) => {
	deps.assertCurrent();
	const { loadControlUiSessionPullRequestChecks } = await import("./control-ui-session-pr-check-details-xeh-9hD3.mjs");
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-C43MoyEq.mjs");
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
			const { parseControlUiLinkPreviewUrl, loadControlUiLinkPreview } = await import("./control-ui-link-preview-CqzJ0lmn.mjs");
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
				const reader = client ? await prepareControlUiSessionPrRead({
					client,
					sessionKey: parsed.sessionKey,
					getRuntimeConfig: context.getRuntimeConfig,
					getSessionRowProjection: () => getSessionRowProjection(context),
					isCurrentClient: () => !client.connId || context.getClientConnIds?.((candidate) => candidate === client).has(client.connId) === true
				}) : void 0;
				const binding = client ? await reader?.() ?? null : await prepareCheckDetailsSession(parsed.sessionKey, context, client);
				if (!binding) throw new gitHubPublicApi.ControlUiGitHubError(404, "Session CI details unavailable");
				const assertCurrent = () => {
					let identityCurrent = false;
					try {
						binding.assertCurrent?.();
						identityCurrent = true;
					} catch {}
					if (signal?.aborted || !identityCurrent) throw new gitHubPublicApi.ControlUiGitHubError(409, "Session changed; reopen CI details");
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
		"controlUi.sessionPullRequests.subscribe": async ({ params, client, context, respond }) => {
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
			await new Promise((resolve) => {
				subscriptions.replace(connId, parsed.sessionKeys, parsed.refreshSessionKeys.length > 0 ? new Set(parsed.refreshSessionKeys) : void 0, resolve).catch(() => {});
			});
			respond(true, { subscribed: parsed.sessionKeys.length > 0 }, void 0);
		}
	};
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers };
