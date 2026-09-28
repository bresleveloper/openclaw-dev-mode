import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as canonicalPathFromExistingAncestor } from "./fs-safe-BAPek8At.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { n as resolveWorkspaceWorkerArgv, t as readWorkspaceSkillResources } from "./agent-workspace-runtime-8l4U0NcT.mjs";
import { i as evaluateFileReadPolicySnapshot } from "./policy-C9idLd3f.mjs";
import { n as readWorkspaceMemoryRequest, t as readWorkspaceSkillsRequest } from "./workspace-skills-request-BDGuSXEQ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
//#region extensions/file-transfer/src/node-host/workspace-memory.ts
/** Run the same packaged file worker used by SSH adapters; never run arbitrary argv. */
function createWorkspaceMemoryCommand(api) {
	return createWorkspaceCommand(api, "memory");
}
function createWorkspaceSkillsCommand(api) {
	return createWorkspaceCommand(api, "skills");
}
function createWorkspaceCommand(api, kind) {
	return {
		command: `workspace.${kind}`,
		cap: "file",
		dangerous: true,
		duplex: true,
		async handle(paramsJSON, io) {
			if (!io?.frames) throw new Error("Workspace workers require node duplex transport");
			const params = JSON.parse(paramsJSON ?? "{}");
			const request = kind === "memory" ? readWorkspaceMemoryRequest(params) : readWorkspaceSkillsRequest(params);
			const maxReplyBytes = params.maxReplyBytes;
			if (maxReplyBytes !== void 0 && (!Number.isSafeInteger(maxReplyBytes) || maxReplyBytes < 0)) throw new Error("Invalid workspace response byte limit");
			if (!(api.config.agents?.list?.map((agent) => agent.id) ?? ["main"]).some((agentId) => path.resolve(api.runtime.agent.resolveAgentWorkspaceDir(api.config, agentId)) === request.workspaceDir)) throw new Error("Workspace does not belong to this node");
			for (const access of request.paths) if (await canonicalPathFromExistingAncestor(access.path) !== access.path) throw new Error("Node workspace paths must use their canonical location");
			io.signal.throwIfAborted();
			let start;
			const started = new Promise((resolve) => {
				start = resolve;
			});
			const unsubscribe = io.frames.onMessage((message) => {
				if (Buffer.from(message).toString("utf8") !== "start") throw new Error("Unexpected workspace worker input");
				start();
			});
			const abortStart = () => start();
			io.signal.addEventListener("abort", abortStart, { once: true });
			try {
				await started;
				io.signal.throwIfAborted();
				if (kind === "skills" && params.operation === "readResources") {
					const assertFileAccess = createSkillFileAccessAssertion(params.resourceReadPolicy, io.signal);
					const input = JSON.parse(request.request);
					const files = await readWorkspaceSkillResources(input.skill, {
						allowMissingRoot: input.allowMissingRoot,
						assertFileAccess
					});
					const bytes = Buffer.from(`${JSON.stringify(files)}\n`);
					if (maxReplyBytes !== void 0 && bytes.byteLength > maxReplyBytes) throw new Error("Workspace response exceeds the node file policy byte limit");
					io.signal.throwIfAborted();
					await io.frames.send(bytes);
					return JSON.stringify({ ok: true });
				}
				const child = spawn(process.execPath, [...resolveWorkspaceWorkerArgv(kind), ...kind === "memory" ? [request.watch ? "--watch-files" : "--files", request.workspaceDir] : [
					request.workspaceDir,
					os.homedir(),
					readWorkspaceSkillsRequest(params).operation
				]], {
					cwd: request.workspaceDir,
					env: {
						HOME: os.homedir(),
						PATH: process.env.PATH
					},
					stdio: [
						"pipe",
						"pipe",
						"pipe"
					]
				});
				const exited = new Promise((resolve, reject) => {
					child.once("error", reject);
					child.once("close", (code) => code === 0 ? resolve() : reject(/* @__PURE__ */ new Error(`Workspace worker exited with ${code}`)));
				});
				exited.catch(() => {});
				child.stderr.on("data", (bytes) => api.logger.warn(bytes.toString("utf8").trimEnd()));
				child.stdin.on("error", () => child.kill("SIGTERM"));
				const stop = () => {
					child.kill("SIGTERM");
				};
				io.signal.addEventListener("abort", stop, { once: true });
				try {
					io.signal.throwIfAborted();
					if (request.watch) child.stdin.write(`${request.request.trimEnd()}\n`);
					else child.stdin.end(request.request);
					const discoveryChunks = kind === "skills" && params.operation === "discovery" ? [] : void 0;
					const replyLimit = discoveryChunks ? maxReplyBytes ?? 104857600 : maxReplyBytes;
					let bytesSent = 0;
					for await (const bytes of child.stdout) {
						io.signal.throwIfAborted();
						bytesSent += bytes.byteLength;
						if (!request.watch && replyLimit !== void 0 && bytesSent > replyLimit) throw new Error("Workspace response exceeds the node file policy byte limit");
						if (discoveryChunks) discoveryChunks.push(bytes);
						else await io.frames.send(bytes);
					}
					await exited;
					if (discoveryChunks) {
						const bytes = Buffer.concat(discoveryChunks, bytesSent);
						const sources = asOptionalRecord(JSON.parse(bytes.toString("utf8")));
						const assertFileAccess = createSkillFileAccessAssertion(params.resourceReadPolicy, io.signal);
						for (const key of ["entries", "executionEntries"]) {
							const entries = sources?.[key];
							if (!Array.isArray(entries)) throw new Error("Invalid Skill discovery result");
							for (const entry of entries) {
								const filePath = asOptionalRecord(asOptionalRecord(entry)?.skill)?.filePath;
								if (typeof filePath !== "string" || !path.isAbsolute(filePath)) throw new Error("Invalid Skill discovery file path");
								assertFileAccess(filePath, await fs.realpath(filePath));
							}
						}
						const statusFiles = asOptionalRecord(sources?.status)?.files;
						if (Array.isArray(statusFiles)) for (const file of statusFiles) {
							const card = asOptionalRecord(asOptionalRecord(file)?.skillCard);
							if (typeof card?.content !== "string") continue;
							const cardPath = card.path;
							if (typeof cardPath !== "string" || !path.isAbsolute(cardPath)) throw new Error("Invalid Skill card file path");
							assertFileAccess(cardPath, await fs.realpath(cardPath));
						}
						io.signal.throwIfAborted();
						await io.frames.send(bytes);
					}
					return JSON.stringify({ ok: true });
				} finally {
					io.signal.removeEventListener("abort", stop);
					child.stdin.destroy();
					child.kill("SIGTERM");
					await exited.catch(() => {});
				}
			} finally {
				io.signal.removeEventListener("abort", abortStart);
				unsubscribe();
			}
		}
	};
}
function createSkillFileAccessAssertion(input, signal) {
	const policy = asOptionalRecord(input);
	const pluginConfig = asOptionalRecord(policy?.pluginConfig);
	if (typeof policy?.nodeId !== "string" || !pluginConfig) throw new Error("Skill access requires a Gateway file read policy");
	const nodeId = policy.nodeId;
	return (requestedPath, canonicalPath) => {
		signal.throwIfAborted();
		for (const filePath of /* @__PURE__ */ new Set([requestedPath, canonicalPath])) {
			const decision = evaluateFileReadPolicySnapshot({
				nodeId,
				pluginConfig,
				path: filePath
			});
			if (!decision.ok || decision.reason === "ask-always" || !decision.followSymlinks && requestedPath !== canonicalPath) throw new Error("Skill resource is denied by the node file read policy");
		}
	};
}
//#endregion
export { createWorkspaceMemoryCommand, createWorkspaceSkillsCommand };
