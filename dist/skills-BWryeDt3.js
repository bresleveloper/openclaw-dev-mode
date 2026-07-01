import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, m as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { f as fetchClawHubSkillSecurityVerdicts, u as fetchClawHubSkillDetail, v as resolveClawHubBaseUrl } from "./clawhub-CzhGuc1t.js";
import { m as writeJson, t as readDurableJsonFile } from "./json-files-2umMHm0W.js";
import "./agent-scope-CDZXADgT.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { c as resolveDefaultAgentId, n as listAgentIds, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import "./archive-Dcpo6Wva.js";
import "./archive-CBe_wA_B.js";
import { o as loadWorkspaceSkillEntries } from "./workspace-CD16JXyF.js";
import { n as redactConfigObject } from "./redact-snapshot-CRFhNm1X.js";
import { mn as errorShape, pn as ErrorCodes } from "./schema-Ctppm7Dp.js";
import { Cn as validateSkillsUploadChunkParams, Sn as validateSkillsUploadBeginParams, _n as validateSkillsSearchParams, bn as validateSkillsStatusParams, cn as validateSkillsDetailParams, dn as validateSkillsProposalCreateParams, fn as validateSkillsProposalInspectParams, gn as validateSkillsProposalsListParams, hn as validateSkillsProposalUpdateParams, ln as validateSkillsInstallParams, mn as validateSkillsProposalReviseParams, pn as validateSkillsProposalRequestRevisionParams, sn as validateSkillsBinsParams, t as formatValidationErrors, un as validateSkillsProposalActionParams, vn as validateSkillsSecurityVerdictsParams, wn as validateSkillsUploadCommitParams, xn as validateSkillsUpdateParams, yn as validateSkillsSkillCardParams } from "./src-CSp7rUPX.js";
import { c as searchSkillsFromClawHub, f as installSkillArchiveFromPath, i as readLocalSkillCardContentSync, p as validateRequestedSkillSlug, r as installSkillFromClawHub, t as buildWorkspaceSkillStatus, u as updateSkillsFromClawHub } from "./status-C0XQsYcO.js";
import { a as proposeUpdateSkill, d as reviseSkillProposal, i as proposeCreateSkill, l as rejectSkillProposal, n as inspectSkillProposal, o as quarantineSkillProposal, r as listSkillProposals, t as applySkillProposal } from "./service-DCXLp0ol.js";
import { t as canExecRequestNode } from "./exec-defaults-DhxQcmTz.js";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-C0BMTL7t.js";
import { t as getRemoteSkillEligibility } from "./remote-CSTswe9T.js";
import { r as updateSkillConfigEntry, t as installSkill } from "./install-CHyzBcpR.js";
import { t as assertValidParams } from "./validation-CGUihuqY.js";
import { createReadStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
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
const SKILL_UPLOAD_TTL_MS = 3600 * 1e3;
const MAX_SKILL_UPLOAD_CHUNK_BYTES = 4 * 1024 * 1024;
const MAX_SKILL_UPLOAD_BASE64_LENGTH = Math.ceil(MAX_SKILL_UPLOAD_CHUNK_BYTES / 3) * 4;
const SKILL_UPLOAD_IDEMPOTENCY_KEY_MAX_LENGTH = 2048;
const SHA256_PATTERN = /^[a-f0-9]{64}$/i;
const UPLOAD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const locks = /* @__PURE__ */ new Map();
var SkillUploadRequestError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SkillUploadRequestError";
	}
};
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
function isUploadId(value) {
	return UPLOAD_ID_PATTERN.test(value);
}
function validateSizeBytes(sizeBytes) {
	if (!Number.isSafeInteger(sizeBytes) || sizeBytes < 1) throw new SkillUploadRequestError("invalid sizeBytes");
	if (sizeBytes > 268435456) throw new SkillUploadRequestError("skill archive exceeds maximum upload size");
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
function hashText(value) {
	return createHash("sha256").update(value).digest("hex");
}
function resolveUploadsRoot(rootDir) {
	return path.resolve(rootDir ?? path.join(resolveStateDir(), "tmp", "skill-uploads"));
}
function resolveUploadDir(rootDir, uploadId) {
	return path.join(rootDir, validateUploadId(uploadId));
}
function resolveMetadataPath(rootDir, uploadId) {
	return path.join(resolveUploadDir(rootDir, uploadId), "metadata.json");
}
function resolveArchivePath(rootDir, uploadId) {
	return path.join(resolveUploadDir(rootDir, uploadId), "archive.zip");
}
function resolveIdempotencyPath(rootDir, keyHash) {
	return path.join(rootDir, "idempotency", `${keyHash}.json`);
}
function estimateBase64DecodedBytes(value) {
	const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
	return value.length / 4 * 3 - padding;
}
function decodeBase64Chunk(dataBase64) {
	const normalized = dataBase64.trim();
	if (!normalized || normalized.length % 4 !== 0 || !BASE64_PATTERN.test(normalized)) throw new SkillUploadRequestError("invalid dataBase64");
	if (normalized.length > MAX_SKILL_UPLOAD_BASE64_LENGTH) throw new SkillUploadRequestError("upload chunk exceeds maximum size");
	if (estimateBase64DecodedBytes(normalized) > MAX_SKILL_UPLOAD_CHUNK_BYTES) throw new SkillUploadRequestError("upload chunk exceeds maximum size");
	const decoded = Buffer.from(normalized, "base64");
	if (decoded.length < 1) throw new SkillUploadRequestError("empty upload chunk");
	if (decoded.length > MAX_SKILL_UPLOAD_CHUNK_BYTES) throw new SkillUploadRequestError("upload chunk exceeds maximum size");
	return decoded;
}
async function assertNotExpired(rootDir, record, now) {
	const validNow = asDateTimestampMs(now);
	if (validNow !== void 0 && !isFutureDateTimestampMs(record.expiresAt, { nowMs: validNow })) {
		await removeRecordFiles(rootDir, record);
		throw new SkillUploadRequestError("upload has expired");
	}
	if (validNow === void 0) throw new SkillUploadRequestError("upload has expired");
}
async function computeFileSha256(filePath) {
	const digest = createHash("sha256");
	for await (const chunk of createReadStream(filePath)) digest.update(chunk);
	return digest.digest("hex");
}
async function readRecord(rootDir, uploadId) {
	const record = await readDurableJsonFile(resolveMetadataPath(rootDir, uploadId));
	if (!record || record.version !== 1 || record.uploadId !== uploadId) throw new SkillUploadRequestError(`upload not found: ${uploadId}`);
	return {
		...record,
		archivePath: resolveArchivePath(rootDir, uploadId)
	};
}
async function readRecordIfPresent(rootDir, uploadId) {
	const record = await readDurableJsonFile(resolveMetadataPath(rootDir, uploadId));
	if (!record || record.version !== 1 || record.uploadId !== uploadId) return null;
	return {
		...record,
		archivePath: resolveArchivePath(rootDir, uploadId)
	};
}
async function writeRecord(rootDir, record) {
	await writeJson(resolveMetadataPath(rootDir, record.uploadId), record, {
		mode: 384,
		dirMode: 448,
		trailingNewline: true
	});
}
async function removeUploadDir(rootDir, uploadId) {
	await fs$1.rm(resolveUploadDir(rootDir, uploadId), {
		recursive: true,
		force: true
	});
}
async function removeRecordFiles(rootDir, record) {
	await removeUploadDir(rootDir, record.uploadId);
	if (record.idempotencyKeyHash) await fs$1.rm(resolveIdempotencyPath(rootDir, record.idempotencyKeyHash), { force: true });
}
async function listUploadIds(rootDir) {
	return (await fs$1.readdir(rootDir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory() && isUploadId(entry.name)).map((entry) => entry.name);
}
async function cleanupExpiredUploads(rootDir, nowMs, excludeUploadId) {
	for (const uploadId of await listUploadIds(rootDir)) {
		if (uploadId === excludeUploadId) continue;
		await withLock(`${rootDir}:upload:${uploadId}`, async () => {
			const record = await readRecordIfPresent(rootDir, uploadId).catch(() => null);
			const validNow = asDateTimestampMs(nowMs);
			if (record && validNow !== void 0 && !isFutureDateTimestampMs(record.expiresAt, { nowMs: validNow })) await removeRecordFiles(rootDir, record);
		});
	}
}
async function countActiveUploads(rootDir, nowMs) {
	let count = 0;
	for (const uploadId of await listUploadIds(rootDir)) {
		const record = await readRecordIfPresent(rootDir, uploadId).catch(() => null);
		if (record && isFutureDateTimestampMs(record.expiresAt, { nowMs })) count += 1;
	}
	return count;
}
async function writeArchiveChunk(params) {
	const handle = await fs$1.open(params.archivePath, "r+");
	try {
		await handle.truncate(params.offset);
		let written = 0;
		while (written < params.decoded.length) {
			const result = await handle.write(params.decoded, written, params.decoded.length - written, params.offset + written);
			if (result.bytesWritten <= 0) throw new Error("failed to write upload chunk");
			written += result.bytesWritten;
		}
		await handle.sync();
		await params.afterSync();
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function readCommittedRecord(rootDir, uploadId, nowMs) {
	const record = await readRecord(rootDir, uploadId);
	await assertNotExpired(rootDir, record, nowMs);
	if (!record.committed) throw new SkillUploadRequestError("upload is not committed");
	if (!record.actualSha256) throw new SkillUploadRequestError("committed upload is missing sha256");
	const stat = await fs$1.stat(record.archivePath).catch(() => null);
	if (!stat || stat.size !== record.sizeBytes) throw new SkillUploadRequestError("uploaded archive is missing or incomplete");
	return record;
}
function createSkillUploadStore(options) {
	const rootDir = resolveUploadsRoot(options?.rootDir);
	const now = options?.now ?? Date.now;
	const ttlMs = options?.ttlMs ?? SKILL_UPLOAD_TTL_MS;
	return {
		rootDir,
		async begin(params) {
			return await withLock(`${rootDir}:begin`, async () => {
				await cleanupExpiredUploads(rootDir, now());
				if (params.kind !== "skill-archive") throw new SkillUploadRequestError("unsupported upload kind");
				const slug = validateUploadSlug(params.slug);
				const sizeBytes = validateSizeBytes(params.sizeBytes);
				const sha256 = normalizeSkillUploadSha256(params.sha256);
				const force = params.force === true;
				const idempotencyKey = validateIdempotencyKey(params.idempotencyKey);
				const keyHash = idempotencyKey ? hashText(idempotencyKey) : void 0;
				if (keyHash) {
					const existing = await readDurableJsonFile(resolveIdempotencyPath(rootDir, keyHash));
					if (existing) {
						if (existing.kind !== params.kind || existing.slug !== slug || existing.force !== force || existing.sizeBytes !== sizeBytes || existing.sha256 !== sha256) throw new SkillUploadRequestError("idempotencyKey conflicts with a different upload");
						const existingUploadId = validateUploadId(existing.uploadId);
						const activeExisting = await withLock(`${rootDir}:upload:${existingUploadId}`, async () => {
							const record = await readRecordIfPresent(rootDir, existingUploadId);
							if (record && isFutureDateTimestampMs(record.expiresAt, { nowMs: now() })) return {
								uploadId: record.uploadId,
								receivedBytes: record.receivedBytes,
								expiresAt: record.expiresAt
							};
							if (record) await removeRecordFiles(rootDir, record);
							else {
								await removeUploadDir(rootDir, existingUploadId);
								await fs$1.rm(resolveIdempotencyPath(rootDir, keyHash), { force: true });
							}
							return null;
						});
						if (activeExisting) return activeExisting;
					}
				}
				if (await countActiveUploads(rootDir, now()) >= 32) throw new SkillUploadRequestError("too many active skill uploads");
				const uploadId = randomUUID();
				const uploadDir = resolveUploadDir(rootDir, uploadId);
				const archivePath = resolveArchivePath(rootDir, uploadId);
				const createdAt = now();
				const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: createdAt });
				if (expiresAt === void 0) throw new SkillUploadRequestError("invalid upload expiry");
				const record = {
					version: 1,
					kind: params.kind,
					uploadId,
					slug,
					force,
					sizeBytes,
					...sha256 ? { sha256 } : {},
					receivedBytes: 0,
					archivePath,
					createdAt,
					expiresAt,
					committed: false,
					...keyHash ? { idempotencyKeyHash: keyHash } : {}
				};
				await fs$1.mkdir(uploadDir, {
					recursive: true,
					mode: 448
				});
				await fs$1.writeFile(archivePath, Buffer.alloc(0), { mode: 384 });
				await writeRecord(rootDir, record);
				if (keyHash) {
					const idem = {
						version: 1,
						keyHash,
						uploadId,
						kind: params.kind,
						slug,
						force,
						sizeBytes,
						...sha256 ? { sha256 } : {}
					};
					await writeJson(resolveIdempotencyPath(rootDir, keyHash), idem, {
						mode: 384,
						dirMode: 448,
						trailingNewline: true
					});
				}
				return {
					uploadId,
					receivedBytes: 0,
					expiresAt: record.expiresAt
				};
			});
		},
		async chunk(params) {
			const uploadId = validateUploadId(params.uploadId);
			const offset = validateOffset(params.offset);
			const decoded = decodeBase64Chunk(params.dataBase64);
			await cleanupExpiredUploads(rootDir, now(), uploadId);
			return await withLock(`${rootDir}:upload:${uploadId}`, async () => {
				const record = await readRecord(rootDir, uploadId);
				await assertNotExpired(rootDir, record, now());
				if (record.committed) throw new SkillUploadRequestError("upload is already committed");
				if (offset !== record.receivedBytes) throw new SkillUploadRequestError(`upload offset mismatch: expected ${record.receivedBytes}, got ${offset}`);
				const nextSize = record.receivedBytes + decoded.length;
				if (nextSize > record.sizeBytes) throw new SkillUploadRequestError("upload chunk exceeds declared size");
				const nextRecord = {
					...record,
					receivedBytes: nextSize
				};
				await writeArchiveChunk({
					archivePath: record.archivePath,
					offset: record.receivedBytes,
					decoded,
					afterSync: async () => {
						await writeRecord(rootDir, nextRecord);
					}
				});
				return {
					uploadId,
					receivedBytes: nextRecord.receivedBytes,
					expiresAt: nextRecord.expiresAt
				};
			});
		},
		async commit(params) {
			const uploadId = validateUploadId(params.uploadId);
			const requestedSha = normalizeSkillUploadSha256(params.sha256);
			return await withLock(`${rootDir}:upload:${uploadId}`, async () => {
				const record = await readRecord(rootDir, uploadId);
				await assertNotExpired(rootDir, record, now());
				if (record.committed) {
					if (!record.actualSha256) throw new SkillUploadRequestError("committed upload is missing sha256");
					if (requestedSha && requestedSha !== record.actualSha256) throw new SkillUploadRequestError("upload sha256 mismatch");
					return {
						uploadId,
						receivedBytes: record.receivedBytes,
						sha256: record.actualSha256,
						expiresAt: record.expiresAt
					};
				}
				if (record.receivedBytes !== record.sizeBytes) throw new SkillUploadRequestError(`upload size mismatch: expected ${record.sizeBytes}, got ${record.receivedBytes}`);
				const stat = await fs$1.stat(record.archivePath).catch(() => null);
				if (!stat || stat.size !== record.sizeBytes) throw new SkillUploadRequestError("uploaded archive is missing or incomplete");
				if (record.sha256 && requestedSha && record.sha256 !== requestedSha) throw new SkillUploadRequestError("upload sha256 does not match begin sha256");
				const actualSha256 = await computeFileSha256(record.archivePath);
				const expectedSha = requestedSha ?? record.sha256;
				if (expectedSha && expectedSha !== actualSha256) throw new SkillUploadRequestError("upload sha256 mismatch");
				const nextRecord = {
					...record,
					sha256: record.sha256 ?? requestedSha ?? actualSha256,
					actualSha256,
					committed: true,
					committedAt: now()
				};
				await writeRecord(rootDir, nextRecord);
				return {
					uploadId,
					receivedBytes: nextRecord.receivedBytes,
					sha256: actualSha256,
					expiresAt: nextRecord.expiresAt
				};
			});
		},
		async withCommittedUpload(uploadIdRaw, action) {
			const uploadId = validateUploadId(uploadIdRaw);
			return await withLock(`${rootDir}:upload:${uploadId}`, async () => {
				const record = await readCommittedRecord(rootDir, uploadId, now());
				return await action(record, { remove: async () => {
					await removeRecordFiles(rootDir, record);
				} });
			});
		},
		async remove(uploadIdRaw) {
			const uploadId = validateUploadId(uploadIdRaw);
			await withLock(`${rootDir}:upload:${uploadId}`, async () => {
				const record = await readDurableJsonFile(resolveMetadataPath(rootDir, uploadId));
				if (record && record.version === 1 && record.uploadId === uploadId) await removeRecordFiles(rootDir, record);
				else await removeUploadDir(rootDir, uploadId);
			});
		}
	};
}
const defaultSkillUploadStore = createSkillUploadStore();
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
function projectClawHubVerdictItem(item, registry) {
	const projected = {
		registry,
		ok: item.ok,
		decision: item.decision,
		reasons: item.reasons,
		requestedSlug: item.requestedSlug,
		requestedVersion: item.requestedVersion
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
		const key = `${link.registry}\0${link.slug}\0${link.installedVersion}`;
		targets.set(key, {
			registry: link.registry,
			slug: link.slug,
			version: link.installedVersion
		});
	}
	return [...targets.values()];
}
async function fetchOpenClawSkillSecurityVerdicts(targets) {
	const byRegistry = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const registryTargets = byRegistry.get(target.registry) ?? [];
		registryTargets.push({
			slug: target.slug,
			version: target.version
		});
		byRegistry.set(target.registry, registryTargets);
	}
	const items = [];
	for (const [registry, registryTargets] of byRegistry) {
		const response = await fetchClawHubSkillSecurityVerdicts({
			baseUrl: registry,
			items: registryTargets,
			skipAuth: true
		});
		for (const item of response.items) items.push(projectClawHubVerdictItem(item, registry));
	}
	return items;
}
//#endregion
//#region src/gateway/server-methods/skills-upload.ts
function uploadErrorShape(prefix, errors) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `${prefix}: ${formatValidationErrors(errors)}`);
}
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
		if (!validator(params)) {
			respond(false, void 0, uploadErrorShape(`invalid ${name} params`, validator.errors));
			return;
		}
		try {
			respond(true, await action(params), void 0);
		} catch (err) {
			respond(false, void 0, mapUploadError(err));
		}
	};
}
//#endregion
//#region src/gateway/server-methods/skills.ts
function resolveSkillsAgentWorkspace(params, context) {
	const cfg = context.getRuntimeConfig();
	const agentIdRaw = params && typeof params === "object" && "agentId" in params ? normalizeOptionalString(params.agentId) : void 0;
	const agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : resolveDefaultAgentId(cfg);
	if (agentIdRaw) {
		if (!listAgentIds(cfg).includes(agentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${agentIdRaw}"`)
		};
	}
	return {
		ok: true,
		cfg,
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
	};
}
function buildRemoteAwareWorkspaceSkillStatus(resolved) {
	return buildWorkspaceSkillStatus(resolved.workspaceDir, {
		config: resolved.cfg,
		agentId: resolved.agentId,
		eligibility: { remote: getRemoteSkillEligibility({ advertiseExecNode: canExecRequestNode({
			cfg: resolved.cfg,
			agentId: resolved.agentId
		}) }) }
	});
}
function respondSkillWorkshopError(respond, err) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(err)));
}
function buildRevisionAgentInstruction(proposal) {
	if (!proposal) return "";
	return [
		`Revise Skill Workshop proposal \`${proposal.record.id}\` (${proposal.record.target.skillKey}).`,
		"",
		"Use `skill_workshop` with `action=inspect` first, then `action=revise` for that pending proposal.",
		"Do not apply, approve, reject, quarantine, or install the proposal.",
		"",
		"Requested changes:"
	].join("\n");
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
	} catch (err) {
		respondSkillWorkshopError(params.respond, err);
	}
}
async function forwardSkillWorkshopRevisionToChatSend(opts, params) {
	const { chatHandlers } = await import("./chat-SmkHr_Ev.js");
	const chatSend = chatHandlers["chat.send"];
	if (!chatSend) throw new Error("chat.send handler is unavailable");
	const chatParams = {
		sessionKey: params.sessionKey,
		agentId: params.targetAgentId ?? params.agentId,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		message: params.instructions,
		deliver: false,
		systemProvenanceReceipt: buildRevisionAgentInstruction(params.proposal),
		suppressCommandInterpretation: true,
		idempotencyKey: params.idempotencyKey
	};
	await chatSend({
		...opts,
		req: {
			...opts.req,
			method: "chat.send",
			params: chatParams
		},
		params: chatParams
	});
}
/** Gateway request handlers for skill status, catalogs, installs, updates, and workshop proposals. */
const skillsHandlers = {
	...skillsUploadHandlers,
	"skills.status": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsStatusParams, "skills.status", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		respond(true, buildRemoteAwareWorkspaceSkillStatus(resolved), void 0);
	},
	"skills.securityVerdicts": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsSecurityVerdictsParams, "skills.securityVerdicts", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		try {
			const targets = collectClawHubVerdictTargets(buildRemoteAwareWorkspaceSkillStatus(resolved));
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
	"skills.skillCard": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsSkillCardParams, "skills.skillCard", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		const skill = buildWorkspaceSkillStatus(resolved.workspaceDir, {
			config: resolved.cfg,
			agentId: resolved.agentId
		}).skills.find((candidate) => candidate.skillKey === params.skillKey);
		if (!skill?.skillCard) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `skill card not found for ${params.skillKey}`));
			return;
		}
		const content = readLocalSkillCardContentSync(skill.baseDir);
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
	"skills.bins": ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsBinsParams, "skills.bins", respond)) return;
		const cfg = context.getRuntimeConfig();
		const workspaceDirs = listAgentWorkspaceDirs(cfg);
		const bins = /* @__PURE__ */ new Set();
		for (const workspaceDir of workspaceDirs) {
			const entries = loadWorkspaceSkillEntries(workspaceDir, { config: cfg });
			for (const bin of collectSkillBins(entries)) bins.add(bin);
		}
		respond(true, { bins: [...bins].toSorted() }, void 0);
	},
	"skills.search": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsSearchParams, "skills.search", respond)) return;
		try {
			respond(true, { results: await searchSkillsFromClawHub({
				query: params.query,
				limit: params.limit
			}) }, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
		}
	},
	"skills.detail": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSkillsDetailParams, "skills.detail", respond)) return;
		try {
			respond(true, await fetchClawHubSkillDetail({ slug: params.slug }), void 0);
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
			run: (_parsedParams, resolved) => listSkillProposals({ workspaceDir: resolved.workspaceDir })
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
				const proposal = await inspectSkillProposal(parsedParams.proposalId, { workspaceDir: resolved.workspaceDir });
				if (!proposal) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Skill proposal not found: ${parsedParams.proposalId}`));
					return SKILL_PROPOSAL_RESPONSE_HANDLED;
				}
				return proposal;
			}
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
				config: resolved.cfg,
				name: parsedParams.name,
				description: parsedParams.description,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				createdBy: "gateway",
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			})
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
				skillName: parsedParams.skillName,
				description: parsedParams.description,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				createdBy: "gateway",
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			})
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
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				content: parsedParams.content,
				supportFiles: parsedParams.supportFiles,
				description: parsedParams.description,
				goal: parsedParams.goal,
				evidence: parsedParams.evidence
			})
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
				const proposal = await inspectSkillProposal(parsedParams.proposalId, { workspaceDir: resolved.workspaceDir });
				if (!proposal) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Skill proposal not found: ${parsedParams.proposalId}`));
					return SKILL_PROPOSAL_RESPONSE_HANDLED;
				}
				if (proposal.record.status !== "pending") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Skill proposal is not pending: ${parsedParams.proposalId}`));
					return SKILL_PROPOSAL_RESPONSE_HANDLED;
				}
				await forwardSkillWorkshopRevisionToChatSend(opts, {
					agentId: resolved.agentId,
					idempotencyKey: parsedParams.idempotencyKey,
					instructions: parsedParams.instructions,
					proposal,
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
			validate: validateSkillsProposalActionParams,
			run: (parsedParams, resolved) => applySkillProposal({
				workspaceDir: resolved.workspaceDir,
				config: resolved.cfg,
				proposalId: parsedParams.proposalId,
				reason: parsedParams.reason
			})
		});
	},
	"skills.proposals.reject": async ({ params, respond, context }) => {
		await runSkillsProposalWorkspaceHandler({
			method: "skills.proposals.reject",
			rawParams: params,
			respond,
			context,
			validate: validateSkillsProposalActionParams,
			run: (parsedParams, resolved) => rejectSkillProposal({
				workspaceDir: resolved.workspaceDir,
				proposalId: parsedParams.proposalId,
				reason: parsedParams.reason
			})
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
				proposalId: parsedParams.proposalId,
				reason: parsedParams.reason
			})
		});
	},
	"skills.install": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsInstallParams, "skills.install", respond)) return;
		const resolved = resolveSkillsAgentWorkspace(params, context);
		if (!resolved.ok) {
			respond(false, void 0, resolved.error);
			return;
		}
		const cfg = resolved.cfg;
		const workspaceDirRaw = resolved.workspaceDir;
		if (params && typeof params === "object" && "source" in params && params.source === "clawhub") {
			const p = params;
			const result = await installSkillFromClawHub({
				workspaceDir: workspaceDirRaw,
				slug: p.slug,
				version: p.version,
				force: Boolean(p.force),
				config: cfg
			});
			respond(result.ok, result.ok ? {
				ok: true,
				message: `Installed ${result.slug}@${result.version}`,
				stdout: "",
				stderr: "",
				code: 0,
				slug: result.slug,
				version: result.version,
				targetDir: result.targetDir
			} : result, result.ok ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, result.error));
			return;
		}
		if (params && typeof params === "object" && "source" in params && params.source === "upload") {
			const p = params;
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
		const p = params;
		const result = await installSkill({
			workspaceDir: workspaceDirRaw,
			skillName: p.name,
			installId: p.installId,
			timeoutMs: p.timeoutMs,
			config: cfg
		});
		respond(result.ok, result, result.ok ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, result.message));
	},
	"skills.update": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSkillsUpdateParams, "skills.update", respond)) return;
		if (params && typeof params === "object" && "source" in params && params.source === "clawhub") {
			const p = params;
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
				config: resolved.cfg
			});
			const errors = results.filter((result) => !result.ok);
			respond(errors.length === 0, {
				ok: errors.length === 0,
				skillKey: p.slug ?? "*",
				config: {
					source: "clawhub",
					results
				}
			}, errors.length === 0 ? void 0 : errorShape(ErrorCodes.UNAVAILABLE, errors.map((result) => result.error).join("; ")));
			return;
		}
		const p = params;
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
