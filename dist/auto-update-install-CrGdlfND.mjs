import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as AUTO_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { r as isExactSemverVersion } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BoUn0ffV.mjs";
import "./npm-install-env-CROOzau_.mjs";
import { n as fetchRegistryPackageDocument } from "./update-check-package-target-BYX-I5ww.mjs";
import { l as resolveUpdateRegistryTarget } from "./update-check-CWEQyown.mjs";
import { n as collectPackageDistContentInventoryErrors } from "./package-dist-inventory-CQca5HwG.mjs";
import { f as resolveGlobalInstallTarget, i as createGlobalInstallEnv, r as collectInstalledGlobalPackageErrors } from "./update-global-rkW-mKvG.mjs";
import { a as resolveNpmGlobalPrefixLayoutFromPrefix } from "./update-npm-prefix-bBxyXd_e.mjs";
import { a as runStep } from "./update-runner-command-rYXXMsH4.mjs";
import { a as packNpmSpecToArchive, c as resolveNpmSpecMetadata, i as normalizeNpmViewMetadata, l as withInstallWorkspace } from "./install-source-utils-CQUKARYZ.mjs";
import { t as withUpdateCommandExecutor } from "./update-command-executor-C94Zye_E.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-C9ZL9MoY.mjs";
import { t as runGlobalPackageUpdateSteps } from "./package-update-steps-DQ5EiA1a.mjs";
import { n as assertNodeRuntimeUpdateCompatible, r as readNodeRuntimeUpdateManifest, t as assertNodeRuntimeSchemaVersions } from "./auto-update-compatibility-C3Jn8vll.mjs";
import { createWriteStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
//#region src/infra/registry-package-archive.ts
async function fetchRegistryPackageManifest(params) {
	try {
		const json = await fetchRegistryPackageDocument({
			...params,
			target: params.version,
			label: "npm package manifest",
			operation: "npm-registry-package-manifest",
			bodyTimeoutMs: Math.max(1, params.timeoutMs ?? 3e5)
		});
		const metadata = normalizeNpmViewMetadata(json, `${params.packageName}@${params.version}`);
		const tarball = normalizeOptionalString(asRecord(asRecord(json).dist).tarball);
		if (!metadata?.name || !metadata.version || !tarball) throw new Error("Registry returned incomplete package metadata (name, version, or tarball).");
		return {
			ok: true,
			metadata: {
				...metadata,
				tarball
			}
		};
	} catch (error) {
		return {
			ok: false,
			error: `Registry package manifest failed: ${String(error)}`
		};
	}
}
async function downloadRegistryPackageArchive(params) {
	const { signal, cleanup, refresh } = buildTimeoutAbortSignal({
		timeoutMs: Math.max(1, params.timeoutMs ?? 3e5),
		signal: params.signal,
		operation: "npm-registry-package-download"
	});
	let response;
	let archivePath;
	try {
		const url = new URL(params.tarballUrl);
		if (url.origin !== new URL(params.registryUrl).origin) throw new Error("Package tarball must share the registry origin.");
		if (!/^sha512-[A-Za-z0-9+/]{86}==$/u.test(params.integrity)) throw new Error("Package archive requires supported sha512 integrity.");
		response = await fetch(url.toString(), {
			signal,
			redirect: "error"
		});
		if (!response.ok || !response.body) throw new Error(`Package archive download failed: HTTP ${response.status}`);
		refresh();
		const hash = createHash("sha512");
		archivePath = path.join(params.cwd, `${randomUUID()}.tgz`);
		await pipeline(response.body, async function* (chunks) {
			for await (const chunk of chunks) {
				hash.update(chunk);
				refresh();
				yield chunk;
			}
		}, createWriteStream(archivePath, {
			flags: "wx",
			mode: 384
		}), { signal });
		signal?.throwIfAborted();
		if (`sha512-${hash.digest("base64")}` !== params.integrity) throw new Error("Package archive integrity mismatch.");
		return {
			ok: true,
			archivePath
		};
	} catch (error) {
		if (archivePath) await fs$1.rm(archivePath, { force: true });
		return {
			ok: false,
			error: `Registry package archive failed: ${String(error)}`
		};
	} finally {
		await cancelUnreadResponseBody(response);
		cleanup();
	}
}
//#endregion
//#region src/node-host/auto-update-install.ts
/** Install only into an immutable private generation; activation belongs to the node launcher. */
async function prepareNodeRuntimeUpdate(params) {
	const version = params.targetVersion.trim();
	if (!isExactSemverVersion(version) || /[\\/]/u.test(version)) throw new Error("Node auto-update requires an exact published OpenClaw version.");
	params.signal?.throwIfAborted();
	const spec = `openclaw@${version}`;
	const manager = process.versions.bun && process.platform !== "win32" ? "bun" : "npm";
	const registryTarget = resolveUpdateRegistryTarget();
	const registryManifest = manager === "bun" ? await fetchRegistryPackageManifest({
		...registryTarget,
		version,
		signal: params.signal
	}) : void 0;
	const resolved = registryManifest ?? await resolveNpmSpecMetadata({
		spec,
		signal: params.signal
	});
	if (!resolved.ok) throw new Error(resolved.error);
	const { metadata } = resolved;
	if (metadata.name !== "openclaw" || metadata.version !== version || !metadata.integrity) throw new Error("Node auto-update registry metadata does not identify the requested release and integrity.");
	assertNodeRuntimeSchemaVersions(parsePackageOpenClawSchemaVersions({
		name: metadata.name,
		version: metadata.version,
		openclaw: metadata.packageOpenClaw
	}));
	const integrity = metadata.integrity;
	const digest = createHash("sha256").update(integrity).digest("hex");
	const runtimeRoot = path.resolve(params.stateDir, "node-runtime", "releases", `${version}-${digest}`);
	const prepareGeneration = async (generationRoot) => {
		const layout = resolveNpmGlobalPrefixLayoutFromPrefix(generationRoot);
		const packageRoot = path.join(layout.globalRoot, "openclaw");
		const prepared = {
			runtimeRoot: generationRoot,
			packageRoot,
			version,
			integrity
		};
		return await withUpdateCommandExecutor(randomUUID(), async (executor) => {
			const fence = await executor.enter(generationRoot);
			const assertCurrent = () => {
				fence.assertCurrent();
				params.signal?.throwIfAborted();
			};
			assertCurrent();
			let retained = false;
			try {
				await fs$1.lstat(packageRoot);
				retained = true;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			}
			if (retained) {
				try {
					const errors = [...await collectInstalledGlobalPackageErrors({
						packageRoot,
						expectedVersion: version
					}), ...await collectPackageDistContentInventoryErrors(packageRoot)];
					if (errors.length) throw new Error(errors.join("; "));
					await readNodeRuntimeUpdateManifest(packageRoot);
				} catch (error) {
					assertCurrent();
					return { invalidRuntime: `Preserved invalid node runtime at ${generationRoot}: ${formatErrorMessage(error)}` };
				}
				await assertNodeRuntimeUpdateCompatible({
					...params,
					packageRoot
				});
				assertCurrent();
				return prepared;
			}
			return await withInstallWorkspace("openclaw-node-update-", async (workspace) => {
				assertCurrent();
				let archivePath;
				if (registryManifest?.ok) {
					const downloaded = await downloadRegistryPackageArchive({
						tarballUrl: registryManifest.metadata.tarball,
						registryUrl: registryTarget.registryUrl,
						integrity,
						cwd: workspace,
						signal: params.signal
					});
					assertCurrent();
					if (!downloaded.ok) throw new Error(downloaded.error);
					archivePath = downloaded.archivePath;
				} else {
					const packed = await packNpmSpecToArchive({
						spec,
						cwd: workspace,
						timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
						signal: params.signal
					});
					assertCurrent();
					if (!packed.ok) throw new Error(packed.error);
					if (packed.metadata.name !== "openclaw" || packed.metadata.version !== version) throw new Error("Node auto-update archive does not match the requested release.");
					const drift = await resolveNpmIntegrityDriftWithDefaultMessage({
						spec,
						expectedIntegrity: integrity,
						resolution: packed.metadata
					});
					if (drift.error) throw new Error(drift.error);
					archivePath = packed.archivePath;
				}
				const env = await createGlobalInstallEnv({
					...process.env,
					OPENCLAW_STATE_DIR: path.join(workspace, "state"),
					OPENCLAW_CONFIG_PATH: path.join(workspace, "openclaw.json"),
					...manager === "bun" ? {
						BUN_INSTALL_GLOBAL_DIR: path.dirname(layout.globalRoot),
						BUN_INSTALL_BIN: layout.binDir
					} : {}
				}, { manager });
				const runCommand = async (argv, options) => {
					assertCurrent();
					const result = await runCommandWithTimeout(argv, {
						...options,
						env: {
							...env,
							...options.env
						},
						signal: params.signal,
						killProcessTree: true
					});
					assertCurrent();
					return result;
				};
				const installTarget = await resolveGlobalInstallTarget({
					manager,
					runCommand,
					timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
					pkgRoot: packageRoot,
					honorPackageRoot: true,
					packageName: "openclaw",
					...manager === "bun" ? { env } : {}
				});
				if (installTarget.manager !== manager || installTarget.packageRoot !== packageRoot || installTarget.globalRoot !== layout.globalRoot) throw new Error(`Node auto-update ${manager} target escaped its private runtime prefix.`);
				assertCurrent();
				if (manager === "bun") {
					await fs$1.mkdir(layout.globalRoot, { recursive: true });
					await fs$1.mkdir(layout.binDir, { recursive: true });
					await fs$1.writeFile(path.join(path.dirname(layout.globalRoot), "package.json"), "{\"private\":true}\n", { flag: "wx" }).catch((error) => {
						if (!hasErrnoCode(error, "EEXIST")) throw error;
					});
					assertCurrent();
				}
				const result = await runGlobalPackageUpdateSteps({
					installTarget,
					installSpec: archivePath,
					packageName: "openclaw",
					runCommand,
					runStep: (step) => runStep({
						...step,
						runCommand,
						cwd: step.cwd ?? workspace,
						stepIndex: 0,
						totalSteps: 0
					}),
					timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
					env,
					installCwd: workspace,
					assertCurrent,
					validateCandidate: async (candidateRoot) => {
						if ((await readNodeRuntimeUpdateManifest(candidateRoot)).version !== version) throw new Error("Node auto-update installed an unexpected package version.");
						await assertNodeRuntimeUpdateCompatible({
							...params,
							packageRoot: candidateRoot
						});
						assertCurrent();
						return [];
					}
				});
				assertCurrent();
				if (result.failedStep || result.activePackageRoot !== packageRoot || result.afterVersion !== version) throw new Error(result.failedStep?.stderrTail ?? "Node auto-update private installation could not be verified.");
				return prepared;
			});
		});
	};
	const initial = await prepareGeneration(runtimeRoot);
	if (!("invalidRuntime" in initial)) return initial;
	try {
		const replacement = await prepareGeneration(`${runtimeRoot}-${randomUUID()}`);
		if ("invalidRuntime" in replacement) throw new Error(replacement.invalidRuntime);
		return {
			...replacement,
			warnings: [initial.invalidRuntime]
		};
	} catch (cause) {
		throw new Error(`${initial.invalidRuntime}; fresh installation failed: ${formatErrorMessage(cause)}`, { cause });
	}
}
//#endregion
export { prepareNodeRuntimeUpdate };
