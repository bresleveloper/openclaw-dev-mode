import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { _ as resolveDeliveryQueueMediaDir } from "./paths-orClZ-2Z.mjs";
import { a as generateSecureUuid } from "./secure-random-DxCgeORs.mjs";
import { t as captureDeliveryQueueStateContext } from "./delivery-queue-state-context-jMYRv0Lv.mjs";
import { l as executeDeliveryQueueOperation } from "./delivery-queue-sqlite-BYjmoa0a.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BdNs7xa2.mjs";
import { i as spoolRelativePath, n as collectEntrySpoolPaths, r as payloadMediaSources, t as ARTIFACT_NAME_RE } from "./delivery-queue-media-paths-BG8SwZ0-.mjs";
import { t as buildOutboundMediaLoadOptions } from "./load-options-gEuoEu4c.mjs";
import { n as loadWebMedia } from "./web-media-Dv3ATZ34.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileStore } from "@openclaw/fs-safe/store";
//#region src/infra/outbound/delivery-queue-media-staging.ts
async function createDeliveryQueueMediaRetention(artifacts, entryKind, stateDir, context) {
	const prepared = {
		id: generateSecureUuid(),
		enqueuedAt: Date.now()
	};
	return executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.createMediaRetention",
		input: {
			artifacts: [...artifacts],
			entryKind,
			prepared
		}
	});
}
/** Release a stage or recovery lease after its owner settles. */
async function cancelDeliveryQueueMediaRetention(id, stateDir, context) {
	if (!id) return;
	await executeDeliveryQueueOperation(context, stateDir, {
		type: "deliveryQueue.cancelMediaRetention",
		input: { id }
	});
}
/** Captures staging expiry and all media custody on the same connection. */
async function loadDeliveryQueueMediaRetentionSnapshot(params, context) {
	return executeDeliveryQueueOperation(context, params.stateDir, {
		type: "deliveryQueue.mediaRetentionSnapshot",
		input: { expireBeforeMs: params.expireBeforeMs }
	});
}
//#endregion
//#region src/infra/outbound/delivery-queue-media-spool.ts
const ARTIFACT_EXT_RE = /^\.[A-Za-z0-9]{1,10}$/;
const PART_SUFFIX = ".part";
const ORPHAN_GRACE_MS = 864e5;
function ignoreMissingArtifact(error) {
	if (hasErrnoCode(error, "ENOENT")) return null;
	throw error;
}
function openSpoolStore(stateDir, maxBytes) {
	return fileStore({
		rootDir: resolveDeliveryQueueMediaDir(stateDir),
		dirMode: 448,
		mode: 384,
		maxBytes
	});
}
function resolveArtifactExtension(source) {
	const extension = path.extname(source.split("?")[0] ?? "");
	return ARTIFACT_EXT_RE.test(extension) ? extension.toLowerCase() : "";
}
/** Remote and data sources carry their own bytes; only local paths need queue custody. */
function isSpoolableSource(source) {
	return !isPassThroughRemoteMediaSource(source) && !/^data:/i.test(source);
}
/**
* Copies local media into queue custody and rewrites only the queue payloads.
* The same loader and capability as the live send authorize every source.
*/
async function stageQueuePayloadMedia(params, context) {
	const stateDir = context?.stateDir ?? params.stateDir;
	if (params.payloads.some((payload) => payload.sensitiveMedia === true && payloadMediaSources(payload).length > 0)) return {
		status: "not-durable",
		reason: "sensitive-media"
	};
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(stateDir));
	const artifactPrefix = params.artifactFormat === "command-owner-v1" ? "c1-" : params.artifactFormat === "session-generation-v1" ? "g1-" : "";
	const artifactsBySource = /* @__PURE__ */ new Map();
	for (const source of params.payloads.flatMap(payloadMediaSources)) if (isSpoolableSource(source) && !artifactsBySource.has(source)) artifactsBySource.set(source, path.join(spoolRoot, `${artifactPrefix}${generateSecureUuid()}${resolveArtifactExtension(source)}`));
	const artifacts = [...artifactsBySource.values()];
	const mediaStageId = artifacts.length > 0 ? await createDeliveryQueueMediaRetention(artifacts, "outbound-media-stage", stateDir, context) : void 0;
	const store = openSpoolStore(stateDir, params.maxBytes);
	const publishedSources = /* @__PURE__ */ new Set();
	const stageSource = async (source) => {
		const stagedPath = artifactsBySource.get(source);
		if (!stagedPath) throw new Error(`Delivery queue media source was not planned: ${source}`);
		if (publishedSources.has(source)) return stagedPath;
		const media = await loadWebMedia(source, buildOutboundMediaLoadOptions({
			maxBytes: params.maxBytes,
			mediaAccess: params.mediaAccess,
			mediaLocalRoots: params.mediaAccess?.localRoots,
			mediaReadFile: params.mediaAccess?.readFile
		}));
		const finalRelative = path.basename(stagedPath);
		const partRelative = `${finalRelative}${PART_SUFFIX}`;
		try {
			await store.write(partRelative, media.buffer, { maxBytes: params.maxBytes });
			await (await store.root()).move(partRelative, finalRelative, { overwrite: false });
			publishedSources.add(source);
		} catch (err) {
			await store.remove(partRelative).catch(() => void 0);
			throw err;
		}
		return stagedPath;
	};
	const stagedPayloads = [];
	try {
		for (const payload of params.payloads) {
			if (!payloadMediaSources(payload).some(isSpoolableSource)) {
				stagedPayloads.push(payload);
				continue;
			}
			const staged = { ...payload };
			if (hasNonEmptyString(payload.mediaUrl) && isSpoolableSource(payload.mediaUrl)) staged.mediaUrl = await stageSource(payload.mediaUrl);
			if (payload.mediaUrls) {
				const stagedMediaUrls = [];
				for (const mediaUrl of payload.mediaUrls) stagedMediaUrls.push(hasNonEmptyString(mediaUrl) && isSpoolableSource(mediaUrl) ? await stageSource(mediaUrl) : mediaUrl);
				staged.mediaUrls = stagedMediaUrls;
			}
			stagedPayloads.push(staged);
		}
	} catch (err) {
		await cancelDeliveryQueueMediaRetention(mediaStageId, stateDir, context);
		await releaseSpoolArtifacts(artifacts, stateDir);
		throw err;
	}
	return {
		status: "staged",
		payloads: stagedPayloads,
		artifacts,
		...mediaStageId ? { mediaStageId } : {}
	};
}
/** Discards spool artifacts whose durable row is already gone. Never throws. */
async function releaseSpoolArtifacts(artifacts, stateDir) {
	for (const artifact of artifacts) {
		const relative = spoolRelativePath(artifact, stateDir);
		if (relative) try {
			await openSpoolStore(stateDir).remove(relative);
		} catch {}
	}
}
/**
* Removes old unreferenced spool files. Pending-row references always win over
* age; the grace covers the stage-before-row-commit crash window and bounds all
* final and partial artifacts that never acquire a row.
*/
async function pruneOrphanedDeliveryQueueMedia(params, context) {
	const captured = context ?? captureDeliveryQueueStateContext(params?.stateDir);
	const stateDir = captured.stateDir;
	const cutoffMs = (params?.nowMs ?? Date.now()) - ORPHAN_GRACE_MS;
	const snapshot = await loadDeliveryQueueMediaRetentionSnapshot({ expireBeforeMs: cutoffMs }, captured);
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(stateDir));
	const retainPaths = new Set(snapshot.stagedArtifacts.concat(snapshot.payloads.flatMap((payloads) => collectEntrySpoolPaths(payloads, stateDir))).map((entry) => path.resolve(entry)));
	const entries = await fs.readdir(spoolRoot, { withFileTypes: true }).catch(ignoreMissingArtifact);
	if (!entries) return;
	for (const entry of entries) {
		if (!entry.isFile() || !ARTIFACT_NAME_RE.test(entry.name)) continue;
		const artifactPath = path.join(spoolRoot, entry.name);
		if (retainPaths.has(artifactPath)) continue;
		const stats = await fs.stat(artifactPath).catch(ignoreMissingArtifact);
		if (!stats || stats.mtimeMs > cutoffMs) continue;
		await releaseSpoolArtifacts([artifactPath], stateDir);
	}
}
//#endregion
export { createDeliveryQueueMediaRetention as a, cancelDeliveryQueueMediaRetention as i, releaseSpoolArtifacts as n, stageQueuePayloadMedia as r, pruneOrphanedDeliveryQueueMedia as t };
