import path from "node:path";
import fs from "node:fs/promises";
import { createInterface } from "node:readline";
//#region src/skills/runtime/workspace-worker-io.ts
const MAX_REQUEST_BYTES = 12582912;
function decodeSkillWorkerRequest(text) {
	const value = JSON.parse(text);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Skill worker request must be an object");
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
		const { applyExtractedSkillRoot } = await import("./archive-install-BBXUzC-w.mjs");
		const lines = skillWorkerLines(input);
		try {
			const request = await lines.read();
			if (typeof request.extractedRoot !== "string" || path.dirname(request.extractedRoot) !== path.join(home, ".cache/openclaw/skill-installs")) throw new Error("Skill source is outside the upload directory");
			await write({
				type: "result",
				result: await applyExtractedSkillRoot({
					...request,
					workspaceDir: workspace,
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
		const { applyClawHubSkillUninstall } = await import("./clawhub-uninstall-DAc_vD-b.mjs");
		const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-DNM9KlEZ.mjs");
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
		const { ensureSkillsWatcher, closeSkillsWatchers, registerSkillsChangeListener } = await import("./refresh-E4dYncpU.mjs");
		const lines = skillWorkerLines(input);
		let stopped = false;
		let queued = false;
		let unavailable = false;
		let unsubscribe;
		try {
			const request = await lines.read();
			assertWorkspace(request, workspace);
			const params = {
				...request,
				workspaceDir: workspace
			};
			unsubscribe = registerSkillsChangeListener((event) => {
				if (stopped || event.workspaceDir !== workspace) return;
				if (event.reason === "watch-unavailable") unavailable = true;
				output.write(`${JSON.stringify(event.reason === "watch-unavailable" ? "unavailable" : "change")}\n`);
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
		} finally {
			stopped = true;
			unsubscribe?.();
			lines.close();
			await closeSkillsWatchers();
		}
		return;
	}
	const chunks = [];
	const inputChunks = input;
	for await (const raw of inputChunks) if (typeof raw === "string") chunks.push(Buffer.from(raw));
	else if (raw instanceof Uint8Array) chunks.push(Buffer.from(raw));
	else throw new Error("Skill worker input must be bytes");
	const decoded = decodeSkillWorkerRequest(Buffer.concat(chunks).toString("utf8"));
	if (operation === "installDependencies") {
		const { installSkillDependencies } = await import("./install-BD93oNJw.mjs");
		await write(await installSkillDependencies(decoded));
		return;
	}
	if (operation.startsWith("clawhub")) {
		const store = await import("./clawhub-store-COS9YWw3.mjs");
		const status = await import("./clawhub-status-z0RYfiEt.mjs");
		const uninstall = await import("./clawhub-uninstall-DAc_vD-b.mjs");
		try {
			let result;
			switch (operation) {
				case "clawhubPlanRemoval":
					result = await uninstall.planClawHubSkillUninstall({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubVerifyTarget":
					result = await status.resolveClawHubSkillVerificationTarget({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubPreflight":
					result = await status.preflightSkillOwnerState({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubReadLock":
					result = await store.readClawHubSkillsLockfile(workspace);
					break;
				case "clawhubUpdateSlug":
					result = await status.resolveRequestedUpdateSlug({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubUpdateTarget":
					result = await status.resolveTrackedUpdateTarget({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubUpdateGuard":
					result = await uninstall.guardTrackedSkillLocalState({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubCheckInstall":
					await store.assertClawHubSkillInstallState({
						...decoded,
						workspaceDir: workspace
					});
					break;
				case "clawhubReadFiles": {
					const request = decoded;
					assertSkillDir(request.skillDir, workspace);
					result = await store.readInstalledClawHubSkillFiles(request);
					break;
				}
				case "clawhubRecordInstall": {
					const request = decoded;
					const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-DNM9KlEZ.mjs");
					assertSkillDir(request.skillDir, workspace);
					if (request.skillDir !== resolveWorkspaceSkillInstallDir(workspace, request.origin.slug)) throw new Error("ClawHub metadata does not match the installed skill");
					await store.recordClawHubSkillInstall({
						...request,
						workspaceDir: workspace
					});
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
			const { recordSkillSourceInstall } = await import("./source-install-metadata-ZxylILUA.mjs");
			const { resolveWorkspaceSkillInstallDir } = await import("./install-paths-DNM9KlEZ.mjs");
			await recordSkillSourceInstall({
				workspaceDir: workspace,
				targetDir: resolveWorkspaceSkillInstallDir(workspace, request.origin.slug),
				origin: request.origin
			});
			await write(null);
			return;
		}
		case "resolveResource": {
			const { resolveExplicitSkillResource } = await import("./resources-7L_ipL61.mjs");
			await write(await resolveExplicitSkillResource(decoded));
			return;
		}
		case "readResources": {
			const request = decoded;
			const { readSkillResourceFiles } = await import("./resources-7L_ipL61.mjs");
			await write(await readSkillResourceFiles(request.skill, { allowMissingRoot: request.allowMissingRoot }));
			return;
		}
		case "discovery": {
			const discovery = decoded;
			assertWorkspace(discovery, workspace);
			const { readWorkspaceSkillSources } = await import("./workspace-skill-loader-BvWrrUJT.mjs");
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
