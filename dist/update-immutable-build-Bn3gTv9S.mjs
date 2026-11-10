import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as runStep } from "./update-runner-command-DETznIV7.mjs";
import { n as directoryIdentity } from "./update-immutable-layout-ADE3XUab.mjs";
import { t as isSystemdControlGroupEmpty } from "./systemd-cgroup-DYffSmkD.mjs";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/update-immutable-build.ts
const systemEnv = {
	PATH: "/usr/bin:/bin",
	LANG: "C.UTF-8"
};
const run = (argv, options) => runCommandWithTimeout(argv, {
	...options,
	baseEnv: {},
	env: systemEnv,
	killProcessTree: true
});
async function checked(argv, cwd) {
	const result = await run(argv, {
		cwd,
		timeoutMs: 6e4
	});
	if (result.code !== 0 || result.termination && result.termination !== "exit") throw new Error(`Immutable build admission failed: ${result.stderr.trim()}`);
	return result.stdout.trim();
}
const runtimeProbe = `
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const [root, bytes] = process.argv.slice(1);
const probe = fs.mkdtempSync(path.join(root, '.openclaw-update-space-'));
try {
  const file = path.join(probe, 'reserve');
  const fd = fs.openSync(file, 'wx', 0o600);
  try { fs.writeSync(fd, Buffer.alloc(4096)); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  const allocated = spawnSync('/usr/bin/fallocate', ['--length', bytes, file]);
  if (allocated.status !== 0) throw new Error('Runtime account has insufficient quota/headroom or preallocation is unavailable');
} finally { fs.rmSync(probe, {recursive:true}); }
`;
async function runImmutableBuild(params) {
	const { descriptor, stage, sha, timeoutMs, assertCurrent } = params;
	const build = descriptor.build;
	if (!build) throw new Error("Immutable build identity is not adopted; current remains running. Build isolation adoption is not enabled yet.");
	if (build.account === descriptor.service.account) throw new Error("Immutable build and runtime accounts must be separate.");
	await fs.access("/sys/fs/cgroup/cgroup.controllers");
	for (const file of [
		stage,
		build.toolchainPath,
		descriptor.service.stateDir,
		descriptor.service.configPath
	]) if (/[\s%:$"'\\]/u.test(file)) throw new Error("Immutable build isolation requires paths without systemd expansion characters.");
	const id = async (flag, account) => checked([
		"/usr/bin/id",
		flag,
		account
	], stage);
	const uid = await id("-u", build.account);
	const gid = await id("-g", build.account);
	const groups = await id("-G", build.account);
	const runtimeUid = await id("-u", descriptor.service.account);
	if (uid !== String(build.uid) || gid !== String(build.gid) || groups !== gid || uid === runtimeUid || runtimeUid === "0") throw new Error("Immutable build identity changed or has supplementary/runtime privileges.");
	for (let parent = build.toolchainPath;; parent = path.dirname(parent)) {
		directoryIdentity(parent);
		if (parent === path.dirname(parent)) break;
	}
	const capacity = await fs.statfs(stage, { bigint: true });
	if (capacity.bavail * capacity.bsize < BigInt(build.resources.buildFreeBytes)) throw new Error("Insufficient immutable build headroom; current remains running.");
	assertCurrent();
	await checked([
		"/usr/sbin/runuser",
		"-u",
		descriptor.service.account,
		"--",
		"/usr/bin/env",
		"-i",
		"PATH=/usr/bin:/bin",
		descriptor.runtime.path,
		"-e",
		runtimeProbe,
		descriptor.service.stateDir,
		String(build.resources.runtimeFreeBytes)
	], stage);
	assertCurrent();
	await fs.chown(stage, build.uid, build.gid);
	for (const name of ["home", "tmp"]) {
		const dir = path.join(stage, name);
		await fs.mkdir(dir, { mode: 448 });
		await fs.chown(dir, build.uid, build.gid);
	}
	const unit = `openclaw-build-${randomUUID()}.service`;
	const controlGroup = `/system.slice/${unit}`;
	const worker = resolveRuntimeProcessEntrypointUrl("immutableBuild");
	const resolver = JSON.stringify((await fs.realpath("/etc/resolv.conf")).replaceAll("%", "%%"));
	const properties = [
		`User=${build.uid}`,
		`Group=${build.gid}`,
		"SupplementaryGroups=",
		"Slice=system.slice",
		"Delegate=no",
		"KillMode=control-group",
		"SendSIGKILL=yes",
		"TimeoutStopSec=60",
		"NoNewPrivileges=yes",
		"CapabilityBoundingSet=",
		"AmbientCapabilities=",
		"ProtectSystem=strict",
		"ProtectHome=read-only",
		"ProtectControlGroups=yes",
		"ProtectKernelTunables=yes",
		"ProtectKernelModules=yes",
		"RestrictNamespaces=yes",
		"RestrictSUIDSGID=yes",
		"PrivateDevices=yes",
		"Nice=10",
		"IOSchedulingClass=idle",
		"UMask=0077",
		`WorkingDirectory=${path.dirname(fileURLToPath(worker)).replaceAll("%", "%%")}`,
		"TemporaryFileSystem=/run:ro",
		`BindReadOnlyPaths=-/run/systemd/resolve ${resolver}`,
		`ReadWritePaths=${stage}`,
		`RuntimeMaxSec=${Math.ceil(timeoutMs * 12 / 1e3)}`,
		`InaccessiblePaths=-/root ${descriptor.service.stateDir} ${descriptor.service.configPath}`,
		`MemoryMax=${build.resources.memoryMaxBytes}`,
		`TasksMax=${build.resources.tasksMax}`
	];
	const settle = async () => {
		if ((await run([
			"/usr/bin/systemctl",
			"stop",
			unit
		], {
			cwd: stage,
			timeoutMs: 9e4
		})).code !== 0) {
			if (await checked([
				"/usr/bin/systemctl",
				"show",
				"--property=LoadState",
				"--value",
				unit
			], stage) !== "not-found") throw new CommandProcessCleanupError();
		}
		return isSystemdControlGroupEmpty(controlGroup);
	};
	let attempt;
	try {
		assertCurrent();
		attempt = { result: await runStep({
			name: "immutable-unprivileged-build",
			argv: [
				"/usr/bin/systemd-run",
				"--quiet",
				"--wait",
				"--pipe",
				"--collect",
				"--service-type=exec",
				`--unit=${unit}`,
				...properties.map((property) => `--property=${property}`),
				"--",
				"/usr/bin/env",
				"-i",
				`PATH=${build.toolchainPath}:/usr/bin:/bin`,
				"LANG=C.UTF-8",
				`HOME=${stage}/home`,
				`TMPDIR=${stage}/tmp`,
				"GIT_CONFIG_NOSYSTEM=1",
				"GIT_CONFIG_GLOBAL=/dev/null",
				"GIT_TERMINAL_PROMPT=0",
				descriptor.runtime.path,
				...resolveRuntimeWorkerArgv(worker, descriptor.runtime.path),
				stage,
				sha,
				String(timeoutMs),
				String(params.workTimeoutMs ?? 0)
			],
			cwd: stage,
			runCommand: run,
			results: params.steps,
			stepIndex: params.steps?.length ?? 0,
			totalSteps: 0
		}) };
	} catch (error) {
		attempt = { error };
	}
	try {
		if (!await settle()) throw new CommandProcessCleanupError();
	} catch (error) {
		throw new CommandProcessCleanupError({ cause: "error" in attempt ? new AggregateError([attempt.error, error]) : error });
	}
	if ("error" in attempt) throw attempt.error;
	assertCurrent();
	const { result } = attempt;
	if (result.exitCode !== 0 || result.termination && result.termination !== "exit") throw new Error(`Immutable build failed; current remains running. ${result.stderrTail ?? ""}`);
}
//#endregion
export { runImmutableBuild };
