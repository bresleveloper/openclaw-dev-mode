import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { n as containsConfigIncludeDirective } from "./io.read-helpers-N26RjV2V.mjs";
import { n as GUARDED_CONFIG_INCLUDE_WRITE_ERROR } from "./mutation-conflict-Be0wSyDG.mjs";
import { l as extractArchive, m as resolvePackedRootDir } from "./archive-BVJWOqLD.mjs";
import { c as withInstallWorkspace } from "./install-source-utils-CeCvRCDR.mjs";
import { d as isPluginBackingDefaultInferenceRoute, r as applyPersistentOperation } from "./operations-execution-helpers-Bw8Ebfsm.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/system-agent/plugin-artifact.ts
const MAX_ARTIFACT_BYTES = 33554432;
const MAX_REVIEW_CHARS = 3e3;
const ARTIFACT_REVIEW_TTL_MS = 36e5;
const ARTIFACT_IMPORT_DIR = "imports/plugins";
const PENDING_ARTIFACT_DIR = `${ARTIFACT_IMPORT_DIR}/pending`;
async function assertArtifactConfigPublicationSupported() {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const { parsed } = await readConfigFileSnapshot();
	if (isRecord(parsed) && (Object.hasOwn(parsed, "$include") || containsConfigIncludeDirective(parsed.plugins))) throw new Error(`${GUARDED_CONFIG_INCLUDE_WRITE_ERROR} Install the reviewed archive with openclaw plugins install.`);
}
function verifyArtifactDigest(bytes, expected) {
	if (!/^[a-f0-9]{64}$/u.test(expected) || createHash("sha256").update(bytes).digest("hex") !== expected) throw new Error("Plugin artifact SHA256 does not match. Repack the plugin and propose its new digest.");
}
function artifactArchiveName(sha256) {
	if (!/^[a-f0-9]{64}$/u.test(sha256)) throw new Error("Plugin artifact requires a lowercase SHA256 digest.");
	return `${sha256}.tgz`;
}
async function withArtifactImports(run) {
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-DTJKSqdR.mjs");
	return await withPluginLifecycleLease({}, async (lease) => {
		const stateDir = resolveStateDir();
		lease.assertOwned();
		await fs.mkdir(stateDir, {
			recursive: true,
			mode: 448
		});
		const files = await root(stateDir, {
			hardlinks: "reject",
			symlinks: "reject",
			mode: 384,
			maxBytes: MAX_ARTIFACT_BYTES
		});
		lease.assertOwned();
		await files.mkdir(PENDING_ARTIFACT_DIR);
		return await run(files, () => lease.assertOwned());
	});
}
async function prunePendingArtifacts(files, archiveName, assertOwned) {
	const pending = (await files.list(PENDING_ARTIFACT_DIR, { withFileTypes: true })).filter((entry) => entry.isFile && /^[a-f0-9]{64}\.tgz$/u.test(entry.name)).toSorted((left, right) => right.mtimeMs - left.mtimeMs || left.name.localeCompare(right.name));
	const expiresBefore = Date.now() - ARTIFACT_REVIEW_TTL_MS;
	let remaining = 7;
	for (const entry of pending) {
		if (entry.name === archiveName) continue;
		if (entry.mtimeMs <= expiresBefore || entry.size > MAX_ARTIFACT_BYTES || remaining === 0) {
			assertOwned();
			await files.remove(`${PENDING_ARTIFACT_DIR}/${entry.name}`);
		} else remaining -= 1;
	}
}
async function readVerifiedArtifact(filePath, sha256) {
	if (!path.isAbsolute(filePath) || !/\.(?:tgz|tar\.gz)$/u.test(filePath)) throw new Error("Plugin artifact path must be an absolute .tgz or .tar.gz file from openclaw plugins pack.");
	const bytes = await (await root(path.dirname(filePath), {
		hardlinks: "reject",
		symlinks: "reject",
		maxBytes: MAX_ARTIFACT_BYTES
	})).readBytes(path.basename(filePath));
	verifyArtifactDigest(bytes, sha256);
	return bytes;
}
async function inspectArtifact(rootDir) {
	const artifact = await root(rootDir, {
		hardlinks: "reject",
		symlinks: "reject",
		maxBytes: 1048576
	});
	const packageJson = await artifact.readJson("package.json");
	if (!isRecord(packageJson)) throw new Error("Plugin artifact package.json must be an object.");
	for (const field of [
		"dependencies",
		"optionalDependencies",
		"scripts"
	]) {
		const value = packageJson[field];
		if (value !== void 0 && (!isRecord(value) || Object.keys(value).length > 0)) throw new Error(`Plugin artifacts cannot contain ${field}. Use openclaw plugins pack to bundle the plugin first.`);
	}
	const peers = packageJson.peerDependencies;
	if (peers !== void 0 && (!isRecord(peers) || Object.keys(peers).some((name) => name !== "openclaw")) || await artifact.exists("node_modules")) throw new Error("Plugin artifacts must bundle dependencies and may only reference the host openclaw peer.");
	const extensions = resolvePackageExtensionEntries(packageJson);
	if (extensions.status !== "ok" || extensions.entries.length !== 1) throw new Error("Plugin artifact must declare exactly one compiled openclaw.extensions entry.");
	const entry = (extensions.entries[0] ?? "").replace(/^\.\//u, "");
	if (!/^dist\/(?:[\w-][\w.-]*\/)*[\w-][\w.-]*\.(?:[cm]?js)$/u.test(entry)) throw new Error("Plugin artifact entry must be compiled JavaScript under dist/.");
	await artifact.readBytes(entry, { maxBytes: MAX_ARTIFACT_BYTES });
	const loaded = withPluginCache(createPluginCache(), () => loadPluginManifest(rootDir, true, artifact.rootReal));
	if (!loaded.ok) throw new Error(loaded.error);
	const manifest = loaded.manifest;
	if (manifest.controlUi) for (const asset of [manifest.controlUi.entry, ...manifest.controlUi.styles ?? []]) await artifact.readBytes(asset, { maxBytes: MAX_ARTIFACT_BYTES });
	const { resolvePluginArtifactDeclaredSurface } = await import("./capability-artifact-TfC6k11_.mjs");
	const { computeDeclaredSurfaceHash } = await import("./capability-summary-BROCG3V7.mjs");
	const declared = resolvePluginArtifactDeclaredSurface(rootDir);
	const review = {
		pluginId: manifest.id,
		name: manifest.name ?? manifest.id,
		...manifest.version ? { version: manifest.version } : {},
		nativeControlUi: Boolean(manifest.controlUi),
		declared,
		reviewToken: computeDeclaredSurfaceHash(declared)
	};
	if (JSON.stringify(review).length > MAX_REVIEW_CHARS) throw new Error("Plugin artifact review is too large for an agent proposal. Install it from a trusted shell after reviewing its declared capabilities.");
	return review;
}
async function withVerifiedArtifact(bytes, run) {
	return await withInstallWorkspace("openclaw-plugin-artifact-", async (workspace) => {
		const files = await root(workspace, {
			hardlinks: "reject",
			symlinks: "reject",
			mode: 384
		});
		await files.create("package.tgz", bytes);
		await files.mkdir("extract");
		const archivePath = path.join(workspace, "package.tgz");
		const extractDir = path.join(workspace, "extract");
		await extractArchive({
			archivePath,
			destDir: extractDir,
			timeoutMs: 3e4,
			limits: {
				maxArchiveBytes: MAX_ARTIFACT_BYTES,
				maxEntries: 512,
				maxExtractedBytes: 67108864,
				maxEntryBytes: MAX_ARTIFACT_BYTES
			}
		});
		return await run({
			archivePath,
			review: await inspectArtifact(await resolvePackedRootDir(extractDir, { rootMarkers: ["package.json", "openclaw.plugin.json"] }))
		});
	});
}
/** Completes and inspects the import before the host records any executable proposal. */
async function prepareSystemAgentPluginArtifact(operation) {
	const bytes = await readVerifiedArtifact(operation.path, operation.sha256);
	const review = await withVerifiedArtifact(bytes, async (artifact) => artifact.review);
	await assertArtifactConfigPublicationSupported();
	if (await isPluginBackingDefaultInferenceRoute(review.pluginId)) throw new Error("This plugin backs OpenClaw's active inference route. Stop OpenClaw and install the artifact from a trusted shell.");
	return await withArtifactImports(async (files, assertOwned) => {
		const archiveName = artifactArchiveName(operation.sha256);
		const importPath = `${PENDING_ARTIFACT_DIR}/${archiveName}`;
		await prunePendingArtifacts(files, archiveName, assertOwned);
		assertOwned();
		await files.write(importPath, bytes);
		return {
			...review,
			sha256: operation.sha256,
			retainedPath: path.join(files.rootDir, importPath)
		};
	});
}
async function executePluginArtifactActivation(operation, runtime, opts) {
	if (!opts.approved) runtime.log(JSON.stringify(await prepareSystemAgentPluginArtifact(operation)));
	const result = await applyPersistentOperation({
		auditOperation: "plugin.activateArtifact",
		operation,
		runtime,
		opts,
		run: async (ctx) => await withArtifactImports(async (files, assertOwned) => {
			const archiveName = artifactArchiveName(operation.sha256);
			const pendingPath = `${PENDING_ARTIFACT_DIR}/${archiveName}`;
			if (!await files.exists(pendingPath) || (await files.stat(pendingPath)).mtimeMs <= Date.now() - ARTIFACT_REVIEW_TTL_MS) throw new Error("Plugin artifact review expired or is no longer retained. Propose the exact artifact again before applying it.");
			const bytes = await files.readBytes(pendingPath);
			verifyArtifactDigest(bytes, operation.sha256);
			return await withVerifiedArtifact(bytes, async ({ archivePath, review }) => {
				const { assertConfigWriteAllowedInCurrentMode } = await import("./config/config.js");
				const { loadConfigForInstall } = await import("./install-config-_RwtfBtX.mjs");
				const { installManagedPluginSource } = await import("./management-install-uvgY38hm.mjs");
				assertConfigWriteAllowedInCurrentMode();
				const assertPersistentApply = () => {
					ctx.assertPersistentApply?.();
					assertOwned();
				};
				const guard = async () => {
					await assertArtifactConfigPublicationSupported();
					if (await isPluginBackingDefaultInferenceRoute(review.pluginId)) throw new Error("Artifact activation stopped: this plugin now backs the active inference route. Stop OpenClaw and install it from a trusted shell.");
					assertPersistentApply();
				};
				await assertArtifactConfigPublicationSupported();
				const snapshot = await loadConfigForInstall({
					rawSpec: archivePath,
					installKind: "plugin"
				});
				const importPath = `${ARTIFACT_IMPORT_DIR}/${archiveName}`;
				const retainedPath = path.join(files.rootDir, importPath);
				const retained = await files.exists(importPath);
				if (retained) verifyArtifactDigest(await files.readBytes(importPath), operation.sha256);
				await ctx.commit(async () => {
					assertOwned();
					if (!retained) await files.create(importPath, bytes);
					assertOwned();
					await files.remove(pendingPath);
					try {
						const installed = await installManagedPluginSource({
							request: {
								source: "local",
								path: archivePath,
								recordPath: retainedPath,
								recordSource: "archive",
								mode: "update"
							},
							snapshot,
							runtime,
							applyRuntime: ctx.deps?.applyPluginRuntime,
							acknowledgeCapabilities: { reviewToken: review.reviewToken },
							beforePersistentApply: assertPersistentApply,
							beforePersistentEffect: guard
						});
						if (!installed.ok) throw new Error(installed.error);
					} catch (error) {
						runtime.error("Inspect the plugin's current status, then propose the exact artifact again before retrying.");
						throw error;
					}
				});
				return {
					summary: `Installed approved plugin artifact ${review.pluginId}`,
					details: {
						pluginId: review.pluginId,
						sha256: operation.sha256,
						sourcePath: retainedPath
					}
				};
			});
		})
	});
	if (result.applied) runtime.log("Artifact installed. Inspect the plugin's runtime and Control UI activation status.");
	return result;
}
//#endregion
export { executePluginArtifactActivation, prepareSystemAgentPluginArtifact };
