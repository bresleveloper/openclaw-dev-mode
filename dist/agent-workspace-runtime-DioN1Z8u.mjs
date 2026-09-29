import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import "./workspace-access-BNUXOhfF.mjs";
import "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import path from "node:path";
//#region src/agents/workspace-attachment-preparer.ts
/** Reuse an owned filesystem transport for admitted inputs; this does not establish a backend. */
function createWorkspaceAttachmentPreparer(params) {
	if (!path.posix.isAbsolute(params.remoteRoot) && !path.win32.isAbsolute(params.remoteRoot)) throw new Error("Attachment workspace root must be absolute");
	return async (turn, assertCurrent) => {
		const { prepareWorkspaceAttachments } = await import("./workspace-attachments-A9kCLRyy.mjs");
		assertCurrent();
		return await prepareWorkspaceAttachments({
			...params,
			turn,
			assertCurrent
		});
	};
}
//#endregion
//#region src/agents/workspace-memory-client.ts
/** Client for the packaged, same-version Memory file worker, independent of its transport. */
function createWorkspaceMemoryFileClient(options) {
	const workspaceDir = path.resolve(options.workspaceDir);
	const remoteWorkspaceDir = path.posix.resolve(options.remoteWorkspaceDir);
	const outside = (relative, paths) => relative === ".." || relative.startsWith(`..${paths.sep}`) || paths.isAbsolute(relative);
	const host = (file) => {
		const relative = path.relative(workspaceDir, file);
		return outside(relative, path) ? file : path.posix.join(remoteWorkspaceDir, ...relative.split(path.sep));
	};
	const gateway = (file) => {
		const relative = path.posix.relative(remoteWorkspaceDir, file);
		return outside(relative, path.posix) ? file : path.join(workspaceDir, ...relative.split("/"));
	};
	const extra = (paths = []) => paths.map((entry) => {
		const mapped = (file) => path.isAbsolute(file) ? host(file) : file;
		return typeof entry === "string" ? mapped(entry) : {
			...entry,
			path: mapped(entry.path)
		};
	});
	async function call(request) {
		options.signal.throwIfAborted();
		let response;
		try {
			const reply = await options.request(JSON.stringify(request), options.signal);
			options.signal.throwIfAborted();
			response = JSON.parse(reply);
		} catch (error) {
			if (request.operation === "maintenance" && request.method === "commitContent") throw Object.assign(new Error("Memory write outcome is unknown", { cause: error }), { publication: "uncertain" });
			throw error;
		}
		if (response.error) throw Object.assign(new Error(response.error.message), {
			...response.error.code ? { code: response.error.code } : {},
			...response.error.name ? { name: response.error.name } : {},
			...["uncertain", "committed"].includes(response.error.publication ?? "") ? { publication: response.error.publication } : {}
		});
		return response.result;
	}
	const maintain = (method, ...args) => call({
		operation: "maintenance",
		method,
		args
	});
	return {
		maintenance: {
			readFile: async (file) => Buffer.from(await maintain("readFile", host(file)), "base64"),
			stat: (file, follow) => maintain("stat", host(file), follow),
			listDirectory: (directory) => maintain("listDirectory", host(directory)),
			mkdir: (directory) => maintain("mkdir", host(directory)),
			rename: (from, to) => maintain("rename", host(from), host(to)),
			resolveWritePath: async (file) => gateway(await maintain("resolveWritePath", host(file))),
			commitContent: (params) => maintain("commitContent", {
				...params,
				filePath: host(params.filePath)
			}),
			resolveDreamsPath: async () => gateway(await maintain("resolveDreamsPath")),
			readDreams: (file) => maintain("readDreams", host(file)),
			writeDreams: (file, content) => maintain("writeDreams", host(file), content),
			replaceReport: (file, content) => maintain("replaceReport", host(file), content),
			appendCorpus: (file, content) => maintain("appendCorpus", host(file), content)
		},
		assertCurrent: () => options.signal.throwIfAborted(),
		async listFiles(_workspace, extraPaths, multimodal, skipped) {
			const result = await call({
				operation: "list",
				extraPaths: extra(extraPaths),
				multimodal
			});
			for (const file of result.skipped) skipped?.(gateway(file));
			return result.files.map(gateway);
		},
		async inspectFile(file, _workspace, multimodal) {
			const result = await call({
				operation: "inspect",
				filePath: host(file),
				multimodal
			});
			return result ? {
				...result,
				absPath: gateway(result.absPath)
			} : null;
		},
		readFile({ workspaceDir: _workspace, extraPaths, relPath, ...params }) {
			return call({
				operation: "read",
				params: {
					...params,
					extraPaths: extra(extraPaths),
					relPath: path.isAbsolute(relPath) ? host(relPath) : relPath
				}
			});
		},
		readForIndexing: (file) => call({
			operation: "readForIndexing",
			filePath: host(file)
		}),
		buildMultimodalChunk: (entry) => call({
			operation: "multimodal",
			entry: {
				...entry,
				absPath: host(entry.absPath)
			}
		}),
		async watch(request, onChange, signal) {
			const active = AbortSignal.any([options.signal, signal]);
			active.throwIfAborted();
			const mapped = {
				agentId: request.agentId,
				settings: {
					extraPaths: extra(request.settings.extraPaths),
					multimodal: request.settings.multimodal,
					sync: { watchDebounceMs: request.settings.sync.watchDebounceMs }
				}
			};
			await options.subscribe(`${JSON.stringify(mapped)}\n`, (line) => {
				active.throwIfAborted();
				const event = JSON.parse(line);
				if (event !== "change" && event !== "unavailable") throw new Error("Invalid Memory change notification");
				onChange(event);
			}, active);
			if (!active.aborted) onChange("unavailable");
		}
	};
}
//#endregion
//#region src/agents/workspace-worker.ts
/** Resolve the installed or source worker without adapters depending on core file layout. */
function resolveWorkspaceWorkerArgv(kind) {
	const entry = kind === "memory" ? runtimeProcessEntrypoints.workspaceMemory : runtimeProcessEntrypoints.workspaceSkills;
	return resolveRuntimeWorkerArgv(resolveRuntimeWorkerUrl(entry));
}
/** Reuse the native bounded Skill reader with host-owned per-file authorization. */
async function readWorkspaceSkillResources(...args) {
	const { readSkillResourceFiles } = await import("./resources-7L_ipL61.mjs");
	return readSkillResourceFiles(...args);
}
//#endregion
export { createWorkspaceAttachmentPreparer as i, resolveWorkspaceWorkerArgv as n, createWorkspaceMemoryFileClient as r, readWorkspaceSkillResources as t };
