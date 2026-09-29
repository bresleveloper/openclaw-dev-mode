import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { o as resolveExecutablePath, s as resolveExecutablePathCandidate } from "./executable-path-BMRdcL7i.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-CR3vyrK9.mjs";
import { n as readCodexCliCredentialsCached, r as readGeminiCliCredentialsCached } from "./cli-credentials-Be2RCYO6.mjs";
import { n as ensureAuthProfileStore, o as loadAuthProfileStoreForRuntime } from "./store-runtime-BcoYkagW.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-SxX34tmf.mjs";
import { a as fingerprintResolvedAuthProfileCredential, i as fingerprintOpaqueRuntimeOwner, n as fingerprintAuthProfileOwnerShape, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-DkIxPe6Z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/agents/cli-executable-identity.ts
const MAX_PACKAGE_ARTIFACT_FILES = 8192;
const MAX_PACKAGE_ARTIFACT_ENTRIES = MAX_PACKAGE_ARTIFACT_FILES * 4;
const MAX_PACKAGE_ARTIFACT_BYTES = 1024n * 1024n * 1024n;
function sameOpenedFile(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.size === right.size && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}
function compareArtifactEntryNames(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
async function readExecutableFileIdentity(filePath, includePrefix = false) {
	let canonicalPath;
	try {
		canonicalPath = await fs.realpath(filePath);
	} catch {
		return null;
	}
	let handle;
	try {
		handle = await fs.open(canonicalPath, "r");
		const before = await handle.stat({ bigint: true });
		if (!before.isFile()) return null;
		const hash = await sha256File(handle);
		const prefix = Buffer.allocUnsafe(includePrefix ? Math.min(4096, hash.bytes) : 0);
		const prefixBytes = includePrefix ? await readFileWindowFully(handle, prefix, 0) : 0;
		const after = await handle.stat({ bigint: true });
		const current = await fs.stat(canonicalPath, { bigint: true });
		if (!sameOpenedFile(before, after) || !sameOpenedFile(after, current)) return null;
		return {
			identity: {
				path: canonicalPath,
				device: String(after.dev),
				inode: String(after.ino),
				mode: String(after.mode),
				size: String(after.size),
				modifiedNs: String(after.mtimeNs),
				changedNs: String(after.ctimeNs),
				contentSha256: hash.digest
			},
			prefix: prefix.subarray(0, prefixBytes)
		};
	} catch {
		return null;
	} finally {
		await handle?.close().catch(() => {});
	}
}
function hasPathSeparator(value) {
	return value.includes("/") || value.includes("\\");
}
function isDurableRootedCommand(value) {
	return path.isAbsolute(value) || /^~[\\/]/u.test(value);
}
function pathEntriesAreAbsolute(env) {
	const pathValue = resolveEnvironmentValue(env, "PATH") ?? "";
	const delimiter = process.platform === "win32" ? ";" : path.delimiter;
	return pathValue.split(delimiter).filter(Boolean).every((entry) => path.isAbsolute(entry));
}
function resolveCommandPath(params) {
	if (!hasPathSeparator(params.command) && !pathEntriesAreAbsolute(params.env)) return;
	if (hasPathSeparator(params.command) && !isDurableRootedCommand(params.command)) return;
	const command = process.platform === "win32" ? resolveWindowsExecutablePath(params.command, params.env) : params.command;
	if (process.platform === "win32" && !isDurableRootedCommand(command)) return;
	const options = {
		...params.cwd ? { cwd: params.cwd } : {},
		env: params.env
	};
	return process.platform === "win32" && isDurableRootedCommand(params.command) ? resolveExecutablePathCandidate(command, options) : resolveExecutablePath(command, options);
}
function hasShebang(prefix) {
	return prefix.subarray(0, 2).toString("utf8") === "#!";
}
function parseShebangInterpreter(prefix) {
	const firstLine = prefix.toString("utf8").split(/\r?\n/u, 1)[0] ?? "";
	if (!firstLine.startsWith("#!")) return null;
	const tokens = firstLine.slice(2).trim().split(/\s+/u).filter(Boolean);
	const executable = tokens[0];
	if (!executable) return null;
	if (path.basename(executable) !== "env") return {
		executable,
		args: tokens.slice(1)
	};
	const envArgs = tokens.slice(1);
	const commandStart = envArgs[0] === "-S" ? 1 : 0;
	const viaEnv = envArgs[commandStart];
	if (!viaEnv || viaEnv.startsWith("-")) return null;
	return {
		executable,
		viaEnv,
		args: envArgs.slice(commandStart + 1)
	};
}
async function findOwnedPackageRoot(params) {
	let directory = path.dirname(params.entrypointPath);
	for (;;) {
		const packageJsonPath = path.join(directory, "package.json");
		try {
			if (JSON.parse(await fs.readFile(packageJsonPath, "utf8")).name === params.policy.packageName) return await fs.realpath(directory);
		} catch {}
		const parent = path.dirname(directory);
		if (parent === directory) return;
		directory = parent;
	}
}
async function resolvePackageTreeArtifact(params) {
	if (!params.policy || params.policy.kind !== "bundled-package-tree") return;
	const policy = params.policy;
	const rootPath = await findOwnedPackageRoot({
		entrypointPath: params.entrypointPath,
		policy
	});
	if (!rootPath) return;
	try {
		const packageJson = JSON.parse(await fs.readFile(path.join(rootPath, "package.json"), "utf8"));
		if ([packageJson.dependencies, packageJson.peerDependencies].some((dependencies) => dependencies !== void 0 && (dependencies === null || typeof dependencies !== "object" || Array.isArray(dependencies) || Object.keys(dependencies).length > 0))) return;
	} catch {
		return;
	}
	const hash = crypto.createHash("sha256");
	let entryCount = 0;
	let fileCount = 0;
	let totalBytes = 0n;
	let packageVersion;
	const visit = async (directory) => {
		let entries;
		try {
			entries = await fs.readdir(directory, {
				withFileTypes: true,
				encoding: "utf8"
			});
		} catch {
			return false;
		}
		for (const entry of entries.toSorted((left, right) => compareArtifactEntryNames(left.name, right.name))) {
			entryCount += 1;
			if (entryCount > MAX_PACKAGE_ARTIFACT_ENTRIES) return false;
			const entryPath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				if (!await visit(entryPath)) return false;
				continue;
			}
			if (!entry.isFile()) return false;
			let size;
			try {
				const stat = await fs.stat(entryPath, { bigint: true });
				if (!stat.isFile()) return false;
				size = stat.size;
			} catch {
				return false;
			}
			if (fileCount + 1 > MAX_PACKAGE_ARTIFACT_FILES || totalBytes + size > MAX_PACKAGE_ARTIFACT_BYTES) return false;
			const file = await readExecutableFileIdentity(entryPath);
			if (!file) return false;
			const relativePath = path.relative(rootPath, file.identity.path).split(path.sep).join("/");
			if (relativePath === "package.json") {
				let manifest;
				try {
					manifest = JSON.parse(await fs.readFile(entryPath, "utf8"));
				} catch {
					return false;
				}
				const manifestAfterRead = await readExecutableFileIdentity(entryPath);
				if (!manifestAfterRead || JSON.stringify(manifestAfterRead.identity) !== JSON.stringify(file.identity) || manifest.name !== policy.packageName || typeof manifest.version !== "string" || !manifest.version.trim()) return false;
				packageVersion = manifest.version.trim();
			}
			fileCount += 1;
			totalBytes += BigInt(file.identity.size);
			if (fileCount > MAX_PACKAGE_ARTIFACT_FILES || totalBytes > MAX_PACKAGE_ARTIFACT_BYTES) return false;
			hash.update(JSON.stringify([
				relativePath,
				file.identity.mode,
				file.identity.size,
				file.identity.contentSha256
			]));
			hash.update("\n");
		}
		return true;
	};
	if (!await visit(rootPath) || fileCount === 0 || !packageVersion) return;
	return {
		kind: "package-tree",
		packageName: policy.packageName,
		packageVersion,
		rootPath,
		fileCount,
		totalBytes: String(totalBytes),
		treeSha256: hash.digest("hex")
	};
}
function allowsSelfContainedExecutable(filePath, resolvedCommandPath, policy) {
	if (!policy) return false;
	const basenames = new Set([filePath, resolvedCommandPath].map((candidate) => {
		const basename = path.basename(candidate);
		return process.platform === "win32" ? basename.toLowerCase() : basename;
	}));
	return policy.nativeExecutableNames?.some((name) => basenames.has(process.platform === "win32" ? name.toLowerCase() : name)) === true;
}
async function resolvePosixIdentity(params) {
	const commandFile = await readExecutableFileIdentity(params.resolvedPath, true);
	if (!commandFile) return;
	const files = [commandFile.identity];
	const commandHasShebang = hasShebang(commandFile.prefix);
	const shebang = parseShebangInterpreter(commandFile.prefix);
	if (commandHasShebang && !shebang) return;
	if (shebang && shebang.args.length > 0) return;
	const packageEntrypoint = shebang ? commandFile.identity : void 0;
	const runtimeArtifact = packageEntrypoint ? await resolvePackageTreeArtifact({
		entrypointPath: packageEntrypoint.path,
		policy: params.runtimeArtifact
	}) : allowsSelfContainedExecutable(commandFile.identity.path, params.resolvedPath, params.runtimeArtifact) ? { kind: "self-contained-executable" } : void 0;
	if (!runtimeArtifact) return;
	if (shebang) {
		const interpreterPath = resolveCommandPath({
			command: shebang.executable,
			cwd: params.cwd,
			env: params.env
		});
		if (!interpreterPath) return;
		const interpreter = await readExecutableFileIdentity(interpreterPath, true);
		if (!interpreter || hasShebang(interpreter.prefix)) return;
		files.push(interpreter.identity);
		let invocationInterpreter = interpreter.identity.path;
		if (shebang.viaEnv) {
			const targetPath = resolveCommandPath({
				command: shebang.viaEnv,
				cwd: params.cwd,
				env: params.env
			});
			if (!targetPath) return;
			const target = await readExecutableFileIdentity(targetPath, true);
			if (!target || hasShebang(target.prefix)) return;
			files.push(target.identity);
			invocationInterpreter = target.identity.path;
		}
		return {
			command: params.command,
			resolvedPath: commandFile.identity.path,
			invocation: {
				command: invocationInterpreter,
				leadingArgv: [...shebang.args, commandFile.identity.path],
				resolution: "direct"
			},
			files: dedupeFileIdentities(files),
			runtimeArtifact
		};
	}
	const resolvedPath = commandFile.identity.path;
	return {
		command: params.command,
		resolvedPath,
		invocation: {
			command: resolvedPath,
			...params.resolvedPath !== resolvedPath ? { argv0: params.resolvedPath } : {},
			leadingArgv: [],
			resolution: "direct"
		},
		files: dedupeFileIdentities(files),
		runtimeArtifact
	};
}
function dedupeFileIdentities(files) {
	return files.filter((file, index) => files.findIndex((candidate) => candidate.path === file.path) === index);
}
async function resolveWindowsIdentity(params) {
	const nodePath = resolveWindowsExecutablePath("node", params.env);
	const candidate = resolveWindowsSpawnProgramCandidate({
		command: params.resolvedPath,
		env: params.env,
		execPath: nodePath
	});
	if (candidate.resolution === "unresolved-wrapper") return;
	if (candidate.resolution !== "node-entrypoint" && !resolveExecutablePath(params.resolvedPath, { env: params.env })) return;
	if (candidate.resolution === "node-entrypoint" && path.extname(candidate.command).toLowerCase() !== ".exe") return;
	const configuredFile = await readExecutableFileIdentity(params.resolvedPath);
	const invocationFile = await readExecutableFileIdentity(candidate.command, candidate.resolution === "direct");
	if (!configuredFile || !invocationFile) return;
	const files = [configuredFile.identity, invocationFile.identity];
	const leadingArgv = [];
	for (const entry of candidate.leadingArgv) {
		const entryFile = await readExecutableFileIdentity(entry);
		if (!entryFile) return;
		files.push(entryFile.identity);
		leadingArgv.push(entryFile.identity.path);
	}
	const commandEntrypoint = candidate.resolution === "node-entrypoint" ? files.find((file) => file.path === leadingArgv[0]) : void 0;
	if (candidate.resolution === "direct" && hasShebang(invocationFile.prefix)) return;
	const scriptEntrypoint = commandEntrypoint;
	const runtimeArtifact = scriptEntrypoint ? await resolvePackageTreeArtifact({
		entrypointPath: scriptEntrypoint.path,
		policy: params.runtimeArtifact
	}) : allowsSelfContainedExecutable(invocationFile.identity.path, params.resolvedPath, params.runtimeArtifact) ? { kind: "self-contained-executable" } : void 0;
	if (!runtimeArtifact) return;
	return {
		command: params.command,
		resolvedPath: configuredFile.identity.path,
		invocation: {
			command: invocationFile.identity.path,
			leadingArgv,
			resolution: candidate.resolution
		},
		files: dedupeFileIdentities(files),
		runtimeArtifact
	};
}
/**
* Resolve and fingerprint the exact program a CLI child will execute.
*
* Call only while minting or revalidating verified setup authority: content
* hashing is deliberate and must not enter the normal CLI request hot path.
*/
async function resolveCliExecutableIdentity(params) {
	const command = params.command.trim();
	if (!command) return;
	const env = params.env ?? process.env;
	const resolvedPath = resolveCommandPath({
		command,
		...params.cwd ? { cwd: params.cwd } : {},
		env
	});
	if (!resolvedPath) return;
	return process.platform === "win32" ? await resolveWindowsIdentity({
		command,
		resolvedPath,
		env,
		...params.runtimeArtifact ? { runtimeArtifact: params.runtimeArtifact } : {}
	}) : await resolvePosixIdentity({
		command,
		resolvedPath,
		...params.cwd ? { cwd: params.cwd } : {},
		env,
		...params.runtimeArtifact ? { runtimeArtifact: params.runtimeArtifact } : {}
	});
}
//#endregion
//#region src/agents/cli-auth-epoch.ts
/**
* Builds auth-state epochs for CLI-backed runtimes so reusable sessions reset
* when the owning local credential identity changes.
*/
const defaultCliAuthEpochDeps = {
	readCodexCliCredentialsCached,
	readGeminiCliCredentialsCached,
	ensureAuthProfileStore,
	loadAuthProfileStoreForRuntime
};
const cliAuthEpochDeps = { ...defaultCliAuthEpochDeps };
const GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
/** Overrides credential readers for auth-epoch unit tests. */
function setCliAuthEpochTestDeps(overrides) {
	Object.assign(cliAuthEpochDeps, overrides);
}
/** Restores default credential readers after auth-epoch unit tests. */
function resetCliAuthEpochTestDeps() {
	Object.assign(cliAuthEpochDeps, defaultCliAuthEpochDeps);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cliAuthEpochTestApi")] = {
	setCliAuthEpochTestDeps,
	resetCliAuthEpochTestDeps
};
function hashCliAuthEpochPart(value) {
	return crypto.createHash("sha256").update(value).digest("hex");
}
function encodeUnknown(value) {
	return JSON.stringify(value ?? null);
}
function encodeOAuthIdentity(credential) {
	return JSON.stringify([
		"oauth",
		credential.provider,
		credential.clientId ?? null,
		credential.email ?? null,
		credential.enterpriseUrl ?? null,
		credential.projectId ?? null,
		credential.accountId ?? null
	]);
}
function encodeCodexCredential(credential) {
	return encodeOAuthIdentity(credential);
}
function encodeGeminiCredential(credential) {
	return encodeOAuthIdentity(credential);
}
function encodeAuthProfileCredential(credential) {
	switch (credential.type) {
		case "api_key": return JSON.stringify([
			"api_key",
			credential.provider,
			credential.key ?? null,
			encodeUnknown(credential.keyRef),
			credential.email ?? null,
			credential.displayName ?? null,
			encodeUnknown(credential.metadata)
		]);
		case "token":
			if (credential.tokenRef !== void 0) return JSON.stringify([
				"token-identity",
				credential.provider,
				encodeUnknown(credential.tokenRef),
				credential.email ?? null,
				credential.displayName ?? null
			]);
			return JSON.stringify([
				"token",
				credential.provider,
				credential.token ?? null,
				encodeUnknown(credential.tokenRef),
				credential.email ?? null,
				credential.displayName ?? null
			]);
		case "oauth": return encodeOAuthIdentity(credential);
	}
	throw new Error("Unsupported auth profile credential type");
}
function hasOAuthAccountIdentity(credential) {
	return credential.type === "oauth" && (normalizeOptionalString(credential.accountId) !== void 0 || normalizeOptionalString(credential.email) !== void 0);
}
function encodeAuthProfileEpochPart(authProfileId, credential) {
	const credentialHash = hashCliAuthEpochPart(encodeAuthProfileCredential(credential));
	if (hasOAuthAccountIdentity(credential) && credential.provider !== GEMINI_CLI_PROVIDER_ID) return `profile:oauth-identity:${credentialHash}`;
	return `profile:${authProfileId}:${credentialHash}`;
}
function getLocalCliCredentialFingerprint(provider) {
	switch (provider) {
		case "codex-cli": {
			const credential = cliAuthEpochDeps.readCodexCliCredentialsCached({
				ttlMs: 5e3,
				allowKeychainPrompt: false
			});
			return credential ? hashCliAuthEpochPart(encodeCodexCredential(credential)) : void 0;
		}
		case "google-gemini-cli": {
			const credential = cliAuthEpochDeps.readGeminiCliCredentialsCached({ ttlMs: 5e3 });
			return credential ? hashCliAuthEpochPart(encodeGeminiCredential(credential)) : void 0;
		}
		default: return;
	}
}
function getLocalCliCredential(provider) {
	switch (provider) {
		case "codex-cli": return cliAuthEpochDeps.readCodexCliCredentialsCached({
			ttlMs: 0,
			allowKeychainPrompt: false
		}) ?? void 0;
		case "google-gemini-cli": return cliAuthEpochDeps.readGeminiCliCredentialsCached({ ttlMs: 0 }) ?? void 0;
		default: return;
	}
}
function getAuthProfileCredential(store, authProfileId) {
	if (!authProfileId) return;
	return store.profiles[authProfileId];
}
/** Resolves the stable auth epoch hash for a CLI runtime/provider session. */
async function resolveCliAuthEpoch(params) {
	const provider = params.provider.trim();
	const authProfileId = normalizeOptionalString(params.authProfileId);
	const parts = [];
	if (params.skipLocalCredential !== true) {
		const localFingerprint = getLocalCliCredentialFingerprint(provider);
		if (localFingerprint) parts.push(`local:${provider}:${localFingerprint}`);
	}
	if (authProfileId) {
		const credential = getAuthProfileCredential(cliAuthEpochDeps.loadAuthProfileStoreForRuntime(params.agentDir, {
			readOnly: true,
			allowKeychainPrompt: false
		}), authProfileId);
		if (credential) parts.push(encodeAuthProfileEpochPart(authProfileId, credential));
	}
	if (parts.length === 0) return;
	return hashCliAuthEpochPart(parts.join("\n"));
}
/**
* Strict credential-owner proof for a verified inference turn. Unlike the
* reusable-session epoch, identity-less OAuth tokens intentionally invalidate
* on rotation because accepting an unknown replacement could cross accounts.
*/
function resolveCliAuthBindingFingerprint(params) {
	const provider = params.provider.trim();
	const authProfileId = normalizeOptionalString(params.authProfileId);
	const parts = [];
	const localCredential = params.skipLocalCredential ? void 0 : getLocalCliCredential(provider);
	if (localCredential) {
		const fingerprint = fingerprintAuthProfileCredential({
			profileId: `local:${provider}`,
			credential: localCredential
		});
		if (!fingerprint) return;
		parts.push(`local:${fingerprint}`);
	}
	if (authProfileId) {
		const storedCredential = cliAuthEpochDeps.ensureAuthProfileStore(params.agentDir, {
			config: params.config,
			readOnly: true,
			allowKeychainPrompt: false,
			externalCliProviderIds: [provider]
		}).profiles[authProfileId];
		if (!storedCredential) return;
		const fingerprint = fingerprintResolvedAuthProfileCredential({
			profileId: authProfileId,
			credential: storedCredential,
			resolvedAuth: params.resolvedAuth
		});
		if (!fingerprint) return;
		parts.push(`profile:${fingerprint}`);
	}
	return parts.length > 0 ? hashCliAuthEpochPart(JSON.stringify([
		"strict-execution-v1",
		provider,
		parts
	])) : void 0;
}
/** Hash the exact executable plus backend-owned package implementation tree. */
function fingerprintCliRuntimeArtifact(params) {
	return hashCliAuthEpochPart(JSON.stringify([
		"cli-runtime-artifact-v1",
		params.provider.trim(),
		params.backendId,
		params.executableIdentity
	]));
}
/** Re-resolve a CLI backend's complete executable/package artifact boundary. */
async function resolveCliRuntimeArtifactFingerprint(params) {
	const provider = params.provider.trim();
	const backend = resolveCliBackendConfig(provider, params.config, params.agentId ? { agentId: params.agentId } : {});
	if (!backend) return;
	if (params.runtimeArtifactId && backend.id !== params.runtimeArtifactId) return;
	if (params.executableIdentity && params.executableIdentity.command !== backend.config.command) return;
	const executableIdentity = params.executableIdentity ?? await resolveCliExecutableIdentity({
		command: backend.config.command,
		...params.cwd ? { cwd: params.cwd } : {},
		...params.env ? { env: params.env } : {},
		...backend.runtimeArtifact ? { runtimeArtifact: backend.runtimeArtifact } : {}
	});
	if (!executableIdentity) return;
	return fingerprintCliRuntimeArtifact({
		provider,
		backendId: backend.id,
		executableIdentity
	});
}
/**
* Resolve a CLI runtime's non-secret owner shape. The trusted runner emits
* this projection only after a real successful turn; callers must not treat
* this pre-run value as proof by itself.
*/
async function resolveCliRuntimeOwnerFingerprint(params) {
	const provider = params.provider.trim();
	const authProfileId = normalizeOptionalString(params.authProfileId);
	const backend = resolveCliBackendConfig(provider, params.config, params.agentId ? { agentId: params.agentId } : {});
	if (!backend || params.runtimeOwnerId && backend.id !== params.runtimeOwnerId) return;
	const runtimeArtifactFingerprint = params.runtimeArtifactFingerprint ?? await resolveCliRuntimeArtifactFingerprint({
		provider,
		config: params.config,
		...params.agentId ? { agentId: params.agentId } : {},
		runtimeArtifactId: backend.id,
		...params.cwd ? { cwd: params.cwd } : {},
		...params.env ? { env: params.env } : {},
		...params.executableIdentity ? { executableIdentity: params.executableIdentity } : {}
	});
	if (!runtimeArtifactFingerprint) return;
	let authProfileOwnerFingerprint;
	if (authProfileId) {
		const store = cliAuthEpochDeps.ensureAuthProfileStore(params.agentDir, {
			config: params.config,
			readOnly: true,
			allowKeychainPrompt: false,
			externalCliProviderIds: [provider]
		});
		authProfileOwnerFingerprint = fingerprintAuthProfileOwnerShape({
			profileId: authProfileId,
			credential: store.profiles[authProfileId]
		});
		if (!authProfileOwnerFingerprint) return;
	}
	return fingerprintOpaqueRuntimeOwner({
		kind: "cli-runtime",
		runner: "cli",
		provider,
		backendId: backend.id,
		backendConfig: {
			config: backend.config,
			bundleMcp: backend.bundleMcp,
			bundleMcpMode: backend.bundleMcpMode,
			authEpochMode: backend.authEpochMode,
			nativeToolMode: backend.nativeToolMode,
			toolAvailabilityEnforcement: backend.toolAvailabilityEnforcement,
			sideQuestionToolMode: backend.sideQuestionToolMode
		},
		...authProfileId ? { authProfileId } : {},
		...authProfileOwnerFingerprint ? { authProfileOwnerFingerprint } : {},
		...params.skipLocalCredential ? { skipLocalCredential: true } : {},
		runtimeArtifactFingerprint
	});
}
//#endregion
export { resolveCliRuntimeOwnerFingerprint as a, resolveCliRuntimeArtifactFingerprint as i, resolveCliAuthBindingFingerprint as n, resolveCliExecutableIdentity as o, resolveCliAuthEpoch as r, fingerprintCliRuntimeArtifact as t };
