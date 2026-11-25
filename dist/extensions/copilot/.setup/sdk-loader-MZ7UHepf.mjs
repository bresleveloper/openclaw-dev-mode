import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import path from "node:path";
import { materializeErrorStack } from "openclaw/plugin-sdk/error-runtime";
import fsp from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { sha256File } from "openclaw/plugin-sdk/file-access-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
// extensions/copilot/src/sdk-loader.ts
const COPILOT_SDK_SPEC = `@github/copilot-sdk@${{ "@github/copilot-sdk": "1.0.25" }["@github/copilot-sdk"]}`;
let cached;
const installedImports = /* @__PURE__ */ new Map();
function unchanged(before, after) {
	return before.dev === after.dev && before.ino === after.ino && before.mode === after.mode && before.size === after.size && before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs;
}
/** Installed package bytes, excluding separately resolved dependency installations. */
async function fingerprintCopilotPackage(packageRoot) {
	const hash = createHash("sha256");
	async function visit(directory) {
		const entries = await fsp.readdir(directory, { withFileTypes: true });
		entries.sort((left, right) => left.name.localeCompare(right.name));
		for (const entry of entries) {
			if (entry.name === "node_modules") continue;
			const filePath = path.join(directory, entry.name);
			if (entry.isDirectory()) await visit(filePath);
			else if (entry.isFile() || entry.isSymbolicLink()) {
				const target = await fsp.realpath(filePath);
				const before = await fsp.stat(target, { bigint: true });
				const contents = await sha256File(target, { maxBytes: Number(before.size) });
				if (await fsp.realpath(filePath) !== target || !unchanged(before, await fsp.stat(target, { bigint: true })) || BigInt(contents.bytes) !== before.size) throw new Error("Copilot runtime package changed while fingerprinting.");
				const relativePath = path.relative(packageRoot, filePath).split(path.sep).join("/");
				hash.update(`${relativePath}\0${before.mode}\0${contents.digest}\0`);
			} else throw new Error(`Copilot runtime package contains an unsupported file: ${filePath}`);
		}
	}
	await visit(packageRoot);
	return hash.digest("hex");
}
async function importInstalledSdk(selectedEntry) {
	const entryPath = await fsp.realpath(selectedEntry);
	const previous = installedImports.get(entryPath);
	if (previous) return previous;
	let packageRoot = path.dirname(entryPath);
	while (true) {
		const manifestPath = path.join(packageRoot, "package.json");
		if (existsSync(manifestPath) && JSON.parse(await fsp.readFile(manifestPath, "utf8")).name === "@github/copilot-sdk") break;
		const parent = path.dirname(packageRoot);
		if (parent === packageRoot) throw new Error("Could not locate the installed Copilot SDK package.");
		packageRoot = parent;
	}
	const fingerprint = await fingerprintCopilotPackage(packageRoot);
	const loaded = (async () => {
		const sdk = await import(pathToFileURL(entryPath).href).catch((error) => {
			installedImports.delete(entryPath);
			throw error;
		});
		try {
			if (await fingerprintCopilotPackage(packageRoot) !== fingerprint) throw new Error("Copilot SDK changed while loading. Restart OpenClaw before verifying inference.");
		} catch (error) {
			materializeErrorStack(error);
			throw error;
		}
		return {
			sdk,
			identity: {
				entryPath,
				packageRoot,
				fingerprint
			}
		};
	})();
	installedImports.set(entryPath, loaded);
	return loaded;
}
async function loadCopilotSdk(options = {}) {
	return (await loadSdk(options.primaryImport)).sdk;
}
async function loadCopilotSdkWithIdentity() {
	const loaded = await loadSdk();
	if (!loaded.identity) throw new Error("The loaded Copilot SDK has no installed implementation identity.");
	return {
		sdk: loaded.sdk,
		identity: loaded.identity
	};
}
async function loadSdk(primaryImport) {
	if (!cached) cached = doLoad(primaryImport).catch((err) => {
		cached = void 0;
		throw err;
	});
	return cached;
}
async function doLoad(primaryImport) {
	let primaryErr;
	try {
		return primaryImport ? { sdk: await primaryImport() } : await importInstalledSdk(fileURLToPath(import.meta.resolve("@github/copilot-sdk")));
	} catch (err) {
		primaryErr = err;
	}
	const fallbackDir = path.join(resolveStateDir(), "npm-runtime", "copilot");
	const fallbackPath = path.join(fallbackDir, "node_modules", "@github", "copilot-sdk");
	if (!existsSync(fallbackPath)) throw createMissingSdkError(primaryErr, void 0, fallbackPath);
	try {
		return await importInstalledSdk(createRequire(path.join(fallbackDir, "package.json")).resolve("@github/copilot-sdk"));
	} catch (fallbackErr) {
		throw createMissingSdkError(primaryErr, fallbackErr, fallbackPath);
	}
}
function createMissingSdkError(primaryErr, fallbackErr, fallbackPath) {
	const lines = [
		"[copilot] @github/copilot-sdk is not installed.",
		"",
		"The external @openclaw/copilot plugin depends on @github/copilot-sdk",
		"including its platform-specific Copilot runtime package.",
		"Reinstall the plugin once with:",
		"",
		"  openclaw plugins install @openclaw/copilot",
		"",
		"For source checkouts or offline repair, install the SDK directly:",
		"",
		`  npm install ${COPILOT_SDK_SPEC}`,
		"",
		`The legacy fallback location is still probed at\n  ${fallbackPath}`,
		"",
		"Primary resolution error:",
		`  ${summarizeError(primaryErr)}`
	];
	if (fallbackErr !== void 0) lines.push("", "Fallback resolution error:", `  ${summarizeError(fallbackErr)}`);
	const err = new Error(lines.join("\n"));
	err.code = "COPILOT_SDK_MISSING";
	return err;
}
function summarizeError(value) {
	if (value === void 0 || value === null) return "(none)";
	if (value instanceof Error) return value.message || String(value);
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value);
	} catch {
		return Object.prototype.toString.call(value);
	}
}
export { loadCopilotSdk as n, loadCopilotSdkWithIdentity as r, fingerprintCopilotPackage as t };
