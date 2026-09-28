import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { i as readRegularFileSync, r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { a as normalizeEnvVarKey } from "./host-env-security-D7wdDMke.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parse as parse$1 } from "dotenv";
//#region src/infra/dotenv-global-core.ts
/** Maximum bytes to read from any dotenv file. */
const MAX_DOTENV_FILE_BYTES = 1048576;
function reportDotEnvReadError(params, error) {
	if (params.quiet) return;
	if ((error && typeof error === "object" && "code" in error ? String(error.code) : void 0) !== "ENOENT") params.onWarning?.(`Failed to read ${params.filePath}: ${String(error)}`, { error });
	if (error instanceof Error && error.message?.startsWith("File exceeds")) params.onWarning?.(`skipping oversized .env file (max ${MAX_DOTENV_FILE_BYTES} bytes): ${params.filePath}`);
}
function parseDotEnvFile(params, content) {
	const entries = [];
	for (const [rawKey, value] of Object.entries(parse$1(content))) {
		const key = normalizeEnvVarKey(rawKey, { portable: true });
		if (key && (params.entryFilter?.(key, value) ?? true)) entries.push({
			key,
			value
		});
	}
	return {
		filePath: params.filePath,
		entries
	};
}
function readDotEnvFileCore(params) {
	let content;
	try {
		const resolved = fs.realpathSync(params.filePath);
		const { buffer } = readRegularFileSync({
			filePath: resolved,
			maxBytes: MAX_DOTENV_FILE_BYTES
		});
		content = buffer;
	} catch (error) {
		reportDotEnvReadError(params, error);
		return null;
	}
	return parseDotEnvFile(params, content);
}
async function readDotEnvFileAsyncCore(params) {
	let content;
	try {
		const resolved = await fs.promises.realpath(params.filePath);
		const { buffer } = await readRegularFile({
			filePath: resolved,
			maxBytes: MAX_DOTENV_FILE_BYTES
		});
		content = buffer;
	} catch (error) {
		reportDotEnvReadError(params, error);
		return null;
	}
	return parseDotEnvFile(params, content);
}
function loadParsedDotEnvFiles(files, env, overrideKeys, onWarning) {
	const preExistingKeys = new Set(Object.keys(env));
	const canonicalizeKey = (key) => normalizeEnvVarKey(key, { portable: true })?.toUpperCase() ?? null;
	const normalizedOverrideKeys = new Set([...overrideKeys ?? []].flatMap((key) => {
		const normalized = canonicalizeKey(key);
		return normalized ? [normalized] : [];
	}));
	const conflicts = /* @__PURE__ */ new Map();
	const firstSeen = /* @__PURE__ */ new Map();
	const appliedKeysByFile = /* @__PURE__ */ new Map();
	for (const file of files) for (const { key, value } of file.entries) {
		const canonicalKey = canonicalizeKey(key);
		const mayOverride = canonicalKey !== null && normalizedOverrideKeys.has(canonicalKey);
		const precedenceKey = mayOverride && canonicalKey ? canonicalKey : key;
		if (preExistingKeys.has(key) && !mayOverride) continue;
		const previous = firstSeen.get(precedenceKey);
		if (previous) {
			if (previous.value !== value) {
				const conflictKey = `${previous.filePath}\u0000${file.filePath}`;
				const existing = conflicts.get(conflictKey);
				if (existing) existing.keys.add(key);
				else conflicts.set(conflictKey, {
					keptPath: previous.filePath,
					ignoredPath: file.filePath,
					keys: /* @__PURE__ */ new Set([key])
				});
			}
			continue;
		}
		firstSeen.set(precedenceKey, {
			value,
			filePath: file.filePath
		});
		if (env[key] === void 0 || mayOverride) {
			if (mayOverride) {
				for (const inheritedKey of preExistingKeys) if (canonicalizeKey(inheritedKey) === canonicalKey) env[inheritedKey] = value;
			}
			env[key] = value;
			const appliedKeys = appliedKeysByFile.get(file.filePath);
			if (appliedKeys) appliedKeys.push(key);
			else appliedKeysByFile.set(file.filePath, [key]);
		}
	}
	for (const conflict of conflicts.values()) {
		const keys = [...conflict.keys].toSorted();
		if (keys.length === 0) continue;
		onWarning?.(`Conflicting values in ${conflict.keptPath} and ${conflict.ignoredPath} for ${keys.join(", ")}; keeping ${conflict.keptPath}.`, {
			keptPath: conflict.keptPath,
			ignoredPath: conflict.ignoredPath,
			keys
		});
	}
	return appliedKeysByFile;
}
function resolveGlobalDotEnvPaths(opts, env) {
	const stateEnvPath = opts.stateEnvPath ?? path.join(resolveConfigDir(env), ".env");
	const globalEnvPaths = [.../* @__PURE__ */ new Set([stateEnvPath, ...opts.additionalEnvPaths ?? []])];
	const home = resolveRequiredHomeDir(env, os.homedir);
	const defaultStateEnvPath = path.join(home, ".openclaw", ".env");
	return {
		globalEnvPaths,
		gatewayEnvPath: env.OPENCLAW_STATE_DIR?.trim() !== void 0 && path.resolve(stateEnvPath) !== path.resolve(defaultStateEnvPath) ? void 0 : path.join(home, ".config", "openclaw", "gateway.env")
	};
}
function applyGlobalDotEnvFiles(globalEnvs, gatewayEnv, env, overrideKeys, onWarning) {
	const parsed = [...globalEnvs, gatewayEnv].filter((file) => file !== null);
	const appliedKeysByFile = loadParsedDotEnvFiles(parsed, env, overrideKeys, onWarning);
	return {
		dotenvPresentKeys: [...new Set(parsed.flatMap((file) => file.entries.map(({ key }) => key)))],
		stateEnvAppliedKeys: globalEnvs.flatMap((file) => file ? appliedKeysByFile.get(file.filePath) ?? [] : []),
		gatewayEnvAppliedKeys: gatewayEnv ? appliedKeysByFile.get(gatewayEnv.filePath) ?? [] : []
	};
}
/** Load global runtime dotenv files with first-wins precedence, defaulting to `process.env`. */
function loadGlobalRuntimeDotEnvFilesCore(opts = {}) {
	const env = opts.env ?? process.env;
	const { globalEnvPaths, gatewayEnvPath } = resolveGlobalDotEnvPaths(opts, env);
	const readOptions = {
		entryFilter: opts.entryFilter,
		quiet: opts.quiet ?? true,
		onWarning: opts.onWarning
	};
	return applyGlobalDotEnvFiles(globalEnvPaths.map((filePath) => readDotEnvFileCore({
		...readOptions,
		filePath
	})), gatewayEnvPath ? readDotEnvFileCore({
		...readOptions,
		filePath: gatewayEnvPath
	}) : null, env, opts.overrideKeys, opts.onWarning);
}
/** Read global runtime dotenv files asynchronously into a caller-owned environment. */
async function loadGlobalRuntimeDotEnvFilesAsyncCore(opts) {
	const { env } = opts;
	const { globalEnvPaths, gatewayEnvPath } = resolveGlobalDotEnvPaths(opts, env);
	const readOptions = {
		entryFilter: opts.entryFilter,
		quiet: opts.quiet ?? true,
		onWarning: opts.onWarning
	};
	const globalEnvs = [];
	for (const filePath of globalEnvPaths) globalEnvs.push(await readDotEnvFileAsyncCore({
		...readOptions,
		filePath
	}));
	return applyGlobalDotEnvFiles(globalEnvs, gatewayEnvPath ? await readDotEnvFileAsyncCore({
		...readOptions,
		filePath: gatewayEnvPath
	}) : null, env, opts.overrideKeys, opts.onWarning);
}
//#endregion
//#region src/infra/dotenv-global.ts
const logger = createSubsystemLogger("infra:dotenv");
function readDotEnvFile(params) {
	return readDotEnvFileCore({
		...params,
		onWarning: logger.warn
	});
}
async function readDotEnvFileAsync(params) {
	return await readDotEnvFileAsyncCore({
		...params,
		onWarning: logger.warn
	});
}
/** Load global runtime dotenv files with first-wins precedence, defaulting to `process.env`. */
function loadGlobalRuntimeDotEnvFiles(opts = {}) {
	return loadGlobalRuntimeDotEnvFilesCore({
		...opts,
		onWarning: logger.warn
	});
}
/** Read global runtime dotenv files asynchronously into a caller-owned environment. */
async function loadGlobalRuntimeDotEnvFilesAsync(opts) {
	return await loadGlobalRuntimeDotEnvFilesAsyncCore({
		...opts,
		onWarning: logger.warn
	});
}
//#endregion
export { readDotEnvFileAsync as i, loadGlobalRuntimeDotEnvFilesAsync as n, readDotEnvFile as r, loadGlobalRuntimeDotEnvFiles as t };
