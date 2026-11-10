import { t as applyPathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { n as readPackageManagerSpec } from "./package-json-B0xzRYh1.mjs";
import { t as detectPackageManager } from "./detect-package-manager-Bj0ojQ-Y.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/infra/update-package-manager.ts
function resolvePnpmCandidateEnv(env, virtualStoreDir) {
	return {
		...env,
		PNPM_CONFIG_VIRTUAL_STORE_DIR: virtualStoreDir,
		pnpm_config_virtual_store_dir: virtualStoreDir,
		NPM_CONFIG_VIRTUAL_STORE_DIR: virtualStoreDir,
		npm_config_virtual_store_dir: virtualStoreDir
	};
}
async function isManagerAvailable(runCommand, manager, timeoutMs, env, expectedVersion) {
	try {
		const res = await runCommand([manager, "--version"], {
			timeoutMs,
			env
		});
		return res.code === 0 && (!expectedVersion || res.stdout.trim() === expectedVersion);
	} catch {
		return false;
	}
}
function cloneCommandEnv(env) {
	return Object.fromEntries(Object.entries(env ?? process.env).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)]));
}
async function enablePnpmViaCorepack(runCommand, timeoutMs, env, expectedVersion, work) {
	if (!await isManagerAvailable(runCommand, "corepack", timeoutMs, env)) return "missing";
	try {
		if ((await runCommand(["corepack", "enable"], {
			timeoutMs: work ? work.timeoutMs : timeoutMs,
			env
		})).code !== 0) return "failed";
	} catch {
		return "failed";
	}
	return await isManagerAvailable(runCommand, "pnpm", timeoutMs, env, expectedVersion) ? "enabled" : "failed";
}
async function bootstrapPnpmViaNpm(params) {
	const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-update-pnpm-"));
	const cleanup = async () => {
		await fs.rm(tempRoot, {
			recursive: true,
			force: true
		}).catch(() => {});
	};
	try {
		await fs.writeFile(path.join(tempRoot, "package.json"), JSON.stringify({
			private: true,
			allowScripts: { [`pnpm@${params.version}`]: true }
		}));
		if ((await params.runCommand([
			"npm",
			"install",
			"--prefix",
			tempRoot,
			`pnpm@${params.version}`
		], {
			timeoutMs: params.work ? params.work.timeoutMs : params.timeoutMs,
			env: params.baseEnv
		})).code !== 0) {
			await cleanup();
			return null;
		}
		const env = cloneCommandEnv(params.baseEnv);
		applyPathPrepend(env, [path.join(tempRoot, "node_modules", ".bin")]);
		if (!await isManagerAvailable(params.runCommand, "pnpm", params.timeoutMs, env, params.version)) {
			await cleanup();
			return null;
		}
		return {
			env,
			cleanup
		};
	} catch {
		await cleanup();
		return null;
	}
}
function parsePnpmPackageManagerVersion(pin) {
	return /^pnpm@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)(?:\+.*)?$/u.exec(pin ?? "")?.[1];
}
async function resolveUpdateBuildManager(commandRunner, root, timeoutMs, baseEnv, work) {
	const runCommand = (argv, options) => commandRunner(argv, {
		...options,
		cwd: root
	});
	const preferred = await detectPackageManager(root) ?? "npm";
	const pnpmVersion = parsePnpmPackageManagerVersion(await readPackageManagerSpec(root));
	if (preferred === "pnpm") {
		if (await isManagerAvailable(runCommand, "pnpm", timeoutMs, baseEnv, pnpmVersion)) return {
			kind: "resolved",
			manager: "pnpm",
			fallback: false
		};
		const corepackStatus = await enablePnpmViaCorepack(runCommand, timeoutMs, baseEnv, pnpmVersion, work);
		if (corepackStatus === "enabled") return {
			kind: "resolved",
			manager: "pnpm",
			fallback: false
		};
		if (await isManagerAvailable(runCommand, "npm", timeoutMs, baseEnv) && pnpmVersion) {
			const pnpmBootstrap = await bootstrapPnpmViaNpm({
				version: pnpmVersion,
				runCommand,
				timeoutMs,
				work,
				baseEnv
			});
			if (pnpmBootstrap) return {
				kind: "resolved",
				manager: "pnpm",
				fallback: false,
				env: pnpmBootstrap.env,
				cleanup: pnpmBootstrap.cleanup
			};
			return {
				kind: "missing-required",
				preferred,
				reason: "pnpm-npm-bootstrap-failed"
			};
		}
		if (corepackStatus === "missing") return {
			kind: "missing-required",
			preferred,
			reason: "pnpm-corepack-missing"
		};
		return {
			kind: "missing-required",
			preferred,
			reason: "pnpm-corepack-enable-failed"
		};
	}
	const managers = preferred === "bun" ? [
		"bun",
		"npm",
		"pnpm"
	] : [
		"npm",
		"pnpm",
		"bun"
	];
	for (const manager of managers) if (await isManagerAvailable(runCommand, manager, timeoutMs, baseEnv, manager === "pnpm" ? pnpmVersion : void 0)) return {
		kind: "resolved",
		manager,
		fallback: manager !== preferred
	};
	return {
		kind: "missing-required",
		preferred,
		reason: "preferred-manager-unavailable"
	};
}
//#endregion
export { resolvePnpmCandidateEnv as n, resolveUpdateBuildManager as r, parsePnpmPackageManagerVersion as t };
