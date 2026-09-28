import { n as resolveOpenClawPackageRoot, r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as CONTROL_UI_BUILD_ID_ATTRIBUTE } from "./control-ui-root-assets-DS7D1PNh.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/infra/control-ui-assets.ts
function formatControlUiSourceCommand(root, action) {
	return `pnpm --dir ${process.platform === "win32" ? quotePowerShellArg(root) : quoteCliArg(root)} ui:${action}`;
}
function resolveControlUiDistIndexPathForRoot(root) {
	return path.join(root, "dist", "control-ui", "index.html");
}
async function resolveControlUiAssetHealth(opts = {}) {
	return inspectControlUiAssetHealth(opts.root ? resolveControlUiDistIndexPathForRoot(opts.root) : await resolveControlUiDistIndexPath({
		argv1: opts.argv1 ?? process.argv[1],
		moduleUrl: opts.moduleUrl
	}), opts.expectedBuildId);
}
function resolveControlUiRepoRoot(opts) {
	const cwd = opts.cwd ?? process.cwd();
	return (opts.root ? [path.resolve(opts.root)] : [resolveOpenClawPackageRootSync({
		argv1: opts.argv1 ?? process.argv[1],
		moduleUrl: opts.moduleUrl ?? import.meta.url,
		cwd
	}), resolveOpenClawPackageRootSync({ cwd })]).find((root) => root !== null && fs.existsSync(path.join(root, "ui", "vite.config.ts"))) ?? null;
}
async function resolveControlUiDistIndexPath(argv1OrOpts) {
	const argv1 = typeof argv1OrOpts === "string" ? argv1OrOpts : argv1OrOpts?.argv1 ?? process.argv[1];
	const moduleUrl = typeof argv1OrOpts === "object" ? argv1OrOpts?.moduleUrl : void 0;
	if (!argv1) return null;
	const normalized = path.resolve(argv1);
	const entrypointCandidates = [normalized];
	try {
		const realpathEntrypoint = fs.realpathSync(normalized);
		if (realpathEntrypoint !== normalized) entrypointCandidates.push(realpathEntrypoint);
	} catch {}
	for (const entrypoint of entrypointCandidates) {
		const distDir = path.dirname(entrypoint);
		if (path.basename(distDir) === "dist") return path.join(distDir, "control-ui", "index.html");
	}
	const packageRoot = await resolveOpenClawPackageRoot({
		argv1: normalized,
		moduleUrl
	});
	if (packageRoot) return path.join(packageRoot, "dist", "control-ui", "index.html");
	const fallbackStartDirs = new Set(entrypointCandidates.map((candidate) => path.dirname(candidate)));
	for (const startDir of fallbackStartDirs) {
		let dir = startDir;
		for (let i = 0; i < 8; i++) {
			const pkgJsonPath = path.join(dir, "package.json");
			const indexPath = path.join(dir, "dist", "control-ui", "index.html");
			if (fs.existsSync(pkgJsonPath)) try {
				const raw = fs.readFileSync(pkgJsonPath, "utf-8");
				if (JSON.parse(raw).name === "openclaw") return fs.existsSync(indexPath) ? indexPath : null;
				break;
			} catch {
				break;
			}
			const parent = path.dirname(dir);
			if (parent === dir) break;
			dir = parent;
		}
	}
	return null;
}
function pathsMatchByRealpathOrResolve(left, right) {
	let realLeft;
	let realRight;
	try {
		realLeft = fs.realpathSync(left);
	} catch {
		realLeft = path.resolve(left);
	}
	try {
		realRight = fs.realpathSync(right);
	} catch {
		realRight = path.resolve(right);
	}
	return realLeft === realRight;
}
function addCandidate(candidates, value) {
	if (!value) return;
	candidates.add(path.resolve(value));
}
function resolveControlUiRootOverrideSync(rootOverride) {
	const resolved = path.resolve(rootOverride);
	try {
		const stats = fs.statSync(resolved);
		if (stats.isFile()) return path.basename(resolved) === "index.html" ? path.dirname(resolved) : null;
		if (stats.isDirectory()) {
			const indexPath = path.join(resolved, "index.html");
			return fs.existsSync(indexPath) ? resolved : null;
		}
	} catch {
		return null;
	}
	return null;
}
function resolveControlUiRootSync(opts = {}) {
	const candidates = /* @__PURE__ */ new Set();
	const argv1 = opts.argv1 ?? process.argv[1];
	const cwd = opts.cwd ?? process.cwd();
	const moduleDir = opts.moduleUrl ? path.dirname(fileURLToPath(opts.moduleUrl)) : null;
	const argv1Dir = argv1 ? path.dirname(path.resolve(argv1)) : null;
	const argv1RealpathDir = (() => {
		if (!argv1) return null;
		try {
			return path.dirname(fs.realpathSync(path.resolve(argv1)));
		} catch {
			return null;
		}
	})();
	const execDir = (() => {
		try {
			const execPath = opts.execPath ?? process.execPath;
			return path.dirname(fs.realpathSync(execPath));
		} catch {
			return null;
		}
	})();
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1,
		moduleUrl: opts.moduleUrl,
		cwd
	});
	addCandidate(candidates, execDir ? path.join(execDir, "control-ui") : null);
	if (moduleDir) {
		addCandidate(candidates, path.join(moduleDir, "control-ui"));
		addCandidate(candidates, path.join(moduleDir, "../control-ui"));
		addCandidate(candidates, path.join(moduleDir, "../../dist/control-ui"));
	}
	if (argv1Dir) {
		addCandidate(candidates, path.join(argv1Dir, "dist", "control-ui"));
		addCandidate(candidates, path.join(argv1Dir, "control-ui"));
	}
	if (argv1RealpathDir && argv1RealpathDir !== argv1Dir) {
		addCandidate(candidates, path.join(argv1RealpathDir, "dist", "control-ui"));
		addCandidate(candidates, path.join(argv1RealpathDir, "control-ui"));
	}
	if (packageRoot) addCandidate(candidates, path.join(packageRoot, "dist", "control-ui"));
	addCandidate(candidates, path.join(cwd, "dist", "control-ui"));
	for (const dir of candidates) {
		const indexPath = path.join(dir, "index.html");
		if (fs.existsSync(indexPath)) return dir;
	}
	return null;
}
function isPackageProvenControlUiRootSync(root, opts = {}) {
	const argv1 = opts.argv1 ?? process.argv[1];
	const cwd = opts.cwd ?? process.cwd();
	const packageRoot = resolveOpenClawPackageRootSync({
		argv1,
		moduleUrl: opts.moduleUrl,
		cwd
	});
	if (!packageRoot) return false;
	return pathsMatchByRealpathOrResolve(root, path.join(packageRoot, "dist", "control-ui"));
}
const CONTROL_UI_ASSETS_BUILD_TIMEOUT_MS = 6e5;
function controlUiAssetsFailure(message, built = false) {
	return {
		ok: false,
		built,
		message
	};
}
function inspectControlUiAssetHealth(indexPath, expectedBuildId) {
	if (!indexPath) return {
		kind: "missing-index",
		indexPath
	};
	let html;
	try {
		const opened = openRootFileSync({
			absolutePath: indexPath,
			rootPath: path.dirname(indexPath),
			boundaryLabel: "control ui root",
			rejectSymlinks: false,
			rejectHardlinks: false,
			maxBytes: 262144
		});
		if (!opened.ok) {
			if (opened.error instanceof FsSafeError && opened.error.code === "too-large") throw opened.error;
			return {
				kind: "missing-index",
				indexPath
			};
		}
		try {
			html = readFileDescriptorBoundedSync(opened.fd, 262144).toString("utf8");
		} finally {
			fs.closeSync(opened.fd);
		}
	} catch (error) {
		if (error instanceof RangeError || error instanceof FsSafeError && error.code === "too-large") return {
			kind: "incomplete",
			indexPath,
			missingAsset: "index.html exceeds its size limit"
		};
		return {
			kind: "missing-index",
			indexPath
		};
	}
	let references = 0;
	for (const tag of html.matchAll(/<(?:link|script)\b[^>]*>/giu)) {
		const reference = tag[0].match(/\s(?:href|src)\s*=\s*["']([^"']+)["']/iu)?.[1]?.split(/[?#]/u, 1)[0]?.replace(/\\/gu, "/");
		if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/iu.test(reference)) continue;
		const marker = reference.lastIndexOf("assets/");
		if (marker === -1 || !/\.(?:css|js)$/iu.test(reference)) continue;
		const asset = reference.slice(marker);
		if (++references > 128 || reference.split("/").includes("..")) return {
			kind: "incomplete",
			indexPath,
			missingAsset: references > 128 ? "too many startup assets" : asset
		};
		if (!fs.existsSync(path.join(path.dirname(indexPath), asset))) return {
			kind: "incomplete",
			indexPath,
			missingAsset: asset
		};
	}
	const publicAssetBuildId = new RegExp(`${CONTROL_UI_BUILD_ID_ATTRIBUTE}="([a-zA-Z0-9._-]{1,161})"`).exec(html)?.[1];
	const buildId = publicAssetBuildId?.match(/^([a-zA-Z0-9._-]{1,96})-[a-f0-9]{64}$/u)?.[1] ?? null;
	if (expectedBuildId && buildId !== "dev" && buildId !== expectedBuildId) return {
		kind: "stale",
		indexPath,
		buildId
	};
	return {
		kind: "ready",
		indexPath,
		...publicAssetBuildId ? { publicAssetBuildId } : {}
	};
}
function inspectControlUiRootAssets(root, expectedBuildId) {
	return inspectControlUiAssetHealth(path.join(root, "index.html"), expectedBuildId);
}
function summarizeCommandOutput(text) {
	const lines = normalizeStringEntries(stripAnsi(text).split(/\r?\n/g).map((line) => sanitizeTerminalText(line.trim())));
	if (!lines.length) return;
	const errorIndex = lines.findIndex((line) => /^(?:\[[^\]]+\]\s*)?(?:\w*error|fatal)\b/iu.test(line));
	const summary = lines.slice(Math.max(0, errorIndex)).join(" ");
	return summary.length > 240 ? `${truncateUtf16Safe(summary, 239)}…` : summary;
}
async function ensureControlUiAssetsBuilt(runtime = defaultRuntime, opts = {}) {
	const assetRoot = opts.assetRoot ?? (opts.root ? path.dirname(resolveControlUiDistIndexPathForRoot(opts.root)) : resolveControlUiRootSync(opts));
	const selectedIndex = assetRoot ? path.join(assetRoot, "index.html") : await resolveControlUiDistIndexPath(opts);
	const health = inspectControlUiAssetHealth(selectedIndex, opts.expectedBuildId);
	if (!opts.force && health.kind === "ready") return {
		ok: true,
		built: false,
		assets: health
	};
	const repoRoot = resolveControlUiRepoRoot(opts);
	const indexPath = repoRoot ? resolveControlUiDistIndexPathForRoot(repoRoot) : null;
	if (!repoRoot || !indexPath || assetRoot && !pathsMatchByRealpathOrResolve(assetRoot, path.dirname(indexPath))) {
		const location = selectedIndex ? ` at ${selectedIndex}` : "";
		return controlUiAssetsFailure(`${health.kind === "stale" ? `Stale Control UI assets${location} (build ${health.buildId ?? "unknown"}; expected ${opts.expectedBuildId})` : health.kind === "incomplete" ? `Incomplete Control UI assets${location} (missing ${health.missingAsset})` : `Missing Control UI assets${location}`}. Reinstall OpenClaw to restore bundled Control UI assets.`);
	}
	const uiScript = path.join(repoRoot, "scripts", "ui.js");
	if (!fs.existsSync(uiScript)) return controlUiAssetsFailure(`Control UI assets missing but ${uiScript} is unavailable.`);
	if (opts.signal?.aborted) return controlUiAssetsFailure("Control UI build canceled.");
	if (opts.onBuildStart) opts.onBuildStart();
	else {
		const buildCommand = formatControlUiSourceCommand(repoRoot, "build");
		const devCommand = formatControlUiSourceCommand(repoRoot, "dev");
		runtime.log(`Control UI assets need rebuilding; building them now (rerun \`${buildCommand}\` after UI changes, or use \`${devCommand}\` while developing the Control UI)…`);
	}
	let build;
	try {
		build = await runCommandWithTimeout([
			process.execPath,
			uiScript,
			"build"
		], {
			cwd: repoRoot,
			timeoutMs: opts.timeoutMs ?? 6e5,
			...opts.signal ? { signal: opts.signal } : {}
		});
	} catch (error) {
		return controlUiAssetsFailure(`Control UI build failed: ${summarizeCommandOutput(error instanceof Error ? error.message : String(error)) ?? "unknown error"}`);
	}
	if (build.termination === "signal") return controlUiAssetsFailure("Control UI build canceled.");
	if (build.termination === "timeout" || build.termination === "no-output-timeout") return controlUiAssetsFailure("Control UI build timed out.");
	if (build.code !== 0) return controlUiAssetsFailure(`Control UI build failed: ${summarizeCommandOutput(build.stderr) ?? `exit ${build.code}`}`);
	const builtHealth = inspectControlUiAssetHealth(indexPath, opts.expectedBuildId);
	if (builtHealth.kind !== "ready") return controlUiAssetsFailure(`Control UI build completed but ${builtHealth.kind === "missing-index" ? `${indexPath} is still missing.` : builtHealth.kind === "incomplete" ? `startup asset ${builtHealth.missingAsset} is missing.` : `its identity is ${builtHealth.buildId ?? "unknown"}; expected ${opts.expectedBuildId}. Restart the Gateway after rebuilding its runtime and UI together.`}`, true);
	return {
		ok: true,
		built: true,
		assets: builtHealth
	};
}
//#endregion
export { isPackageProvenControlUiRootSync as a, resolveControlUiRootOverrideSync as c, inspectControlUiRootAssets as i, resolveControlUiRootSync as l, ensureControlUiAssetsBuilt as n, resolveControlUiAssetHealth as o, formatControlUiSourceCommand as r, resolveControlUiDistIndexPathForRoot as s, CONTROL_UI_ASSETS_BUILD_TIMEOUT_MS as t };
