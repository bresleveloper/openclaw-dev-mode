import "./update-run-timeouts-Byb-PlTk.mjs";
import { n as readPackageName } from "./package-json-skO3uhlG.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { d as detectGlobalInstallManagerForRoot, n as buildUpdateCommandRunner } from "./update-runner-command-DJ8Zpaha.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-runner-install-surface.ts
function resolveUnmanagedUpdateInstallReason() {
	return isContainerEnvironment() ? "container-image-install" : "unmanaged-package-install";
}
async function looksLikeGitCheckout(root) {
	try {
		await fs.access(path.join(root, ".git"));
		return true;
	} catch {
		return false;
	}
}
/** Evidence for an unresolved owner, not permission to mutate an arbitrary directory. */
async function describeUpdateInstallRoot(root) {
	const [git, modules, packageName] = await Promise.all([
		looksLikeGitCheckout(root),
		fs.stat(path.join(root, "node_modules")).then((entry) => entry.isDirectory(), () => false),
		readPackageName(root)
	]);
	return `Root: ${root}; Git metadata: ${git ? "present" : "absent or unreadable"}; node_modules layout: ${root.split(path.sep).includes("node_modules") ? "package under node_modules" : "outside node_modules"}, local node_modules ${modules ? "present" : "absent or unreadable"}; package.json name: ${packageName ?? "missing or unreadable"}.`;
}
async function resolveUpdateInstallSurface(opts) {
	const root = opts.root;
	if (!root || opts.installKind === "unknown") return {
		kind: "missing",
		mode: "unknown"
	};
	if (opts.installKind === "git") return {
		kind: "git",
		mode: "git",
		root,
		packageRoot: root
	};
	const { runCommand } = await buildUpdateCommandRunner(opts.runCommand);
	const globalManager = await detectGlobalInstallManagerForRoot(runCommand, root, opts.timeoutMs ?? 12e5);
	if (globalManager) return {
		kind: "global",
		mode: globalManager,
		root,
		packageRoot: root
	};
	return {
		kind: "package-root",
		mode: "unknown",
		root,
		packageRoot: root
	};
}
//#endregion
export { resolveUpdateInstallSurface as i, looksLikeGitCheckout as n, resolveUnmanagedUpdateInstallReason as r, describeUpdateInstallRoot as t };
