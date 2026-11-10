import fs from "node:fs";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
import { createHash } from "node:crypto";
import { hasNodeErrorCode as hasErrnoCode } from "@openclaw/fs-safe/path";
//#region src/infra/runtime-process-manifest.ts
function createRuntimeProcessEntrypoints(currentModuleUrl) {
	function runtimeProcessEntrypoint(modulePath) {
		return {
			currentModuleUrl,
			sourceWorkerName: modulePath.startsWith("infra/") ? modulePath.slice(6) : `../${modulePath}`,
			distWorkerPath: `${modulePath}.js`
		};
	}
	return {
		sqliteHeaderProbe: runtimeProcessEntrypoint("infra/sqlite-header-probe.worker"),
		postgresBridge: runtimeProcessEntrypoint("infra/postgres-sync/bridge.worker"),
		secretEgressProxy: runtimeProcessEntrypoint("secrets/egress-proxy/proxy.worker"),
		codeModeNode: runtimeProcessEntrypoint("agents/code-mode-node.worker"),
		cronReadOnly: runtimeProcessEntrypoint("cron/store/read-only.worker"),
		stateRead: runtimeProcessEntrypoint("state/openclaw-state-read.worker"),
		workerNativeLifecycle: runtimeProcessEntrypoint("infra/worker-native-lifecycle.worker"),
		spawnBroker: runtimeProcessEntrypoint("process/spawn-broker/worker"),
		cronStreamMatcher: runtimeProcessEntrypoint("gateway/cron-stream-matcher.worker"),
		controlUiFile: runtimeProcessEntrypoint("gateway/control-ui-file.worker"),
		publicSessionCard: runtimeProcessEntrypoint("gateway/control-ui-public-session-card.worker"),
		nodeBootstrapArtifact: runtimeProcessEntrypoint("gateway/worker-environments/node-bootstrap-artifact.worker"),
		nativeHookRelayClient: runtimeProcessEntrypoint("agents/harness/native-hook-relay-client.worker"),
		computerHost: runtimeProcessEntrypoint("gateway/desktop/computer.worker"),
		imageProcessor: runtimeProcessEntrypoint("media/image-processor.worker"),
		fileToolPlanning: runtimeProcessEntrypoint("agents/sessions/tools/file-tool-planning.worker"),
		fileToolRead: runtimeProcessEntrypoint("agents/sessions/tools/read-file.worker"),
		attachmentProcessor: runtimeProcessEntrypoint("media/attachment-processor.worker"),
		gitOperations: runtimeProcessEntrypoint("infra/git-operation.worker"),
		gitPackCleanup: runtimeProcessEntrypoint("agents/worktrees/git-pack-cleanup.worker"),
		fsSafeCopy: runtimeProcessEntrypoint("infra/fs-safe-copy.worker"),
		sharedStateStore: runtimeProcessEntrypoint("state/openclaw-state.worker"),
		authProfileInlineUsage: runtimeProcessEntrypoint("agents/auth-profiles/inline-usage.worker"),
		pluginModelCatalogCredentials: runtimeProcessEntrypoint("agents/plugin-model-catalog.worker"),
		agentDatabaseExecution: runtimeProcessEntrypoint("state/openclaw-agent-execution.worker"),
		workspaceMemory: runtimeProcessEntrypoint("worker/memory-worker-entry"),
		localAgentAvatar: runtimeProcessEntrypoint("agents/identity-avatar-file.worker"),
		identityFile: runtimeProcessEntrypoint("agents/identity-file.worker"),
		workspaceSkills: runtimeProcessEntrypoint("worker/skills-worker-entry"),
		skillsDiscovery: runtimeProcessEntrypoint("skills/runtime/discovery.worker"),
		boardStore: runtimeProcessEntrypoint("boards/sqlite-board-store.worker"),
		progressCardStore: runtimeProcessEntrypoint("session-cards/progress-card-store.worker"),
		sessionSharingStore: runtimeProcessEntrypoint("config/sessions/session-sharing-store.worker"),
		sessionForkDomain: runtimeProcessEntrypoint("config/sessions/session-fork-domain.worker"),
		sessionGoalOperations: runtimeProcessEntrypoint("config/sessions/goals-operations.worker"),
		sessionLifecyclePlanningDomain: runtimeProcessEntrypoint("config/sessions/session-lifecycle-projection.worker"),
		sessionMessageRewriteDomain: runtimeProcessEntrypoint("config/sessions/session-message-rewrite.worker"),
		sessionDiskBudget: runtimeProcessEntrypoint("config/sessions/disk-budget.worker"),
		heartbeatOutcomeStore: runtimeProcessEntrypoint("infra/heartbeat-outcome-store.worker"),
		acpParentStreamStore: runtimeProcessEntrypoint("agents/subagents/spawn/acp-parent-stream-store.worker"),
		messageToolRunOutcomeStore: runtimeProcessEntrypoint("infra/message-tool-run-outcome-store.worker"),
		contextEngineTurnOutbox: runtimeProcessEntrypoint("agents/harness/context-engine-turn-outbox.worker"),
		sqliteStore: runtimeProcessEntrypoint("infra/sqlite-store.worker"),
		sqliteWriterAdmission: runtimeProcessEntrypoint("infra/sqlite-writer-admission.worker"),
		agentSchemaInspection: runtimeProcessEntrypoint("state/openclaw-agent-schema-inspection.worker"),
		stateMigrationSnapshot: runtimeProcessEntrypoint("infra/state-migrations.snapshot.worker"),
		githubExec: runtimeProcessEntrypoint("agents/github-exec-launcher"),
		sqliteReadOnly: runtimeProcessEntrypoint("infra/sqlite-readonly-location.worker"),
		sqliteSnapshotStaging: runtimeProcessEntrypoint("infra/sqlite-snapshot-staging.worker"),
		sqliteReadOnlyNativeResource: runtimeProcessEntrypoint("infra/sqlite-readonly-native-resource"),
		sqliteSourceRevision: runtimeProcessEntrypoint("infra/sqlite-source-revision.worker"),
		sqliteIntegrity: runtimeProcessEntrypoint("infra/sqlite-integrity.worker"),
		sqliteCloseProbe: runtimeProcessEntrypoint("infra/bun-sqlite-close-probe.worker"),
		preparedModelCatalog: runtimeProcessEntrypoint("agents/prepared-model-catalog.worker"),
		providerPromptState: runtimeProcessEntrypoint("agents/embedded-agent-runner/provider-prompt-state.worker"),
		updateRepair: runtimeProcessEntrypoint("infra/update-repair.worker"),
		immutableBuild: runtimeProcessEntrypoint("infra/update-immutable-build.worker"),
		updateMigratedFinalize: runtimeProcessEntrypoint("infra/update-migrated-finalize.worker"),
		updateCandidateState: runtimeProcessEntrypoint("infra/update-candidate-state.worker"),
		doctorLint: runtimeProcessEntrypoint("commands/doctor-lint.worker"),
		doctor: runtimeProcessEntrypoint("commands/doctor.worker"),
		databaseVerify: runtimeProcessEntrypoint("state/openclaw-database-verify.worker"),
		stateOwnership: runtimeProcessEntrypoint("state/openclaw-state-ownership.worker"),
		stateLeaseHeartbeat: runtimeProcessEntrypoint("state/openclaw-state-lease-heartbeat.worker"),
		gatewayStateOwnerHeartbeat: runtimeProcessEntrypoint("infra/gateway-state-owner-heartbeat.worker"),
		sessionTranscriptArchive: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-archive.worker"),
		sessionTranscript: runtimeProcessEntrypoint("config/sessions/session-transcript.worker"),
		workerTranscriptCommit: runtimeProcessEntrypoint("gateway/worker-environments/transcript-commit.worker"),
		sessionManagerMetadata: runtimeProcessEntrypoint("agents/sessions/session-manager-metadata.worker"),
		sessionTranscriptProjectionPublication: runtimeProcessEntrypoint("config/sessions/session-transcript-projection-publication.worker"),
		sessionTranscriptReports: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-transcript-reports.worker"),
		sessionTranscriptReconcile: runtimeProcessEntrypoint("config/sessions/session-transcript-reconcile.worker"),
		tailscaleRouteOwner: runtimeProcessEntrypoint("infra/tailscale-route-owner.worker"),
		serviceChildRelay: runtimeProcessEntrypoint("process/supervisor/service-child-relay"),
		terminalPty: runtimeProcessEntrypoint("process/terminal-pty-worker"),
		serviceChildGroupAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-group-anchor"),
		serviceChildWindowsJobAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-windows-job-anchor"),
		bunSqliteLibrary: runtimeProcessEntrypoint("infra/bun-sqlite-library")
	};
}
createRuntimeProcessEntrypoints(import.meta.url);
//#endregion
//#region src/infra/file-descriptor.ts
/** Strict field equality; callers own any platform-specific identity tolerance. */
function sameFileMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
/** Maps the borrowed-descriptor digest to OpenClaw's persisted artifact fields. */
function hashFileDescriptorSync(fd, maxBytes) {
	const { digest, bytes } = sha256FileSync(fd, { maxBytes });
	return {
		sha256: digest,
		sizeBytes: bytes
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-file.ts
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor, { bigint: true });
	const currentIdentity = fs.lstatSync(filePath, { bigint: true });
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const content = hashFileDescriptorSync(fileDescriptor);
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameFileMutationFingerprint(initialStat, finalStat)) {
			if (!sameFileStatFingerprint(initialStat, finalStat)) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
			assertExpectedContent(hashFileDescriptorSync(fileDescriptor), content, filePath);
		}
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return content;
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function canRetainDigest(stat, observedAtNs) {
	const cutoff = observedAtNs - 2000000000n;
	return typeof stat.dev === "bigint" && typeof stat.ino === "bigint" && typeof stat.size === "bigint" && stat.dev !== 0n && stat.ino !== 0n && typeof stat.birthtimeNs === "bigint" && typeof stat.mtimeNs === "bigint" && typeof stat.ctimeNs === "bigint" && stat.mtimeNs > 0n && stat.ctimeNs > 0n && stat.mtimeNs < cutoff && stat.ctimeNs < cutoff;
}
function timestampNs(nanoseconds, milliseconds) {
	return nanoseconds ?? (typeof milliseconds === "bigint" ? milliseconds * 1000000n : BigInt(Math.trunc(milliseconds * 1e6)));
}
function fingerprintFile(pathname, verified) {
	const observedAtNs = BigInt(Date.now()) * 1000000n;
	const fd = fs.openSync(pathname, "r");
	try {
		const before = fs.fstatSync(fd, { bigint: true });
		if (!before.isFile()) throw new Error("SQLite generation target must be a regular file");
		const previous = verified.get(pathname);
		if (previous && canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(previous, before)) {
			const after = fs.fstatSync(fd, { bigint: true });
			const current = fs.statSync(pathname, { bigint: true });
			if (current.isFile() && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) return previous;
		}
		const { sha256 } = hashPublishedFileSync(fs.realpathSync.native(pathname), before);
		const after = fs.fstatSync(fd, { bigint: true });
		const current = fs.statSync(pathname, { bigint: true });
		if (!sameFileStatFingerprint(before, after) || !sameFileStatFingerprint(after, current)) throw new Error(`SQLite generation target changed while hashing: ${pathname}`);
		const fingerprint = {
			birthtimeNs: timestampNs(after.birthtimeNs, after.birthtimeMs),
			ctimeNs: timestampNs(after.ctimeNs, after.ctimeMs),
			dev: after.dev,
			ino: after.ino,
			mtimeNs: timestampNs(after.mtimeNs, after.mtimeMs),
			sha256,
			size: after.size
		};
		if (canRetainDigest(before, observedAtNs) && sameFileMutationFingerprint(before, after) && sameFileMutationFingerprint(after, current)) verified.set(pathname, fingerprint);
		else verified.delete(pathname);
		return fingerprint;
	} finally {
		fs.closeSync(fd);
	}
}
function readOptionalFile(pathname, verified) {
	try {
		return fingerprintFile(pathname, verified);
	} catch (error) {
		if (error.code === "ENOENT") {
			verified.delete(pathname);
			return;
		}
		throw error;
	}
}
/** One observation owns its digests; every read still checks the complete family. */
function createSqliteFileGenerationReader() {
	const verified = /* @__PURE__ */ new Map();
	return (pathname) => {
		const database = fingerprintFile(pathname, verified);
		const journal = readOptionalFile(`${pathname}-journal`, verified);
		const wal = readOptionalFile(`${pathname}-wal`, verified);
		return {
			database,
			...journal ? { journal } : {},
			...wal ? { wal } : {}
		};
	};
}
/** Raw source reads require an isolated process or a drained database owner. */
function readStableSqliteFileGeneration(pathname, readGeneration = createSqliteFileGenerationReader()) {
	const first = readGeneration(pathname);
	const second = readGeneration(pathname);
	if (!sameSqliteFileGeneration(first, second)) throw new Error(`SQLite file generation changed while reading: ${pathname}`);
	return second;
}
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && sameFileStatFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal?.size === 0n ? void 0 : left.wal, right.wal?.size === 0n ? void 0 : right.wal);
}
function serializeFileFingerprint(fingerprint) {
	return {
		birthtimeNs: fingerprint.birthtimeNs.toString(),
		ctimeNs: fingerprint.ctimeNs.toString(),
		dev: fingerprint.dev.toString(),
		ino: fingerprint.ino.toString(),
		mtimeNs: fingerprint.mtimeNs.toString(),
		sha256: fingerprint.sha256,
		size: fingerprint.size.toString()
	};
}
function serializeSqliteFileGeneration(generation) {
	return JSON.stringify({
		database: serializeFileFingerprint(generation.database),
		...generation.journal ? { journal: serializeFileFingerprint(generation.journal) } : {},
		...generation.wal ? { wal: serializeFileFingerprint(generation.wal) } : {}
	});
}
//#endregion
//#region src/infra/sqlite-source-revision.ts
const suffixes = [
	"",
	"-wal",
	"-journal"
];
function stat(pathname) {
	try {
		const value = fs.statSync(pathname, { bigint: true });
		if (!value.isFile()) throw new Error(`SQLite source is not a regular file: ${pathname}`);
		return value;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function identity(value) {
	return value ? [
		value.dev,
		value.ino,
		value.size,
		value.mtimeNs,
		value.ctimeNs
	].join(":") : "missing";
}
/** A new full byte observation, not a timestamp cache or an admission decision.
* SHM is derived coordination data; committed rows depend on DB/WAL/journal bytes.
* Never call in a writer process: closing even a raw descriptor can release that
* process's SQLite POSIX locks. The snapshot owner selects child/drained execution.
*/
function readSqliteSourceContentVersionInProcess(pathname) {
	const canonical = fs.realpathSync.native(pathname);
	const before = suffixes.map((suffix) => stat(canonical + suffix));
	if (!before[0]) return;
	const hash = createHash("sha256").update(canonical);
	const buffer = Buffer.allocUnsafe(65536);
	for (const [index, suffix] of suffixes.entries()) {
		const expected = before[index];
		hash.update(`\0${suffix}\0${identity(expected)}\0`);
		if (!expected) continue;
		let descriptor;
		try {
			descriptor = fs.openSync(canonical + suffix, "r");
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		}
		try {
			if (identity(fs.fstatSync(descriptor, { bigint: true })) !== identity(expected)) return;
			let remaining = expected.size;
			while (remaining > 0n) {
				const length = Number(remaining > BigInt(buffer.length) ? BigInt(buffer.length) : remaining);
				const count = fs.readSync(descriptor, buffer, 0, length, null);
				if (count === 0) return;
				hash.update(buffer.subarray(0, count));
				remaining -= BigInt(count);
			}
			if (identity(fs.fstatSync(descriptor, { bigint: true })) !== identity(expected)) return;
		} finally {
			fs.closeSync(descriptor);
		}
	}
	if (fs.realpathSync.native(pathname) !== canonical || suffixes.some((suffix, index) => identity(stat(canonical + suffix)) !== identity(before[index]))) return;
	return hash.digest("hex");
}
//#endregion
//#region src/infra/sqlite-source-revision.worker.ts
if (process.argv[2] === "--openclaw-sqlite-readonly-child") {
	let result;
	try {
		const pathname = process.argv[4];
		const mode = process.argv[3];
		if (mode !== "content-version" && mode !== "file-generation" || !pathname) throw new Error("SQLite content observation requires its mode and source path");
		result = mode === "file-generation" ? {
			ok: true,
			generation: serializeSqliteFileGeneration(readStableSqliteFileGeneration(pathname))
		} : {
			ok: true,
			contentVersion: readSqliteSourceContentVersionInProcess(pathname) ?? ""
		};
	} catch (error) {
		process.exitCode = 1;
		result = {
			ok: false,
			message: error instanceof Error ? error.message : String(error)
		};
	}
	process.stdout.write(JSON.stringify(result));
}
//#endregion
export {};
