import { p as normalizeTrimmedStringList, u as normalizeSortedUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as SkillUploadRequestError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { f as resolveAgentWorkspaceDir, w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { $a as validateSkillsWorkshopArchiveParams, Ga as validateSkillsSearchParams, Ha as validateSkillsBinsParams, Ja as validateSkillsStatusParams, Ka as validateSkillsSecurityVerdictsParams, Ng as errorShape, Qa as validateSkillsUploadCommitParams, Ua as validateSkillsDetailParams, Vg as buildClawHubTrustErrorDetails, Wa as validateSkillsInstallParams, Xa as validateSkillsUploadBeginParams, Ya as validateSkillsUpdateParams, Za as validateSkillsUploadChunkParams, eo as validateSkillsWorkshopChangesParams, io as validateSkillsWorkshopUndoParams, no as validateSkillsWorkshopReadParams, qa as validateSkillsSkillCardParams, ro as validateSkillsWorkshopRestoreParams, to as validateSkillsWorkshopListParams } from "./src-pLJQA6J5.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import "./redact-sentinel-f_PhnHTI.mjs";
import { t as redactConfigObject } from "./redact-snapshot-D_TnZpW0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as isValidBase64 } from "./base64-CU53EX1R.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { i as DEFAULT_MAX_ARCHIVE_BYTES_ZIP } from "./archive-R2ClviiB.mjs";
import { o as resolveNodeExecEligibilityAsync } from "./exec-defaults-DrIV-0KT.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { t as getRemoteSkillEligibility } from "./remote-CgYoyov-.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-oCdwUx69.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { v as resolveClawHubBaseUrl } from "./clawhub-client-D1-XpvK5.mjs";
import { o as fetchClawHubSkillDetail } from "./clawhub-skills-D--udhAy.mjs";
import { r as validateRequestedSkillSlug } from "./install-paths-CdlkBGI2.mjs";
import { l as parseRequestedClawHubSkillRef } from "./clawhub-store-DrAcibyA.mjs";
import { c as searchSkillsFromClawHub } from "./clawhub-status-DjGpJ2Qf.mjs";
import { i as fetchExactClawHubSkillSecurityVerdicts } from "./clawhub-install-trust-BOwMNTuQ.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { c as restoreWorkshopSkill, d as listWorkshopChanges, l as viewWorkshopSkill, n as archiveWorkshopSkill, t as WorkshopWriteError } from "./library-lvOOduU2.mjs";
import { c as refreshSkillsDiscovery, r as ensureSkillsWatcher } from "./refresh-CFj73Q4x.mjs";
import { r as prepareWorkspaceSkillEntries } from "./workspace-skill-loader-B_yVTg_A.mjs";
import { r as undoWorkshopReview } from "./review-undo-DGvC6OXg.mjs";
import { n as registerClawHubCatalogIconUrls } from "./catalog-icon-registry-QbEIkWWZ.mjs";
import { i as installSkillArchiveFromPath } from "./archive-install-C2hZs-1d.mjs";
import { r as updateSkillsFromClawHub, t as installSkillFromClawHub } from "./clawhub-DjTGy1R4.mjs";
import { i as prepareWorkspaceSkillStatus } from "./status-DQx5F0If.mjs";
import { t as buildSkillsWorkshopListResult } from "./workshop-list-DYBpEzvD.mjs";
import { n as installSkill } from "./install-D592xJM0.mjs";
import { r as skillsLibraryHandlers } from "./skills-library-Uk025IKc.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { t as withSessionDiscoveryAccess } from "./session-discovery-access-BOEBgHeh.mjs";
import { t as resolveSkillsAgentWorkspace } from "./skills-workspace-handler-RzdKHuGH.mjs";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/skills/config/mutations.ts
async function updateSkillConfigEntry(params) {
	return (await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			const entries = { ...draft.skills?.entries };
			const current = { ...entries[params.skillKey] };
			if (typeof params.enabled === "boolean") current.enabled = params.enabled;
			if (typeof params.apiKey === "string") {
				const trimmed = normalizeSecretInput(params.apiKey);
				if (trimmed === "__OPENCLAW_REDACTED__") {} else if (trimmed) current.apiKey = trimmed;
				else delete current.apiKey;
			}
			if (params.env && typeof params.env === "object") {
				const nextEnv = { ...current.env };
				for (const [key, value] of Object.entries(params.env)) {
					const trimmedKey = key.trim();
					if (!trimmedKey) continue;
					const trimmedVal = value.trim();
					if (trimmedVal === "__OPENCLAW_REDACTED__") continue;
					if (!trimmedVal) delete nextEnv[trimmedKey];
					else nextEnv[trimmedKey] = trimmedVal;
				}
				current.env = nextEnv;
			}
			entries[params.skillKey] = current;
			draft.skills = {
				...draft.skills,
				entries
			};
			return current;
		}
	})).result ?? {};
}
//#endregion
//#region src/skills/discovery/bins.ts
function collectSkillBins(entries) {
	return normalizeSortedUniqueTrimmedStringList(entries.flatMap((entry) => [
		...entry.metadata?.requires?.bins ?? [],
		...entry.metadata?.requires?.anyBins ?? [],
		...(entry.metadata?.install ?? []).flatMap((spec) => spec?.bins ?? [])
	]));
}
//#endregion
//#region src/skills/security/clawhub-verdicts.ts
function projectClawHubVerdictItem(item, target) {
	const projected = {
		registry: target.registry,
		ok: item.ok,
		decision: item.decision,
		reasons: item.reasons,
		requestedSlug: target.slug,
		requestedVersion: target.version,
		...target.ownerHandle ? { requestedOwnerHandle: target.ownerHandle } : {},
		...item.slug !== void 0 ? { slug: item.slug } : {},
		...item.version !== void 0 ? { version: item.version } : {},
		...item.displayName !== void 0 ? { displayName: item.displayName } : {},
		...item.publisherHandle !== void 0 ? { publisherHandle: item.publisherHandle } : {},
		...item.publisherDisplayName !== void 0 ? { publisherDisplayName: item.publisherDisplayName } : {},
		...item.createdAt !== void 0 ? { createdAt: item.createdAt } : {},
		...item.checkedAt !== void 0 ? { checkedAt: item.checkedAt } : {},
		...item.skillUrl !== void 0 ? { skillUrl: item.skillUrl } : {},
		...item.securityAuditUrl !== void 0 ? { securityAuditUrl: item.securityAuditUrl } : {}
	};
	const security = item.security;
	if (security && typeof security === "object") {
		if ("status" in security && typeof security.status === "string") projected.securityStatus = security.status;
		if ("passed" in security && typeof security.passed === "boolean") projected.securityPassed = security.passed;
	}
	if (item.error) {
		const error = {};
		if (typeof item.error.code === "string") error.code = item.error.code;
		if (typeof item.error.message === "string") error.message = item.error.message;
		if (Object.keys(error).length > 0) projected.error = error;
	}
	return projected;
}
function normalizeAutoVerdictRegistryBase(registry) {
	const url = URL.parse(registry);
	return url ? `${url.origin}${url.pathname.replace(/\/+$/, "")}` : null;
}
function canAutoFetchVerdictRegistry(registry) {
	const configured = normalizeAutoVerdictRegistryBase(resolveClawHubBaseUrl());
	const target = normalizeAutoVerdictRegistryBase(registry);
	return configured !== null && target === configured;
}
function collectClawHubVerdictTargets(report) {
	const targets = /* @__PURE__ */ new Map();
	for (const skill of report.skills) {
		const link = skill.clawhub;
		if (!link || link.status !== "linked" || !link.valid) continue;
		if (!canAutoFetchVerdictRegistry(link.registry)) continue;
		const key = `${link.registry}\0${link.ownerHandle ?? ""}\0${link.slug}\0${link.installedVersion}`;
		targets.set(key, {
			registry: link.registry,
			slug: link.slug,
			...link.ownerHandle ? { ownerHandle: link.ownerHandle } : {},
			version: link.installedVersion
		});
	}
	return [...targets.values()];
}
async function fetchOpenClawSkillSecurityVerdicts(targets) {
	const byRegistry = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const registryTargets = byRegistry.get(target.registry) ?? [];
		registryTargets.push(target);
		byRegistry.set(target.registry, registryTargets);
	}
	const items = [];
	for (const [registry, registryTargets] of byRegistry) {
		const verdicts = await fetchExactClawHubSkillSecurityVerdicts({
			baseUrl: registry,
			items: registryTargets.map(({ slug, ownerHandle, version }) => ({
				slug,
				...ownerHandle ? { ownerHandle } : {},
				version
			})),
			skipAuth: true
		});
		for (const [index, item] of verdicts.entries()) items.push(projectClawHubVerdictItem(item, registryTargets[index]));
	}
	return items;
}
//#endregion
//#region src/skills/lifecycle/upload-store.ts
/** Time window in which uploaded skill archive chunks may be committed. */
const SKILL_UPLOAD_TTL_MS = 36e5;
const SKILL_UPLOAD_INSTALL_LEASE_MS = 9e5;
const SKILL_UPLOAD_INSTALL_HEARTBEAT_MS = 3e4;
const MAX_SKILL_UPLOAD_CHUNK_BYTES = 4194304;
const MAX_SKILL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_SKILL_UPLOAD_CHUNK_BYTES / 3) * 4;
const SKILL_UPLOAD_IDEMPOTENCY_KEY_MAX_LENGTH = 2048;
const SHA256_PATTERN = /^[a-f0-9]{64}$/i;
const UPLOAD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uploads = new KeyedAsyncQueue();
function normalizeSkillUploadSha256(value) {
	if (value === void 0) return;
	const normalized = value.trim().toLowerCase();
	if (!SHA256_PATTERN.test(normalized)) throw new SkillUploadRequestError("invalid sha256");
	return normalized;
}
function validateUploadId(uploadId) {
	const normalized = uploadId.trim();
	if (!UPLOAD_ID_PATTERN.test(normalized)) throw new SkillUploadRequestError("invalid uploadId");
	return normalized;
}
function validateSizeBytes(sizeBytes) {
	if (!Number.isSafeInteger(sizeBytes) || sizeBytes < 1) throw new SkillUploadRequestError("invalid sizeBytes");
	if (sizeBytes > DEFAULT_MAX_ARCHIVE_BYTES_ZIP) throw new SkillUploadRequestError("skill archive exceeds maximum upload size");
	return sizeBytes;
}
function validateUploadSlug(slug) {
	try {
		return validateRequestedSkillSlug(slug);
	} catch (err) {
		throw new SkillUploadRequestError(formatErrorMessage(err));
	}
}
function validateOffset(offset) {
	if (!Number.isSafeInteger(offset) || offset < 0) throw new SkillUploadRequestError("invalid offset");
	return offset;
}
function validateIdempotencyKey(value) {
	const normalized = value?.trim();
	if (!normalized) return;
	if (normalized.length > SKILL_UPLOAD_IDEMPOTENCY_KEY_MAX_LENGTH) throw new SkillUploadRequestError("idempotencyKey is too long");
	return normalized;
}
function resolvePositiveDuration(value, fallback) {
	return value !== void 0 && Number.isSafeInteger(value) && value > 0 ? value : fallback;
}
function decodeBase64Chunk(dataBase64) {
	const normalized = dataBase64.trim();
	if (normalized.length > MAX_SKILL_UPLOAD_BASE64_LENGTH) throw new SkillUploadRequestError("upload chunk exceeds maximum size");
	if (!isValidBase64(normalized)) throw new SkillUploadRequestError("invalid dataBase64");
	const decoded = Buffer.from(normalized, "base64");
	if (decoded.length < 1) throw new SkillUploadRequestError("empty upload chunk");
	if (decoded.length > MAX_SKILL_UPLOAD_CHUNK_BYTES) throw new SkillUploadRequestError("upload chunk exceeds maximum size");
	return decoded;
}
async function cleanupExpiredUploads(scope, lockRoot, excludeUploadId) {
	const expired = await scope.execute({
		type: "skillUploads.expired",
		input: void 0
	});
	for (const uploadId of expired) {
		if (uploadId === excludeUploadId) continue;
		await uploads.enqueue(`${lockRoot}:upload:${uploadId}`, async () => {
			await scope.execute({
				type: "skillUploads.deleteExpired",
				input: { uploadId }
			});
		});
	}
}
function toSkillUploadRecord(row, archivePath) {
	return {
		slug: row.slug,
		force: row.force === 1,
		...row.actual_sha256 ? { actualSha256: row.actual_sha256 } : {},
		archivePath
	};
}
function createSkillUploadStore(options) {
	const stateOptions = {
		...options?.env ? { env: options.env } : {},
		...options?.path ? { path: options.path } : {}
	};
	const ttlMs = options?.ttlMs ?? SKILL_UPLOAD_TTL_MS;
	const tempRootDir = options?.tempRootDir;
	const installLeaseMs = resolvePositiveDuration(options?.installLeaseMs, SKILL_UPLOAD_INSTALL_LEASE_MS);
	const installLeaseHeartbeatMs = resolvePositiveDuration(options?.installLeaseHeartbeatMs, SKILL_UPLOAD_INSTALL_HEARTBEAT_MS);
	return {
		async begin(params, assertCommitAllowed) {
			const request = { ...params };
			const context = captureOpenClawStateWorkerContext(stateOptions);
			const root = context.admission.databasePath;
			return await uploads.enqueue(`${root}:begin`, async () => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
				return runOpenClawStateWorkerOperation(context, async (scope) => {
					await cleanupExpiredUploads(scope, root);
					if (request.kind !== "skill-archive") throw new SkillUploadRequestError("unsupported upload kind");
					const slug = validateUploadSlug(request.slug);
					const sizeBytes = validateSizeBytes(request.sizeBytes);
					const sha256 = normalizeSkillUploadSha256(request.sha256);
					const force = request.force === true;
					const idempotencyKey = validateIdempotencyKey(request.idempotencyKey);
					const keyHash = idempotencyKey ? sha256Hex(idempotencyKey) : void 0;
					return scope.execute({
						type: "skillUploads.begin",
						input: {
							kind: request.kind,
							slug,
							sizeBytes,
							sha256,
							force,
							keyHash,
							ttlMs
						}
					});
				}, uploadWriteAdmission(context, assertCommitAllowed));
			});
		},
		async chunk(params, assertCommitAllowed) {
			const uploadId = validateUploadId(params.uploadId);
			const offset = validateOffset(params.offset);
			const decoded = decodeBase64Chunk(params.dataBase64);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			const root = context.admission.databasePath;
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
			return runOpenClawStateWorkerOperation(context, async (scope) => {
				await cleanupExpiredUploads(scope, root, uploadId);
				return uploads.enqueue(`${root}:upload:${uploadId}`, () => scope.execute({
					type: "skillUploads.chunk",
					input: {
						uploadId,
						offset,
						decoded
					}
				}));
			}, uploadWriteAdmission(context, assertCommitAllowed));
		},
		async commit(params, assertCommitAllowed) {
			const uploadId = validateUploadId(params.uploadId);
			const requestedSha = normalizeSkillUploadSha256(params.sha256);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			return await uploads.enqueue(`${context.admission.databasePath}:upload:${uploadId}`, async () => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
				const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
					type: "skillUploads.commit",
					input: {
						uploadId,
						requestedSha
					}
				}), uploadWriteAdmission(context, assertCommitAllowed));
				context.admission.assertCurrent();
				return result;
			});
		},
		async withCommittedUpload(uploadIdRaw, action) {
			const uploadId = validateUploadId(uploadIdRaw);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			return uploads.enqueue(`${context.admission.databasePath}:upload:${uploadId}`, async () => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
				const { withSkillUploadInstallOwner } = await import("./upload-store-install-owner-DpZRQG4R.mjs");
				const owner = randomUUID();
				return withSkillUploadInstallOwner(context, {
					uploadId,
					owner
				}, (claimStarted) => runOpenClawStateWorkerOperation(context, async (scope) => {
					claimStarted();
					const row = await scope.execute({
						type: "skillUploads.claim",
						input: {
							uploadId,
							leaseOwner: owner,
							installLeaseMs
						}
					});
					context.admission.assertCurrent();
					let renewal;
					let renewalPaused = 0;
					let installing = true;
					const heartbeat = setInterval(() => {
						if (!installing || renewalPaused || renewal) return;
						renewal = scope.execute({
							type: "skillUploads.renew",
							input: {
								uploadId,
								owner,
								installLeaseMs
							}
						}).then(() => void 0, () => void 0).finally(() => {
							renewal = void 0;
						});
					}, installLeaseHeartbeatMs);
					heartbeat.unref();
					try {
						return await withTempWorkspace({
							rootDir: tempRootDir ?? resolvePreferredOpenClawTmpDir(),
							prefix: "openclaw-skill-upload-"
						}, async (tmp) => {
							const archivePath = path.join(tmp.dir, "archive.zip");
							await fs.writeFile(archivePath, row.archive_blob, { mode: 384 });
							context.admission.assertCurrent();
							return action(toSkillUploadRecord(row, archivePath), { remove: async () => {
								renewalPaused += 1;
								try {
									await renewal;
									if (await scope.execute({
										type: "skillUploads.consume",
										input: {
											uploadId,
											owner
										}
									}) === "not-owner") throw new SkillUploadRequestError("upload install lease is no longer active");
								} finally {
									renewalPaused -= 1;
								}
							} });
						});
					} finally {
						installing = false;
						clearInterval(heartbeat);
						await renewal;
					}
				}));
			});
		}
	};
}
/** The callback is pure host policy; worker transactions recheck it before effects and COMMIT. */
function uploadWriteAdmission(context, assertCommitAllowed) {
	const assertCurrent = () => {
		assertCommitAllowed?.();
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
	};
	return {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	};
}
const defaultSkillUploadStore = createSkillUploadStore();
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.skillUploadStoreTestApi")] = { createSkillUploadStore };
//#endregion
//#region src/skills/lifecycle/upload-install.ts
const UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE = "Uploaded skill archive installs are disabled by skills.install.allowUploadedArchives";
function areUploadedSkillArchivesEnabled(config) {
	return config.skills?.install?.allowUploadedArchives === true;
}
async function installUploadedSkillArchive(params) {
	const store = params.store ?? defaultSkillUploadStore;
	if (!areUploadedSkillArchivesEnabled(params.config)) return {
		ok: false,
		error: UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE,
		errorKind: "unavailable"
	};
	try {
		params.beforePersistentApply?.();
		const requestedSlug = validateRequestedSkillSlug(params.slug);
		const requestedSha = normalizeSkillUploadSha256(params.sha256);
		return await store.withCommittedUpload(params.uploadId, async (record, upload) => {
			const rejectInvalid = async (error) => {
				await upload.remove().catch(() => void 0);
				return {
					ok: false,
					error,
					errorKind: "invalid-request"
				};
			};
			if (record.slug !== requestedSlug) return await rejectInvalid("install slug does not match upload slug");
			if (record.force !== params.force) return await rejectInvalid("install force does not match upload force");
			if (requestedSha && requestedSha !== record.actualSha256) return await rejectInvalid("install sha256 does not match uploaded archive");
			if (!record.actualSha256) return await rejectInvalid("committed upload is missing sha256");
			const install = await installSkillArchiveFromPath({
				archivePath: record.archivePath,
				workspaceDir: params.workspaceDir,
				slug: record.slug,
				force: record.force,
				timeoutMs: params.timeoutMs,
				logger: params.log,
				beforePersistentApply: params.beforePersistentApply,
				policy: {
					config: params.config,
					installId: "upload",
					origin: {
						type: "upload",
						uploadId: params.uploadId,
						sha256: record.actualSha256
					},
					source: {
						kind: "upload",
						authority: "user",
						mutable: false,
						network: false
					},
					requestedSpecifier: `upload:${params.uploadId}`
				}
			});
			if (!install.ok) {
				if (install.failureKind === "invalid-request") await upload.remove().catch(() => void 0);
				return {
					ok: false,
					error: install.error,
					errorKind: install.failureKind
				};
			}
			await upload.remove().catch(() => void 0);
			return {
				ok: true,
				message: `Installed ${record.slug}`,
				stdout: "",
				stderr: "",
				code: 0,
				slug: record.slug,
				targetDir: install.targetDir,
				sha256: record.actualSha256
			};
		});
	} catch (err) {
		const error = err instanceof SkillUploadRequestError ? err.message : formatErrorMessage(err);
		return {
			ok: false,
			error,
			errorKind: err instanceof SkillUploadRequestError || error.startsWith("Invalid skill slug") ? "invalid-request" : "unavailable"
		};
	}
}
//#endregion
//#region src/gateway/server-methods/skills-install.ts
const clawHubInstallsInFlight = /* @__PURE__ */ new Map();
const handleSkillsInstall = async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateSkillsInstallParams, "skills.install", respond)) return;
	const p = params;
	const resolved = resolveSkillsAgentWorkspace(params, context);
	if (!resolved.ok) {
		respond(false, void 0, resolved.error);
		return;
	}
	const { cfg, workspaceDir: workspaceDirRaw } = resolved;
	if ("source" in p && p.source === "clawhub") {
		const input = {
			workspaceDir: workspaceDirRaw,
			slug: p.slug,
			version: p.version,
			force: Boolean(p.force),
			logger: context.logGateway,
			config: cfg
		};
		const key = JSON.stringify([
			input.workspaceDir,
			input.slug,
			input.version ?? null,
			input.force
		]);
		const result = await getOrCreatePromise(clawHubInstallsInFlight, key, () => installSkillFromClawHub(input), { evictOnSettled: true });
		const errorDetails = result.ok ? void 0 : buildClawHubTrustErrorDetails(result);
		respond(result.ok, result.ok ? {
			ok: true,
			message: `Installed ${result.slug}@${result.version}`,
			stdout: "",
			stderr: "",
			code: 0,
			slug: result.slug,
			version: result.version,
			targetDir: result.targetDir,
			...result.warning ? { warning: result.warning } : {}
		} : result, result.ok ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, result.error, errorDetails ? { details: errorDetails } : void 0));
		return;
	}
	if ("source" in p && p.source === "upload") {
		const uploadGuard = captureGatewayClientUploadCommitGuard({
			method: "skills.install",
			requestParams: p,
			client,
			context
		});
		const assertCommitAllowed = uploadGuard ? retainMutationAuthority(uploadGuard) : void 0;
		try {
			const result = await installUploadedSkillArchive({
				uploadId: p.uploadId,
				slug: p.slug,
				force: Boolean(p.force),
				sha256: p.sha256,
				timeoutMs: p.timeoutMs,
				workspaceDir: workspaceDirRaw,
				config: cfg,
				log: context.logGateway,
				beforePersistentApply: assertCommitAllowed
			});
			if (result.ok) {
				respond(true, result, void 0);
				return;
			}
			assertCommitAllowed?.();
			const errorCode = result.errorKind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
			respond(false, {
				ok: false,
				error: result.error,
				errorCode
			}, errorShape(errorCode, result.error));
		} catch (error) {
			if (!(error instanceof SessionMutationAuthorizationChangedError)) throw error;
			respond(false, void 0, error.error);
		}
		return;
	}
	const result = await installSkill({
		workspaceDir: workspaceDirRaw,
		agentId: resolved.agentId,
		skillName: p.name,
		installId: p.installId,
		timeoutMs: p.timeoutMs,
		config: cfg
	});
	respond(result.ok, result, result.ok ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, result.message));
};
/** Retired methods stay registered (the catalog is append-only) so old clients get guidance. */
const skillsRetiredHandlers = Object.fromEntries([["Skill Workshop proposals are retired. Workshop changes apply immediately and are undoable: use skills.workshop.list/changes/read/archive/restore (CLI: openclaw skills workshop ...).", [
	"skills.proposals.list",
	"skills.proposals.inspect",
	"skills.proposals.historyStatus",
	"skills.proposals.historyScan",
	"skills.proposals.create",
	"skills.proposals.update",
	"skills.proposals.revise",
	"skills.proposals.requestRevision",
	"skills.proposals.apply",
	"skills.proposals.reject",
	"skills.proposals.quarantine",
	"skills.proposals.events.list",
	"skills.proposals.evaluate"
]], ["Skill curator methods are retired. Use skills.workshop.list for Workshop skills, usage, and saved versions, and skills.workshop.archive/restore to change them (CLI: openclaw skills workshop ...).", [
	"skills.curator.status",
	"skills.curator.pin",
	"skills.curator.unpin",
	"skills.curator.restore"
]]].flatMap(([message, methods]) => methods.map((method) => [method, ({ respond }) => respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message))])));
//#endregion
//#region src/gateway/server-methods/skills-status.ts
async function buildRemoteAwareWorkspaceSkillStatus(resolved, selections, skillCardKey) {
	await prepareRemoteSkillConnections();
	const nodeSkills = await resolveNodeExecEligibilityAsync({
		cfg: resolved.cfg,
		agentId: resolved.agentId
	});
	return prepareWorkspaceSkillStatus(resolved.workspaceDir, {
		librarySelections: selections,
		skillCardKey,
		config: resolved.cfg,
		agentId: resolved.agentId,
		eligibility: {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		}
	});
}
const handleSkillsStatus = async ({ params, respond, context, client, signal, hasCurrentClientAuthority }) => {
	if (!assertValidParams(params, validateSkillsStatusParams, "skills.status", respond)) return;
	const agentId = params.agentId ?? tryResolveAmbientOwnerAgentId(context.getRuntimeConfig());
	const resolved = resolveSkillsAgentWorkspace({
		...params,
		agentId
	}, context);
	if (!resolved.ok) {
		respond(false, void 0, resolved.error);
		return;
	}
	await withSessionDiscoveryAccess({
		client,
		context,
		respond,
		signal,
		hasCurrentClientAuthority,
		sessionKey: params.sessionKey,
		agentId: resolved.agentId,
		changedError: errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; retry.")
	}, async (entry) => {
		await ensureSkillsWatcher({
			workspaceDir: resolved.workspaceDir,
			config: resolved.cfg,
			agentId: resolved.agentId
		});
		if (params.refresh === true) await refreshSkillsDiscovery({ config: resolved.cfg });
		const { report } = await buildRemoteAwareWorkspaceSkillStatus(resolved, entry?.skillLibrarySelections);
		return report;
	});
};
//#endregion
//#region src/gateway/server-methods/skills-upload.ts
function mapUploadError(err) {
	if (err instanceof SessionMutationAuthorizationChangedError) return err.error;
	if (err instanceof SkillUploadRequestError) return errorShape(ErrorCodes.INVALID_REQUEST, err.message);
	return errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err));
}
const skillsUploadHandlers = {
	"skills.upload.begin": makeUploadHandler("skills.upload.begin", validateSkillsUploadBeginParams, (params, guard) => defaultSkillUploadStore.begin(params, guard)),
	"skills.upload.chunk": makeUploadHandler("skills.upload.chunk", validateSkillsUploadChunkParams, (params, guard) => defaultSkillUploadStore.chunk(params, guard)),
	"skills.upload.commit": makeUploadHandler("skills.upload.commit", validateSkillsUploadCommitParams, (params, guard) => defaultSkillUploadStore.commit(params, guard))
};
function makeUploadHandler(name, validator, action) {
	return async ({ params, respond, context, client }) => {
		if (!areUploadedSkillArchivesEnabled(context.getRuntimeConfig())) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE));
			return;
		}
		if (!assertValidParams(params, validator, name, respond)) return;
		try {
			respond(true, await action(params, captureGatewayClientUploadCommitGuard({
				method: name,
				requestParams: params,
				client,
				context
			})), void 0);
		} catch (err) {
			respond(false, void 0, mapUploadError(err));
		}
	};
}
//#endregion
//#region src/gateway/server-methods/skills-workshop.ts
function defineWorkshopHandler(method, validate, run) {
	return async (invocation) => {
		const { params, respond, context } = invocation;
		if (!assertValidParams(params, validate, method, respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		try {
			respond(true, await run(params, resolved, invocation), void 0);
		} catch (error) {
			if (!(error instanceof WorkshopWriteError)) throw error;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
		}
	};
}
function workshopWriteContext(resolved, invocation) {
	return {
		config: resolved.cfg,
		agentId: resolved.agentId,
		actor: "user",
		assertLive: readGatewayRequestMutationAuthority(invocation).assertCurrent
	};
}
const skillsWorkshopHandlers = {
	"skills.workshop.list": defineWorkshopHandler("skills.workshop.list", validateSkillsWorkshopListParams, (_params, resolved) => buildSkillsWorkshopListResult({
		config: resolved.cfg,
		agentId: resolved.agentId
	})),
	"skills.workshop.changes": defineWorkshopHandler("skills.workshop.changes", validateSkillsWorkshopChangesParams, async (params, resolved) => ({ changes: await listWorkshopChanges(resolved.agentId, {
		limit: params.limit,
		beforeMs: params.beforeMs
	}) })),
	"skills.workshop.read": defineWorkshopHandler("skills.workshop.read", validateSkillsWorkshopReadParams, (params, resolved) => viewWorkshopSkill(resolved.cfg, resolved.agentId, params.name, params.filePath, params.versionId)),
	"skills.workshop.archive": defineWorkshopHandler("skills.workshop.archive", validateSkillsWorkshopArchiveParams, async (params, resolved, invocation) => ({ change: await archiveWorkshopSkill(workshopWriteContext(resolved, invocation), {
		name: params.name,
		reason: params.reason
	}) })),
	"skills.workshop.restore": defineWorkshopHandler("skills.workshop.restore", validateSkillsWorkshopRestoreParams, async (params, resolved, invocation) => ({ change: await restoreWorkshopSkill(workshopWriteContext(resolved, invocation), {
		name: params.name,
		versionId: params.versionId
	}) })),
	"skills.workshop.undo": defineWorkshopHandler("skills.workshop.undo", validateSkillsWorkshopUndoParams, (params, resolved, invocation) => undoWorkshopReview(workshopWriteContext(resolved, invocation), { runId: params.runId }))
};
//#endregion
//#region src/gateway/server-methods/skills.ts
const skillsHandlers = {
	...skillsLibraryHandlers,
	...skillsUploadHandlers,
	...skillsWorkshopHandlers,
	...skillsRetiredHandlers,
	"skills.status": handleSkillsStatus,
	"skills.securityVerdicts": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsSecurityVerdictsParams, "skills.securityVerdicts", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		try {
			const { report } = await buildRemoteAwareWorkspaceSkillStatus(resolved);
			const targets = collectClawHubVerdictTargets(report);
			respond(true, {
				schema: "openclaw.skills.security-verdicts.v1",
				items: targets.length === 0 ? [] : await fetchOpenClawSkillSecurityVerdicts(targets)
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"skills.skillCard": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsSkillCardParams, "skills.skillCard", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		const { report, files } = await buildRemoteAwareWorkspaceSkillStatus(resolved, void 0, params.skillKey);
		const skill = report.skills.find((candidate) => candidate.skillKey === params.skillKey);
		const content = skill?.skillCard ? files.find((file) => file.name === skill.name && file.filePath === skill.filePath)?.skillCard?.content : void 0;
		if (!skill?.skillCard || content === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `skill card not ${skill?.skillCard ? "readable" : "found"} for ${params.skillKey}`));
			return;
		}
		respond(true, {
			schema: "openclaw.skills.skill-card.v1",
			skillKey: skill.skillKey,
			path: skill.skillCard.path,
			sizeBytes: skill.skillCard.sizeBytes,
			content
		}, void 0);
	},
	"skills.bins": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsBinsParams, "skills.bins", respond)) return;
		const cfg = context.getRuntimeConfig();
		const bins = /* @__PURE__ */ new Set();
		for (const agentId of listAgentIds(cfg)) {
			const { entries } = await prepareWorkspaceSkillEntries(resolveAgentWorkspaceDir(cfg, agentId), {
				config: cfg,
				agentId,
				agentSkillFilter: "ignore"
			});
			for (const bin of collectSkillBins(entries)) bins.add(bin);
		}
		respond(true, { bins: [...bins].toSorted() }, void 0);
	},
	"skills.search": defineValidatedGatewayHandler("skills.search", validateSkillsSearchParams, async ({ params, respond }) => {
		const results = await searchSkillsFromClawHub({
			query: params.query,
			limit: params.limit
		});
		registerClawHubCatalogIconUrls(results.map((result) => result.icon ?? void 0));
		respond(true, { results }, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error))),
	"skills.detail": defineValidatedGatewayHandler("skills.detail", validateSkillsDetailParams, async ({ params, respond }) => {
		const requested = parseRequestedClawHubSkillRef(params.slug);
		if (requested.requestedReference) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `ClawHub cannot return details for ${requested.requestedReference}; external skill sources are install-only. Install it directly, or run "openclaw skills install ${requested.requestedReference}".`));
			return;
		}
		const detail = await fetchClawHubSkillDetail({
			slug: requested.slug,
			includeInspection: true,
			...params.version ? { version: params.version } : {},
			...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {}
		});
		registerClawHubCatalogIconUrls([detail.skill?.icon ?? void 0, detail.owner?.image ?? void 0]);
		respond(true, detail, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error))),
	"skills.install": handleSkillsInstall,
	"skills.update": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsUpdateParams, "skills.update", respond)) return;
		const p = params;
		if ("source" in p) {
			if (Boolean(p.slug) === Boolean(p.all)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, p.slug ? "clawhub skills.update accepts either \"slug\" or \"all\", not both" : "clawhub skills.update requires \"slug\" or \"all\""));
				return;
			}
			const resolved = resolveSkillsAgentWorkspace(p, context);
			if (!resolved.ok) {
				respond(false, void 0, resolved.error);
				return;
			}
			const results = await updateSkillsFromClawHub({
				workspaceDir: resolved.workspaceDir,
				slug: p.slug,
				...p.force ? { force: true } : {},
				logger: context.logGateway,
				config: resolved.cfg
			});
			const errors = results.filter((result) => !result.ok);
			const warnings = normalizeTrimmedStringList(results.map((result) => result.warning));
			respond(errors.length === 0, {
				ok: errors.length === 0,
				skillKey: p.slug ?? "*",
				config: {
					source: "clawhub",
					results
				}
			}, errors.length === 0 ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, errors.map((result) => result.error).join("; "), { details: {
				results,
				...warnings.length > 0 ? { warnings } : {}
			} }));
			return;
		}
		const updated = await updateSkillConfigEntry(p);
		respond(true, {
			ok: true,
			skillKey: p.skillKey,
			config: redactConfigObject(updated)
		}, void 0);
	}
};
//#endregion
export { skillsHandlers };
