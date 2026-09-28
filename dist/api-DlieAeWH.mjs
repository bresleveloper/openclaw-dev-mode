import { o as registerHealthCheck, r as getHealthCheck } from "./health-check-registry-AvzmSJIz.mjs";
import "./health-D7ZEkC9A.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/cua-computer/package.json
var package_default = {
	name: "@openclaw/cua-computer",
	version: "2026.9.6",
	description: "Experimental CUA Driver computer control for macOS, Windows, and Linux node hosts",
	type: "module",
	dependencies: {
		"@trycua/cua-driver": "0.28.2",
		"rastermill": "0.3.3",
		"zod": "4.6.5"
	},
	devDependencies: { "@openclaw/plugin-sdk": "workspace:*" },
	cuaDriverArtifacts: {
		"darwin-universal-binary": { "archiveSha256": "386db225a3080714a0f9f935525e61efaf46709587ef8b94dd2df81aeb2f6daa" },
		"linux-arm64-gnu": { "files": {
			"cua_driver_node_runtime.node": "a42fb79fc683c242d7fe15b0142d2477f63d0284ae5bf163358b4bb16beb11f5",
			"libcua_driver_sdk.so": "027be8d40f92607ee2a3f8f9a5d6af5e0a92c2dd1ce899f2d104863df189c9f6"
		} },
		"linux-x64-gnu": { "files": {
			"cua_driver_node_runtime.node": "77978e9234ba39bb1c04bb8c348f11c30872ab74d592ce1603a3b2dc79e5e678",
			"libcua_driver_sdk.so": "e98965cd7115d57601c9f6591857dfb4dd7c54dad213189efbace8e3d5ca50c8"
		} },
		"win32-arm64-msvc": { "files": {
			"cua_driver_sdk.dll": "ae27eafe78b57f7a84b53f21329e6099bbaa53c5b23a4f1900344f68efb0487e",
			"cua_driver_node_runtime.node": "d21584501481cfd4be48f93397486590bb48039e7c97466fbe6b29b3e9a67c0b"
		} },
		"win32-x64-msvc": { "files": {
			"cua_driver_sdk.dll": "7605fe15bcda9257dc485c779bc7d0f08832e1766165d87e120b345614bd734b",
			"cua_driver_node_runtime.node": "93f220e8a5cbf25aff23321f20a868368a204f1026b8dce45c5a4f84290de09f"
		} }
	},
	openclaw: { "extensions": ["./index.ts"] }
};
//#endregion
//#region extensions/cua-computer/src/driver-artifact-verification.ts
const DRIVER_PACKAGE = "@trycua/cua-driver";
function failure(code, message, fixHint) {
	return {
		ok: false,
		code,
		diagnostic: `${code}: ${message} Fix: ${fixHint}`,
		fixHint
	};
}
function resolveArtifactPlatform(platform, arch, linuxLibc) {
	if (platform === "linux") {
		if (linuxLibc !== "gnu" || arch !== "arm64" && arch !== "x64") return {
			kind: "unsupported",
			host: `${platform}/${arch}/${linuxLibc ?? "unknown-libc"}`
		};
		return {
			kind: "applicable",
			key: `linux-${arch}-gnu`
		};
	}
	if (platform === "win32") {
		if (arch !== "arm64" && arch !== "x64") return {
			kind: "unsupported",
			host: `${platform}/${arch}`
		};
		return {
			kind: "applicable",
			key: `win32-${arch}-msvc`
		};
	}
	return { kind: "not-applicable" };
}
function readJson(pathname) {
	return JSON.parse(fs.readFileSync(pathname, "utf8"));
}
function readPackageIdentity(pathname) {
	const value = readJson(pathname);
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const record = value;
	return {
		name: typeof record.name === "string" ? record.name : void 0,
		version: typeof record.version === "string" ? record.version : void 0
	};
}
function isSha256(value) {
	return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}
