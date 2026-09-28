import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { a as resolvePackagedCodexNativeCommand } from "./managed-binary-BnshlFag.mjs";
import { n as resolveCodexAppServerSpawnEnv, r as resolveCodexAppServerSpawnInvocation } from "./transport-stdio-h2VHOskC.mjs";
import { createHash } from "node:crypto";
import { resolveWindowsExecutablePath } from "openclaw/plugin-sdk/windows-spawn";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { isPathInside, sha256File } from "openclaw/plugin-sdk/file-access-runtime";
//#region extensions/codex/src/app-server/runtime-artifact.ts
/** Exact local runtime artifact identity for verified Codex setup turns. */
const ARTIFACT_ID_PREFIX = "codex-app-server:v1:";
const ARTIFACT_HASH_DOMAIN = "openclaw-codex-app-server-runtime-artifact-v1\0";
const MAX_ARTIFACT_ID_BYTES = 32768;
const MAX_ARTIFACT_PATH_BYTES = 4096;
const MAX_ARTIFACT_INVOCATION_PATHS = 8;
const MAX_ARTIFACT_DEPTH = 64;
const MAX_ARTIFACT_ENTRIES = 32768;
const MAX_ARTIFACT_FILES = 8192;
const MAX_ARTIFACT_TOTAL_BYTES = 1024n * 1024n * 1024n;
const SAFE_NODE_OPTIONS_BOOLEAN_FLAGS = /* @__PURE__ */ new Set([
	"--enable-network-family-autoselection",
	"--network-family-autoselection",
	"--no-deprecation",
	"--no-network-family-autoselection",
	"--no-warnings",
	"--pending-deprecation",
	"--throw-deprecation",
	"--trace-deprecation",
	"--trace-warnings",
	"--use-bundled-ca",
	"--use-env-proxy",
	"--use-openssl-ca",
	"--use-system-ca"
]);
const SAFE_NODE_OPTIONS_NUMERIC_FLAGS = /* @__PURE__ */ new Set([
	"--max-old-space-size",
	"--max-semi-space-size",
	"--network-family-autoselection-attempt-timeout",
	"--stack-trace-limit"
]);
const SAFE_NODE_OPTIONS_DNS_RESULT_ORDERS = /* @__PURE__ */ new Set([
	"ipv4first",
	"ipv6first",
	"verbatim"
]);
const ARTIFACT_BINDINGS_SYMBOL = Symbol.for("openclaw.codexAppServerRuntimeArtifactBindings");
function getRuntimeArtifactBindings() {
	const globalState = globalThis;
	globalState[ARTIFACT_BINDINGS_SYMBOL] ??= /* @__PURE__ */ new WeakMap();
	return globalState[ARTIFACT_BINDINGS_SYMBOL];
}
function throwIfAborted(signal) {
	if (!signal?.aborted) return;
	throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Codex runtime artifact capture aborted");
}
function compareArtifactNames(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function normalizeRelativePath(filePath) {
	return filePath.split(path.sep).join("/");
}
function sameOpenedFile(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.size === right.size && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}
async function readRegularFileFingerprint(params) {
	throwIfAborted(params.signal);
	if (!(await fs$1.lstat(params.filePath, { bigint: true })).isFile()) throw new Error(`Codex runtime artifact contains a non-regular file: ${params.filePath}`);
	const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
	const handle = await fs$1.open(params.filePath, flags);
	try {
		const before = await handle.stat({ bigint: true });
		if (!before.isFile()) throw new Error(`Codex runtime artifact contains a non-regular file: ${params.filePath}`);
		if (params.budget.fileCount + 1 > MAX_ARTIFACT_FILES) throw new Error("Codex runtime artifact exceeds the bounded file count");
		if (params.budget.totalBytes + before.size > MAX_ARTIFACT_TOTAL_BYTES) throw new Error("Codex runtime artifact exceeds the bounded content size");
		const hash = await sha256File(handle, {
			maxBytes: Number(before.size),
			signal: params.signal
		});
		const after = await handle.stat({ bigint: true });
		const current = await fs$1.stat(params.filePath, { bigint: true });
		if (BigInt(hash.bytes) !== before.size || !sameOpenedFile(before, after) || !sameOpenedFile(after, current)) throw new Error(`Codex runtime artifact changed while reading: ${params.filePath}`);
		params.budget.fileCount += 1;
		params.budget.totalBytes += after.size;
		return {
			contentHash: hash.digest,
			mode: String(after.mode),
			size: String(after.size)
		};
	} finally {
		await handle.close();
	}
}
async function listPackageFiles(params) {
	const files = [];
	let entryCount = 0;
	const visit = async (directory, depth) => {
		throwIfAborted(params.signal);
		if (depth > MAX_ARTIFACT_DEPTH) throw new Error("Codex runtime artifact exceeds the bounded directory depth");
		const entries = await fs$1.readdir(directory, {
			withFileTypes: true,
			encoding: "utf8"
		});
		for (const entry of entries.toSorted((left, right) => compareArtifactNames(left.name, right.name))) {
			throwIfAborted(params.signal);
			entryCount += 1;
			if (entryCount > MAX_ARTIFACT_ENTRIES) throw new Error("Codex runtime artifact exceeds the bounded entry count");
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				await visit(entryPath, depth + 1);
				continue;
			}
			if (!entry.isFile()) throw new Error(`Codex runtime artifact contains an unsupported entry: ${entryPath}`);
			files.push(normalizeRelativePath(path.relative(params.rootPath, entryPath)));
		}
	};
	await visit(params.rootPath, 0);
	return files;
}
function assertSafeNodeOptions(env) {
	for (const [rawKey, value] of Object.entries(env)) {
		if (rawKey.toUpperCase() !== "NODE_OPTIONS" || !value?.trim()) continue;
		const result = attestNodeOptions(value);
		if (result.ok) continue;
		if (result.option) throw new Error(`Codex runtime artifact cannot attest NODE_OPTIONS option ${result.option}`);
		throw new Error("Codex runtime artifact cannot safely parse NODE_OPTIONS");
	}
}
function parseNodeOptions(value) {
	const tokens = [];
	let inQuotes = false;
	let startsNewToken = true;
	for (let index = 0; index < value.length; index += 1) {
		let character = value[index];
		if (character === "\\" && inQuotes) {
			index += 1;
			if (index >= value.length) return;
			character = value[index];
		} else if (character === " " && !inQuotes) {
			startsNewToken = true;
			continue;
		} else if (character === "\"") {
			inQuotes = !inQuotes;
			continue;
		}
		if (startsNewToken) {
			tokens.push(character);
			startsNewToken = false;
		} else tokens[tokens.length - 1] += character;
	}
	return inQuotes ? void 0 : tokens;
}
function normalizedNodeOptionName(token) {
	const equalsIndex = token.indexOf("=");
	const name = (equalsIndex === -1 ? token : token.slice(0, equalsIndex)).replaceAll("_", "-");
	return /^--[a-z][a-z0-9-]{0,63}$/u.test(name) ? name : void 0;
}
function attestNodeOptions(value) {
	const tokens = parseNodeOptions(value);
	if (!tokens || tokens.length === 0) return { ok: false };
	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		const equalsIndex = token.indexOf("=");
		const flag = normalizedNodeOptionName(token);
		if (!flag) return { ok: false };
		const inlineValue = equalsIndex === -1 ? void 0 : token.slice(equalsIndex + 1);
		if (SAFE_NODE_OPTIONS_BOOLEAN_FLAGS.has(flag)) {
			if (inlineValue === void 0) continue;
			return {
				ok: false,
				option: flag
			};
		}
		if (flag === "--disable-warning" && inlineValue && /^[A-Za-z][A-Za-z0-9_.:-]{0,63}$/u.test(inlineValue)) continue;
		if (flag === "--dns-result-order") {
			const order = inlineValue ?? tokens[++index];
			if (order && SAFE_NODE_OPTIONS_DNS_RESULT_ORDERS.has(order)) continue;
			return {
				ok: false,
				option: flag
			};
		}
		if (!SAFE_NODE_OPTIONS_NUMERIC_FLAGS.has(flag)) return {
			ok: false,
			option: flag
		};
		const numericValue = inlineValue ?? tokens[++index];
		if (!numericValue || !/^\d+$/u.test(numericValue)) return {
			ok: false,
			option: flag
		};
	}
	return { ok: true };
}
async function hashSelectedArtifactFiles(descriptor, signal) {
	throwIfAborted(signal);
	if (await fs$1.realpath(descriptor.commandPath) !== descriptor.commandRealPath) throw new Error("Codex runtime launcher selection changed");
	const packageRoot = descriptor.packageRoot;
	if (await resolvePackageRoot(descriptor.nativePath) !== packageRoot) throw new Error("Codex runtime package selection changed");
	if (packageRoot && await fs$1.realpath(packageRoot) !== packageRoot) throw new Error("Codex runtime package root changed");
	const allFiles = [
		descriptor.commandRealPath,
		...descriptor.invocationPaths,
		descriptor.nativePath,
		...descriptor.codeModeHostPath ? [descriptor.codeModeHostPath] : []
	];
	for (const filePath of allFiles) if (await fs$1.realpath(filePath) !== filePath) throw new Error(`Codex runtime artifact file selection changed: ${filePath}`);
	if (descriptor.codeModeHostPath) {
		if (await fs$1.realpath(descriptor.codeModeHostCandidatePath) !== descriptor.codeModeHostPath) throw new Error("Codex code-mode host selection changed");
	} else try {
		await fs$1.lstat(descriptor.codeModeHostCandidatePath);
		throw new Error("Codex code-mode host selection changed");
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	const externalFiles = [...new Set(allFiles)].filter((filePath) => !packageRoot || !isPathInside(packageRoot, filePath)).toSorted(compareArtifactNames);
	const budget = {
		fileCount: 0,
		totalBytes: 0n
	};
	const hash = createHash("sha256");
	hash.update("codex-runtime-files-v1\0");
	for (const filePath of externalFiles) {
		const file = await readRegularFileFingerprint({
			filePath,
			budget,
			signal
		});
		hash.update(JSON.stringify([
			"file",
			filePath,
			file.mode,
			file.size,
			file.contentHash
		]));
		hash.update("\n");
	}
	if (packageRoot) {
		const beforeFiles = await listPackageFiles({
			rootPath: packageRoot,
			signal
		});
		for (const relativePath of beforeFiles) {
			const file = await readRegularFileFingerprint({
				filePath: path.join(packageRoot, ...relativePath.split("/")),
				budget,
				signal
			});
			hash.update(JSON.stringify([
				"package",
				relativePath,
				file.mode,
				file.size,
				file.contentHash
			]));
			hash.update("\n");
		}
		const afterFiles = await listPackageFiles({
			rootPath: packageRoot,
			signal
		});
		if (beforeFiles.length !== afterFiles.length || beforeFiles.some((filePath, index) => filePath !== afterFiles[index])) throw new Error("Codex runtime package changed while reading");
	}
	if (budget.fileCount === 0) throw new Error("Codex runtime artifact contains no regular files");
	return hash.digest("hex");
}
async function resolveCommandPath(command, env, cwd) {
	let candidate;
	if (process.platform === "win32") candidate = resolveWindowsExecutablePath(command, env);
	else if (path.isAbsolute(command) || command.includes("/") || command.includes("\\")) candidate = path.resolve(cwd, command);
	else {
		const pathValue = env.PATH;
		if (pathValue === void 0) throw new Error("Codex runtime PATH is unavailable for a bare launcher");
		for (const entry of pathValue.split(path.delimiter)) {
			const entryPath = entry === "" ? cwd : path.isAbsolute(entry) ? entry : path.resolve(cwd, entry);
			const possible = path.join(entryPath, command);
			try {
				await fs$1.access(possible, constants.X_OK);
				candidate = possible;
				break;
			} catch {}
		}
	}
	if (!candidate) throw new Error(`Codex runtime launcher is unavailable: ${command}`);
	const absolute = path.resolve(candidate);
	if (!(await fs$1.stat(absolute)).isFile()) throw new Error(`Codex runtime launcher is not a regular file: ${absolute}`);
	return absolute;
}
async function readShebang(filePath) {
	const handle = await fs$1.open(filePath, "r");
	try {
		const buffer = Buffer.alloc(4096);
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		const firstLine = buffer.subarray(0, bytesRead).toString("utf8").split(/\r?\n/u, 1)[0] ?? "";
		if (!firstLine.startsWith("#!")) return;
		const tokens = firstLine.slice(2).trim().split(/\s+/u).filter(Boolean);
		if (tokens.length === 0) throw new Error("Codex runtime launcher has an invalid shebang");
		return tokens;
	} finally {
		await handle.close();
	}
}
async function resolvePosixInvocationPaths(params) {
	const paths = [params.commandRealPath];
	const shebang = await readShebang(params.commandRealPath);
	if (!shebang) return paths;
	if (!params.nativeCommand) throw new Error("Codex runtime cannot attest a custom script launcher without its native target");
	const interpreter = await resolveCommandPath(shebang[0], params.env, params.cwd);
	paths.push(await fs$1.realpath(interpreter));
	if (path.basename(interpreter) !== "env") {
		if (shebang.length !== 1) throw new Error("Codex runtime launcher uses unsupported interpreter arguments");
		return paths;
	}
	const envArgs = shebang.slice(1);
	const commandIndex = envArgs[0] === "-S" ? 1 : 0;
	const target = envArgs[commandIndex];
	if (!target || target.startsWith("-") || envArgs.length !== commandIndex + 1) throw new Error("Codex runtime launcher uses unsupported env arguments");
	const targetPath = await resolveCommandPath(target, params.env, params.cwd);
	paths.push(await fs$1.realpath(targetPath));
	return paths;
}
async function resolvePackageRoot(nativePath) {
	const binDir = path.dirname(nativePath);
	if (path.basename(binDir) !== "bin") return;
	const candidate = path.dirname(binDir);
	const metadataPath = path.join(candidate, "codex-package.json");
	try {
		if (!(await fs$1.lstat(metadataPath)).isFile()) return;
		const root = await fs$1.realpath(candidate);
		return isPathInside(root, nativePath) ? root : void 0;
	} catch {
		return;
	}
}
async function resolveOptionalRegularFile(filePath) {
	try {
		const canonical = await fs$1.realpath(filePath);
		return (await fs$1.stat(canonical)).isFile() ? canonical : void 0;
	} catch {
		return;
	}
}
function isMissingPathError(error) {
	return error instanceof Error && "code" in error && error.code === "ENOENT";
}
async function captureFilesystemDescriptor(params) {
	throwIfAborted(params.signal);
	if (params.startOptions.transport !== "stdio") throw new Error("Verified Codex inference requires a local stdio runtime artifact; WebSocket attestation is unsupported");
	if (isCodexAppServerProxyLaunch(params.startOptions.args)) throw new Error("Verified Codex inference requires a local runtime artifact; app-server proxy attestation is unsupported");
	const env = resolveCodexAppServerSpawnEnv(params.startOptions);
	assertSafeNodeOptions(env);
	const invocation = resolveCodexAppServerSpawnInvocation(params.startOptions, env);
	const spawnCwd = path.resolve(params.startOptions.cwd ?? process.cwd());
	const commandPath = await resolveCommandPath(params.startOptions.command, env, spawnCwd);
	const commandRealPath = await fs$1.realpath(commandPath);
	let nativeCommand = params.spawnIdentity.nativeCommand;
	let invocationPaths;
	if (process.platform === "win32" || invocation.resolution === "node-entrypoint") {
		const entrypoint = invocation.resolution === "node-entrypoint" ? invocation.argv[0] : void 0;
		if (entrypoint && !nativeCommand) {
			const entrypointPath = await resolveCommandPath(entrypoint, env, spawnCwd);
			nativeCommand = resolvePackagedCodexNativeCommand(await fs$1.realpath(entrypointPath));
		}
		if (invocation.resolution === "node-entrypoint" && !nativeCommand) throw new Error("Codex runtime cannot attest a custom Node launcher without its native target");
		const invocationCandidates = [
			commandRealPath,
			invocation.command,
			...entrypoint ? [entrypoint] : []
		];
		invocationPaths = [];
		for (const candidate of invocationCandidates) {
			const resolved = await resolveCommandPath(candidate, env, spawnCwd);
			invocationPaths.push(await fs$1.realpath(resolved));
		}
	} else {
		nativeCommand ??= resolvePackagedCodexNativeCommand(commandRealPath);
		invocationPaths = await resolvePosixInvocationPaths({
			commandRealPath,
			env,
			cwd: spawnCwd,
			nativeCommand
		});
	}
	invocationPaths = [...new Set(invocationPaths)].toSorted(compareArtifactNames);
	if (invocationPaths.length > MAX_ARTIFACT_INVOCATION_PATHS) throw new Error("Codex runtime launcher exceeds the bounded invocation file count");
	const nativePath = await fs$1.realpath(await resolveCommandPath(nativeCommand ?? invocation.command, env, spawnCwd));
	const packageRoot = await resolvePackageRoot(nativePath);
	const codeModeHostCandidatePath = path.join(path.dirname(nativePath), process.platform === "win32" ? "codex-code-mode-host.exe" : "codex-code-mode-host");
	const codeModeHostPath = await resolveOptionalRegularFile(codeModeHostCandidatePath);
	const descriptor = {
		version: 1,
		commandPath,
		commandRealPath,
		invocationPaths,
		nativePath,
		argsFingerprint: params.spawnIdentity.argsFingerprint,
		...packageRoot ? { packageRoot } : {},
		codeModeHostCandidatePath,
		...codeModeHostPath ? { codeModeHostPath } : {},
		...params.spawnIdentity.commandSource ? { commandSource: params.spawnIdentity.commandSource } : {},
		...params.spawnIdentity.managedCommandOrder ? { managedCommandOrder: params.spawnIdentity.managedCommandOrder } : {}
	};
	validateFilesystemDescriptorShape(descriptor);
	return descriptor;
}
function isBoundedPath(value) {
	return typeof value === "string" && value.length > 0 && Buffer.byteLength(value, "utf8") <= MAX_ARTIFACT_PATH_BYTES && path.isAbsolute(value);
}
function validateFilesystemDescriptorShape(descriptor) {
	if (descriptor.version !== 1 || !isBoundedPath(descriptor.commandPath) || !isBoundedPath(descriptor.commandRealPath) || !isBoundedPath(descriptor.nativePath) || !isBoundedPath(descriptor.codeModeHostCandidatePath) || !Array.isArray(descriptor.invocationPaths) || descriptor.invocationPaths.length === 0 || descriptor.invocationPaths.length > MAX_ARTIFACT_INVOCATION_PATHS || descriptor.invocationPaths.some((entry) => !isBoundedPath(entry)) || !descriptor.invocationPaths.includes(descriptor.commandRealPath) || !/^[a-f0-9]{64}$/u.test(descriptor.argsFingerprint)) throw new Error("Invalid Codex runtime artifact descriptor");
	if (descriptor.packageRoot) {
		if (!isBoundedPath(descriptor.packageRoot) || path.dirname(path.dirname(descriptor.nativePath)) !== descriptor.packageRoot || path.basename(path.dirname(descriptor.nativePath)) !== "bin") throw new Error("Invalid Codex runtime package descriptor");
	}
	if (descriptor.codeModeHostPath && !isBoundedPath(descriptor.codeModeHostPath)) throw new Error("Invalid Codex code-mode host artifact descriptor");
	if (descriptor.commandSource !== void 0 && ![
		"managed",
		"resolved-managed",
		"config",
		"env"
	].includes(descriptor.commandSource)) throw new Error("Invalid Codex runtime command source");
	if (descriptor.managedCommandOrder !== void 0 && ![
		"package-first",
		"package-only",
		"desktop-first"
	].includes(descriptor.managedCommandOrder)) throw new Error("Invalid Codex managed command order");
	if (descriptor.managedCommandOrder !== void 0 && descriptor.commandSource !== "resolved-managed") throw new Error("Invalid Codex managed runtime descriptor");
	const canonicalInvocationPaths = [...new Set(descriptor.invocationPaths)].toSorted(compareArtifactNames);
	if (canonicalInvocationPaths.length !== descriptor.invocationPaths.length || canonicalInvocationPaths.some((entry, index) => entry !== descriptor.invocationPaths[index])) throw new Error("Invalid Codex runtime invocation descriptor");
}
function validateArtifactDescriptorShape(descriptor) {
	validateFilesystemDescriptorShape(descriptor);
	if (typeof descriptor.serverVersion !== "string" || descriptor.serverVersion.length === 0 || descriptor.serverVersion.length > 128 || descriptor.serverVersion !== descriptor.serverVersion.trim()) throw new Error("Invalid Codex runtime server version");
	if (descriptor.userAgentFingerprint !== void 0 && !/^[a-f0-9]{64}$/u.test(descriptor.userAgentFingerprint)) throw new Error("Invalid Codex runtime user-agent fingerprint");
}
function encodeArtifactId(descriptor) {
	return `${ARTIFACT_ID_PREFIX}${Buffer.from(JSON.stringify(descriptor), "utf8").toString("base64url")}`;
}
function decodeArtifactId(id) {
	if (!id.startsWith(ARTIFACT_ID_PREFIX) || Buffer.byteLength(id, "utf8") > MAX_ARTIFACT_ID_BYTES) throw new Error("Invalid Codex runtime artifact id");
	const encoded = id.slice(20);
	if (!/^[A-Za-z0-9_-]+$/u.test(encoded)) throw new Error("Invalid Codex runtime artifact encoding");
	const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid Codex runtime artifact descriptor");
	const descriptor = parsed;
	const allowedKeys = /* @__PURE__ */ new Set([
		"version",
		"commandPath",
		"commandRealPath",
		"invocationPaths",
		"nativePath",
		"packageRoot",
		"codeModeHostCandidatePath",
		"codeModeHostPath",
		"argsFingerprint",
		"commandSource",
		"managedCommandOrder",
		"serverVersion",
		"userAgentFingerprint"
	]);
	if (Object.keys(descriptor).some((key) => !allowedKeys.has(key))) throw new Error("Invalid Codex runtime artifact descriptor fields");
	validateArtifactDescriptorShape(descriptor);
	if (encodeArtifactId(descriptor) !== id) throw new Error("Invalid noncanonical Codex runtime artifact id");
	return descriptor;
}
function fingerprintBinding(descriptor, contentFingerprint) {
	return createHash("sha256").update(ARTIFACT_HASH_DOMAIN).update(JSON.stringify(descriptor)).update("\0").update(contentFingerprint).digest("hex");
}
/** Captures exact candidate bytes immediately before app-server startup. */
async function captureCodexAppServerRuntimeArtifactBeforeStart(params) {
	const descriptor = await captureFilesystemDescriptor(params);
	return {
		descriptor,
		contentFingerprint: await hashSelectedArtifactFiles(descriptor, params.signal)
	};
}
/** Rechecks startup bytes and adds initialized handshake identity. */
async function finalizeCodexAppServerRuntimeArtifact(params) {
	const afterDescriptor = await captureFilesystemDescriptor(params);
	const afterContentFingerprint = await hashSelectedArtifactFiles(afterDescriptor, params.signal);
	if (JSON.stringify(afterDescriptor) !== JSON.stringify(params.before.descriptor) || afterContentFingerprint !== params.before.contentFingerprint) throw new Error("Codex app-server runtime artifact changed during startup");
	const serverVersion = params.runtimeIdentity?.serverVersion?.trim();
	if (!serverVersion) throw new Error("Codex app-server did not report an initialized runtime identity");
	const userAgent = params.runtimeIdentity?.userAgent;
	const descriptor = {
		...afterDescriptor,
		serverVersion,
		...userAgent ? { userAgentFingerprint: createHash("sha256").update(userAgent).digest("hex") } : {}
	};
	validateArtifactDescriptorShape(descriptor);
	return Object.freeze({
		id: encodeArtifactId(descriptor),
		fingerprint: fingerprintBinding(descriptor, afterContentFingerprint)
	});
}
/** Checks current pre-spawn bytes and selection against a previously minted binding. */
function validateCodexAppServerRuntimeArtifactCapture(binding, capture) {
	try {
		const expectedDescriptor = decodeArtifactId(binding.id);
		const { serverVersion: _serverVersion, userAgentFingerprint: _userAgentFingerprint, ...expectedFilesystemDescriptor } = expectedDescriptor;
		return JSON.stringify(expectedFilesystemDescriptor) === JSON.stringify(capture.descriptor) && binding.fingerprint === fingerprintBinding(expectedDescriptor, capture.contentFingerprint);
	} catch {
		return false;
	}
}
/** Commits a verified binding only after the client has completed auth setup. */
function bindCodexAppServerRuntimeArtifact(client, binding) {
	const bindings = getRuntimeArtifactBindings();
	const existing = bindings.get(client);
	if (existing && (existing.id !== binding.id || existing.fingerprint !== binding.fingerprint)) throw new Error("Codex app-server client already has a different runtime artifact");
	bindings.set(client, Object.freeze({ ...binding }));
}
/** Reads the immutable artifact attached to one successfully initialized client. */
function readCodexAppServerClientRuntimeArtifact(client) {
	return getRuntimeArtifactBindings().get(client);
}
/** Re-hashes only the exact Codex files named by a server-minted artifact binding. */
async function validateCodexAppServerRuntimeArtifact(binding, signal) {
	try {
		const descriptor = decodeArtifactId(binding.id);
		const contentFingerprint = await hashSelectedArtifactFiles(descriptor, signal);
		return binding.fingerprint === fingerprintBinding(descriptor, contentFingerprint);
	} catch {
		return false;
	}
}
//#endregion
export { bindCodexAppServerRuntimeArtifact, captureCodexAppServerRuntimeArtifactBeforeStart, finalizeCodexAppServerRuntimeArtifact, readCodexAppServerClientRuntimeArtifact, validateCodexAppServerRuntimeArtifact, validateCodexAppServerRuntimeArtifactCapture };
