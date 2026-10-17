import { w as root } from "../../fs-safe-BUXBSN-4.mjs";
import "../../memory-core-host-engine-storage-D1iAJzGI.mjs";
import { c as buildMultimodalChunkForIndexing, n as readMemoryFile, s as buildFileEntry, u as listMemoryFiles } from "../../read-file-D9pCx2gk.mjs";
import "../../file-access-runtime-BMp89X4Y.mjs";
import { t as createFileWatchNotifier } from "../../file-watch-notifier-BCFTHUea.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { createInterface } from "node:readline";
//#region extensions/memory-core/src/remote/memory-files-worker.ts
/** Same-version file IPC; the provisioned adapter owns admission and configured roots. */
async function serveMemoryFiles(options) {
	if (options.watch) {
		const runInBackgroundContext = AsyncLocalStorage.snapshot();
		const { MemoryFileWatcher } = await import("../../file-watcher-DEV3l3OW.mjs");
		const lines = createInterface({
			input: options.input,
			crlfDelay: Infinity
		});
		let watcher;
		let closing;
		let outputClosing;
		let notifier;
		let stopped = false;
		const close = () => {
			stopped = true;
			closing ??= watcher?.close();
			outputClosing ??= notifier?.close();
			outputClosing?.catch(() => void 0);
			closing?.catch(() => void 0);
		};
		notifier = createFileWatchNotifier(options.output, () => {
			close();
			lines.close();
		});
		options.input.on("end", close).on("close", close);
		const errors = [];
		try {
			for await (const line of lines) {
				if (stopped) break;
				if (watcher) throw new Error("Unexpected message on the Memory watch subscription");
				const request = JSON.parse(line);
				const notify = (event) => notifier?.send(event);
				watcher = new MemoryFileWatcher({
					runInBackgroundContext,
					workspaceDir: path.resolve(options.workspace),
					agentId: request.agentId,
					settings: request.settings,
					onChange: () => notify("change"),
					onUnavailable: () => notify("unavailable")
				});
				if (options.input.readableEnded || options.input.destroyed) {
					close();
					break;
				}
				await watcher.start();
			}
		} catch (error) {
			errors.push(error);
		} finally {
			options.input.off("end", close).off("close", close);
			lines.close();
			close();
			const results = await Promise.allSettled([closing, outputClosing]);
			errors.push(...results.flatMap((result) => result.status === "rejected" ? [result.reason] : []));
			notifier = void 0;
		}
		if (errors.length) throw new AggregateError(errors, "Memory watch retirement failed");
		return;
	}
	const chunks = [];
	const inputChunks = options.input;
	for await (const chunk of inputChunks) {
		if (typeof chunk !== "string" && !(chunk instanceof Uint8Array)) throw new Error("Memory file request must be bytes");
		chunks.push(Buffer.from(chunk));
	}
	const decoded = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) throw new Error("Memory file request must be an object");
	const request = decoded;
	const workspace = path.resolve(options.workspace);
	let result;
	let failure;
	try {
		switch (request.operation) {
			case "maintenance":
				result = await runMaintenance(request, workspace);
				break;
			case "list": {
				const skipped = [];
				result = {
					files: await listMemoryFiles(workspace, request.extraPaths, request.multimodal, (p) => skipped.push(p)),
					skipped
				};
				break;
			}
			case "inspect":
				result = await buildFileEntry(request.filePath, workspace, request.multimodal);
				break;
			case "read":
				result = await readMemoryFile({
					...request.params,
					workspaceDir: workspace
				});
				break;
			case "readForIndexing": {
				const read = await (await root(path.dirname(request.filePath), {
					hardlinks: "allow",
					symlinks: "reject",
					maxBytes: Number.MAX_SAFE_INTEGER
				})).read(path.basename(request.filePath));
				result = {
					content: read.buffer.toString("utf8"),
					canonicalRelativePath: path.relative(await fs.realpath(workspace), read.realPath).replaceAll(path.sep, "/")
				};
				break;
			}
			case "multimodal":
				result = await buildMultimodalChunkForIndexing(request.entry);
				break;
			default: throw new Error("Unknown Memory file operation");
		}
	} catch (error) {
		failure = {
			message: error instanceof Error ? error.message : String(error),
			...error instanceof Error ? { name: error.name } : {},
			...error && typeof error === "object" && "publication" in error && (error.publication === "uncertain" || error.publication === "committed") ? { publication: error.publication } : {},
			...error && typeof error === "object" && "code" in error && typeof error.code === "string" ? { code: error.code } : {}
		};
	}
	await new Promise((resolve, reject) => {
		options.output.write(JSON.stringify(failure ? { error: failure } : { result }), (error) => error ? reject(error) : resolve());
	});
}
async function runMaintenance(request, workspace) {
	switch (request.method) {
		case "readFile": return (await fs.readFile(...request.args)).toString("base64");
		case "stat": {
			const [filePath, followSymlinks] = request.args;
			const info = followSymlinks ? await fs.stat(filePath) : await fs.lstat(filePath);
			return {
				isFile: info.isFile(),
				isDirectory: info.isDirectory(),
				isSymbolicLink: info.isSymbolicLink(),
				size: info.size,
				mtimeMs: info.mtimeMs,
				mode: info.mode
			};
		}
		case "listDirectory": return (await fs.readdir(request.args[0], { withFileTypes: true })).map((entry) => ({
			name: entry.name,
			isFile: entry.isFile(),
			isDirectory: entry.isDirectory(),
			isSymbolicLink: entry.isSymbolicLink()
		}));
		case "mkdir":
			await fs.mkdir(request.args[0], { recursive: true });
			return null;
		case "rename": return await fs.rename(...request.args);
		case "resolveWritePath": {
			const { resolveMemoryWritePath } = await import("../../short-term-promotion-memory-write-DQDpsYFT.mjs");
			return await resolveMemoryWritePath(...request.args);
		}
		case "commitContent": {
			const { commitMemoryContent } = await import("../../short-term-promotion-memory-write-DQDpsYFT.mjs");
			return await commitMemoryContent(...request.args);
		}
		case "resolveDreamsPath": {
			const { resolveDreamsPath } = await import("../../dreaming-dreams-file-B0ccS1PG.mjs");
			return await resolveDreamsPath(workspace);
		}
		case "readDreams": {
			const { readDreamsFile } = await import("../../dreaming-dreams-file-B0ccS1PG.mjs");
			return await readDreamsFile(...request.args);
		}
		case "writeDreams": {
			const { writeDreamsFileAtomic } = await import("../../dreaming-dreams-file-B0ccS1PG.mjs");
			return await writeDreamsFileAtomic(...request.args);
		}
		case "replaceReport": {
			const { replaceDreamingMarkdownFile } = await import("../../dreaming-markdown-CIXoBuop.mjs");
			return await replaceDreamingMarkdownFile(...request.args);
		}
		case "appendCorpus": {
			const { appendSessionCorpusText } = await import("../../session-ingestion-CFS6j6Pw.mjs");
			return await appendSessionCorpusText(...request.args);
		}
		default: throw new Error("Unknown Memory maintenance operation");
	}
}
//#endregion
export { serveMemoryFiles };
