import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as resolveConfiguredGitHubHost } from "./github-host-N2fYlLEb.mjs";
import { n as gitHubPublicApi } from "./github-public-api-Dk3IZSKx.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { _ as prepareSubagentSessionListReadCache, c as getSubagentSessionListReadSnapshotIdentity } from "./subagent-registry-state-DBdy-FdI.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as GitHubIdentityError } from "./github-read-identity-BB6UxasN.mjs";
import { f as resolveConfiguredGitHubToolIdentity, s as prepareGitHubReadIdentity } from "./github-tool-identity-BEdbceu6.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-BAlR2l66.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { r as resolveControlUiSessionPrTarget, t as prepareControlUiSessionPrRead } from "./control-ui-session-pr-read-CfmRdkBJ.mjs";
import { n as parseControlUiSessionPullRequestsSubscribeParams } from "./control-ui-session-pr-subscriptions-BVyPVROo.mjs";
import { t as withControlUiSessionPrSource } from "./control-ui-session-pr-source-BLg5MhE6.mjs";
import { t as retainGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { isDeepStrictEqual } from "node:util";
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
		allowStale: true,
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
			cfg: context.getRuntimeConfig()
		});
		if (!resolved) return;
		const startedAt = performance.now();
		let preparedAt;
		try {
			const { identity, assertSelected } = await prepareControlUiGitHubIdentity(options, resolved.agentId);
			assertSelected();
			preparedAt = performance.now();
			const result = await load(target, identity, void 0, params.refresh === true);
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
		} finally {
			const finishedAt = performance.now();
			if (method === "controlUi.githubPreview" && finishedAt - startedAt >= 500) context.logGateway?.info("Slow GitHub preview handler", {
				identityMs: Math.round((preparedAt ?? finishedAt) - startedAt),
				loadMs: preparedAt === void 0 ? 0 : Math.round(finishedAt - preparedAt)
			});
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
	const lastMessagePreview = boundedPreviewText(source.lastMessagePreview || void 0);
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
async function withControlUiSessionPreview(sessionKey, context, client, consume) {
	const projection = getSessionRowProjection(context);
	if (!projection) {
		consume(null);
		return;
	}
	await withReadySessionRows(projection, (cfg) => {
		const owner = resolveRequestedSessionAgentId(cfg, sessionKey);
		return owner.ok ? [{
			key: sessionKey,
			agentId: owner.agentId
		}] : [];
	}, (read) => {
		const cfg = context.getRuntimeConfig();
		const owner = resolveRequestedSessionAgentId(cfg, sessionKey);
		const record = owner.ok ? read.describe({
			key: sessionKey,
			agentId: owner.agentId
		}) : void 0;
		const entryFilter = createSessionListEntryFilter({
			client,
			cfg
		});
		if (!record || entryFilter && !entryFilter(record.key, record.entry)) {
			consume(null);
			return;
		}
		const row = read.present(record, {
			includeDerivedTitles: true,
			includeLastMessage: true
		});
		consume({
			sessionKey: row.key,
			agentId: record.agentId,
			title: row.displayName,
			derivedTitle: row.derivedTitle,
			kind: row.kind,
			channel: row.channel,
			updatedAt: row.updatedAt,
			lastMessagePreview: row.lastMessagePreview,
			archived: row.archived
		});
	});
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
async function prepareCheckDetailsSession(sessionKey, context, assertRequestCurrent) {
	const sourceCfg = context.getRuntimeConfig();
	const sourceRequest = resolveRequestedSessionAgentId(sourceCfg, sessionKey);
	if (!sourceRequest.ok) return null;
	const fields = [
		"repositoryWorkspaceId",
		"worktree",
		"spawnedCwd",
		"spawnedWorkspaceDir",
		"pendingWorktree",
		"pendingProjectGitUrl",
		"deviceFolder"
	];
	const selected = await retainGatewaySessionEntryReadOnly(sessionKey, sourceRequest.agentId, (previous, current) => fields.every((field) => isDeepStrictEqual(previous[field], current[field])), sourceCfg, { exactRead: true });
	let retained = false;
	try {
		const entry = selected.entry;
		if (!entry?.sessionId) return null;
		const workspaceId = entry.repositoryWorkspaceId;
		const prepared = workspaceId ? await getSessionRepositoryWorkspaceStore().prepare(workspaceId) : void 0;
		const current = () => {
			assertRequestCurrent();
			const cfg = context.getRuntimeConfig();
			if (!selected.isCurrentAtResponse() || createSessionListEntryFilter({
				cfg,
				client: null
			})?.(selected.canonicalKey, entry) === false) return;
			const repository = prepared?.current();
			return resolveControlUiSessionPrTarget({
				...selected,
				cfg
			}, repository?.workspaceId === workspaceId && repository?.agentId === selected.agentId && repository.sessionKey === selected.canonicalKey ? repository : null);
		};
		const target = current();
		if (!target) return null;
		retained = true;
		return {
			...target,
			release: selected.release,
			assertCurrent() {
				if (current()?.identity !== target.identity) throw new Error("Session pull-request target changed");
			}
		};
	} finally {
		if (!retained) selected.release();
	}
}
const loadSessionCheckDetails = async (params, deps) => {
	deps.assertCurrent();
	const { loadControlUiSessionPullRequestChecks } = await import("./control-ui-session-pr-check-details-CVnp7KTX.mjs");
	const { loadControlUiSessionPullRequests } = await import("./control-ui-session-prs-B45RvsMZ.mjs");
	return loadControlUiSessionPullRequestChecks(params, {
		...deps,
		loadPullRequests: (request, options) => loadControlUiSessionPullRequests(request, {
			...options,
			read: deps.read
		})
	});
};
function createControlUiHandlers(loadGitHubPreview = (...args) => gitHubPublicApi.loadControlUiGitHubPreview(...args), loadChecks = loadSessionCheckDetails) {
	return {
		"controlUi.linkPreview": async ({ params, client, context, respond, signal, hasCurrentClientAuthority }) => {
			const revision = () => JSON.stringify([
				getRuntimeConfigSnapshotMetadata()?.revision,
				client?.authenticatedUserId,
				client?.authenticatedUserProfile?.profileId
			]);
			const scope = {
				principal: client ?? context,
				revision: revision()
			};
			const isEnabled = () => !client?.connectionSignal?.aborted && hasCurrentClientAuthority?.() !== false && revision() === scope.revision && context.getRuntimeConfig().gateway?.controlUi?.automaticallyFetchFavicons !== false;
			if (signal?.aborted || !isEnabled()) {
				respond(true, {}, void 0);
				return;
			}
			const { parseControlUiLinkPreviewUrl, loadControlUiLinkPreview } = await import("./control-ui-link-preview-BFLBfsrq.mjs");
			const url = Object.keys(params).every((key) => key === "url") ? parseControlUiLinkPreviewUrl(params.url) : null;
			if (!url) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.linkPreview params"));
				return;
			}
			const preview = await loadControlUiLinkPreview(url, isEnabled, scope);
			respond(true, !signal?.aborted && isEnabled() ? preview : {}, void 0);
		},
		"controlUi.githubPreview": createGitHubReadHandler("controlUi.githubPreview", (params) => gitHubPublicApi.parseControlUiGitHubPreviewTarget(params), loadGitHubPreview),
		"controlUi.githubDetail": createGitHubReadHandler("controlUi.githubDetail", (params) => gitHubPublicApi.parseGitHubTarget(params), (...args) => gitHubPublicApi.loadGitHubDetail(...args)),
		"controlUi.sessionPreview": async ({ params, client, context, respond, signal, hasCurrentClientAuthority }) => {
			const sessionKey = parseSessionPreviewKey(params);
			if (!sessionKey) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPreview params"));
				return;
			}
			try {
				while (!getSubagentSessionListReadSnapshotIdentity()) await prepareSubagentSessionListReadCache();
				signal?.throwIfAborted();
				const consume = (preview) => {
					signal?.throwIfAborted();
					if (hasCurrentClientAuthority?.() === false) throw new Error("Session preview request is no longer active");
					respond(true, projectSessionPreview(preview), void 0);
				};
				await withControlUiSessionPreview(sessionKey, context, client, consume);
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
			let preparedSession = null;
			try {
				const reader = client ? await prepareControlUiSessionPrRead({
					client,
					sessionKey: parsed.sessionKey,
					getRuntimeConfig: context.getRuntimeConfig,
					getSessionRowProjection: () => getSessionRowProjection(context),
					isCurrentClient: () => !client.connId || context.getClientConnIds?.((candidate) => candidate === client).has(client.connId) === true
				}) : void 0;
				const binding = client ? await reader?.() ?? null : preparedSession = await prepareCheckDetailsSession(parsed.sessionKey, context, () => signal?.throwIfAborted());
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
			} finally {
				preparedSession?.release();
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
				subscriptions.replace(connId, parsed.sessionKeys, parsed.refreshSessionKeys.length > 0 ? new Set(parsed.refreshSessionKeys) : void 0, resolve).catch((error) => {
					context.logGateway.warn(`Failed to prepare Control UI pull request subscriptions; retry the subscription: ${String(error)}`);
				});
			});
			respond(true, { subscribed: parsed.sessionKeys.length > 0 }, void 0);
		}
	};
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers };
