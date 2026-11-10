import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as openRootFileSync, r as isRootFileMissingFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import { s as isInternalIncludeWriteTarget } from "./includes-rygJQufe.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveIncludeWriteBoundary } from "./include-write-boundary-C8YkLUfy.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor/shared/include-migration-ownership.ts
function containsAuthoredInclude(value) {
	if (Array.isArray(value)) return value.some(containsAuthoredInclude);
	if (!isRecord(value)) return false;
	return Object.hasOwn(value, "$include") || Object.values(value).some(containsAuthoredInclude);
}
/** Classify whether Doctor can safely persist a migration at one resolved config path. */
function classifyConfigPathMigrationOwnership(params) {
	const owners = (params.snapshot.includeProvenance ?? []).filter((entry) => entry.path.length <= params.configPath.length && entry.path.every((segment, index) => segment === params.configPath[index]));
	if (owners.length === 0) return { kind: "direct" };
	const targetPaths = [...new Set(owners.flatMap((owner) => owner.targetPaths ?? (owner.targetPath ? [owner.targetPath] : [])))].toSorted();
	const boundary = resolveIncludeWriteBoundary({
		provenance: params.snapshot.includeProvenance,
		changed: {
			paths: [params.configPath],
			rootChanged: false
		}
	});
	if (boundary && isInternalIncludeWriteTarget({
		configPath: params.snapshot.path,
		includePath: boundary.includePath
	})) return {
		kind: "single-include",
		targetPath: boundary.includePath
	};
	return {
		kind: "manual",
		targetPaths
	};
}
function readOtelProtocol(config) {
	const root = isRecord(config) ? config : null;
	const diagnostics = isRecord(root?.diagnostics) ? root.diagnostics : null;
	return (isRecord(diagnostics?.otel) ? diagnostics.otel : null)?.protocol;
}
/** Classify ownership for the sole legacy migration that consults resolved config values. */
function classifyOtelGrpcMigrationOwnership(params) {
	if (readOtelProtocol(params.resolvedConfig) !== "grpc") return null;
	const ownership = classifyConfigPathMigrationOwnership({
		snapshot: params.snapshot,
		configPath: [
			"diagnostics",
			"otel",
			"protocol"
		]
	});
	if (ownership.kind !== "direct") return ownership;
	return readOtelProtocol(params.authoredConfig) === "grpc" ? ownership : { kind: "resolved-only" };
}
/** Read historical config evidence without following a backup outside its directory. */
function readDoctorConfigBackup(backupPath) {
	const opened = openRootFileSync({
		absolutePath: backupPath,
		rootPath: path.dirname(backupPath),
		boundaryLabel: "config backup directory"
	});
	if (!opened.ok) {
		if (isRootFileMissingFailure(opened)) return;
		throw new Error("Config backup could not be read safely");
	}
	try {
		return fs.readFileSync(opened.fd, "utf8");
	} finally {
		fs.closeSync(opened.fd);
	}
}
//#endregion
export { containsAuthoredInclude as n, readDoctorConfigBackup as r, classifyOtelGrpcMigrationOwnership as t };
