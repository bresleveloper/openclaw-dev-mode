import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { r as removeTemporaryArtifacts } from "./temp-artifact-cleanup-DIl8XLa9.mjs";
import { r as acquireFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import "./skill-library-Bgib5R_8.mjs";
import { n as SkillResourceDeliverySchema } from "./skill-resources-BYZ-VOKK.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-sFz3TNTx.mjs";
import { n as createSyntheticSourceInfo } from "./source-info-CcFiWAof.mjs";
import { i as prepareSkillBundle, l as skillLibraryRevisionDir, n as SkillTreeDirectoryError, o as readSkillBundleTree, s as readSkillLibraryManifestTree } from "./bundle-CsGYNL0a.mjs";
import { o as shouldSyncSkillPath, t as loadSingleSkillDirectory } from "./local-loader-DuDhVnOL.mjs";
import { n as recordSkillFileHost, r as resolveSkillFileHost } from "./skill-file-host-d_CtoZp0.mjs";
import { n as resolveSkillReadPath } from "./workspace-skill-read-path-Jvbv8xxW.mjs";
import { r as escapeSkillXml } from "./skill-contract-CjUSek63.mjs";
import { r as normalizeSkillIndexName } from "./skill-index-C40nKKG1.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-BAc6uCwo.mjs";
import { t as SkillResourceDeliveryLimitError } from "./resource-delivery-error-CFKvWByr.mjs";
import { a as prepareSkillLibrarySelection, n as captureSkillLibraryPreparation, u as readSkillLibrarySelectionManifests } from "./selection-B3qUGv_G.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-DWvSV-Yb.mjs";
import { t as parseSkillsPromptCatalog } from "./skill-prompt-catalog-DEexSe76.mjs";
import { i as resolveExplicitSkillSelectionFileHost, t as copyExplicitSkillSelectionFileHost } from "./skill-command-provenance-D3weQ69x.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
function matchesExplicitSelection(skill, selection) {
	const selectionHost = resolveExplicitSkillSelectionFileHost(selection);
	return skill.filePath === selection.path && (selectionHost === void 0 || resolveSkillFileHost(skill) === selectionHost);
}
async function prepareSkillResourceDelivery(inputSnapshot, assertCurrent, inputExplicitSelections = [], workspaceDir) {
	if (!inputSnapshot) return;
	assertCurrent();
	if (!inputSnapshot.resolvedSkills?.length && !inputSnapshot.librarySelections?.length && !inputExplicitSelections.length) return;
	const library = captureSkillLibraryPreparation(inputSnapshot.librarySelections ?? [], assertCurrent);
	const snapshot = {
		...inputSnapshot,
		librarySelections: library.librarySelections,
		skills: inputSnapshot.skills.map((skill) => ({ ...skill })),
		resolvedSkills: inputSnapshot.resolvedSkills?.map((skill) => ({ ...skill })),
		skillRoots: inputSnapshot.skillRoots && { ...inputSnapshot.skillRoots }
	};
	const explicitSelections = inputExplicitSelections.map((selection) => copyExplicitSkillSelectionFileHost(selection, { ...selection }));
	let sourceReader;
	const getSourceReader = (skill) => {
		if (skill && resolveSkillFileHost(skill) === "gateway") return localSkillResourceReader;
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
	const libraryOptions = { env: library.libraryContext?.environment };
	const libraryEntries = library.libraryContext ? await prepareSkillLibrarySelection(snapshot.librarySelections ?? [], libraryOptions, library.assertCurrent) : [];
	library.assertCurrent();
	const candidates = resolveSkillResourceCandidates(snapshot, libraryEntries);
	for (const selected of explicitSelections) {
		if (selected.path.startsWith("node://") || candidates.some((skill) => matchesExplicitSelection(skill, selected))) continue;
		const skillDir = path.dirname(selected.path);
		const selectedFileHost = resolveExplicitSkillSelectionFileHost(selected);
		const gatewayOwned = snapshot.skills.some((skill) => skill.gatewayFilePath === selected.path);
		let fileHost = selectedFileHost ?? (gatewayOwned ? "gateway" : void 0);
		if (!fileHost) {
			const sourceWorkspace = snapshot.skillRoots?.agentWorkspaceDir ?? workspaceDir;
			fileHost = (sourceWorkspace ? Boolean(getAgentWorkspaceAccess(sourceWorkspace, "loadSkills")?.loadSkills) : false) ? "workspace" : "gateway";
		}
		let loaded;
		try {
			loaded = await (fileHost === "gateway" ? localSkillResourceReader : getSourceReader()).resolveExplicitSkill(selected);
			if (loaded) loaded = recordSkillFileHost({ ...loaded }, fileHost);
		} catch (error) {
			throw contextualizeSkillResourceError({
				name: selected.name,
				baseDir: skillDir
			}, error);
		}
		library.assertCurrent();
		if (!loaded || loaded.filePath !== selected.path || !snapshot.skills.some((skill) => skill.name === loaded.name && (fileHost === "gateway" ? skill.gatewayFilePath === selected.path || selectedFileHost === void 0 && skill.gatewayFilePath === void 0 : skill.gatewayFilePath === void 0)) || candidates.some((skill) => skill.name === loaded.name)) throw new Error(`Explicit skill no longer matches the prepared catalog: skill=${JSON.stringify(selected.name)} root=${JSON.stringify(skillDir)} path=${JSON.stringify(selected.path)}. Refresh skill selection and retry.`);
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
		const explicitlySelected = explicitSelections.some((selection) => matchesExplicitSelection(skill, selection));
		let files;
		try {
			if (pin) {
				library.assertCurrent();
				if (!manifests) {
					manifests = await readSkillLibrarySelectionManifests(pins, libraryOptions);
					library.assertCurrent();
				}
				const manifest = manifests?.[pins.indexOf(pin)];
				if (!manifest) throw new SkillLibraryError("NOT_FOUND", "Selected skill revision is unavailable.");
				files = await readSkillLibraryManifestTree(skillLibraryRevisionDir(pin.skillId, pin.revision, library.libraryContext?.environment), manifest.files_json, pin.revision);
			} else files = await getSourceReader(skill).readSkillFiles(skill, { allowMissingRoot: !explicitlySelected });
		} catch (error) {
			throw contextualizeSkillResourceError(skill, error);
		}
		library.assertCurrent();
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
		if (total > 8388608) throw new SkillResourceDeliveryLimitError();
		const sourcePath = resolveSkillFileHost(skill) === "workspace" && candidates.some((candidate) => candidate !== skill && candidate.filePath === skill.filePath && resolveSkillFileHost(candidate) === "gateway") ? resolveSkillReadPath(skill) : skill.filePath;
		skills.push({
			name: skill.name,
			sourcePath,
			modelVisible: (snapshot.resolvedSkills?.some((selected) => selected.filePath === skill.filePath) ?? false) || explicitlySelected,
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
async function materializeSkillResources(delivery, assertCurrent, scope) {
	if (!Value.Check(SkillResourceDeliverySchema, delivery)) throw new Error("Invalid skill resource delivery.");
	const bundles = delivery.skills.map((skill) => ({
		skill,
		bundle: prepareSkillBundle(skill.files)
	})).toSorted((left, right) => {
		const a = JSON.stringify([
			left.skill.name,
			left.skill.sourcePath,
			left.bundle.revision
		]);
		const b = JSON.stringify([
			right.skill.name,
			right.skill.sourcePath,
			right.bundle.revision
		]);
		return a < b ? -1 : a > b ? 1 : 0;
	});
	if (bundles.some(({ skill, bundle }) => skill.revision !== bundle.revision) || bundles.reduce((sum, { bundle }) => sum + bundle.files.reduce((bytes, file) => bytes + file.sizeBytes, 0), 0) > 8388608) throw new Error("Skill resource integrity or delivery limit check failed.");
	assertCurrent();
	const directory = scope ? path.join(resolvePreferredOpenClawTmpDir(), `skill-resources-${sha256Hex(JSON.stringify([scope.sessionId, scope.workspaceDir])).slice(0, 16)}`) : await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-skill-resources-"));
	const lock = scope ? await acquireFileLock(directory, {
		retries: {
			retries: 0,
			factor: 1,
			minTimeout: 0,
			maxTimeout: 0
		},
		stale: 0,
		staleRecovery: "remove-if-definitely-stale"
	}) : void 0;
	let cleanupPromise;
	const cleanup = () => cleanupPromise ??= (async () => {
		try {
			await removeTemporaryArtifacts(directory, "Materialized skill");
		} finally {
			await lock?.release();
		}
	})();
	try {
		if (scope) {
			assertCurrent();
			await fs.rm(directory, {
				recursive: true,
				force: true
			});
			assertCurrent();
			await fs.mkdir(directory, { mode: 448 });
		}
		const pathMappings = [];
		const resolvedSkills = [];
		for (const { skill, bundle } of bundles) {
			const name = normalizeSkillIndexName(skill.name).slice(0, 40) || "skill";
			const baseDir = path.join(directory, `${name}-${sha256Hex(JSON.stringify([
				skill.name,
				skill.sourcePath,
				bundle.revision
			])).slice(0, 12)}`);
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
			const virtualPath = resolveSkillReadPath({
				name: skill.name,
				filePath: skill.sourcePath ?? filePath
			}, "workspace");
			for (const source of skill.sourcePath ? [virtualPath, skill.sourcePath] : [virtualPath]) pathMappings.push([
				source,
				filePath,
				skill.name
			], [source.slice(0, -8), `${baseDir}${path.sep}`]);
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
		const rewritePaths = (text) => pathMappings.reduce((rewritten, [source, target]) => rewritten.replaceAll(source, target), text);
		return {
			directory,
			snapshot: {
				skills: resolvedSkills.map((skill) => ({
					name: skill.name,
					skillKey: skill.name
				})),
				resolvedSkills,
				discoverySkills: resolvedSkills.filter((skill) => !skill.disableModelInvocation),
				prompt: formatSkillsForPromptBounded({
					skills: resolvedSkills.filter((skill) => !skill.disableModelInvocation),
					preserveOrder: true
				})
			},
			rewriteReferences: (text) => {
				let cursor = Math.max(0, text.indexOf("<available_skills>\n"));
				const parts = [rewritePaths(text.slice(0, cursor))];
				for (const { name, location } of parseSkillsPromptCatalog(text)) {
					const nameStart = text.indexOf(`<name>${escapeSkillXml(name)}</name>`, cursor);
					const tag = `<location>${escapeSkillXml(location)}</location>`;
					const start = nameStart < 0 ? -1 : text.indexOf(tag, nameStart);
					if (start < 0) continue;
					const named = pathMappings.filter((mapping) => mapping[2] === name);
					const exact = named.filter(([source]) => source === location);
					const candidates = exact.length ? exact : location.startsWith("~/") ? named : [];
					const targets = [...new Set(candidates.map(([, target]) => target))];
					const target = targets.length === 1 ? targets[0] : location;
					parts.push(rewritePaths(text.slice(cursor, start)), `<location>${escapeSkillXml(target)}</location>`);
					cursor = start + tag.length;
				}
				parts.push(rewritePaths(text.slice(cursor)));
				return parts.join("");
			},
			cleanup
		};
	} catch (error) {
		await cleanup();
		throw error;
	}
}
//#endregion
export { resolveExplicitSkillResource as i, prepareSkillResourceDelivery as n, readSkillResourceFiles as r, materializeSkillResources as t };
