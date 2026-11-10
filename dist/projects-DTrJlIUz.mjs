import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Br as validateProjectsAddParams, Gr as validateProjectsSearchRemoteParams, Hr as validateProjectsListParams, Ng as errorShape, Ur as validateProjectsRegisterParams, Vr as validateProjectsCheckoutOptionsParams, Wr as validateProjectsRemoveParams } from "./src-pLJQA6J5.mjs";
import { f as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { n as authorizeOperatorScopesForMethod, r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { l as resolveCreatorSandbox, n as authorizeGatewaySessionCreation } from "./operator-role-policy-Coro3qc5.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { D as getSessionRepositoryWorkspaceStore, E as findSessionRepositoryWorkspaces } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as resolveSessionCreateAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as resolveConfiguredGitHubHost, r as resolveConfiguredGitHubApiBaseUrl } from "./github-host-N2fYlLEb.mjs";
import { n as gitHubPublicApi, r as githubApiToken, t as CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE } from "./github-public-api-Dk3IZSKx.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as createStaleWhileRevalidateCache } from "./stale-while-revalidate-cache-DAV-95y_.mjs";
import { o as readCachedNativeGitHubToken } from "./github-read-identity-BB6UxasN.mjs";
import { i as captureWorktreeRunEndContext, n as captureWorktreeRegistryAuthority } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { f as readRegistryWorktrees } from "./registry-read-Do2Ks9un.mjs";
import { a as managedWorktrees } from "./service-BPAgan76.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { n as prepareCurrentUserProfileAliases } from "./user-profile-reads-DnSqXcRI.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { i as prepareSessionRowSelection } from "./session-utils-list-cYIWEFPs.mjs";
import { a as resolveProjectRegistry, d as ProjectCheckoutError, i as removeProjectRegistry, n as listWorkspaceProjects, r as registerProjectRegistry, t as listProjectRegistry } from "./project-registry-0O0PFE8w.mjs";
import { t as loadCombinedSessionStoreForGatewayCoreAsync } from "./combined-store-gateway-read-CLNpi_AQ.mjs";
import { i as ProjectCloneError, r as removeClonedProjectCheckout, t as materializeProjectClone } from "./project-clone-DK_Wghok.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import { t as configuredDefaultRepository } from "./configured-default-repository-CVheulgz.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/gateway/project-github-search.ts
const SEARCH_CACHE_MS = 6e4;
const SEARCH_CACHE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 10;
const AFFILIATED_RESULT_LIMIT = 10;
const EXACT_REPO_QUERY = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;
const searchCaches = /* @__PURE__ */ new WeakMap();
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
	return (await request(new URL(`repos/${query}`, `${gitHubPublicApi.GITHUB_API_BASE_URL}/`).href, {
		optional: true,
		single: true
	}))[0] ?? null;
}
async function loadAffiliatedRepositories(request) {
	const url = new URL("user/repos", `${gitHubPublicApi.GITHUB_API_BASE_URL}/`);
	url.searchParams.set("affiliation", "owner,collaborator,organization_member");
	url.searchParams.set("sort", "updated");
	url.searchParams.set("direction", "desc");
	url.searchParams.set("per_page", String(AFFILIATED_RESULT_LIMIT));
	return request(url.href, {
		optional: true,
		optionalAuth: false
	});
}
async function loadRepositorySearch(query, request) {
	const url = new URL("search/repositories", `${gitHubPublicApi.GITHUB_API_BASE_URL}/`);
	url.searchParams.set("q", `${query} in:name,description`);
	url.searchParams.set("per_page", String(SEARCH_RESULT_LIMIT));
	return request(url.href);
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
	const assertCurrent = () => {
		options.assertCurrent?.();
		const current = getRuntimeConfigSnapshot();
		if (resolveConfiguredGitHubHost(current) !== host || resolveConfiguredGitHubApiBaseUrl(current) !== apiBaseUrl || gitHubPublicApi.GITHUB_API_BASE_URL !== apiBaseUrl) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub host changed during project search");
	};
	const assertSelected = () => {
		options.signal?.throwIfAborted();
		assertCurrent();
	};
	assertSelected();
	const { token, cacheScope } = options.token === void 0 ? gitHubPublicApi.resolveGitHubApiCredentialScope(options.env) : {
		token: options.token,
		cacheScope: gitHubPublicApi.githubApiCredentialCacheScope(options.token)
	};
	const assertTransportCurrent = () => {
		assertCurrent();
		if (options.token === void 0 && gitHubPublicApi.resolveGitHubApiCredentialScope(options.env).cacheScope !== cacheScope) throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub identity changed during search");
	};
	const fetchImpl = options.fetchImpl ?? fetch;
	const cache = searchCaches.get(fetchImpl) ?? createStaleWhileRevalidateCache({
		maxEntries: SEARCH_CACHE_LIMIT,
		ttlMs: SEARCH_CACHE_MS,
		onBackgroundError: () => logWarn("projects: GitHub repository search refresh failed")
	});
	searchCaches.set(fetchImpl, cache);
	let stale = false;
	const request = async (url, { optionalAuth = true, optional, single } = {}) => {
		const identity = {
			assertSelected: assertTransportCurrent,
			revalidate: async () => assertTransportCurrent()
		};
		const result = await cache.read(`${url}\0${host}\0${cacheScope}`, (previous) => {
			const load = async () => {
				const readJson = async (requestToken) => {
					assertTransportCurrent();
					const credentialScope = gitHubPublicApi.githubApiCredentialCacheScope(requestToken);
					const cached = previous?.credentialScope === credentialScope ? previous : void 0;
					const response = await gitHubPublicApi.fetchGitHubApi(url, fetchImpl, requestToken, void 0, identity, cached?.etag, getAsyncWorkSignal(), void 0, apiBaseUrl);
					if (response.status === 304 && cached?.etag) {
						await gitHubPublicApi.discardResponse(response);
						assertTransportCurrent();
						return cached;
					}
					const value = await gitHubPublicApi.readGitHubJsonResponse(response);
					const repository = single ? parseRepository(value) : null;
					const projects = single ? repository ? [repository] : [] : repositoryArray(value);
					assertTransportCurrent();
					return {
						projects,
						etag: response.headers.get("etag") ?? void 0,
						credentialScope
					};
				};
				try {
					return await (optionalAuth ? gitHubPublicApi.withOptionalGitHubAuth(token, readJson) : readJson(token));
				} catch (error) {
					assertTransportCurrent();
					if (!optional) throw error;
					return {
						projects: [],
						credentialScope: gitHubPublicApi.githubApiCredentialCacheScope(token)
					};
				}
			};
			return options.trackExecution?.(load) ?? load();
		}).catch((error) => {
			assertTransportCurrent();
			if (!optional) throw error;
		});
		stale ||= result?.stale ?? false;
		return result?.value.projects ?? [];
	};
	try {
		const result = await racePromiseWithAbortSignal(searchProjectsUncached({
			query: query.trim().toLowerCase(),
			request,
			token
		}), options.signal);
		assertTransportCurrent();
		return stale ? {
			...result,
			stale: true
		} : result;
	} finally {
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
async function listProjectRecents(store, getSessionAgentId, profileIds, projects, usedSessions) {
	const candidates = Object.entries(store).filter(([, entry]) => Boolean(sessionCreatorProfileId(entry.createdActor)) && Boolean(entry.createdActor?.id && profileIds.has(entry.createdActor.id))).toSorted(([leftKey, left], [rightKey, right]) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0) || leftKey.localeCompare(rightKey));
	const projectsById = new Map(projects.map((project) => [project.id, project]));
	const seen = /* @__PURE__ */ new Set();
	const recents = [];
	let pathProjects;
	for (let offset = 0; offset < candidates.length && recents.length < 8; offset += 64) {
		const batch = candidates.slice(offset, offset + 64);
		const repositoryCandidates = batch.flatMap(([sessionKey, entry]) => {
			const agentId = getSessionAgentId(sessionKey);
			return entry.repositoryWorkspaceId && agentId ? [{
				agentId,
				sessionKey
			}] : [];
		});
		const repositories = new Map((repositoryCandidates.length ? await findSessionRepositoryWorkspaces(repositoryCandidates, { path: getSessionRepositoryWorkspaceStore().path }) : []).map((repository) => [repository.workspaceId, repository]));
		for (const [sessionKey, entry] of batch) {
			if (entry.repositoryWorkspaceId) {
				const repository = repositories.get(entry.repositoryWorkspaceId);
				const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
				if (!repository || repository.sessionKey !== sessionKey || sessionAgentId && repository.agentId !== sessionAgentId || seen.has(repository.url)) continue;
				seen.add(repository.url);
				usedSessions.add(sessionKey);
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
			usedSessions.add(sessionKey);
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
	}
	return recents;
}
//#endregion
//#region src/gateway/server-methods/projects-session-store.ts
function readMemoryProjectStores(assertCurrent) {
	assertCurrent();
	const binding = getSessionActorStorageBinding({});
	binding?.actor.assertReadable();
	const root = binding ? path.resolve(binding.path, "../../../..") : path.resolve(resolveStateDir());
	const authority = {
		assertCurrent() {
			assertCurrent();
			binding?.actor.assertReadable();
			binding?.authority.assertCurrent();
		},
		authorize: (...args) => binding?.authority.authorize(...args)
	};
	return memorySessionActorOwners.list().filter((owner) => path.resolve(owner.path, "../../../..") === root).map((owner) => ({
		agentId: owner.agentId,
		storePath: owner.path,
		read: (sessionKey) => owner.readSession(sessionKey, authority),
		entries: owner.listSessions(authority).flatMap(({ target, entry, members }) => entry ? [{
			sessionKey: target.sessionKey,
			entry,
			members
		}] : [])
	}));
}
/** Only changed disclosure authority retires a prepared private project listing. */
function assertMemoryProjectStoresCurrent(stores, keys, assertCurrent) {
	assertCurrent();
	for (const store of stores) for (const selected of store.entries) {
		if (!keys.has(selected.sessionKey)) continue;
		const latest = store.read(selected.sessionKey);
		if (!latest || [
			"sessionId",
			"lifecycleRevision",
			"createdActor",
			"visibility"
		].some((field) => !isDeepStrictEqual(selected.entry[field], latest.entry?.[field])) || !isDeepStrictEqual(selected.members, latest.members)) throw new Error("Project access changed while preparing the listing. Retry the request.");
	}
}
function loadProjectSessionStore(projection, memoryStores) {
	const selection = prepareSessionRowSelection(projection, {}, {
		metadataPrepared: true,
		ordered: true
	});
	const paths = projection.state.scope({}).paths;
	const selectedEntries = selection.entries("all");
	const targets = new Map(selectedEntries.map(([key]) => [key, selection.getTarget(key)]));
	const entries = selectedEntries.map(([key, entry]) => ({
		key,
		entry,
		keyBytes: Buffer.from(key),
		order: paths.get(targets.get(key).storeTarget.storePath)
	})).toSorted((left, right) => left.order - right.order || Buffer.compare(left.keyBytes, right.keyBytes));
	const store = Object.fromEntries(entries.map(({ key, entry }) => [key, entry]));
	const privateAgents = /* @__PURE__ */ new Map();
	for (const source of memoryStores) for (const { sessionKey, entry } of source.entries) {
		store[sessionKey] = entry;
		privateAgents.set(sessionKey, source.agentId);
	}
	return {
		store,
		agentId: (key) => privateAgents.get(key) ?? targets.get(key)?.agentId,
		assertCurrent(keys) {
			for (const key of keys) {
				if (privateAgents.has(key)) continue;
				const target = targets.get(key);
				const query = target && {
					agentId: target.agentId,
					storePath: target.storeTarget.storePath,
					key: target.key
				};
				const current = query && projection.capture(query)?.generation === target?.generation ? projection.readCapabilityEntry(query)?.entry : void 0;
				if (!current || [
					"sessionId",
					"lifecycleRevision",
					"createdActor",
					"visibility",
					"incognito"
				].some((field) => !isDeepStrictEqual(store[key]?.[field], current[field]))) throw new Error("Project access changed while preparing the listing. Retry the request.");
			}
		}
	};
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
	if (insertionIndex < 0 && candidates.length >= PROJECTS_LIST_MAX_RAW_CANDIDATES) return;
	candidates.splice(insertionIndex < 0 ? candidates.length : insertionIndex, 0, candidate);
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
			lastUsedAt: entry.updatedAt,
			sessionKey
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
			repoRoot: worktree.repoRoot,
			sessionKey: worktree.ownerKind === "session" ? worktree.ownerId?.trim() : void 0
		});
	}
	diagnostics?.mark("identityProbes");
	const probePaths = [...new Set(rawCandidates.map((raw) => raw.kind === "worktree" ? raw.repoRoot : raw.checkoutPath))].slice(0, 32).toSorted();
	const results = probePaths.length ? await service.resolveRepositoryIdentities(probePaths) : [];
	const identities = new Map(probePaths.map((checkoutPath, index) => [checkoutPath, results[index]]));
	diagnostics?.mark("candidateProcessing");
	const candidates = [];
	const usedSessions = /* @__PURE__ */ new Set();
	for (const raw of rawCandidates) {
		const identity = identities.get(raw.kind === "worktree" ? raw.repoRoot : raw.checkoutPath);
		const checkout = raw.kind === "worktree" ? {
			checkoutPath: raw.checkoutPath,
			fingerprint: raw.fingerprint
		} : identity && {
			checkoutPath: identity.checkoutRoot,
			fingerprint: identity.fingerprint
		};
		if (!checkout) continue;
		if (raw.kind === "session" || !canSeeAll) usedSessions.add(raw.sessionKey);
		candidates.push({
			...checkout,
			lastUsedAt: raw.lastUsedAt,
			...identity?.originUrl ? { originUrl: identity.originUrl } : {}
		});
	}
	return {
		projects: projectCandidatesToSummaries(candidates),
		usedSessions,
		assertCurrent() {
			const currentFilter = createSessionListEntryFilter({
				client,
				cfg
			});
			if (currentFilter && (canSeeAll || [...usedSessions].some((key) => !currentFilter(key, store[key])))) throw new Error("Project access changed while preparing the listing. Retry the request.");
		}
	};
}
function findSessionCheckoutReference(repoRoot, entries) {
	const normalizedRoot = path.resolve(repoRoot);
	for (const [key, entry] of entries) {
		if (entry.archivedAt) continue;
		const sessionRoot = entry.worktree?.repoRoot;
		const cwd = entry.spawnedCwd;
		if (sessionRoot && path.resolve(sessionRoot) === normalizedRoot || cwd && (path.resolve(cwd) === normalizedRoot || isPathInside(normalizedRoot, path.resolve(cwd)))) return key;
	}
}
async function findProjectCheckoutReference(cfg, repoRoot, worktrees) {
	const normalizedRoot = path.resolve(repoRoot);
	const workspaceReference = listWorkspaceProjects(cfg).find((candidate) => path.resolve(candidate.repoRoot) === normalizedRoot);
	const worktreeReference = worktrees.find((worktree) => !worktree.removedAt && path.resolve(worktree.repoRoot) === normalizedRoot);
	const sessionReference = findSessionCheckoutReference(normalizedRoot, Object.entries((await loadCombinedSessionStoreForGatewayCoreAsync(cfg, {
		projection: "list",
		includeIncognito: false
	})).store));
	return workspaceReference ? `agent workspace ${workspaceReference.displayName}` : worktreeReference ? `managed worktree ${worktreeReference.name}` : sessionReference ? `session ${sessionReference}` : void 0;
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
			const assertCurrent = () => {
				if (client?.authenticatedUserProfile?.profileId !== requesterProfileId || client?.authenticatedUserId !== requesterUserId || context.getRuntimeConfig() !== cfg) throw new Error("Project access changed while preparing the listing. Retry the request.");
			};
			const list = async (memoryStores, assertMemoryCurrent) => {
				const registryProjects = await listProjectRegistry(cfg);
				diagnostics?.mark("sessions");
				const projects = registryProjects.map(sanitizeProjectRecord);
				const canWrite = () => authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, client?.connect.scopes ?? []).allowed;
				let store = {};
				let projection;
				let sessions;
				let observedProjects;
				if (client?.authenticatedUserProfile?.profileId || params.includeObserved && canWrite()) {
					projection = requireSessionRowProjection(context);
					do
						await projection.prepareSelection({ metadataOnly: true });
					while (projection.needsSelectionPreparation({ metadataOnly: true }));
					if (getSessionRowProjection(context) !== projection || projection.state.cfg !== cfg) throw new Error("Session projection changed while preparing the listing. Retry the request.");
					sessions = loadProjectSessionStore(projection, memoryStores);
					store = sessions.store;
				}
				if (params.includeObserved && canWrite()) observedProjects = await listObservedProjects(service, context, client, store, diagnostics);
				diagnostics?.mark("recents");
				const profileId = client?.authenticatedUserProfile?.profileId;
				const recentProfile = profileId ? await prepareCurrentUserProfileAliases(profileId) : void 0;
				const recentSessions = /* @__PURE__ */ new Set();
				const recents = recentProfile && sessions ? await listProjectRecents(store, sessions.agentId, recentProfile.aliases, registryProjects, recentSessions) : void 0;
				recentProfile?.assertCurrent();
				diagnostics?.mark("response");
				const writable = canWrite();
				const canCreate = authorizeOperatorScopesForMethod("sessions.create", client?.connect.scopes ?? []).allowed;
				if (projection && getSessionRowProjection(context) !== projection) throw new Error("Session projection changed while preparing the listing. Retry the request.");
				sessions?.assertCurrent(recentSessions);
				if (writable && observedProjects) {
					sessions?.assertCurrent(observedProjects.usedSessions);
					observedProjects.assertCurrent();
				}
				assertMemoryCurrent(/* @__PURE__ */ new Set([...recentSessions, ...writable && observedProjects ? observedProjects.usedSessions : []]));
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
					...writable && observedProjects ? { observedProjects: observedProjects.projects } : {}
				}, void 0);
			};
			try {
				const stores = readMemoryProjectStores(assertCurrent);
				await list(stores, (keys) => assertMemoryProjectStoresCurrent(stores, keys, assertCurrent));
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			} finally {
				diagnostics?.finish();
			}
		},
		"projects.checkoutOptions": defineValidatedGatewayHandler("projects.checkoutOptions", validateProjectsCheckoutOptionsParams, async ({ params, respond, context, client, signal, hasCurrentClientAuthority }) => {
			const cfg = context.getRuntimeConfig();
			const profileId = client?.authenticatedUserProfile?.profileId;
			const selected = resolveSessionCreateAgentId(cfg, { agentId: params.agentId });
			if (!selected.ok) {
				respond(false, void 0, selected.error);
				return;
			}
			const assertCurrent = () => {
				signal?.throwIfAborted();
				if (hasCurrentClientAuthority?.() === false || context.getRuntimeConfig() !== cfg || client?.authenticatedUserProfile?.profileId !== profileId) throw new Error("Project access changed; select the project again.");
			};
			const denied = authorizeGatewaySessionCreation({
				cfg,
				agentId: selected.agentId,
				client
			});
			if (denied) {
				respond(false, void 0, denied);
				return;
			}
			assertCurrent();
			const { resolveSessionProjectCheckoutOptions } = await import("./session-worktree-preparation-ClcfEyax.mjs");
			const options = await resolveSessionProjectCheckoutOptions({
				cfg,
				projectId: params.projectId,
				targetAgentId: selected.agentId,
				resolveSandboxRequired: () => resolveCreatorSandbox(cfg, resolveOperatorSessionCreation(client)) === "required",
				assertCurrent,
				signal
			});
			assertCurrent();
			const currentDenial = authorizeGatewaySessionCreation({
				cfg,
				agentId: selected.agentId,
				client
			});
			if (currentDenial) {
				respond(false, void 0, currentDenial);
				return;
			}
			const canCreate = authorizeOperatorScopesForMethod("sessions.create", client?.connect.scopes ?? []).allowed;
			respond(true, {
				current: canCreate && options.current,
				worktree: canCreate && options.worktree
			}, void 0);
		}, () => errorShape(ErrorCodes.UNAVAILABLE, "Checkout availability could not be checked. Select the project again.")),
		"projects.register": defineValidatedGatewayHandler("projects.register", validateProjectsRegisterParams, async ({ params, respond }) => {
			respond(true, sanitizeProjectRecord(await registerProjectRegistry({
				path: params.path,
				name: params.name
			})), void 0);
		}, projectCheckoutError),
		"projects.add": defineValidatedGatewayHandler("projects.add", validateProjectsAddParams, async ({ params, respond, context, signal }) => {
			const cfg = context.getRuntimeConfig();
			respond(true, await materializeProjectClone({
				cfg,
				gitUrl: params.gitUrl,
				name: params.name
			}, {
				signal,
				token: githubApiToken(process.env, cfg)
			}), void 0);
		}, (error) => {
			const failure = isTrustedSecretSurfaceUnavailableError(error) ? {
				cause: "auth_required",
				message: CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE
			} : error instanceof ProjectCloneError ? {
				cause: error.failure,
				message: error.message
			} : void 0;
			return failure ? errorShape(failure.cause === "invalid_url" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, failure.message, {
				details: {
					code: GatewayErrorDetailCodes.PROJECT_CLONE_FAILED,
					cause: failure.cause
				},
				retryable: failure.cause === "network" || failure.cause === "clone_failed"
			}) : errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
		}),
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
				trackExecution: (run) => context.trackExecution(run),
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
			const worktreeContext = captureWorktreeRunEndContext(process.env);
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
					const assertWorktreesCurrent = captureWorktreeRegistryAuthority(worktreeContext, [{
						id: "*",
						fields: ["identity", "removal"]
					}]);
					const worktrees = await readRegistryWorktrees(process.env, {}, worktreeContext);
					worktreeContext.admission.assertCurrent();
					assertWorktreesCurrent();
					const remove = () => {
						const assertCurrent = () => {
							worktreeContext.admission.assertCurrent();
							assertWorktreesCurrent();
							const reference = findSessionCheckoutReference(project.repoRoot, readMemoryProjectStores(() => worktreeContext.admission.assertCurrent()).flatMap((store) => store.entries.map(({ sessionKey, entry }) => [sessionKey, entry])));
							if (reference) throw new ProjectCheckoutError(`Project checkout is still referenced by session ${reference}. Remove that reference before deleting the checkout.`);
						};
						return removeClonedProjectCheckout(project, async () => {
							assertCurrent();
							const reference = await findProjectCheckoutReference(context.getRuntimeConfig(), project.repoRoot, worktrees);
							assertCurrent();
							if (reference) throw new ProjectCheckoutError(`Project checkout is still referenced by ${reference}. Remove that reference before deleting the checkout.`);
						}, { assertCurrent });
					};
					removed = await remove();
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
