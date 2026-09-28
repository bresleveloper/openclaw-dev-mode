import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { i as SkillUploadRequestError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createAsyncLock } from "./json-files-C0HSMh2Z.mjs";
import "./agent-scope-CTuYDtny.mjs";
import "./redact-sentinel-f_PhnHTI.mjs";
import { t as redactConfigObject } from "./redact-snapshot-uX3ICFnt.mjs";
import { r as withTempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { i as buildSkillProposalRevisionChangedErrorDetails, t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Aa as validateSkillsUploadCommitParams, Ca as validateSkillsSearchParams, Da as validateSkillsUpdateParams, Ea as validateSkillsStatusParams, Oa as validateSkillsUploadBeginParams, Pg as buildClawHubTrustErrorDetails, Sa as validateSkillsProposalsListParams, Ta as validateSkillsSkillCardParams, _a as validateSkillsProposalEventsListParams, ba as validateSkillsProposalReviseParams, ca as validateSkillsBinsParams, da as validateSkillsDetailParams, fa as validateSkillsInstallParams, ga as validateSkillsProposalEvaluateParams, ha as validateSkillsProposalDecisionParams, ja as validateSkillsWorkshopReadParams, ka as validateSkillsUploadChunkParams, la as validateSkillsCuratorActionParams, ma as validateSkillsProposalCreateParams, mh as validateSkillsProposalHistoryStatusParams, pa as validateSkillsProposalActionParams, ph as validateSkillsProposalHistoryScanParams, ua as validateSkillsCuratorStatusParams, va as validateSkillsProposalInspectParams, wa as validateSkillsSecurityVerdictsParams, xa as validateSkillsProposalUpdateParams, ya as validateSkillsProposalRequestRevisionParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { _ as resolveClawHubBaseUrl } from "./clawhub-client-D8cfvjQG.mjs";
import { a as DEFAULT_MAX_ARCHIVE_BYTES_ZIP } from "./archive-BVJWOqLD.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { r as fetchExactClawHubSkillSecurityVerdicts } from "./clawhub-install-trust-DUzoqrpN.mjs";
import { a as fetchClawHubSkillDetail } from "./clawhub-skills-DTZJRHzC.mjs";
import { r as resolveNodeExecEligibility } from "./exec-defaults-aBiGwrXO.mjs";
import { I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget } from "./session-sharing-C_5FkkwM.mjs";
import { r as validateRequestedSkillSlug } from "./install-paths-DBBNLgEr.mjs";
import { s as parseRequestedClawHubSkillRef } from "./clawhub-store-CLSS382v.mjs";
import { c as searchSkillsFromClawHub } from "./clawhub-status-DVwv_3mo.mjs";
import { i as prepareWorkspaceSkillEntries } from "./workspace-skill-loader-CHLLbFK6.mjs";
import { n as prepareRemoteSkillConnections } from "./remote-skills-CZuGGEXx.mjs";
import { I as resolveSkillProposalName } from "./store-LdKLy4Ms.mjs";
import { s as PROPOSAL_DRAFT_FILE } from "./store-sqlite-record-B7LlWdpb.mjs";
import { c as proposeCreateSkill, d as assertExpectedRevisionHash, f as evaluateSkillProposal, i as reviseSkillProposal, l as proposeUpdateSkill, n as quarantineSkillProposal, p as listSkillProposalEvents, r as rejectSkillProposal, t as applySkillProposal, u as SkillProposalRevisionChangedError } from "./service-ChKarKGD.mjs";
import { n as listSkillProposals, t as inspectSkillProposal } from "./service-query-CBcNmTSa.mjs";
import { i as prepareWorkspaceSkillStatus } from "./status-C5lk8raw.mjs";
import { n as readWritableWorkshopSkill, t as listWritableWorkshopSkillSummaries } from "./workspace-skill-read-DqwKGh6O.mjs";
import { t as getRemoteSkillEligibility } from "./remote-3_oGYmdR.mjs";
import { n as ensureSkillsWatcher } from "./refresh-BBC60r5L.mjs";
import { i as installSkillArchiveFromPath } from "./archive-install-DvPJCL8V.mjs";
import { r as updateSkillsFromClawHub, t as installSkillFromClawHub } from "./clawhub-BGD8Bvto.mjs";
import { n as getSkillCuratorStatus, t as SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE } from "./curator-BpldtG30.mjs";
import { n as installSkill } from "./install-Ct1JorDS.mjs";
import { r as skillsLibraryHandlers } from "./skills-library-CDH8PoUZ.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as registerClawHubCatalogIconUrls } from "./catalog-icon-registry-b1MkOn00.mjs";
import { u as resolveSkillUploadDatabaseOptions } from "./upload-store.sqlite-DAwbj8jh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/skills/config/mutations.ts
function patchSkillConfigEntry(cfg, skillKey, patch) {
	const entries = { ...cfg.skills?.entries };
	const current = entries[skillKey] ? { ...entries[skillKey] } : {};
	if (typeof patch.enabled === "boolean") current.enabled = patch.enabled;
	if (typeof patch.apiKey === "string") {
		const trimmed = normalizeSecretInput(patch.apiKey);
		if (trimmed === "__OPENCLAW_REDACTED__") {} else if (trimmed) current.apiKey = trimmed;
		else delete current.apiKey;
	}
	if (patch.env && typeof patch.env === "object") {
		const nextEnv = current.env ? { ...current.env } : {};
		for (const [key, value] of Object.entries(patch.env)) {
			const trimmedKey = key.trim();
			if (!trimmedKey) continue;
			const trimmedVal = value.trim();
			if (trimmedVal === "__OPENCLAW_REDACTED__") continue;
			if (!trimmedVal) delete nextEnv[trimmedKey];
			else nextEnv[trimmedKey] = trimmedVal;
		}
		current.env = nextEnv;
	}
	entries[skillKey] = current;
	return {
		...cfg,
		skills: {
			...cfg.skills,
			entries
		}
	};
}
async function updateSkillConfigEntry(params) {
	return (await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			const next = patchSkillConfigEntry(draft, params.skillKey, params);
			Object.assign(draft, next);
			return next.skills?.entries?.[params.skillKey] ?? {};
		}
	})).result ?? {};
}
//#endregion
//#region src/skills/discovery/bins.ts
/** Collects all binary names a set of skills may require or install. */
function collectSkillBins(entries) {
	const bins = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const required = entry.metadata?.requires?.bins ?? [];
		const anyBins = entry.metadata?.requires?.anyBins ?? [];
		const install = entry.metadata?.install ?? [];
		for (const bin of required) {
			const trimmed = bin.trim();
			if (trimmed) bins.add(trimmed);
		}
		for (const bin of anyBins) {
			const trimmed = bin.trim();
			if (trimmed) bins.add(trimmed);
		}
		for (const spec of install) {
			const specBins = spec?.bins ?? [];
			for (const bin of specBins) {
				const trimmed = normalizeOptionalString(bin) ?? "";
				if (trimmed) bins.add(trimmed);
			}
		}
	}
	return [...bins].toSorted();
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
const locks = /* @__PURE__ */ new Map();
async function withLock(key, fn) {
	let entry = locks.get(key);
	if (!entry) {
		entry = {
			lock: createAsyncLock(),
			references: 0
		};
		locks.set(key, entry);
	}
	entry.references += 1;
	try {
		return await entry.lock(fn);
	} finally {
		entry.references -= 1;
		if (entry.references === 0) locks.delete(key);
	}
}
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
	if (!normalized || normalized.length % 4 !== 0) throw new SkillUploadRequestError("invalid dataBase64");
	const paddingLength = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0;
	const contentLength = normalized.length - paddingLength;
	for (let index = 0; index < contentLength; index += 1) {
		const code = normalized.charCodeAt(index);
		if (!(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47)) throw new SkillUploadRequestError("invalid dataBase64");
	}
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
		await withLock(`${lockRoot}:upload:${uploadId}`, async () => {
			await scope.execute({
				type: "skillUploads.deleteExpired",
				input: { uploadId }
			});
		});
	}
}
function toSkillUploadRecord(row, archivePath) {
	return {
		version: 1,
		kind: "skill-archive",
		uploadId: row.upload_id,
		slug: row.slug,
		force: row.force === 1,
		sizeBytes: row.size_bytes,
		...row.sha256 ? { sha256: row.sha256 } : {},
		...row.actual_sha256 ? { actualSha256: row.actual_sha256 } : {},
		receivedBytes: row.received_bytes,
		archivePath,
		createdAt: row.created_at,
		expiresAt: row.expires_at,
		committed: row.committed === 1,
		...row.committed_at !== null ? { committedAt: row.committed_at } : {},
		...row.idempotency_key_hash ? { idempotencyKeyHash: row.idempotency_key_hash } : {}
	};
}
function createSkillUploadStore(options) {
	const stateOptions = resolveSkillUploadDatabaseOptions(options ?? {});
	const ttlMs = options?.ttlMs ?? SKILL_UPLOAD_TTL_MS;
	const tempRootDir = options?.tempRootDir;
	const installLeaseMs = resolvePositiveDuration(options?.installLeaseMs, SKILL_UPLOAD_INSTALL_LEASE_MS);
	const installLeaseHeartbeatMs = resolvePositiveDuration(options?.installLeaseHeartbeatMs, SKILL_UPLOAD_INSTALL_HEARTBEAT_MS);
	return {
		async begin(params) {
			const request = { ...params };
			const context = captureOpenClawStateWorkerContext(stateOptions);
			const root = context.admission.databasePath;
			return await withLock(`${root}:begin`, async () => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
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
				});
			});
		},
		async chunk(params) {
			const uploadId = validateUploadId(params.uploadId);
			const offset = validateOffset(params.offset);
			const decoded = decodeBase64Chunk(params.dataBase64);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			const root = context.admission.databasePath;
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
			return runOpenClawStateWorkerOperation(context, async (scope) => {
				await cleanupExpiredUploads(scope, root, uploadId);
				return withLock(`${root}:upload:${uploadId}`, () => scope.execute({
					type: "skillUploads.chunk",
					input: {
						uploadId,
						offset,
						decoded
					}
				}));
			});
		},
		async commit(params) {
			const uploadId = validateUploadId(params.uploadId);
			const requestedSha = normalizeSkillUploadSha256(params.sha256);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			return await withLock(`${context.admission.databasePath}:upload:${uploadId}`, async () => {
				const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				return executeOpenClawStateWorker(context, {
					type: "skillUploads.commit",
					input: {
						uploadId,
						requestedSha
					}
				});
			});
		},
		async withCommittedUpload(uploadIdRaw, action) {
			const uploadId = validateUploadId(uploadIdRaw);
			const context = captureOpenClawStateWorkerContext(stateOptions);
			return withLock(`${context.admission.databasePath}:upload:${uploadId}`, async () => {
				const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
				const { withSkillUploadInstallOwner } = await import("./upload-store-install-owner-BYH2LHEO.mjs");
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
const defaultSkillUploadStore = createSkillUploadStore();
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.skillUploadStoreTestApi")] = { createSkillUploadStore };
//#endregion
//#region src/skills/lifecycle/upload-install.ts
/** User-facing disabled message for archive upload installs. */
const UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE = "Uploaded skill archive installs are disabled by skills.install.allowUploadedArchives";
function areUploadedSkillArchivesEnabled(config) {
	return config.skills?.install?.allowUploadedArchives === true;
}
function uploadInstallFailureErrorKind(failureKind) {
	return failureKind === "invalid-request" ? "invalid-request" : "unavailable";
}
async function installUploadedSkillArchive(params) {
	const store = params.store ?? defaultSkillUploadStore;
	if (!areUploadedSkillArchivesEnabled(params.config)) return {
		ok: false,
		error: UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE,
		errorKind: "unavailable"
	};
	try {
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
			if (record.kind !== "skill-archive") return await rejectInvalid("unsupported upload kind");
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
				const errorKind = uploadInstallFailureErrorKind(install.failureKind);
				if (install.failureKind === "invalid-request") await upload.remove().catch(() => void 0);
				return {
					ok: false,
					error: install.error,
					errorKind
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
		if (err instanceof SkillUploadRequestError) return {
			ok: false,
			error: err.message,
			errorKind: "invalid-request"
		};
		const error = formatErrorMessage(err);
		if (error.startsWith("Invalid skill slug")) return {
			ok: false,
			error,
			errorKind: "invalid-request"
		};
		return {
			ok: false,
			error,
			errorKind: "unavailable"
		};
	}
}
//#endregion
//#region src/skills/security/clawhub-verdicts.ts
function readSecurityStatus(security) {
	if (!security || typeof security !== "object" || !("status" in security)) return;
	const status = security.status;
	return typeof status === "string" ? status : void 0;
}
function readSecurityPassed(security) {
	if (!security || typeof security !== "object" || !("passed" in security)) return;
	const passed = security.passed;
	return typeof passed === "boolean" ? passed : void 0;
}
function projectClawHubVerdictItem(item, target) {
	const projected = {
		registry: target.registry,
		ok: item.ok,
		decision: item.decision,
		reasons: item.reasons,
		requestedSlug: target.slug,
		requestedVersion: target.version,
		...target.ownerHandle ? { requestedOwnerHandle: target.ownerHandle } : {}
	};
	if (item.slug !== void 0) projected.slug = item.slug;
	if (item.version !== void 0) projected.version = item.version;
	if (item.displayName !== void 0) projected.displayName = item.displayName;
	if (item.publisherHandle !== void 0) projected.publisherHandle = item.publisherHandle;
	if (item.publisherDisplayName !== void 0) projected.publisherDisplayName = item.publisherDisplayName;
	if (item.createdAt !== void 0) projected.createdAt = item.createdAt;
	if (item.checkedAt !== void 0) projected.checkedAt = item.checkedAt;
	if (item.skillUrl !== void 0) projected.skillUrl = item.skillUrl;
	if (item.securityAuditUrl !== void 0) projected.securityAuditUrl = item.securityAuditUrl;
	const securityStatus = readSecurityStatus(item.security);
	if (securityStatus !== void 0) projected.securityStatus = securityStatus;
	const securityPassed = readSecurityPassed(item.security);
	if (securityPassed !== void 0) projected.securityPassed = securityPassed;
	if (item.error) {
		const error = {};
		if (typeof item.error.code === "string") error.code = item.error.code;
		if (typeof item.error.message === "string") error.message = item.error.message;
		if (Object.keys(error).length > 0) projected.error = error;
	}
	return projected;
}
function normalizeAutoVerdictRegistryBase(registry) {
	try {
		const url = new URL(registry);
		const normalizedPath = url.pathname.replace(/\/+$/, "");
		return `${url.origin}${normalizedPath}`;
	} catch {
		return null;
	}
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
//#region src/gateway/server-methods/skills-curator.ts
function respondSkillWorkshopError(respond, err) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(err)));
}
function respondRetiredSkillCuratorAction({ params, respond }, method) {
	if (!assertValidParams(params, validateSkillsCuratorActionParams, method, respond)) return;
	respondSkillWorkshopError(respond, new Error(SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE));
}
const skillsCuratorHandlers = {
	"skills.curator.status": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateSkillsCuratorStatusParams, "skills.curator.status", respond)) return;
		const status = await getSkillCuratorStatus({ config: context.getRuntimeConfig() });
		if (hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.SKILL_CURATOR_LIVE_INVENTORY)) {
			respond(true, status, void 0);
			return;
		}
		const { inventory: _inventory, ...legacyStatus } = status;
		const skills = status.skills.filter((skill) => skill.createdAtMs !== null && skill.stateChangedAtMs !== null);
		respond(true, {
			...legacyStatus,
			skills,
			counts: {
				active: skills.length,
				stale: 0,
				archived: 0
			}
		}, void 0);
	},
	"skills.curator.pin": (options) => respondRetiredSkillCuratorAction(options, "skills.curator.pin"),
	"skills.curator.unpin": (options) => respondRetiredSkillCuratorAction(options, "skills.curator.unpin"),
	"skills.curator.restore": (options) => respondRetiredSkillCuratorAction(options, "skills.curator.restore")
};
//#endregion
//#region src/gateway/server-methods/skills-proposal-history.ts
const HISTORY_SCAN_RETIRED_MESSAGE = "Historical batch scans are retired. Start a learning session from Workshop to review past conversations.";
const skillProposalHistoryHandlers = {
	"skills.proposals.historyStatus": ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsProposalHistoryStatusParams, "skills.proposals.historyStatus", respond)) return;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, HISTORY_SCAN_RETIRED_MESSAGE));
	},
	"skills.proposals.historyScan": ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsProposalHistoryScanParams, "skills.proposals.historyScan", respond)) return;
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, HISTORY_SCAN_RETIRED_MESSAGE));
	}
};
//#endregion
//#region src/gateway/server-methods/skills-workspace-handler.ts
function resolveSkillsAgentWorkspace(params, context) {
	const cfg = context.getRuntimeConfig();
	const agentIdRaw = params && typeof params === "object" && "agentId" in params ? normalizeOptionalString(params.agentId) : void 0;
	let agentId;
	try {
		agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : resolveDefaultAgentId(cfg, {
			surface: "skills workspace",
			hint: "Pass agentId to select a configured agent."
		});
	} catch (error) {
		if (!(error instanceof AgentSelectionRequiredError)) throw error;
		return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, error.message)
		};
	}
	if (agentIdRaw && !listAgentIds(cfg).includes(agentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${agentIdRaw}"`)
	};
	return {
		ok: true,
		cfg,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	};
}
const SKILL_PROPOSAL_RESPONSE_HANDLED = Symbol("skill proposal response handled");
async function runSkillsProposalWorkspaceHandler(params) {
	if (!assertValidParams(params.rawParams, params.validate, params.method, params.respond)) return;
	const resolved = resolveSkillsAgentWorkspace(params.rawParams, params.context);
	if (!resolved.ok) {
		params.respond(false, void 0, resolved.error);
		return;
	}
	try {
		const result = await params.run(params.rawParams, resolved);
		if (result !== SKILL_PROPOSAL_RESPONSE_HANDLED) params.respond(true, result, void 0);
	} catch (error) {
		const details = error instanceof SkillProposalRevisionChangedError ? buildSkillProposalRevisionChangedErrorDetails({
			expectedRevisionHash: error.expectedRevisionHash,
			currentRevisionHash: error.currentRevisionHash
		}) : void 0;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error), details ? { details } : void 0));
	}
}
//#endregion
//#region src/gateway/server-methods/skills-status.ts
async function buildRemoteAwareWorkspaceSkillStatus(resolved, selections, skillCardKey) {
	await prepareRemoteSkillConnections();
	const nodeSkills = resolveNodeExecEligibility({
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
const handleSkillsStatus = async ({ params, respond, context, client }) => {
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
	const target = params.sessionKey ? resolveSessionSharingTarget({
		cfg: resolved.cfg,
		sessionKey: params.sessionKey,
		agentId: resolved.agentId
	}) : void 0;
	if (params.sessionKey && !target) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session not found."));
		return;
	}
	if (target) {
		const denied = authorizeSessionSharingTarget({
			cfg: resolved.cfg,
			client,
			target
		});
		if (denied) {
			respond(false, void 0, denied);
			return;
		}
	}
	const sessionId = target?.entry.sessionId;
	ensureSkillsWatcher({
		workspaceDir: resolved.workspaceDir,
		config: resolved.cfg,
		agentId: resolved.agentId
	});
	const { report } = await buildRemoteAwareWorkspaceSkillStatus(resolved, target?.entry.skillLibrarySelections);
	if (target && params.sessionKey) {
		const cfg = context.getRuntimeConfig();
		const current = resolveSessionSharingTarget({
			cfg,
			sessionKey: params.sessionKey,
			agentId: resolved.agentId
		});
		if (!current || current.entry.sessionId !== sessionId || current.storePath !== target.storePath || current.storeKey !== target.storeKey) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; retry."));
			return;
		}
		const denied = authorizeSessionSharingTarget({
			cfg,
			client,
			target: current
		});
		if (denied) {
			respond(false, void 0, denied);
			return;
		}
	}
	respond(true, report, void 0);
};
//#endregion
//#region src/gateway/server-methods/skills-upload.ts
function mapUploadError(err) {
	if (err instanceof SkillUploadRequestError) return errorShape(ErrorCodes.INVALID_REQUEST, err.message);
	return errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err));
}
/** Gateway handlers for the staged uploaded-skill archive flow. */
const skillsUploadHandlers = {
	"skills.upload.begin": makeUploadHandler("skills.upload.begin", validateSkillsUploadBeginParams, (params) => defaultSkillUploadStore.begin(params)),
	"skills.upload.chunk": makeUploadHandler("skills.upload.chunk", validateSkillsUploadChunkParams, (params) => defaultSkillUploadStore.chunk(params)),
	"skills.upload.commit": makeUploadHandler("skills.upload.commit", validateSkillsUploadCommitParams, (params) => defaultSkillUploadStore.commit(params))
};
/** Wraps each upload stage with feature gating, protocol validation, and error mapping. */
function makeUploadHandler(name, validator, action) {
	return async ({ params, respond, context }) => {
		if (!areUploadedSkillArchivesEnabled(context.getRuntimeConfig())) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, UPLOADED_SKILL_ARCHIVES_DISABLED_MESSAGE));
			return;
		}
		if (!assertValidParams(params, validator, name, respond)) return;
		try {
			respond(true, await action(params), void 0);
		} catch (err) {
			respond(false, void 0, mapUploadError(err));
		}
	};
}
//#endregion
//#region src/gateway/server-methods/skills.ts
const clawHubInstallsInFlight = /* @__PURE__ */ new Map();
function projectGatewaySkillProposalRecord(record) {
	return record.draftFile === "PROPOSAL.md" ? record : {
		...record,
		draftFile: PROPOSAL_DRAFT_FILE
	};
}
function projectGatewaySkillProposalResult(result) {
	return {
		...result,
		record: projectGatewaySkillProposalRecord(result.record)
	};
}
function projectGatewaySkillProposalReadResult(proposal) {
	return {
		...projectGatewaySkillProposalResult(proposal),
		...proposal.supportFiles ? { supportFiles: proposal.supportFiles.map(({ path, content }) => ({
			path,
			content
		})) } : {}
	};
}
function installClawHubSkillDeduped(params) {
	const key = JSON.stringify([
		params.workspaceDir,
		params.slug,
		params.version ?? null,
		params.force ?? false
	]);
	return getOrCreatePromise(clawHubInstallsInFlight, key, () => installSkillFromClawHub(params), { evictOnSettled: true });
}
function collectClawHubTrustWarnings(results) {
	return results.map((result) => normalizeOptionalString(result.warning)).filter((warning) => Boolean(warning));
}
function buildRevisionAgentInstruction(proposal) {
	return [
		`Revise Skill Workshop proposal \`${proposal.record.id}\` (${resolveSkillProposalName(proposal.record.kind, proposal.record.target)}).`,
		"",
		"Use `skill_workshop` with `action=inspect` first, then `action=revise` for that pending proposal.",
		"The proposal ID and expected revision hash are bound by this run; do not substitute them.",
		"Do not apply, approve, reject, quarantine, or install the proposal.",
		"",
		"Requested changes:"
	].join("\n");
}
async function forwardSkillWorkshopRevisionToChatSend(opts, params) {
	const { handleChatSendWithSkillWorkshopProposalRevision } = await import("./chat-send-handler-B4yY-iXs.mjs");
	const chatParams = {
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId ?? params.agentId,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		message: params.instructions,
		deliver: false,
		queueMode: "followup",
		systemProvenanceReceipt: buildRevisionAgentInstruction(params.proposal),
		suppressCommandInterpretation: true,
		idempotencyKey: params.idempotencyKey
	};
	await handleChatSendWithSkillWorkshopProposalRevision({
		...opts,
		req: {
			...opts.req,
			method: "chat.send",
			params: chatParams
		},
		params: chatParams
	}, {
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		proposalId: params.proposal.record.id,
		expectedRevisionHash: params.expectedRevisionHash
	});
}
/** Gateway request handlers for skill status, catalogs, installs, updates, and workshop proposals. */
const skillsHandlers = {
	...skillsCuratorHandlers,
	...skillsLibraryHandlers,
	...skillsUploadHandlers,
	...skillProposalHistoryHandlers,
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
			if (targets.length === 0) {
				respond(true, {
					schema: "openclaw.skills.security-verdicts.v1",
					items: []
				}, void 0);
				return;
			}
			respond(true, {
				schema: "openclaw.skills.security-verdicts.v1",
				items: await fetchOpenClawSkillSecurityVerdicts(targets)
			}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
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
		if (!skill?.skillCard) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `skill card not found for ${params.skillKey}`));
			return;
		}
		const content = files.find((file) => file.name === skill.name && file.filePath === skill.filePath)?.skillCard?.content;
		if (content === void 0) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `skill card not readable for ${params.skillKey}`));
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
	"skills.search": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsSearchParams, "skills.search", respond)) return;
		try {
			const results = await searchSkillsFromClawHub({
				query: params.query,
				limit: params.limit
			});
			registerClawHubCatalogIconUrls(results.map((result) => result.icon ?? void 0));
			respond(true, { results }, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
		}
	},
	"skills.detail": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsDetailParams, "skills.detail", respond)) return;
		try {
			const requested = parseRequestedClawHubSkillRef(params.slug);
			if (requested.requestedReference) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `ClawHub cannot return details for ${requested.requestedReference}; external skill sources are install-only. Install it directly, or run "openclaw skills install ${requested.requestedReference}".`));
				return;
			}
			const detail = await fetchClawHubSkillDetail({
				slug: requested.slug,
				...requested.ownerHandle ? { ownerHandle: requested.ownerHandle } : {}
			});
			registerClawHubCatalogIconUrls([detail.skill?.icon ?? void 0, detail.owner?.image ?? void 0]);
			respond(true, detail, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
		}
	},
	"skills.proposals.list": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.list",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalsListParams,
			run: async (_parsedParams, resolved) => {
				const options = {
					config: resolved.cfg,
					agentId: resolved.agentId
				};
				return {
					...await listSkillProposals(options),
					installedSkills: listWritableWorkshopSkillSummaries(options).map(({ name, skillKey, description }) => ({
						name,
						skillKey,
						description
					}))
				};
			}
		});
	},
	"skills.workshop.read": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.workshop.read",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsWorkshopReadParams,
			run: async (parsedParams, resolved) => {
				const skill = await readWritableWorkshopSkill(parsedParams.name, {
					config: resolved.cfg,
					agentId: resolved.agentId
				});
				return {
					name: skill.skillName,
					skillKey: skill.skillKey,
					description: skill.description,
					content: skill.content
				};
			}
		});
	},
	"skills.proposals.events.list": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.events.list",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalEventsListParams,
			run: async (parsedParams, resolved) => listSkillProposalEvents({
				agentId: resolved.agentId,
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				afterSequence: parsedParams.afterSequence,
				limit: parsedParams.limit
			})
		});
	},
	"skills.proposals.inspect": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.inspect",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalInspectParams,
			run: async (parsedParams, resolved) => {
				const proposal = await inspectSkillProposal(parsedParams.proposalId, {
					agentId: resolved.agentId,
					config: resolved.cfg
				});
				if (!proposal) throw new Error(`Skill proposal not found: ${parsedParams.proposalId}`);
				return projectGatewaySkillProposalReadResult(proposal);
			}
		});
	},
	"skills.proposals.evaluate": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.evaluate",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalEvaluateParams,
			run: (parsedParams, resolved) => evaluateSkillProposal({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				expectedRevisionHash: parsedParams.expectedRevisionHash,
				correlationId: parsedParams.correlationId,
				trigger: "manual"
			}).then(projectGatewaySkillProposalResult)
		});
	},
	"skills.proposals.create": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.create",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalCreateParams,
			run: (parsedParams, resolved) => proposeCreateSkill({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				name: parsedParams.name,
				description: parsedParams.description,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				createdBy: "gateway",
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			}).then(projectGatewaySkillProposalReadResult)
		});
	},
	"skills.proposals.update": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.update",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalUpdateParams,
			run: (parsedParams, resolved) => proposeUpdateSkill({
				workspaceDir: resolved.workspaceDir,
				config: resolved.cfg,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				skillName: parsedParams.skillName,
				description: parsedParams.description,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				createdBy: "gateway",
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			}).then(projectGatewaySkillProposalReadResult)
		});
	},
	"skills.proposals.revise": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.revise",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalReviseParams,
			run: (parsedParams, resolved) => reviseSkillProposal({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				expectedRevisionHash: parsedParams.expectedRevisionHash,
				correlationId: parsedParams.correlationId,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				description: parsedParams.description,
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			}).then(projectGatewaySkillProposalReadResult)
		});
	},
	"skills.proposals.requestRevision": async (opts) => {
		const { params, respond, context } = opts;
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.requestRevision",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalRequestRevisionParams,
			run: async (parsedParams, resolved) => {
				const expectedRevisionHash = parsedParams.expectedRevisionHash;
				const proposal = await inspectSkillProposal(parsedParams.proposalId, {
					agentId: resolved.agentId,
					config: resolved.cfg
				});
				if (!proposal) throw new Error(`Skill proposal not found: ${parsedParams.proposalId}`);
				if (proposal.record.status !== "pending") throw new Error(`Skill proposal is not pending: ${parsedParams.proposalId}`);
				assertExpectedRevisionHash(proposal.revisionHash, expectedRevisionHash);
				await forwardSkillWorkshopRevisionToChatSend(opts, {
					agentId: resolved.agentId,
					expectedRevisionHash,
					idempotencyKey: parsedParams.idempotencyKey,
					instructions: parsedParams.instructions,
					proposal,
					workspaceDir: resolved.workspaceDir,
					sessionId: parsedParams.sessionId,
					sessionKey: parsedParams.sessionKey,
					targetAgentId: parsedParams.targetAgentId ? normalizeAgentId(parsedParams.targetAgentId) : void 0
				});
				return SKILL_PROPOSAL_RESPONSE_HANDLED;
			}
		});
	},
	"skills.proposals.apply": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.apply",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalDecisionParams,
			run: (parsedParams, resolved) => applySkillProposal({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				expectedRevisionHash: parsedParams.expectedRevisionHash,
				correlationId: parsedParams.correlationId,
				reason: parsedParams.reason
			}).then(projectGatewaySkillProposalResult)
		});
	},
	"skills.proposals.reject": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.reject",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalDecisionParams,
			run: (parsedParams, resolved) => rejectSkillProposal({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				expectedRevisionHash: parsedParams.expectedRevisionHash,
				correlationId: parsedParams.correlationId,
				reason: parsedParams.reason
			}).then(projectGatewaySkillProposalRecord)
		});
	},
	"skills.proposals.quarantine": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.quarantine",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalActionParams,
			run: (parsedParams, resolved) => quarantineSkillProposal({
				workspaceDir: resolved.workspaceDir,
				agentId: resolved.agentId,
				eventActor: { type: "gateway" },
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				expectedRevisionHash: parsedParams.expectedRevisionHash,
				correlationId: parsedParams.correlationId,
				reason: parsedParams.reason
			}).then(projectGatewaySkillProposalRecord)
		});
	},
	"skills.install": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsInstallParams, "skills.install", respond)) return;
		const p = params;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		const cfg = resolved.cfg;
		const workspaceDirRaw = resolved.workspaceDir;
		if ("source" in p && p.source === "clawhub") {
			const result = await installClawHubSkillDeduped({
				workspaceDir: workspaceDirRaw,
				slug: p.slug,
				version: p.version,
				force: Boolean(p.force),
				logger: context.logGateway,
				config: cfg
			});
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
			const result = await installUploadedSkillArchive({
				uploadId: p.uploadId,
				slug: p.slug,
				force: Boolean(p.force),
				sha256: p.sha256,
				timeoutMs: p.timeoutMs,
				workspaceDir: workspaceDirRaw,
				config: cfg,
				log: context.logGateway
			});
			const errorCode = !result.ok && result.errorKind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
			const responseResult = result.ok ? result : {
				ok: false,
				error: result.error,
				errorCode
			};
			respond(result.ok, responseResult, result.ok ? void 0 : errorShape(errorCode, result.error));
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
	},
	"skills.update": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsUpdateParams, "skills.update", respond)) return;
		const p = params;
		if ("source" in p) {
			if (!p.slug && !p.all) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "clawhub skills.update requires \"slug\" or \"all\""));
				return;
			}
			if (p.slug && p.all) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "clawhub skills.update accepts either \"slug\" or \"all\", not both"));
				return;
			}
			const resolved = resolveSkillsAgentWorkspace(params, context);
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
			const warnings = collectClawHubTrustWarnings(results);
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
