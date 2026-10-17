import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as readLocalFileSafely, t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as CONFIG_DIR } from "./utils-DgZn2dLu.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import { l as normalizeMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { d as stagedInputFileName, o as ensureStagedInputDirectory, r as STAGED_INPUT_MAX_BYTES, u as stagedInputDirectory } from "./staged-inputs-B7cE4lVT.mjs";
import { n as assertSandboxPath } from "./sandbox-paths-Br7HP2l8.mjs";
import { t as isInboundPathAllowed } from "./inbound-path-policy-BLgg6tDE.mjs";
import { f as saveMediaBuffer, s as getMediaDir } from "./store-A0dMc8iV.mjs";
import { r as resolveInboundMediaReference, t as buildInboundMediaUriFromPath } from "./media-reference-BIOMSmeS.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { n as normalizeScpRemoteHost, r as normalizeScpRemotePath } from "./scp-host-DbBwyscY.mjs";
import { r as resolveChannelRemoteInboundAttachmentRoots } from "./channel-inbound-roots-2L0jUOVE.mjs";
import { i as slugifySessionKey } from "./shared-2nFGF-qq.mjs";
import { n as resolveSandboxContext, t as ensureSandboxWorkspaceForSession } from "./context-BsEuTEPJ.mjs";
import "./sandbox-Ds9JeFO_.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/auto-reply/reply/stage-sandbox-media.ts
/** Maximum size of one file copied into an agent sandbox or staging workspace. */
const SANDBOX_MEDIA_MAX_BYTES = STAGED_INPUT_MAX_BYTES;
const SCP_STDERR_TAIL_CHARS = 16384;
const EMPTY_STAGE_RESULT = { staged: /* @__PURE__ */ new Map() };
async function stageSandboxMedia(params) {
	const { ctx, sessionCtx, cfg, sessionKey, workspaceDir, abortSignal } = params;
	abortSignal?.throwIfAborted();
	const media = normalizeMediaFacts(ctx.media);
	const pathEntries = media.flatMap((fact, index) => fact.path ? [{
		index,
		path: fact.path
	}] : []);
	if (pathEntries.length === 0 || !sessionKey) return EMPTY_STAGE_RESULT;
	const remoteWorkspace = getAgentWorkspaceAccess(workspaceDir, "prepareTurnAttachments");
	if (remoteWorkspace?.prepareTurnAttachments && !ctx.MediaRemoteHost) return EMPTY_STAGE_RESULT;
	const forceRemoteCache = ctx.MediaRemoteHost && (remoteWorkspace?.prepareTurnAttachments || params.remoteMediaMode === "cache");
	const sandboxParams = {
		config: cfg,
		agentId: params.agentId,
		sessionKey,
		workspaceDir,
		skillsSnapshot: params.skillsSnapshot
	};
	const sshSandbox = !forceRemoteCache && resolveSandboxConfigForAgent(cfg, resolveSessionAgentId({
		sessionKey,
		config: cfg,
		agentId: params.agentId
	})).backend === "ssh" ? await resolveSandboxContext(sandboxParams) : null;
	const sandbox = forceRemoteCache ? null : sshSandbox ?? await ensureSandboxWorkspaceForSession(sandboxParams);
	const remoteBridge = sshSandbox?.fsBridge;
	if (sshSandbox && !remoteBridge) throw new Error("SSH sandbox has no filesystem bridge for inbound media staging");
	const remoteMediaCacheDir = ctx.MediaRemoteHost ? path.join(CONFIG_DIR, "media", "remote-cache", slugifySessionKey(sessionKey)) : null;
	const effectiveWorkspaceDir = sandbox?.workspaceDir ?? remoteMediaCacheDir ?? workspaceDir;
	if (!effectiveWorkspaceDir) return EMPTY_STAGE_RESULT;
	if (!remoteBridge) await fs.mkdir(effectiveWorkspaceDir, { recursive: true });
	const remoteAttachmentRoots = ctx.MediaRemoteHost ? resolveChannelRemoteInboundAttachmentRoots({
		cfg,
		ctx
	}) ?? [] : [];
	const usedNames = /* @__PURE__ */ new Set();
	const staged = /* @__PURE__ */ new Map();
	const stagedUrls = /* @__PURE__ */ new Map();
	const inputDirectory = stagedInputDirectory(crypto.randomUUID());
	let stagingReady = false;
	const prepareDestination = async () => {
		if (!stagingReady) {
			if (remoteBridge) {
				if (!remoteBridge.createFileExclusive) throw new Error("SSH sandbox filesystem does not support exclusive input staging");
				abortSignal?.throwIfAborted();
				if (await remoteBridge.createFileExclusive({
					filePath: `${inputDirectory}/.gitignore`,
					data: "# Raw task inputs remain private; copy outputs into the project to publish.\n*\n",
					signal: abortSignal
				}) !== "created") throw new Error("Input staging directory is not owned by OpenClaw");
			} else await ensureStagedInputDirectory(effectiveWorkspaceDir, inputDirectory, abortSignal);
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
		let downloadedMediaUri;
		const stageSource = async (sourcePath) => {
			if (remoteBridge) {
				const { buffer } = await readLocalFileSafely({
					filePath: sourcePath,
					maxBytes: SANDBOX_MEDIA_MAX_BYTES
				});
				abortSignal?.throwIfAborted();
				await prepareDestination();
				abortSignal?.throwIfAborted();
				if (!remoteBridge.createFileExclusive) throw new Error("SSH sandbox filesystem does not support exclusive input staging");
				if (await remoteBridge.createFileExclusive({
					filePath: relativeDest,
					data: buffer,
					signal: abortSignal
				}) !== "created") throw new Error("Input staging file already exists");
				if (ctx.MediaRemoteHost) {
					const saved = await saveMediaBuffer(buffer, media[entry.index]?.contentType, "inbound", SANDBOX_MEDIA_MAX_BYTES, path.basename(source), void 0, { assertCommitAllowed: () => abortSignal?.throwIfAborted() });
					downloadedMediaUri = buildInboundMediaUriFromPath(saved.path);
				}
			} else {
				const root$1 = await root(effectiveWorkspaceDir);
				const { buffer } = await readLocalFileSafely({
					filePath: sourcePath,
					maxBytes: SANDBOX_MEDIA_MAX_BYTES
				});
				abortSignal?.throwIfAborted();
				await prepareDestination();
				abortSignal?.throwIfAborted();
				await root$1.create(relativeDest, buffer);
			}
		};
		try {
			if (ctx.MediaRemoteHost) await stageRemoteFileIntoRoot({
				remoteHost: ctx.MediaRemoteHost,
				remotePath: source,
				abortSignal,
				stageDownloadedFile: stageSource
			});
			else await stageSource(await fs.realpath(source).catch(() => source));
		} catch (err) {
			if (abortSignal?.aborted && Object.is(err, abortSignal.reason)) throw err;
			if (err instanceof FsSafeError && err.code === "too-large") console.warn(`Inbound media staging skipped for ${fileName}: ${err.message}`);
			else logVerbose(`Failed to stage inbound media path ${source}: ${String(err)}`);
			continue;
		}
		const stagedPath = sandbox ? relativeDest : dest;
		staged.set(entry.index, stagedPath);
		const originalUrl = media[entry.index]?.url;
		const rewritesUrl = await isUrlAliasForStagedSource({
			url: originalUrl,
			sourcePath: entry.path,
			source,
			mediaRemoteHost: ctx.MediaRemoteHost
		});
		const inboundUri = downloadedMediaUri ?? (!ctx.MediaRemoteHost && (!originalUrl || rewritesUrl) ? buildInboundMediaUriFromPath(source) : void 0);
		if (inboundUri || rewritesUrl) stagedUrls.set(entry.index, inboundUri ?? stagedPath);
	}
	abortSignal?.throwIfAborted();
	if (staged.size === 0) return { staged };
	const nextMedia = [...media];
	for (const [index, stagedPath] of staged) {
		const fact = nextMedia[index];
		if (fact) nextMedia[index] = {
			...fact,
			path: stagedPath,
			...stagedUrls.has(index) ? { url: stagedUrls.get(index) } : {},
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
		await params.stageDownloadedFile(tmpPath);
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
