import { t as assertExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { n as openExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-D1jWDzK3.mjs";
import { y as withConfigSourceLocks } from "./io.warnings-Dz_nq5SM.mjs";
import { n as isAvatarDataUrl } from "./avatar-policy-DiIdI6oM.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { c as withAgentDeletion } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { a as isPortableClawAvatar, l as digestClawBytes, u as digestClawValue } from "./schema-portability-DPQGHUzw.mjs";
import { a as validateAgentConfigKeys, i as resolveMigrationAgentSettings, n as inspectValueForSecret, o as withAuthoredAgentRoster, r as normalizeWorkspaceConfig, s as ClawMigrationError, t as containsPotentialSecret } from "./migrate-validation-DioFMXjJ.mjs";
import { t as CLAW_BOOTSTRAP_FILE_NAMES } from "./manifest-contract-DWbLdUlq.mjs";
import { a as MAX_MANAGED_WORKSPACE_BYTES, i as MAX_MANAGED_FILE_BYTES, n as readClawManifestFile } from "./reader-tis62fDs.mjs";
import { m as CLAW_OUTPUT_STABILITY } from "./mcp-BnPN-seu.mjs";
import { A as readClawSecondaryReferenceTables, h as readClawWorkspaceFiles, l as CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION, p as readAllClawWorkspaceFiles, w as readClawInstallRecords, x as persistClawMigrationOwnership } from "./package-remove-plan-DNWRSQqi.mjs";
import { t as readClawInstallRecordFromDatabase } from "./provenance-read.kernel-B_3aRsEz.mjs";
import { i as logClawExperimentalWarning, o as buildClawAddPlan, t as emitClawFailure } from "./claws-cli-output-DDj3a6z_.mjs";
import { a as portableOpenClawProfile, i as portableAgent } from "./export-C7IL0y4h.mjs";
import { dirname, relative, resolve, sep } from "node:path";
import { lstat, mkdir, mkdtemp, realpath, rm, rmdir, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { assertNoSymlinkParents } from "@openclaw/fs-safe/advanced";
import { stringify } from "yaml";
//#region src/claws/migrate-package.ts
function lstatMigrationPathIfExists(path) {
	return lstat(path).catch((error) => {
		if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") return;
		throw error;
	});
}
function packageIdentityDigest(files) {
	const hash = createHash("sha256");
	let byteLength = 0;
	for (const [path, content] of [...files.entries()].toSorted(([left], [right]) => left.localeCompare(right))) {
		const pathBytes = Buffer.from(path, "utf8");
		hash.update(`${pathBytes.byteLength}:${pathBytes.toString("utf8")}:${content.byteLength}:`);
		hash.update(content);
		byteLength += content.byteLength;
	}
	return {
		integrity: `sha256:${hash.digest("hex")}`,
		byteLength
	};
}
function generatedPackage(agentId, params) {
	const bootstrapFiles = {};
	const workspaceFiles = [];
	const packageFiles = /* @__PURE__ */ new Map();
	let body;
	for (const file of params.files) {
		if (file.name === "SOUL.md" && file.content.toString("utf8").trim().length > 0) {
			body = file.content;
			continue;
		}
		bootstrapFiles[file.name] = { source: `workspace/${file.name}` };
		packageFiles.set(`workspace/${file.name}`, file.content);
	}
	const agent = portableAgent(params.agent, params.avatar);
	const profile = portableOpenClawProfile(params.agent, []);
	const manifest = {
		schemaVersion: 1,
		agent,
		workspace: {
			bootstrapFiles,
			files: workspaceFiles
		},
		packages: [],
		mcpServers: {},
		cronJobs: []
	};
	const clawMarkdownFrontmatter = [
		"---",
		stringify(manifest).trimEnd(),
		"---",
		""
	].join("\n");
	packageFiles.set("CLAW.md", body ? Buffer.concat([Buffer.from(clawMarkdownFrontmatter, "utf8"), body]) : Buffer.from(`${clawMarkdownFrontmatter}\n`, "utf8"));
	packageFiles.set("package.json", Buffer.from(`${JSON.stringify({
		name: `openclaw-agent-${agentId}-local`,
		version: "1.0.0",
		type: "module",
		openclaw: { claw: "CLAW.md" }
	}, null, 2)}\n`, "utf8"));
	if (profile) packageFiles.set("profiles/openclaw.yml", Buffer.from(stringify(profile), "utf8"));
	return {
		manifest,
		profile,
		body,
		packageFiles
	};
}
async function createGeneratedPackage(root, packageFiles) {
	const parent = dirname(root);
	let existingAncestor = parent;
	while (!await lstatMigrationPathIfExists(existingAncestor)) {
		const next = dirname(existingAncestor);
		if (next === existingAncestor) throw new ClawMigrationError("package_parent_unavailable", `Could not find an existing parent for generated package ${JSON.stringify(root)}.`, "$.packageRoot");
		existingAncestor = next;
	}
	const ancestorInfo = await lstat(existingAncestor);
	if (!ancestorInfo.isDirectory() || ancestorInfo.isSymbolicLink()) throw new ClawMigrationError("package_parent_unsafe", `Generated package parent ${JSON.stringify(existingAncestor)} must be a real directory.`, "$.packageRoot");
	const realAncestor = await realpath(existingAncestor);
	await assertNoSymlinkParents({
		rootDir: realAncestor,
		targetPath: parent,
		allowMissing: true,
		messagePrefix: "Generated Claw package parent"
	});
	await mkdir(parent, { recursive: true });
	const parentInfo = await lstat(parent);
	const realParent = await realpath(parent);
	if (!parentInfo.isDirectory() || parentInfo.isSymbolicLink() || realParent !== parent) throw new ClawMigrationError("package_parent_unsafe", `Generated package parent ${JSON.stringify(parent)} changed or resolves through a symlink; inspect the state directory before retrying.`, "$.packageRoot");
	await assertNoSymlinkParents({
		rootDir: realParent,
		targetPath: root,
		allowMissing: true,
		messagePrefix: "Generated Claw package"
	});
	await mkdir(root, { recursive: false });
	try {
		for (const [path, content] of packageFiles) {
			const target = resolve(root, path);
			const child = relative(root, target);
			if (child === ".." || child.startsWith(`..${sep}`)) throw new Error("Generated package path escaped its destination.");
			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, content, { flag: "wx" });
		}
	} catch (error) {
		await removeGeneratedPackageIfUnchanged(root, packageFiles);
		throw error;
	}
}
async function removeGeneratedPackageIfUnchanged(root$2, packageFiles) {
	for (const [path, expected] of [...packageFiles.entries()].toReversed()) {
		const target = resolve(root$2, path);
		const info = await lstatMigrationPathIfExists(target);
		if (!info || !info.isFile() || info.isSymbolicLink() || info.nlink !== 1) continue;
		const actual = await root(dirname(target)).then((parent) => parent.read(target.slice(dirname(target).length + 1), {
			hardlinks: "reject",
			maxBytes: MAX_MANAGED_FILE_BYTES,
			symlinks: "reject"
		})).catch(() => void 0);
		if (actual && digestClawBytes(actual.buffer) === digestClawBytes(expected)) await unlink(target).catch(() => void 0);
	}
	for (const directory of [
		resolve(root$2, "profiles"),
		resolve(root$2, "workspace"),
		root$2
	]) await rmdir(directory).catch(() => void 0);
}
async function createPackagePreview(packageFiles) {
	const root = await mkdtemp(resolve(tmpdir(), "openclaw-claws-migrate-"));
	try {
		for (const [path, content] of packageFiles) {
			const target = resolve(root, path);
			await mkdir(dirname(target), { recursive: true });
			await writeFile(target, content, { flag: "wx" });
		}
		return root;
	} catch (error) {
		await rm(root, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
async function removePackagePreview(root) {
	await rm(root, {
		recursive: true,
		force: true
	});
}
//#endregion
//#region src/claws/migrate-safety.ts
function clawMigrationPathsOverlap(left, right) {
	const a = resolve(left);
	const b = resolve(right);
	return a === b || a.startsWith(`${b}${sep}`) || b.startsWith(`${a}${sep}`);
}
function assertPackageDestinationOutsideWorkspaces(params) {
	if (clawMigrationPathsOverlap(params.packageRoot, params.workspace)) throw new ClawMigrationError("package_destination_overlaps_workspace", `Generated package destination ${JSON.stringify(params.packageRoot)} overlaps the existing workspace ${JSON.stringify(params.workspace)}. Choose a workspace outside the local Claw package directory before migrating.`, "$.packageRoot");
	for (const other of params.configuredAgents) {
		if (other.id === params.agentId) continue;
		const otherWorkspace = resolveIdentityPathViaExistingAncestorSync(resolveAgentWorkspaceDir(params.config, other.id, params.env));
		if (clawMigrationPathsOverlap(params.packageRoot, otherWorkspace)) throw new ClawMigrationError("package_destination_owned_by_agent", `Generated package destination ${JSON.stringify(params.packageRoot)} overlaps agent ${JSON.stringify(other.id)} workspace ${JSON.stringify(otherWorkspace)}. Move that workspace before migrating.`, "$.packageRoot");
	}
	const installOverlap = params.installs.find((record) => record.agentId !== params.agentId && clawMigrationPathsOverlap(params.packageRoot, resolveIdentityPathViaExistingAncestorSync(record.workspace)));
	if (installOverlap) throw new ClawMigrationError("package_destination_owned_by_claw", `Generated package destination ${JSON.stringify(params.packageRoot)} overlaps Claw agent ${JSON.stringify(installOverlap.agentId)} workspace ${JSON.stringify(installOverlap.workspace)}. Move that workspace before migrating.`, "$.packageRoot");
}
async function assertWorkspaceSnapshotUnchanged(workspace, expectedFiles, readCurrentFiles) {
	const currentFiles = await readCurrentFiles(workspace);
	const expected = new Map(expectedFiles.map((file) => [file.path, file.contentDigest]));
	const changed = currentFiles.find((file) => expected.get(file.name) !== file.digest);
	const missing = expectedFiles.find((file) => !currentFiles.some((current) => current.name === file.path));
	if (changed || missing || currentFiles.length !== expectedFiles.length) {
		const name = changed?.name ?? missing?.path ?? "selected prompt files";
		throw new ClawMigrationError("workspace_file_changed_after_consent", `Existing workspace file ${JSON.stringify(name)} changed after consent. Rerun migrate to review the current workspace.`, `$.workspace.${name}`);
	}
}
//#endregion
//#region src/claws/migrate-workspace-files.ts
const PROMPT_FILE_NAMES = [...CLAW_BOOTSTRAP_FILE_NAMES];
async function readSelectedWorkspaceFiles(workspace) {
	const root$1 = await root(workspace, {
		hardlinks: "reject",
		maxBytes: MAX_MANAGED_FILE_BYTES,
		symlinks: "reject"
	});
	const captured = [];
	let totalBytes = 0;
	for (const name of PROMPT_FILE_NAMES) {
		const info = await lstatMigrationPathIfExists(resolve(workspace, name));
		if (!info) continue;
		if (!info.isFile() || info.isSymbolicLink() || info.nlink !== 1) throw new ClawMigrationError("workspace_file_unsafe", `${name} must be a regular, non-symlinked, non-hardlinked file.`, `$.workspace.${name}`);
		const read = await root$1.read(name, {
			hardlinks: "reject",
			maxBytes: MAX_MANAGED_FILE_BYTES,
			symlinks: "reject"
		});
		let text;
		try {
			text = new TextDecoder("utf-8", { fatal: true }).decode(read.buffer);
		} catch {
			throw new ClawMigrationError("workspace_file_encoding_unsupported", `${name} is not valid UTF-8 text and cannot be represented as an agent prompt file.`, `$.workspace.${name}`);
		}
		if (containsPotentialSecret(text)) throw new ClawMigrationError("workspace_file_secret_detected", `Potential secret material was found in ${name}. Remove it or leave this file unmanaged; the matching text was not displayed.`, `$.workspace.${name}`);
		totalBytes += read.buffer.byteLength;
		if (totalBytes > 4194304) throw new ClawMigrationError("workspace_files_too_large", `Selected prompt files exceed the ${MAX_MANAGED_WORKSPACE_BYTES}-byte Claw workspace limit.`, "$.workspace");
		captured.push({
			name,
			content: read.buffer,
			digest: digestClawBytes(read.buffer)
		});
	}
	return captured;
}
//#endregion
//#region src/claws/migrate.ts
const CLAW_MIGRATION_PLAN_SCHEMA_VERSION = "openclaw.clawMigrationPlan.v1";
const CLAW_MIGRATION_RESULT_SCHEMA_VERSION = "openclaw.clawMigrationResult.v1";
const AGENT_ID_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const MIGRATION_RETAINED_PATHS = [
	"BOOTSTRAP.md (one-time workspace seed)",
	"credentials and auth state",
	"session indexes and transcripts",
	"agent databases and runtime state",
	"all other workspace files and directories"
];
async function readOwnership(options, agentId) {
	const database = await openExistingOpenClawStateDatabaseReadOnly(options);
	if (!database) return {
		install: void 0,
		workspaceFiles: [],
		installs: [],
		allWorkspaceFiles: [],
		secondaryReferences: []
	};
	try {
		const db = database.db;
		const readOptions = {
			...options,
			database,
			readOnly: true
		};
		const hasInstallTable = tableExists(db, "claw_installs");
		const hasWorkspaceFileTable = tableExists(db, "claw_workspace_files");
		return {
			install: hasInstallTable ? readClawInstallRecordFromDatabase(db, agentId) : void 0,
			workspaceFiles: hasWorkspaceFileTable ? readClawWorkspaceFiles(agentId, readOptions) : [],
			installs: hasInstallTable ? readClawInstallRecords(readOptions) : [],
			allWorkspaceFiles: hasWorkspaceFileTable ? readAllClawWorkspaceFiles(readOptions) : [],
			secondaryReferences: readClawSecondaryReferenceTables(db, agentId)
		};
	} finally {
		database.walMaintenance.close();
	}
}
async function canonicalExistingWorkspace(path) {
	const absolute = resolve(path);
	const stat = await lstat(absolute).catch(() => void 0);
	if (!stat || !stat.isDirectory() || stat.isSymbolicLink()) throw new ClawMigrationError("workspace_unavailable", `Workspace ${JSON.stringify(absolute)} must already exist as a local directory and cannot be a symlink.`, "$.workspace");
	return await realpath(absolute);
}
function sanitizeAgentPreview(agent) {
	const avatar = agent.identity?.avatar;
	if (!avatar?.startsWith("data:image/")) return agent;
	return {
		...agent,
		identity: {
			...agent.identity,
			avatar: `image data URL (${Buffer.byteLength(avatar, "utf8")} bytes; ${digestClawBytes(Buffer.from(avatar))})`
		}
	};
}
function buildPlanIntegrity(addPlan, packageFiles) {
	return digestClawValue({
		schemaVersion: CLAW_MIGRATION_PLAN_SCHEMA_VERSION,
		addPlan,
		packageFiles: [...packageFiles.entries()].map(([path, content]) => ({
			path,
			digest: digestClawBytes(content),
			byteLength: content.byteLength
		})).toSorted((left, right) => left.path.localeCompare(right.path)),
		retained: MIGRATION_RETAINED_PATHS
	});
}
function adoptMigrationActions(plan) {
	plan.actions = plan.actions.map((action) => {
		if (action.kind !== "workspaceFile" && action.kind !== "agent" && action.kind !== "workspace") return action;
		return {
			...action,
			action: "reuse",
			details: {
				...action.details,
				expectedState: action.kind === "workspaceFile" ? "present-matching" : "present"
			}
		};
	});
}
async function buildClawMigrationPlan(params) {
	const options = params.options ?? {};
	const agentId = params.agentId;
	if (!AGENT_ID_PATTERN.test(agentId)) throw new ClawMigrationError("invalid_agent_id", `Agent id ${JSON.stringify(agentId)} is not a valid Claw agent id.`, "$.agent.id");
	const agents = listAgentEntries(params.config).filter((entry) => entry.id === agentId);
	if (agents.length !== 1) throw new ClawMigrationError(agents.length === 0 ? "agent_not_found" : "agent_ambiguous", agents.length === 0 ? `No configured local agent matches ${JSON.stringify(agentId)}.` : `More than one configured agent resolves to ${JSON.stringify(agentId)}; resolve the duplicate ownership before migrating.`, "$.agent.id");
	const agent = agents[0];
	validateAgentConfigKeys(agent);
	const migrationAgent = resolveMigrationAgentSettings(params.config, agent);
	const ownership = await readOwnership(options, agentId);
	if (ownership.install) throw new ClawMigrationError("agent_already_managed", `Agent ${JSON.stringify(agentId)} already has Claw ownership. Use claws status/update/remove instead of migrating it again.`);
	if (ownership.secondaryReferences.length > 0) throw new ClawMigrationError("secondary_resources_unclaimed", `Agent ${JSON.stringify(agentId)} has unclaimed Claw resource references in ${ownership.secondaryReferences.join(", ")}. Reconcile those resources before migrating.`, "$.agent.id");
	if (ownership.workspaceFiles.length > 0) throw new ClawMigrationError("workspace_ownership_unclaimed", `Agent ${JSON.stringify(agentId)} has Claw workspace-file ownership records without an install record. Reconcile those records before migrating.`, "$.workspace");
	const workspace = await canonicalExistingWorkspace(resolveAgentWorkspaceDir(params.config, agentId, options.env));
	const packageRoot = resolveIdentityPathViaExistingAncestorSync(resolve(resolveStateDir(options.env), "claws", "local", agentId));
	if (await lstatMigrationPathIfExists(packageRoot)) throw new ClawMigrationError("package_destination_exists", `Local Claw package destination ${JSON.stringify(packageRoot)} already exists. Move or inspect it before migrating.`, "$.packageRoot");
	const configuredAgents = listAgentEntries(params.config);
	assertPackageDestinationOutsideWorkspaces({
		agentId,
		packageRoot,
		workspace,
		configuredAgents,
		installs: ownership.installs,
		config: params.config,
		env: options.env
	});
	for (const other of configuredAgents) {
		if (other.id === agentId) continue;
		const otherWorkspace = resolveIdentityPathViaExistingAncestorSync(resolveAgentWorkspaceDir(params.config, other.id, options.env));
		if (clawMigrationPathsOverlap(workspace, otherWorkspace)) throw new ClawMigrationError("workspace_ownership_ambiguous", `Workspace ${JSON.stringify(workspace)} overlaps agent ${JSON.stringify(other.id)} at ${JSON.stringify(otherWorkspace)}. Resolve workspace ownership before migrating.`, "$.workspace");
	}
	const installOverlap = ownership.installs.find((record) => record.agentId !== agentId && clawMigrationPathsOverlap(workspace, resolveIdentityPathViaExistingAncestorSync(record.workspace)));
	if (installOverlap) throw new ClawMigrationError("workspace_owned_by_claw", `Workspace ${JSON.stringify(workspace)} is already tracked by Claw agent ${JSON.stringify(installOverlap.agentId)}.`, "$.workspace");
	const selectedFiles = await readSelectedWorkspaceFiles(workspace);
	const selectedPaths = new Set(selectedFiles.map((file) => file.name));
	const conflictingFile = ownership.allWorkspaceFiles.find((file) => file.agentId !== agentId && resolveIdentityPathViaExistingAncestorSync(file.workspace) === workspace && selectedPaths.has(file.path));
	if (conflictingFile) throw new ClawMigrationError("workspace_file_already_owned", `${conflictingFile.path} is already tracked by Claw agent ${JSON.stringify(conflictingFile.agentId)}.`, `$.workspace.${conflictingFile.path}`);
	const avatar = agent.identity?.avatar?.trim();
	const projected = generatedPackage(agentId, {
		agent: migrationAgent,
		avatar: avatar && isAvatarDataUrl(avatar) && isPortableClawAvatar(avatar) ? avatar : void 0,
		files: selectedFiles
	});
	if (inspectValueForSecret({
		agent: projected.manifest.agent,
		profile: projected.profile
	})) throw new ClawMigrationError("agent_setting_secret_detected", "Potential secret material was found in a Claw v1 agent setting. The matching value was not displayed; remove it or keep the setting unmanaged.", "$.agent");
	const packagePreview = await createPackagePreview(projected.packageFiles);
	let loaded;
	try {
		const read = await readClawManifestFile(packagePreview);
		if (!read.ok) throw new ClawMigrationError("generated_package_invalid", read.diagnostics.map((diagnostic) => diagnostic.message).join("; "), read.diagnostics[0]?.path);
		loaded = read;
		const existingWorkspacePaths = configuredAgents.filter((entry) => entry.id !== agentId).map((entry) => resolveAgentWorkspaceDir(params.config, entry.id, options.env));
		const packageIdentity = packageIdentityDigest(projected.packageFiles);
		const source = {
			...loaded.source,
			integrity: packageIdentity.integrity,
			byteLength: packageIdentity.byteLength
		};
		const addPlan = await buildClawAddPlan({
			manifest: loaded.manifest,
			clawMarkdownBody: loaded.clawMarkdownBody,
			openClawProfile: loaded.openClawProfile,
			source,
			context: {
				config: params.config,
				agentId,
				workspace,
				existingAgentIds: configuredAgents.filter((entry) => entry.id !== agentId).map((entry) => entry.id),
				existingWorkspacePaths,
				resumableWorkspace: workspace,
				sourceReferenceRoot: packageRoot
			}
		});
		if (addPlan.blockers.length > 0) {
			const first = addPlan.blockers[0];
			throw new ClawMigrationError(first.code, first.message, first.path);
		}
		const comparablePlanAgent = normalizeWorkspaceConfig(migrationAgent, workspace);
		if (digestClawValue(comparablePlanAgent) !== digestClawValue(addPlan.agent.config)) throw new ClawMigrationError("agent_settings_not_faithful", "The generated Claw v1 manifest would not reproduce the configured agent settings exactly. Review unsupported fields and defaults before migrating.", "$.agent");
		for (const fileAction of addPlan.actions.filter((action) => action.kind === "workspaceFile")) {
			const name = fileAction.id;
			const captured = selectedFiles.find((file) => file.name === name);
			if (!captured || fileAction.digest !== captured.digest) throw new ClawMigrationError("workspace_file_projection_changed", `The Claw package would not preserve the exact bytes of ${JSON.stringify(name)}.`, `$.workspace.${name}`);
		}
		adoptMigrationActions(addPlan);
		const planIntegrity = buildPlanIntegrity(addPlan, projected.packageFiles);
		addPlan.planIntegrity = planIntegrity;
		const plan = {
			schemaVersion: CLAW_MIGRATION_PLAN_SCHEMA_VERSION,
			stability: "experimental",
			dryRun: true,
			mutationAllowed: false,
			agentId,
			workspace,
			packageRoot,
			packageName: source.name,
			agent: projected.manifest.agent,
			...projected.profile ? { openClawProfile: projected.profile } : {},
			generatedPackageFiles: [...projected.packageFiles.entries()].map(([path, content]) => ({
				path,
				byteLength: content.byteLength,
				digest: digestClawBytes(content)
			})).toSorted((left, right) => left.path.localeCompare(right.path)),
			workspaceFiles: selectedFiles.map(({ name, content, digest }) => ({
				path: resolve(workspace, name),
				byteLength: content.byteLength,
				digest
			})),
			retained: [...MIGRATION_RETAINED_PATHS],
			planIntegrity,
			blockers: []
		};
		const ownershipFiles = addPlan.actions.filter((action) => action.kind === "workspaceFile").map((action) => {
			const sourcePath = action.source ? relative(plan.packageRoot, action.source).replaceAll(sep, "/") : "";
			const path = relative(workspace, action.target).replaceAll(sep, "/");
			if (!sourcePath || path.startsWith("../") || sourcePath.startsWith("../")) throw new ClawMigrationError("migration_path_invalid", `Could not bind ${JSON.stringify(action.id)} to the generated local package.`, `$.workspace.${action.id}`);
			return {
				schemaVersion: CLAW_WORKSPACE_FILE_RECORD_SCHEMA_VERSION,
				agentId,
				workspace,
				path,
				sourcePath,
				contentDigest: action.digest,
				status: "complete",
				createdAtMs: 0,
				updatedAtMs: 0
			};
		});
		return {
			plan: {
				...plan,
				agent: sanitizeAgentPreview(plan.agent)
			},
			addPlan,
			manifest: loaded.manifest,
			...loaded.openClawProfile ? { profile: loaded.openClawProfile } : {},
			...loaded.clawMarkdownBody ? { clawMarkdownBody: loaded.clawMarkdownBody } : {},
			packageFiles: projected.packageFiles,
			ownershipFiles
		};
	} finally {
		await removePackagePreview(packagePreview);
	}
}
async function applyClawMigrationPlan(params) {
	const options = params.options ?? {};
	const root = params.migration.plan.packageRoot;
	const currentWorkspace = await canonicalExistingWorkspace(resolveAgentWorkspaceDir(params.config, params.migration.plan.agentId, options.env));
	if (currentWorkspace !== params.migration.plan.workspace) throw new ClawMigrationError("migration_changed", "The configured workspace changed after consent. Rerun migrate and review the new plan.");
	const currentOwnership = await readOwnership(options, params.migration.plan.agentId);
	if (currentOwnership.secondaryReferences.length > 0) throw new ClawMigrationError("secondary_resources_unclaimed", `Agent ${JSON.stringify(params.migration.plan.agentId)} now has unclaimed Claw resource references in ${currentOwnership.secondaryReferences.join(", ")}; rerun migrate after reconciling them.`, "$.agent.id");
	assertPackageDestinationOutsideWorkspaces({
		agentId: params.migration.plan.agentId,
		packageRoot: root,
		workspace: currentWorkspace,
		configuredAgents: listAgentEntries(params.config),
		installs: currentOwnership.installs,
		config: params.config,
		env: options.env
	});
	if (await lstatMigrationPathIfExists(root)) throw new ClawMigrationError("package_destination_exists", `Generated package destination ${JSON.stringify(root)} appeared after planning; rerun migrate to review a fresh plan.`, "$.packageRoot");
	await params.assertCurrentConfig?.();
	await createGeneratedPackage(root, params.migration.packageFiles);
	try {
		await assertWorkspaceSnapshotUnchanged(currentWorkspace, params.migration.ownershipFiles, readSelectedWorkspaceFiles);
		const read = await readClawManifestFile(root);
		if (!read.ok) throw new ClawMigrationError("generated_package_invalid", read.diagnostics.map((diagnostic) => diagnostic.message).join("; "));
		const identity = packageIdentityDigest(params.migration.packageFiles);
		const source = {
			...read.source,
			integrity: identity.integrity,
			byteLength: identity.byteLength
		};
		const finalPlan = await buildClawAddPlan({
			manifest: read.manifest,
			clawMarkdownBody: read.clawMarkdownBody,
			openClawProfile: read.openClawProfile,
			source,
			context: {
				config: params.config,
				agentId: params.migration.plan.agentId,
				workspace: params.migration.plan.workspace,
				existingAgentIds: listAgentEntries(params.config).filter((entry) => entry.id !== params.migration.plan.agentId).map((entry) => entry.id),
				existingWorkspacePaths: listAgentEntries(params.config).filter((entry) => entry.id !== params.migration.plan.agentId).map((entry) => resolveAgentWorkspaceDir(params.config, entry.id, options.env)),
				resumableWorkspace: params.migration.plan.workspace,
				sourceReferenceRoot: root
			}
		});
		for (const fileAction of finalPlan.actions.filter((action) => action.kind === "workspaceFile")) {
			const expected = params.migration.ownershipFiles.find((file) => file.path === fileAction.id);
			if (!expected || fileAction.digest !== expected.contentDigest) throw new ClawMigrationError("workspace_file_projection_changed", `The existing ${JSON.stringify(fileAction.id)} changed after consent. Rerun migrate to review the current file.`, `$.workspace.${fileAction.id}`);
		}
		adoptMigrationActions(finalPlan);
		const finalIntegrity = buildPlanIntegrity(finalPlan, params.migration.packageFiles);
		if (finalIntegrity !== params.migration.plan.planIntegrity) throw new ClawMigrationError("migration_changed", "The agent, workspace files, or local ownership changed after consent. The generated package was removed; rerun migrate and review the new plan.");
		finalPlan.claw = read.source;
		finalPlan.planIntegrity = finalIntegrity;
		await assertWorkspaceSnapshotUnchanged(currentWorkspace, params.migration.ownershipFiles, readSelectedWorkspaceFiles);
		const finalOwnershipFiles = params.migration.ownershipFiles.map((file) => ({
			...file,
			createdAtMs: Date.now(),
			updatedAtMs: Date.now()
		}));
		await params.assertCurrentConfig?.();
		persistClawMigrationOwnership(finalPlan, finalOwnershipFiles, options);
		return {
			schemaVersion: CLAW_MIGRATION_RESULT_SCHEMA_VERSION,
			stability: "experimental",
			dryRun: false,
			status: "complete",
			agentId: params.migration.plan.agentId,
			workspace: params.migration.plan.workspace,
			packageRoot: root,
			planIntegrity: finalIntegrity
		};
	} catch (error) {
		await removeGeneratedPackageIfUnchanged(root, params.migration.packageFiles);
		throw error;
	}
}
//#endregion
//#region src/cli/claws-migrate-cli.runtime.ts
async function readMigrationConfig() {
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		isolateEnv: true
	});
	if (!snapshot.exists || !snapshot.valid) throw new ClawMigrationError("migration_config_unavailable", "Migration requires an existing valid local configuration. Repair the config before retrying.");
	return {
		config: withAuthoredAgentRoster(snapshot.runtimeConfig, snapshot.sourceConfigBeforeMigrations),
		sources: [.../* @__PURE__ */ new Set([
			snapshot.path,
			await realpath(snapshot.path),
			...snapshot.includedPaths ?? []
		])].toSorted()
	};
}
function logMigrationPlan(plan, runtime) {
	logClawExperimentalWarning(runtime);
	runtime.log(`Existing agent: ${plan.agentId}`);
	runtime.log(`Workspace: ${plan.workspace}`);
	runtime.log(`Local Claw package: ${plan.packageRoot}`);
	runtime.log(`Portable identity: ${JSON.stringify(plan.agent)}`);
	if (plan.openClawProfile) runtime.log(`OpenClaw profile: ${JSON.stringify(plan.openClawProfile.agent)}`);
	runtime.log("Generated local Claw package files:");
	for (const file of plan.generatedPackageFiles) runtime.log(`  ${file.path} (${file.byteLength} bytes, ${file.digest})`);
	if (plan.workspaceFiles.length === 0) runtime.log("Existing prompt files becoming Claw-managed: none");
	else {
		runtime.log("Existing prompt files becoming Claw-managed (contents will not be rewritten):");
		for (const file of plan.workspaceFiles) runtime.log(`  ${file.path} (${file.byteLength} bytes, ${file.digest})`);
	}
	runtime.log("Retained outside Claw ownership:");
	for (const item of plan.retained) runtime.log(`  ${item}`);
	runtime.log(`Plan integrity: ${plan.planIntegrity}`);
}
function emitMigrationFailure(runtime, json, code, message, path = "$") {
	emitClawFailure(runtime, json, message, {
		schemaVersion: CLAW_MIGRATION_PLAN_SCHEMA_VERSION,
		stability: CLAW_OUTPUT_STABILITY,
		ok: false,
		mutationAllowed: false,
		error: {
			code,
			message
		},
		blockers: [{
			code,
			path,
			message
		}]
	});
}
async function runClawsMigrateCommand(agentId, opts, runtime = defaultRuntime) {
	assertExperimentalClawsEnabled();
	if (!opts.dryRun && opts.yes && !opts.planIntegrity) {
		emitMigrationFailure(runtime, opts.json, "plan_integrity_required", "Automated Claw migration requires --yes with --plan-integrity from the exact dry-run plan.");
		return;
	}
	if (!opts.dryRun && !opts.yes && opts.json) {
		emitMigrationFailure(runtime, true, "consent_required", "JSON migration requires --dry-run or --yes with --plan-integrity; interactive consent is available in human-readable mode.");
		return;
	}
	let migration;
	let previewConfig;
	try {
		previewConfig = await readMigrationConfig();
		migration = await buildClawMigrationPlan({
			agentId,
			config: previewConfig.config,
			options: { env: process.env }
		});
	} catch (error) {
		const code = error instanceof ClawMigrationError ? error.code : "migration_plan_failed";
		const message = error instanceof Error ? error.message : String(error);
		const path = error instanceof ClawMigrationError ? error.path : "$";
		emitMigrationFailure(runtime, opts.json, code, message, path);
		return;
	}
	if (opts.dryRun) {
		if (opts.json) writeRuntimeJson(runtime, migration.plan);
		else logMigrationPlan(migration.plan, runtime);
		return;
	}
	if (opts.yes && opts.planIntegrity !== migration.plan.planIntegrity) {
		emitMigrationFailure(runtime, opts.json, "plan_integrity_mismatch", "Consent does not match the current migration plan. Run claws migrate with --dry-run and use its exact plan-integrity value.");
		return;
	}
	if (!opts.yes) {
		logMigrationPlan(migration.plan, runtime);
		const { confirm, isCancel } = await import("@clack/prompts");
		const confirmed = await confirm({
			message: `Enroll existing agent ${JSON.stringify(agentId)} as a Claw?`,
			initialValue: false
		});
		if (isCancel(confirmed) || !confirmed) {
			runtime.log("Migration cancelled; no Claw ownership was recorded.");
			return;
		}
	}
	try {
		const result = await withAgentDeletion(agentId, async () => await withConfigSourceLocks(previewConfig.sources, async (assertCurrent) => {
			const changed = () => new ClawMigrationError("migration_changed", "The agent, workspace files, or ownership changed after consent. Review a fresh dry-run plan before retrying.");
			const latest = await readMigrationConfig();
			assertCurrent();
			if (digestClawValue(latest.sources) !== digestClawValue(previewConfig.sources)) throw changed();
			const current = await buildClawMigrationPlan({
				agentId,
				config: latest.config,
				options: { env: process.env }
			});
			if (current.plan.planIntegrity !== migration.plan.planIntegrity) throw changed();
			const expectedConfig = digestClawValue(latest);
			return await applyClawMigrationPlan({
				migration: current,
				config: latest.config,
				options: { env: process.env },
				assertCurrentConfig: async () => {
					assertCurrent();
					const live = await readMigrationConfig();
					assertCurrent();
					if (digestClawValue(live) !== expectedConfig) throw changed();
				}
			});
		}, process.env), { env: process.env });
		if (opts.json) {
			writeRuntimeJson(runtime, result);
			return;
		}
		logClawExperimentalWarning(runtime);
		runtime.log(`Migrated agent: ${result.agentId}`);
		runtime.log(`Workspace: ${result.workspace}`);
		runtime.log(`Local Claw package: ${result.packageRoot}`);
		runtime.log(`Plan integrity: ${result.planIntegrity}`);
	} catch (error) {
		const code = error instanceof ClawMigrationError ? error.code : "migration_failed";
		const message = error instanceof Error ? error.message : String(error);
		const path = error instanceof ClawMigrationError ? error.path : "$";
		emitMigrationFailure(runtime, opts.json, code, message, path);
	}
}
//#endregion
export { runClawsMigrateCommand };
