import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createFileWatchNotifier } from "./file-watch-notifier-BCFTHUea.mjs";
import { t as normalizeWorkspaceSkillRoots } from "./workspace-skill-roots-CL28VeX5.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createInterface } from "node:readline";
//#region src/skills/runtime/workspace-worker-io.ts
const MAX_REQUEST_BYTES = 12582912;
function decodeSkillWorkerRequest(text) {
	const value = JSON.parse(text);
	if (!isRecord(value)) throw new Error("Skill worker request must be an object");
	return value;
}
function skillWorkerLines(input) {
	let bytes = 0;
	let parsedBytes = 0;
	let overflow;
	const count = (chunk) => {
		bytes += Buffer.byteLength(chunk);
		if (bytes > MAX_REQUEST_BYTES) {
			overflow = /* @__PURE__ */ new Error("Skill publication exceeds its byte limit");
			input.destroy();
			lines.close();
		}
	};
	input.on("data", count);
	const lines = createInterface({
		input,
		crlfDelay: Infinity
	});
	const iterator = lines[Symbol.asyncIterator]();
	return {
		async read() {
			const line = await iterator.next();
			if (overflow) throw overflow;
			if (line.done) throw new Error("Skill publication transport closed");
			parsedBytes += Buffer.byteLength(line.value) + 1;
			if (parsedBytes > MAX_REQUEST_BYTES) throw new Error("Skill publication exceeds its byte limit");
			return decodeSkillWorkerRequest(line.value);
		},
		close() {
			input.off("data", count);
			lines.close();
		}
	};
}
async function writeSkillWorkerResult(output, value) {
	await new Promise((resolve, reject) => {
		output.write(`${JSON.stringify(value)}\n`, (error) => error ? reject(error) : resolve());
	});
}
//#endregion
//#region src/skills/runtime/workspace-worker.ts
/** A dedicated subprocess reuses native Skills owners on either kind of workspace host. */
async function serveWorkspaceSkills(options) {
	const { workspace, home, operation, input, output } = options;
	const write = (value) => writeSkillWorkerResult(output, value);
	if (operation === "applyRoot") {
		const { applyExtractedSkillRoot } = await import("./archive-install-C_iSioTX.mjs");
		const lines = skillWorkerLines(input);
		try {
			const request = await lines.read();
			if (typeof request.extractedRoot !== "string" || path.dirname(request.extractedRoot) !== path.join(home, ".cache/openclaw/skill-installs")) throw new Error("Skill source is outside the upload directory");
			await write({
				type: "result",
				result: await applyExtractedSkillRoot({
					...request,
					workspaceDir: workspace,
					beforePersistentApply: request.publicationCheckpoints === true ? () => {
						if (input.destroyed || input.readableEnded) throw new Error("Skill installation transport closed");
					} : void 0,
					authorizeMutation: request.publicationCheckpoints === true ? async () => {
						await write({
							type: "prepared",
							phase: "apply"
						});
						const reply = await lines.read();
						if (reply.decision === null) return;
						if (!isRecord(reply.decision) || typeof reply.decision.error !== "string") throw new Error("Invalid Gateway publication decision");
						throw new Error(reply.decision.error);
					} : void 0,
					logger: {
						info: console.error,
						warn: console.error
					},
					beforeInstall: async (mode) => {
						await write({
							type: "prepared",
							mode
						});
						const reply = await lines.read();
						if (reply.decision === null) return;
						if (typeof reply.decision?.error !== "string" || reply.decision.failureKind !== "invalid-request" && reply.decision.failureKind !== "unavailable") throw new Error("Invalid Gateway skill policy decision");
						return {
							error: reply.decision.error,
							failureKind: reply.decision.failureKind
						};
					}
				})
			});
		} finally {
			lines.close();
		}
		return;
	}
	if (operation === "removeSkill") {
		const { applyClawHubSkillUninstall } = await import("./clawhub-uninstall-_03fKobD.mjs");
		const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-BNzUjDl8.mjs");
		const lines = skillWorkerLines(input);
		try {
			const request = await lines.read();
			if (request.plan?.targetDir !== resolveWorkspaceSkillInstallDir(workspace, request.plan?.slug)) throw new Error("Skill removal is outside the provisioned workspace");
			const checkpoint = async (phase, event) => {
				await write({
					type: "prepared",
					phase,
					event
				});
				const reply = await lines.read();
				if (reply.decision === null) return;
				if (typeof reply.decision?.error !== "string") throw new Error("Invalid Gateway removal decision");
				throw new Error(reply.decision.error);
			};
			const assertConnected = () => {
				if (input.destroyed || input.readableEnded) throw new Error("Skill removal transport closed");
			};
			await write({
				type: "result",
				result: await applyClawHubSkillUninstall({
					...request.plan,
					workspaceDir: workspace
				}, {
					beforePersistentApply: assertConnected,
					beforeRollback: assertConnected,
					authorizeMutation: (phase) => checkpoint(phase),
					...request.reportChange ? { onCommittedChange: (event) => checkpoint("committed", event) } : {}
				})
			});
		} finally {
			lines.close();
		}
		return;
	}
	if (operation === "watch") {
		const { ensureSkillsWatcher, reconcileSkillsWatcherCoverage, closeSkillsWatchers, registerSkillsChangeListener } = await import("./refresh-BwSsL7qO.mjs");
		const lines = skillWorkerLines(input);
		let stopped = false;
		let queued = false;
		let unavailable = false;
		let unsubscribe;
		let retiring;
		let outputClosing;
		let notifier;
		const retire = () => {
			stopped = true;
			unsubscribe?.();
			retiring ??= closeSkillsWatchers();
			outputClosing ??= notifier?.close();
			retiring.catch(() => {});
			outputClosing?.catch(() => {});
			lines.close();
		};
		notifier = createFileWatchNotifier(output, retire);
		const errors = [];
		try {
			const request = await lines.read();
			if (stopped) throw new Error("Skills watch transport closed before admission");
			assertWorkspace(request, workspace);
			const { executionWorkspaceDir } = normalizeWorkspaceSkillRoots({
				agentWorkspaceDir: workspace,
				executionWorkspaceDir: request.executionWorkspaceDir
			});
			const params = {
				...request,
				workspaceDir: workspace,
				executionWorkspaceDir
			};
			unsubscribe = registerSkillsChangeListener((event) => {
				if (stopped || event.workspaceDir !== workspace) return;
				if (event.reason === "watch-unavailable") unavailable = true;
				const recovered = event.reason === "watch-available";
				if (recovered) {
					if (event.sourceScope?.executionWorkspaceDir !== params.executionWorkspaceDir) return;
					if (!reconcileSkillsWatcherCoverage(params)) return;
					unavailable = false;
				}
				notifier?.send(recovered ? "available" : event.reason === "watch-unavailable" ? "unavailable" : "change");
				if (event.reason === "watch" && !queued && !unavailable) {
					queued = true;
					queueMicrotask(() => {
						queued = false;
						if (!stopped && !unavailable) ensureSkillsWatcher(params);
					});
				}
			});
			ensureSkillsWatcher(params);
			try {
				await lines.read();
				throw new Error("Unexpected message on the skill watch subscription");
			} catch (error) {
				if (!input.readableEnded && !input.destroyed) throw error;
			}
		} catch (error) {
			errors.push(error);
		} finally {
			retire();
			const results = await Promise.allSettled([retiring, outputClosing]);
			errors.push(...results.flatMap((result) => result.status === "rejected" ? [result.reason] : []));
			notifier = void 0;
		}
		if (errors.length) throw new AggregateError(errors, "Skills watch retirement failed");
		return;
	}
	const chunks = [];
	const inputChunks = input;
	for await (const raw of inputChunks) if (typeof raw === "string" || raw instanceof Uint8Array) chunks.push(Buffer.from(raw));
	else throw new Error("Skill worker input must be bytes");
	const decoded = decodeSkillWorkerRequest(Buffer.concat(chunks).toString("utf8"));
	if (operation === "installDependencies") {
		const { installSkillDependencies } = await import("./install-DQlu78y4.mjs");
		await write(await installSkillDependencies(decoded));
		return;
	}
	if (operation.startsWith("clawhub")) {
		const store = await import("./clawhub-store-D7LEbdnB.mjs");
		const status = await import("./clawhub-status-C4abKEFd.mjs");
		const uninstall = await import("./clawhub-uninstall-_03fKobD.mjs");
		const hostRequest = {
			...decoded,
			workspaceDir: workspace
		};
		try {
			let result;
			switch (operation) {
				case "clawhubPlanRemoval":
					result = await uninstall.planClawHubSkillUninstall(hostRequest);
					break;
				case "clawhubVerifyTarget":
					result = await status.resolveClawHubSkillVerificationTarget(hostRequest);
					break;
				case "clawhubPreflight":
					result = await status.preflightSkillOwnerState(hostRequest);
					break;
				case "clawhubReadLock":
					result = await store.readClawHubSkillsLockfile(workspace);
					break;
				case "clawhubUpdateSlug":
					result = await status.resolveRequestedUpdateSlug(hostRequest);
					break;
				case "clawhubUpdateTarget":
					result = await status.resolveTrackedUpdateTarget(hostRequest);
					break;
				case "clawhubUpdateGuard":
					result = await uninstall.guardTrackedSkillLocalState(hostRequest);
					break;
				case "clawhubCheckInstall":
					await store.assertClawHubSkillInstallState(hostRequest);
					break;
				case "clawhubReadFiles": {
					const request = decoded;
					assertSkillDir(request.skillDir, workspace);
					result = await store.readInstalledClawHubSkillFiles(request);
					break;
				}
				case "clawhubRecordInstall": {
					const request = hostRequest;
					const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-BNzUjDl8.mjs");
					assertSkillDir(request.skillDir, workspace);
					if (request.skillDir !== resolveWorkspaceSkillInstallDir(workspace, request.origin.slug)) throw new Error("ClawHub metadata does not match the installed skill");
					await store.recordClawHubSkillInstall(request);
					break;
				}
				default: throw new Error(`Unknown skill worker operation: ${operation}`);
			}
			await write({ result: result ?? null });
		} catch (error) {
			await write({ error: error instanceof Error ? error.message : String(error) });
		}
		return;
	}
	switch (operation) {
		case "readInstructions": {
			const { filePath } = decoded;
			if (typeof filePath !== "string") throw new Error("Skill instruction path is required");
			await write(await fs.readFile(filePath, "utf8"));
			return;
		}
		case "recordSource": {
			const request = decoded;
			const { recordSkillSourceInstall } = await import("./source-install-metadata-sSBNylh8.mjs");
			const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-BNzUjDl8.mjs");
			await recordSkillSourceInstall({
				workspaceDir: workspace,
				targetDir: resolveWorkspaceSkillInstallDir(workspace, request.origin.slug),
				origin: request.origin
			});
			await write(null);
			return;
		}
		case "resolveResource": {
			const { resolveExplicitSkillResource } = await import("./resources-DdABjK0O.mjs");
			await write(await resolveExplicitSkillResource(decoded));
			return;
		}
		case "readResources": {
			const request = decoded;
			const { readSkillResourceFiles } = await import("./resources-DdABjK0O.mjs");
			await write(await readSkillResourceFiles(request.skill, { allowMissingRoot: request.allowMissingRoot }));
			return;
		}
		case "discovery": {
			const discovery = decoded;
			assertWorkspace(discovery, workspace);
			const { readWorkspaceSkillSources } = await import("./workspace-skill-loader-Di6_DPep.mjs");
			await write(readWorkspaceSkillSources(discovery));
			return;
		}
		default: throw new Error(`Unknown skill worker operation: ${operation}`);
	}
}
function assertWorkspace(request, workspace) {
	if (request.sourcePlan.workspaceDir !== workspace) throw new Error("Skill request does not match the provisioned workspace");
}
function assertSkillDir(skillDir, workspace) {
	if (path.dirname(skillDir) !== path.join(workspace, "skills")) throw new Error("ClawHub skill is outside the provisioned workspace");
}
//#endregion
export { serveWorkspaceSkills };
