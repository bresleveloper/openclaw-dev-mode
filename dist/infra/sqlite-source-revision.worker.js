import { createHash } from "node:crypto";
import fs from "node:fs";
import { hasNodeErrorCode as hasErrnoCode } from "@openclaw/fs-safe/path";
//#region src/infra/runtime-process-entrypoints.ts
function runtimeProcessEntrypoint(modulePath) {
	return {
		currentModuleUrl: import.meta.url,
		sourceWorkerName: modulePath.startsWith("infra/") ? modulePath.slice(6) : `../${modulePath}`,
		distWorkerPath: `${modulePath}.js`
	};
}
runtimeProcessEntrypoint("secrets/egress-proxy/proxy.worker"), runtimeProcessEntrypoint("agents/code-mode-node.worker"), runtimeProcessEntrypoint("cron/store/read-only.worker"), runtimeProcessEntrypoint("state/openclaw-state-read.worker"), runtimeProcessEntrypoint("infra/worker-native-lifecycle.worker"), runtimeProcessEntrypoint("process/spawn-broker/worker"), runtimeProcessEntrypoint("gateway/cron-stream-matcher.worker"), runtimeProcessEntrypoint("gateway/control-ui-file.worker"), runtimeProcessEntrypoint("gateway/worker-environments/node-bootstrap-artifact.worker"), runtimeProcessEntrypoint("agents/harness/native-hook-relay-client.worker"), runtimeProcessEntrypoint("gateway/desktop/computer.worker"), runtimeProcessEntrypoint("media/image-processor.worker"), runtimeProcessEntrypoint("agents/sessions/tools/file-tool-planning.worker"), runtimeProcessEntrypoint("media/attachment-processor.worker"), runtimeProcessEntrypoint("infra/git-operation.worker"), runtimeProcessEntrypoint("infra/fs-safe-copy.worker"), runtimeProcessEntrypoint("state/openclaw-state.worker"), runtimeProcessEntrypoint("agents/auth-profiles/inline-usage.worker"), runtimeProcessEntrypoint("agents/plugin-model-catalog.worker"), runtimeProcessEntrypoint("state/openclaw-agent-execution.worker"), runtimeProcessEntrypoint("worker/memory-worker-entry"), runtimeProcessEntrypoint("agents/identity-avatar-file.worker"), runtimeProcessEntrypoint("agents/identity-file.worker"), runtimeProcessEntrypoint("worker/skills-worker-entry"), runtimeProcessEntrypoint("boards/sqlite-board-store.worker"), runtimeProcessEntrypoint("session-cards/progress-card-store.worker"), runtimeProcessEntrypoint("config/sessions/session-sharing-store.worker"), runtimeProcessEntrypoint("infra/heartbeat-outcome-store.worker"), runtimeProcessEntrypoint("agents/subagents/spawn/acp-parent-stream-store.worker"), runtimeProcessEntrypoint("infra/message-tool-run-outcome-store.worker"), runtimeProcessEntrypoint("agents/harness/context-engine-turn-outbox.worker"), runtimeProcessEntrypoint("infra/sqlite-store.worker"), runtimeProcessEntrypoint("state/openclaw-agent-schema-inspection.worker"), runtimeProcessEntrypoint("infra/state-migrations.snapshot.worker"), runtimeProcessEntrypoint("agents/github-exec-launcher"), runtimeProcessEntrypoint("infra/sqlite-readonly-location.worker"), runtimeProcessEntrypoint("infra/sqlite-snapshot-staging.worker"), runtimeProcessEntrypoint("infra/sqlite-readonly-native-resource"), runtimeProcessEntrypoint("infra/sqlite-source-revision.worker"), runtimeProcessEntrypoint("infra/sqlite-integrity.worker"), runtimeProcessEntrypoint("infra/bun-sqlite-close-probe.worker"), runtimeProcessEntrypoint("agents/prepared-model-catalog.worker"), runtimeProcessEntrypoint("agents/embedded-agent-runner/provider-prompt-state.worker"), runtimeProcessEntrypoint("infra/update-repair.worker"), runtimeProcessEntrypoint("infra/update-migrated-finalize.worker"), runtimeProcessEntrypoint("infra/update-candidate-state.worker"), runtimeProcessEntrypoint("commands/doctor-lint.worker"), runtimeProcessEntrypoint("commands/doctor.worker"), runtimeProcessEntrypoint("state/openclaw-database-verify.worker"), runtimeProcessEntrypoint("state/openclaw-state-ownership.worker"), runtimeProcessEntrypoint("state/openclaw-state-lease-heartbeat.worker"), runtimeProcessEntrypoint("infra/gateway-state-owner-heartbeat.worker"), runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-archive.worker"), runtimeProcessEntrypoint("config/sessions/session-transcript.worker"), runtimeProcessEntrypoint("gateway/worker-environments/transcript-commit.worker"), runtimeProcessEntrypoint("agents/sessions/session-manager-metadata.worker"), runtimeProcessEntrypoint("config/sessions/session-transcript-projection-publication.worker"), runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-transcript-reports.worker"), runtimeProcessEntrypoint("config/sessions/session-transcript-reconcile.worker"), runtimeProcessEntrypoint("infra/tailscale-route-owner.worker"), runtimeProcessEntrypoint("process/supervisor/service-child-relay"), runtimeProcessEntrypoint("process/terminal-pty-worker"), runtimeProcessEntrypoint("process/supervisor/service-child-group-anchor"), runtimeProcessEntrypoint("process/supervisor/service-child-windows-job-anchor"), runtimeProcessEntrypoint("infra/bun-sqlite-library");
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
		if (process.argv[3] !== "content-version" || !pathname) throw new Error("SQLite content observation requires its mode and source path");
		result = {
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