function loadArtifactRecord(manifestValue, key) {
	const value = manifestValue;
	const version = value.dependencies?.[DRIVER_PACKAGE];
	const artifact = value.cuaDriverArtifacts?.[key];
	if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/u.test(version) || !artifact || !artifact.files || Object.keys(artifact.files).length === 0 || Object.entries(artifact.files).some(([filename, digest]) => path.basename(filename) !== filename || !isSha256(digest))) return;
	return {
		version,
		artifact
	};
}
function hashFile(pathname) {
	return createHash("sha256").update(fs.readFileSync(pathname)).digest("hex");
}
function inspectCuaDriverArtifacts(options) {
	const selected = resolveArtifactPlatform(options.platform, options.arch, options.linuxLibc);
	if (selected.kind === "not-applicable") return {
		ok: true,
		applicable: false
	};
	if (selected.kind === "unsupported") return failure("COMPUTER_DRIVER_PLATFORM_UNSUPPORTED", `the pinned CUA Driver SDK has no native package for ${selected.host}.`, "Run this node host on Windows x64/ARM64 or glibc-based Linux x64/ARM64.");
	let accepted;
	try {
		accepted = loadArtifactRecord(options.pluginManifest, selected.key);
	} catch {
		accepted = void 0;
	}
	if (!accepted) return failure("COMPUTER_DRIVER_MANIFEST_INVALID", `the cua-computer artifact record for ${selected.key} is missing or invalid.`, "Reinstall OpenClaw from a complete official package.");
	const platformPackage = `${DRIVER_PACKAGE}-${selected.key}`;
	const sdkManifestPath = options.resolvePackageJson(DRIVER_PACKAGE);
	const platformManifestPath = options.resolvePackageJson(platformPackage);
	if (!sdkManifestPath || !platformManifestPath) {
		const missing = sdkManifestPath ? platformPackage : DRIVER_PACKAGE;
		const fixHint = `Reinstall OpenClaw on this node host so ${DRIVER_PACKAGE} ${accepted.version} and its native platform package are installed together.`;
		return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${missing} ${accepted.version} is not installed.`, fixHint);
	}
	let sdkIdentity;
	let platformIdentity;
	try {
		sdkIdentity = readPackageIdentity(sdkManifestPath);
		platformIdentity = readPackageIdentity(platformManifestPath);
	} catch {
		return failure("COMPUTER_DRIVER_PACKAGE_MISSING", "the resolved CUA Driver package metadata cannot be read.", "Reinstall OpenClaw on this node host; do not repair native package files by hand.");
	}
	if (sdkIdentity.name !== DRIVER_PACKAGE || platformIdentity.name !== platformPackage || sdkIdentity.version !== accepted.version || platformIdentity.version !== accepted.version) {
		const observed = `${sdkIdentity.name ?? "unknown"}@${sdkIdentity.version ?? "unknown"} + ${platformIdentity.name ?? "unknown"}@${platformIdentity.version ?? "unknown"}`;
		const fixHint = `Reinstall or update OpenClaw on this node host so both CUA Driver packages resolve to ${accepted.version}.`;
		return failure("COMPUTER_DRIVER_VERSION_MISMATCH", `expected ${DRIVER_PACKAGE} and ${platformPackage} ${accepted.version}, resolved ${observed}.`, fixHint);
	}
	const packageDir = path.dirname(platformManifestPath);
	for (const [filename, expectedDigest] of Object.entries(accepted.artifact.files).toSorted(([left], [right]) => left.localeCompare(right))) {
		const pathname = path.join(packageDir, filename);
		let stat;
		try {
			stat = fs.lstatSync(pathname);
		} catch {
			const fixHint = `Reinstall OpenClaw on this node host to restore ${platformPackage} ${accepted.version}.`;
			return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${platformPackage} is missing ${filename}.`, fixHint);
		}
		if (!stat.isFile() || stat.isSymbolicLink()) return failure("COMPUTER_DRIVER_DIGEST_MISMATCH", `${platformPackage}/${filename} is not a regular file.`, "Reinstall OpenClaw; the native driver files must be regular package files.");
		let actualDigest;
		try {
			actualDigest = hashFile(pathname);
		} catch {
			const fixHint = `Reinstall OpenClaw on this node host to restore ${platformPackage} ${accepted.version}.`;
			return failure("COMPUTER_DRIVER_PACKAGE_MISSING", `${platformPackage}/${filename} cannot be read.`, fixHint);
		}
		if (actualDigest !== expectedDigest) return failure("COMPUTER_DRIVER_DIGEST_MISMATCH", `${platformPackage}/${filename} does not match the accepted ${accepted.version} digest.`, "Reinstall OpenClaw; do not run or replace the mismatched native package files.");
	}
	return {
		ok: true,
		applicable: true,
		version: accepted.version,
		platformPackage
	};
}
//#endregion
//#region extensions/cua-computer/src/driver-artifacts.ts
const requireFromPlugin = createRequire(import.meta.url);
function resolvePackageEntry(packageName) {
	try {
		return requireFromPlugin.resolve(packageName);
	} catch {}
	try {
		return fileURLToPath(import.meta.resolve(packageName));
	} catch {
		return;
	}
}
function resolvePackageJson(packageName) {
	if (packageName !== "@trycua/cua-driver") {
		const sdkManifestPath = resolvePackageJson("@trycua/cua-driver");
		if (!sdkManifestPath) return;
		try {
			return createRequire(sdkManifestPath).resolve(`${packageName}/package.json`);
		} catch {
			return;
		}
	}
	try {
		return requireFromPlugin.resolve(`${packageName}/package.json`);
	} catch {}
	const entry = resolvePackageEntry(packageName);
	if (!entry) return;
	let current = path.dirname(entry);
	while (true) {
		const candidate = path.join(current, "package.json");
		try {
			if (readPackageIdentity(candidate).name === packageName) return candidate;
		} catch {}
		const parent = path.dirname(current);
		if (parent === current) return;
		current = parent;
	}
}
function detectLinuxLibc() {
	return typeof (process.report?.getReport())?.header?.glibcVersionRuntime === "string" ? "gnu" : "musl";
}
let installedVerification;
function verifyInstalledCuaDriverArtifacts() {
	installedVerification ??= inspectCuaDriverArtifacts({
		platform: process.platform,
		arch: process.arch,
		...process.platform === "linux" ? { linuxLibc: detectLinuxLibc() } : {},
		pluginManifest: package_default,
		resolvePackageJson
	});
	return installedVerification;
}
//#endregion
//#region extensions/cua-computer/src/doctor.ts
const CUA_DRIVER_ARTIFACT_CHECK_ID = "cua-computer/driver-artifacts";
const cuaDriverArtifactCheck = {
	id: CUA_DRIVER_ARTIFACT_CHECK_ID,
	kind: "plugin",
	description: "Verify the installed Windows/Linux CUA Driver SDK artifact.",
	source: "cua-computer",
	async detect() {
		const verification = verifyInstalledCuaDriverArtifacts();
		if (verification.ok) return [];
		return [{
			checkId: CUA_DRIVER_ARTIFACT_CHECK_ID,
			severity: "error",
			source: "cua-computer",
			message: verification.diagnostic,
			target: "@trycua/cua-driver",
			requirement: "the accepted CUA Driver SDK version and native package digests",
			fixHint: verification.fixHint
		}];
	}
};
const registeredHosts = /* @__PURE__ */ new WeakSet();
function registerCuaDriverDoctorChecks(host) {
	const registerHealthCheck$1 = host?.registerHealthCheck ?? registerHealthCheck;
	if (registeredHosts.has(registerHealthCheck$1)) return;
	if (host === void 0 && getHealthCheck("cua-computer/driver-artifacts") === cuaDriverArtifactCheck) return;
	registerHealthCheck$1(cuaDriverArtifactCheck);
	registeredHosts.add(registerHealthCheck$1);
}
//#endregion
export { registerCuaDriverDoctorChecks as n, verifyInstalledCuaDriverArtifacts as r, CUA_DRIVER_ARTIFACT_CHECK_ID as t };
