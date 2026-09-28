import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/install-source-spec.ts
function resolveFileNpmSpecToLocalPath(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("file:")) return null;
	const rest = trimmed.slice(5);
	if (!rest) return {
		ok: false,
		error: "unsupported file: spec: missing path"
	};
	if (rest.startsWith("///")) return {
		ok: true,
		path: rest.slice(2)
	};
	if (rest.startsWith("//localhost/")) return {
		ok: true,
		path: rest.slice(11)
	};
	if (rest.startsWith("//")) return {
		ok: false,
		error: "unsupported file: URL host (expected \"file:<path>\" or \"file:///abs/path\")"
	};
	return {
		ok: true,
		path: rest
	};
}
function parseNpmPrefixSpec(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm:")) return null;
	return trimmed.slice(4).trim();
}
function parseNpmPackPrefixPath(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm-pack:")) return null;
	return trimmed.slice(9).trim();
}
function isBareNpmPackageName(spec) {
	return /^[a-z0-9][a-z0-9-._~]*$/.test(spec.trim());
}
function isSourceCheckoutBundledPath(localPath) {
	const extensionsDir = path.dirname(path.resolve(localPath));
	if (path.basename(extensionsDir) !== "extensions") return false;
	const extensionsParent = path.dirname(extensionsDir);
	const packageRoot = ["dist", "dist-runtime"].includes(path.basename(extensionsParent)) ? path.dirname(extensionsParent) : extensionsParent;
	try {
		const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
		return isRecord(packageJson) && packageJson.name === "openclaw" && fs.existsSync(path.join(packageRoot, ".git")) && fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && fs.existsSync(path.join(packageRoot, "src")) && fs.existsSync(path.join(packageRoot, "extensions"));
	} catch {
		return false;
	}
}
function resolveBundledInstallPlanBeforeNpm(params) {
	const rawSpec = params.rawSpec.trim();
	if (!rawSpec || parseNpmPrefixSpec(rawSpec) !== null) return null;
	if (isBareNpmPackageName(rawSpec)) {
		const bundledSource = params.findBundledSource({
			kind: "pluginId",
			value: rawSpec
		});
		if (!bundledSource) return null;
		return {
			bundledSource,
			warning: `Using bundled plugin "${bundledSource.pluginId}" from ${shortenHomePath(bundledSource.localPath)} for bare install spec "${rawSpec}". To install an npm package with the same name, use a scoped package name (for example @scope/${rawSpec}).`
		};
	}
	const parsedNpmSpec = parseRegistryNpmSpec(rawSpec);
	if (!parsedNpmSpec) return null;
	const bundledSource = params.findBundledSource({
		kind: "npmSpec",
		value: rawSpec
	}) ?? params.findBundledSource({
		kind: "npmSpec",
		value: parsedNpmSpec.name
	});
	if (!bundledSource) return null;
	if (isSourceCheckoutBundledPath(bundledSource.localPath)) return null;
	return {
		bundledSource,
		warning: `Using bundled plugin "${bundledSource.pluginId}" from ${shortenHomePath(bundledSource.localPath)} for npm install spec "${rawSpec}" because this plugin ships with the current OpenClaw build. To force an external npm override, use npm:${rawSpec}.`
	};
}
//#endregion
export { resolveBundledInstallPlanBeforeNpm as a, parseNpmPrefixSpec as i, isSourceCheckoutBundledPath as n, resolveFileNpmSpecToLocalPath as o, parseNpmPackPrefixPath as r, isBareNpmPackageName as t };
