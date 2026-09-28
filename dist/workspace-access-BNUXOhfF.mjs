import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import path from "node:path";
//#region src/agents/workspace-access.ts
const bindings = /* @__PURE__ */ new Map();
function assertBindingCurrent(key, binding) {
	if (!binding.active || bindings.get(key) !== binding) throw new WorkspaceAccessUnavailableError("Workspace access is stopped or not ready");
}
const WORKSPACE_ACCESS_UNAVAILABLE_CODE = "WORKSPACE_ACCESS_UNAVAILABLE";
/** The configured workspace host cannot currently provide the requested data. */
var WorkspaceAccessUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = WORKSPACE_ACCESS_UNAVAILABLE_CODE;
		this.name = "WorkspaceAccessUnavailableError";
	}
};
/** Match wrapped errors and separate SDK module instances without parsing messages. */
function isWorkspaceAccessUnavailableError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === WORKSPACE_ACCESS_UNAVAILABLE_CODE);
}
/** Declare ownership during plugin registration so startup cannot fall back to a local copy. */
function declareAgentWorkspaceAccess(workspaceDir) {
	const key = path.resolve(workspaceDir);
	if (!bindings.has(key)) bindings.set(key, { active: false });
}
/**
* Bind host access independently of an active harness turn. Releasing rejects
* subsequent calls and stale results; it cannot undo an already dispatched write.
*/
function registerAgentWorkspaceAccess(workspaceDir, access) {
	const key = path.resolve(workspaceDir);
	if (bindings.get(key)?.active) throw new Error(`Workspace access is already registered: ${key}`);
	const binding = { active: true };
	const lifetime = new AbortController();
	const assertCurrent = () => assertBindingCurrent(key, binding);
	const bridge = {
		async readFile(params) {
			assertCurrent();
			const result = await access.bridge.readFile(params);
			assertCurrent();
			return result;
		},
		async writeFile(params) {
			assertCurrent();
			await access.bridge.writeFile(params);
			assertCurrent();
		},
		async stat(params) {
			assertCurrent();
			const result = await access.bridge.stat(params);
			assertCurrent();
			return result;
		}
	};
	const readFileWithSource = access.bridge.readFileWithSource?.bind(access.bridge);
	if (readFileWithSource) bridge.readFileWithSource = async (params) => {
		assertCurrent();
		const result = await readFileWithSource(params);
		assertCurrent();
		return result;
	};
	const readDirectory = access.bridge.readDirectory?.bind(access.bridge);
	if (readDirectory) bridge.readDirectory = async (params) => {
		assertCurrent();
		const result = await readDirectory(params);
		assertCurrent();
		return result;
	};
	const boundAccess = { bridge: Object.freeze(bridge) };
	const outboundMedia = access.outboundMedia;
	if (outboundMedia) {
		const readFile = outboundMedia.readFile.bind(outboundMedia);
		boundAccess.outboundMedia = Object.freeze({
			localRoots: Object.freeze([...outboundMedia.localRoots]),
			async readFile(filePath, maxBytes) {
				assertCurrent();
				const data = await readFile(filePath, maxBytes);
				assertCurrent();
				return data;
			}
		});
	}
	const memoryFiles = access.memoryFiles;
	if (memoryFiles) {
		const assertMemoryCurrent = () => {
			assertCurrent();
			memoryFiles.assertCurrent();
		};
		const guardMemoryCall = (call) => async (...args) => {
			assertMemoryCurrent();
			const result = await call(...args);
			assertMemoryCurrent();
			return result;
		};
		const maintenance = memoryFiles.maintenance;
		boundAccess.memoryFiles = Object.freeze({
			assertCurrent: assertMemoryCurrent,
			...maintenance ? { maintenance: Object.freeze({
				readFile: guardMemoryCall(maintenance.readFile.bind(maintenance)),
				stat: guardMemoryCall(maintenance.stat.bind(maintenance)),
				listDirectory: guardMemoryCall(maintenance.listDirectory.bind(maintenance)),
				mkdir: guardMemoryCall(maintenance.mkdir.bind(maintenance)),
				rename: guardMemoryCall(maintenance.rename.bind(maintenance)),
				resolveWritePath: guardMemoryCall(maintenance.resolveWritePath.bind(maintenance)),
				async commitContent(params) {
					assertMemoryCurrent();
					await maintenance.commitContent(params);
					try {
						assertMemoryCurrent();
					} catch (cause) {
						throw Object.assign(new WorkspaceAccessUnavailableError("Workspace access stopped after Memory write committed", { cause }), { publication: "committed" });
					}
				},
				resolveDreamsPath: guardMemoryCall(maintenance.resolveDreamsPath.bind(maintenance)),
				readDreams: guardMemoryCall(maintenance.readDreams.bind(maintenance)),
				writeDreams: guardMemoryCall(maintenance.writeDreams.bind(maintenance)),
				replaceReport: guardMemoryCall(maintenance.replaceReport.bind(maintenance)),
				appendCorpus: guardMemoryCall(maintenance.appendCorpus.bind(maintenance))
			}) } : {},
			async listFiles(...params) {
				assertMemoryCurrent();
				const result = await memoryFiles.listFiles(...params);
				assertMemoryCurrent();
				return result;
			},
			async inspectFile(...params) {
				assertMemoryCurrent();
				const result = await memoryFiles.inspectFile(...params);
				assertMemoryCurrent();
				return result;
			},
			async readFile(params) {
				assertMemoryCurrent();
				const result = await memoryFiles.readFile(params);
				assertMemoryCurrent();
				return result;
			},
			async readForIndexing(filePath) {
				assertMemoryCurrent();
				const result = await memoryFiles.readForIndexing(filePath);
				assertMemoryCurrent();
				return result;
			},
			async buildMultimodalChunk(entry) {
				assertMemoryCurrent();
				const result = await memoryFiles.buildMultimodalChunk(entry);
				assertMemoryCurrent();
				return result;
			},
			async watch(request, onChange, signal) {
				assertMemoryCurrent();
				const active = AbortSignal.any([signal, lifetime.signal]);
				active.throwIfAborted();
				await memoryFiles.watch(request, (event) => {
					if (!active.aborted) {
						assertMemoryCurrent();
						onChange(event);
					}
				}, active);
			}
		});
	}
	const prepareTurnAttachments = access.prepareTurnAttachments?.bind(access);
	if (prepareTurnAttachments) boundAccess.prepareTurnAttachments = async (turn, assertRunCurrent) => {
		const assertPreparationCurrent = () => {
			assertCurrent();
			turn.abortSignal?.throwIfAborted();
			assertRunCurrent();
		};
		assertPreparationCurrent();
		const note = await prepareTurnAttachments(turn, assertPreparationCurrent);
		assertPreparationCurrent();
		return note;
	};
	const installSkillDependencies = access.installSkillDependencies?.bind(access);
	if (installSkillDependencies) boundAccess.installSkillDependencies = async (params) => {
		assertCurrent();
		const result = await installSkillDependencies(params);
		assertCurrent();
		return result;
	};
	const loadSkills = access.loadSkills?.bind(access);
	if (loadSkills) boundAccess.loadSkills = async (request) => {
		assertCurrent();
		let result;
		try {
			result = await loadSkills(request);
		} catch (cause) {
			throw new WorkspaceAccessUnavailableError("Remote workspace skill discovery failed", { cause });
		}
		assertCurrent();
		return result;
	};
	const watchSkills = access.watchSkills?.bind(access);
	if (watchSkills) boundAccess.watchSkills = async (request, onChange, signal) => {
		assertCurrent();
		const active = AbortSignal.any([signal, lifetime.signal]);
		active.throwIfAborted();
		await watchSkills(request, (event) => {
			if (!active.aborted && binding.active && bindings.get(key) === binding) onChange(event);
		}, active);
	};
	const skillResources = access.skillResources;
	if (skillResources) boundAccess.skillResources = Object.freeze({
		async readInstructions(filePath, options) {
			assertCurrent();
			options.signal?.throwIfAborted();
			const result = await skillResources.readInstructions(filePath, options);
			assertCurrent();
			options.signal?.throwIfAborted();
			return result;
		},
		async resolveExplicitSkill(selection) {
			assertCurrent();
			const result = await skillResources.resolveExplicitSkill(selection);
			assertCurrent();
			return result;
		},
		async readSkillFiles(skill, options) {
			assertCurrent();
			const result = await skillResources.readSkillFiles(skill, options);
			assertCurrent();
			return result;
		}
	});
	const applySkillRoot = access.applySkillRoot?.bind(access);
	if (applySkillRoot) boundAccess.applySkillRoot = async (params) => {
		assertCurrent();
		const result = await applySkillRoot({
			...params,
			beforeInstall: async (mode) => {
				assertCurrent();
				const decision = await params.beforeInstall?.(mode);
				assertCurrent();
				return decision;
			}
		});
		assertCurrent();
		return result;
	};
	const recordSkillSourceInstall = access.recordSkillSourceInstall?.bind(access);
	if (recordSkillSourceInstall) boundAccess.recordSkillSourceInstall = async (params) => {
		assertCurrent();
		await recordSkillSourceInstall(params);
		assertCurrent();
	};
	const clawHubSkills = access.clawHubSkills;
	if (clawHubSkills) boundAccess.clawHubSkills = Object.freeze({
		async planClawHubSkillUninstall(params) {
			assertCurrent();
			const result = await clawHubSkills.planClawHubSkillUninstall(params);
			assertCurrent();
			return result;
		},
		async applyClawHubSkillUninstall(plan, options) {
			assertCurrent();
			const result = await clawHubSkills.applyClawHubSkillUninstall(plan, {
				...options,
				beforePersistentApply() {
					assertCurrent();
					options.beforePersistentApply?.();
				},
				beforeRollback() {
					assertCurrent();
					options.beforeRollback?.();
				}
			});
			assertCurrent();
			return result;
		},
		async resolveClawHubSkillVerificationTarget(params) {
			assertCurrent();
			const result = await clawHubSkills.resolveClawHubSkillVerificationTarget(params);
			assertCurrent();
			return result;
		},
		async readClawHubSkillsLockfile(params) {
			assertCurrent();
			const result = await clawHubSkills.readClawHubSkillsLockfile(params);
			assertCurrent();
			return result;
		},
		async resolveRequestedUpdateSlug(params) {
			assertCurrent();
			const result = await clawHubSkills.resolveRequestedUpdateSlug(params);
			assertCurrent();
			return result;
		},
		async resolveTrackedUpdateTarget(params) {
			assertCurrent();
			const result = await clawHubSkills.resolveTrackedUpdateTarget(params);
			assertCurrent();
			return result;
		},
		async guardTrackedSkillLocalState(params) {
			assertCurrent();
			const result = await clawHubSkills.guardTrackedSkillLocalState(params);
			assertCurrent();
			return result;
		},
		async preflightSkillOwnerState(params) {
			assertCurrent();
			const result = await clawHubSkills.preflightSkillOwnerState(params);
			assertCurrent();
			return result;
		},
		async assertClawHubSkillInstallState(params) {
			assertCurrent();
			await clawHubSkills.assertClawHubSkillInstallState(params);
			assertCurrent();
		},
		async readInstalledClawHubSkillFiles(params) {
			assertCurrent();
			const result = await clawHubSkills.readInstalledClawHubSkillFiles(params);
			assertCurrent();
			return result;
		},
		async recordClawHubSkillInstall(params) {
			assertCurrent();
			await clawHubSkills.recordClawHubSkillInstall(params);
			assertCurrent();
		}
	});
	binding.access = Object.freeze(boundAccess);
	bindings.set(key, binding);
	return () => {
		binding.active = false;
		lifetime.abort();
	};
}
function getAgentWorkspaceAccess(workspaceDir, capability) {
	const key = path.resolve(workspaceDir);
	const binding = bindings.get(key);
	if (capability && binding?.access && !binding.access[capability]) return;
	if (binding) assertBindingCurrent(key, binding);
	return binding?.access;
}
/** Internal routing capture: unrelated Gateway media remains usable while the host is offline. */
function captureAgentWorkspaceOutboundMedia(workspaceDir) {
	const key = path.resolve(workspaceDir);
	const binding = bindings.get(key);
	if (!binding) return;
	const media = binding.access?.outboundMedia;
	if (binding.access && !media) return;
	return {
		localRoots: media?.localRoots ?? [],
		async readFile(filePath, maxBytes) {
			assertBindingCurrent(key, binding);
			if (!media) throw new Error("Remote workspace attachment access is unavailable");
			return await media.readFile(filePath, maxBytes);
		}
	};
}
/** Prepare execution-only paths while retaining canonical media and transcript facts. */
async function prepareAgentWorkspaceAttachments(params) {
	if (!params.turn.media?.length && !params.turn.userTurnTranscriptRecorder) return;
	const access = getAgentWorkspaceAccess(params.workspaceDir, "prepareTurnAttachments");
	if (!access?.prepareTurnAttachments) return;
	const assertCurrent = () => {
		params.turn.abortSignal?.throwIfAborted();
		params.assertCurrent();
		if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed during attachment preparation");
	};
	assertCurrent();
	const recorder = params.turn.userTurnTranscriptRecorder;
	const message = await recorder?.resolveMessage() ?? recorder?.message;
	assertCurrent();
	const facts = (message ? readPersistedMediaFacts(message) : void 0) ?? params.turn.media ?? [];
	if (!facts.some((fact) => fact.path?.trim() || fact.url?.trim())) return;
	const note = await access.prepareTurnAttachments({
		config: params.turn.config,
		media: facts,
		timeoutMs: params.turn.timeoutMs,
		abortSignal: params.turn.abortSignal
	}, assertCurrent);
	assertCurrent();
	return note;
}
//#endregion
export { isWorkspaceAccessUnavailableError as a, getAgentWorkspaceAccess as i, captureAgentWorkspaceOutboundMedia as n, prepareAgentWorkspaceAttachments as o, declareAgentWorkspaceAccess as r, registerAgentWorkspaceAccess as s, WorkspaceAccessUnavailableError as t };
