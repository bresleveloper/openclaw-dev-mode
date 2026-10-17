import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as canonicalPathFromExistingAncestor, p as readFileWithinRoot } from "./fs-safe-BUXBSN-4.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { l as extractArchive } from "./archive-DqZZMnnW.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { c as removePathWithinRoot } from "./file-access-runtime-BMp89X4Y.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { n as resolveWorkspaceWorkerArgv, t as readWorkspaceSkillResources } from "./agent-workspace-runtime-B_2-8Yo6.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import "./archive-DEZkiUYO.mjs";
import { a as createDeferred } from "./extension-shared-GoQu59iC.mjs";
import { i as evaluateFileReadPolicySnapshot } from "./policy-C1bimlqk.mjs";
import { t as DIR_FETCH_ARCHIVE_POLICY } from "./dir-fetch-archive-BFog-jM-.mjs";
import { n as skillSourceArchive, r as readWorkspaceMemoryRequest, t as readWorkspaceSkillsRequest } from "./workspace-skills-request-CaBNQwO1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { spawn } from "node:child_process";
//#region extensions/file-transfer/src/node-host/workspace-skill-source.ts
async function retireSkillSource(workspace, source) {
	const archive = skillSourceArchive(workspace, source);
	await removePathWithinRoot({
		rootDir: workspace,
		relativePath: path.relative(workspace, archive),
		force: true
	});
}
/** Extract a private, bounded copy; the native worker never opens a caller-selected source. */
async function prepareSkillSource(workspace, source) {
	const archive = skillSourceArchive(workspace, source);
	const uploadRoot = path.join(os.homedir(), ".cache/openclaw/skill-installs");
	await fs.mkdir(uploadRoot, {
		recursive: true,
		mode: 448
	});
	const extractedRoot = await fs.mkdtemp(path.join(uploadRoot, "node-"));
	const privateArchive = `${extractedRoot}.tgz`;
	try {
		const { buffer } = await readFileWithinRoot({
			rootDir: workspace,
			relativePath: path.relative(workspace, archive),
			maxBytes: DIR_FETCH_ARCHIVE_POLICY.limits.maxArchiveBytes
		});
		await fs.writeFile(privateArchive, buffer, { mode: 384 });
		await extractArchive({
			archivePath: privateArchive,
			destDir: extractedRoot,
			kind: "tar",
			tarGzip: true,
			timeoutMs: 6e4,
			durable: false,
			...DIR_FETCH_ARCHIVE_POLICY
		});
		return {
			extractedRoot,
			cleanup: () => fs.rm(extractedRoot, {
				recursive: true,
				force: true
			})
		};
	} catch (error) {
		await fs.rm(extractedRoot, {
			recursive: true,
			force: true
		});
		throw error;
	} finally {
		await fs.rm(privateArchive, { force: true });
	}
}
//#endregion
//#region extensions/file-transfer/src/node-host/workspace-memory.ts
/** Run the same packaged file worker used by SSH adapters; never run arbitrary argv. */
function createWorkspaceCommand(api, kind) {
	return {
		command: `workspace.${kind}`,
		cap: "file",
		dangerous: true,
		duplex: true,
		async handle(paramsJSON, io) {
			if (!io?.frames) throw new Error("Workspace workers require node duplex transport");
			const params = JSON.parse(paramsJSON ?? "{}");
			const skillRequest = kind === "skills" ? readWorkspaceSkillsRequest(params) : void 0;
			const request = skillRequest ?? readWorkspaceMemoryRequest(params);
			const maxReplyBytes = params.maxReplyBytes;
			if (maxReplyBytes !== void 0 && (!Number.isSafeInteger(maxReplyBytes) || maxReplyBytes < 0)) throw new Error("Invalid workspace response byte limit");
			if (!listAgentIds(api.config).some((agentId) => path.resolve(api.runtime.agent.resolveAgentWorkspaceDir(api.config, agentId)) === request.workspaceDir)) throw new Error("Workspace does not belong to this node");
			for (const access of request.paths) if (await canonicalPathFromExistingAncestor(access.path) !== access.path) throw new Error("Node workspace paths must use their canonical location");
			io.signal.throwIfAborted();
			const interactive = kind === "skills" && ["applyRoot", "removeSkill"].includes(params.operation);
			let childInput;
			let hasStarted = false;
			let source;
			const started = createDeferred();
			const unsubscribe = io.frames.onMessage((message) => {
				if (io.signal.aborted) return;
				if (!hasStarted && Buffer.from(message).toString("utf8") === "start") {
					hasStarted = true;
					started.resolve();
					return;
				}
				if (!interactive || !childInput || message.byteLength > 1048576) throw new Error("Unexpected workspace worker input");
				const decision = asOptionalRecord(JSON.parse(Buffer.from(message).toString("utf8")));
				if (!decision || !("decision" in decision)) throw new Error("Expected a Gateway Skill policy decision");
				childInput.write(`${JSON.stringify(decision)}\n`);
			});
			const abortStart = () => started.resolve();
			io.signal.addEventListener("abort", abortStart, { once: true });
			try {
				await started.promise;
				io.signal.throwIfAborted();
				let workerRequest = request.request;
				if (kind === "skills" && params.operation === "applyRoot") {
					const input = JSON.parse(request.request);
					source = await prepareSkillSource(request.workspaceDir, input.sourceArchive);
					const { sourceArchive: _archive, ...files } = input;
					workerRequest = JSON.stringify({
						...files,
						extractedRoot: source.extractedRoot,
						publicationCheckpoints: true
					});
				}
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
				const child = spawn(process.execPath, [...resolveWorkspaceWorkerArgv(kind), ...skillRequest ? [
					request.workspaceDir,
					os.homedir(),
					skillRequest.operation
				] : [request.watch ? "--watch-files" : "--files", request.workspaceDir]], {
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
				const allowRollback = kind === "skills" && params.operation === "applyRoot";
				let stopTimer;
				const stop = () => {
					if (child.exitCode !== null || child.signalCode !== null) return;
					if (allowRollback) {
						child.stdin.end();
						stopTimer ??= setTimeout(() => child.kill("SIGKILL"), 3e4);
						stopTimer.unref();
					} else child.kill("SIGTERM");
				};
				child.stdin.on("error", stop);
				io.signal.addEventListener("abort", stop, { once: true });
				try {
					io.signal.throwIfAborted();
					childInput = child.stdin;
					if (request.watch || interactive) child.stdin.write(`${workerRequest.trimEnd()}\n`);
					else child.stdin.end(workerRequest);
					const discoveryChunks = kind === "skills" && params.operation === "discovery" ? [] : void 0;
					const replyLimit = discoveryChunks ? maxReplyBytes ?? 104857600 : maxReplyBytes;
					let bytesSent = 0;
					for await (const bytes of child.stdout.iterator({ destroyOnReturn: false })) {
						if (allowRollback && io.signal.aborted) continue;
						io.signal.throwIfAborted();
						bytesSent += bytes.byteLength;
						if (!request.watch && replyLimit !== void 0 && bytesSent > replyLimit) throw new Error("Workspace response exceeds the node file policy byte limit");
						if (discoveryChunks) discoveryChunks.push(bytes);
						else await io.frames.send(bytes);
					}
					await exited;
					io.signal.throwIfAborted();
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
					childInput = void 0;
					stop();
					child.stdout.resume();
					await exited.catch(() => {});
					clearTimeout(stopTimer);
					child.stdin.destroy();
				}
			} finally {
				io.signal.removeEventListener("abort", abortStart);
				unsubscribe();
				try {
					await source?.cleanup();
				} finally {
					if (kind === "skills" && params.operation === "applyRoot") await retireSkillSource(request.workspaceDir, JSON.parse(request.request).sourceArchive);
				}
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
export { createWorkspaceCommand };
