import { l as extractArchive, r as ArchiveLimitError, t as ARCHIVE_LIMIT_ERROR_CODE } from "./archive-BVJWOqLD.mjs";
import { a as wrapExternalContent } from "./external-content-CLufk6dK.mjs";
import { f as saveMediaBuffer } from "./store-BrX2xbJz.mjs";
import "./archive-C3OhMJzN.mjs";
import "./media-store-3sV8Wgz8.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { s as FILE_TRANSFER_SUBDIR, t as DIR_FETCH_TOOL_DESCRIPTOR } from "./descriptors-kcLNZgGx.mjs";
import { i as DIR_FETCH_HARD_MAX_BYTES, r as DIR_FETCH_DEFAULT_MAX_BYTES, t as DIR_FETCH_ARCHIVE_POLICY } from "./dir-fetch-archive-wjib_rIG.mjs";
import { r as mimeFromExtension, t as IMAGE_MIME_INLINE_SET } from "./mime-moBZOjgf.mjs";
import { t as appendFileTransferAudit } from "./audit-Dh3xo0Ly.mjs";
import { i as readClampedInt, n as readRequiredNodePath, t as invokeNodeToolPayload } from "./node-tool-invoke-DlCRqCkA.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { walkDirectory } from "@openclaw/fs-safe/walk";
import crypto from "node:crypto";
import { sha256File } from "@openclaw/fs-safe/durability";
//#region extensions/file-transfer/src/tools/dir-fetch-tool.ts
const MEDIA_URL_CAP = 25;
const DIRECTORY_TEXT_MAX_BYTES = 8192;
const TAR_UNPACK_TIMEOUT_MS = 6e4;
function classifyArchiveFailure(error) {
	const reason = error instanceof Error ? error.message : String(error);
	if (error instanceof ArchiveLimitError && error.code !== ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT) return {
		auditCode: "TREE_TOO_LARGE",
		publicCode: "UNCOMPRESSED_TOO_LARGE",
		reason
	};
	return {
		auditCode: "UNSAFE_ARCHIVE",
		publicCode: "UNSAFE_ARCHIVE",
		reason
	};
}
function savedDirectoryText(rootDir, files) {
	const header = JSON.stringify({
		rootDir,
		fileCount: files.length
	}).slice(0, -1);
	const visible = [];
	const render = () => {
		const manifest = `${header},"displayedCount":${visible.length},"files":[${visible.join(",")}]}`;
		const note = `${files.length - visible.length} saved files omitted from this text (byte limit or reserved path markers). All remain under rootDir; inspect them with available local file or directory capabilities.`;
		const wrapped = wrapExternalContent(`Fetched ${files.length} files.\n${manifest}\n${note}`, { source: "unknown" });
		return wrapped.includes(manifest) && Buffer.byteLength(wrapped, "utf8") <= DIRECTORY_TEXT_MAX_BYTES ? wrapped : void 0;
	};
	let text = render();
	for (const { relPath, size } of files.toSorted((a, b) => a.relPath < b.relPath ? -1 : a.relPath > b.relPath ? 1 : 0)) {
		visible.push(JSON.stringify({
			relPath,
			size
		}));
		const candidate = render();
		if (!candidate) break;
		text = candidate;
	}
	return text ?? wrapExternalContent(`Fetched ${files.length} files. Saved paths omitted: rootDir cannot be represented safely within the 8192-byte text limit. No usable local path is shown.`, { source: "unknown" });
}
function createDirFetchTool() {
	return {
		...DIR_FETCH_TOOL_DESCRIPTOR,
		execute: async (_toolCallId, args) => {
			const params = args;
			const { node, requestedPath: dirPath } = readRequiredNodePath(params);
			const maxBytes = readClampedInt({
				input: params,
				key: "maxBytes",
				defaultValue: DIR_FETCH_DEFAULT_MAX_BYTES,
				hardMin: 1,
				hardMax: DIR_FETCH_HARD_MAX_BYTES
			});
			const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
				node,
				params,
				command: "dir.fetch",
				commandParams: {
					path: dirPath,
					maxBytes
				},
				requestedPath: dirPath
			});
			const canonicalPath = typeof payload.path === "string" ? payload.path : "";
			const tarBase64 = typeof payload.tarBase64 === "string" ? payload.tarBase64 : "";
			const tarBytes = typeof payload.tarBytes === "number" ? payload.tarBytes : -1;
			const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
			if (!canonicalPath || !tarBase64 || tarBytes < 0 || !sha256) throw new Error("invalid dir.fetch payload (missing fields)");
			const tarBuffer = Buffer.from(tarBase64, "base64");
			if (tarBuffer.byteLength !== tarBytes) throw new Error(`dir.fetch size mismatch: payload says ${tarBytes} bytes, decoded ${tarBuffer.byteLength}`);
			if (crypto.createHash("sha256").update(tarBuffer).digest("hex") !== sha256) throw new Error("dir.fetch sha256 mismatch (integrity failure)");
			const savedTar = await saveMediaBuffer(tarBuffer, "application/gzip", FILE_TRANSFER_SUBDIR, DIR_FETCH_HARD_MAX_BYTES);
			const tarDir = path.dirname(savedTar.path);
			const unpackId = `dir-fetch-${path.basename(savedTar.path, path.extname(savedTar.path))}`;
			const rootDir = path.join(tarDir, unpackId);
			await fs.mkdir(rootDir, {
				recursive: true,
				mode: 448
			});
			try {
				await extractArchive({
					archivePath: savedTar.path,
					destDir: rootDir,
					kind: "tar",
					tarGzip: true,
					timeoutMs: TAR_UNPACK_TIMEOUT_MS,
					entryModes: "clamp",
					...DIR_FETCH_ARCHIVE_POLICY
				});
			} catch (error) {
				await Promise.all([fs.rm(rootDir, {
					recursive: true,
					force: true
				}).catch(() => void 0), fs.rm(savedTar.path, { force: true }).catch(() => void 0)]);
				const failure = classifyArchiveFailure(error);
				await appendFileTransferAudit({
					op: "dir.fetch",
					nodeId,
					nodeDisplayName,
					requestedPath: dirPath,
					canonicalPath,
					decision: "error",
					errorCode: failure.auditCode,
					errorMessage: failure.reason,
					sizeBytes: tarBytes,
					sha256,
					durationMs: Date.now() - startedAt
				});
				throw new Error(`dir.fetch ${failure.publicCode}: ${failure.reason}`, { cause: error });
			}
			const walked = await walkDirectory(rootDir, {
				symlinks: "skip",
				include: ({ kind }) => kind === "file"
			});
			if (walked.failedDirs.length > 0) throw walked.failedDirs[0].error;
			const files = [];
			for (const { relativePath: relPath, path: absPath } of walked.entries) {
				let size;
				try {
					size = (await fs.stat(absPath)).size;
				} catch {
					continue;
				}
				const mimeType = mimeFromExtension(relPath);
				const fileSha256 = (await sha256File(absPath)).digest;
				files.push({
					relPath,
					size,
					mimeType,
					sha256: fileSha256,
					localPath: absPath
				});
			}
			const fileCount = files.length;
			const imageFiles = files.filter((f) => IMAGE_MIME_INLINE_SET.has(f.mimeType));
			const nonImageFiles = files.filter((f) => !IMAGE_MIME_INLINE_SET.has(f.mimeType));
			const mediaUrls = [...imageFiles, ...nonImageFiles].slice(0, MEDIA_URL_CAP).map((f) => f.localPath);
			await appendFileTransferAudit({
				op: "dir.fetch",
				nodeId,
				nodeDisplayName,
				requestedPath: dirPath,
				canonicalPath,
				decision: "allowed",
				sizeBytes: tarBytes,
				sha256,
				durationMs: Date.now() - startedAt
			});
			return {
				content: [{
					type: "text",
					text: savedDirectoryText(rootDir, files)
				}],
				details: {
					path: canonicalPath,
					rootDir,
					fileCount,
					tarBytes,
					sha256,
					files,
					media: { mediaUrls }
				}
			};
		}
	};
}
//#endregion
export { createDirFetchTool };
