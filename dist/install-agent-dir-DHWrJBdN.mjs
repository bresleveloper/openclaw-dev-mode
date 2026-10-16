import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { C as tryResolveAmbientOwnerAgentId, E as tryResolveLegacyDataOwnerAgentId, _ as resolveEffectiveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/infra/state-migrations.agent-dir-receipt.ts
const LEGACY_AGENT_DIR_RECEIPT = ".legacy-agent-dir-migration.json";
function resolveLegacyStandaloneAgentDir(homedir = os.homedir) {
	return path.join(homedir(), ".openclaw", "agent");
}
function receiptContent(source, target) {
	return `${JSON.stringify({
		version: 1,
		source,
		target
	})}\n`;
}
function hasCompletedLegacyAgentDirMigration(source, target) {
	try {
		return fs.lstatSync(path.join(target, ".legacy-agent-dir-migration.json")).isFile() && fs.readFileSync(path.join(target, ".legacy-agent-dir-migration.json"), "utf8") === receiptContent(fs.realpathSync(source), fs.realpathSync(target));
	} catch (error) {
		if (isMissingPathError(error)) return false;
		throw error;
	}
}
function recordCompletedLegacyAgentDirMigration(sourceRoot, targetRoot) {
	const filePath = path.join(targetRoot, LEGACY_AGENT_DIR_RECEIPT);
	const content = receiptContent(sourceRoot, targetRoot);
	if (fs.lstatSync(filePath, { throwIfNoEntry: false })?.isFile() && fs.readFileSync(filePath, "utf8") === content) return;
	const requireMissingReceipt = () => {
		if (fs.lstatSync(filePath, { throwIfNoEntry: false })) throw new Error(`Preserved unrecognized migration receipt at ${filePath}; inspect it before moving it aside`);
	};
	requireMissingReceipt();
	replaceFileAtomicSync({
		filePath,
		content,
		mode: 384,
		dirMode: fs.statSync(targetRoot).mode & 4095,
		tempPrefix: ".legacy-agent-dir-migration",
		beforeRename: requireMissingReceipt,
		syncTempFile: true,
		syncParentDir: true
	});
}
function legacyAgentQuarantineNotices(stateDir, agentId, now = Date.now()) {
	let stateRoot;
	try {
		stateRoot = fs.realpathSync(stateDir);
	} catch {
		return [];
	}
	return [stateRoot, path.join(stateRoot, "agents", agentId)].flatMap((parent) => {
		try {
			const resolvedParent = fs.realpathSync(parent);
			if (resolvedParent !== stateRoot && !isPathInside(stateRoot, resolvedParent)) return [];
			const old = fs.readdirSync(resolvedParent, { withFileTypes: true }).filter((entry) => {
				const timestamp = /^agent\.legacy-(\d+)(?:-|$)/.exec(entry.name)?.[1];
				return entry.isDirectory() && timestamp && now - Number(timestamp) > 2592e6;
			});
			return old.length > 0 ? [`${old.length} legacy agent quarantine(s) older than 30 days in ${resolvedParent}; inspect agent.legacy-* and remove only copies you no longer need.`] : [];
		} catch {
			return [];
		}
	});
}
//#endregion
//#region src/agents/install-agent-dir.ts
function resolveInstallAgentDir(cfg, deps) {
	const baseEnv = cloneEnvWithPlatformSemantics(deps?.env ?? process.env);
	const homedir = deps?.homedir ?? os.homedir;
	let loaded;
	const read = () => loaded ??= typeof cfg === "function" ? cfg(baseEnv) : {
		config: cfg,
		env: baseEnv
	};
	const overrideDir = () => deps?.agentDir ?? ((loaded?.env ?? baseEnv).OPENCLAW_AGENT_DIR?.replace(/^~(?=\/|$)/, () => homedir()) || void 0);
	const agentId = () => {
		const { config } = read();
		const owner = tryResolveAmbientOwnerAgentId(config);
		return owner && listAgentIds(config).includes(owner) ? owner : void 0;
	};
	const targetDir = (selectedOwner) => {
		const explicit = overrideDir();
		if (explicit !== void 0) return explicit;
		const { config, env } = read();
		const owner = selectedOwner ?? agentId();
		return overrideDir() || (owner ? resolveEffectiveAgentDir(config, owner, {
			env,
			homedir
		}) : void 0);
	};
	const select = (dir, migrationState) => {
		let recorded;
		const readOwner = () => {
			const databasePath = path.join(dir, "openclaw-agent.sqlite");
			if (fs.existsSync(databasePath)) {
				const inspection = inspectOpenClawAgentDatabaseOwner(databasePath);
				if (inspection.status !== "owned") throw new Error(`Cannot read the agent database owner at ${databasePath}. Run openclaw doctor --fix.`);
				return inspection.agentId;
			}
			return migrationState === "legacy" || deps?.agentDir !== void 0 ? LEGACY_IMPLICIT_AGENT_ID : agentId();
		};
		return {
			dir,
			migrationState,
			get owner() {
				return (recorded ??= { owner: readOwner() }).owner;
			}
		};
	};
	let directory;
	const resolveDirectory = () => {
		const target = targetDir();
		const explicit = overrideDir();
		if (explicit !== void 0) return select(explicit, "explicit");
		const legacyDir = resolveLegacyStandaloneAgentDir(homedir);
		try {
			if (!isUpdateRehearsalReadOnlyPath(legacyDir, read().env) && fs.readdirSync(legacyDir).length > 0 && (!target || !hasCompletedLegacyAgentDirMigration(legacyDir, target))) return select(legacyDir, "legacy");
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
		return target ? select(target, "current") : void 0;
	};
	return {
		get config() {
			return read().config;
		},
		get env() {
			return read().env;
		},
		get migrationTarget() {
			const { config } = read();
			const candidate = tryResolveAmbientOwnerAgentId(config) ?? tryResolveLegacyDataOwnerAgentId(config);
			const owner = candidate && listAgentIds(config).includes(candidate) ? candidate : void 0;
			const dir = targetDir(owner);
			return dir === void 0 ? void 0 : {
				dir,
				owner
			};
		},
		get optionalDirectory() {
			return directory ??= resolveDirectory();
		},
		get directory() {
			const selected = directory ??= resolveDirectory();
			if (!selected) throw new Error("Select an agent owner or set OPENCLAW_AGENT_DIR before resolving the install directory.");
			return selected;
		}
	};
}
//#endregion
export { resolveLegacyStandaloneAgentDir as a, recordCompletedLegacyAgentDirMigration as i, LEGACY_AGENT_DIR_RECEIPT as n, legacyAgentQuarantineNotices as r, resolveInstallAgentDir as t };
