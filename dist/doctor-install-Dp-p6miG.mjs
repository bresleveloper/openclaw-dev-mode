import { t as note } from "./note-UlSlsJKw.mjs";
import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "yaml";
//#region src/commands/doctor-install.ts
/** Doctor warnings for source checkout installs with missing pnpm runtime state. */
/** Emits install warnings when a source checkout looks npm-installed or lacks source-run deps. */
function noteSourceInstallIssues(root) {
	if (!root) return;
	const srcEntry = path.join(root, "src", "entry.ts");
	const workspaceMarker = path.join(root, "pnpm-workspace.yaml");
	if (!fs.existsSync(workspaceMarker) || !fs.existsSync(srcEntry)) return;
	const warnings = [];
	const nodeModules = path.join(root, "node_modules");
	const pnpmStore = path.join(nodeModules, ".pnpm");
	const tsxBin = path.join(nodeModules, ".bin", "tsx");
	if (fs.existsSync(nodeModules) && !fs.existsSync(pnpmStore)) warnings.push("- node_modules was not installed by pnpm (missing node_modules/.pnpm). Run: pnpm install so bundled plugins can load package-local dependencies.");
	if (fs.existsSync(path.join(root, "package-lock.json"))) warnings.push("- package-lock.json present in a pnpm workspace. If you ran npm install, remove it and reinstall with pnpm.");
	if (fs.existsSync(srcEntry) && !fs.existsSync(tsxBin)) warnings.push("- tsx binary is missing for source runs. Run: pnpm install.");
	warnings.push(...detectSelfLinkWarnings(root));
	if (warnings.length > 0) note(warnings.join("\n"), "Install");
}
const SELF_LINK_RECOVERY = "Inspect the diff: git diff -- package.json pnpm-workspace.yaml pnpm-lock.yaml. Selectively restore the damaged dependency and override entries (including any missing override pins) and matching lockfile changes from a known-good revision, preserving unrelated edits in all three files. Then verify recovery: pnpm install --frozen-lockfile. Never run pnpm link/npm link inside a deployment checkout.";
function isSelfLink(root, value) {
	if (typeof value !== "string" || !value.startsWith("link:")) return false;
	const target = path.resolve(root, value.slice(5));
	try {
		return fs.realpathSync(target) === fs.realpathSync(root);
	} catch {
		return target === path.resolve(root);
	}
}
/** Detects self-referential `openclaw: link:` damage left by link commands run inside a source checkout. */
function detectSelfLinkWarnings(root) {
	const warnings = [];
	const packageJsonPath = path.join(root, "package.json");
	if (fs.existsSync(packageJsonPath)) try {
		const manifest = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
		if ([manifest.dependencies, manifest.devDependencies].some((deps) => isSelfLink(root, deps?.openclaw))) warnings.push(`- package.json has a self-referential "openclaw": "link:" dependency, which can break frozen pnpm installs. If the link is unintended: ${SELF_LINK_RECOVERY}`);
	} catch {}
	const workspacePath = path.join(root, "pnpm-workspace.yaml");
	try {
		const workspace = parseDocument(fs.readFileSync(workspacePath, "utf8"));
		if (isSelfLink(root, workspace.errors.length === 0 && workspace.toJS()?.overrides?.openclaw)) warnings.push(`- pnpm-workspace.yaml contains a self-referential "openclaw: link:" entry, which can break frozen pnpm installs. If the link is unintended: ${SELF_LINK_RECOVERY}`);
	} catch {}
	return warnings;
}
//#endregion
export { noteSourceInstallIssues };
