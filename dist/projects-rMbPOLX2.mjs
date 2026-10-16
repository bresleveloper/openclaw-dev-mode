import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-oevwKU3u.mjs";
import { Cr as validateProjectsRegisterParams, Sr as validateProjectsListParams, Tr as validateProjectsSearchRemoteParams, wr as validateProjectsRemoveParams, xr as validateProjectsAddParams } from "./src-l2dWvEsN.mjs";
import { v as readCurrentUserProfileAliases } from "./user-profile-list-CtETKur7.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { g as readGatewayAccessRevision } from "./operator-role-policy-BqPaarjx.mjs";
import { s as sessionCreatorProfileId } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { i as resolveConfiguredGitHubHost, r as resolveConfiguredGitHubApiBaseUrl } from "./github-host-CaivEi-a.mjs";
import { o as readCachedNativeGitHubToken } from "./github-read-identity-DR7T7KI1.mjs";
import { n as loadCombinedSessionStoreForGatewayCore, r as loadCombinedSessionStoreForGatewayCoreAsync } from "./combined-store-gateway-KQyr45dp.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { a as managedWorktrees } from "./service-DvlxnA92.mjs";
import { g as listRegistryWorktrees } from "./registry-Bm5FVBwN.mjs";
import { f as ProjectCheckoutError, i as removeProjectRegistry, n as listWorkspaceProjects, o as resolveProjectRegistry, r as registerProjectRegistry, t as listProjectRegistry } from "./project-registry-B7e5lNuh.mjs";
import "./session-utils-CwljFiKR.mjs";
import { n as gitHubPublicApi, r as githubApiToken, t as CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE } from "./github-public-api-COOMiXSo.mjs";
import { i as ProjectCloneError, r as removeClonedProjectCheckout, t as materializeProjectClone } from "./project-clone-C7OBrO47.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as createGitHubReadGroup } from "./control-ui-session-pr-request-BTQOuS8L.mjs";
import { t as configuredDefaultRepository } from "./configured-default-repository-BRG3U3Te.mjs";
import path from "node:path";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/gateway/project-github-search.ts
const SEARCH_CACHE_MS = 6e4;
const SEARCH_CACHE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 10;
const AFFILIATED_RESULT_LIMIT = 10;
const EXACT_REPO_QUERY = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;
const searchCache = /* @__PURE__ */ new Map();
function boundedString(value, maxLength) {
	return normalizeOptionalString(value)?.slice(0, maxLength);
}
function parseRepository(value) {
	if (!isRecord(value)) return null;
	const fullName = readNonBlankString(value.full_name);
	const name = readNonBlankString(value.name);
	if (!fullName || !name) return null;
	const clone = parseConfiguredProjectGitUrl(readNonBlankString(value.clone_url) ?? "");
	const webUrl = boundedString(value.html_url, 2048);
	if (!clone || !webUrl) return null;
	const description = boundedString(value.description, 500);
	const defaultBranch = boundedString(value.default_branch, 255);
	return {
		name: name.slice(0, 100),
		fullName: fullName.slice(0, 200),
		cloneUrl: clone.url,
		webUrl,
		private: value.private === true,
		...description ? { description } : {},
		...defaultBranch ? { defaultBranch } : {}
	};
}
function repositoryArray(value) {
	return (Array.isArray(value) ? value : isRecord(value) && Array.isArray(value.items) ? value.items : []).flatMap((item) => {
		const parsed = parseRepository(item);
		return parsed ? [parsed] : [];
	});
}
function matchesAffiliatedQuery(project, query) {
	const needle = query.toLowerCase();
	return [
		project.name,
		project.fullName,
		project.description ?? ""
	].join("\n").toLowerCase().includes(needle);
}
async function loadExactRepository(query, request) {
	const url = new URL(`repos/${query}`, `${gitHubPublicApi.GITHUB_API_BASE_URL}/`);
	try {
		return parseRepository(await request(url.href));
	} catch {
		return null;
	}
}
async function loadAffiliatedRepositories(request) {
	const url = new URL("user/repos", `${gitHubPublicApi.GITHUB_API_BASE_URL}/`);
	url.searchParams.set("affiliation", "owner,collaborator,organization_member");
	url.searchParams.set("sort", "updated");
	url.searchParams.set("direction", "desc");
	url.searchParams.set("per_page", String(AFFILIATED_RESULT_LIMIT));
	try {
		return repositoryArray(await request(url.href, false));
	} catch {
		return [];
	}
}
async function loadRepositorySearch(query, request) {
	const url = new URL("search/repositories", `${gitHubPublicApi.GITHUB_API_BASE_URL}/`);
	url.searchParams.set("q", `${query} in:name,description`);
	url.searchParams.set("per_page", String(SEARCH_RESULT_LIMIT));
	return repositoryArray(await request(url.href));
}
async function searchProjectsUncached(params) {
	const [exact, affiliated, global] = await Promise.all([
		EXACT_REPO_QUERY.test(params.query) ? loadExactRepository(params.query, params.request) : null,
		params.token ? loadAffiliatedRepositories(params.request) : [],
		loadRepositorySearch(params.query, params.request)
	]);
	const ranked = [
		...exact ? [exact] : [],
		...affiliated.filter((project) => matchesAffiliatedQuery(project, params.query)),
		...global
	];
	const deduped = /* @__PURE__ */ new Map();
	for (const project of ranked) {
		const key = project.fullName.toLowerCase();
		if (!deduped.has(key)) deduped.set(key, project);
	}
	return {
		credential: params.token ? "configured" : "missing",
		projects: [...deduped.values()].slice(0, SEARCH_RESULT_LIMIT)
	};
}
/** Searches affiliated and public GitHub repositories for the project picker. */
async function searchRemoteProjects(query, options = {}) {
	const config = getRuntimeConfigSnapshot();
	const host = options.host ?? resolveConfiguredGitHubHost(config);
	const apiBaseUrl = options.apiBaseUrl ?? resolveConfiguredGitHubApiBaseUrl(config);
	const assertSelected = () => {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		const current = getRuntimeConfigSnapshot();
		if (resolveConfiguredGitHubHost(current) !== host || resolveConfiguredGitHubApiBaseUrl(current) !== apiBaseUrl || gitHubPublicApi.GITHUB_API_BASE_URL !== apiBaseUrl) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub host changed during project search");
	};
	assertSelected();
	const normalizedQuery = query.trim().toLowerCase();
	const { token, cacheScope } = options.token === void 0 ? gitHubPublicApi.resolveGitHubApiCredentialScope(options.env) : {
		token: options.token,
		cacheScope: gitHubPublicApi.githubApiCredentialCacheScope(options.token)
	};
	const cacheKey = `${normalizedQuery}\0${host}\0${apiBaseUrl}\0${cacheScope}`;
	const now = options.now ?? Date.now();
	const cached = searchCache.get(cacheKey);
	const reusable = cached && cached.expiresAt > now && !cached.access.signal.aborted;
	const entry = reusable ? cached : {
		expiresAt: now + SEARCH_CACHE_MS,
		access: createGitHubReadGroup(),
		promise: Promise.resolve({
			credential: "missing",
			projects: []
		})
	};
	const release = entry.access.add(assertSelected, options.signal);
	if (!reusable) {
		const fetchImpl = options.fetchImpl ?? fetch;
		const identity = {
			assertSelected: entry.access.assertCurrent,
			revalidate: async () => entry.access.assertCurrent()
		};
		const request = (url, optionalAuth = true) => {
			const readJson = async (requestToken) => gitHubPublicApi.readGitHubJsonResponse(await gitHubPublicApi.fetchGitHubApi(url, fetchImpl, requestToken, void 0, identity, void 0, entry.access.signal, void 0, apiBaseUrl));
			return optionalAuth ? gitHubPublicApi.withOptionalGitHubAuth(token, readJson) : readJson(token);
		};
		entry.promise = searchProjectsUncached({
			query: query.trim(),
			request,
			token
		}).catch((error) => {
			if (searchCache.get(cacheKey) === entry) searchCache.delete(cacheKey);
			throw error;
		});
	}
	searchCache.delete(cacheKey);
	searchCache.set(cacheKey, entry);
	pruneMapToMaxSize(searchCache, SEARCH_CACHE_LIMIT);
	try {
		return await racePromiseWithAbortSignal(entry.promise, options.signal);
	} finally {
		release();
		assertSelected();
	}
}
//#endregion
//#region src/gateway/server-methods/projects-list-diagnostics.ts
const diagnostics = channel("openclaw.projects.list");
function startProjectsListDiagnostics(context) {
	if (!areDiagnosticsEnabledForProcess() && !diagnostics.hasSubscribers) return;
	const timing = createStageTimingTracker(() => performance.now());
	let phase = "registry";
	const mark = (next) => {
		timing.mark(phase);
		phase = next;
	};
	return {
		mark,
		finish() {
			timing.mark(phase);
			const { totalMs, stages } = timing.snapshot();
			const fields = {
				operation: "projects.list",
				elapsedMs: totalMs,
				phaseDurationsMs: Object.fromEntries(stages.map(({ name, durationMs }) => [name, durationMs]))
			};
			try {
				if (diagnostics.hasSubscribers) diagnostics.publish(fields);
				if (totalMs >= 1e3 && areDiagnosticsEnabledForProcess()) context.logGateway?.warn("projects.list: slow request", fields);
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/projects-recents.ts
function folderDisplayName(folder) {
	return folder.replace(/[\\/]+$/u, "").split(/[\\/]/u).at(-1) || folder;
}
function indexPathProjects(projects) {
	const byPath = /* @__PURE__ */ new Map();
	const byAgent = /* @__PURE__ */ new Map();
	for (const project of projects) {
		if (project.source === "workspace") byAgent.set(project.agentId, project);
		const previous = byPath.get(project.repoRoot);
		if (!previous || (Number(project.source === "workspace") - Number(previous.source === "workspace") || project.id.localeCompare(previous.id)) < 0) byPath.set(project.repoRoot, project);
	}
	return {
		byPath,
		byAgent
	};
}
async function listProjectRecents(store, profileIds, projects) {
	const candidates = Object.entries(store).filter(([, entry]) => Boolean(sessionCreatorProfileId(entry.createdActor)) && Boolean(entry.createdActor?.id && profileIds.has(entry.createdActor.id))).toSorted(([leftKey, left], [rightKey, right]) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0) || leftKey.localeCompare(rightKey));
	const projectsById = new Map(projects.map((project) => [project.id, project]));
	const seen = /* @__PURE__ */ new Set();
	const recents = [];
	let pathProjects;
	for (const [sessionKey, entry] of candidates) {
		if (entry.repositoryWorkspaceId) {
			const repository = await getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId);
			const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
			if (!repository || repository.sessionKey !== sessionKey || sessionAgentId && repository.agentId !== sessionAgentId || seen.has(repository.url)) continue;
			seen.add(repository.url);
			recents.push({
				kind: "repository",
				url: repository.url,
				displayName: path.posix.basename(repository.url, ".git")
			});
			if (recents.length === 8) break;
			continue;
		}
		const projectId = normalizeOptionalString(entry.projectId);
		const explicitProject = projectId ? projectsById.get(projectId) : void 0;
		const worktreeRoot = normalizeOptionalString(entry.worktree?.repoRoot);
		const spawnedCwd = normalizeOptionalString(entry.spawnedCwd);
		const execCwd = normalizeOptionalString(entry.execCwd);
		const folder = worktreeRoot ?? spawnedCwd ?? execCwd;
		let project = explicitProject;
		if (!project && folder) {
			const agentId = parseAgentSessionKey(sessionKey)?.agentId;
			const indexed = pathProjects ??= indexPathProjects(projects);
			const workspace = indexed.byAgent.get(agentId);
			project = workspace?.repoRoot === folder ? workspace : indexed.byPath.get(folder);
		}
		const key = project ? `project:${project.id}` : folder ? `folder:${normalizeOptionalString(entry.execNode) ?? ""}\0${folder}` : void 0;
		if (!key || seen.has(key)) continue;
		seen.add(key);
		recents.push(project ? {
			kind: "project",
			projectId: project.id,
			displayName: project.displayName
		} : {
			kind: "folder",
			folder,
			displayName: folderDisplayName(folder),
			...normalizeOptionalString(entry.execNode) ? { execNode: normalizeOptionalString(entry.execNode) } : {}
		});
		if (recents.length === 8) break;
	}
	return recents;
}
//#endregion
//#region src/gateway/server-methods/projects.ts
const PROJECTS_LIST_MAX_RAW_CANDIDATES = Math.max(50, 50, 32);
function checkoutName(checkoutPath) {
	const trimmed = checkoutPath.replace(/[\\/]+$/u, "");
	return trimmed.split(/[\\/]/u).at(-1) || trimmed;
}
function compareRawProjectCandidates(left, right) {
	return right.lastUsedAt - left.lastUsedAt || left.checkoutPath.localeCompare(right.checkoutPath) || left.kind.localeCompare(right.kind);
}
function retainNewestRawProjectCandidate(candidates, candidate) {
	const insertionIndex = candidates.findIndex((existing) => compareRawProjectCandidates(candidate, existing) < 0);
	if (insertionIndex < 0) {
		if (candidates.length < PROJECTS_LIST_MAX_RAW_CANDIDATES) candidates.push(candidate);
		return;
	}
	candidates.splice(insertionIndex, 0, candidate);
	if (candidates.length > PROJECTS_LIST_MAX_RAW_CANDIDATES) candidates.pop();
}
function sanitizePublicOriginUrl(originUrl) {
	const trimmed = originUrl.trim();
	const suffixIndex = trimmed.search(/[?#]/u);
	const withoutSuffix = suffixIndex < 0 ? trimmed : trimmed.slice(0, suffixIndex);
	const scp = /^[^@\s/:]+@(\[[^\]]+\]|[^:\s]+):(.+)$/u.exec(withoutSuffix);
	if (scp) return `${scp[1]}:${scp[2]}`;
	let parsed;
	try {
		parsed = new URL(withoutSuffix);
	} catch {
		return;
	}
	if (!parsed.username && !parsed.password) return withoutSuffix;
	parsed.username = "";
	parsed.password = "";
	return parsed.toString();
}
function sanitizeProjectRecord(project) {
	const { originUrl, ...record } = project;
	const sanitizedOriginUrl = originUrl ? sanitizePublicOriginUrl(originUrl) : void 0;
	return {
		...record,
		...sanitizedOriginUrl ? { originUrl: sanitizedOriginUrl } : {}
	};
}
function projectCheckoutError(error) {
	return errorShape(error instanceof ProjectCheckoutError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
function projectCandidatesToSummaries(candidates) {
	const groups = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const group = groups.get(candidate.fingerprint) ?? {
			checkouts: /* @__PURE__ */ new Map(),
			lastUsedAt: candidate.lastUsedAt,
			name: checkoutName(candidate.checkoutPath),
			nameUsedAt: candidate.lastUsedAt
		};
		const checkout = group.checkouts.get(candidate.checkoutPath);
		if (!checkout || candidate.lastUsedAt > checkout.lastUsedAt) group.checkouts.set(candidate.checkoutPath, {
			path: candidate.checkoutPath,
			lastUsedAt: candidate.lastUsedAt
		});
		group.lastUsedAt = Math.max(group.lastUsedAt, candidate.lastUsedAt);
		if (candidate.lastUsedAt > group.nameUsedAt) {
			group.name = checkoutName(candidate.checkoutPath);
			group.nameUsedAt = candidate.lastUsedAt;
		}
		if (!group.originUrl && candidate.originUrl) group.originUrl = candidate.originUrl;
		groups.set(candidate.fingerprint, group);
	}
	return [...groups.values()].toSorted((left, right) => right.lastUsedAt - left.lastUsedAt || left.name.localeCompare(right.name)).slice(0, 50).map((group) => {
		const summary = {
			name: group.name,
			checkouts: [...group.checkouts.values()].toSorted((left, right) => right.lastUsedAt - left.lastUsedAt || left.path.localeCompare(right.path)).slice(0, 50).map((checkout) => ({
				runnerId: "gateway",
				path: checkout.path
			})),
			lastUsedAt: group.lastUsedAt
		};
		if (group.originUrl) {
			const originUrl = sanitizePublicOriginUrl(group.originUrl);
			if (originUrl) summary.originUrl = originUrl;
		}
		return summary;
	});
}
async function listObservedProjects(service, context, client, store, diagnostics) {
	diagnostics?.mark("worktreeRegistry");
	const worktrees = await service.listRegistryRecords();
	diagnostics?.mark("sessionCandidates");
	const cfg = context.getRuntimeConfig();
	const rawCandidates = [];
	const visibilityFilter = createSessionListEntryFilter({
		client,
		cfg
	});
	const canSeeAll = !visibilityFilter;
	for (const [sessionKey, entry] of Object.entries(store)) {
		if (visibilityFilter && !visibilityFilter(sessionKey, entry)) continue;
		const checkoutPath = entry.execCwd?.trim();
		if (checkoutPath && !entry.execNode?.trim()) retainNewestRawProjectCandidate(rawCandidates, {
			kind: "session",
			checkoutPath,
			lastUsedAt: entry.updatedAt
		});
	}
	diagnostics?.mark("worktreeCandidates");
	for (const worktree of worktrees) {
		if (worktree.removedAt !== void 0) continue;
		if (!canSeeAll) {
			const ownerId = worktree.ownerKind === "session" ? worktree.ownerId?.trim() : void 0;
			const ownerEntry = ownerId ? store[ownerId] : void 0;
			if (!ownerId || !ownerEntry || !visibilityFilter?.(ownerId, ownerEntry)) continue;
		}
		retainNewestRawProjectCandidate(rawCandidates, {
			kind: "worktree",
			checkoutPath: worktree.path,
			fingerprint: worktree.repoFingerprint,
			lastUsedAt: worktree.lastActiveAt,
			repoRoot: worktree.repoRoot
		});
	}
	diagnostics?.mark("identityProbes");
	const probePaths = [...new Set(rawCandidates.map((raw) => raw.kind === "worktree" ? raw.repoRoot : raw.checkoutPath))].slice(0, 32).toSorted();
	const results = probePaths.length ? await service.resolveRepositoryIdentities(probePaths) : [];
	const identities = new Map(probePaths.map((checkoutPath, index) => [checkoutPath, results[index]]));
	diagnostics?.mark("candidateProcessing");
	const candidates = [];
	for (const raw of rawCandidates) {
		const identity = identities.get(raw.kind === "worktree" ? raw.repoRoot : raw.checkoutPath);
		if (raw.kind === "worktree") {
			candidates.push({
				checkoutPath: raw.checkoutPath,
				fingerprint: raw.fingerprint,
				lastUsedAt: raw.lastUsedAt,
				...identity?.originUrl ? { originUrl: identity.originUrl } : {}
			});
			continue;
		}
		if (identity) candidates.push({
			checkoutPath: identity.checkoutRoot,
			fingerprint: identity.fingerprint,
			lastUsedAt: raw.lastUsedAt,
			...identity.originUrl ? { originUrl: identity.originUrl } : {}
		});
	}
	return projectCandidatesToSummaries(candidates);
}
function findProjectCheckoutReference(cfg, repoRoot) {
	const normalizedRoot = path.resolve(repoRoot);
	const workspaceReference = listWorkspaceProjects(cfg).find((candidate) => path.resolve(candidate.repoRoot) === normalizedRoot);
	const worktreeReference = listRegistryWorktrees(process.env).find((worktree) => !worktree.removedAt && path.resolve(worktree.repoRoot) === normalizedRoot);
	const sessionReference = Object.entries(loadCombinedSessionStoreForGatewayCore(cfg, { projection: "list" }).store).find(([, entry]) => {
		if (entry.archivedAt) return false;
		const sessionRoot = entry.worktree?.repoRoot;
		if (sessionRoot && path.resolve(sessionRoot) === normalizedRoot) return true;
		const cwd = entry.spawnedCwd;
		return Boolean(cwd && (path.resolve(cwd) === normalizedRoot || isPathInside(normalizedRoot, path.resolve(cwd))));
	});
	return workspaceReference ? `agent workspace ${workspaceReference.displayName}` : worktreeReference ? `managed worktree ${worktreeReference.name}` : sessionReference ? `session ${sessionReference[0]}` : void 0;
}
function createProjectsHandlers(service) {
	return {
		"projects.list": async ({ params, respond, context, client }) => {
			if (!assertValidParams(params, validateProjectsListParams, "projects.list", respond)) return;
			const diagnostics = startProjectsListDiagnostics(context);
			const cfg = context.getRuntimeConfig();
			const defaultRepository = configuredDefaultRepository(cfg);
			const requesterProfileId = client?.authenticatedUserProfile?.profileId;
			const requesterUserId = client?.authenticatedUserId;
			const accessRevision = readGatewayAccessRevision();
			const assertCurrent = () => {
				if (client?.authenticatedUserProfile?.profileId !== requesterProfileId || client?.authenticatedUserId !== requesterUserId || readGatewayAccessRevision() !== accessRevision || context.getRuntimeConfig() !== cfg) throw new Error("Project access changed while preparing the listing. Retry the request.");
			};
			try {
				const registryProjects = await listProjectRegistry(cfg);
				assertCurrent();
				diagnostics?.mark("sessions");
				const projects = registryProjects.map(sanitizeProjectRecord);
				const canWrite = () => authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed;
				const canCreateSession = () => authorizeOperatorScopesForMethod("sessions.create", Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed;
				let store = {};
				let observedProjects;
				if (client?.authenticatedUserProfile?.profileId || params.includeObserved && canWrite()) {
					if (params.includeObserved) store = (await loadCombinedSessionStoreForGatewayCoreAsync(cfg, { projection: "list" })).store;
					else {
						const projection = requireSessionRowProjection(context);
						do
							await projection.ensureMaterialized();
						while (projection.needsMaterialization);
						assertCurrent();
						if (getSessionRowProjection(context) !== projection || projection.state.cfg !== cfg) throw new Error("Session projection changed while preparing the listing. Retry the request.");
						store = loadCombinedSessionStoreForGatewayCore(cfg, {
							projection: "list",
							loadEntries: (target) => projection.selectEntries({
								storePath: target.storePath,
								sortBy: null
							}).map((row) => ({
								sessionKey: row.key,
								entry: row.storedEntry ?? row.entry,
								keyBytes: Buffer.from(row.key)
							})).toSorted((left, right) => Buffer.compare(left.keyBytes, right.keyBytes))
						}).store;
					}
					assertCurrent();
				}
				if (params.includeObserved && canWrite()) {
					observedProjects = await listObservedProjects(service, context, client, store, diagnostics);
					assertCurrent();
				}
				diagnostics?.mark("recents");
				const profileId = client?.authenticatedUserProfile?.profileId;
				const recentProfileIds = profileId ? readCurrentUserProfileAliases(profileId) : void 0;
				const recents = recentProfileIds ? await listProjectRecents(store, recentProfileIds, registryProjects) : void 0;
				assertCurrent();
				diagnostics?.mark("response");
				assertCurrent();
				const writable = canWrite();
				const canCreate = canCreateSession();
				respond(true, {
					projects: writable ? projects : projects.map(({ id, displayName, source, agentId }) => agentId ? {
						id,
						displayName,
						source,
						agentId
					} : {
						id,
						displayName,
						source
					}),
					...canCreate ? { githubHost: resolveConfiguredGitHubHost(cfg) } : {},
					...defaultRepository && (writable || canCreate) ? { defaultRepository } : {},
					...recents ? { recents: writable ? recents : recents.filter((recent) => recent.kind === "project") } : {},
					...writable && observedProjects ? { observedProjects } : {}
				}, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			} finally {
				diagnostics?.finish();
			}
		},
		"projects.register": defineValidatedGatewayHandler("projects.register", validateProjectsRegisterParams, async ({ params, respond }) => {
			respond(true, sanitizeProjectRecord(await registerProjectRegistry({
				path: params.path,
				name: params.name
			})), void 0);
		}, projectCheckoutError),
		"projects.add": async ({ params, respond, context, signal }) => {
			if (!assertValidParams(params, validateProjectsAddParams, "projects.add", respond)) return;
			try {
				const cfg = context.getRuntimeConfig();
				respond(true, await materializeProjectClone({
					cfg,
					gitUrl: params.gitUrl,
					name: params.name
				}, {
					signal,
					token: githubApiToken(process.env, cfg)
				}), void 0);
			} catch (error) {
				if (isTrustedSecretSurfaceUnavailableError(error)) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE, {
						details: {
							code: GatewayErrorDetailCodes.PROJECT_CLONE_FAILED,
							cause: "auth_required"
						},
						retryable: false
					}));
					return;
				}
				if (error instanceof ProjectCloneError) {
					respond(false, void 0, errorShape(error.failure === "invalid_url" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error.message, {
						details: {
							code: GatewayErrorDetailCodes.PROJECT_CLONE_FAILED,
							cause: error.failure
						},
						retryable: error.failure === "network" || error.failure === "clone_failed"
					}));
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
		},
		"projects.searchRemote": defineValidatedGatewayHandler("projects.searchRemote", validateProjectsSearchRemoteParams, async ({ params, respond, context, signal, hasCurrentClientAuthority }) => {
			const cfg = context.getRuntimeConfig();
			const host = resolveConfiguredGitHubHost(cfg);
			const apiBaseUrl = resolveConfiguredGitHubApiBaseUrl(cfg);
			const assertCurrent = () => {
				signal?.throwIfAborted();
				if (hasCurrentClientAuthority?.() === false) throw new Error("Project requester authority changed during search");
				if (context.getRuntimeConfig() !== cfg) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub host changed during project search");
			};
			assertCurrent();
			const nativeToken = cfg.gateway?.projects?.nativeGitHubSearch === true ? await readCachedNativeGitHubToken(process.env) : void 0;
			assertCurrent();
			const result = await searchRemoteProjects(params.query, {
				assertCurrent,
				signal,
				host,
				apiBaseUrl,
				...cfg.gateway?.projects?.nativeGitHubSearch === true ? { token: nativeToken ?? "" } : {}
			});
			assertCurrent();
			respond(true, result, void 0);
		}, (error) => {
			const { message, ...details } = error instanceof gitHubPublicApi.ControlUiGitHubError || isTrustedSecretSurfaceUnavailableError(error) ? gitHubPublicApi.formatControlUiGitHubPreviewError(error) : {
				message: "GitHub project search is unavailable. Retry shortly.",
				retryable: true
			};
			return errorShape(ErrorCodes.UNAVAILABLE, message, details);
		}),
		"projects.remove": async ({ params, respond, context }) => {
			if (!assertValidParams(params, validateProjectsRemoveParams, "projects.remove", respond)) return;
			const respondUnknownProject = () => {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${params.id}`));
			};
			const project = await resolveProjectRegistry(context.getRuntimeConfig(), params.id);
			if (!project || project.source === "workspace") {
				respondUnknownProject();
				return;
			}
			let removed;
			if (params.deleteCheckout) {
				if (project.source !== "cloned") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Only projects cloned by the Gateway can delete their checkout."));
					return;
				}
				try {
					removed = await removeClonedProjectCheckout(project, () => {
						const reference = findProjectCheckoutReference(context.getRuntimeConfig(), project.repoRoot);
						if (reference) throw new ProjectCheckoutError(`Project checkout is still referenced by ${reference}. Remove that reference before deleting the checkout.`);
					});
				} catch (error) {
					respond(false, void 0, projectCheckoutError(error));
					return;
				}
			} else removed = await removeProjectRegistry(project);
			if (!removed) {
				respondUnknownProject();
				return;
			}
			respond(true, { removed: true }, void 0);
		}
	};
}
const projectsHandlers = createProjectsHandlers(managedWorktrees);
//#endregion
export { projectsHandlers };
