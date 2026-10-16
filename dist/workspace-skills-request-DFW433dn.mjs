import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as containsParentRefSegment } from "./policy-B2xaSft-.mjs";
import path from "node:path";
//#region extensions/file-transfer/src/shared/workspace-memory-request.ts
/** Paths whose existing file grants must admit a native Memory operation. */
function readWorkspaceMemoryRequest(value) {
	const params = asOptionalRecord(value);
	const workspaceDir = params?.workspaceDir;
	if (typeof workspaceDir !== "string" || !path.posix.isAbsolute(workspaceDir) || workspaceDir.includes("\0") || containsParentRefSegment(workspaceDir) || typeof params?.request !== "string" || typeof params.watch !== "boolean") throw new Error("Invalid node Memory request");
	const workspace = path.posix.resolve(workspaceDir);
	const request = asOptionalRecord(JSON.parse(params.request));
	if (!request) throw new Error("Memory request must be an object");
	const paths = [];
	const add = (input, kind = "read") => {
		if (typeof input !== "string" || !input || input.includes("\0")) throw new Error("Memory operation requires a file path");
		if (containsParentRefSegment(input)) throw new Error("Memory path contains parent segments");
		const resolved = path.posix.resolve(workspace, input);
		const relative = path.posix.relative(workspace, resolved);
		if (relative === ".." || relative.startsWith("../") || path.posix.isAbsolute(relative)) throw new Error("Memory path is outside the configured node workspace");
		paths.push({
			path: resolved,
			kind
		});
	};
	const extra = (values) => {
		if (values === void 0) return;
		if (!Array.isArray(values)) throw new Error("Invalid extra Memory paths");
		for (const entry of values) {
			const input = typeof entry === "string" ? entry : asOptionalRecord(entry)?.path;
			const trimmed = typeof input === "string" ? input.trim() : input;
			if (typeof trimmed === "string" && /^~(?:[/\\]|$)/u.test(trimmed)) throw new Error("Memory extra paths require an explicit workspace path");
			add(trimmed);
		}
	};
	if (params.watch) {
		add(workspace);
		extra(asOptionalRecord(request.settings)?.extraPaths);
	} else switch (request.operation) {
		case "list":
			add(workspace);
			extra(request.extraPaths);
			break;
		case "inspect":
		case "readForIndexing":
			add(request.filePath);
			break;
		case "read": {
			const read = asOptionalRecord(request.params);
			add(typeof read?.relPath === "string" ? read.relPath.trim() : read?.relPath);
			extra(read?.extraPaths);
			break;
		}
		case "multimodal":
			add(asOptionalRecord(request.entry)?.absPath);
			break;
		case "maintenance": {
			const args = Array.isArray(request.args) ? request.args : [];
			switch (request.method) {
				case "readFile":
				case "stat":
				case "listDirectory":
				case "readDreams":
					add(args[0]);
					break;
				case "mkdir":
				case "resolveWritePath":
				case "writeDreams":
				case "replaceReport":
				case "appendCorpus":
					add(args[0], "write");
					break;
				case "rename":
					add(args[0], "write");
					add(args[1], "write");
					break;
				case "commitContent":
					add(asOptionalRecord(args[0])?.filePath, "write");
					break;
				case "resolveDreamsPath":
					add(workspace);
					break;
				default: throw new Error("Unknown Memory maintenance operation");
			}
			break;
		}
		default: throw new Error("Unknown Memory file operation");
	}
	return {
		workspaceDir: workspace,
		request: params.request,
		watch: params.watch,
		paths
	};
}
//#endregion
//#region extensions/file-transfer/src/shared/workspace-skill-source.ts
/** Only task-created archives in this workspace may be consumed or retired. */
function skillSourceArchive(workspace, value) {
	if (typeof value !== "string" || path.posix.dirname(value) !== path.posix.join(workspace, ".openclaw/skill-installs") || !/^[a-f0-9-]{36}\.tgz$/.test(path.posix.basename(value))) throw new Error("Skill source archive is outside the workspace staging directory");
	return value;
}
//#endregion
//#region extensions/file-transfer/src/shared/workspace-skills-request.ts
/** Admission paths for the existing native Skills operations. */
function readWorkspaceSkillsRequest(input) {
	const params = asOptionalRecord(input);
	if (typeof params?.workspaceDir !== "string" || !path.posix.isAbsolute(params.workspaceDir) || params.workspaceDir.includes("\0") || containsParentRefSegment(params.workspaceDir) || typeof params.request !== "string") throw new Error("Invalid node Skills request");
	const workspaceDir = path.posix.resolve(params.workspaceDir);
	const request = asOptionalRecord(JSON.parse(params.request));
	if (!request) throw new Error("Skills request must be an object");
	const paths = [];
	const readPath = (value) => {
		if (typeof value !== "string" || !path.posix.isAbsolute(value) || value.includes("\0")) throw new Error("Skill operation requires an absolute path");
		if (containsParentRefSegment(value)) throw new Error("Skill path contains parent segments");
		return value;
	};
	const add = (value, kind = "read") => {
		paths.push({
			path: path.posix.resolve(readPath(value)),
			kind
		});
	};
	const addSkill = (value, kind) => {
		if (typeof value !== "string") throw new Error("Skill operation requires a target");
		const slug = path.posix.basename(value.trim());
		if (!slug || slug === "." || slug === ".." || slug.includes("\\") || slug.includes("\0")) throw new Error("Invalid Skill target");
		const target = path.posix.join(workspaceDir, "skills", slug);
		add(target, kind);
		for (const file of [
			"SKILL.md",
			".clawhub/origin.json",
			".clawdhub/origin.json",
			".openclaw/source-origin.json"
		]) add(path.posix.join(target, file), kind);
	};
	switch (params.operation) {
		case "discovery":
		case "watch": {
			const plan = asOptionalRecord(request.sourcePlan);
			if (plan?.workspaceDir !== workspaceDir || !Array.isArray(plan.roots) || !Array.isArray(plan.pluginSkillRoots)) throw new Error("Skill sources do not match the configured workspace");
			add(workspaceDir);
			for (const key of [
				"stateDir",
				"managedSkillsDir",
				"pluginSkillsDir",
				"bundledSkillsDir"
			]) if (plan[key]) add(plan[key]);
			for (const root of [...plan.roots, ...plan.pluginSkillRoots]) add(asOptionalRecord(root)?.dir);
			if (plan.allowSymlinkTargets !== void 0) {
				if (!Array.isArray(plan.allowSymlinkTargets)) throw new Error("Invalid Skill roots");
				for (const target of plan.allowSymlinkTargets) add(target);
			}
			if (request.executionWorkspaceDir) add(request.executionWorkspaceDir);
			break;
		}
		case "readInstructions":
			add(request.filePath);
			break;
		case "resolveResource": {
			const selectionPath = readPath(request.path);
			add(path.posix.join(path.posix.dirname(selectionPath), "SKILL.md"));
			break;
		}
		case "readResources":
			add(asOptionalRecord(request.skill)?.baseDir);
			break;
		case "applyRoot":
			add(skillSourceArchive(workspaceDir, request.sourceArchive), "write");
			if (typeof request.slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/i.test(request.slug)) throw new Error("Invalid Skill install slug");
			add(path.posix.join(workspaceDir, "skills"), "write");
			addSkill(request.slug, "write");
			break;
		case "removeSkill": {
			const plan = asOptionalRecord(request.plan);
			if (plan?.workspaceDir !== workspaceDir) throw new Error("Skill removal plan does not match the workspace");
			add(plan.targetDir, "write");
			addSkill(plan.slug, "write");
			add(path.posix.join(workspaceDir, "skills"), "write");
			for (const directory of [".clawhub", ".clawdhub"]) add(path.posix.join(workspaceDir, directory, "lock.json"), "write");
			break;
		}
		case "recordSource":
		case "clawhubRecordInstall":
		case "clawhubVerifyTarget":
		case "clawhubPreflight":
		case "clawhubReadLock":
		case "clawhubUpdateSlug":
		case "clawhubUpdateTarget":
		case "clawhubUpdateGuard":
		case "clawhubCheckInstall":
		case "clawhubReadFiles":
		case "clawhubPlanRemoval": {
			const writes = params.operation === "recordSource" || params.operation === "clawhubRecordInstall";
			const kind = writes ? "write" : "read";
			add(path.posix.join(workspaceDir, "skills"), kind);
			for (const directory of [".clawhub", ".clawdhub"]) add(path.posix.join(workspaceDir, directory, "lock.json"), kind);
			if (writes) {
				const slug = asOptionalRecord(request.origin)?.slug;
				if (typeof slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/i.test(slug)) throw new Error("Invalid Skill provenance slug");
				addSkill(slug, "write");
			}
			const reference = request.slug ?? request.requestedSlug ?? asOptionalRecord(request.requested)?.slug;
			if (reference !== void 0) addSkill(reference, kind);
			if (request.skillDir) {
				const skillDir = readPath(request.skillDir);
				if (path.posix.dirname(skillDir) !== path.posix.join(workspaceDir, "skills")) throw new Error("Skill target is outside the workspace");
				addSkill(path.posix.basename(skillDir), kind);
			}
			break;
		}
		case "installDependencies":
			add(path.posix.join(workspaceDir, "skills"), "write");
			break;
		default: throw new Error("Unknown node Skills operation");
	}
	if (params.watch !== (params.operation === "watch")) throw new Error("Invalid Skills subscription");
	return {
		workspaceDir,
		request: params.request,
		operation: params.operation,
		watch: params.operation === "watch",
		paths
	};
}
//#endregion
export { skillSourceArchive as n, readWorkspaceMemoryRequest as r, readWorkspaceSkillsRequest as t };
