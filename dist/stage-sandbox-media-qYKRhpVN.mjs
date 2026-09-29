import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as readLocalFileSafely, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { a as safeFileURLToPath } from "./local-file-access-B6bU8SNO.mjs";
import { l as normalizeMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { n as assertSandboxPath } from "./sandbox-paths-BZ4BvxS2.mjs";
import { t as isInboundPathAllowed } from "./inbound-path-policy-DQ5Rksw7.mjs";
import { s as getMediaDir } from "./store-CqRcb7T5.mjs";
import { o as resolveInboundMediaReference } from "./media-reference-CtGDBk0x.mjs";
import { a as ensureStagedInputDirectory, l as stagedInputDirectory, n as STAGED_INPUT_MAX_BYTES, u as stagedInputFileName } from "./staged-inputs-De-HBXyz.mjs";
import { i as normalizeScpRemotePath, r as normalizeScpRemoteHost } from "./scp-host-cvN2qLIC.mjs";
import { i as slugifySessionKey } from "./shared-ByhrzAKj.mjs";
import { r as resolveChannelRemoteInboundAttachmentRoots } from "./channel-inbound-roots-CfxoD3IC.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-CiLAV5T3.mjs";
import "./sandbox-BnX1IPPh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/auto-reply/reply/stage-sandbox-media.ts
/** Maximum size of one file copied into an agent sandbox or staging workspace. */
const SANDBOX_MEDIA_MAX_BYTES = STAGED_INPUT_MAX_BYTES;
const SCP_STDERR_TAIL_CHARS = 16384;
const EMPTY_STAGE_RESULT = { staged: /* @__PURE__ */ new Map() };
async function stageSandboxMedia(params) {
	const { ctx, sessionCtx, cfg, sessionKey, workspaceDir, abortSignal } = params;
	abortSignal?.throwIfAborted();
	const media = normalizeMediaFacts(ctx.media);
	const pathEntries = media.flatMap((fact, index) => {
		const mediaPath = normalizeOptionalString(fact.path);
		return mediaPath ? [{
			index,
			path: mediaPath
		}] : [];
	});
	if (pathEntries.length === 0 || !sessionKey) return EMPTY_STAGE_RESULT;
	const remoteWorkspace = getAgentWorkspaceAccess(workspaceDir, "prepareTurnAttachments");
	if (remoteWorkspace?.prepareTurnAttachments && !ctx.MediaRemoteHost) return EMPTY_STAGE_RESULT;
	const sandbox = ctx.MediaRemoteHost && (remoteWorkspace?.prepareTurnAttachments || params.remoteMediaMode === "cache") ? null : await ensureSandboxWorkspaceForSession({
		config: cfg,
		agentId: params.agentId,
		sessionKey,
		workspaceDir
	});
	const remoteMediaCacheDir = ctx.MediaRemoteHost ? path.join(CONFIG_DIR, "media", "remote-cache", slugifySessionKey(sessionKey)) : null;
	const effectiveWorkspaceDir = sandbox?.workspaceDir ?? remoteMediaCacheDir ?? workspaceDir;
	if (!effectiveWorkspaceDir) return EMPTY_STAGE_RESULT;
	await fs.mkdir(effectiveWorkspaceDir, { recursive: true });
	const remoteAttachmentRoots = ctx.MediaRemoteHost ? resolveChannelRemoteInboundAttachmentRoots({
		cfg,
		ctx
	}) ?? [] : [];
	const usedNames = /* @__PURE__ */ new Set();
	const staged = /* @__PURE__ */ new Map();
	const stagedUrlAliases = /* @__PURE__ */ new Set();
	const inputDirectory = stagedInputDirectory(crypto.randomUUID());
	let stagingReady = false;
	const prepareDestination = async () => {
		if (!stagingReady) {
			await ensureStagedInputDirectory(effectiveWorkspaceDir, inputDirectory, abortSignal);
			stagingReady = true;
		}
	};
	for (const entry of pathEntries) {
		abortSignal?.throwIfAborted();
		const source = await resolveStageableMediaSource(entry.path);
		if (!source) continue;
		if (!await isAllowedSourcePath({
			source,
			mediaRemoteHost: ctx.MediaRemoteHost,
			remoteAttachmentRoots
		})) continue;
		const fileName = allocateStagedFileName(source, usedNames);
		const relativeDest = path.posix.join(inputDirectory, fileName);
		const dest = path.join(effectiveWorkspaceDir, relativeDest);
		try {
			if (ctx.MediaRemoteHost) await stageRemoteFileIntoRoot({
				remoteHost: ctx.MediaRemoteHost,
				remotePath: source,
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				abortSignal,
				prepareDestination
			});
			else await stageLocalFileIntoRoot({
				sourcePath: await fs.realpath(source).catch(() => source),
				rootDir: effectiveWorkspaceDir,
				relativeDestPath: relativeDest,
				abortSignal,
				prepareDestination
			});
		} catch (err) {
			if (abortSignal?.aborted && Object.is(err, abortSignal.reason)) throw err;
			if (err instanceof FsSafeError && err.code === "too-large") console.warn(`Inbound media staging skipped for ${fileName}: ${err.message}`);
			else logVerbose(`Failed to stage inbound media path ${source}: ${String(err)}`);
			continue;
		}
		const stagedPath = sandbox ? relativeDest : dest;
		staged.set(entry.index, stagedPath);
		if (await isUrlAliasForStagedSource({
			url: media[entry.index]?.url,
			sourcePath: entry.path,
			source,
			mediaRemoteHost: ctx.MediaRemoteHost
		})) stagedUrlAliases.add(entry.index);
	}
	abortSignal?.throwIfAborted();
	if (staged.size === 0) return { staged };
	const nextMedia = [...media];
	for (const [index, stagedPath] of staged) {
		const fact = nextMedia[index];
		if (fact) nextMedia[index] = {
			...fact,
			path: stagedPath,
			...stagedUrlAliases.has(index) ? { url: stagedPath } : {},
			workspaceDir: effectiveWorkspaceDir,
			staged: true
		};
	}
	ctx.media = nextMedia;
	if (sessionCtx !== ctx) sessionCtx.media = nextMedia;
	return { staged };
}
async function isUrlAliasForStagedSource(params) {
	const url = normalizeOptionalString(params.url);
	if (!url) return false;
	if (url === params.sourcePath) return true;
	const sourceAbsolutePath = resolveAbsolutePath(params.sourcePath);
	const urlAbsolutePath = resolveAbsolutePath(url);
	if (sourceAbsolutePath && urlAbsolutePath && path.normalize(sourceAbsolutePath) === path.normalize(urlAbsolutePath)) return true;
	if (params.mediaRemoteHost) return false;
	const urlSource = await resolveStageableMediaSource(url);
	if (!urlSource) return false;
	const [sourceIdentity, urlIdentity] = await Promise.all([resolveLocalSourceIdentity(params.source), resolveLocalSourceIdentity(urlSource)]);
	return sourceIdentity === urlIdentity;
}
async function resolveLocalSourceIdentity(sourcePath) {
	return await fs.realpath(sourcePath).catch(() => path.resolve(sourcePath));
}
async function resolveStageableMediaSource(value) {
	const raw = value.trim();
	if (!raw) return null;
	return (await resolveInboundMediaReference(raw).catch(() => null))?.physicalPath ?? resolveAbsolutePath(raw);
}
async function stageLocalFileIntoRoot(params) {
	const root$1 = await root(params.rootDir);
	const source = await readLocalFileSafely({
		filePath: params.sourcePath,
		maxBytes: SANDBOX_MEDIA_MAX_BYTES
	});
	params.abortSignal?.throwIfAborted();
	await params.prepareDestination();
	params.abortSignal?.throwIfAborted();
	await root$1.create(params.relativeDestPath, source.buffer);
}
async function stageRemoteFileIntoRoot(params) {
	const { abortSignal } = params;
	const safeRemoteHost = normalizeScpRemoteHost(params.remoteHost);
	if (!safeRemoteHost) throw new Error("invalid remote host for SCP");
	const safeRemotePath = normalizeScpRemotePath(params.remotePath);
	if (!safeRemotePath) throw new Error("invalid remote path for SCP");
	const tmpRoot = resolvePreferredOpenClawTmpDir();
	await fs.mkdir(tmpRoot, { recursive: true });
	const tmpDir = await fs.mkdtemp(path.join(tmpRoot, "stage-sandbox-media-"));
	const tmpPath = path.join(tmpDir, "download");
	try {
		await retryAsync(async () => {
			if (abortSignal?.aborted) return;
			const result = await runCommandWithTimeout([
				"scp",
				"-o",
				"BatchMode=yes",
				"-o",
				"StrictHostKeyChecking=yes",
				"--",
				`${safeRemoteHost}:${safeRemotePath}`,
				tmpPath
			], {
				signal: abortSignal,
				killProcessTree: true,
				maxOutputBytes: {
					stdout: 1,
					stderr: SCP_STDERR_TAIL_CHARS * 4
				}
			});
			if (result.code !== 0) {
				if (result.code === null && result.termination === "signal" && abortSignal?.aborted) return;
				const stderr = sliceUtf16Safe(result.stderr, -16384).trim();
				throw new Error(`scp failed (${result.code}): ${stderr}`);
			}
		}, {
			attempts: 3,
			label: "remote inbound media SCP",
			shouldRetry: () => !abortSignal?.aborted
		});
		abortSignal?.throwIfAborted();
		await stageLocalFileIntoRoot({
			...params,
			sourcePath: tmpPath
		});
	} finally {
		await fs.rm(tmpDir, {
			recursive: true,
			force: true
		}).catch(() => {});
	}
}
function resolveAbsolutePath(value) {
	let resolved = value.trim();
	if (!resolved) return null;
	if (/^file:/iu.test(resolved)) try {
		resolved = safeFileURLToPath(resolved);
	} catch {
		return null;
	}
	if (!path.isAbsolute(resolved)) return null;
	return resolved;
}
async function isAllowedSourcePath(params) {
	if (params.mediaRemoteHost) {
		if (!isInboundPathAllowed({
			filePath: params.source,
			roots: params.remoteAttachmentRoots
		})) {
			logVerbose(`Blocking remote media staging from disallowed attachment path: ${params.source}`);
			return false;
		}
		return true;
	}
	if (await resolveInboundMediaReference(params.source).catch(() => null)) return true;
	const mediaDir = getMediaDir();
	const canonicalMediaDir = await fs.realpath(mediaDir).catch(() => mediaDir);
	if (!isInboundPathAllowed({
		filePath: params.source,
		roots: [mediaDir, canonicalMediaDir]
	})) {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
	try {
		const canonicalSource = await fs.realpath(params.source).catch(() => params.source);
		await assertSandboxPath({
			filePath: canonicalSource,
			cwd: canonicalMediaDir,
			root: canonicalMediaDir
		});
		return true;
	} catch {
		logVerbose(`Blocking attempt to stage media from outside media directory: ${params.source}`);
		return false;
	}
}
function allocateStagedFileName(source, usedNames) {
	const baseName = stagedInputFileName(path.basename(source));
	const parsed = path.parse(baseName);
	let fileName = baseName;
	let suffix = 1;
	while (usedNames.has(fileName)) {
		fileName = `${parsed.name}-${suffix}${parsed.ext}`;
		suffix += 1;
	}
	usedNames.add(fileName);
	return fileName;
}
//#endregion
export { stageSandboxMedia as n, SANDBOX_MEDIA_MAX_BYTES as t };
