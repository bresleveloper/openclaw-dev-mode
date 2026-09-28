#!/usr/bin/env node
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as findCrabboxBinary } from "./crabbox-binary-BMI8aWfR.mjs";
import { t as ensureManagedCrabboxBinary } from "./cli-runtime-api-KjF1BE2v.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as resolvePathEnvKey, r as resolveWindowsCmdExePath } from "./windows-cmd-helpers-6q_bkE4I.mjs";
import { a as captureClaimNamespace, c as finalizeManagedChild, l as hasUnjoinedWork, n as discoverStaging, o as preserveCrabboxArtifacts, r as recoverDiscoveredStaging, s as captureSourceWitness, t as createStaging, u as loadManagedChildSpawner } from "./crabbox-staging-C6KWQQWP.mjs";
import { accessSync, chmodSync, closeSync, constants, existsSync, fstatSync, lstatSync, mkdirSync, mkdtempSync, openSync, readFileSync, readSync, readdirSync, readlinkSync, realpathSync, renameSync, rmSync, statSync, statfsSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { delimiter, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { homedir, tmpdir } from "node:os";
import { addAbortSignal } from "node:stream";
import { buffer } from "node:stream/consumers";
import { StringDecoder } from "node:string_decoder";
import { setImmediate } from "node:timers/promises";
import { isUtf8 } from "node:buffer";
import { createHash } from "node:crypto";
//#region scripts/crabbox-routing-policy.mts
const workloadAliases = /* @__PURE__ */ new Map([
	["check", "ci-fast"],
	["ci", "ci-fast"],
	["ci-fast", "ci-fast"],
	["ci-proof", "ci-proof"],
	["desktop", "desktop"],
	["interactive", "interactive"],
	["release", "release-proof"],
	["release-proof", "release-proof"],
	["untrusted", "untrusted"],
	["windows", "windows"]
]);
function normalizeCrabboxWorkload(value) {
	const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
	if (!normalized) return "";
	return workloadAliases.get(normalized) ?? null;
}
function crabboxProviderChain({ workload, configuredProvider, target, advertisedProviders }) {
	const providers = new Set(advertisedProviders);
	const normalizedConfigured = configuredProvider.trim();
	const normalizedTarget = target.trim().toLowerCase();
	if (normalizedTarget === "macos") return available(["aws"], providers);
	if (normalizedTarget === "windows" || workload === "windows") return available(["azure", "aws"], providers);
	const cloudFallback = ["azure", "aws"];
	switch (workload) {
		case "ci-fast": return available([
			"blacksmith-testbox",
			"daytona",
			...cloudFallback
		], providers);
		case "ci-proof":
		case "release-proof": return available([
			"blacksmith-testbox",
			"daytona",
			...cloudFallback
		], providers);
		case "interactive": return available(["daytona", ...cloudFallback], providers);
		case "desktop": return available(cloudFallback, providers);
		case "untrusted": return available(cloudFallback, providers);
		default: return available([normalizedConfigured], providers);
	}
}
function available(candidates, advertisedProviders) {
	return candidates.filter((provider) => provider && advertisedProviders.has(provider));
}
//#endregion
//#region scripts/crabbox-source-capsule.mts
const bundleFile = ".openclaw-crabbox-changed-gate.bundle";
const capsuleRef = "refs/openclaw/source-capsule";
const syncPlanSchema = object({
	candidate: object({ files: number().int().nonnegative() }),
	topFiles: array(object({ path: string().min(1) }))
});
function sourceGitEnvironment() {
	const env = {
		...process.env,
		GIT_OPTIONAL_LOCKS: "0"
	};
	for (const key of [
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_COMMON_DIR",
		"GIT_SHALLOW_FILE"
	]) delete env[key];
	return env;
}
function capsulePath(path) {
	if (path.split("/").some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git")) throw new Error("source capsule contains an invalid repository path");
	if (path.includes("\0") || path.includes("\\") || path === bundleFile) throw new Error("source capsule path conflicts with its transport metadata");
	return path;
}
function capsuleObjectId(value) {
	const id = value.trim();
	if (!/^[a-f0-9]{40}$/u.test(id)) throw new Error("source capsule requires a complete SHA-1 Git object identity");
	return id;
}
function sourceStat(root, path) {
	const parts = path.split("/");
	let current = root;
	for (const part of parts.slice(0, -1)) {
		current = join(current, part);
		const info = lstatSync(current, { throwIfNoEntry: false });
		if (!info) return { kind: "missing" };
		if (!info.isDirectory() || info.isSymbolicLink()) return { kind: "replaced" };
	}
	const stat = lstatSync(join(root, path), { throwIfNoEntry: false });
	return stat ? {
		kind: "present",
		stat
	} : { kind: "missing" };
}
function hasUnverifiedGitPreparation(directory, env, sourcePaths) {
	if (env.GIT_CONFIG || env.GIT_EXTERNAL_DIFF) return true;
	const probe = (args) => spawnSync("git", [
		"-C",
		directory,
		"config",
		...args
	], {
		env,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		timeout: 5e3,
		killSignal: "SIGKILL",
		maxBuffer: 65536
	});
	const callbacks = probe([
		"--null",
		"--name-only",
		"--get-regexp",
		"^(core\\.(fsmonitor|hookspath)|filter\\..*\\.(clean|smudge|process)|diff\\.(external|.*\\.(command|textconv)))$"
	]);
	if (!callbacks.error && callbacks.status === 1) return false;
	if (callbacks.error || callbacks.status !== 0 || !isUtf8(callbacks.stdout)) return true;
	const names = callbacks.stdout.toString("utf8").toLowerCase().split("\0").filter(Boolean);
	if (!names.length || names.some((name) => name !== "core.fsmonitor" && !name.startsWith("filter."))) return true;
	if (names.some((name) => /^filter\.(unset|unspecified)\./u.test(name))) return true;
	if (names.includes("core.fsmonitor")) {
		const monitor = probe([
			"--type=bool",
			"--get",
			"core.fsmonitor"
		]);
		if (monitor.error || monitor.status !== 0 || monitor.stdout.toString("utf8").trim() !== "false") return true;
	}
	if (!names.some((name) => name.startsWith("filter."))) return false;
	const paths = [...sourcePaths];
	const attributes = spawnSync("git", [
		"-C",
		directory,
		"check-attr",
		"-z",
		"--stdin",
		"filter"
	], {
		env,
		input: paths.length ? paths.join("\0") + "\0" : "",
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		timeout: 5e3,
		killSignal: "SIGKILL",
		maxBuffer: 67108864
	});
	if (attributes.error || attributes.status !== 0 || !isUtf8(attributes.stdout)) return true;
	const values = attributes.stdout.toString("utf8").split("\0");
	if (values.pop() !== "" || values.length !== paths.length * 3) return true;
	return paths.some((path, index) => values[index * 3] !== path || values[index * 3 + 1] !== "filter" || !["unspecified", "unset"].includes(values[index * 3 + 2]));
}
function prepareCrabboxSourceCapsule(options) {
	const repoRoot = realpathSync(options.repoRoot);
	const sourceEnv = sourceGitEnvironment();
	function git(cwd, args, env = sourceEnv, input) {
		let output;
		try {
			output = execFileSync("git", [
				"-C",
				cwd,
				...args
			], {
				env,
				input,
				maxBuffer: 67108864,
				stdio: [
					"pipe",
					"pipe",
					"pipe"
				]
			});
		} catch {
			throw new Error(`source capsule: git ${args[0]} failed; source was not uploaded`);
		}
		if (!isUtf8(output)) throw new Error("source capsule requires UTF-8 Git paths and metadata");
		return output.toString("utf8");
	}
	const sourceSha = capsuleObjectId(git(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	]));
	const baseSha = capsuleObjectId(git(repoRoot, [
		"rev-parse",
		"--verify",
		`${options.base}^{commit}`
	]));
	const trackedRecords = git(repoRoot, [
		"ls-files",
		"-v",
		"--stage",
		"-z"
	]);
	const tracked = /* @__PURE__ */ new Map();
	for (const record of trackedRecords.split("\0").filter(Boolean)) {
		const match = /^([A-Za-z]) (100644|100755|120000) ([a-f0-9]{40}) 0\t([\s\S]+)$/u.exec(record);
		if (!match || !match[1] || !match[2] || !match[3] || !match[4]) throw new Error("source capsule requires resolved regular-file or symlink index entries");
		tracked.set(capsulePath(match[4]), {
			mode: match[2],
			hash: match[3],
			sparse: match[1].toUpperCase() === "S"
		});
	}
	const owned = new Set(tracked.keys());
	for (const revision of /* @__PURE__ */ new Set([baseSha, sourceSha])) for (const path of git(repoRoot, [
		"ls-tree",
		"-r",
		"--name-only",
		"-z",
		revision
	]).split("\0").filter(Boolean)) owned.add(capsulePath(path));
	const eligiblePaths = git(repoRoot, [
		"ls-files",
		"--cached",
		"--others",
		"--exclude-standard",
		"-z"
	]).split("\0").filter(Boolean);
	const eligible = new Set(eligiblePaths.map(capsulePath));
	mkdirSync(options.syncRoot, { recursive: true });
	const staging = createStaging(options.syncRoot, repoRoot);
	const temporary = staging.payload;
	const directory = join(temporary, "source");
	const cleanup = () => staging.dispose();
	try {
		mkdirSync(directory);
		const privateEnv = {
			...sourceEnv,
			GIT_CONFIG_GLOBAL: "/dev/null",
			GIT_CONFIG_NOSYSTEM: "1",
			GIT_CONFIG_COUNT: "0",
			GIT_AUTHOR_NAME: "OpenClaw",
			GIT_AUTHOR_EMAIL: "ci@openclaw.local",
			GIT_COMMITTER_NAME: "OpenClaw",
			GIT_COMMITTER_EMAIL: "ci@openclaw.local"
		};
		delete privateEnv.GIT_CONFIG_PARAMETERS;
		git(directory, [
			"init",
			"--quiet",
			"--template="
		], privateEnv);
		const objectDir = git(repoRoot, [
			"rev-parse",
			"--path-format=absolute",
			"--git-path",
			"objects"
		]).trim();
		writeFileSync(join(directory, ".git", "objects", "info", "alternates"), `${objectDir}\n`);
		git(directory, [
			"update-ref",
			"--no-deref",
			"HEAD",
			sourceSha
		], privateEnv);
		git(directory, [
			"update-ref",
			"refs/heads/main",
			baseSha
		], privateEnv);
		const excludesFile = spawnSync("git", [
			"-C",
			repoRoot,
			"config",
			"--path",
			"--null",
			"--get",
			"core.excludesFile"
		], { env: sourceEnv });
		if (excludesFile.status === 0 && isUtf8(excludesFile.stdout)) {
			const path = excludesFile.stdout.toString("utf8").slice(0, -1);
			git(directory, [
				"config",
				"core.excludesFile",
				path ? resolve(repoRoot, path) : ""
			], privateEnv);
		} else if (excludesFile.status !== 1) throw new Error("source capsule could not resolve Git exclusion policy");
		git(directory, [
			"remote",
			"add",
			"origin",
			git(repoRoot, [
				"remote",
				"get-url",
				"origin"
			]).trim()
		], privateEnv);
		git(directory, [
			"update-index",
			"-z",
			"--index-info"
		], privateEnv, [...tracked].map(([path, entry]) => `${entry.mode} ${entry.hash}\t${path}\0`).join(""));
		const exclude = git(repoRoot, [
			"rev-parse",
			"--path-format=absolute",
			"--git-path",
			"info/exclude"
		]).trim();
		if (lstatSync(exclude, { throwIfNoEntry: false })) {
			const policy = realpathSync(exclude);
			if (!lstatSync(policy).isFile()) throw new Error("source capsule requires a regular Git info/exclude policy file");
			mkdirSync(join(directory, ".git", "info"), { recursive: true });
			const fd = openSync(policy, constants.O_RDONLY | constants.O_NOFOLLOW);
			try {
				writeFileSync(join(directory, ".git", "info", "exclude"), readFileSync(fd));
			} finally {
				closeSync(fd);
			}
		}
		const frozen = /* @__PURE__ */ new Map();
		const linkBlobs = join(temporary, "links");
		mkdirSync(linkBlobs);
		function writeFrozen(path, bytes, mode) {
			const destination = join(directory, path);
			let blobPath = destination;
			let operation = "mkdir";
			try {
				mkdirSync(dirname(destination), { recursive: true });
				if (mode === "120000") {
					operation = "symlink";
					symlinkSync(bytes, destination);
					blobPath = join(linkBlobs, String(frozen.size));
					operation = "write symlink blob";
					writeFileSync(blobPath, bytes);
				} else {
					operation = "write file";
					writeFileSync(destination, bytes);
					operation = "chmod";
					chmodSync(destination, mode === "100755" ? 493 : 420);
				}
			} catch (error) {
				const failure = error;
				const details = [failure?.code === void 0 ? void 0 : `code=${JSON.stringify(failure.code)}`, failure?.errno === void 0 ? void 0 : `errno=${JSON.stringify(failure.errno)}`].filter(Boolean).join(", ");
				throw new Error(`source capsule: ${operation} failed for ${JSON.stringify(path)}${details ? ` (${details})` : ""}; source was not uploaded`, { cause: error });
			}
			frozen.set(path, {
				mode,
				blobPath
			});
		}
		function copySource(path) {
			const entry = sourceStat(repoRoot, path);
			if (entry.kind !== "present" || entry.stat.isDirectory()) return entry.kind;
			const info = entry.stat;
			const source = join(repoRoot, path);
			if (info.isSymbolicLink()) {
				const bytes = readlinkSync(source, { encoding: "buffer" });
				const after = sourceStat(repoRoot, path);
				if (after.kind !== "present" || !after.stat.isSymbolicLink() || after.stat.ino !== info.ino || !readlinkSync(source, { encoding: "buffer" }).equals(bytes)) throw new Error(`symlink changed while freezing ${JSON.stringify(path)}; retry after edits finish`);
				writeFrozen(path, bytes, "120000");
				return "present";
			}
			if (!info.isFile()) throw new Error(`source capsule has an unsupported file kind at ${JSON.stringify(path)}`);
			const fd = openSync(source, constants.O_RDONLY | constants.O_NOFOLLOW);
			try {
				const opened = fstatSync(fd);
				const bytes = readFileSync(fd);
				const after = sourceStat(repoRoot, path);
				if (!opened.isFile() || after.kind !== "present" || opened.ino !== info.ino || opened.ino !== after.stat.ino || opened.mode !== info.mode || opened.mode !== after.stat.mode || opened.size !== after.stat.size || opened.mtimeMs !== after.stat.mtimeMs) throw new Error(`source changed while freezing ${JSON.stringify(path)}; retry after edits finish`);
				writeFrozen(path, bytes, (opened.mode & 64) !== 0 ? "100755" : "100644");
			} finally {
				closeSync(fd);
			}
			return "present";
		}
		const sparse = [];
		for (const path of [...eligible].toSorted()) {
			const kind = copySource(path);
			const entry = tracked.get(path);
			if (kind === "missing" && entry?.sparse) sparse.push({
				path,
				mode: entry.mode,
				hash: entry.hash
			});
		}
		if (sparse.length) {
			const stream = join(temporary, "sparse-blobs");
			const output = openSync(stream, "wx", 384);
			try {
				execFileSync("git", [
					"-C",
					repoRoot,
					"cat-file",
					"--batch"
				], {
					env: sourceEnv,
					input: sparse.map((entry) => entry.hash).join("\n") + "\n",
					stdio: [
						"pipe",
						output,
						"pipe"
					]
				});
			} catch {
				throw new Error("source capsule could not materialize missing sparse index blobs");
			} finally {
				closeSync(output);
			}
			const input = openSync(stream, "r");
			let offset = 0;
			try {
				for (const entry of sparse) {
					const headerBytes = Buffer.alloc(128);
					const headerSize = readSync(input, headerBytes, 0, headerBytes.length, offset);
					const newline = headerBytes.indexOf(10, 0);
					const header = headerBytes.subarray(0, newline).toString("ascii");
					const match = /^([a-f0-9]{40}) blob (\d+)$/u.exec(header);
					if (newline < 0 || newline >= headerSize || !match || match[1] !== entry.hash || !match[2]) throw new Error("source capsule received invalid sparse blob framing");
					const size = Number(match[2]);
					if (!Number.isSafeInteger(size)) throw new Error("source capsule sparse blob size is invalid");
					offset += newline + 1;
					const bytes = Buffer.alloc(size);
					for (let read = 0; read < size;) {
						const count = readSync(input, bytes, read, size - read, offset + read);
						if (!count) throw new Error("source capsule sparse blob was truncated");
						read += count;
					}
					offset += size;
					const separator = Buffer.alloc(1);
					if (readSync(input, separator, 0, 1, offset) !== 1 || separator[0] !== 10) throw new Error("source capsule sparse blob separator is missing");
					offset += 1;
					writeFrozen(entry.path, bytes, entry.mode);
				}
				if (offset !== fstatSync(input).size) throw new Error("source capsule sparse blob stream has unexpected data");
			} finally {
				closeSync(input);
			}
		}
		const selectionEnv = { ...sourceEnv };
		const nativeGitEnv = Object.fromEntries(Object.entries(sourceEnv).filter(([key]) => {
			const name = key.toUpperCase();
			return !name.startsWith("GIT_") || name === "GIT_CEILING_DIRECTORIES" || name === "GIT_DISCOVERY_ACROSS_FILESYSTEM";
		}));
		let preparationUnverified = false;
		const holdPreparation = () => {
			if (staging.recorded && !preparationUnverified) {
				staging.hold("writers");
				preparationUnverified = true;
			}
		};
		const checkPreparation = (env) => {
			if (staging.recorded && !preparationUnverified && hasUnverifiedGitPreparation(directory, env, /* @__PURE__ */ new Set([...owned, ...frozen.keys()]))) holdPreparation();
		};
		const runtimePolicies = [];
		let configPath;
		const explicitConfig = sourceEnv.CRABBOX_CONFIG;
		if (explicitConfig) {
			const original = resolve(repoRoot, explicitConfig);
			function repositoryPolicyPath(absolute) {
				const path = relative(repoRoot, absolute);
				return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path) ? capsulePath(path) : void 0;
			}
			let policyPath = repositoryPolicyPath(original);
			if (!policyPath) try {
				policyPath = repositoryPolicyPath(realpathSync(original));
			} catch {}
			if (policyPath) {
				runtimePolicies.push(policyPath);
				configPath = join(directory, policyPath);
			} else configPath = original;
			selectionEnv.CRABBOX_CONFIG = configPath;
		} else runtimePolicies.push("crabbox.yaml", ".crabbox.yaml");
		for (const path of [...runtimePolicies, ".crabboxignore"]) if ((frozen.has(path) ? "present" : copySource(path)) !== "missing" && !["100644", "100755"].includes(frozen.get(path)?.mode ?? "")) throw new Error(`source capsule cannot relocate non-regular repository policy ${JSON.stringify(path)}; use a regular policy file before uploading`);
		checkPreparation(sourceEnv);
		const snapshotEligible = new Set(git(directory, [
			"ls-files",
			"--cached",
			"--others",
			"--exclude-standard",
			"-z"
		]).split("\0").filter(Boolean));
		for (const path of frozen.keys()) if (eligible.has(path) && !snapshotEligible.has(path)) throw new Error("source capsule Git exclusion context changed in the frozen checkout");
		function selectSource() {
			checkPreparation(selectionEnv);
			checkPreparation(nativeGitEnv);
			let planValue;
			try {
				const result = spawnSync(options.syncPlan.command, options.syncPlan.args, {
					cwd: directory,
					env: selectionEnv,
					windowsVerbatimArguments: options.syncPlan.windowsVerbatimArguments,
					encoding: "utf8",
					maxBuffer: 67108864,
					stdio: [
						"ignore",
						"pipe",
						"pipe"
					]
				});
				if (result.error || result.status !== 0) throw new Error("Crabbox sync-plan failed");
				planValue = JSON.parse(result.stdout);
			} catch {
				throw new Error("source capsule requires a successful Crabbox sync-plan; inspect source exclusions before retrying");
			}
			const parsed = syncPlanSchema.safeParse(planValue);
			if (!parsed.success) throw new Error("source capsule received an invalid Crabbox sync-plan");
			if (typeof planValue === "object" && planValue !== null && "localGitSeed" in planValue && planValue.localGitSeed != null) holdPreparation();
			const selected = new Set(parsed.data.topFiles.map((entry) => capsulePath(entry.path)));
			if (selected.size !== parsed.data.candidate.files || selected.size !== parsed.data.topFiles.length) throw new Error("source capsule requires the complete, unique Crabbox sync-plan selection");
			return selected;
		}
		const directories = /* @__PURE__ */ new Set();
		for (const path of frozen.keys()) for (let parent = dirname(path); parent !== "."; parent = dirname(parent)) directories.add(parent);
		const groups = [/* @__PURE__ */ new Set()];
		for (const path of [...owned].toSorted()) {
			if (frozen.has(path) || directories.has(path)) continue;
			const parents = [];
			for (let parent = dirname(path); parent !== "."; parent = dirname(parent)) parents.push(parent);
			if (parents.some((parent) => frozen.has(parent))) continue;
			let group = groups.find((entries) => parents.every((parent) => !entries.has(parent)));
			if (!group) {
				group = /* @__PURE__ */ new Set();
				groups.push(group);
			}
			group.add(path);
		}
		const emptyBlob = git(directory, [
			"hash-object",
			"-w",
			"--stdin"
		], privateEnv, "").trim();
		const unstageDeletions = (paths) => git(directory, [
			"update-index",
			"-z",
			"--index-info"
		], privateEnv, [...paths].map((path) => `0 ${"0".repeat(40)}\t${path}\0`).join(""));
		unstageDeletions(groups.flatMap((group) => [...group]));
		const deleted = [];
		let selected;
		for (const group of groups) {
			for (const path of group) {
				mkdirSync(dirname(join(directory, path)), { recursive: true });
				writeFileSync(join(directory, path), "", { flag: "wx" });
			}
			git(directory, [
				"update-index",
				"-z",
				"--index-info"
			], privateEnv, [...group].map((path) => `100644 ${emptyBlob}\t${path}\0`).join(""));
			const current = selectSource();
			for (const path of group) {
				if (current.delete(path)) deleted.push(path);
				rmSync(join(directory, path));
			}
			unstageDeletions(group);
			if (selected && (selected.size !== current.size || [...selected].some((path) => !current.has(path)))) throw new Error("source capsule policy changed while selecting deletions");
			selected = current;
		}
		if (!selected) throw new Error("source capsule selection is missing");
		for (const path of tracked.keys()) if (frozen.has(path) && !selected.has(path)) throw new Error(`source capsule privacy selection excludes required tracked source ${JSON.stringify(path)}; resolve the conflict before uploading`);
		for (const path of selected) {
			if (frozen.has(path)) continue;
			const parts = path.split("/");
			if (!(tracked.has(path) && parts.some((_, index) => index > 0 && frozen.has(parts.slice(0, index).join("/"))))) throw new Error("source capsule selection contains an absent source entry");
		}
		const paths = [...selected].filter((path) => eligible.has(path) && frozen.has(path)).toSorted();
		const finalPaths = new Set(paths);
		for (const path of runtimePolicies) if (frozen.has(path) && !finalPaths.has(path)) throw new Error(`source capsule cannot retain excluded repository runtime configuration ${JSON.stringify(path)} for staged delegation`);
		for (const path of frozen.keys()) if (!finalPaths.has(path)) rmSync(join(directory, path));
		const hashes = git(directory, [
			"hash-object",
			"-w",
			"--no-filters",
			"--stdin-paths"
		], privateEnv, paths.map((path) => JSON.stringify(frozen.get(path).blobPath)).join("\n") + (paths.length ? "\n" : "")).trim().split("\n").filter(Boolean);
		if (hashes.length !== paths.length || hashes.some((hash) => !/^[a-f0-9]{40}$/u.test(hash))) throw new Error("source capsule could not freeze every raw blob");
		git(directory, ["read-tree", "--empty"], privateEnv);
		git(directory, [
			"update-index",
			"-z",
			"--index-info"
		], privateEnv, paths.map((path, index) => `${frozen.get(path).mode} ${hashes[index]}\t${path}\0`).join(""));
		const tree = capsuleObjectId(git(directory, ["write-tree"], privateEnv));
		const carrier = capsuleObjectId(git(directory, [
			"commit-tree",
			tree,
			"-p",
			baseSha
		], privateEnv, JSON.stringify({ deleted }) + "\n"));
		git(directory, [
			"update-ref",
			capsuleRef,
			carrier
		], privateEnv);
		const shallow = join(temporary, "shallow");
		writeFileSync(shallow, `${baseSha}\n`);
		const bundlePath = join(directory, bundleFile);
		git(directory, [
			"bundle",
			"create",
			bundlePath,
			`${baseSha}..${capsuleRef}`
		], {
			...privateEnv,
			GIT_SHALLOW_FILE: shallow
		});
		const digest = createHash("sha256").update(readFileSync(bundlePath)).digest("hex");
		git(directory, [
			"update-index",
			"--add",
			"--cacheinfo",
			`100644,${capsuleObjectId(git(directory, [
				"hash-object",
				"-w",
				"--no-filters",
				bundlePath
			], privateEnv))},${bundleFile}`
		], privateEnv);
		if (git(repoRoot, ["rev-parse", "HEAD"]).trim() !== sourceSha || git(repoRoot, [
			"ls-files",
			"-v",
			"--stage",
			"-z"
		]) !== trackedRecords) throw new Error("source revision or index changed while freezing; retry after edits finish");
		rmSync(linkBlobs, {
			recursive: true,
			force: true
		});
		rmSync(join(temporary, "sparse-blobs"), { force: true });
		rmSync(shallow, { force: true });
		if (staging.recorded) {
			checkPreparation(sourceEnv);
			checkPreparation(nativeGitEnv);
			staging.prepared({
				files: paths.map((path, index) => ({
					path,
					mode: frozen.get(path).mode,
					blob: hashes[index]
				})),
				deleted
			}, captureSourceWitness(repoRoot, sourceSha));
		}
		return {
			sourceSha,
			baseSha,
			tree,
			carrier,
			digest,
			bundlePath,
			directory,
			cleanup,
			staging,
			configPath
		};
	} catch (error) {
		try {
			cleanup();
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], `source capsule cleanup failed; temporary checkout retained at ${temporary}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`, { cause: cleanupError });
		}
		throw error;
	}
}
//#endregion
//#region scripts/crabbox-source-receiver.mts
const receiver = String.raw`
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { isUtf8 } = require("node:buffer");
const { spawnSync } = require("node:child_process");
const { getSystemErrorMap } = require("node:util");
const expected = JSON.parse(process.argv[1]);
const syncRoot = process.cwd();
const cwd = process.argv[2] ?? syncRoot;
let temporary;
function fail(message) { throw new Error(message); }
function stat(file) {
  try { return fs.lstatSync(file); } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return null;
    throw error;
  }
}
function safePath(file) {
  if (!file || file.includes("\\") || file.split("/").some(part =>
    !part || part === "." || part === ".." || part.toLowerCase() === ".git")) fail("unsafe source path");
  return file;
}
function hashFile(file, algorithm, blob = false) {
  const fd = fs.openSync(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const info = fs.fstatSync(fd);
    if (!info.isFile()) fail("source entry is not a regular file");
    const hash = createHash(algorithm);
    if (blob) hash.update("blob " + info.size + "\0");
    const buffer = Buffer.alloc(65536);
    let size;
    while ((size = fs.readSync(fd, buffer)) > 0) hash.update(buffer.subarray(0, size));
    return hash.digest("hex");
  } finally { fs.closeSync(fd); }
}
const gitFailureCause = Object.freeze({
  noSpace: "no-space", permissionDenied: "permission-denied",
  commandUnavailable: "command-unavailable", outputLimit: "output-limit",
  terminated: "terminated", remoteRefMissing: "remote-ref-missing",
  invalidObjectData: "invalid-object-data", dns: "dns", connection: "connection",
  auth: "auth", unknown: "unknown",
});
function gitFailure(phase, result) {
  const errors = getSystemErrorMap();
  const rawCode = result.error?.code;
  const code = [...errors.values()].some(([name]) => name === rawCode) ? rawCode : null;
  const text = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8").trim() : "";
  const cause = code === "ENOSPC" ? gitFailureCause.noSpace
    : code === "EACCES" || code === "EPERM" ? gitFailureCause.permissionDenied
    : code === "ENOENT" ? gitFailureCause.commandUnavailable
    : code === "ENOBUFS" ? gitFailureCause.outputLimit
    : result.signal !== null ? gitFailureCause.terminated
    : /^fatal: couldn't find remote ref [^\r\n]+$/u.test(text) ? gitFailureCause.remoteRefMissing
    : /^fatal: (?:pack has bad object(?: at offset \d+)?|bad object [a-f0-9]+|index-pack failed|fetch-pack: invalid index-pack output)$/u.test(text) ? gitFailureCause.invalidObjectData
    : /^fatal: unable to access '[^'\r\n]+': Could not resolve (?:host|proxy): [^\r\n]+$/u.test(text) ? gitFailureCause.dns
    : /^fatal: unable to access '[^'\r\n]+': (?:Failed to connect to [^\r\n]+|Recv failure: Connection reset by peer)$/u.test(text) ? gitFailureCause.connection
    : /^fatal: (?:Authentication failed for '[^'\r\n]+'|could not read Username for '[^'\r\n]+': [^\r\n]+)$/u.test(text) ? gitFailureCause.auth
    : gitFailureCause.unknown;
  return { phase, baseSha: /^[a-f0-9]{40}$/u.test(expected.baseSha) ? expected.baseSha : null,
    status: result.status, signal: result.signal, spawnError: Boolean(result.error),
    code, errno: errors.has(result.error?.errno) ? result.error.errno : null, cause };
}
try {
  if (process.argv[2] && (cwd === syncRoot || cwd.startsWith(syncRoot + path.sep) || syncRoot.startsWith(cwd + path.sep)))
    fail("Testbox execution and sync workspaces overlap; stop this lease and warm a fresh one");
  const capsule = path.join(syncRoot, ".openclaw-crabbox-changed-gate.bundle");
  if (!stat(capsule)?.isFile() || hashFile(capsule, "sha256") !== expected.digest)
    fail("missing or mismatched source capsule; rerun from the local candidate");
  // Native cleanup owns only syncRoot. Source application and the payload share
  // the prepared workspace, so ignored runtime never enters the native delete walk.
  process.chdir(cwd);
  temporary = fs.mkdtempSync(path.join(cwd, ".openclaw-source-"));
  const bundle = path.join(temporary, "source.bundle");
  fs.copyFileSync(capsule, bundle);
  if (hashFile(bundle, "sha256") !== expected.digest) fail("source capsule changed during import");
  const gitDir = path.join(temporary, "git");
  const env = { ...process.env, GIT_DIR: gitDir, GIT_WORK_TREE: cwd,
    GIT_INDEX_FILE: path.join(gitDir, "index"), GIT_OPTIONAL_LOCKS: "0" };
  delete env.GIT_COMMON_DIR;
  delete env.GIT_OBJECT_DIRECTORY;
  delete env.GIT_ALTERNATE_OBJECT_DIRECTORIES;
  delete env.GIT_SHALLOW_FILE;
  function git(args, options = {}) {
    const { encoding, phase = args[0], ...spawnOptions } = options;
    const result = spawnSync("git", ["-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", ...args],
      { cwd, env, maxBuffer: 64 * 1024 * 1024, ...spawnOptions });
    if (result.status !== 0) fail("source Git operation failed: " + JSON.stringify(gitFailure(phase, result)));
    if (encoding === "buffer") return result.stdout;
    if (result.stdout === null) return "";
    if (!isUtf8(result.stdout)) fail("unsupported non-UTF-8 Git metadata");
    return result.stdout.toString("utf8");
  }
  git(["init", "-q"]);
  git(["remote", "add", "origin", "https://github.com/openclaw/openclaw.git"]);
  git(["fetch", "-q", "--depth=2", "origin", expected.baseSha + ":refs/remotes/origin/main"],
    { phase: "base-fetch" });
  if (git(["rev-parse", "refs/remotes/origin/main"]).trim() !== expected.baseSha)
    fail("source base mismatch");
  git(["fetch", "-q", bundle, "refs/openclaw/source-capsule:refs/heads/openclaw-source"],
    { phase: "capsule-fetch" });
  for (const [ref, value] of [
    ["refs/heads/openclaw-source", expected.carrier],
    ["refs/heads/openclaw-source^{tree}", expected.tree],
    ["refs/heads/openclaw-source^", expected.baseSha],
  ]) if (git(["rev-parse", ref]).trim() !== value) fail("source capsule identity mismatch");
  function entries(tree, directory = gitDir) {
    const output = git(["ls-tree", "-r", "-z", tree], { encoding: "buffer",
      env: { ...env, GIT_DIR: directory, GIT_INDEX_FILE: path.join(directory, "index") } });
    if (!isUtf8(output)) fail("unsupported non-UTF-8 source paths");
    return output.subarray(0, -1).toString("utf8")
      .split("\0").filter(Boolean).map(row => {
        const match = /^(100644|100755|120000) blob ([a-f0-9]{40})\t([\s\S]+)$/.exec(row);
        if (!match) fail("unsupported source tree entry");
        return { mode: match[1], oid: match[2], file: safePath(match[3]) };
      });
  }
  // The prepared workspace can contain newer workflow source. Its committed tree
  // owns only cleanup candidates; the capsule alone selects the executed source.
  const previous = new Map((process.argv[2] ? entries("HEAD", path.join(cwd, ".git")) : [])
    .map(entry => [entry.file, entry]));
  const files = entries(expected.tree);
  const metadata = JSON.parse(git(["show", "-s", "--format=%B", expected.carrier]));
  if (!Array.isArray(metadata.deleted) || metadata.deleted.some(file => typeof file !== "string"))
    fail("invalid source deletion inventory");
  const deleted = new Set(metadata.deleted.map(safePath));
  const selected = new Set(files.map(entry => entry.file));
  const directories = new Set();
  for (const { file } of files) {
    let parent = path.posix.dirname(file);
    while (parent !== ".") { directories.add(parent); parent = path.posix.dirname(parent); }
  }
  // Never follow an old directory symlink while removing or creating source entries.
  function reachable(file) {
    let parent = path.posix.dirname(file);
    while (parent !== ".") {
      if (!stat(parent)?.isDirectory()) return false;
      parent = path.posix.dirname(parent);
    }
    return true;
  }
  function remove(file) {
    safePath(file);
    if (reachable(file)) fs.rmSync(file, { recursive: true, force: true });
  }
  // The producer owns privacy-filtered deletions, including ignored entries lost
  // from old indexes. A directory with unknown contents is not ours to erase.
  for (const file of [...deleted].sort((a, b) => b.split("/").length - a.split("/").length)) {
    if (selected.has(file) || directories.has(file)) fail("conflicting source deletion");
    if (reachable(file)) {
      if (stat(file)?.isDirectory()) fs.rmdirSync(file);
      else fs.rmSync(file, { force: true });
    }
  }
  for (const directory of [...directories].sort((a, b) => a.split("/").length - b.split("/").length)) {
    if (!stat(directory)?.isDirectory()) {
      remove(directory);
      fs.mkdirSync(directory);
    }
  }
  // Batch raw blobs once; checkout/archive would apply attributes or export rules.
  const blobPath = path.join(temporary, "blobs");
  const output = fs.openSync(blobPath, "wx");
  try { git(["cat-file", "--batch"], {
    input: files.map(entry => entry.oid + "\n").join(""), stdio: ["pipe", output, "pipe"]
  }); } finally { fs.closeSync(output); }
  const input = fs.openSync(blobPath, "r");
  const buffer = Buffer.alloc(65536);
  let cursor = 0;
  let end = 0;
  function take(count) {
    if (cursor === end) { end = fs.readSync(input, buffer); cursor = 0; }
    if (end === 0) fail("truncated source blobs");
    const chunk = buffer.subarray(cursor, Math.min(end, cursor + count));
    cursor += chunk.length;
    return chunk;
  }
  try {
    for (const entry of files) {
      let header = "";
      for (;;) {
        const byte = take(1)[0];
        if (byte === 10) break;
        header += String.fromCharCode(byte);
        if (header.length > 100) fail("invalid source blob header");
      }
      const match = /^([a-f0-9]{40}) blob (\d+)$/.exec(header);
      if (!match || match[1] !== entry.oid) fail("source blob identity mismatch");
      let remaining = Number(match[2]);
      remove(entry.file);
      const fd = entry.mode === "120000" ? null : fs.openSync(entry.file, "wx", 0o600);
      const target = [];
      try {
        while (remaining > 0) {
          const bytes = take(remaining);
          remaining -= bytes.length;
          if (fd === null) target.push(Buffer.from(bytes));
          else fs.writeFileSync(fd, bytes);
        }
      } finally { if (fd !== null) fs.closeSync(fd); }
      if (take(1)[0] !== 10) fail("invalid source blob terminator");
      if (fd === null) fs.symlinkSync(Buffer.concat(target), entry.file);
      else fs.chmodSync(entry.file, entry.mode === "100755" ? 0o755 : 0o644);
    }
  } finally { fs.closeSync(input); }
  git(["read-tree", expected.tree]);
  fs.rmSync(capsule);
  for (;;) {
    const extras = git(["ls-files", "--others", "--exclude-standard", "-z"]).split("\0")
      .filter(file => file && !file.startsWith(path.basename(temporary) + "/"));
    if (extras.length === 0) break;
    // Settle ancestor ignore rules first: removing a negated rule can protect
    // descendant rules already listed, while removing an exclusion can reveal more.
    const ignore = extras.filter(file => path.posix.basename(file) === ".gitignore")
      .sort((a, b) => a.split("/").length - b.split("/").length)[0];
    for (const file of ignore ? [ignore] : extras) {
      const entry = previous.get(file);
      if (!entry) fail("unexpected source entry: " + file);
      // Preserve untracked, ignored, and modified runtime state. Only unchanged
      // committed extras may be retired after the new source's ignore rules apply.
      verify(entry);
      fs.unlinkSync(file);
      deleted.add(file);
    }
    // Each pass removes committed files. Retiring their .gitignore rules can
    // expose more entries, so verification ends only with an empty inventory.
  }
  for (const file of deleted) {
    if (reachable(file) && stat(file)) fail("source deletion mismatch: " + file);
  }
  // Verify filesystem bytes, kind, and executable bit independently of either index.
  function verify({ file, mode, oid }) {
    if (!reachable(file)) fail("source parent mismatch: " + file);
    const info = stat(file);
    let actual;
    if (mode === "120000") {
      if (!info?.isSymbolicLink()) fail("source kind mismatch: " + file);
      const target = fs.readlinkSync(file, { encoding: "buffer" });
      actual = createHash("sha1").update("blob " + target.length + "\0").update(target).digest("hex");
    } else {
      if (!info?.isFile() || Boolean(info.mode & 0o100) !== (mode === "100755"))
        fail("source mode mismatch: " + file);
      actual = hashFile(file, "sha1", true);
    }
    if (actual !== oid) fail("source bytes mismatch: " + file);
  }
  for (const entry of files) verify(entry);
  if (expected.alias) git(["update-ref", expected.alias, expected.baseSha]);
  git(["symbolic-ref", "HEAD", "refs/heads/openclaw-source"]);
  const sourceIndex = git(["ls-files", "--stage", "-v", "-z"], { encoding: "buffer" });
  fs.rmSync(".git", { recursive: true, force: true });
  fs.renameSync(gitDir, path.join(cwd, ".git"));
  env.GIT_DIR = path.join(cwd, ".git");
  env.GIT_INDEX_FILE = path.join(env.GIT_DIR, "index");
  const sourceGit = stat(env.GIT_DIR);
  // The payload consumes Git identity as well as bytes. Lifecycle hooks may refresh
  // index caches or hooksPath, but cannot change source membership or comparison refs.
  function verifySource() {
    const currentGit = stat(env.GIT_DIR);
    if (!currentGit?.isDirectory() || currentGit.dev !== sourceGit.dev || currentGit.ino !== sourceGit.ino ||
        !stat(env.GIT_INDEX_FILE)?.isFile() || stat(path.join(env.GIT_DIR, "commondir")))
      fail("source Git owner mismatch");
    for (const entry of files) verify(entry);
    for (const file of deleted) {
      if (reachable(file) && stat(file)) fail("source deletion mismatch: " + file);
    }
    if (!git(["ls-files", "--stage", "-v", "-z"], { encoding: "buffer" }).equals(sourceIndex))
      fail("source index mismatch");
    if (git(["symbolic-ref", "HEAD"]).trim() !== "refs/heads/openclaw-source")
      fail("source HEAD mismatch");
    for (const [ref, value] of [
      ["HEAD", expected.carrier], ["refs/remotes/origin/main", expected.baseSha],
      ...(expected.alias ? [[expected.alias, expected.baseSha]] : []),
    ]) if (git(["rev-parse", ref]).trim() !== value) fail("source comparison ref mismatch: " + ref);
    const extras = git(["ls-files", "--others", "--exclude-standard", "-z"])
      .split("\0").filter(file => file && !file.startsWith(path.basename(temporary) + "/"));
    if (extras.length) fail("unexpected source entry: " + extras[0]);
  }
  verifySource();
  if (selected.has("pnpm-lock.yaml")) {
    const installer = ".github/actions/setup-node-env/install-dependencies.sh";
    if (!selected.has(installer) || !stat(installer)?.isFile())
      fail("selected source lacks a regular dependency install owner");
    // Hydration belongs to workflow source. Reconcile through the selected
    // source's install owner before any caller payload can run.
    const installEnv = { ...env, CI: "true", GITHUB_WORKSPACE: cwd,
      NODE_BIN: path.dirname(process.execPath), FROZEN_LOCKFILE: "true",
      DEPENDENCY_CACHE: "false", DEPENDENCY_CACHE_HIT: "false" };
    for (const key of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"]) delete installEnv[key];
    process.stderr.write("[crabbox] reconciling selected-source dependencies\n");
    const install = spawnSync("bash", [installer], { cwd, env: installEnv, stdio: ["inherit", 2, 2] });
    if (install.status !== 0) fail("selected-source frozen install failed; payload was not run");
    verifySource();
  }
  process.stderr.write("[crabbox] verified source=" + expected.sourceSha + " tree=" + expected.tree + " carrier=" + expected.carrier + "\n");
} catch (error) {
  process.stderr.write("[crabbox] source verification failed: " + error.message + "\n");
  process.exitCode = 2;
} finally {
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}
`;
function remoteSourceBootstrap(capsule, alias, testboxWorkspace) {
	const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
	const { sourceSha, baseSha, tree, carrier, digest } = capsule;
	const command = `node -e ${quote(receiver)} ${quote(JSON.stringify({
		sourceSha,
		baseSha,
		tree,
		carrier,
		digest,
		alias
	}))}`;
	if (!testboxWorkspace) return command;
	return ["openclaw_source_root=\"$(cd ./.git/crabbox-artifact-root && pwd -P)\" || { echo \"[crabbox] missing prepared Testbox execution workspace; stop this lease and warm a fresh one\" >&2; exit 2; };", `${command} "$openclaw_source_root" && cd "$openclaw_source_root"`].join(" ");
}
//#endregion
//#region scripts/crabbox-wrapper-providers.mts
const providerAliases = /* @__PURE__ */ new Map([
	["blacksmith", "blacksmith-testbox"],
	["cf", "cloudflare"],
	["container", "local-container"],
	["docker", "local-container"],
	["exe", "exe-dev"],
	["exedev", "exe-dev"],
	["google", "gcp"],
	["google-cloud", "gcp"],
	["local-docker", "local-container"],
	["namespace", "namespace-devbox"],
	["namespace-devboxes", "namespace-devbox"],
	["rail", "railway"],
	["railwayapp", "railway"],
	["run-pod", "runpod"],
	["runpodio", "runpod"],
	["sem", "semaphore"],
	["static", "ssh"],
	["static-ssh", "ssh"],
	["tensorlake-sbx", "tensorlake"],
	["tl", "tensorlake"]
]);
function canonicalProviderName(provider) {
	return providerAliases.get(provider) ?? provider;
}
function addProviderNames(names, text) {
	for (const name of text.replace(/\s+\(defaults?\b.*$/u, "").split(/\s*(?:,|\||\bor\b)\s*/u).map((s) => s.trim()).filter(Boolean)) if (/^[a-z0-9][a-z0-9-]*$/u.test(name)) names.add(name);
}
function providerListContinuation(line, previousText) {
	const match = line.match(/^\s*((?:or\s+)?[a-z0-9][a-z0-9-]*(?:\s*(?:,|\||\bor\b)\s*(?:or\s+)?[a-z0-9][a-z0-9-]*)*\s*(?:,|\|)?)(?:\s+\(defaults?\b.*)?\s*$/u);
	if (!match) return "";
	if (/[,|]\s*$/u.test(previousText) || /[,|]|\bor\b|\(defaults?\b/u.test(line)) return match[1] ?? "";
	return "";
}
function parseProvidersFromHelp(text) {
	const names = /* @__PURE__ */ new Set();
	const lines = text.split(/\r?\n/u);
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const providerMatch = line.match(/provider:\s*([a-z0-9][a-z0-9, -]*)(?:\s*\(defaults?\b|$)/u);
		if (providerMatch) {
			let providerText = providerMatch[1] ?? "";
			while (!/\(defaults?\b/u.test(lines[index] ?? "") && index + 1 < lines.length) {
				const continuation = providerListContinuation(lines[index + 1] ?? "", providerText);
				if (!continuation) break;
				index += 1;
				providerText = `${providerText} ${continuation}`;
			}
			addProviderNames(names, providerText);
			continue;
		}
		const flagProviders = line.match(/^\s+-{1,2}provider(?:[=\s]+)([a-z0-9][a-z0-9|, -]*)(?:\s{2,}|\s+\(|$)/u)?.[1] ?? "";
		if (/[,|]|\bor\b/u.test(flagProviders)) addProviderNames(names, flagProviders);
	}
	return [...names];
}
function isProviderAdvertised(provider, advertisedProviders) {
	const canonicalProvider = canonicalProviderName(provider);
	return advertisedProviders.includes(provider) || advertisedProviders.includes(canonicalProvider);
}
//#endregion
//#region scripts/testbox-lease-freshness.mts
const STATE_VERSION = 1;
const DEPENDENCY_INPUTS = [
	"package.json",
	"pnpm-lock.yaml",
	"pnpm-workspace.yaml",
	".npmrc"
];
const ENVIRONMENT_INPUTS = [
	".crabbox.yaml",
	".github/actions/prepare-testbox-shell",
	".node-version",
	"scripts/crabbox-wrapper.mjs",
	"scripts/crabbox-wrapper.mts",
	"scripts/crabbox-source-capsule.mts",
	"scripts/crabbox-source-receiver.mts"
];
function optionValue$1(args, name, fallback = "") {
	const shortName = name.replace(/^--/u, "-");
	for (const [index, argument = ""] of args.entries()) {
		if (argument === name || argument === shortName) return args[index + 1] ?? fallback;
		if (argument.startsWith(`${name}=`) || argument.startsWith(`${shortName}=`)) return argument.slice(argument.indexOf("=") + 1);
	}
	return fallback;
}
function git(repoRoot, args) {
	return execFileSync("git", [
		"-C",
		repoRoot,
		...args
	], {
		encoding: "utf8",
		env: {
			...process.env,
			GIT_CONFIG_GLOBAL: "/dev/null"
		}
	}).trim();
}
function listFiles(path) {
	if (!existsSync(path)) return [];
	if (statSync(path).isFile()) return [path];
	return readdirSync(path, { withFileTypes: true }).flatMap((entry) => listFiles(resolve(path, entry.name))).toSorted((left, right) => left.localeCompare(right));
}
function digestInputs(repoRoot, inputs) {
	const hash = createHash("sha256");
	for (const input of inputs) for (const path of listFiles(resolve(repoRoot, input))) {
		hash.update(path.slice(repoRoot.length));
		hash.update("\0");
		hash.update(readFileSync(path));
		hash.update("\0");
	}
	return hash.digest("hex");
}
function buildTestboxLeaseFingerprint(repoRoot, args) {
	const workflow = optionValue$1(args, "--blacksmith-workflow", ".github/workflows/ci-check-testbox.yml");
	let baseSha;
	try {
		baseSha = git(repoRoot, [
			"merge-base",
			"HEAD",
			"refs/remotes/origin/main"
		]);
	} catch {
		baseSha = git(repoRoot, ["rev-parse", "HEAD"]);
	}
	return {
		version: STATE_VERSION,
		baseSha,
		headSha: git(repoRoot, ["rev-parse", "HEAD"]),
		dependencyDigest: digestInputs(repoRoot, [...DEPENDENCY_INPUTS, "patches"]),
		environmentDigest: digestInputs(repoRoot, [...ENVIRONMENT_INPUTS, workflow]),
		workflow,
		job: optionValue$1(args, "--blacksmith-job", "check"),
		ref: optionValue$1(args, "--blacksmith-ref", "main")
	};
}
function testboxLeaseStaleReasons(saved, current) {
	if (!isRecord(saved) || saved.version !== STATE_VERSION || !isRecord(current)) return ["state schema"];
	return [
		"baseSha",
		"dependencyDigest",
		"environmentDigest",
		"workflow",
		"job",
		"ref"
	].filter((key) => saved[key] !== current[key]);
}
function prepareTestboxLeaseFreshness({ args, env, provider, repoRoot }) {
	const id = optionValue$1(args, "--id");
	if (provider !== "blacksmith-testbox" || args[0] !== "run" || !id?.startsWith("tbx_")) return null;
	const configuredStateDir = env.OPENCLAW_TESTBOX_LEASE_STATE_DIR?.trim();
	if (env.VITEST && !configuredStateDir) return null;
	const stateDir = resolve(configuredStateDir || resolve(repoRoot, ".crabbox", "testbox-leases"));
	const path = resolve(stateDir, `${id}.json`);
	const current = buildTestboxLeaseFingerprint(repoRoot, args);
	if (existsSync(path)) {
		const staleReasons = testboxLeaseStaleReasons(JSON.parse(readFileSync(path, "utf8")), current);
		if (staleReasons.length > 0 && env.OPENCLAW_TESTBOX_ALLOW_STALE !== "1") throw new Error(`Testbox ${id} is stale (${staleReasons.join(", ")}); stop it and warm a fresh lease, or set OPENCLAW_TESTBOX_ALLOW_STALE=1 for an intentional diagnostic reuse`);
		return {
			current,
			path
		};
	}
	return {
		current,
		path
	};
}
function recordTestboxLeaseFreshness(prepared) {
	if (!prepared) return;
	mkdirSync(resolve(prepared.path, ".."), { recursive: true });
	const temporaryPath = `${prepared.path}.tmp-${process.pid}`;
	writeFileSync(temporaryPath, `${JSON.stringify(prepared.current, null, 2)}\n`);
	renameSync(temporaryPath, prepared.path);
}
//#endregion
//#region scripts/crabbox-wrapper.mts
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args[0] === "--") args.shift();
if (args[0] === "staging") {
	const { runStagingCommand } = await import("./crabbox-staging-D4hGkkip.mjs");
	process.exit(await runStagingCommand(args.slice(1), fullCheckoutSyncRoot(false), {
		cwd: repoRoot,
		binary: findCrabboxBinary({
			openclawRoot: process.env.OPENCLAW_CRABBOX_WRAPPER_IGNORE_REPO_BINARY === "1" ? void 0 : repoRoot,
			pathEnv: process.env[resolvePathEnvKey(process.env)]
		}) ?? "crabbox"
	}));
}
const CRABBOX_METADATA_PROBE_TIMEOUT_MS = 5e3;
const MAX_TIMING_JSON_LINE_CHARS = 1048576;
const CRABBOX_METADATA_PROBE_RETRY_TIMEOUT_MS = 2e4;
const ignoreRepoBinary = process.env.OPENCLAW_CRABBOX_WRAPPER_IGNORE_REPO_BINARY === "1";
const candidateBinary = findCrabboxBinary({
	openclawRoot: ignoreRepoBinary ? void 0 : repoRoot,
	pathEnv: process.env[resolvePathEnvKey(process.env)]
}) ?? resolveGitCommonCrabboxBinary(process.env, process.platform) ?? "crabbox";
let cli;
try {
	cli = await ensureManagedCrabboxBinary({ binary: candidateBinary });
} catch (error) {
	console.error(`[crabbox] ${error instanceof Error ? error.message : String(error)}`);
	process.exit(2);
}
const { binary, version } = cli;
const workloadCommand = isWorkloadRoutedCommand(args);
const workloadOption = workloadCommand ? extractWrapperValueOption(args, "--workload") : void 0;
const userArgStart = commandUserArgStart(args);
function extractWrapperValueOption(commandArgs, name) {
	const equalsPrefix = `${name}=`;
	for (let index = 0; index < commandArgs.length; index += 1) {
		const arg = commandArgs[index] ?? "";
		if (arg === "--") break;
		if (arg === name) {
			const value = commandArgs[index + 1];
			if (!value || value === "--" || value.startsWith("-")) {
				commandArgs.splice(index, 1);
				return null;
			}
			commandArgs.splice(index, 2);
			return value;
		}
		if (arg.startsWith(equalsPrefix)) {
			commandArgs.splice(index, 1);
			return arg.slice(equalsPrefix.length) || null;
		}
	}
}
function isWorkloadRoutedCommand(commandArgs) {
	return ["run", "warmup"].includes(commandArgs[0] ?? "") || commandArgs[0] === "actions" && commandArgs[1] === "hydrate";
}
function commandUserArgStart(commandArgs) {
	return commandArgs[0] === "actions" && commandArgs[1] === "hydrate" ? 2 : 1;
}
function commandCandidates(command, platform) {
	if (platform !== "win32") return [command];
	if (extname(command)) return [command];
	return [
		`${command}.exe`,
		`${command}.cmd`,
		`${command}.bat`,
		`${command}.com`,
		command
	];
}
function resolvePathBinary(command, env, platform) {
	const pathValue = env[resolvePathEnvKey(env)] ?? "";
	for (const dir of pathValue.split(delimiter).filter(Boolean)) for (const candidate of commandCandidates(command, platform)) {
		const fullPath = resolve(dir, candidate);
		if (isExecutableFile(fullPath, platform)) return fullPath;
	}
	return null;
}
function resolveGitCommonCrabboxBinary(env, platform) {
	const invocation = spawnInvocation(resolvePathBinary("git", env, platform) ?? "git", ["rev-parse", "--git-common-dir"], env, platform);
	const result = spawnSync(invocation.command, invocation.args, {
		cwd: repoRoot,
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		],
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	if ((result.status ?? 1) !== 0) return null;
	const gitCommonDir = result.stdout.trim();
	if (!gitCommonDir) return null;
	const absoluteGitCommonDir = isAbsolute(gitCommonDir) ? gitCommonDir : resolve(repoRoot, gitCommonDir);
	return findCrabboxBinary({
		openclawRoot: resolve(absoluteGitCommonDir, ".."),
		platform
	});
}
function isExecutableFile(path, platform) {
	try {
		if (!statSync(path).isFile()) return false;
		if (platform !== "win32") accessSync(path, constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function spawnInvocation(command, commandArgs, env, platform) {
	const extension = extname(command).toLowerCase();
	if (platform === "win32" && (extension === ".cmd" || extension === ".bat")) {
		const nodeShim = resolveNodeCmdShim(command, platform);
		if (nodeShim) return {
			command: nodeShim.node,
			args: [...nodeShim.args, ...commandArgs]
		};
		return {
			command: resolveWindowsCmdExePath(env),
			args: [
				"/d",
				"/s",
				"/c",
				buildBatchCommandLine(command, commandArgs)
			],
			windowsVerbatimArguments: true
		};
	}
	return {
		command,
		args: commandArgs
	};
}
function resolveNodeCmdShim(command, platform) {
	let content;
	try {
		content = readFileSync(command, "utf8");
	} catch {
		return null;
	}
	for (const rawLine of content.split(/\r?\n/u)) {
		const line = rawLine.trim();
		const match = /^"([^"]+node(?:\.exe)?)"\s+"%~dp0([^"]+)"\s+%\*$/iu.exec(line);
		if (!match) continue;
		const script = resolve(dirname(command), match[2] ?? "");
		if (!isExecutableFile(script, platform)) continue;
		return {
			node: match[1] ?? "node",
			args: [script]
		};
	}
	const npmCmdShim = resolveNpmNodeCmdShim(command, content, platform);
	if (npmCmdShim) return npmCmdShim;
	return null;
}
function resolveNpmNodeCmdShim(command, content, platform) {
	const lines = content.split(/\r?\n/u).map((line) => line.trim());
	if (!lines.some((line) => /^IF EXIST "%dp0%\\node\.exe" \($/iu.test(line)) || !lines.some((line) => /^SET "_prog=node(?:\.exe)?"$/iu.test(line))) return null;
	const invocation = lines.find((line) => line.includes("\"%_prog%\"") && line.endsWith("%*"));
	if (!invocation) return null;
	const match = /(?:^|&)\s*"%_prog%"\s+(.*?)"(%dp0%\\[^"]+)"\s+%\*$/iu.exec(invocation);
	if (!match || (match[1] ?? "").trim()) return null;
	const script = resolve(dirname(command), (match[2] ?? "").replace(/^%dp0%\\/iu, ""));
	if (!isExecutableFile(script, platform)) return null;
	const localNode = resolve(dirname(command), "node.exe");
	return {
		node: isExecutableFile(localNode, platform) ? localNode : "node",
		args: [script]
	};
}
const cmdMetaCharactersRe = /([()\][%!^"`<>&|;, *?])/g;
const jsRuntimeEntrypoints = /* @__PURE__ */ new Set([
	"pnpm",
	"npm",
	"npx",
	"corepack",
	"node",
	"yarn",
	"bun",
	"bunx"
]);
const awsMacosCorepackEntrypoints = /* @__PURE__ */ new Set([
	"pnpm",
	"yarn",
	"corepack"
]);
const awsMacosBunEntrypoints = /* @__PURE__ */ new Set(["bun", "bunx"]);
const awsMacosBunVersion = "1.4.0";
const awsMacosSwiftEntrypoints = /* @__PURE__ */ new Set(["swift", "xcodebuild"]);
const awsMacosSwiftScriptTargets = /* @__PURE__ */ new Set([
	"mac:package",
	"mac:restart",
	"scripts/build-and-run-mac.sh",
	"scripts/package-mac-app.sh",
	"scripts/package-mac-dist.sh",
	"scripts/restart-mac.sh"
]);
const awsMacosPackageManagerScriptTargets = /* @__PURE__ */ new Set([
	"scripts/package-mac-app.sh",
	"scripts/package-mac-dist.sh",
	"scripts/restart-mac.sh"
]);
const shellControlCommandPrefixes = /* @__PURE__ */ new Set([
	"if",
	"while",
	"until",
	"then",
	"do",
	"else",
	"elif",
	"!"
]);
const shellCommandExecutionPrefixes = /* @__PURE__ */ new Set(["exec"]);
const shellInlineCommandInterpreters = /* @__PURE__ */ new Set([
	"bash",
	"dash",
	"ksh",
	"sh",
	"zsh"
]);
const remoteChangedGateEnv = [
	"OPENCLAW_CHECK_CHANGED_REMOTE_CHILD=1",
	"OPENCLAW_CHANGED_LANES_RAW_SYNC=1",
	"CI=1"
];
const shellInlineCommandOptionsWithNextValue = /* @__PURE__ */ new Set([
	"+O",
	"+o",
	"-O",
	"-o",
	"--init-file",
	"--rcfile"
]);
const nodeOptionsWithNextValueBeforeScript = /* @__PURE__ */ new Set([
	"--allow-fs-read",
	"--allow-fs-write",
	"--conditions",
	"--cpu-prof-dir",
	"--cpu-prof-interval",
	"--cpu-prof-name",
	"--debug-port",
	"--diagnostic-dir",
	"--disable-proto",
	"--disable-warning",
	"--dns-result-order",
	"--env-file",
	"--env-file-if-exists",
	"--experimental-config-file",
	"--experimental-loader",
	"--experimental-test-isolation",
	"--heap-prof-dir",
	"--heap-prof-interval",
	"--heap-prof-name",
	"--heapsnapshot-near-heap-limit",
	"--heapsnapshot-signal",
	"--icu-data-dir",
	"--import",
	"--inspect-port",
	"--inspect-publish-uid",
	"--initial-old-space-size",
	"--localstorage-file",
	"--loader",
	"--max-http-header-size",
	"--max-old-space-size",
	"--max-old-space-size-percentage",
	"--max-semi-space-size",
	"--network-family-autoselection-attempt-timeout",
	"--openssl-config",
	"--redirect-warnings",
	"--report-dir",
	"--report-directory",
	"--report-filename",
	"--report-signal",
	"--require",
	"--secure-heap",
	"--secure-heap-min",
	"--snapshot-blob",
	"--test-concurrency",
	"--test-coverage-branches",
	"--test-coverage-exclude",
	"--test-coverage-functions",
	"--test-coverage-include",
	"--test-coverage-lines",
	"--test-global-setup",
	"--test-isolation",
	"--test-name-pattern",
	"--test-reporter",
	"--test-reporter-destination",
	"--test-rerun-failures",
	"--test-shard",
	"--test-skip-pattern",
	"--test-timeout",
	"--title",
	"--tls-cipher-list",
	"--tls-keylog",
	"--trace-event-categories",
	"--trace-event-file-pattern",
	"--trace-require-module",
	"--unhandled-rejections",
	"--use-largepages",
	"--v8-pool-size",
	"--watch-kill-signal",
	"--watch-path",
	"-C",
	"-r"
]);
const nodeOptionsWithoutScript = /* @__PURE__ */ new Set([
	"--build-sea",
	"--build-snapshot",
	"--build-snapshot-config",
	"--check",
	"--completion-bash",
	"--eval",
	"--experimental-sea-config",
	"--help",
	"--input-type",
	"--interactive",
	"--print",
	"--prof-process",
	"--run",
	"--v8-options",
	"--version",
	"-c",
	"-e",
	"-h",
	"-i",
	"-p",
	"-v"
]);
function escapeBatchCommand(command) {
	return command.replace(cmdMetaCharactersRe, "^$1");
}
function escapeBatchArgument(arg) {
	let escaped = arg;
	escaped = escaped.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\"");
	escaped = escaped.replace(/(?=(\\+?)?)\1$/, "$1$1");
	escaped = `"${escaped}"`;
	escaped = escaped.replace(cmdMetaCharactersRe, "^$1");
	return escaped.replace(cmdMetaCharactersRe, "^$1");
}
function buildBatchCommandLine(command, commandArgs) {
	return `"${[escapeBatchCommand(command), ...commandArgs.map(escapeBatchArgument)].join(" ")}"`;
}
function checkedOutput(command, commandArgs, timeoutMs = resolveMetadataProbeTimeoutMs(process.env)) {
	const invocation = spawnInvocation(command, commandArgs, process.env, process.platform);
	const result = spawnSync(invocation.command, invocation.args, {
		cwd: repoRoot,
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsVerbatimArguments: invocation.windowsVerbatimArguments,
		...timeoutMs === null ? {} : { timeout: timeoutMs },
		killSignal: "SIGKILL"
	});
	return {
		status: result.error?.name === "Error" && result.signal === "SIGKILL" ? 124 : result.status ?? 1,
		text: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
		stdout: (result.stdout ?? "").trim()
	};
}
function recoveryCommand(commandArgs) {
	return [binary, ...commandArgs].map(recoveryCommandArgument).join(" ");
}
function recoveryCommandArgument(value) {
	const text = value;
	if (/^[A-Za-z0-9_./:@%+=,-]+$/u.test(text)) return text;
	if (process.platform === "win32") return `"${text.replaceAll("\"", "\"\"")}"`;
	return `'${text.replaceAll("'", "'\\''")}'`;
}
function probeCrabboxHelp(command, commandArgs) {
	const first = checkedOutput(command, commandArgs);
	if (first.status === 0 && first.text.length > 0) return first;
	return checkedOutput(command, commandArgs, CRABBOX_METADATA_PROBE_RETRY_TIMEOUT_MS);
}
function gitOutput(commandArgs, extraEnv = {}) {
	const gitBinary = resolvePathBinary("git", process.env, process.platform) ?? "git";
	const gitEnv = {
		...process.env,
		...extraEnv,
		GIT_CONFIG_GLOBAL: "/dev/null"
	};
	const invocation = spawnInvocation(gitBinary, commandArgs, gitEnv, process.platform);
	const result = spawnSync(invocation.command, invocation.args, {
		cwd: repoRoot,
		encoding: "utf8",
		env: gitEnv,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	return {
		status: result.status ?? 1,
		text: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim(),
		stdout: (result.stdout ?? "").trim()
	};
}
let resolvedCrabboxConfigCache;
function resolvedCrabboxConfig() {
	if (resolvedCrabboxConfigCache !== void 0) return resolvedCrabboxConfigCache;
	const result = checkedOutput(binary, [
		"config",
		"show",
		"--json"
	]);
	if (result.status !== 0) {
		resolvedCrabboxConfigCache = null;
		return resolvedCrabboxConfigCache;
	}
	try {
		const parsed = JSON.parse(result.stdout || result.text);
		resolvedCrabboxConfigCache = isRecord(parsed) ? parsed : null;
	} catch {
		resolvedCrabboxConfigCache = null;
	}
	return resolvedCrabboxConfigCache;
}
function envProvider() {
	const envProviderValue = process.env.CRABBOX_PROVIDER?.trim();
	if (envProviderValue) return envProviderValue;
	return "";
}
function configProvider() {
	const resolved = resolvedCrabboxConfig()?.provider;
	if (typeof resolved === "string" && resolved.trim()) return resolved.trim();
	try {
		return readFileSync(resolve(repoRoot, ".crabbox.yaml"), "utf8").match(/^provider:\s*([^\s#]+)/m)?.[1] ?? "aws";
	} catch {
		return "aws";
	}
}
function effectiveTargetContext(commandArgs) {
	const config = resolvedCrabboxConfig();
	const configuredTarget = typeof config?.target === "string" ? config.target.trim() : "";
	const configuredWindowsMode = typeof config?.windowsMode === "string" ? config.windowsMode.trim() : "";
	return {
		target: (optionValue(commandArgs, "--target") || process.env.CRABBOX_TARGET?.trim() || process.env.CRABBOX_TARGET_OS?.trim() || configuredTarget).toLowerCase(),
		windowsMode: (optionValue(commandArgs, "--windows-mode") || process.env.CRABBOX_WINDOWS_MODE?.trim() || configuredWindowsMode).toLowerCase()
	};
}
let commandValueOptionsFromHelp;
function parseCommandValueOptionsFromHelp(text) {
	const names = /* @__PURE__ */ new Set();
	for (const line of text.split(/\r?\n/u)) {
		const match = line.match(/^\s+-{1,2}([a-z0-9][a-z0-9-]*)\s+(?:string|duration|int|float|value)\b/u);
		if (match) names.add(match[1] ?? "");
	}
	return names;
}
function commandOptionName(arg) {
	return arg.replace(/^-+/u, "").split("=", 1)[0] ?? "";
}
function parseCommandInvocation(helpText, commandArgs) {
	commandValueOptionsFromHelp ??= parseCommandValueOptionsFromHelp(helpText);
	const routedCommand = isWorkloadRoutedCommand(commandArgs);
	const optionStart = routedCommand ? commandUserArgStart(commandArgs) : 0;
	let start = -1;
	let optionEnd = routedCommand ? commandArgs.length : commandArgs.indexOf("--");
	optionEnd = optionEnd < 0 ? commandArgs.length : optionEnd;
	if (routedCommand) for (let index = optionStart; index < commandArgs.length; index += 1) {
		const arg = commandArgs[index] ?? "";
		if (arg === "--") {
			start = index + 1;
			optionEnd = index;
			break;
		}
		if (arg === "-" || !arg.startsWith("-")) {
			start = index;
			optionEnd = index;
			break;
		}
		if (!arg.includes("=") && commandValueOptionsFromHelp.has(commandOptionName(arg))) index += 1;
	}
	const optionEntries = [];
	const options = /* @__PURE__ */ new Map();
	for (let index = optionStart; index < optionEnd; index += 1) {
		const arg = commandArgs[index] ?? "";
		if (!arg.startsWith("-")) continue;
		const name = commandOptionName(arg);
		const assigned = arg.indexOf("=");
		const consumesValue = !routedCommand || commandValueOptionsFromHelp.has(name);
		const entry = {
			index,
			value: assigned >= 0 ? arg.slice(assigned + 1) : consumesValue ? commandArgs[index + 1] ?? "" : ""
		};
		optionEntries.push({
			name,
			...entry
		});
		if (!options.has(name)) options.set(name, entry);
		if (routedCommand && assigned < 0 && consumesValue) index += 1;
	}
	const fileScript = optionEntries.findLast(({ name }) => name === "script");
	const stdinScript = optionEntries.findLast(({ name }) => name === "script-stdin");
	const invalidStdin = optionEntries.some(({ name, index, value }) => name === "script-stdin" && commandArgs[index]?.includes("=") && !/^(?:1|t|T|true|TRUE|True|0|f|F|false|FALSE|False)$/u.test(value));
	const stdinEnabled = Boolean(stdinScript && (!commandArgs[stdinScript.index]?.includes("=") || /^(?:1|t|T|true|TRUE|True)$/u.test(stdinScript.value)));
	return {
		args: commandArgs,
		scriptRequested: !invalidStdin && Boolean(fileScript?.value || stdinEnabled),
		script: invalidStdin || fileScript?.value && stdinEnabled ? void 0 : fileScript?.value ? fileScript : stdinEnabled ? stdinScript : void 0,
		commandArgs: start >= 0 ? commandArgs.slice(start) : [],
		optionEntries,
		options,
		optionEnd,
		start
	};
}
function commandProvider(commandArgsInput) {
	return optionValue(commandArgsInput, "--provider");
}
function selectedProvider(commandArgs, advertisedProviders = []) {
	const targetContext = effectiveTargetContext(commandArgs);
	if (workloadOption === null) return {
		provider: "",
		source: "policy",
		workload: "",
		chain: [],
		error: "--workload requires a value"
	};
	const workload = requestedWorkload(commandArgs);
	if (workload === null) return {
		provider: "",
		source: "policy",
		workload: workloadOption ?? process.env.OPENCLAW_CRABBOX_WORKLOAD ?? "",
		chain: [],
		error: `unsupported Crabbox workload ${JSON.stringify(workloadOption ?? process.env.OPENCLAW_CRABBOX_WORKLOAD)}`
	};
	if (workload === "windows" && targetContext.target !== "windows") return {
		provider: "",
		source: "policy",
		workload,
		chain: [],
		error: "Crabbox workload=windows requires target=windows"
	};
	const configured = canonicalProviderName(configProvider());
	const chain = workload ? crabboxProviderChain({
		workload,
		configuredProvider: configured,
		target: targetContext.target,
		advertisedProviders: advertisedProviders.map(canonicalProviderName)
	}) : [];
	if (workload === "untrusted" && hasOption(commandArgs, "--id")) return {
		provider: "",
		source: "policy",
		workload,
		chain,
		error: "Crabbox workload=untrusted requires a fresh lease; --id reuse is forbidden without persisted workload provenance"
	};
	const explicitProvider = commandProvider(commandArgs);
	if (explicitProvider) {
		const canonicalExplicitProvider = canonicalProviderName(explicitProvider);
		if (workload && !chain.includes(canonicalExplicitProvider)) return {
			provider: "",
			source: "explicit",
			workload,
			chain,
			error: `provider=${canonicalExplicitProvider} is not eligible for workload=${workload}; allowed=${chain.join(",") || "none"}`
		};
		return {
			provider: explicitProvider,
			source: "explicit",
			workload,
			chain
		};
	}
	const environmentProvider = envProvider();
	if (environmentProvider) {
		const canonicalEnvironmentProvider = canonicalProviderName(environmentProvider);
		if (workload && !chain.includes(canonicalEnvironmentProvider)) return {
			provider: "",
			source: "environment",
			workload,
			chain,
			error: `provider=${canonicalEnvironmentProvider} is not eligible for workload=${workload}; allowed=${chain.join(",") || "none"}`
		};
		return {
			provider: environmentProvider,
			source: "environment",
			workload,
			chain
		};
	}
	if (workload && hasOption(commandArgs, "--id")) return {
		provider: "",
		source: "policy",
		workload,
		chain: [],
		error: "reusing a workload-routed lease with --id requires --provider (or CRABBOX_PROVIDER) from the originating route"
	};
	if (!workload && shouldPreferAzureForWindows(commandArgs, advertisedProviders)) return {
		provider: "azure",
		source: "windows-default",
		workload: "",
		chain: []
	};
	if (!workload) return {
		provider: configured,
		source: "config",
		workload: "",
		chain: []
	};
	const readiness = /* @__PURE__ */ new Map();
	let selectedProviderName = "";
	for (const candidate of chain) {
		const status = crabboxProviderReadiness(candidate, targetContext);
		readiness.set(candidate, status);
		if (status.ready) {
			selectedProviderName = candidate;
			break;
		}
	}
	if (!selectedProviderName) return {
		provider: "",
		source: "policy",
		workload,
		chain,
		readiness,
		error: `no ready provider for workload=${workload}`
	};
	return {
		provider: selectedProviderName,
		source: "policy",
		workload,
		chain,
		readiness
	};
}
function requestedWorkload(commandArgs) {
	if (!isWorkloadRoutedCommand(commandArgs)) return "";
	const raw = workloadOption ?? process.env.OPENCLAW_CRABBOX_WORKLOAD?.trim() ?? "";
	if (!raw) return "";
	return normalizeCrabboxWorkload(raw);
}
function crabboxProviderReadiness(provider, context) {
	const canonicalProvider = canonicalProviderName(provider);
	const doctorArgs = [
		"doctor",
		"--provider",
		canonicalProvider
	];
	if (context.target) doctorArgs.push("--target", context.target);
	if (context.target === "windows" && context.windowsMode) doctorArgs.push("--windows-mode", context.windowsMode);
	doctorArgs.push("--json");
	const doctor = checkedOutput(binary, doctorArgs, null);
	const result = parseDoctorResult(doctor.stdout, canonicalProvider, doctor.status);
	const managed = [
		"aws",
		"azure",
		"daytona"
	].includes(canonicalProvider);
	const broker = result?.checks.find((check) => check.check === "broker");
	const brokerReady = !managed || broker?.status === "ok";
	const brokerAuthFailure = result?.checks.some((check) => check.status === "failed" && check.details?.class === "broker_auth") === true;
	const ready = result?.ok === true && brokerReady;
	const diagnostic = compactDiagnosticText(doctor.text);
	return {
		ready,
		reason: ready ? "doctor-ready" : result ? `doctor exited ${doctor.status}${diagnostic ? `: ${diagnostic}` : ""}` : `invalid doctor JSON${diagnostic ? `: ${diagnostic}` : ""}`,
		...ready ? {} : { recovery: `run \`${recoveryCommand(doctorArgs)}\`` },
		brokerReady,
		brokerAuthFailure
	};
}
function isDoctorCheck(value) {
	return isRecord(value) && typeof value.status === "string" && Boolean(value.status) && typeof value.check === "string" && Boolean(value.check) && (value.details === void 0 || isRecord(value.details) && Object.values(value.details).every((detail) => typeof detail === "string"));
}
function parseDoctorResult(value, provider, status) {
	try {
		const parsed = JSON.parse(value);
		if (!isRecord(parsed) || typeof parsed.ok !== "boolean" || parsed.provider !== provider || !Array.isArray(parsed.checks) || (parsed.ok ? status !== 0 : status !== 1)) return null;
		const checks = parsed.checks;
		if (!checks.every(isDoctorCheck) || parsed.ok !== checks.every((check) => !["failed", "missing"].includes(check.status.trim().toLowerCase()))) return null;
		return parsed;
	} catch {
		return null;
	}
}
function compactDiagnosticText(value, maxLength = 500) {
	const compact = value.replace(/\s+/gu, " ").trim();
	if (compact.length <= maxLength) return compact;
	return `${compact.slice(0, Math.max(0, maxLength - 3))}...`;
}
function formatProviderReadiness(readiness) {
	return [...readiness.entries()].map(([candidate, status]) => `${candidate}:${status.ready ? "ready" : status.reason}`).join(",");
}
function providerRecoveryAdvice(readiness) {
	return [...new Set([...readiness.values()].map((status) => status.recovery).filter((recovery) => typeof recovery === "string" && recovery.length > 0))];
}
function shouldRequireBrokeredCloud(commandArgs, provider, explicit = false) {
	const canonicalProvider = canonicalProviderName(provider);
	if (![
		"aws",
		"azure",
		"daytona"
	].includes(canonicalProvider)) return false;
	if (requestedWorkload(commandArgs)) return true;
	if (explicit && directCloudOverrideEnabled(provider)) return false;
	return commandArgs[0] === "run" || commandArgs[0] === "warmup" || commandArgs[0] === "actions" && commandArgs[1] === "hydrate";
}
function directCloudOverrideEnabled(providerName) {
	return canonicalProviderName(providerName) !== "aws" && process.env.OPENCLAW_CRABBOX_ALLOW_DIRECT_CLOUD === "1";
}
function enforceBrokeredCloud(commandArgs, provider, explicit, routedReadiness) {
	if (!shouldRequireBrokeredCloud(commandArgs, provider, explicit)) return;
	const canonicalProvider = canonicalProviderName(provider);
	const readiness = routedReadiness ?? crabboxProviderReadiness(canonicalProvider, effectiveTargetContext(commandArgs));
	if ("brokerAuthFailure" in readiness && readiness.brokerAuthFailure) {
		const instructions = [`[crabbox] provider=${canonicalProvider} requires managed Crabbox broker authentication for OpenClaw proof.`, `[crabbox] run \`${recoveryCommand([
			"login",
			"--url",
			"https://crabbox.openclaw.ai"
		])}\`, then retry.`];
		if (canonicalProvider !== "aws") instructions.push(`[crabbox] direct ${canonicalProvider} debugging requires an original \`--provider ${canonicalProvider}\`, no \`--workload\`, and OPENCLAW_CRABBOX_ALLOW_DIRECT_CLOUD=1.`);
		console.error(instructions.join("\n"));
		process.exit(2);
	}
	if (!("brokerReady" in readiness) || !readiness.brokerReady) {
		console.error([`[crabbox] provider=${canonicalProvider} failed readiness for OpenClaw proof: ${readiness.reason}.`, ...readiness.recovery ? [`[crabbox] recovery: ${readiness.recovery}.`] : []].join("\n"));
		process.exit(2);
	}
}
function optionValue(commandArgsInput, name) {
	return parseCommandInvocation(help.text, commandArgsInput).options.get(commandOptionName(name))?.value ?? "";
}
function hasOption(commandArgsInput, name) {
	return parseCommandInvocation(help.text, commandArgsInput).options.has(commandOptionName(name));
}
function commandOptionEnd(commandArgs) {
	return parseCommandInvocation(help.text, commandArgs).optionEnd;
}
function shouldPreferAzureForWindows(commandArgs, advertisedProviders = []) {
	return ["run", "warmup"].includes(commandArgs[0] ?? "") && isWindowsRemoteTarget(commandArgs) && !commandProvider(commandArgs) && !envProvider() && !hasOption(commandArgs, "--id") && advertisedProviders.includes("azure");
}
function ensureAzureWindowsProvider(commandArgs, provider, advertised = []) {
	if (provider !== "azure" || !shouldPreferAzureForWindows(commandArgs, advertised)) return commandArgs;
	const optionEnd = commandOptionEnd(commandArgs);
	const normalizedArgs = [...commandArgs];
	normalizedArgs.splice(optionEnd, 0, "--provider", "azure");
	return normalizedArgs;
}
function ensurePolicyProvider(commandArgs, selection) {
	if (selection.source !== "policy" || !selection.provider || commandProvider(commandArgs) || envProvider()) return commandArgs;
	const normalizedArgs = [...commandArgs];
	const optionEnd = commandOptionEnd(normalizedArgs);
	normalizedArgs.splice(optionEnd, 0, "--provider", selection.provider);
	return normalizedArgs;
}
function ensureAwsMacOnDemandMarket(commandArgs, providerName) {
	if (!["run", "warmup"].includes(commandArgs[0] ?? "") || providerName !== "aws" || optionValue(commandArgs, "--target") !== "macos" || hasOption(commandArgs, "--market") || hasOption(commandArgs, "--id")) return commandArgs;
	const optionEnd = commandOptionEnd(commandArgs);
	const normalizedArgs = [...commandArgs];
	normalizedArgs.splice(optionEnd, 0, "--market", "on-demand");
	return normalizedArgs;
}
function ensureNativeWindowsHydrateJob(commandArgs) {
	if (commandArgs[0] !== "actions" || commandArgs[1] !== "hydrate" || !isNativeWindowsRemoteTarget(commandArgs)) return commandArgs;
	const invocation = parseCommandInvocation(help.text, commandArgs);
	const job = invocation.options.get("job");
	if (job?.value && job.value !== "hydrate") return commandArgs;
	const normalizedArgs = [...commandArgs];
	const replacementJob = "hydrate-windows-daemon";
	if (job) {
		const arg = normalizedArgs[job.index] ?? "";
		if (arg.includes("=")) normalizedArgs[job.index] = `${arg.slice(0, arg.indexOf("=") + 1)}${replacementJob}`;
		else normalizedArgs[job.index + 1] = replacementJob;
	} else normalizedArgs.splice(invocation.optionEnd, 0, "--job", replacementJob);
	return normalizedArgs;
}
const localPathRunOptions = /* @__PURE__ */ new Set([
	"capture-stderr",
	"capture-stdout",
	"emit-proof",
	"env-from-profile",
	"script"
]);
function repoRelativePath(value) {
	if (!value || value === "-" || isAbsolute(value)) return value;
	return resolve(repoRoot, value);
}
function repoRelativeDownload(value) {
	const split = value.indexOf("=");
	if (split < 0) return value;
	return `${value.slice(0, split + 1)}${repoRelativePath(value.slice(split + 1))}`;
}
function absolutizeLocalRunPaths(commandArgs) {
	if (commandArgs[0] !== "run") return commandArgs;
	const normalizedArgs = [...commandArgs];
	const invocation = parseCommandInvocation(help.text, normalizedArgs);
	for (const { index, name: optionName } of invocation.optionEntries) {
		const arg = normalizedArgs[index] ?? "";
		const absolutize = optionName === "download" ? repoRelativeDownload : repoRelativePath;
		if (localPathRunOptions.has(optionName) || optionName === "download") {
			const equals = arg.indexOf("=");
			if (equals >= 0) normalizedArgs[index] = `${arg.slice(0, equals + 1)}${absolutize(arg.slice(equals + 1))}`;
			else if (index + 1 < invocation.optionEnd) normalizedArgs[index + 1] = absolutize(normalizedArgs[index + 1] ?? "");
		}
	}
	return normalizedArgs;
}
function pathExists(path) {
	try {
		statSync(path);
		return true;
	} catch {
		return false;
	}
}
function crabboxConfigDir() {
	if (process.platform === "darwin") return resolve(homedir(), "Library", "Application Support", "crabbox");
	if (process.platform === "win32") return resolve(process.env.APPDATA || resolve(homedir(), "AppData", "Roaming"), "crabbox");
	return resolve(process.env.XDG_CONFIG_HOME || resolve(homedir(), ".config"), "crabbox");
}
function userDisplayPath(path) {
	const home = homedir();
	const rel = relative(home, path);
	if (rel && !rel.startsWith("..") && !isAbsolute(rel)) return `~/${rel}`;
	return path;
}
function blacksmithTestboxPrivateKeyPath(id) {
	return resolve(crabboxConfigDir(), "testboxes", id, "id_ed25519");
}
function blacksmithTestboxClaimPath(id) {
	return resolve(blacksmithTestboxClaimsDir(), `${id}.json`);
}
function blacksmithTestboxClaimsDir() {
	const configuredStateRoot = process.env.XDG_STATE_HOME?.trim();
	const stateDir = configuredStateRoot ? resolve(configuredStateRoot, "crabbox") : resolve(crabboxConfigDir(), "state");
	return resolve(stateDir, "claims");
}
function blacksmithTestboxClaimRepoRoot(id) {
	const claimPath = blacksmithTestboxClaimPath(id);
	if (!pathExists(claimPath)) return "";
	const claim = JSON.parse(readFileSync(claimPath, "utf8"));
	return typeof claim.repoRoot === "string" ? claim.repoRoot : "";
}
function enforceCrabboxOwnedBlacksmithLease(commandArgs) {
	if (commandArgs[0] !== "run") return;
	const id = optionValue(commandArgs, "--id");
	if (!id) return;
	if (!id.startsWith("tbx_")) return;
	const keyPath = blacksmithTestboxPrivateKeyPath(id);
	if (!pathExists(keyPath)) {
		console.error([
			`[crabbox] provider=blacksmith-testbox --id ${id} has no Crabbox SSH key at ${userDisplayPath(keyPath)}.`,
			"[crabbox] create reusable Testboxes through Crabbox before reusing them: node scripts/crabbox-wrapper.mjs warmup --provider blacksmith-testbox --idle-timeout 90m",
			"[crabbox] direct `blacksmith testbox warmup` leases can be used with `blacksmith testbox run`, but Crabbox cannot sync or run them by id."
		].join("\n"));
		process.exit(2);
	}
	const claimRepoRoot = blacksmithTestboxClaimRepoRoot(id);
	if (claimRepoRoot && claimRepoRoot !== repoRoot && !hasOption(commandArgs, "--reclaim")) {
		console.error(`[crabbox] lease ${id} is claimed by repo ${claimRepoRoot}; use --reclaim to claim it for ${repoRoot}`);
		process.exit(2);
	}
}
function restoreTemporaryBlacksmithTestboxClaimPath(claimPath) {
	const original = readFileSync(claimPath, "utf8");
	const claim = JSON.parse(original);
	if (!claim || typeof claim !== "object" || claim.repoRoot !== childCwd) return;
	claim.repoRoot = repoRoot;
	const temporaryPath = `${claimPath}.tmp-${process.pid}-${Date.now()}`;
	try {
		writeFileSync(temporaryPath, `${JSON.stringify(claim)}\n`, {
			encoding: "utf8",
			mode: 384
		});
		if (readFileSync(claimPath, "utf8") !== original) return;
		renameSync(temporaryPath, claimPath);
	} finally {
		rmSync(temporaryPath, { force: true });
	}
}
function restoreTemporaryBlacksmithTestboxClaim(commandArgs, capturedLeaseId) {
	if (childCwd === repoRoot) return true;
	const exactLeaseId = (commandArgs[0] === "run" ? optionValue(commandArgs, "--id") : "") || capturedLeaseId;
	const canCreateRetainedLease = commandArgs[0] === "warmup" || commandArgs[0] === "run" && (hasOption(commandArgs, "--keep") || hasOption(commandArgs, "--keep-on-failure"));
	let claimPaths = [];
	if (exactLeaseId) claimPaths = [blacksmithTestboxClaimPath(exactLeaseId)];
	else if (canCreateRetainedLease) try {
		const claimsDir = blacksmithTestboxClaimsDir();
		if (pathExists(claimsDir)) claimPaths = readdirSync(claimsDir).filter((entry) => entry.endsWith(".json")).map((entry) => resolve(claimsDir, entry));
	} catch (error) {
		console.error(`[crabbox] warning: failed to inspect temporary Testbox claims: ${error instanceof Error ? error.message : String(error)}`);
		return false;
	}
	else return true;
	let restored = true;
	for (const claimPath of claimPaths) {
		if (!pathExists(claimPath)) continue;
		try {
			restoreTemporaryBlacksmithTestboxClaimPath(claimPath);
		} catch (error) {
			restored = false;
			console.error(`[crabbox] warning: failed to restore temporary Testbox claim: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
	return restored;
}
function observeBlacksmithTimingJSONLine(line) {
	const value = line.trim();
	if (!value.startsWith("{") || !value.endsWith("}")) return;
	try {
		const report = JSON.parse(value);
		if (canonicalProviderName(report?.provider) === "blacksmith-testbox" && typeof report.leaseId === "string" && report.leaseId.startsWith("tbx_")) capturedBlacksmithLeaseId = report.leaseId;
	} catch {}
}
function shellQuote(value) {
	const text = value;
	if (text === "") return "''";
	if (/^[A-Za-z0-9_./:=@%+-]+$/u.test(text)) return text;
	return `'${text.replaceAll("'", "'\\''")}'`;
}
function shellJoin(commandArgs) {
	return commandArgs.map(shellQuote).join(" ");
}
function powershellQuote(value) {
	const text = value;
	if (text === "") return "''";
	if (/^[A-Za-z0-9_./:=%+-]+$/u.test(text)) return text;
	return `'${text.replaceAll("'", "''")}'`;
}
function powershellJoin(commandArgs) {
	return commandArgs.map(powershellQuote).join(" ");
}
function isLocalContainerProvider(providerName) {
	return [
		"local-container",
		"docker",
		"container",
		"local-docker"
	].includes(providerName);
}
function replaceRunPayload(invocation, payload) {
	const normalizedArgs = [...invocation.args];
	normalizedArgs.splice(invocation.start, normalizedArgs.length - invocation.start, ...payload);
	return normalizedArgs;
}
function renderRunShellCommand(invocation, join = shellJoin) {
	return invocation.options.has("shell") && invocation.commandArgs.length === 1 ? invocation.commandArgs[0] : join(invocation.commandArgs);
}
function replaceRunCommandWithShell(initialInvocation, shellCommand) {
	let invocation = initialInvocation;
	if (!invocation.options.has("shell")) {
		const normalizedArgs = [...invocation.args];
		normalizedArgs.splice(invocation.optionEnd, 0, "--shell");
		invocation = parseCommandInvocation(help.text, normalizedArgs);
	}
	return replaceRunPayload(invocation, [shellCommand]);
}
function normalizedCommandWords(commandArgs) {
	const words = commandArgs.length === 1 ? (commandArgs[0] ?? "").split(/\s+/u) : [...commandArgs];
	while (/^[A-Za-z_][A-Za-z0-9_]*=/.test(words[0] ?? "")) words.shift();
	return words.map((word) => word.replace(/^['"]|['";|&()]+$/g, ""));
}
function commandRuntimeEntrypoint(commandArgs) {
	if (commandArgs.length === 1) {
		for (const candidateWords of shellCommandWordCandidates(commandArgs[0] ?? "")) {
			const shellRuntime = commandWordsRuntimeEntrypoint(candidateWords);
			if (shellRuntime) return shellRuntime;
		}
		return "";
	}
	const directRuntime = commandWordsRuntimeEntrypoint(normalizedCommandWords(commandArgs));
	if (directRuntime) return directRuntime;
	return "";
}
function commandWordsRuntimeEntrypoint(wordsInput) {
	let words = wordsInput;
	words = normalizeExecutableWords(words);
	const first = (words[0] ?? "").split("/").pop() ?? "";
	if (jsRuntimeEntrypoints.has(first)) return first;
	const inlineCommand = shellInlineCommand(words);
	if (!inlineCommand) return "";
	for (const candidateWords of shellCommandWordCandidates(inlineCommand)) {
		const shellRuntime = commandWordsRuntimeEntrypoint(candidateWords);
		if (shellRuntime) return shellRuntime;
	}
	return "";
}
function commandWordsShellEntrypoint(wordsInput) {
	const first = shellWordBasename(normalizeExecutableWords(wordsInput)[0]);
	return shellInlineCommandInterpreters.has(first) ? first : "";
}
function commandNeedsAwsMacosPackageManager(commandArgs, options = {}) {
	if (isChangedGateCommand(commandArgs)) return true;
	if (commandNeedsEntrypoint(commandArgs, awsMacosCorepackEntrypoints, options)) return true;
	if (commandArgs.length === 1) return shellCommandWordCandidates(commandArgs[0] ?? "").some((words) => commandWordsNeedAwsMacosPackageManager(words, options));
	return commandWordsNeedAwsMacosPackageManager(normalizedCommandWords(commandArgs), options);
}
function commandNeedsAwsMacosBun(commandArgs) {
	return commandNeedsEntrypoint(commandArgs, awsMacosBunEntrypoints);
}
function commandNeedsAwsMacosSwiftToolchain(commandArgs) {
	if (commandArgs.length === 1) return shellCommandWordCandidates(commandArgs[0] ?? "").some(commandWordsNeedAwsMacosSwiftToolchain);
	return commandWordsNeedAwsMacosSwiftToolchain(normalizedCommandWords(commandArgs));
}
function commandWordsNeedAwsMacosSwiftToolchain(wordsInput) {
	let words = wordsInput;
	words = normalizeExecutableWords(words);
	const first = (words[0] ?? "").split("/").pop() ?? "";
	if (isSupportedSystemEnvCommand(first)) {
		const targetWords = [...words];
		if (stripEnvCommandOptions(targetWords, { canShimIgnoreEnvironment: true })) return commandWordsNeedAwsMacosSwiftToolchain(targetWords);
	}
	if (awsMacosSwiftEntrypoints.has(first)) return true;
	if (first === "pnpm") {
		const scriptName = words[1] === "run" ? words[2] : words[1];
		if (awsMacosSwiftScriptTargets.has(scriptName ?? "")) return true;
	}
	if (isAwsMacosSwiftScriptTarget(words[0])) return true;
	if (commandWordsRunAwsMacosSwiftScript(words)) return true;
	const inlineCommand = shellInlineCommand(words);
	if (!inlineCommand) return false;
	return shellCommandWordCandidates(inlineCommand).some(commandWordsNeedAwsMacosSwiftToolchain);
}
function commandWordsNeedAwsMacosPackageManager(wordsInput, options = {}) {
	let words = wordsInput;
	const originalFirst = shellWordBasename(normalizedCommandWords(wordsInput)[0]);
	const canShimIgnoreEnvironment = options.canShimIgnoreEnvironment !== false;
	words = normalizeExecutableWords(words);
	if (isSupportedSystemEnvCommand((words[0] ?? "").split("/").pop() ?? "")) {
		const targetWords = [...words];
		if (stripEnvCommandOptions(targetWords, { canShimIgnoreEnvironment: canShimIgnoreEnvironment && isSupportedSystemEnvCommand(originalFirst) })) return commandWordsNeedAwsMacosPackageManager(targetWords, options);
	}
	if (isAwsMacosPackageManagerScriptTarget(words[0])) return true;
	if (commandWordsRunAwsMacosPackageManagerScript(words)) return true;
	const inlineCommand = shellInlineCommand(words);
	if (!inlineCommand) return false;
	return shellCommandWordCandidates(inlineCommand).some((candidateWords) => commandWordsNeedAwsMacosPackageManager(candidateWords, options));
}
function isAwsMacosSwiftScriptTarget(word) {
	if (!word) return false;
	const normalized = word.replace(/^\.\//u, "");
	return awsMacosSwiftScriptTargets.has(normalized) || awsMacosSwiftScriptTargets.has(normalized.split("/").pop() ?? "");
}
function isAwsMacosPackageManagerScriptTarget(word) {
	if (!word) return false;
	const normalized = word.replace(/^\.\//u, "");
	return awsMacosPackageManagerScriptTargets.has(normalized) || awsMacosPackageManagerScriptTargets.has(normalized.split("/").pop() ?? "");
}
function commandWordsRunScriptTarget(words, isScriptTarget) {
	const first = (words[0] ?? "").split("/").pop() ?? "";
	if (!shellInlineCommandInterpreters.has(first)) return false;
	for (let index = 1; index < words.length; index += 1) {
		const word = words[index] ?? "";
		if (!word) return false;
		if (word === "--") continue;
		if (word === "-c" || /^-[^-]*c/u.test(word)) return false;
		if (shellInlineCommandOptionConsumesNextValue(word)) {
			index += 1;
			continue;
		}
		if (word.startsWith("-") || word.startsWith("+")) continue;
		return isScriptTarget(word);
	}
	return false;
}
function commandWordsRunAwsMacosSwiftScript(words) {
	return commandWordsRunScriptTarget(words, isAwsMacosSwiftScriptTarget);
}
function commandWordsRunAwsMacosPackageManagerScript(words) {
	return commandWordsRunScriptTarget(words, isAwsMacosPackageManagerScriptTarget);
}
function commandNeedsEntrypoint(commandArgs, entrypoints, options = {}) {
	if (commandArgs.length === 1) return shellCommandWordCandidates(commandArgs[0] ?? "").some((words) => commandWordsNeedEntrypoint(words, entrypoints, options));
	return commandWordsNeedEntrypoint(normalizedCommandWords(commandArgs), entrypoints, options);
}
function commandWordsNeedEntrypoint(wordsInput, entrypoints, options = {}) {
	let words = wordsInput;
	words = normalizeExecutableWords(words, options);
	const first = (words[0] ?? "").split("/").pop() ?? "";
	if (entrypoints.has(first)) return true;
	const inlineCommand = shellInlineCommand(words);
	if (!inlineCommand) return false;
	return shellCommandWordCandidates(inlineCommand).some((candidateWords) => commandWordsNeedEntrypoint(candidateWords, entrypoints, options));
}
function isChangedGateCommand(commandArgs) {
	if (commandArgs.length === 1) return shellCommandWordCandidates(commandArgs[0] ?? "").some((words) => isChangedGateCommandWords(words));
	return isChangedGateCommandWords(normalizedCommandWords(commandArgs), { canShimIgnoreEnvironment: shellWordBasename(commandArgs[0]) === "env" });
}
function changedGateBases(commandArgs) {
	const candidates = commandArgs.length === 1 ? shellCommandWordCandidates(commandArgs[0] ?? "") : [normalizedCommandWords(commandArgs)];
	const bases = [];
	for (const words of candidates) bases.push(...changedGateBasesFromWords(words, { canShimIgnoreEnvironment: shellWordBasename(commandArgs[0]) === "env" }));
	return bases;
}
function changedGateBasesFromWords(wordsInput, options = {}) {
	const words = normalizeExecutableWords(wordsInput, options);
	if (isChangedGateWords(words)) {
		for (let index = 0; index < words.length; index += 1) {
			const word = words[index] ?? "";
			if (word === "--base") return [words[index + 1] || "origin/main"];
			if (word.startsWith("--base=")) return [word.slice(7) || "origin/main"];
		}
		return ["origin/main"];
	}
	const inlineCommand = shellInlineCommand(words);
	if (!inlineCommand) return [];
	const bases = [];
	for (const candidateWords of shellCommandWordCandidates(inlineCommand)) bases.push(...changedGateBasesFromWords(candidateWords));
	return bases;
}
function isChangedGateCommandWords(wordsInput, options = {}) {
	let words = wordsInput;
	words = normalizeExecutableWords(words, options);
	if (isChangedGateWords(words)) return true;
	const inlineCommand = shellInlineCommand(words);
	return inlineCommand ? shellCommandWordCandidates(inlineCommand).some((candidateWords) => isChangedGateCommandWords(candidateWords)) : false;
}
function isChangedGateWords(wordsInput) {
	let words = wordsInput;
	words = normalizeExecutableWords(words);
	if (words[0] === "corepack") words.shift();
	return words[0] === "pnpm" && words[1] === "check:changed" || words[0] === "pnpm" && words[1] === "run" && words[2] === "check:changed" || nodeScriptWord(words)?.endsWith("scripts/check-changed.mjs");
}
function nodeScriptWord(words) {
	if (shellWordBasename(words[0]) !== "node") return "";
	for (let index = 1; index < words.length; index += 1) {
		const word = words[index] ?? "";
		if (!word) return "";
		if (word === "--") return words[index + 1] ?? "";
		if (nodeOptionsWithoutScript.has(word) || nodeOptionsWithoutScriptPrefix(word)) return "";
		const valueMode = nodeOptionValueModeBeforeScript(word);
		if (valueMode === "next") {
			index += 1;
			continue;
		}
		if (valueMode === "inline") continue;
		if (word.startsWith("-") && word !== "-") continue;
		return word;
	}
	return "";
}
function nodeOptionsWithoutScriptPrefix(word) {
	return word.startsWith("--eval=") || word.startsWith("--print=");
}
function nodeOptionValueModeBeforeScript(word) {
	if (nodeOptionsWithNextValueBeforeScript.has(word)) return "next";
	const equalsIndex = word.indexOf("=");
	if (equalsIndex > 0 && nodeOptionsWithNextValueBeforeScript.has(word.slice(0, equalsIndex))) return "inline";
	return "";
}
function shellInlineCommand(words) {
	const command = shellWordBasename(words[0]);
	if (!shellInlineCommandInterpreters.has(command)) return "";
	for (let index = 1; index < words.length; index += 1) {
		const word = words[index] ?? "";
		if (word === "--") return "";
		if (!word.startsWith("-") && !word.startsWith("+")) return "";
		if (word === "-c" || /^-[^-]*c/u.test(word)) return words[index + 1] ?? "";
		if (shellInlineCommandOptionConsumesNextValue(word)) index += 1;
	}
	return "";
}
function shellInlineCommandOptionConsumesNextValue(word) {
	return shellInlineCommandOptionsWithNextValue.has(word) || /^[+-][^-+]*[oO]$/u.test(word);
}
function shellCommandWordCandidates(command) {
	return shellCommandSegments(stripHeredocBodies(command.replace(/\\\r?\n/gu, " ")));
}
function pushShellCandidate(candidates, segment) {
	const words = normalizedShellSegmentWords(segment);
	if (words.length > 0) candidates.push(words);
}
function normalizedShellSegmentWords(segment) {
	const trimmed = segment.trim().replace(/^[({]\s*/u, "");
	if (!trimmed || trimmed.startsWith("#")) return [];
	const words = normalizedCommandWords(splitShellWords(trimmed));
	while (shellControlCommandPrefixes.has(words[0] ?? "")) words.shift();
	return normalizedCommandWords(stripShellExecutionPrefixes(normalizedCommandWords(words)));
}
function normalizeExecutableWords(words, options = {}) {
	return normalizedCommandWords(stripShellExecutionPrefixes(words, options));
}
function stripShellExecutionPrefixes(wordsInput, options = {}) {
	let words = wordsInput;
	words = [...words];
	let canShimIgnoreEnvironment = Boolean(options.canShimIgnoreEnvironment);
	for (;;) {
		const first = shellWordBasename(words[0]);
		if (shellCommandExecutionPrefixes.has(first)) {
			words.shift();
			continue;
		}
		if (first === "command") {
			words.shift();
			if (!stripCommandBuiltinOptions(words)) return words;
			continue;
		}
		if (first === "env") {
			if (!stripEnvCommandOptions(words, { canShimIgnoreEnvironment })) return words;
			canShimIgnoreEnvironment = false;
			continue;
		}
		if (first === "time") {
			words.shift();
			stripTimeOptions(words);
			continue;
		}
		if (first === "timeout") {
			stripTimeoutOptions(words);
			continue;
		}
		return words;
	}
}
function stripEnvCommandOptions(words, { canShimIgnoreEnvironment = true } = {}) {
	const originalWords = [...words];
	const envCommand = words.shift() ?? "";
	const canShimThisEnv = canShimIgnoreEnvironment && isSupportedSystemEnvCommand(envCommand);
	let ignoresEnvironment = false;
	for (;;) {
		const word = words[0] ?? "";
		if (!word) {
			words.splice(0, words.length, ...originalWords);
			return false;
		}
		if (word === "--") {
			words.shift();
			return true;
		}
		if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word)) {
			words.shift();
			continue;
		}
		if (word === "-S" || word === "--split-string") {
			if (ignoresEnvironment) {
				words.splice(0, words.length, ...originalWords);
				return false;
			}
			words.shift();
			const split = splitShellWords(words.shift() ?? "");
			words.unshift(...split);
			return words.length > 0;
		}
		if (word.startsWith("-S") && word !== "-S") {
			if (ignoresEnvironment) {
				words.splice(0, words.length, ...originalWords);
				return false;
			}
			words.shift();
			words.unshift(...splitShellWords(word.slice(2)));
			return words.length > 0;
		}
		if (word.startsWith("--split-string=")) {
			if (ignoresEnvironment) {
				words.splice(0, words.length, ...originalWords);
				return false;
			}
			words.shift();
			words.unshift(...splitShellWords(word.slice(15)));
			return words.length > 0;
		}
		if (word === "-i" || word === "--ignore-environment") {
			if (!canShimThisEnv) {
				words.splice(0, words.length, ...originalWords);
				return false;
			}
			ignoresEnvironment = true;
			words.shift();
			continue;
		}
		if (word === "-u" || word === "--unset" || word === "-C" || word === "--chdir") {
			words.shift();
			if (words[0]) words.shift();
			continue;
		}
		if (word.startsWith("--unset=") || word.startsWith("--chdir=")) {
			words.shift();
			continue;
		}
		if (word.startsWith("-") && word !== "-") {
			if (word.includes("i")) {
				if (!canShimThisEnv) {
					words.splice(0, words.length, ...originalWords);
					return false;
				}
				ignoresEnvironment = true;
			}
			words.shift();
			continue;
		}
		if (ignoresEnvironment && !canShimThisEnv) {
			words.splice(0, words.length, ...originalWords);
			return false;
		}
		return true;
	}
}
function isSupportedSystemEnvCommand(command) {
	return command === "env" || command === "/usr/bin/env";
}
function shellWordBasename(word) {
	return (word ?? "").split("/").pop() ?? "";
}
function stripCommandBuiltinOptions(words) {
	for (;;) {
		if (words[0] === "--") {
			words.shift();
			return true;
		}
		if (words[0] === "-p") {
			words.shift();
			continue;
		}
		return words[0] !== "-v" && words[0] !== "-V";
	}
}
function stripTimeOptions(words) {
	while ((words[0] ?? "").startsWith("-")) {
		if (words[0] === "--") {
			words.shift();
			return;
		}
		words.shift();
	}
}
function stripTimeoutOptions(words) {
	words.shift();
	for (;;) {
		const word = words[0] ?? "";
		if (!word) return;
		if (word === "--") {
			words.shift();
			break;
		}
		if (word === "-k" || word === "--kill-after" || word === "-s" || word === "--signal") {
			words.shift();
			if (words[0]) words.shift();
			continue;
		}
		if (word.startsWith("--kill-after=") || word.startsWith("--signal=")) {
			words.shift();
			continue;
		}
		if (word.startsWith("-") && word !== "-") {
			words.shift();
			continue;
		}
		break;
	}
	if (words[0]) words.shift();
}
function splitShellWords(value) {
	const words = [];
	let word = "";
	let quote = "";
	let escaped = false;
	for (const char of value) {
		if (escaped) {
			word += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			else word += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (/\s/u.test(char)) {
			if (word) {
				words.push(word);
				word = "";
			}
			continue;
		}
		word += char;
	}
	if (word) words.push(word);
	return words;
}
function stripHeredocBodies(command) {
	const lines = command.split("\n");
	const kept = [];
	const pendingDelimiters = [];
	for (const line of lines) {
		if (pendingDelimiters.length > 0) {
			const current = pendingDelimiters[0];
			if (!current) continue;
			if ((current.stripTabs ? line.replace(/^\t+/u, "") : line) === current.delimiter) pendingDelimiters.shift();
			else if (current.expand) kept.push(...extractCommandSubstitutionBodies(line));
			continue;
		}
		kept.push(line);
		pendingDelimiters.push(...lineHeredocDelimiters(line));
	}
	return kept.join("\n");
}
function lineHeredocDelimiters(line) {
	const delimiters = [];
	let quote = "";
	let escaped = false;
	for (let index = 0; index < line.length; index += 1) {
		const char = line[index] ?? "";
		const next = line[index + 1] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (char !== "<" || next !== "<" || line[index + 2] === "<") continue;
		let delimiterStart = index + 2;
		const stripTabs = line[delimiterStart] === "-";
		if (stripTabs) delimiterStart += 1;
		while (/\s/u.test(line[delimiterStart] ?? "")) delimiterStart += 1;
		const parsed = readHeredocDelimiter(line, delimiterStart);
		if (parsed.delimiter) {
			delimiters.push({
				delimiter: parsed.delimiter,
				stripTabs,
				expand: !parsed.quoted
			});
			index = parsed.endIndex;
		}
	}
	return delimiters;
}
function readHeredocDelimiter(line, startIndex) {
	let delimiterResult = "";
	let quote = "";
	let escaped = false;
	let quoted = false;
	let index = startIndex;
	for (; index < line.length; index += 1) {
		const char = line[index] ?? "";
		if (escaped) {
			delimiterResult += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			quoted = true;
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			else delimiterResult += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quoted = true;
			quote = char;
			continue;
		}
		if (/\s/u.test(char) || /[;&|()<>]/u.test(char)) break;
		delimiterResult += char;
	}
	return {
		delimiter: delimiterResult,
		endIndex: Math.max(startIndex, index),
		quoted
	};
}
function extractCommandSubstitutionBodies(line) {
	const substitutions = [];
	let escaped = false;
	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];
		const next = line[index + 1] ?? "";
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\") {
			escaped = true;
			continue;
		}
		if (char === "$" && next === "(" && line[index + 2] !== "(") {
			const substitution = readCommandSubstitution(line, index + 2);
			substitutions.push(substitution.content);
			index = substitution.endIndex;
		}
	}
	return substitutions;
}
function shellCommandSegments(command) {
	const segments = [];
	let segment = "";
	let quote = "";
	let escaped = false;
	let inCase = false;
	let readingCasePattern = false;
	for (let index = 0; index < command.length; index += 1) {
		const char = command[index];
		const next = command[index + 1] ?? "";
		if (escaped) {
			segment += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			segment += char;
			escaped = true;
			continue;
		}
		if (quote) {
			if (quote === "\"" && char === "$" && next === "(" && command[index + 2] !== "(") {
				const substitution = readCommandSubstitution(command, index + 2);
				segments.push(...shellCommandWordCandidates(substitution.content));
				index = substitution.endIndex;
				segment += "$()";
				continue;
			}
			if (char === quote) quote = "";
			segment += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			segment += char;
			continue;
		}
		if (char === "#" && (segment.trim() === "" || /\s$/u.test(segment))) {
			index = skipUntilNewline(command, index);
			pushShellCandidate(segments, segment);
			segment = "";
			continue;
		}
		if (char === "$" && next === "(" && command[index + 2] !== "(") {
			const substitution = readCommandSubstitution(command, index + 2);
			segments.push(...shellCommandWordCandidates(substitution.content));
			index = substitution.endIndex;
			segment += "$()";
			continue;
		}
		if (segment.trim() === "" && startsShellReservedWord(command, index, "case")) {
			pushShellCandidate(segments, segment);
			segment = "";
			inCase = true;
			readingCasePattern = true;
			index += 3;
			continue;
		}
		if (inCase && segment.trim() === "" && startsShellReservedWord(command, index, "esac")) {
			pushShellCandidate(segments, segment);
			segment = "";
			inCase = false;
			readingCasePattern = false;
			index += 3;
			continue;
		}
		if (inCase && readingCasePattern) {
			if (char === ")") {
				segment = "";
				readingCasePattern = false;
				continue;
			}
			segment += char;
			continue;
		}
		if (inCase && char === ";" && next === ";") {
			pushShellCandidate(segments, segment);
			segment = "";
			readingCasePattern = true;
			index += 1;
			continue;
		}
		if (char === "\n" || char === ";" || char === ")") {
			pushShellCandidate(segments, segment);
			segment = "";
			continue;
		}
		if (char === "&" && next === "&" || char === "|" && next === "|") {
			pushShellCandidate(segments, segment);
			segment = "";
			index += 1;
			continue;
		}
		if (char === "&" && next !== ">" && command[index - 1] !== ">") {
			pushShellCandidate(segments, segment);
			segment = "";
			continue;
		}
		if (char === "|") {
			pushShellCandidate(segments, segment);
			segment = "";
			if (next === "&") index += 1;
			continue;
		}
		segment += char;
	}
	pushShellCandidate(segments, segment);
	return segments;
}
function readCommandSubstitution(command, startIndex) {
	let depth = 1;
	let quote = "";
	let escaped = false;
	let inCase = false;
	let readingCasePattern = false;
	let content = "";
	for (let index = startIndex; index < command.length; index += 1) {
		const char = command[index];
		const next = command[index + 1] ?? "";
		if (escaped) {
			content += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			content += char;
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			content += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			content += char;
			continue;
		}
		if (!inCase && startsShellToken(command, index, "case")) {
			inCase = true;
			readingCasePattern = true;
		} else if (inCase && startsShellToken(command, index, "esac")) {
			inCase = false;
			readingCasePattern = false;
		}
		if (char === "$" && next === "(") {
			depth += 1;
			content += "$(";
			index += 1;
			continue;
		}
		if (char === "(") {
			depth += 1;
			content += char;
			continue;
		}
		if (inCase && char === ";" && next === ";") {
			readingCasePattern = true;
			content += ";;";
			index += 1;
			continue;
		}
		if (inCase && readingCasePattern && depth === 1 && char === ")") {
			readingCasePattern = false;
			content += char;
			continue;
		}
		if (char === ")") {
			depth -= 1;
			if (depth === 0) return {
				content,
				endIndex: index
			};
		}
		content += char;
	}
	return {
		content,
		endIndex: command.length - 1
	};
}
function startsShellReservedWord(command, index, word) {
	if (!command.startsWith(word, index)) return false;
	const after = command[index + word.length] ?? "";
	return !after || /\s|[;&|()<>]/u.test(after);
}
function startsShellToken(command, index, word) {
	if (!command.startsWith(word, index)) return false;
	const before = command[index - 1] ?? "";
	const after = command[index + word.length] ?? "";
	return (!before || /\s|[;&|()<>]/u.test(before)) && (!after || /\s|[;&|()<>]/u.test(after));
}
function skipUntilNewline(command, index) {
	const newlineIndex = command.indexOf("\n", index);
	return newlineIndex < 0 ? command.length - 1 : newlineIndex;
}
function changedGateBaseForCommand(commandArgs) {
	const requestedBases = [...new Set(changedGateBases(commandArgs))];
	if (requestedBases.length > 1) throw new Error(`remote changed-gate sync requires one base; received: ${requestedBases.join(", ")}`);
	const explicitBase = requestedBases[0] ?? "origin/main";
	const remoteAlias = remoteAliasForChangedGateBase(explicitBase);
	if (explicitBase !== "origin/main" && !remoteAlias) throw new Error(`remote changed-gate sync requires an exact origin/<branch> base; received: ${explicitBase}`);
	const requestedBase = explicitBase;
	const base = gitOutput([
		"merge-base",
		requestedBase,
		"HEAD"
	]);
	if (base.status === 0 && base.stdout) return {
		remoteAlias,
		resolvedBase: base.stdout
	};
	if (requestedBase !== "origin/main") throw new Error(`could not resolve explicit changed-gate base: ${requestedBase}`);
	return {
		remoteAlias: "",
		resolvedBase: "origin/main"
	};
}
function remoteAliasForChangedGateBase(base) {
	if (base === "origin/main" || !base.startsWith("origin/")) return "";
	const alias = `refs/remotes/${base}`;
	return gitOutput(["check-ref-format", alias]).status === 0 ? alias : "";
}
function injectRemoteChangedGateEnvironment(invocation, facts) {
	if (invocation.args[0] !== "run" || isNativeWindowsRemoteTarget(invocation.args)) return invocation.args;
	if (invocation.start < 0 || !facts.changedGate) return invocation.args;
	return replaceRunPayload(invocation, invocation.options.has("shell") && invocation.commandArgs.length === 1 ? [markShellChangedGateAsRemoteChild(invocation.commandArgs[0] ?? "")] : markDirectChangedGateAsRemoteChild(invocation.commandArgs));
}
function markShellChangedGateAsRemoteChild(command) {
	return `export ${remoteChangedGateEnv.join(" ")}; ${command}`;
}
function markDirectChangedGateAsRemoteChild(commandArgs) {
	const missingEnv = remoteChangedGateEnv.filter((assignment) => !commandArgs.includes(assignment));
	if (missingEnv.length === 0) return commandArgs;
	const markedCommandArgs = [...commandArgs];
	if (shellWordBasename(markedCommandArgs[0]) !== "env") return [
		"env",
		...missingEnv,
		...markedCommandArgs
	];
	markedCommandArgs.splice(envAssignmentInsertIndex(markedCommandArgs), 0, ...missingEnv);
	return markedCommandArgs;
}
function envAssignmentInsertIndex(words) {
	let index = 1;
	for (;;) {
		const word = words[index] ?? "";
		if (!word) return 1;
		if (word === "--") return index + 1;
		if (word === "-S" || word === "--split-string" || word.startsWith("-S") && word !== "-S") return index;
		if (word === "-u" || word === "--unset" || word === "-C" || word === "--chdir") {
			index += 2;
			continue;
		}
		if (word.startsWith("--unset=") || word.startsWith("--chdir=")) {
			index += 1;
			continue;
		}
		if (word.startsWith("-") && word !== "-") {
			index += 1;
			continue;
		}
		return index;
	}
}
function isWindowsRemoteTarget(commandArgs) {
	return effectiveTargetContext(commandArgs).target === "windows";
}
function isNativeWindowsRemoteTarget(commandArgs) {
	const targetContext = effectiveTargetContext(commandArgs);
	return targetContext.target === "windows" && targetContext.windowsMode !== "wsl2";
}
function isAwsMacosRemoteTarget(commandArgs, providerName) {
	return commandArgs[0] === "run" && providerName === "aws" && optionValue(commandArgs, "--target") === "macos";
}
function isBrokeredWsl2RemoteTarget(commandArgs, providerName) {
	const canonicalProvider = canonicalProviderName(providerName);
	return commandArgs[0] === "run" && (canonicalProvider === "aws" || canonicalProvider === "azure") && isWindowsRemoteTarget(commandArgs) && effectiveTargetContext(commandArgs).windowsMode === "wsl2";
}
function isHydratedNativeWindowsProvider(providerName) {
	return providerName === "aws" || providerName === "azure";
}
function remoteWindowsHydratedNodeModulesBootstrap() {
	return [
		"$openclawModulesDir = if ($env:CRABBOX_PNPM_MODULES_DIR) { $env:CRABBOX_PNPM_MODULES_DIR } else { $env:PNPM_CONFIG_MODULES_DIR }",
		"if ($openclawModulesDir) {",
		"if (-not (Test-Path $openclawModulesDir)) { throw \"hydrated pnpm modules directory does not exist: $openclawModulesDir\" }",
		"$openclawWorkspaceModules = Join-Path (Get-Location).Path \"node_modules\"",
		"$openclawSelfModules = Join-Path $openclawModulesDir \"node_modules\"",
		"if (-not (Test-Path $openclawSelfModules)) { cmd /c mklink /J \"$openclawSelfModules\" \"$openclawModulesDir\" | Out-Host; if ($LASTEXITCODE -ne 0) { throw \"failed to link hydrated pnpm node_modules\" } }",
		"if (-not (Test-Path $openclawWorkspaceModules)) { cmd /c mklink /J \"$openclawWorkspaceModules\" \"$openclawModulesDir\" | Out-Host; if ($LASTEXITCODE -ne 0) { throw \"failed to link workspace node_modules\" } }",
		"}"
	].join("; ");
}
function injectRemoteWindowsHydratedNodeModulesBootstrap(invocation, facts, providerName) {
	if (invocation.args[0] !== "run" || !isHydratedNativeWindowsProvider(providerName) || !isNativeWindowsRemoteTarget(invocation.args) || !invocation.options.has("id") || !facts.runtimeEntrypoint) return invocation.args;
	if (invocation.start < 0) return invocation.args;
	return replaceRunCommandWithShell(invocation, `${remoteWindowsHydratedNodeModulesBootstrap()}; ${renderRunShellCommand(invocation, powershellJoin)}`);
}
function remotePosixJsEnvBootstrap(packageManager = false) {
	return [
		...packageManager ? [
			"export COREPACK_HOME=\"${COREPACK_HOME:-$tool_root/corepack}\";",
			"export PNPM_HOME=\"${PNPM_HOME:-$tool_root/pnpm-home}\";",
			"mkdir -p \"$COREPACK_HOME\" \"$PNPM_HOME\" || return 1;",
			"export PATH=\"$PNPM_HOME:$PATH\";",
			"corepack enable --install-directory \"$PNPM_HOME\" || return 1;"
		] : [],
		"openclaw_crabbox_env() {",
		"openclaw_env_args=();",
		"openclaw_env_ignore=0;",
		"openclaw_env_path_seen=0;",
		"while [ \"$#\" -gt 0 ]; do",
		"case \"$1\" in",
		"-i|--ignore-environment) openclaw_env_ignore=1; openclaw_env_args+=(\"$1\"); shift ;;",
		"-S|--split-string|-S*|--split-string=*) command env \"${openclaw_env_args[@]}\" \"$@\"; return ;;",
		"-[!-]*i*) openclaw_env_ignore=1; openclaw_env_args+=(\"$1\"); shift ;;",
		"-u|--unset|-C|--chdir) openclaw_env_args+=(\"$1\"); shift; if [ \"$#\" -gt 0 ]; then openclaw_env_args+=(\"$1\"); shift; fi ;;",
		"--unset=*|--chdir=*) openclaw_env_args+=(\"$1\"); shift ;;",
		"PATH=*) if [ \"$openclaw_env_ignore\" = \"1\" ]; then openclaw_env_args+=(\"PATH=${OPENCLAW_CRABBOX_BOOTSTRAP_PATH:-$PATH}:${1#PATH=}\"); else openclaw_env_args+=(\"$1\"); fi; openclaw_env_path_seen=1; shift ;;",
		"[A-Za-z_]*=*) openclaw_env_args+=(\"$1\"); shift ;;",
		"--) openclaw_env_args+=(\"--\"); shift; break ;;",
		"*) break ;;",
		"esac;",
		"done;",
		"if [ \"$openclaw_env_ignore\" = \"1\" ] && [ \"$openclaw_env_path_seen\" = \"0\" ]; then openclaw_env_args+=(\"PATH=${OPENCLAW_CRABBOX_BOOTSTRAP_PATH:-$PATH}\"); fi;",
		"command env \"${openclaw_env_args[@]}\" \"$@\";",
		"};"
	];
}
function remoteAwsMacosJsBootstrap({ packageManager = false, bun = false, sourceBootstrap = "" } = {}) {
	const bootstrap = [
		"openclaw_crabbox_bootstrap_macos_js() {",
		"tool_root=\"${OPENCLAW_CRABBOX_MACOS_TOOLCHAIN_DIR:-$HOME/.openclaw-crabbox-toolchain}\";",
		`node_version=${shellQuote(process.env.OPENCLAW_CRABBOX_MACOS_NODE_VERSION?.trim() || "24.19.0")};`,
		"arch=\"$(uname -m)\";",
		"case \"$arch\" in arm64) node_arch=arm64 ;; x86_64) node_arch=x64 ;; *) echo \"unsupported macOS arch: $arch\" >&2; return 2 ;; esac;",
		"macos_locale=\"${OPENCLAW_CRABBOX_MACOS_LOCALE:-en_US.UTF-8}\";",
		"case \"${LANG:-}\" in C.UTF-8|C.utf8|c.UTF-8|c.utf8) export LANG=\"$macos_locale\" ;; esac;",
		"case \"${LC_ALL:-}\" in C.UTF-8|C.utf8|c.UTF-8|c.utf8) export LC_ALL=\"$macos_locale\" ;; esac;",
		"case \"${LC_CTYPE:-}\" in C.UTF-8|C.utf8|c.UTF-8|c.utf8) export LC_CTYPE=\"$macos_locale\" ;; esac;",
		"if [ -z \"${TMPDIR:-}\" ]; then export TMPDIR=\"/tmp\"; fi;",
		"if [ ! -d \"$TMPDIR\" ]; then mkdir -p \"$TMPDIR\" 2>/dev/null || export TMPDIR=\"/tmp\"; fi;",
		"if [ ! -d \"$TMPDIR\" ]; then echo \"usable TMPDIR not found: $TMPDIR\" >&2; return 1; fi;",
		"node_dir=\"$tool_root/node-v${node_version}-darwin-${node_arch}\";",
		"ready_marker=\"$node_dir/.openclaw-crabbox-node-ready\";",
		"export PATH=\"$node_dir/bin:$PATH\";",
		"if [ ! -x \"$node_dir/bin/node\" ] || [ ! -f \"$ready_marker\" ]; then",
		"mkdir -p \"$tool_root\" || { status=$?; return \"$status\"; };",
		"install_lock=\"$tool_root/.node-${node_version}-${node_arch}.lock\";",
		"lock_acquired=0;",
		"lock_deadline=$((SECONDS + 300));",
		"while true; do",
		"if mkdir \"$install_lock\" 2>/dev/null; then lock_acquired=1; printf \"%s\\n\" \"$$\" >\"$install_lock/pid\" || { status=$?; rm -rf \"$install_lock\"; return \"$status\"; }; break; fi;",
		"if [ -x \"$node_dir/bin/node\" ] && [ -f \"$ready_marker\" ]; then break; fi;",
		"if [ \"$SECONDS\" -ge \"$lock_deadline\" ]; then",
		"lock_pid=\"$(cat \"$install_lock/pid\" 2>/dev/null || true)\";",
		"if [ -n \"$lock_pid\" ] && kill -0 \"$lock_pid\" 2>/dev/null; then echo \"timed out waiting for active macOS Node toolchain install lock: $install_lock pid=$lock_pid\" >&2; return 1; fi;",
		"echo \"reclaiming stale macOS Node toolchain install lock: $install_lock\" >&2;",
		"rm -rf \"$install_lock\" || return 1;",
		"lock_deadline=$((SECONDS + 300));",
		"fi;",
		"sleep 1;",
		"done;",
		"release_install_lock() { if [ \"$lock_acquired\" = \"1\" ]; then rm -rf \"$install_lock\" 2>/dev/null || true; fi; };",
		"if [ ! -x \"$node_dir/bin/node\" ] || [ ! -f \"$ready_marker\" ]; then",
		"tmp_dir=\"$(mktemp -d)\" || { release_install_lock; return 1; };",
		"pkg=\"node-v${node_version}-darwin-${node_arch}.tar.gz\";",
		"base_url=\"https://nodejs.org/dist/v${node_version}\";",
		"curl -fsSL --connect-timeout 10 --max-time 300 --retry 2 --retry-delay 2 -o \"$tmp_dir/$pkg\" \"$base_url/$pkg\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"curl -fsSL --connect-timeout 10 --max-time 60 --retry 2 --retry-delay 2 -o \"$tmp_dir/SHASUMS256.txt\" \"$base_url/SHASUMS256.txt\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"(cd \"$tmp_dir\" && grep \" $pkg$\" SHASUMS256.txt | shasum -a 256 -c -) || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"rm -rf \"$node_dir\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"tar -xzf \"$tmp_dir/$pkg\" -C \"$tool_root\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"touch \"$ready_marker\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"rm -rf \"$tmp_dir\";",
		"fi;",
		"release_install_lock;",
		"fi;",
		"node --version >&2 || return 1;",
		...remotePosixJsEnvBootstrap(packageManager),
		...sourceBootstrap ? [`${sourceBootstrap} || return $?;`] : []
	];
	if (packageManager) bootstrap.push("pnpm --version >&2;");
	if (bun) bootstrap.push(`bun_version=${shellQuote(awsMacosBunVersion)};`, "bun_root=\"$tool_root/bun-v${bun_version}\";", "bun_ready_marker=\"$bun_root/.openclaw-crabbox-bun-ready\";", "export PATH=\"$bun_root/bin:$PATH\";", "if [ ! -x \"$bun_root/bin/bun\" ] || [ ! -f \"$bun_ready_marker\" ]; then", "mkdir -p \"$tool_root\" || { status=$?; return \"$status\"; };", "bun_install_lock=\"$tool_root/.bun-${bun_version}.lock\";", "bun_lock_acquired=0;", "bun_lock_deadline=$((SECONDS + 300));", "while true; do", "if mkdir \"$bun_install_lock\" 2>/dev/null; then bun_lock_acquired=1; printf \"%s\\n\" \"$$\" >\"$bun_install_lock/pid\" || { status=$?; rm -rf \"$bun_install_lock\"; return \"$status\"; }; break; fi;", "if [ -x \"$bun_root/bin/bun\" ] && [ -f \"$bun_ready_marker\" ]; then break; fi;", "if [ \"$SECONDS\" -ge \"$bun_lock_deadline\" ]; then", "bun_lock_pid=\"$(cat \"$bun_install_lock/pid\" 2>/dev/null || true)\";", "if [ -n \"$bun_lock_pid\" ] && kill -0 \"$bun_lock_pid\" 2>/dev/null; then echo \"timed out waiting for active macOS Bun install lock: $bun_install_lock pid=$bun_lock_pid\" >&2; return 1; fi;", "echo \"reclaiming stale macOS Bun install lock: $bun_install_lock\" >&2;", "rm -rf \"$bun_install_lock\" || return 1;", "bun_lock_deadline=$((SECONDS + 300));", "fi;", "sleep 1;", "done;", "release_bun_install_lock() { if [ \"$bun_lock_acquired\" = \"1\" ]; then rm -rf \"$bun_install_lock\" 2>/dev/null || true; fi; };", "if [ ! -x \"$bun_root/bin/bun\" ] || [ ! -f \"$bun_ready_marker\" ]; then", "rm -rf \"$bun_root\" || { status=$?; release_bun_install_lock; return \"$status\"; };", "mkdir -p \"$bun_root\" || { status=$?; release_bun_install_lock; return \"$status\"; };", "npm install --global --prefix \"$bun_root\" --fetch-timeout=120000 --fetch-retries=2 --fetch-retry-mintimeout=2000 --fetch-retry-maxtimeout=15000 \"bun@${bun_version}\" || { status=$?; release_bun_install_lock; return \"$status\"; };", "touch \"$bun_ready_marker\" || { status=$?; release_bun_install_lock; return \"$status\"; };", "fi;", "release_bun_install_lock;", "fi;", "bun --version >&2 || return 1;");
	bootstrap.push("export OPENCLAW_CRABBOX_BOOTSTRAP_PATH=\"$PATH\";");
	bootstrap.push("};", "openclaw_crabbox_bootstrap_macos_js");
	return bootstrap.join(" ");
}
function remoteWsl2JsBootstrap({ packageManager = false, sourceBootstrap = "" } = {}) {
	const bootstrap = [
		"openclaw_crabbox_bootstrap_wsl2_js() {",
		"tool_root=\"${OPENCLAW_CRABBOX_WSL2_TOOLCHAIN_DIR:-$HOME/.openclaw-crabbox-toolchain}\";",
		`node_version=${shellQuote(process.env.OPENCLAW_CRABBOX_WSL2_NODE_VERSION?.trim() || "24.19.0")};`,
		"arch=\"$(uname -m)\";",
		"case \"$arch\" in arm64|aarch64) node_arch=arm64 ;; x86_64|amd64) node_arch=x64 ;; *) echo \"unsupported WSL2 arch: $arch\" >&2; return 2 ;; esac;",
		"if [ -z \"${TMPDIR:-}\" ]; then export TMPDIR=\"/tmp\"; fi;",
		"if [ ! -d \"$TMPDIR\" ]; then mkdir -p \"$TMPDIR\" 2>/dev/null || export TMPDIR=\"/tmp\"; fi;",
		"if [ ! -d \"$TMPDIR\" ]; then echo \"usable TMPDIR not found: $TMPDIR\" >&2; return 1; fi;",
		"node_dir=\"$tool_root/node-v${node_version}-linux-${node_arch}\";",
		"ready_marker=\"$node_dir/.openclaw-crabbox-node-ready\";",
		"export PATH=\"$node_dir/bin:$PATH\";",
		"if [ ! -x \"$node_dir/bin/node\" ] || [ ! -f \"$ready_marker\" ]; then",
		"mkdir -p \"$tool_root\" || { status=$?; return \"$status\"; };",
		"install_lock=\"$tool_root/.node-${node_version}-${node_arch}.lock\";",
		"lock_acquired=0;",
		"lock_deadline=$((SECONDS + 300));",
		"while true; do",
		"if mkdir \"$install_lock\" 2>/dev/null; then lock_acquired=1; printf \"%s\\n\" \"$$\" >\"$install_lock/pid\" || { status=$?; rm -rf \"$install_lock\"; return \"$status\"; }; break; fi;",
		"if [ -x \"$node_dir/bin/node\" ] && [ -f \"$ready_marker\" ]; then break; fi;",
		"if [ \"$SECONDS\" -ge \"$lock_deadline\" ]; then",
		"lock_pid=\"$(cat \"$install_lock/pid\" 2>/dev/null || true)\";",
		"if [ -n \"$lock_pid\" ] && kill -0 \"$lock_pid\" 2>/dev/null; then echo \"timed out waiting for active WSL2 Node toolchain install lock: $install_lock pid=$lock_pid\" >&2; return 1; fi;",
		"echo \"reclaiming stale WSL2 Node toolchain install lock: $install_lock\" >&2;",
		"rm -rf \"$install_lock\" || return 1;",
		"lock_deadline=$((SECONDS + 300));",
		"fi;",
		"sleep 1;",
		"done;",
		"release_install_lock() { if [ \"$lock_acquired\" = \"1\" ]; then rm -rf \"$install_lock\" 2>/dev/null || true; fi; };",
		"if [ ! -x \"$node_dir/bin/node\" ] || [ ! -f \"$ready_marker\" ]; then",
		"tmp_dir=\"$(mktemp -d)\" || { release_install_lock; return 1; };",
		"pkg=\"node-v${node_version}-linux-${node_arch}.tar.gz\";",
		"base_url=\"https://nodejs.org/dist/v${node_version}\";",
		"curl -fsSL --connect-timeout 10 --max-time 300 --retry 2 --retry-delay 2 -o \"$tmp_dir/$pkg\" \"$base_url/$pkg\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"curl -fsSL --connect-timeout 10 --max-time 60 --retry 2 --retry-delay 2 -o \"$tmp_dir/SHASUMS256.txt\" \"$base_url/SHASUMS256.txt\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"(cd \"$tmp_dir\" && grep \" $pkg$\" SHASUMS256.txt | sha256sum -c -) || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"rm -rf \"$node_dir\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"tar -xzf \"$tmp_dir/$pkg\" -C \"$tool_root\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"touch \"$ready_marker\" || { status=$?; release_install_lock; rm -rf \"$tmp_dir\"; return \"$status\"; };",
		"rm -rf \"$tmp_dir\";",
		"fi;",
		"release_install_lock;",
		"fi;",
		"node --version >&2 || return 1;",
		...remotePosixJsEnvBootstrap(packageManager),
		...sourceBootstrap ? [`${sourceBootstrap} || return $?;`] : []
	];
	if (packageManager) bootstrap.push("pnpm --version >&2;", ...sourceBootstrap ? [] : ["if [ -f pnpm-lock.yaml ] && [ ! -f node_modules/.modules.yaml ]; then pnpm install --frozen-lockfile || return 1; fi;"]);
	bootstrap.push("export OPENCLAW_CRABBOX_BOOTSTRAP_PATH=\"$PATH\";");
	bootstrap.push("};", "openclaw_crabbox_bootstrap_wsl2_js");
	return bootstrap.join(" ");
}
function scopedAwsMacosEnvCommand(commandArgs) {
	if (commandArgs.length <= 1 || !isSupportedSystemEnvCommand(commandArgs[0] ?? "")) return null;
	const targetWords = [...commandArgs];
	if (!stripEnvCommandOptions(targetWords, { canShimIgnoreEnvironment: true })) return null;
	const targetEntrypoint = shellWordBasename(targetWords[0]);
	const needsPackageManager = awsMacosCorepackEntrypoints.has(targetEntrypoint) || commandWordsNeedAwsMacosPackageManager(targetWords);
	const needsRuntime = jsRuntimeEntrypoints.has(targetEntrypoint);
	const needsBun = awsMacosBunEntrypoints.has(targetEntrypoint);
	if (!needsRuntime && !needsPackageManager && !needsBun) return null;
	return {
		runtimeEntrypoint: needsRuntime ? targetEntrypoint : "",
		packageManager: needsPackageManager,
		bun: needsBun,
		shellCommand: `openclaw_crabbox_env ${shellJoin(commandArgs.slice(1))}`
	};
}
function scopedAwsMacosShellEnvCommand(command) {
	const candidates = shellCommandWordCandidates(command);
	if (candidates.length < 1) return null;
	const eligibleSegments = /* @__PURE__ */ new Set();
	const scoped = {
		runtimeEntrypoint: "",
		packageManager: false,
		bun: false
	};
	for (const words of candidates) {
		const candidateScoped = scopedAwsMacosEnvCommand(words);
		if (!candidateScoped) continue;
		eligibleSegments.add(shellWordsKey(words));
		scoped.runtimeEntrypoint ||= candidateScoped.runtimeEntrypoint;
		scoped.packageManager ||= candidateScoped.packageManager;
		scoped.bun ||= candidateScoped.bun;
	}
	if (eligibleSegments.size < 1) return null;
	const shellCommand = shellCommandWithEnvShim(command, eligibleSegments);
	return shellCommand ? {
		...scoped,
		shellCommand
	} : null;
}
function shellWordsKey(words) {
	return JSON.stringify(words);
}
function shellCommandWithEnvShim(command, eligibleSegments) {
	let changed = false;
	let rewritten = "";
	let copiedUntil = 0;
	for (const segment of shellCommandSegmentsWithBounds(command)) {
		const envToken = leadingShellEnvCommandToken(command, segment.start);
		if (!envToken || envToken.start >= segment.end) continue;
		const words = normalizedShellSegmentWords(command.slice(segment.start, segment.end));
		if (!eligibleSegments.has(shellWordsKey(words))) continue;
		rewritten += command.slice(copiedUntil, envToken.start);
		rewritten += "openclaw_crabbox_env";
		copiedUntil = envToken.end;
		changed = true;
	}
	return changed ? `${rewritten}${command.slice(copiedUntil)}` : "";
}
function shellCommandSegmentsWithBounds(command) {
	const segments = [];
	const ignoredRanges = shellHeredocBodyRanges(command);
	let ignoredRangeIndex = 0;
	let start = 0;
	let quote = "";
	let escaped = false;
	for (let index = 0; index < command.length; index += 1) {
		const ignoredRange = ignoredRanges[ignoredRangeIndex];
		if (ignoredRange && index >= ignoredRange.start) {
			if (start < ignoredRange.start) segments.push({
				start,
				end: ignoredRange.start
			});
			index = ignoredRange.end - 1;
			start = ignoredRange.end;
			ignoredRangeIndex += 1;
			continue;
		}
		const char = command[index];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (char !== "\n" && char !== ";" && char !== ")" && char !== "&" && char !== "|") continue;
		if (char === "&" && (command[index - 1] === ">" || command[index - 1] === "<" || command[index + 1] === ">")) continue;
		segments.push({
			start,
			end: index
		});
		if ((char === "&" || char === "|") && command[index + 1] === char) index += 1;
		start = index + 1;
	}
	segments.push({
		start,
		end: command.length
	});
	return segments;
}
function shellHeredocBodyRanges(command) {
	const ranges = [];
	const pendingDelimiters = [];
	let lineStart = 0;
	for (;;) {
		const newlineIndex = command.indexOf("\n", lineStart);
		const lineEnd = newlineIndex >= 0 ? newlineIndex : command.length;
		const nextLineStart = newlineIndex >= 0 ? newlineIndex + 1 : command.length;
		const line = command.slice(lineStart, lineEnd);
		if (pendingDelimiters.length > 0) {
			ranges.push({
				start: lineStart,
				end: nextLineStart
			});
			const current = pendingDelimiters[0];
			if (!current) continue;
			if ((current.stripTabs ? line.replace(/^\t+/u, "") : line) === current.delimiter) pendingDelimiters.shift();
		} else pendingDelimiters.push(...lineHeredocDelimiters(line));
		if (newlineIndex < 0) return ranges;
		lineStart = nextLineStart;
	}
}
function leadingShellEnvCommandToken(command, start = 0) {
	let index = start;
	for (;;) {
		while (/\s/u.test(command[index] ?? "")) index += 1;
		if (command[index] === "(" || command[index] === "{") {
			index += 1;
			continue;
		}
		const token = readLeadingShellWord(command, index);
		if (!token) return null;
		if (shellControlCommandPrefixes.has(token.word)) {
			index = token.end;
			continue;
		}
		if (token.word === "time") {
			index = skipLeadingTimeCommand(command, token.end);
			continue;
		}
		if (isSupportedSystemEnvCommand(token.word)) return {
			start: index,
			end: token.end
		};
		if (!/^[A-Za-z_][A-Za-z0-9_]*=/u.test(token.word)) return null;
		index = token.end;
	}
}
function skipLeadingTimeCommand(command, start) {
	let index = start;
	for (;;) {
		while (/\s/u.test(command[index] ?? "")) index += 1;
		const token = readLeadingShellWord(command, index);
		if (!token) return index;
		if (token.word === "--" || token.word.startsWith("-")) {
			index = token.end;
			continue;
		}
		return index;
	}
}
function readLeadingShellWord(command, start) {
	let word = "";
	let quote = "";
	let escaped = false;
	for (let index = start; index < command.length; index += 1) {
		const char = command[index] ?? "";
		if (escaped) {
			word += char;
			escaped = false;
			continue;
		}
		if (char === "\\" && quote !== "'") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = "";
			else word += char;
			continue;
		}
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (/\s/u.test(char) || /[;&|()<>]/u.test(char)) return word ? {
			word,
			end: index
		} : null;
		word += char;
	}
	return word ? {
		word,
		end: command.length
	} : null;
}
function analyzeRemoteCommand(invocation) {
	const runArgs = invocation.commandArgs;
	const directScopedEnvCommand = invocation.options.has("shell") ? null : scopedAwsMacosEnvCommand(runArgs);
	const shellScopedEnvCommand = invocation.options.has("shell") && runArgs.length === 1 ? scopedAwsMacosShellEnvCommand(runArgs[0] ?? "") : null;
	const scopedEnvCommand = directScopedEnvCommand ?? shellScopedEnvCommand;
	const packageManagerFallbackNeeded = scopedEnvCommand ? commandNeedsAwsMacosPackageManager(runArgs) : commandNeedsAwsMacosPackageManager(runArgs, { canShimIgnoreEnvironment: false });
	const packageManagerNeeded = scopedEnvCommand?.packageManager || packageManagerFallbackNeeded;
	const runtimeEntrypoint = scopedEnvCommand?.runtimeEntrypoint || commandRuntimeEntrypoint(runArgs);
	return {
		bun: scopedEnvCommand?.bun || commandNeedsAwsMacosBun(runArgs),
		changedGate: isChangedGateCommand(runArgs),
		commandArgs: runArgs,
		packageManager: packageManagerNeeded,
		runtimeEntrypoint,
		scopedEnvCommand,
		swift: commandNeedsAwsMacosSwiftToolchain(runArgs)
	};
}
function prepareRemoteWsl2JsBootstrapScript(run, facts, provider, sourceBootstrap) {
	const runtimeEntrypoint = awsMacosBunEntrypoints.has(facts.runtimeEntrypoint) ? "" : facts.runtimeEntrypoint;
	if (!isBrokeredWsl2RemoteTarget(run.args, provider) || !runtimeEntrypoint && !facts.packageManager) return {
		args: run.args,
		cleanup: () => {},
		prepared: false
	};
	if (run.start < 0) return {
		args: run.args,
		cleanup: () => {},
		prepared: false
	};
	const scriptRoot = mkdtempSync(resolve(tmpdir(), "openclaw-crabbox-wsl2-script-"));
	const cleanup = () => rmSync(scriptRoot, {
		recursive: true,
		force: true
	});
	try {
		const scriptPath = resolve(scriptRoot, "script.sh");
		const originalShellCommand = facts.scopedEnvCommand?.shellCommand ?? renderRunShellCommand(run);
		const script = `${remoteWsl2JsBootstrap({
			packageManager: facts.packageManager,
			sourceBootstrap
		})} || exit $?\n{ ${originalShellCommand}\n}\n`;
		writeFileSync(scriptPath, script, "utf8");
		chmodSync(scriptPath, 448);
		const normalizedArgs = run.args.slice(0, run.optionEnd);
		if (!run.options.has("no-hydrate")) normalizedArgs.push("--no-hydrate");
		normalizedArgs.push("--script", scriptPath);
		return {
			args: normalizedArgs,
			cleanup,
			prepared: true
		};
	} catch (error) {
		cleanup();
		throw error;
	}
}
function injectRemoteAwsMacosJsBootstrap(run, facts, provider, sourceBootstrap) {
	if (!isAwsMacosRemoteTarget(run.args, provider) || !facts.runtimeEntrypoint && !facts.packageManager && !facts.bun && !sourceBootstrap) return run.args;
	if (run.start < 0) return run.args;
	const originalShellCommand = facts.scopedEnvCommand?.shellCommand ?? renderRunShellCommand(run);
	return replaceRunCommandWithShell(run, `${remoteAwsMacosJsBootstrap({
		packageManager: facts.packageManager,
		bun: facts.bun,
		sourceBootstrap
	})} && { ${originalShellCommand}\n}`);
}
function remoteAwsMacosSwiftBootstrap() {
	return [
		"openclaw_crabbox_require_macos_swift_63() {",
		"openclaw_xcode=\"\";",
		"for openclaw_candidate in /Applications/Xcode_26*.app /Applications/Xcode-26*.app /Applications/Xcode_2[7-9]*.app /Applications/Xcode-2[7-9]*.app; do if [ -d \"$openclaw_candidate\" ]; then openclaw_xcode=\"$openclaw_candidate\"; fi; done;",
		"if [ -n \"$openclaw_xcode\" ]; then openclaw_developer=\"$openclaw_xcode/Contents/Developer\"; if [ ! -d \"$openclaw_developer\" ]; then openclaw_developer=\"$openclaw_xcode\"; fi; sudo xcode-select -s \"$openclaw_developer\" || return 1; fi;",
		"openclaw_swift_version=\"$(swift --version 2>&1)\" || { status=$?; printf \"%s\\n\" \"$openclaw_swift_version\" >&2; return \"$status\"; };",
		"printf \"%s\\n\" \"$openclaw_swift_version\" >&2;",
		"openclaw_swift_major_minor=\"$(printf \"%s\\n\" \"$openclaw_swift_version\" | sed -nE \"s/.*Apple Swift version ([0-9]+)\\.([0-9]+).*/\\1 \\2/p\" | head -n 1)\";",
		"if [ -z \"$openclaw_swift_major_minor\" ]; then echo \"[crabbox] OpenClaw macOS app proof requires Swift tools 6.3+; unable to parse swift --version.\" >&2; return 2; fi;",
		"set -- $openclaw_swift_major_minor;",
		"if [ \"$1\" -lt 6 ] || { [ \"$1\" -eq 6 ] && [ \"$2\" -lt 3 ]; }; then",
		"echo \"[crabbox] OpenClaw macOS app proof requires Swift tools 6.3+ (Xcode 26.4+).\" >&2;",
		"echo \"[crabbox] current Swift is $1.$2; select/install Xcode 26.4 or newer.\" >&2;",
		"return 2;",
		"fi;",
		"openclaw_xcodebuild_version=\"$(xcodebuild -version 2>&1)\" || { printf \"%s\\n\" \"$openclaw_xcodebuild_version\" >&2; echo \"[crabbox] OpenClaw macOS app proof requires Xcode 26.4+; active developer directory does not provide usable xcodebuild.\" >&2; return 2; };",
		"printf \"%s\\n\" \"$openclaw_xcodebuild_version\" >&2;",
		"openclaw_xcode_major_minor=\"$(printf \"%s\\n\" \"$openclaw_xcodebuild_version\" | sed -nE \"s/^Xcode ([0-9]+)\\.([0-9]+).*/\\1 \\2/p\" | head -n 1)\";",
		"if [ -z \"$openclaw_xcode_major_minor\" ]; then echo \"[crabbox] OpenClaw macOS app proof requires Xcode 26.4+; unable to parse xcodebuild -version.\" >&2; return 2; fi;",
		"set -- $openclaw_xcode_major_minor;",
		"if [ \"$1\" -lt 26 ] || { [ \"$1\" -eq 26 ] && [ \"$2\" -lt 4 ]; }; then echo \"[crabbox] OpenClaw macOS app proof requires Xcode 26.4+; current xcodebuild is $1.$2.\" >&2; return 2; fi;",
		"};",
		"openclaw_crabbox_require_macos_swift_63"
	].join(" ");
}
function injectRemoteAwsMacosSwiftBootstrap(invocation, facts, providerName, force = false) {
	if (!isAwsMacosRemoteTarget(invocation.args, providerName) || !force && !facts.swift) return invocation.args;
	if (invocation.start < 0) return invocation.args;
	return replaceRunCommandWithShell(invocation, `${remoteAwsMacosSwiftBootstrap()} && { ${renderRunShellCommand(invocation)}\n}`);
}
function replaceRunScript(invocation, scriptPath) {
	const normalizedArgs = invocation.args.slice(0, invocation.optionEnd);
	for (const { name, index } of invocation.optionEntries.toReversed()) if (name === "script" || name === "script-stdin") normalizedArgs.splice(index, name === "script" && !invocation.args[index]?.includes("=") ? 2 : 1);
	return [
		...normalizedArgs,
		"--script",
		scriptPath,
		...invocation.args.slice(invocation.optionEnd)
	];
}
async function prepareAwsMacosScriptStdinBootstrap(commandArgs, providerName) {
	const invocation = parseCommandInvocation(help.text, commandArgs);
	const scriptOption = invocation.script;
	if (!isAwsMacosRemoteTarget(commandArgs, providerName) || scriptOption?.name !== "script-stdin") return {
		args: commandArgs,
		cleanup: () => {},
		prepared: false
	};
	const script = await readScriptStdin();
	const scriptRoot = mkdtempSync(resolve(tmpdir(), "openclaw-crabbox-macos-script-"));
	const cleanup = () => rmSync(scriptRoot, {
		recursive: true,
		force: true
	});
	try {
		const scriptPath = resolve(scriptRoot, "script.sh");
		writeFileSync(scriptPath, createAwsMacosScriptStdinWrapper(script), "utf8");
		chmodSync(scriptPath, 448);
		return {
			args: replaceRunScript(invocation, scriptPath),
			cleanup,
			prepared: true
		};
	} catch (error) {
		cleanup();
		throw error;
	}
}
function createAwsMacosScriptStdinWrapper(script) {
	return wrapRemoteScript(script, remoteAwsMacosScriptBootstrap(awsMacosScriptBootstrapRequirements(script)));
}
function wrapRemoteScript(script, bootstrap) {
	if (!script.startsWith("#!")) return `${bootstrap} || exit $?\n${script}`;
	const delimiterValue = uniqueHereDocDelimiter(script);
	return [
		`${bootstrap} || exit $?`,
		"tmp_script=\"$(mktemp \"${TMPDIR:-/tmp}/openclaw-crabbox-script.XXXXXX\")\" || exit $?",
		"cleanup_openclaw_crabbox_script() { rm -f \"$tmp_script\"; }",
		"trap cleanup_openclaw_crabbox_script EXIT",
		`cat >"$tmp_script" <<'${delimiterValue}'`,
		script.endsWith("\n") ? script.slice(0, -1) : script,
		delimiterValue,
		"chmod 700 \"$tmp_script\" || exit $?",
		"\"$tmp_script\" \"$@\"",
		""
	].join("\n");
}
function remoteAwsMacosScriptBootstrap(requirements) {
	const bootstraps = [remoteAwsMacosJsBootstrap(requirements)];
	if (requirements.swift) bootstraps.push(remoteAwsMacosSwiftBootstrap());
	return bootstraps.join(" && ");
}
function awsMacosScriptBootstrapRequirements(script) {
	const requirements = {
		packageManager: false,
		bun: false,
		swift: false
	};
	const firstLine = script.match(/^[^\r\n]*/u)?.[0] ?? "";
	if (firstLine.startsWith("#!")) {
		const words = firstLine.slice(2).trim().split(/\s+/u).filter(Boolean);
		requirements.packageManager = commandWordsNeedEntrypoint(words, awsMacosCorepackEntrypoints);
		requirements.bun = commandWordsNeedEntrypoint(words, awsMacosBunEntrypoints);
		requirements.swift = commandWordsNeedAwsMacosSwiftToolchain(words);
		if (commandWordsShellEntrypoint(words)) {
			const body = script.slice(firstLine.length).replace(/^\r?\n/u, "");
			requirements.packageManager ||= commandNeedsAwsMacosPackageManager([body]);
			requirements.bun ||= commandNeedsAwsMacosBun([body]);
			requirements.swift ||= commandNeedsAwsMacosSwiftToolchain([body]);
		}
		return requirements;
	}
	requirements.packageManager = commandNeedsAwsMacosPackageManager([script]);
	requirements.bun = commandNeedsAwsMacosBun([script]);
	requirements.swift = commandNeedsAwsMacosSwiftToolchain([script]);
	return requirements;
}
function uniqueHereDocDelimiter(script) {
	let index = 0;
	for (;;) {
		const delimiterLocal = `OPENCLAW_CRABBOX_SCRIPT_${index}`;
		if (!new RegExp(`^${delimiterLocal}$`, "mu").test(script)) return delimiterLocal;
		index += 1;
	}
}
function isSparseCheckout() {
	const config = gitOutput([
		"config",
		"--bool",
		"core.sparseCheckout"
	]);
	if (config.status === 0 && config.stdout === "true") return true;
	const patterns = gitOutput(["sparse-checkout", "list"]);
	return patterns.status === 0 && patterns.stdout.length > 0;
}
function isWorktreeClean() {
	const status = gitOutput(["status", "--porcelain=v1"]);
	return status.status === 0 && status.stdout === "";
}
function needsSourceCapsule(commandArgs, providerName) {
	return commandArgs[0] === "run" && !hasOption(commandArgs, "--no-sync") && !isNativeWindowsRemoteTarget(commandArgs) && (canonicalProviderName(providerName) === "blacksmith-testbox" || analyzeRemoteCommand(parseCommandInvocation(help.text, commandArgs)).changedGate);
}
function shouldUseFullCheckoutForRemoteSync(commandArgs, providerName) {
	if (commandArgs[0] !== "run") return false;
	if (hasOption(commandArgs, "--no-sync")) return false;
	if (needsSourceCapsule(commandArgs, providerName)) return true;
	const changedGate = isChangedGateCommand(parseCommandInvocation(help.text, commandArgs).commandArgs);
	return isWorktreeClean() && (isSparseCheckout() || changedGate);
}
function defaultFullCheckoutSyncRoot() {
	const home = homedir();
	if (home) return resolve(home, ".cache", "openclaw", "crabbox-sync");
	return resolve(tmpdir(), "openclaw-crabbox-sync");
}
function fullCheckoutSyncRoot(create = true) {
	const configured = process.env.OPENCLAW_CRABBOX_SYNC_TMPDIR?.trim();
	const root = configured ? resolve(configured) : defaultFullCheckoutSyncRoot();
	if (create) mkdirSync(root, { recursive: true });
	return root;
}
function parseNonNegativeIntegerEnv(name, fallback, unit) {
	const raw = process.env[name]?.trim();
	if (!raw) return fallback;
	if (!/^\d+$/u.test(raw)) throw new Error(`${name} must be a non-negative integer ${unit}, got ${JSON.stringify(raw)}`);
	const parsed = Number(raw);
	if (!Number.isSafeInteger(parsed)) throw new Error(`${name} must be a safe non-negative integer ${unit}, got ${JSON.stringify(raw)}`);
	return parsed;
}
function formatByteCount(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	const units = [
		"KiB",
		"MiB",
		"GiB",
		"TiB"
	];
	let value = bytes / 1024;
	let unitIndex = 0;
	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex += 1;
	}
	return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}
function assertFullCheckoutSyncDisk(root) {
	const requiredBytes = parseNonNegativeIntegerEnv("OPENCLAW_CRABBOX_SYNC_MIN_FREE_BYTES", 1073741824, "byte count");
	if (requiredBytes === 0) return;
	const stats = statfsSync(root);
	const freeBytes = stats.bavail * stats.bsize;
	if (freeBytes >= requiredBytes) return;
	throw new Error([
		"insufficient free disk for Crabbox sparse-sync full checkout",
		`root=${root}`,
		`free=${formatByteCount(freeBytes)}`,
		`required=${formatByteCount(requiredBytes)}`,
		"set OPENCLAW_CRABBOX_SYNC_TMPDIR to a roomier filesystem or lower OPENCLAW_CRABBOX_SYNC_MIN_FREE_BYTES if you know this checkout fits"
	].join("; "));
}
function prepareFullCheckoutForSync() {
	const syncRoot = fullCheckoutSyncRoot();
	assertFullCheckoutSyncDisk(syncRoot);
	const staging = createStaging(syncRoot, repoRoot, "worktree");
	const dir = resolve(staging.payload, "source");
	let active = false;
	function create() {
		active = true;
		try {
			const add = gitOutput([
				"worktree",
				"add",
				"--detach",
				dir,
				"HEAD"
			]);
			if (add.status !== 0) throw new Error(`git worktree add failed: ${add.text}`);
			const disableSparse = gitOutput([
				"-C",
				dir,
				"sparse-checkout",
				"disable"
			]);
			if (disableSparse.status !== 0) throw new Error(`git sparse-checkout disable failed: ${disableSparse.text}`);
		} catch (error) {
			try {
				cleanupFullCheckout(dir, active);
				active = false;
				staging.dispose();
			} catch (cleanupError) {
				staging.hold("registration");
				throw new AggregateError([error, cleanupError], "Full checkout preparation failed; staging retained at " + staging.root, { cause: cleanupError });
			}
			throw error;
		}
	}
	create();
	return {
		dir,
		staging,
		restoreIfMissing() {
			try {
				if (statSync(dir).isDirectory()) return false;
			} catch {}
			console.error(`[crabbox] temporary full checkout disappeared; recreating ${dir}`);
			if (active) {
				const remove = gitOutput([
					"worktree",
					"remove",
					"--force",
					dir
				]);
				if (remove.status !== 0) {
					staging.hold("registration");
					throw new Error(`git worktree remove failed for ${dir}; registration cleanup incomplete; remaining staging retained: ${remove.text}`);
				}
				active = false;
			}
			rmSync(dir, {
				recursive: true,
				force: true
			});
			create();
			return true;
		},
		exists() {
			try {
				return statSync(dir).isDirectory();
			} catch {
				return false;
			}
		},
		cleanup() {
			try {
				cleanupFullCheckout(dir, active);
			} catch (error) {
				staging.hold("registration");
				throw error;
			}
			active = false;
			staging.dispose();
		}
	};
}
function startFullCheckoutKeepalive(checkout, options = {}) {
	let missingReported = false;
	const intervalMs = options.intervalMs ?? fullCheckoutKeepaliveIntervalMs();
	const refresh = () => {
		try {
			if (!checkout.exists()) {
				if (options.onMissing) {
					if (!missingReported) {
						missingReported = true;
						console.error(`[crabbox] temporary full checkout disappeared while Crabbox was running; terminating because the child cwd cannot be repaired: ${checkout.dir}`);
						options.onMissing();
					}
					return;
				}
				checkout.restoreIfMissing();
			}
			const now = /* @__PURE__ */ new Date();
			utimesSync(checkout.dir, now, now);
		} catch (error) {
			console.error(`[crabbox] warning: failed to refresh temporary full checkout ${checkout.dir}: ${error instanceof Error ? error.message : String(error)}`);
		}
	};
	refresh();
	if (intervalMs <= 0) return () => {};
	const interval = setInterval(refresh, intervalMs);
	interval.unref?.();
	return () => clearInterval(interval);
}
function fullCheckoutKeepaliveIntervalMs() {
	return parseNonNegativeIntegerEnv("OPENCLAW_CRABBOX_SYNC_KEEPALIVE_MS", 5e3, "millisecond interval");
}
function cleanupFullCheckout(dir, active) {
	if (active) {
		const remove = gitOutput([
			"worktree",
			"remove",
			"--force",
			dir
		]);
		if (remove.status === 0) return;
		throw new Error(`git worktree remove failed for ${dir}; registration cleanup incomplete; remaining staging retained: ${remove.text}`);
	}
	rmSync(dir, {
		recursive: true,
		force: true
	});
}
function assertFullCheckoutAvailableBeforeExit(dir) {
	try {
		if (statSync(dir).isDirectory()) return true;
	} catch {}
	console.error(`[crabbox] temporary full checkout vanished before Crabbox finished syncing: ${dir}`);
	return false;
}
function injectFullCheckoutLeaseReclaim(commandArgs) {
	if (commandArgs[0] !== "run" || !hasOption(commandArgs, "--id") || hasOption(commandArgs, "--reclaim")) return commandArgs;
	const normalizedArgs = [...commandArgs];
	normalizedArgs.splice(commandOptionEnd(normalizedArgs), 0, "--reclaim");
	return normalizedArgs;
}
function injectRemoteTestboxCi(commandArgs, providerName) {
	if (commandArgs[0] !== "run" || canonicalProviderName(providerName) !== "blacksmith-testbox") return commandArgs;
	const invocation = parseCommandInvocation(help.text, commandArgs);
	if (invocation.start < 0) return commandArgs;
	return replaceRunCommandWithShell(invocation, `export CI=true; ${renderRunShellCommand(invocation)}`);
}
async function applyRunTransforms(initialInvocation, initialFacts, options) {
	const testboxWorkspace = canonicalProviderName(options.provider) === "blacksmith-testbox";
	const sourceBootstrap = options.capsule ? remoteSourceBootstrap(options.capsule, options.changedGateAlias, testboxWorkspace) : "";
	const markedArgs = injectRemoteChangedGateEnvironment(initialInvocation, initialFacts);
	const localArgs = options.childCwd === repoRoot ? markedArgs : absolutizeLocalRunPaths(markedArgs);
	let invocation = parseCommandInvocation(help.text, localArgs);
	const facts = analyzeRemoteCommand(invocation);
	facts.packageManager ||= Boolean(options.capsule);
	const wsl2ScriptBootstrap = prepareRemoteWsl2JsBootstrapScript(invocation, facts, options.provider, sourceBootstrap);
	let transformedArgs = wsl2ScriptBootstrap.args;
	let sourceScriptCleanup = () => {};
	try {
		if (sourceBootstrap && !wsl2ScriptBootstrap.prepared) {
			invocation = parseCommandInvocation(help.text, transformedArgs);
			const scriptOption = invocation.script;
			if (scriptOption) {
				const script = scriptOption.name === "script" ? readFileSync(resolve(repoRoot, scriptOption.value), "utf8") : await readScriptStdin();
				const scriptRoot = mkdtempSync(resolve(tmpdir(), "openclaw-crabbox-source-script-"));
				const scriptPath = resolve(scriptRoot, "script.sh");
				sourceScriptCleanup = () => rmSync(scriptRoot, {
					recursive: true,
					force: true
				});
				writeFileSync(scriptPath, wrapRemoteScript(script, `${sourceBootstrap} || exit $?\nexport CI=true`));
				chmodSync(scriptPath, 448);
				transformedArgs = replaceRunScript(invocation, scriptPath);
			} else if (invocation.start >= 0 && !isAwsMacosRemoteTarget(transformedArgs, options.provider)) transformedArgs = replaceRunCommandWithShell(invocation, `${sourceBootstrap} || exit $?; ${renderRunShellCommand(invocation)}`);
		}
		invocation = parseCommandInvocation(help.text, transformedArgs);
		transformedArgs = injectRemoteAwsMacosJsBootstrap(invocation, facts, options.provider, sourceBootstrap);
		invocation = parseCommandInvocation(help.text, transformedArgs);
		transformedArgs = injectRemoteAwsMacosSwiftBootstrap(invocation, facts, options.provider, facts.swift);
		invocation = parseCommandInvocation(help.text, transformedArgs);
		transformedArgs = injectRemoteWindowsHydratedNodeModulesBootstrap(invocation, facts, options.provider);
		return {
			args: injectRemoteTestboxCi(transformedArgs, options.provider),
			wsl2ScriptBootstrap: {
				...wsl2ScriptBootstrap,
				cleanup() {
					wsl2ScriptBootstrap.cleanup();
					sourceScriptCleanup();
				}
			}
		};
	} catch (error) {
		wsl2ScriptBootstrap.cleanup();
		sourceScriptCleanup();
		throw error;
	}
}
const help = probeCrabboxHelp(binary, [...workloadCommand ? args.slice(0, userArgStart) : ["run"], "--help"]);
const providers = parseProvidersFromHelp(help.text);
commandValueOptionsFromHelp = parseCommandValueOptionsFromHelp(help.text);
const displayBinary = binary === "crabbox" ? "crabbox" : relative(repoRoot, binary);
if (help.status !== 0 || commandValueOptionsFromHelp.size === 0) {
	console.error(`[crabbox] bin=${displayBinary} version=${version} providers=${providers.join(",") || "unknown"}`);
	console.error("[crabbox] selected binary failed --help sanity checks");
	process.exit(2);
}
const helpFlags = /* @__PURE__ */ new Set(["--help", "-h"]);
const invocationOptions = workloadCommand ? parseCommandInvocation(help.text, args).options : null;
if (helpFlags.has(args[0] ?? "") || helpFlags.has(args[userArgStart] ?? "") || args[0] === "help" && args.length <= commandUserArgStart(args.slice(1)) + 1 || ["run", "warmup"].includes(args[0] ?? "") && args[1] === "help" || invocationOptions?.has("help") || invocationOptions?.has("h")) {
	const invocation = spawnInvocation(binary, args, process.env, process.platform);
	const result = spawnSync(invocation.command, invocation.args, {
		cwd: repoRoot,
		stdio: "inherit",
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	if (result.error) console.error(`[crabbox] ${result.error.message}`);
	process.exit(result.status ?? 1);
}
if (args[userArgStart] === "--") args.splice(userArgStart, 1);
const providerSelection = selectedProvider(args, providers);
if (providerSelection.error) {
	console.error(`[crabbox] ${providerSelection.error}`);
	if (providerSelection.readiness) {
		console.error(`[crabbox] provider readiness ${formatProviderReadiness(providerSelection.readiness)}`);
		for (const recovery of providerRecoveryAdvice(providerSelection.readiness)) console.error(`[crabbox] recovery: ${recovery}`);
	}
	process.exit(2);
}
const provider = providerSelection.provider;
const canonicalProvider = canonicalProviderName(provider);
const commandProviderValue = commandProvider(args);
let normalizedArgs = ensureAwsMacOnDemandMarket(ensurePolicyProvider(ensureNativeWindowsHydrateJob(ensureAzureWindowsProvider(args, provider, providers)), providerSelection), provider);
console.error(`[crabbox] bin=${displayBinary} version=${version} provider=${provider || "unknown"} providers=${providers.join(",") || "unknown"}`);
if (providerSelection.source === "policy") console.error(`[crabbox] route workload=${providerSelection.workload} selected=${provider} chain=${providerSelection.chain.join(",")} readiness=${formatProviderReadiness(providerSelection.readiness ?? /* @__PURE__ */ new Map())}`);
if (provider && !isProviderAdvertised(provider, providers)) {
	if (providers.length === 0) {
		console.error("[crabbox] could not parse provider list from --help; refusing to run with --provider without validation");
		process.exit(2);
	}
	console.error(`[crabbox] selected binary does not advertise provider ${provider}; choose a supported provider`);
	process.exit(2);
}
if (canonicalProvider === "blacksmith-testbox") {
	if (normalizedArgs[0] === "run" && parseCommandInvocation(help.text, normalizedArgs).scriptRequested) {
		console.error("[crabbox] provider=blacksmith-testbox does not support --script or --script-stdin. Run a synced script as trailing argv, use --shell, or choose an SSH provider for uploaded scripts.");
		process.exit(2);
	}
	if (normalizedArgs[0] === "run" && hasOption(normalizedArgs, "--no-sync")) {
		console.error("[crabbox] provider=blacksmith-testbox does not support --no-sync. Omit the flag only when source synchronization is intended.");
		process.exit(2);
	}
	if (isWindowsRemoteTarget(normalizedArgs)) {
		console.error(["[crabbox] provider=blacksmith-testbox supports Linux Testbox proof only; it cannot run Windows or WSL2 targets.", "[crabbox] use provider=azure or provider=aws for brokered Crabbox Windows/WSL2 proof, provider=parallels for local Windows, or dispatch .github/workflows/windows-testbox-probe.yml for Blacksmith Windows runner probes."].join("\n"));
		process.exit(2);
	}
}
enforceBrokeredCloud(normalizedArgs, provider, Boolean(commandProviderValue), providerSelection.readiness?.get(canonicalProvider));
if (canonicalProvider === "blacksmith-testbox") {
	const envProviderLocal = process.env.CRABBOX_PROVIDER?.trim();
	console.error(`[crabbox] provider=blacksmith-testbox ${commandProviderValue ? "explicit" : envProviderLocal ? "from CRABBOX_PROVIDER" : "from config"}; if Testbox is queued or down, ${commandProviderValue ? "rerun without --provider to use .crabbox.yaml" : envProviderLocal ? "unset CRABBOX_PROVIDER to use .crabbox.yaml" : "pass another --provider to override it"}`);
	console.error("[crabbox] delegated Testbox proof uses the wrapper exitCode and timing JSON; the linked Actions run can show cancelled during external lease cleanup");
	enforceCrabboxOwnedBlacksmithLease(normalizedArgs);
}
let testboxLeaseFreshness;
try {
	testboxLeaseFreshness = prepareTestboxLeaseFreshness({
		args: normalizedArgs,
		env: {
			...process.env,
			CI: process.env.CI || "true"
		},
		provider: canonicalProvider,
		repoRoot
	});
} catch (error) {
	console.error(`[crabbox] ${error instanceof Error ? error.message : String(error)}`);
	process.exit(2);
}
let childCwd = repoRoot;
let cleanupChildCwd = () => {};
let fullCheckout = null;
let stopFullCheckoutKeepalive = () => {};
let cleanupSucceeded;
let sourceCapsule = null;
let sourceStaging;
let remoteChangedGateAlias = "";
let capturedBlacksmithLeaseId = "";
let scriptBootstrap = {
	args: normalizedArgs,
	cleanup: () => {},
	prepared: false
};
let wsl2ScriptBootstrap = {
	args: normalizedArgs,
	cleanup: () => {},
	prepared: false
};
const preparationAbort = new AbortController();
const childKillGraceMs = resolveChildKillGraceMs(process.env);
let runningChild;
let childTreeSettled = true;
let childTreeShutdownStarted = false;
let childSettlement;
let cancellationSignal;
const signalExitCodes = /* @__PURE__ */ new Map([
	["SIGHUP", 129],
	["SIGINT", 130],
	["SIGTERM", 143]
]);
for (const signal of signalExitCodes.keys()) process.on(signal, () => {
	cancellationSignal ??= signal;
	if (runningChild) exitAfterChildTreeTermination(runningChild, signal, signalExitCodes.get(cancellationSignal) ?? 1);
	else preparationAbort.abort();
});
process.once("exit", cleanupOnce);
function transfersSource(commandArgs) {
	if (hasOption(commandArgs, "--help") || hasOption(commandArgs, "-h") || hasOption(commandArgs, "--dry-run") || hasOption(commandArgs, "--no-sync")) return false;
	const [command, operation] = commandArgs;
	if ([
		"run",
		"watch",
		"shard"
	].includes(command ?? "")) return true;
	if ((command === "job" || command === "bench") && operation === "run") return true;
	if (command === "capsule" && operation === "replay") return true;
	if (command === "checkpoint" && operation === "fork") {
		const separator = commandArgs.indexOf("--");
		return separator >= 0 && separator + 1 < commandArgs.length;
	}
	if (command === "actions" && operation === "hydrate") return true;
	return command === "prewarm" && !hasOption(commandArgs, "--no-hydrate");
}
const sourceTransfer = transfersSource(normalizedArgs);
let discoveredStaging;
if (sourceTransfer) try {
	discoveredStaging = discoverStaging(fullCheckoutSyncRoot(false));
	if (discoveredStaging.entries.length || discoveredStaging.incomplete) {
		const count = (status) => discoveredStaging.entries.filter((entry) => entry.status === status).length;
		console.error(`[crabbox] staging discovery: ${count("active")} active, ${count("protected")} protected, ${count("candidate")} candidates${discoveredStaging.incomplete ? "; scan will continue on later runs" : ""}. Use staging inspect for reasons.`);
	}
} catch (error) {
	console.error("[crabbox] staging discovery unavailable: " + (error instanceof Error ? error.message : String(error)));
}
async function readScriptStdin() {
	return (await buffer(addAbortSignal(preparationAbort.signal, process.stdin))).toString("utf8");
}
async function preparationCheckpoint(preparationError) {
	await setImmediate();
	await setImmediate();
	if (cancellationSignal) {
		if (preparationError !== void 0) {
			const message = preparationError instanceof Error ? preparationError.message : typeof preparationError === "string" ? preparationError : "unknown preparation error";
			console.error(`[crabbox] preparation interrupted: ${message}`);
		}
		cleanupOnce();
		process.exit(signalExitCodes.get(cancellationSignal) ?? 1);
	}
}
try {
	scriptBootstrap = await prepareAwsMacosScriptStdinBootstrap(normalizedArgs, provider);
	normalizedArgs = scriptBootstrap.args;
	if (shouldUseFullCheckoutForRemoteSync(normalizedArgs, provider)) {
		const facts = analyzeRemoteCommand(parseCommandInvocation(help.text, normalizedArgs));
		const changedGate = facts.changedGate ? changedGateBaseForCommand(facts.commandArgs) : null;
		const changedGateBase = changedGate?.resolvedBase ?? "";
		if (needsSourceCapsule(normalizedArgs, provider)) {
			const syncRoot = fullCheckoutSyncRoot();
			assertFullCheckoutSyncDisk(syncRoot);
			sourceCapsule = prepareCrabboxSourceCapsule({
				repoRoot,
				syncRoot,
				syncPlan: spawnInvocation(binary, [
					"sync-plan",
					"--json",
					"--limit",
					"2147483647"
				], process.env, process.platform),
				base: changedGateBase || changedGateBaseForCommand([]).resolvedBase
			});
			sourceStaging = sourceCapsule.staging;
		}
		const capsule = sourceCapsule;
		const checkout = capsule ? {
			dir: capsule.directory,
			staging: capsule.staging,
			cleanup: capsule.cleanup,
			exists: () => pathExists(capsule.directory),
			restoreIfMissing() {
				if (!pathExists(capsule.directory)) throw new Error("frozen source checkout disappeared; rerun from the local candidate");
				return false;
			}
		} : prepareFullCheckoutForSync();
		fullCheckout = checkout;
		sourceStaging = checkout.staging;
		cleanupChildCwd = () => checkout.cleanup();
		childCwd = checkout.dir;
		normalizedArgs = injectFullCheckoutLeaseReclaim(normalizedArgs);
		childCwd = realpathSync(checkout.dir);
		remoteChangedGateAlias = changedGate?.remoteAlias ?? "";
		console.error(`[crabbox] isolated checkout sync; syncing from temporary full checkout ${checkout.dir}`);
		if (facts.changedGate && capsule) console.error(`[crabbox] remote changed gate detected; overlaying the local worktree as changes from ${capsule.baseSha}`);
	}
} catch (error) {
	await preparationCheckpoint(error);
	cleanupOnce();
	throw error;
}
function cleanupOnce() {
	if (cleanupSucceeded !== void 0) return cleanupSucceeded;
	cleanupSucceeded = false;
	if (!childTreeSettled) {
		try {
			sourceStaging?.hold("writers");
		} catch {}
		console.error(childCwd === repoRoot ? "[crabbox] child cleanup is unverified; local inputs remain in place" : `[crabbox] child cleanup is unverified; temporary source retained at ${childCwd}`);
		process.exitCode ||= 1;
		return false;
	}
	let succeeded = true;
	let claimsRestored = true;
	for (const [label, cleanup] of [
		["checkout keepalive", stopFullCheckoutKeepalive],
		["remote script", wsl2ScriptBootstrap.cleanup],
		["script stdin", scriptBootstrap.cleanup]
	]) try {
		cleanup();
	} catch (error) {
		succeeded = false;
		console.error(`[crabbox] ${label} cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
	}
	if (canonicalProvider === "blacksmith-testbox") {
		claimsRestored = restoreTemporaryBlacksmithTestboxClaim(normalizedArgs, capturedBlacksmithLeaseId);
		succeeded = claimsRestored && succeeded;
	}
	try {
		const artifacts = preserveCrabboxArtifacts(childCwd, repoRoot);
		if (artifacts) sourceStaging?.preserved(artifacts);
	} catch (error) {
		try {
			sourceStaging?.hold("artifacts");
		} catch {}
		console.error(`[crabbox] artifact preservation failed: ${error instanceof Error ? error.message : String(error)}; temporary checkout retained at ${childCwd}. Recover .crabbox/runs and .crabbox/captures from this checkout before removing it.`);
		process.exitCode ||= 1;
		return false;
	}
	if (!claimsRestored) {
		try {
			sourceStaging?.hold("claims");
		} catch {}
		console.error(`[crabbox] lease ownership restoration failed; temporary checkout retained at ${childCwd}. Restore the retained lease to ${repoRoot} or stop it before removing this checkout.`);
		process.exitCode ||= 1;
		return false;
	}
	try {
		cleanupChildCwd();
	} catch (error) {
		succeeded = false;
		console.error(`[crabbox] temporary checkout cleanup failed at ${childCwd}: ${error instanceof Error ? error.message : String(error)}`);
	}
	cleanupSucceeded = succeeded;
	if (!succeeded) process.exitCode ||= 1;
	return succeeded;
}
const scriptStdinPrepared = scriptBootstrap.prepared;
const invocation = parseCommandInvocation(help.text, normalizedArgs);
const commandFacts = analyzeRemoteCommand(invocation);
const runtimeEntrypoint = commandFacts.runtimeEntrypoint;
if (normalizedArgs[0] === "run" && provider === "aws" && (runtimeEntrypoint || scriptStdinPrepared)) {
	if (isAwsMacosRemoteTarget(normalizedArgs, provider)) console.error(`[crabbox] provider=aws macOS raw boxes may lack Node/Corepack/pnpm/Bun for ${runtimeEntrypoint || "--script-stdin"}; bootstrapping pinned user-local JavaScript tooling before the command`);
	else {
		const id = optionValue(normalizedArgs, "--id");
		const hydrate = id ? `pnpm crabbox:hydrate -- --id ${id}` : "pnpm crabbox:warmup, then pnpm crabbox:hydrate -- --id <id>";
		console.error(`[crabbox] warning: provider=aws raw boxes may lack Node/Corepack/pnpm/Bun for ${runtimeEntrypoint}; hydrate first (${hydrate}) or pass --provider blacksmith-testbox for OpenClaw CI-like proof; not switching providers automatically`);
	}
}
if (normalizedArgs[0] === "run" && isBrokeredWsl2RemoteTarget(normalizedArgs, provider)) {
	const wsl2RuntimeEntrypoint = awsMacosBunEntrypoints.has(runtimeEntrypoint) ? "" : runtimeEntrypoint;
	if (wsl2RuntimeEntrypoint || commandFacts.packageManager) console.error(`[crabbox] provider=${provider} WSL2 raw boxes may lack Node/Corepack/pnpm for ${wsl2RuntimeEntrypoint || "package-manager"}; using no-hydrate pinned user-local JavaScript tooling before the command`);
}
const childEnv = { ...process.env };
if (sourceCapsule?.configPath) childEnv.CRABBOX_CONFIG = sourceCapsule.configPath;
if (canonicalProvider === "blacksmith-testbox" && !childEnv.CI) childEnv.CI = "true";
if (isLocalContainerProvider(provider) && !childEnv.CRABBOX_LOCAL_CONTAINER_DOCKER_SOCKET && !hasOption(normalizedArgs, "--local-container-docker-socket")) {
	childEnv.CRABBOX_LOCAL_CONTAINER_DOCKER_SOCKET = "1";
	console.error("[crabbox] provider=docker enabling host Docker socket pass-through for OpenClaw Docker tests");
}
if (isLocalContainerProvider(provider) && process.platform === "linux" && !childEnv.CRABBOX_LOCAL_CONTAINER_WORK_ROOT && !hasOption(normalizedArgs, "--local-container-work-root")) {
	childEnv.CRABBOX_LOCAL_CONTAINER_WORK_ROOT = "/tmp/openclaw-crabbox-docker-work";
	console.error("[crabbox] provider=docker using short host-visible work root for OpenClaw Docker tests");
}
try {
	const transformed = await applyRunTransforms(invocation, commandFacts, {
		changedGateAlias: remoteChangedGateAlias,
		capsule: sourceCapsule,
		childCwd,
		provider
	});
	wsl2ScriptBootstrap = transformed.wsl2ScriptBootstrap;
	normalizedArgs = transformed.args;
} catch (error) {
	await preparationCheckpoint(error);
	cleanupOnce();
	throw error;
}
const childArgs = normalizedArgs;
let fullCheckoutKeepaliveIntervalMsValue = 0;
if (fullCheckout) try {
	fullCheckoutKeepaliveIntervalMsValue = fullCheckoutKeepaliveIntervalMs();
} catch (error) {
	cleanupOnce();
	throw error;
}
const childInvocation = spawnInvocation(binary, childArgs, childEnv, process.platform);
const captureBlacksmithTimingJSON = canonicalProvider === "blacksmith-testbox" && hasOption(normalizedArgs, "--timing-json");
const reusedRunLeaseId = normalizedArgs[0] === "run" ? optionValue(normalizedArgs, "--id") : "";
const childStartedAtMs = Date.now();
const FAST_FAIL_HINT_WINDOW_MS = 15e3;
const spawnManagedChild = await loadManagedChildSpawner();
await preparationCheckpoint();
if (sourceStaging?.recorded) {
	let namespace;
	try {
		namespace = captureClaimNamespace(childCwd, childEnv);
	} catch (error) {
		console.error("[crabbox] staging claim namespace unavailable; orphan recovery will remain protected: " + (error instanceof Error ? error.message : String(error)));
	}
	const leaseId = optionValue(normalizedArgs, "--id");
	sourceStaging.admitted(namespace, leaseId ? [leaseId] : void 0);
}
const child = spawnManagedChild(childInvocation.command, childInvocation.args, {
	cwd: childCwd,
	stdio: [
		"inherit",
		"inherit",
		captureBlacksmithTimingJSON ? "pipe" : "inherit"
	],
	detached: process.platform !== "win32",
	env: childEnv,
	windowsVerbatimArguments: childInvocation.windowsVerbatimArguments
});
runningChild = child;
childTreeSettled = false;
const childStderr = child.stderr;
if (childStderr) {
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let discardingOversizedLine = false;
	const observeText = (text) => {
		let remaining = text;
		while (remaining) {
			const newline = remaining.indexOf("\n");
			const fragment = newline >= 0 ? remaining.slice(0, newline) : remaining;
			if (!discardingOversizedLine) {
				pending += fragment;
				if (pending.length > MAX_TIMING_JSON_LINE_CHARS) {
					pending = "";
					discardingOversizedLine = true;
				}
			}
			if (newline < 0) return;
			if (!discardingOversizedLine) observeBlacksmithTimingJSONLine(pending);
			pending = "";
			discardingOversizedLine = false;
			remaining = remaining.slice(newline + 1);
		}
	};
	childStderr.on("data", (chunk) => {
		const canContinue = process.stderr.write(chunk);
		observeText(decoder.write(chunk));
		if (!canContinue) {
			childStderr.pause();
			process.stderr.once("drain", () => childStderr.resume());
		}
	});
	childStderr.on("end", () => {
		observeText(decoder.end());
		if (pending && !discardingOversizedLine) observeBlacksmithTimingJSONLine(pending);
	});
}
child.on("exit", (code, signal) => {
	if (childTreeShutdownStarted) return;
	childTreeShutdownStarted = true;
	finishChildExit(code, signal);
});
async function finishChildExit(code, signal) {
	const settled = await settleChildTree(child, signal ?? void 0);
	let exitCode = code;
	const fullCheckoutAvailable = !fullCheckout || assertFullCheckoutAvailableBeforeExit(fullCheckout.dir);
	if (settled && !signal && code === 0) try {
		recordTestboxLeaseFreshness(testboxLeaseFreshness);
	} catch (error) {
		console.error(`[crabbox] failed to record Testbox lease freshness: ${error instanceof Error ? error.message : String(error)}`);
		exitCode = 2;
	}
	const cleaned = cleanupOnce();
	if (cancellationSignal || signal) process.exit(signalExitCodes.get(cancellationSignal ?? signal) ?? 1);
	const finalExitCode = (exitCode ?? 1) || (settled && fullCheckoutAvailable && cleaned ? 0 : 1);
	if (finalExitCode === 0 && discoveredStaging && !cancellationSignal && !signal) try {
		const recovered = await recoverDiscoveredStaging(fullCheckoutSyncRoot(false), discoveredStaging, {
			binary,
			cwd: repoRoot,
			signal: preparationAbort.signal
		});
		if (recovered) console.error(`[crabbox] staging ${recovered.id}: ${recovered.reason}`);
	} catch (error) {
		console.error("[crabbox] deferred staging recovery retained its inputs: " + (error instanceof Error ? error.message : String(error)));
	}
	if (cancellationSignal) process.exit(signalExitCodes.get(cancellationSignal) ?? 1);
	if (finalExitCode !== 0 && reusedRunLeaseId && Date.now() - childStartedAtMs < FAST_FAIL_HINT_WINDOW_MS) console.error(`[crabbox] run --id ${reusedRunLeaseId} failed fast; reusable leases expire after their idle timeout and rejected flags also exit immediately. Check the first error line above, verify the lease with \`node scripts/crabbox-wrapper.mjs list\`, or warm a fresh one with \`node scripts/crabbox-wrapper.mjs warmup\`.`);
	process.exit(finalExitCode);
}
child.on("error", (error) => {
	if (childTreeShutdownStarted) return;
	childTreeShutdownStarted = true;
	console.error(`[crabbox] failed to execute ${displayBinary}: ${error.message}`);
	(async () => {
		if (child.pid) await settleChildTree(child, "SIGTERM");
		else childTreeSettled = true;
		cleanupOnce();
		process.exit(2);
	})();
});
if (fullCheckout) try {
	stopFullCheckoutKeepalive = startFullCheckoutKeepalive(fullCheckout, {
		intervalMs: fullCheckoutKeepaliveIntervalMsValue,
		onMissing: () => {
			exitAfterChildTreeTermination(child, "SIGTERM", 1);
		}
	});
} catch (error) {
	await settleChildTree(child, "SIGTERM");
	cleanupOnce();
	throw error;
}
function settleChildTree(childProcess, signal) {
	return childSettlement ??= finalizeManagedChild(childProcess, signal, {
		platform: process.platform,
		runTaskkill: spawnSync,
		forceKillDelayMs: childKillGraceMs,
		drainTimeoutMs: childKillGraceMs,
		onTerminated: () => {
			try {
				sourceStaging?.settled(capturedBlacksmithLeaseId ? [capturedBlacksmithLeaseId] : void 0);
			} catch (error) {
				console.error("[crabbox] staging settlement receipt failed: " + (error instanceof Error ? error.message : String(error)));
			}
		}
	}).then(() => {
		childTreeSettled = true;
		runningChild = void 0;
		return true;
	}, (error) => {
		childTreeSettled = !hasUnjoinedWork(error);
		if (childTreeSettled) runningChild = void 0;
		console.error(`[crabbox] child cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
		process.exitCode ||= 1;
		return false;
	});
}
async function exitAfterChildTreeTermination(childProcess, signal, exitCode) {
	if (childTreeShutdownStarted) return;
	childTreeShutdownStarted = true;
	await settleChildTree(childProcess, signal);
	cleanupOnce();
	process.exit(exitCode);
}
function resolveChildKillGraceMs(env) {
	if (!env.VITEST || !env.OPENCLAW_TEST_CRABBOX_CHILD_KILL_GRACE_MS) return 5e3;
	const value = Number.parseInt(env.OPENCLAW_TEST_CRABBOX_CHILD_KILL_GRACE_MS, 10);
	return Number.isFinite(value) && value >= 0 ? value : 5e3;
}
function resolveMetadataProbeTimeoutMs(env) {
	if (!env.VITEST || !env.OPENCLAW_TEST_CRABBOX_METADATA_PROBE_TIMEOUT_MS) return CRABBOX_METADATA_PROBE_TIMEOUT_MS;
	const value = Number.parseInt(env.OPENCLAW_TEST_CRABBOX_METADATA_PROBE_TIMEOUT_MS, 10);
	return Number.isFinite(value) && value > 0 ? value : CRABBOX_METADATA_PROBE_TIMEOUT_MS;
}
//#endregion
export {};
