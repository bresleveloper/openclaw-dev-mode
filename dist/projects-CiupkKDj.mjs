import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _r as validateProjectsAddParams, br as validateProjectsRemoveParams, vr as validateProjectsListParams, xr as validateProjectsSearchRemoteParams, yr as validateProjectsRegisterParams } from "./src-BRUl7oDv.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { h as readCurrentUserProfileAliases } from "./user-profile-list-B5pNqyXa.mjs";
import { v as readGatewayAccessRevision } from "./operator-role-policy-Bt6aG_wj.mjs";
import { o as sessionCreatorProfileId } from "./session-entry-provenance-C-JyMH54.mjs";
import { Z as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { n as loadCombinedSessionStoreForGatewayCore, r as loadCombinedSessionStoreForGatewayCoreAsync } from "./combined-store-gateway-Bb3P3TzM.mjs";
import { E as createSessionListEntryFilter } from "./session-sharing-C_5FkkwM.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import "./session-utils-AxixtEyo.mjs";
import { a as managedWorktrees } from "./service-BPmV9ykg.mjs";
import { y as listRegistryWorktrees } from "./registry-UFMGRqcd.mjs";
import { n as gitHubPublicApi, r as githubApiToken, t as CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE } from "./github-public-api-GYcLjPMx.mjs";
import { a as removeProjectRegistry, n as listWorkspaceProjects, p as ProjectCheckoutError, r as registerProjectRegistry, s as resolveProjectRegistry, t as listProjectRegistry } from "./project-registry-CT4rCnL9.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { i as ProjectCloneError, r as removeClonedProjectCheckout, t as materializeProjectClone } from "./project-clone-5R1HzM6y.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D2byNTeD.mjs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { channel } from "node:diagnostics_channel";
//#region src/gateway/project-github-search.ts
const SEARCH_CACHE_MS = 6e4;
const SEARCH_CACHE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 10;
const AFFILIATED_RESULT_LIMIT = 10;
const EXACT_REPO_QUERY = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;
const searchCache = /* @__PURE__ */ new Map();
function boundedString(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.slice(0, maxLength) : void 0;
}
function parseRepository(value) {
	if (!isRecord(value)) return null;
	const fullName = readNonBlankString(value.full_name);
	const name = readNonBlankString(value.name);
	if (!fullName || !name) return null;
	const clone = parseProjectGitUrl(readNonBlankString(value.clone_url) ?? "");
	const webUrl = boundedString(readNonBlankString(value.html_url), 2048);
	if (!clone || !webUrl) return null;
	const description = boundedString(readNonBlankString(value.description), 500);
	return {
		name: name.slice(0, 100),
		fullName: fullName.slice(0, 200),
		cloneUrl: clone.url,
		webUrl,
		private: value.private === true,
		...description ? { description } : {}
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
async function loadExactRepository(query, fetchImpl, token) {
	const url = new URL(`/repos/${query}`, gitHubPublicApi.GITHUB_API_ORIGIN);
	try {
		return parseRepository(await gitHubPublicApi.fetchGitHubJson(url.href, fetchImpl, token));
	} catch {
		return null;
	}
}
async function loadAffiliatedRepositories(fetchImpl, token) {
	const url = new URL("/user/repos", gitHubPublicApi.GITHUB_API_ORIGIN);
	url.searchParams.set("affiliation", "owner,collaborator,organization_member");
	url.searchParams.set("sort", "updated");
	url.searchParams.set("direction", "desc");
	url.searchParams.set("per_page", String(AFFILIATED_RESULT_LIMIT));
	try {
		const response = await gitHubPublicApi.fetchGitHubApi(url.href, fetchImpl, token);
		return repositoryArray(await gitHubPublicApi.readGitHubJsonResponse(response));
	} catch {
		return [];
	}
}
async function loadRepositorySearch(query, fetchImpl, token) {
	const url = new URL("/search/repositories", gitHubPublicApi.GITHUB_API_ORIGIN);
	url.searchParams.set("q", `${query} in:name,description`);
	url.searchParams.set("per_page", String(SEARCH_RESULT_LIMIT));
	return repositoryArray(await gitHubPublicApi.fetchGitHubJson(url.href, fetchImpl, token));
}
async function searchProjectsUncached(params) {
	const [exact, affiliated, global] = await Promise.all([
		EXACT_REPO_QUERY.test(params.query) ? loadExactRepository(params.query, params.fetchImpl, params.token) : null,
		params.token ? loadAffiliatedRepositories(params.fetchImpl, params.token) : [],
		loadRepositorySearch(params.query, params.fetchImpl, params.token)
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
function searchRemoteProjects(query, options = {}) {
	const normalizedQuery = query.trim().toLowerCase();
	const { token, cacheScope } = gitHubPublicApi.resolveGitHubApiCredentialScope(options.env);
	const cacheKey = `${normalizedQuery}\0${cacheScope}`;
	const now = options.now ?? Date.now();
	const cached = searchCache.get(cacheKey);
	if (cached && cached.expiresAt > now) {
		searchCache.delete(cacheKey);
		searchCache.set(cacheKey, cached);
		return cached.promise;
	}
	const promise = searchProjectsUncached({
		query: query.trim(),
		fetchImpl: options.fetchImpl ?? fetch,
		token
	}).catch((error) => {
		if (searchCache.get(cacheKey)?.promise === promise) searchCache.delete(cacheKey);
		throw error;
	});
	searchCache.set(cacheKey, {
		expiresAt: now + SEARCH_CACHE_MS,
		promise
	});
	pruneMapToMaxSize(searchCache, SEARCH_CACHE_LIMIT);
	return promise;
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
function listProjectRecents(store, profileIds, projects) {
	const candidates = Object.entries(store).filter(([, entry]) => Boolean(sessionCreatorProfileId(entry.createdActor)) && Boolean(entry.createdActor?.id && profileIds.has(entry.createdActor.id))).toSorted(([leftKey, left], [rightKey, right]) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0) || leftKey.localeCompare(rightKey));
	const projectsById = new Map(projects.map((project) => [project.id, project]));
	const seen = /* @__PURE__ */ new Set();
	const recents = [];
	let pathProjects;
	for (const [sessionKey, entry] of candidates) {
		if (entry.repositoryWorkspaceId) {
			const repository = getSessionRepositoryWorkspaceStore().get(entry.repositoryWorkspaceId);
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
	const probePaths = [...new Set(rawCandidates.map((raw) => raw.kind === "worktree" ? raw.repoRoot : raw.checkoutPath))].slice(0, 32);
	const { results } = await runTasksWithConcurrency({
		tasks: probePaths.map((checkoutPath) => () => service.resolveRepositoryIdentity(checkoutPath)),
		limit: 4
	});
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
			try {
				const registryProjects = await listProjectRegistry(context.getRuntimeConfig());
				diagnostics?.mark("sessions");
				const projects = registryProjects.map(sanitizeProjectRecord);
				const cfg = context.getRuntimeConfig();
				const requesterProfileId = client?.authenticatedUserProfile?.profileId;
				const requesterUserId = client?.authenticatedUserId;
				const accessRevision = readGatewayAccessRevision();
				const assertCurrent = () => {
					if (client?.authenticatedUserProfile?.profileId !== requesterProfileId || client?.authenticatedUserId !== requesterUserId || readGatewayAccessRevision() !== accessRevision || context.getRuntimeConfig() !== cfg) throw new Error("Project access changed while preparing the listing. Retry the request.");
				};
				const canWrite = () => authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed;
				let store = {};
				let observedProjects;
				try {
					if (client?.authenticatedUserProfile?.profileId || params.includeObserved && canWrite()) {
						if (params.includeObserved) store = (await loadCombinedSessionStoreForGatewayCoreAsync(cfg, { projection: "list" })).store;
						else {
							const projection = getSessionRowProjection(context);
							if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
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
				} catch (error) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
					return;
				}
				diagnostics?.mark("recents");
				const profileId = client?.authenticatedUserProfile?.profileId;
				const recentProfileIds = profileId ? readCurrentUserProfileAliases(profileId) : void 0;
				const recents = recentProfileIds ? listProjectRecents(store, recentProfileIds, registryProjects) : void 0;
				diagnostics?.mark("response");
				if (canWrite()) {
					respond(true, {
						projects,
						...recents ? { recents } : {},
						...observedProjects ? { observedProjects } : {}
					}, void 0);
					return;
				}
				respond(true, {
					projects: projects.map((project) => project.agentId ? {
						id: project.id,
						displayName: project.displayName,
						source: project.source,
						agentId: project.agentId
					} : {
						id: project.id,
						displayName: project.displayName,
						source: project.source
					}),
					...recents ? { recents: recents.filter((recent) => recent.kind === "project") } : {}
				}, void 0);
			} finally {
				diagnostics?.finish();
			}
		},
		"projects.register": async ({ params, respond }) => {
			if (!assertValidParams(params, validateProjectsRegisterParams, "projects.register", respond)) return;
			try {
				respond(true, sanitizeProjectRecord(await registerProjectRegistry({
					path: params.path,
					name: params.name
				})), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(error instanceof ProjectCheckoutError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
		},
		"projects.add": async ({ params, respond, context, signal }) => {
			if (!assertValidParams(params, validateProjectsAddParams, "projects.add", respond)) return;
			try {
				respond(true, await materializeProjectClone({
					cfg: context.getRuntimeConfig(),
					gitUrl: params.gitUrl,
					name: params.name
				}, {
					signal,
					token: githubApiToken()
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
		"projects.searchRemote": async ({ params, respond }) => {
			if (!assertValidParams(params, validateProjectsSearchRemoteParams, "projects.searchRemote", respond)) return;
			try {
				respond(true, await searchRemoteProjects(params.query), void 0);
			} catch (error) {
				const { message, ...details } = error instanceof gitHubPublicApi.ControlUiGitHubError || isTrustedSecretSurfaceUnavailableError(error) ? gitHubPublicApi.formatControlUiGitHubPreviewError(error) : {
					message: "GitHub project search is unavailable. Retry shortly.",
					retryable: true
				};
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, details));
			}
		},
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
					respond(false, void 0, errorShape(error instanceof ProjectCheckoutError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
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
