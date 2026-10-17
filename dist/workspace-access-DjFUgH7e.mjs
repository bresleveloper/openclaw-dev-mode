import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-CJdQ4R61.mjs";
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
	const guardCall = (call, assertActive = assertCurrent) => async (...args) => {
		assertActive();
		const result = await call(...args);
		assertActive();
		return result;
	};
	const bridge = {
		readFile: guardCall((params) => access.bridge.readFile(params)),
		writeFile: guardCall((params) => access.bridge.writeFile(params)),
		stat: guardCall((params) => access.bridge.stat(params))
	};
	const createFileExclusive = access.bridge.createFileExclusive?.bind(access.bridge);
	if (createFileExclusive) bridge.createFileExclusive = guardCall(createFileExclusive);
	const readFileWithSource = access.bridge.readFileWithSource?.bind(access.bridge);
	if (readFileWithSource) bridge.readFileWithSource = guardCall(readFileWithSource);
	const readDirectory = access.bridge.readDirectory?.bind(access.bridge);
	if (readDirectory) bridge.readDirectory = guardCall(readDirectory);
	const boundAccess = { bridge: Object.freeze(bridge) };
	const outboundMedia = access.outboundMedia;
	if (outboundMedia) {
		const readFile = outboundMedia.readFile.bind(outboundMedia);
		boundAccess.outboundMedia = Object.freeze({
			localRoots: Object.freeze([...outboundMedia.localRoots]),
			readFile: guardCall(readFile)
		});
	}
	const memoryFiles = access.memoryFiles;
	if (memoryFiles) {
		const assertMemoryCurrent = () => {
			assertCurrent();
			memoryFiles.assertCurrent();
		};
		const guardMemoryCall = (call) => guardCall(call, assertMemoryCurrent);
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
			listFiles: guardMemoryCall((...params) => memoryFiles.listFiles(...params)),
			inspectFile: guardMemoryCall((...params) => memoryFiles.inspectFile(...params)),
			readFile: guardMemoryCall((params) => memoryFiles.readFile(params)),
			readForIndexing: guardMemoryCall((filePath) => memoryFiles.readForIndexing(filePath)),
			buildMultimodalChunk: guardMemoryCall((entry) => memoryFiles.buildMultimodalChunk(entry)),
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
	if (installSkillDependencies) boundAccess.installSkillDependencies = guardCall(installSkillDependencies);
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
		resolveExplicitSkill: guardCall((selection) => skillResources.resolveExplicitSkill(selection)),
		readSkillFiles: guardCall((skill, options) => skillResources.readSkillFiles(skill, options))
	});
	const applySkillRoot = access.applySkillRoot?.bind(access);
	if (applySkillRoot) boundAccess.applySkillRoot = guardCall((params) => applySkillRoot({
		...params,
		beforeInstall: async (mode) => {
			assertCurrent();
			const decision = await params.beforeInstall?.(mode);
			assertCurrent();
			return decision;
		}
	}));
	const recordSkillSourceInstall = access.recordSkillSourceInstall?.bind(access);
	if (recordSkillSourceInstall) boundAccess.recordSkillSourceInstall = guardCall(recordSkillSourceInstall);
	const clawHubSkills = access.clawHubSkills;
	if (clawHubSkills) boundAccess.clawHubSkills = Object.freeze({
		planClawHubSkillUninstall: guardCall((params) => clawHubSkills.planClawHubSkillUninstall(params)),
		applyClawHubSkillUninstall: guardCall((plan, options) => clawHubSkills.applyClawHubSkillUninstall(plan, {
			...options,
			beforePersistentApply() {
				assertCurrent();
				options.beforePersistentApply?.();
			},
			beforeRollback() {
				assertCurrent();
				options.beforeRollback?.();
			}
		})),
		resolveClawHubSkillVerificationTarget: guardCall((params) => clawHubSkills.resolveClawHubSkillVerificationTarget(params)),
		readClawHubSkillsLockfile: guardCall((params) => clawHubSkills.readClawHubSkillsLockfile(params)),
		resolveRequestedUpdateSlug: guardCall((params) => clawHubSkills.resolveRequestedUpdateSlug(params)),
		resolveTrackedUpdateTarget: guardCall((params) => clawHubSkills.resolveTrackedUpdateTarget(params)),
		guardTrackedSkillLocalState: guardCall((params) => clawHubSkills.guardTrackedSkillLocalState(params)),
		preflightSkillOwnerState: guardCall((params) => clawHubSkills.preflightSkillOwnerState(params)),
		assertClawHubSkillInstallState: guardCall((params) => clawHubSkills.assertClawHubSkillInstallState(params)),
		readInstalledClawHubSkillFiles: guardCall((params) => clawHubSkills.readInstalledClawHubSkillFiles(params)),
		recordClawHubSkillInstall: guardCall((params) => clawHubSkills.recordClawHubSkillInstall(params))
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
	const workspaceKey = path.resolve(params.workspaceDir);
	const binding = bindings.get(workspaceKey);
	const remoteOwned = binding !== void 0;
	if (params.localExecution && remoteOwned && !params.requirePreparation) return;
	const localExecution = remoteOwned ? void 0 : params.localExecution;
	const access = params.requirePreparation ? binding?.access : getAgentWorkspaceAccess(params.workspaceDir, "prepareTurnAttachments");
	if (!access?.prepareTurnAttachments && !localExecution && !params.requirePreparation) return;
	const signal = params.requirePreparation ? AbortSignal.any([AbortSignal.timeout(params.turn.timeoutMs), ...params.turn.abortSignal ? [params.turn.abortSignal] : []]) : params.turn.abortSignal;
	const deadline = performance.now() + params.turn.timeoutMs;
	const assertTurnCurrent = () => {
		signal?.throwIfAborted();
		params.assertCurrent();
	};
	const assertCurrent = () => {
		assertTurnCurrent();
		if (params.requirePreparation && bindings.get(workspaceKey) !== binding || getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed during attachment preparation");
	};
	const assertFactsCurrent = params.requirePreparation ? assertTurnCurrent : assertCurrent;
	assertFactsCurrent();
	const recorder = params.turn.userTurnTranscriptRecorder;
	const message = await recorder?.resolveMessage() ?? recorder?.message;
	assertFactsCurrent();
	const facts = (message ? readPersistedMediaFacts(message) : void 0) ?? params.turn.media ?? [];
	const attachments = facts.filter((fact) => fact.path?.trim() || fact.url?.trim());
	if (!attachments.length) return;
	assertCurrent();
	if (params.requirePreparation && !access?.prepareTurnAttachments && !localExecution) throw new Error("Workspace attachments require a registered attachment provider; configure one for this execution environment before retrying");
	const batches = params.requirePreparation ? attachments.map((fact) => [fact]) : [facts];
	const notes = /* @__PURE__ */ new Set();
	let noteChars = 0;
	for (const [index, media] of batches.entries()) {
		assertCurrent();
		let note;
		if (access?.prepareTurnAttachments) note = await access.prepareTurnAttachments({
			config: params.turn.config,
			media,
			timeoutMs: params.requirePreparation ? Math.max(0, Math.ceil(deadline - performance.now())) : params.turn.timeoutMs,
			abortSignal: signal
		}, assertCurrent);
		else if (localExecution) {
			const { prepareLocalWorkspaceAttachments } = await import("./workspace-attachments.local-Ui65dhhN.mjs");
			assertCurrent();
			note = await prepareLocalWorkspaceAttachments({
				media,
				execution: localExecution,
				assertCurrent
			});
		}
		assertCurrent();
		if (!params.requirePreparation) return note;
		if (!note?.trim()) throw new Error(`Workspace attachment ${index + 1} could not be prepared; ensure every attachment is available to the registered attachment provider before retrying`);
		if (!notes.has(note)) {
			noteChars += note.length + (notes.size ? 1 : 0);
			if (localExecution && noteChars > localExecution.maxChars) throw new Error("Prepared workspace attachment paths exceed the available context budget");
			notes.add(note);
		}
	}
	return [...notes].join("\n");
}
//#endregion
export { isWorkspaceAccessUnavailableError as a, getAgentWorkspaceAccess as i, captureAgentWorkspaceOutboundMedia as n, prepareAgentWorkspaceAttachments as o, declareAgentWorkspaceAccess as r, registerAgentWorkspaceAccess as s, WorkspaceAccessUnavailableError as t };
