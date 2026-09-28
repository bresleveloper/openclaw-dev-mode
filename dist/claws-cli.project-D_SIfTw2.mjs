import { t as assertExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { f as CLAW_OUTPUT_STABILITY, g as isCanonicalClawHubPackageName, i as MAX_MANAGED_FILE_BYTES, n as readClawManifestFile, v as portableClawPathKey } from "./reader-C5RYMxIl.mjs";
import { i as logClawExperimentalWarning, n as formatClawDiagnostics, o as buildClawAddPlan, r as logClawAgentConfiguration, t as emitClawFailure } from "./claws-cli-output-DM0l_o6H.mjs";
import { basename, dirname, isAbsolute, join, parse, relative, resolve, sep } from "node:path";
import { link, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, rmdir, stat, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import * as tar from "tar";
//#region src/claws/project.ts
const CLAW_PROJECT_RESULT_SCHEMA_VERSION = "openclaw.clawProject.v1";
const MAX_PACKAGE_JSON_BYTES = 262144;
const MAX_PROJECT_ENTRIES = 4096;
const AGENT_ID_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
var ClawProjectError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "ClawProjectError";
	}
};
function diagnostic(code, path, message) {
	return {
		level: "error",
		code,
		phase: "policy",
		path,
		message
	};
}
function defaultSlug(value) {
	return value.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^[^a-z]+/, "").replace(/-+$/g, "").slice(0, 64) || "my-claw";
}
function displayName(agentId) {
	return agentId.split(/[-_]+/).filter(Boolean).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
}
async function pathState(path) {
	const entry = await lstat(path).catch(() => void 0);
	if (!entry) return "missing";
	if (!entry.isDirectory()) return "occupied";
	return (await readdir(path)).length === 0 ? "empty-directory" : "occupied";
}
async function isFile(path) {
	return lstat(path).then((entry) => entry.isFile()).catch(() => false);
}
async function isConfinedManifestFile(root) {
	const manifestPath = resolve(root, "CLAW.md");
	const entry = await lstat(manifestPath).catch(() => void 0);
	if (entry?.isFile()) return true;
	if (!entry?.isSymbolicLink()) return false;
	const [rootReal, targetReal] = await Promise.all([realpath(root).catch(() => void 0), realpath(manifestPath).catch(() => void 0)]);
	if (!rootReal || !targetReal) return false;
	const targetRelative = relative(rootReal, targetReal);
	if (targetRelative === "" || targetRelative === ".." || targetRelative.startsWith(`..${sep}`) || isAbsolute(targetRelative) || isExcludedProjectSource(targetRelative)) return false;
	return lstat(targetReal).then((target) => target.isFile()).catch(() => false);
}
async function discoverClawProjectRoot(projectPath) {
	const input = resolve(projectPath);
	const inputStat = await lstat(input).catch(() => void 0);
	if (!inputStat) throw new ClawProjectError("project_not_found", `Could not resolve Claw project path ${JSON.stringify(input)}.`);
	let current = inputStat.isDirectory() ? input : dirname(input);
	const roots = [];
	const filesystemRoot = parse(current).root;
	while (true) {
		if (await isFile(resolve(current, "package.json")) && await isConfinedManifestFile(current)) roots.push(await realpath(current));
		if (current === filesystemRoot) break;
		current = dirname(current);
	}
	if (roots.length === 0) throw new ClawProjectError("project_not_found", `No Claw project containing package.json and CLAW.md was found from ${JSON.stringify(input)}.`);
	if (roots.length > 1) throw new ClawProjectError("ambiguous_project_root", `Multiple Claw project roots contain ${JSON.stringify(input)}: ${roots.join(", ")}.`);
	return roots[0];
}
function projectPathKey(value, caseInsensitive) {
	const normalized = value.normalize("NFC");
	return caseInsensitive ? normalized.toLowerCase() : normalized;
}
function isExcludedProjectSource(value) {
	return portableClawPathKey(value).split("/").some((segment) => segment === ".git" || segment === "node_modules");
}
async function isCaseInsensitiveProjectRoot(root) {
	const [canonical, folded] = await Promise.all([lstat(resolve(root, "CLAW.md")).catch(() => void 0), lstat(resolve(root, "claw.md")).catch(() => void 0)]);
	return Boolean(canonical && folded && canonical.dev === folded.dev && canonical.ino === folded.ino);
}
async function collectExcludedPaths(root, selectedPaths) {
	const excluded = [];
	const caseInsensitive = await isCaseInsensitiveProjectRoot(root);
	const selectedPathKeys = new Set([...selectedPaths].map((path) => projectPathKey(path, caseInsensitive)));
	let entryCount = 0;
	const visit = async (directory) => {
		const entries = await readdir(resolve(root, directory), { withFileTypes: true });
		for (const entry of entries) {
			entryCount += 1;
			if (entryCount > MAX_PROJECT_ENTRIES) throw new ClawProjectError("project_too_many_entries", `Claw projects may contain at most ${MAX_PROJECT_ENTRIES} entries outside excluded dependency and source-control trees.`);
			const path = directory ? `${directory}/${entry.name}` : entry.name;
			if (entry.isDirectory()) {
				if (entry.name === ".git" || entry.name === "node_modules") excluded.push(`${path}/`);
				else await visit(path);
			} else if (!selectedPathKeys.has(projectPathKey(path, caseInsensitive))) excluded.push(path);
		}
	};
	await visit("");
	return excluded.toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
}
async function createClawProject(projectPath, options = {}) {
	const root = resolve(projectPath);
	const initialState = await pathState(root);
	if (initialState === "occupied") throw new ClawProjectError("project_target_not_empty", `Claw project target ${JSON.stringify(root)} must be absent or empty.`);
	const agentId = options.agentId ?? defaultSlug(basename(root));
	if (!AGENT_ID_PATTERN.test(agentId)) throw new ClawProjectError("invalid_agent_id", `Agent id ${JSON.stringify(agentId)} must match ${AGENT_ID_PATTERN}.`);
	const name = options.name ?? agentId;
	if (!isCanonicalClawHubPackageName(name)) throw new ClawProjectError("invalid_package_name", `Package name ${JSON.stringify(name)} must be a canonical ClawHub package name.`);
	const packageJson = {
		name,
		version: "0.1.0",
		openclaw: { claw: "CLAW.md" }
	};
	const clawMarkdown = [
		"---",
		"schemaVersion: 1",
		"agent:",
		`  id: ${JSON.stringify(agentId)}`,
		`  name: ${JSON.stringify(displayName(agentId))}`,
		"---",
		`You are ${displayName(agentId)}, a purpose-built OpenClaw agent.`,
		""
	].join("\n");
	const packageJsonPath = resolve(root, "package.json");
	const clawMarkdownPath = resolve(root, "CLAW.md");
	const createdPaths = [];
	await mkdir(root, { recursive: true });
	try {
		await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, {
			encoding: "utf8",
			flag: "wx"
		});
		createdPaths.push(packageJsonPath);
		await writeFile(clawMarkdownPath, clawMarkdown, {
			encoding: "utf8",
			flag: "wx"
		});
		createdPaths.push(clawMarkdownPath);
	} catch (error) {
		await Promise.allSettled(createdPaths.map((path) => unlink(path)));
		if (initialState === "missing") await rmdir(root).catch(() => void 0);
		throw error;
	}
	return {
		root,
		packageJson,
		filesWritten: ["package.json", "CLAW.md"]
	};
}
async function validateClawProject(projectPath) {
	let root$1;
	try {
		root$1 = await discoverClawProjectRoot(projectPath);
	} catch (error) {
		return {
			ok: false,
			root: resolve(projectPath),
			diagnostics: [diagnostic(error instanceof ClawProjectError ? error.code : "project_discovery_failed", "$", coerceErrorMessage(error))]
		};
	}
	let packageValue;
	try {
		const read = await (await root(root$1)).read("package.json", {
			hardlinks: "reject",
			maxBytes: MAX_PACKAGE_JSON_BYTES,
			nonBlockingRead: true,
			symlinks: "reject"
		});
		packageValue = JSON.parse(read.buffer.toString("utf8"));
	} catch (error) {
		return {
			ok: false,
			root: root$1,
			diagnostics: [diagnostic("invalid_project_package", "package.json", `Could not read a safe project package.json: ${error.message}`)]
		};
	}
	const record = packageValue && typeof packageValue === "object" && !Array.isArray(packageValue) ? packageValue : void 0;
	const openclaw = record?.openclaw && typeof record.openclaw === "object" && !Array.isArray(record.openclaw) ? record.openclaw : void 0;
	const scripts = record?.scripts;
	const diagnostics = [];
	if (openclaw?.claw !== "CLAW.md") diagnostics.push(diagnostic("project_manifest_must_be_claw_markdown", "package.json.openclaw.claw", "A Claw project must set openclaw.claw to \"CLAW.md\"."));
	if (scripts !== void 0 && (typeof scripts !== "object" || scripts === null || Array.isArray(scripts) || Object.keys(scripts).length > 0)) diagnostics.push(diagnostic("project_scripts_forbidden", "package.json.scripts", "Claw projects cannot declare package scripts or lifecycle hooks."));
	if (diagnostics.length > 0) return {
		ok: false,
		root: root$1,
		diagnostics
	};
	const claw = await readClawManifestFile(root$1);
	if (!claw.ok) return {
		ok: false,
		root: root$1,
		diagnostics: claw.diagnostics
	};
	const excludedSource = [...claw.snapshot.openClawProfile ? [{
		path: claw.snapshot.openClawProfile.sourcePath,
		diagnosticPath: "$.metadata.openclaw.config"
	}] : [], ...claw.snapshot.workspaceSources.map((source) => ({
		path: source.sourcePath,
		diagnosticPath: "$.workspace"
	}))].find((source) => isExcludedProjectSource(source.path));
	if (excludedSource) return {
		ok: false,
		root: root$1,
		diagnostics: [diagnostic("project_excluded_source", excludedSource.diagnosticPath, `Selected project source ${JSON.stringify(excludedSource.path)} cannot come from .git or node_modules.`)]
	};
	const reservedPackageSource = claw.snapshot.workspaceSources.find((source) => source.sourcePath.normalize("NFC").toLowerCase() === "package.json");
	if (reservedPackageSource) return {
		ok: false,
		root: root$1,
		diagnostics: [diagnostic("project_invalid", "$.workspace.files", `Workspace source ${JSON.stringify(reservedPackageSource.sourcePath)} collides with generated package metadata.`)]
	};
	const selectedPathList = [
		"package.json",
		"CLAW.md",
		...claw.packageBootstrap ? ["BOOTSTRAP.md"] : [],
		...claw.snapshot.openClawProfile ? [claw.snapshot.openClawProfile.sourcePath] : [],
		...claw.snapshot.workspaceSources.map((source) => source.sourcePath)
	];
	const portableSelectedPaths = /* @__PURE__ */ new Map();
	for (const path of selectedPathList) {
		const key = portableClawPathKey(path);
		const existing = portableSelectedPaths.get(key);
		if (existing && existing !== path) return {
			ok: false,
			root: root$1,
			diagnostics: [diagnostic("project_path_collision", "$", `Selected project paths ${JSON.stringify(existing)} and ${JSON.stringify(path)} collide on portable filesystems.`)]
		};
		portableSelectedPaths.set(key, path);
	}
	const selectedPaths = new Set(selectedPathList);
	let excludedPaths;
	try {
		excludedPaths = await collectExcludedPaths(root$1, selectedPaths);
	} catch (error) {
		return {
			ok: false,
			root: root$1,
			diagnostics: [diagnostic(error instanceof ClawProjectError ? error.code : "project_enumeration_failed", "$", coerceErrorMessage(error))]
		};
	}
	return {
		ok: true,
		root: root$1,
		packageJson: {
			name: claw.source.name,
			version: claw.source.version,
			...typeof record?.type === "string" ? { type: record.type } : {},
			openclaw: { claw: "CLAW.md" }
		},
		claw,
		excludedPaths,
		diagnostics: claw.diagnostics
	};
}
//#endregion
//#region src/claws/project-build.ts
const CLAW_BUILD_RESULT_SCHEMA_VERSION = "openclaw.clawBuild.v1";
const ZLIB_FILTERED_STRATEGY = 1;
async function readSelectedProjectFile(projectRoot, path) {
	return (await (await root(projectRoot)).read(path, {
		hardlinks: "reject",
		maxBytes: MAX_MANAGED_FILE_BYTES,
		nonBlockingRead: true,
		symlinks: path === "CLAW.md" ? "follow-within-root" : "reject"
	})).buffer;
}
function assertValidatedBytes(path, bytes, expected) {
	const digest = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
	if (bytes.byteLength !== expected.byteLength || digest !== expected.digest) throw new ClawProjectError("project_changed_during_build", `Claw project input ${JSON.stringify(path)} changed after validation; retry the build from a stable snapshot.`);
}
async function extractBuiltClawArtifact(artifact) {
	const temporaryDirectory = await mkdtemp(join(tmpdir(), "openclaw-claw-artifact-"));
	try {
		await tar.x({
			cwd: temporaryDirectory,
			file: resolve(artifact),
			strict: true
		});
		const packageRoot = join(temporaryDirectory, "package");
		if (!(await lstat(packageRoot)).isDirectory()) throw new Error("artifact does not contain a package directory");
		return {
			temporaryDirectory,
			packageRoot,
			dispose: () => rm(temporaryDirectory, {
				recursive: true,
				force: true
			})
		};
	} catch (error) {
		await rm(temporaryDirectory, {
			recursive: true,
			force: true
		});
		throw new ClawProjectError("artifact_verification_failed", `Could not extract built Claw artifact: ${error.message}`);
	}
}
async function buildClawProject(projectPath, outputPath) {
	const project = await validateClawProject(projectPath);
	if (!project.ok) throw new ClawProjectError("project_invalid", project.diagnostics.map((item) => `${item.code}: ${item.message}`).join("\n"));
	const artifact = resolve(outputPath);
	if (!artifact.toLowerCase().endsWith(".tgz")) throw new ClawProjectError("invalid_artifact_path", "Claw build output must end in .tgz.");
	if (await lstat(artifact).catch(() => void 0)) throw new ClawProjectError("artifact_exists", `Refusing to overwrite existing artifact ${JSON.stringify(artifact)}.`);
	if (!(await stat(dirname(artifact)).catch(() => void 0))?.isDirectory()) throw new ClawProjectError("artifact_parent_missing", `Artifact parent directory ${JSON.stringify(dirname(artifact))} does not exist.`);
	const temporaryDirectory = await mkdtemp(join(dirname(artifact), ".openclaw-claw-build-"));
	const stagingRoot = join(temporaryDirectory, "staging");
	const temporaryArtifact = join(temporaryDirectory, "claw.tgz");
	try {
		await mkdir(stagingRoot, { mode: 493 });
		const staging = await root(stagingRoot, {
			mkdir: false,
			mode: 420,
			durable: false
		});
		const files = /* @__PURE__ */ new Map();
		files.set("package.json", `${JSON.stringify(project.packageJson, null, 2)}\n`);
		const clawMarkdown = await readSelectedProjectFile(project.root, "CLAW.md");
		assertValidatedBytes("CLAW.md", clawMarkdown, project.claw.snapshot.manifest);
		files.set("CLAW.md", clawMarkdown);
		if (project.claw.packageBootstrap) {
			const bootstrap = await readSelectedProjectFile(project.root, "BOOTSTRAP.md");
			assertValidatedBytes("BOOTSTRAP.md", bootstrap, project.claw.packageBootstrap);
			files.set("BOOTSTRAP.md", bootstrap);
		}
		if (project.claw.openClawProfile) {
			const profileSnapshot = project.claw.snapshot.openClawProfile;
			if (!profileSnapshot) throw new ClawProjectError("project_invalid", "Validated OpenClaw profile is missing its source snapshot.");
			const profile = await readSelectedProjectFile(project.root, profileSnapshot.sourcePath);
			assertValidatedBytes(profileSnapshot.sourcePath, profile, profileSnapshot);
			files.set(profileSnapshot.sourcePath, profile);
		}
		for (const source of project.claw.snapshot.workspaceSources) {
			const bytes = await readSelectedProjectFile(project.root, source.sourcePath);
			assertValidatedBytes(source.sourcePath, bytes, source);
			files.set(source.sourcePath, bytes);
		}
		const fileNames = [...files.keys()].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)));
		for (const fileName of fileNames) {
			await mkdir(join(stagingRoot, dirname(fileName)), {
				recursive: true,
				mode: 493
			});
			await staging.create(fileName, files.get(fileName));
		}
		const tarInputNames = fileNames.map((fileName) => fileName.startsWith("@") ? `./${fileName}` : fileName);
		await tar.c({
			cwd: stagingRoot,
			file: temporaryArtifact,
			gzip: {
				level: 9,
				portable: true,
				strategy: ZLIB_FILTERED_STRATEGY
			},
			mtime: /* @__PURE__ */ new Date(0),
			portable: true,
			prefix: "package"
		}, tarInputNames);
		const archiveEntries = [];
		await tar.t({
			file: temporaryArtifact,
			onentry: (entry) => archiveEntries.push({
				path: entry.path,
				type: entry.type
			})
		});
		const expectedEntries = fileNames.map((path) => ({
			path: `package/${path}`,
			type: "File"
		}));
		if (JSON.stringify(archiveEntries) !== JSON.stringify(expectedEntries)) throw new ClawProjectError("artifact_contents_mismatch", "Built artifact contents differ from the validated project selection.");
		const packed = await readFile(temporaryArtifact);
		const integrity = `sha256:${createHash("sha256").update(packed).digest("hex")}`;
		const extracted = await extractBuiltClawArtifact(temporaryArtifact);
		try {
			const reread = await readClawManifestFile(extracted.packageRoot);
			if (!reread.ok) throw new ClawProjectError("artifact_verification_failed", reread.diagnostics.map((item) => `${item.code}: ${item.message}`).join("\n"));
			if (reread.source.name !== project.packageJson.name || reread.source.version !== project.packageJson.version) throw new ClawProjectError("artifact_identity_mismatch", "Built artifact identity differs from the validated project.");
		} finally {
			await extracted.dispose();
		}
		try {
			await link(temporaryArtifact, artifact);
		} catch (error) {
			if (error.code === "EEXIST") throw new ClawProjectError("artifact_exists", `Refusing to overwrite existing artifact ${JSON.stringify(artifact)}.`);
			throw new ClawProjectError("artifact_atomic_publish_failed", `Could not atomically publish artifact ${JSON.stringify(artifact)}: ${error.message}`);
		}
		return {
			schemaVersion: CLAW_BUILD_RESULT_SCHEMA_VERSION,
			projectSchemaVersion: CLAW_PROJECT_RESULT_SCHEMA_VERSION,
			artifact,
			integrity,
			byteLength: packed.byteLength,
			files: fileNames,
			excludedPaths: project.excludedPaths,
			claw: {
				name: project.packageJson.name,
				version: project.packageJson.version
			}
		};
	} finally {
		await rm(temporaryDirectory, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region src/cli/claws-cli.project.ts
const CLAW_DEV_RESULT_SCHEMA_VERSION = "openclaw.clawDev.v1";
function reportProjectError(error, fallbackCode, schemaVersion, json, runtime) {
	const code = error instanceof ClawProjectError ? error.code : fallbackCode;
	const message = error instanceof Error ? error.message : String(error);
	emitClawFailure(runtime, json, message, {
		schemaVersion,
		stability: CLAW_OUTPUT_STABILITY,
		ok: false,
		error: {
			code,
			message
		}
	});
}
function logDevPlanSummary(plan, runtime) {
	runtime.log(`Agent: ${plan.agent.finalId}`);
	runtime.log(`Workspace: ${plan.agent.workspace}`);
	logClawAgentConfiguration(plan, runtime);
	runtime.log(`Actions: ${plan.summary.totalActions}`);
	runtime.log(`Capability escalations: ${plan.capabilityChanges.length}`);
	runtime.log(`Blocked actions: ${plan.summary.blockedActions}`);
}
async function prepareDev(projectPath, opts) {
	const temporaryDirectory = await mkdtemp(join(tmpdir(), "openclaw-claw-dev-"));
	try {
		const build = await buildClawProject(projectPath, join(temporaryDirectory, "claw.tgz"));
		const extracted = await extractBuiltClawArtifact(build.artifact);
		try {
			const result = await readClawManifestFile(extracted.packageRoot);
			if (!result.ok) throw new ClawProjectError("artifact_verification_failed", formatClawDiagnostics(result.diagnostics));
			const configSnapshot = await readConfigFileSnapshot({
				observe: false,
				skipPluginValidation: true
			});
			if (!configSnapshot.valid) throw new ClawProjectError("config_unavailable", "OpenClaw config is invalid; fix it before previewing a Claw project.");
			const config = configSnapshot.resolved;
			const existingMcpServers = normalizeConfiguredMcpServers(config.mcp?.servers);
			const existingAgentIds = listAgentIds(config);
			return {
				build,
				plan: await buildClawAddPlan({
					manifest: result.manifest,
					clawMarkdownBody: result.clawMarkdownBody,
					packageBootstrap: result.packageBootstrap,
					openClawProfile: result.openClawProfile,
					source: {
						...result.source,
						integrityKind: "artifact",
						integrity: build.integrity,
						byteLength: build.byteLength
					},
					diagnostics: result.diagnostics,
					context: {
						config,
						...opts.agentId ? { agentId: opts.agentId } : {},
						...opts.workspace ? { workspace: opts.workspace } : {},
						existingAgentIds,
						existingWorkspacePaths: existingAgentIds.map((agentId) => resolveAgentWorkspaceDir(config, agentId)),
						existingMcpServers,
						sourceReferenceRoot: `claw-artifact:${build.integrity}`
					}
				})
			};
		} finally {
			await extracted.dispose();
		}
	} finally {
		await rm(temporaryDirectory, {
			recursive: true,
			force: true
		});
	}
}
async function runClawsCreateCommand(projectPath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	try {
		const result = await createClawProject(projectPath, {
			...opts.name ? { name: opts.name } : {},
			...opts.agentId ? { agentId: opts.agentId } : {}
		});
		if (opts.json) {
			writeRuntimeJson(runtime, {
				schemaVersion: CLAW_PROJECT_RESULT_SCHEMA_VERSION,
				stability: CLAW_OUTPUT_STABILITY,
				ok: true,
				...result
			});
			return;
		}
		logClawExperimentalWarning(runtime);
		runtime.log(`Created Claw project: ${result.root}`);
		runtime.log(`Package: ${result.packageJson.name}@${result.packageJson.version}`);
	} catch (error) {
		reportProjectError(error, "project_create_failed", CLAW_PROJECT_RESULT_SCHEMA_VERSION, opts.json, runtime);
	}
}
async function runClawsValidateCommand(projectPath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	const result = await validateClawProject(projectPath);
	if (!result.ok) {
		emitClawFailure(runtime, opts.json, formatClawDiagnostics(result.diagnostics), {
			schemaVersion: CLAW_PROJECT_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			ok: false,
			root: result.root,
			diagnostics: result.diagnostics
		});
		return;
	}
	if (opts.json) {
		writeRuntimeJson(runtime, {
			schemaVersion: CLAW_PROJECT_RESULT_SCHEMA_VERSION,
			stability: CLAW_OUTPUT_STABILITY,
			ok: true,
			root: result.root,
			source: result.claw.source,
			manifest: result.claw.manifest,
			...result.claw.openClawProfile ? { openClawProfile: result.claw.openClawProfile } : {},
			excludedPaths: result.excludedPaths,
			diagnostics: result.diagnostics
		});
		return;
	}
	logClawExperimentalWarning(runtime);
	runtime.log(`Valid Claw project: ${result.root}`);
	runtime.log(`Package: ${result.packageJson.name}@${result.packageJson.version}`);
	for (const path of result.excludedPaths) runtime.log(`Excluded: ${path}`);
}
async function runClawsBuildCommand(projectPath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	try {
		const result = await buildClawProject(projectPath, opts.out);
		if (opts.json) {
			writeRuntimeJson(runtime, {
				...result,
				stability: CLAW_OUTPUT_STABILITY,
				ok: true
			});
			return;
		}
		logClawExperimentalWarning(runtime);
		runtime.log(`Built Claw: ${result.claw.name}@${result.claw.version}`);
		runtime.log(`Artifact: ${result.artifact}`);
		runtime.log(`Integrity: ${result.integrity}`);
		runtime.log(`Excluded project paths: ${result.excludedPaths.length}`);
	} catch (error) {
		reportProjectError(error, "project_build_failed", CLAW_BUILD_RESULT_SCHEMA_VERSION, opts.json, runtime);
	}
}
async function runClawsDevCommand(projectPath, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	let prepared;
	try {
		prepared = await prepareDev(projectPath, opts);
	} catch (error) {
		reportProjectError(error, "project_dev_failed", CLAW_DEV_RESULT_SCHEMA_VERSION, opts.json, runtime);
		return;
	}
	const { build, plan } = prepared;
	if (opts.json) writeRuntimeJson(runtime, {
		schemaVersion: CLAW_DEV_RESULT_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		offline: true,
		mutationAllowed: false,
		build: {
			integrity: build.integrity,
			byteLength: build.byteLength,
			files: build.files,
			excludedPaths: build.excludedPaths,
			claw: build.claw
		},
		plan
	});
	else {
		logClawExperimentalWarning(runtime);
		runtime.log(`Claw dev preview: ${build.claw.name}@${build.claw.version}`);
		runtime.log(`Artifact integrity: ${build.integrity}`);
		logDevPlanSummary(plan, runtime);
		if (plan.blockers.length > 0) runtime.error(formatClawDiagnostics(plan.blockers));
	}
	if (plan.blockers.length > 0) runtime.exit(1);
}
//#endregion
export { runClawsBuildCommand, runClawsCreateCommand, runClawsDevCommand, runClawsValidateCommand };
