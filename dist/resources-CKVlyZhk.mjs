import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as removeTemporaryArtifacts } from "./temp-artifact-cleanup-D_2UpyuT.mjs";
import "./skill-library-C7RO5Y8q.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-BNUXOhfF.mjs";
import { n as createSyntheticSourceInfo } from "./source-info-CcFiWAof.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-CwjetzV2.mjs";
import { s as shouldSyncSkillPath, t as loadSingleSkillDirectory } from "./local-loader-DP-Jr6_I.mjs";
import { a as prepareSkillLibrarySelection, n as captureSkillLibrarySelection, w as readSkillLibrarySelectionManifests } from "./selection-Y3a9jWK1.mjs";
import { f as SkillLibraryError, i as prepareSkillBundle, l as skillLibraryRevisionDir, n as SkillTreeDirectoryError, o as readSkillBundleTree, s as readSkillLibraryManifestTree } from "./bundle-rcLpsHEc.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-jROPV5-K.mjs";
import { n as SkillResourceDeliverySchema } from "./skill-resources-C_go8RE1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { Value } from "typebox/value";
//#region src/skills/runtime/resources.ts
const log = createSubsystemLogger("skills/resources");
function contextualizeSkillResourceError(skill, error) {
	const detail = error instanceof Error ? error.message : String(error);
	const message = `Failed to prepare skill resources: skill=${JSON.stringify(skill.name)} root=${JSON.stringify(skill.baseDir)} error=${detail}`;
	if (error instanceof SkillLibraryError) return new SkillLibraryError(error.code, message, error.currentRevision, { cause: error });
	return new SkillLibraryError("INVALID_BUNDLE", message, void 0, { cause: error });
}
function isMissingDiscoveredSkillRoot(error) {
	return error instanceof SkillTreeDirectoryError && path.resolve(error.failedPath) === path.resolve(error.rootPath) && isMissingPathError(error.cause);
}
async function resolveExplicitSkillResource(selection) {
	const skillDir = path.dirname(selection.path);
	const rootRealPath = await fs.realpath(skillDir);
	return loadSingleSkillDirectory({
		skillDir,
		rootRealPath,
		source: "openclaw-resources",
		maxBytes: 1048576
	})?.skill ?? null;
}
async function readSkillResourceFiles(skill, options) {
	try {
		return await readSkillBundleTree(skill.baseDir, shouldSyncSkillPath, {
			symlinks: "follow-within-root",
			assertFileAccess: options.assertFileAccess
		});
	} catch (error) {
		if (options.allowMissingRoot && isMissingDiscoveredSkillRoot(error)) {
			log.warn("Skipping stale discovered skill during worker resource preparation.", {
				skill: skill.name,
				root: skill.baseDir,
				failedPath: error.failedPath,
				error: error.message
			});
			return null;
		}
		throw error;
	}
}
const localSkillResourceReader = {
	readInstructions: (filePath, options) => fs.readFile(filePath, {
		...options,
		encoding: "utf8"
	}),
	resolveExplicitSkill: resolveExplicitSkillResource,
	readSkillFiles: readSkillResourceFiles
};
async function prepareSkillResourceDelivery(inputSnapshot, assertCurrent, inputExplicitSelections = [], workspaceDir) {
	if (!inputSnapshot) return;
	assertCurrent();
	if (!inputSnapshot.resolvedSkills?.length && !inputSnapshot.librarySelections?.length && !inputExplicitSelections.length) return;
	const snapshot = {
		...inputSnapshot,
		librarySelections: captureSkillLibrarySelection(inputSnapshot.librarySelections ?? []),
		skills: inputSnapshot.skills.map((skill) => ({ ...skill })),
		resolvedSkills: inputSnapshot.resolvedSkills?.map((skill) => ({ ...skill })),
		skillRoots: inputSnapshot.skillRoots && { ...inputSnapshot.skillRoots }
	};
	const explicitSelections = inputExplicitSelections.map((selection) => ({ ...selection }));
	let sourceReader;
	const getSourceReader = (skill) => {
		if (skill?.fileHost === "gateway") return localSkillResourceReader;
		if (!sourceReader) {
			const sourceWorkspace = snapshot.skillRoots?.agentWorkspaceDir ?? workspaceDir;
			const access = sourceWorkspace ? getAgentWorkspaceAccess(sourceWorkspace, "loadSkills") : void 0;
			if (access?.loadSkills && !access.skillResources) throw new WorkspaceAccessUnavailableError("Remote workspace skill resources are unavailable");
			sourceReader = (access?.loadSkills ? access.skillResources : void 0) ?? localSkillResourceReader;
		}
		return sourceReader;
	};
	const skills = [];
	let total = 0;
	const libraryContext = snapshot.librarySelections?.length ? captureOpenClawStateWorkerContext() : void 0;
	const assertLibraryCurrent = () => {
		assertCurrent();
		libraryContext?.maintenanceScope?.assertAdmission();
		libraryContext?.admission.assertCurrent();
	};
	const libraryOptions = { env: libraryContext?.environment };
	const libraryEntries = libraryContext ? await prepareSkillLibrarySelection(snapshot.librarySelections ?? [], libraryOptions, assertLibraryCurrent) : [];
	assertLibraryCurrent();
	const candidates = resolveSkillResourceCandidates(snapshot, libraryEntries);
	for (const selected of explicitSelections) {
		if (selected.path.startsWith("node://") || candidates.some((skill) => skill.filePath === selected.path)) continue;
		const skillDir = path.dirname(selected.path);
		const gatewayOwned = snapshot.skills.some((skill) => skill.gatewayFilePath === selected.path);
		let loaded;
		try {
			loaded = await (gatewayOwned ? localSkillResourceReader : getSourceReader()).resolveExplicitSkill(selected);
			if (loaded) loaded = {
				...loaded,
				fileHost: gatewayOwned ? "gateway" : "workspace"
			};
		} catch (error) {
			throw contextualizeSkillResourceError({
				name: selected.name,
				baseDir: skillDir
			}, error);
		}
		assertLibraryCurrent();
		if (!loaded || loaded.filePath !== selected.path || !snapshot.skills.some((skill) => skill.name === loaded.name) || candidates.some((skill) => skill.name === loaded.name)) throw new Error(`Explicit skill no longer matches the prepared catalog: skill=${JSON.stringify(selected.name)} root=${JSON.stringify(skillDir)} path=${JSON.stringify(selected.path)}. Refresh skill selection and retry.`);
		candidates.push(loaded);
	}
	const pins = [...new Set(candidates.flatMap((skill) => {
		const pin = !skill.filePath.startsWith("node://") && snapshot.librarySelections?.find((selection) => selection.name === skill.name);
		return pin ? [pin] : [];
	}))];
	let manifests;
	for (const skill of candidates) {
		if (skill.filePath.startsWith("node://")) continue;
		const pin = snapshot.librarySelections?.find((selection) => selection.name === skill.name);
		const explicitlySelected = explicitSelections.some((selection) => selection.path === skill.filePath);
		let files;
		try {
			if (pin) {
				assertLibraryCurrent();
				if (!manifests) {
					manifests = await readSkillLibrarySelectionManifests(pins, libraryOptions);
					assertLibraryCurrent();
				}
				const manifest = manifests?.[pins.indexOf(pin)];
				if (!manifest) throw new SkillLibraryError("NOT_FOUND", "Selected skill revision is unavailable.");
				files = await readSkillLibraryManifestTree(skillLibraryRevisionDir(pin.skillId, pin.revision, libraryContext?.environment), manifest.files_json, pin.revision);
			} else files = await getSourceReader(skill).readSkillFiles(skill, { allowMissingRoot: !explicitlySelected });
		} catch (error) {
			throw contextualizeSkillResourceError(skill, error);
		}
		assertLibraryCurrent();
		if (files === null) {
			if (explicitlySelected) throw contextualizeSkillResourceError(skill, /* @__PURE__ */ new Error("Explicit skill root is unavailable"));
			continue;
		}
		let bundle;
		try {
			bundle = prepareSkillBundle(files);
		} catch (error) {
			throw contextualizeSkillResourceError(skill, error);
		}
		total += bundle.files.reduce((sum, file) => sum + file.sizeBytes, 0);
		if (total > 8388608) throw new Error("Selected skill resources exceed the worker delivery limit (8 MiB). Select fewer skills before retrying.");
		skills.push({
			name: skill.name,
			sourcePath: skill.filePath,
			modelVisible: (snapshot.resolvedSkills?.some((selected) => selected.filePath === skill.filePath) ?? false) || explicitSelections.some((selected) => selected.path === skill.filePath),
			...skill.displayName ? { displayName: skill.displayName } : {},
			description: skill.description,
			revision: bundle.revision,
			files
		});
	}
	const delivery = {
		version: 1,
		skills
	};
	if (!Value.Check(SkillResourceDeliverySchema, delivery)) throw new Error("Selected skill catalog exceeds the worker resource contract.");
	return delivery;
}
/** Owns private turn inputs independently of credential-bearing worker state. */
async function materializeSkillResources(delivery, assertCurrent) {
	if (!Value.Check(SkillResourceDeliverySchema, delivery)) throw new Error("Invalid skill resource delivery.");
	const bundles = delivery.skills.map((skill) => ({
		skill,
		bundle: prepareSkillBundle(skill.files)
	}));
	if (bundles.some(({ skill, bundle }) => skill.revision !== bundle.revision) || bundles.reduce((sum, { bundle }) => sum + bundle.files.reduce((bytes, file) => bytes + file.sizeBytes, 0), 0) > 8388608) throw new Error("Skill resource integrity or delivery limit check failed.");
	assertCurrent();
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-skill-resources-"));
	const cleanup = () => removeTemporaryArtifacts(directory, "Materialized skill");
	try {
		const pathMappings = [];
		const resolvedSkills = [];
		for (const [index, { skill, bundle }] of bundles.entries()) {
			const baseDir = path.join(directory, String(index));
			for (const file of bundle.files) {
				assertCurrent();
				const target = path.join(baseDir, file.path);
				await fs.mkdir(path.dirname(target), {
					recursive: true,
					mode: 448
				});
				assertCurrent();
				await fs.writeFile(target, file.bytes, {
					mode: file.executable ? 320 : 256,
					flag: "wx"
				});
			}
			const filePath = path.join(baseDir, "SKILL.md");
			if (skill.sourcePath) {
				pathMappings.push([skill.sourcePath, filePath]);
				pathMappings.push([skill.sourcePath.slice(0, -8), `${baseDir}${path.sep}`]);
			}
			resolvedSkills.push({
				name: skill.name,
				displayName: skill.displayName,
				description: skill.description,
				contentHash: bundle.revision,
				filePath,
				baseDir,
				source: "openclaw-resources",
				sourceInfo: createSyntheticSourceInfo(filePath, {
					source: "openclaw-resources",
					baseDir
				}),
				disableModelInvocation: skill.modelVisible === false
			});
		}
		assertCurrent();
		return {
			directory,
			snapshot: {
				skills: resolvedSkills.map((skill) => ({
					name: skill.name,
					skillKey: skill.name
				})),
				resolvedSkills,
				prompt: formatSkillsForPromptBounded({
					skills: resolvedSkills.filter((skill) => !skill.disableModelInvocation),
					preserveOrder: true
				})
			},
			rewriteReferences: (text) => pathMappings.reduce((rewritten, [source, target]) => rewritten.replaceAll(source, target), text),
			cleanup
		};
	} catch (error) {
		await cleanup();
		throw error;
	}
}
//#endregion
export { resolveExplicitSkillResource as i, prepareSkillResourceDelivery as n, readSkillResourceFiles as r, materializeSkillResources as t };
