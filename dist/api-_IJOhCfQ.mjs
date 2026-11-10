import { a as asOptionalRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { i as registerHealthCheck, t as getHealthCheck } from "./health-check-registry-Lw8LGAUO.mjs";
import "./health-Doxm0yrp.mjs";
import { createRequire } from "node:module";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region extensions/cua-computer/package.json
var package_default = {
	name: "@openclaw/cua-computer",
	version: "2026.11.3",
	description: "Experimental CUA Driver computer control for macOS, Windows, and Linux node hosts",
	repository: {
		"type": "git",
		"url": "https://github.com/openclaw/openclaw"
	},
	type: "module",
	dependencies: {
		"@openclaw/fs-safe": "0.26.5",
		"@trycua/cua-driver": "0.33.4",
		"rastermill": "0.4.0",
		"zod": "4.6.5"
	},
	devDependencies: { "@openclaw/plugin-sdk": "workspace:*" },
	cuaDriverArtifacts: {
		"darwin-universal-binary": { "archiveSha256": "1a1c7979749ee04585d16b17d6e3588ae8d9553dfbc84e6729af09a88a8b4775" },
		"linux-arm64-gnu": { "files": {
			"cua_driver_node_runtime.node": "280a88c264f4406762cb277df16d951b40858024a7f3fc045feddc8848f2b66f",
			"libcua_driver_sdk.so": "44b2fab1994490fe5726e4cfb195ca72dc8bdee52900554446febc0135bd5373"
		} },
		"linux-x64-gnu": { "files": {
			"cua_driver_node_runtime.node": "4c3c18772a0805e7682d63439aa075bb67d91d7e4ad46aa007eb5894078dfdb4",
			"libcua_driver_sdk.so": "d645e220c8f490ec5fbd4dbab8d509bdeb3590a96228cc1c4ad01e9dd19caa7d"
		} },
		"win32-arm64-msvc": { "files": {
			"cua_driver_sdk.dll": "5f5784a148486c057e5b425c12770fb26f03f9ddf1ecf19fd067978a67cc551c",
			"cua_driver_node_runtime.node": "003d7de1f901d91b94bc362ae387ee6d5371436574195390f33517406afa7c7f"
		} },
		"win32-x64-msvc": { "files": {
			"cua_driver_sdk.dll": "ce7faf21267c9ae0c3e80ad9dbbdf93258edaae4c4dd276e5b036f96f7208242",
			"cua_driver_node_runtime.node": "826750c50bd93fd10e2aca5db892c408469043d3cb8371b7403a9922a735f06b"
		} }
	},
	openclaw: {
		"extensions": ["./index.ts"],
		"install": {
			"clawhubSpec": "clawhub:@openclaw/cua-computer",
			"npmSpec": "@openclaw/cua-computer",
			"defaultChoice": "clawhub",
			"minHostVersion": ">=2026.9.6"
		},
		"compat": { "pluginApi": ">=2026.11.3" },
		"build": {
			"bundledDist": true,
			"openclawVersion": "2026.11.3"
		},
		"release": {
			"publishToClawHub": true,
			"publishToNpm": false
		}
	}
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
function readPackageIdentity(pathname) {
	const record = asOptionalRecord(JSON.parse(fs.readFileSync(pathname, "utf8")));
	if (!record) return {};
	return {
		name: readStringField(record, "name"),
		version: readStringField(record, "version")
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
			actualDigest = sha256FileSync(pathname).digest;
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
