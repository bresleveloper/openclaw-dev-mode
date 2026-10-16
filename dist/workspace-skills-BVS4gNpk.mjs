import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as handleDirFetch } from "./dir-fetch-C9Ppexf1.mjs";
import { t as createWorkspaceFile } from "./workspace-file-create-yZtZ0hr1.mjs";
import { t as runNodeWorkspaceWorker } from "./workspace-worker-EmGbnNaj.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region extensions/file-transfer/src/workspace-skill-lifecycle.ts
/** Translate native lifecycle calls; policy callbacks and change hooks stay on Gateway. */
function createNodeSkillLifecycle(options) {
	function workspace(value) {
		if (path.resolve(value) !== options.workspaceDir) throw new Error("Skill request does not match the configured workspace");
		return options.remoteRoot;
	}
	async function call(operation, request) {
		const text = await runNodeWorkspaceWorker(options, "workspace.skills", {
			operation,
			request: JSON.stringify(request),
			watch: false
		}, options.signal);
		const value = JSON.parse(text);
		if (!operation.startsWith("clawhub")) return value;
		const envelope = asOptionalRecord(value);
		if (typeof envelope?.error === "string") throw new Error(envelope.error);
		if (!envelope || !("result" in envelope)) throw new Error("Invalid Skill tracking response");
		return envelope.result;
	}
	async function interactive(operation, request, decide, beforeStart) {
		let completed;
		await runNodeWorkspaceWorker(options, "workspace.skills", {
			operation,
			request: JSON.stringify(request),
			watch: false
		}, options.signal, async (line, reply) => {
			const event = asOptionalRecord(JSON.parse(line));
			if (event?.type === "prepared") {
				let decision;
				try {
					decision = await decide(event);
					options.signal.throwIfAborted();
				} catch (error) {
					decision = {
						error: String(error),
						failureKind: "unavailable"
					};
				}
				if (!reply) throw new Error("Skill lifecycle requires duplex replies");
				await reply({ decision: decision ?? null });
			} else if (event?.type === "result" && !completed) completed = { result: event.result };
			else throw new Error("Invalid Skill lifecycle response");
		}, beforeStart);
		if (!completed) throw new Error("Skill lifecycle ended without a result");
		return completed.result;
	}
	const tracking = (operation, params) => call(operation, {
		...params,
		workspaceDir: workspace(params.workspaceDir)
	});
	return {
		async applySkillRoot(params) {
			workspace(params.workspaceDir);
			params.beforePersistentApply?.();
			const archive = await handleDirFetch({
				path: params.extractedRoot,
				followSymlinks: false
			});
			if (!archive.ok) throw new Error(archive.message);
			const sourceArchive = path.posix.join(options.remoteRoot, ".openclaw/skill-installs", `${randomUUID()}.tgz`);
			const assertCurrent = () => {
				options.signal.throwIfAborted();
				params.beforePersistentApply?.();
			};
			const { beforeInstall, beforePersistentApply: _guard, logger: _logger, extractedRoot: _source, ...files } = params;
			return await interactive("applyRoot", {
				...files,
				workspaceDir: options.remoteRoot,
				sourceArchive
			}, async (event) => {
				if (event.phase === "apply") {
					assertCurrent();
					return null;
				}
				if (event.mode !== "install" && event.mode !== "update") throw new Error("Invalid Skill installation mode");
				assertCurrent();
				const decision = await beforeInstall?.(event.mode);
				assertCurrent();
				return decision;
			}, async () => {
				const uploaded = await createWorkspaceFile({
					...options,
					path: sourceArchive,
					data: Buffer.from(archive.tarBase64, "base64"),
					mkdir: true,
					assertCurrent
				});
				const payload = asOptionalRecord(asOptionalRecord(uploaded.result)?.payload);
				if (payload?.ok !== true || payload.sha256 !== archive.sha256) throw new Error("Skill upload receipt does not match the source archive");
				assertCurrent();
			});
		},
		recordSkillSourceInstall: (params) => tracking("recordSource", params),
		clawHubSkills: {
			resolveClawHubSkillVerificationTarget: (params) => tracking("clawhubVerifyTarget", params),
			preflightSkillOwnerState: (params) => tracking("clawhubPreflight", params),
			resolveRequestedUpdateSlug: (params) => tracking("clawhubUpdateSlug", params),
			resolveTrackedUpdateTarget: (params) => tracking("clawhubUpdateTarget", params),
			readClawHubSkillsLockfile: (workspaceDir) => tracking("clawhubReadLock", { workspaceDir }),
			recordClawHubSkillInstall: (params) => tracking("clawhubRecordInstall", params),
			assertClawHubSkillInstallState: (params) => tracking("clawhubCheckInstall", params),
			readInstalledClawHubSkillFiles: (params) => call("clawhubReadFiles", params),
			planClawHubSkillUninstall: (params) => tracking("clawhubPlanRemoval", params),
			guardTrackedSkillLocalState: (params) => tracking("clawhubUpdateGuard", params),
			applyClawHubSkillUninstall: (plan, callbacks) => interactive("removeSkill", {
				plan,
				reportChange: Boolean(callbacks.onCommittedChange)
			}, async (event) => {
				if (event.phase === "committed") {
					const committed = event.event;
					await callbacks.onCommittedChange?.({
						...committed,
						workspaceDir: options.workspaceDir
					});
				} else if (event.phase === "rollback") callbacks.beforeRollback?.();
				else if (event.phase === "apply") callbacks.beforePersistentApply?.();
				else throw new Error("Invalid Skill removal checkpoint");
				return null;
			})
		}
	};
}
//#endregion
//#region extensions/file-transfer/src/workspace-skills.ts
/** Native Skills retain discovery and installation; this adapter supplies node IO. */
function createNodeWorkspaceSkills(options) {
	const mapPath = (value) => {
		const relative = path.relative(options.workspaceDir, value);
		return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative) ? path.posix.join(options.remoteRoot, ...relative.split(path.sep)) : value;
	};
	const mapSources = (request) => {
		if (path.resolve(request.sourcePlan.workspaceDir) !== options.workspaceDir) throw new Error("Skill request does not match the configured workspace");
		const plan = request.sourcePlan;
		return {
			...request,
			executionWorkspaceDir: request.executionWorkspaceDir && mapPath(request.executionWorkspaceDir),
			sourcePlan: {
				...plan,
				workspaceDir: options.remoteRoot,
				stateDir: plan.stateDir && mapPath(plan.stateDir),
				managedSkillsDir: mapPath(plan.managedSkillsDir),
				pluginSkillsDir: plan.pluginSkillsDir && mapPath(plan.pluginSkillsDir),
				bundledSkillsDir: plan.bundledSkillsDir && mapPath(plan.bundledSkillsDir),
				roots: plan.roots.map((root) => ({
					...root,
					dir: mapPath(root.dir)
				})),
				pluginSkillRoots: plan.pluginSkillRoots.map((root) => ({
					...root,
					dir: mapPath(root.dir)
				})),
				allowSymlinkTargets: plan.allowSymlinkTargets?.map(mapPath)
			}
		};
	};
	async function call(operation, request, signal) {
		const active = signal ? AbortSignal.any([options.signal, signal]) : options.signal;
		return JSON.parse(await runNodeWorkspaceWorker(options, "workspace.skills", {
			operation,
			request: JSON.stringify(request),
			watch: false
		}, active));
	}
	return {
		...createNodeSkillLifecycle(options),
		loadSkills: (request) => call("discovery", mapSources(request)),
		async watchSkills(request, onChange, signal) {
			await runNodeWorkspaceWorker(options, "workspace.skills", {
				operation: "watch",
				request: JSON.stringify(mapSources(request)),
				watch: true
			}, AbortSignal.any([options.signal, signal]), (line) => {
				const event = JSON.parse(line);
				if (event !== "change" && event !== "unavailable" && event !== "available") throw new Error("Invalid Skill change notification");
				onChange(event);
			});
		},
		skillResources: {
			readInstructions: (filePath, { signal }) => call("readInstructions", { filePath }, signal),
			resolveExplicitSkill: (selection) => call("resolveResource", selection),
			readSkillFiles: (skill, { allowMissingRoot }) => call("readResources", {
				skill,
				allowMissingRoot
			})
		},
		installSkillDependencies: (request) => call("installDependencies", request)
	};
}
//#endregion
export { createNodeWorkspaceSkills };
