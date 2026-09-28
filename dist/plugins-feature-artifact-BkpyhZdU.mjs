import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { m as safePluginInstallFileName } from "./install-paths-DnOgVB7K.mjs";
import { i as validatePackageExtensionEntriesForInstall, r as resolvePackageSetupSource, t as resolvePackageRuntimeExtensionSources } from "./package-entry-resolution-D32N9wpN.mjs";
import { r as readPluginControlUiAssets } from "./control-ui-assets-CkvqX-YU.mjs";
import { l as buildPluginBundle, r as collectPluginsValidationResult } from "./plugins-authoring-command-ByHsgZya.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
import { create } from "tar";
//#region src/cli/plugins-feature-artifact.ts
/** Produce one reviewable import: bundled code, immutable UI assets, no install scripts. */
async function packFeaturePlugin(opts) {
	const rootDir = await fs.realpath(path.resolve(opts.root ?? process.cwd()));
	const validation = await collectPluginsValidationResult({ root: rootDir });
	if (!validation.valid) throw new Error(validation.errors.join("\n"));
	const source = await root(rootDir, {
		symlinks: "reject",
		hardlinks: "reject"
	});
	const packageManifest = await source.readJson("package.json");
	if (!isRecord(packageManifest) || !isRecord(packageManifest.openclaw)) throw new Error("Plugin package metadata is missing. Run openclaw plugins build.");
	const extensions = resolvePackageExtensionEntries(packageManifest);
	if (extensions.status !== "ok" || extensions.entries.length !== 1) throw new Error("Plugin artifacts require exactly one backend entrypoint.");
	const entriesValid = await validatePackageExtensionEntriesForInstall({
		packageDir: rootDir,
		manifest: packageManifest,
		extensions: extensions.entries,
		allowSourceTypeScriptEntries: true
	});
	if (!entriesValid.ok) throw new Error(entriesValid.error);
	const diagnostics = [];
	const resolution = {
		packageDir: rootDir,
		manifest: packageManifest,
		origin: "config",
		requireBuiltRuntimeEntry: false,
		sourceLabel: rootDir,
		diagnostics
	};
	const [entry] = resolvePackageRuntimeExtensionSources({
		...resolution,
		extensions: extensions.entries
	});
	const setupEntry = resolvePackageSetupSource(resolution);
	if (!entry || diagnostics.length > 0) throw new Error(diagnostics.map((diagnostic) => diagnostic.message).join("\n"));
	const loaded = withPluginCache(createPluginCache(), () => loadPluginManifest(rootDir, false));
	if (!loaded.ok) throw new Error(loaded.error);
	const pluginId = loaded.manifest.id;
	const outputPath = path.resolve(opts.out ?? path.join(rootDir, `${safePluginInstallFileName(pluginId)}.tgz`));
	if (!/\.(?:tgz|tar\.gz)$/u.test(outputPath)) throw new Error("Plugin artifact output must end in .tgz or .tar.gz.");
	const staging = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-plugin-pack-"));
	try {
		await fs.mkdir(path.join(staging, "package"));
		const destination = await root(path.join(staging, "package"), {
			mkdir: true,
			symlinks: "reject",
			hardlinks: "reject"
		});
		await destination.ensureRoot();
		const { controlUi: _source, runtimeExtensions: _runtime, runtimeSetupEntry: _runtimeSetup, ...openclaw } = packageManifest.openclaw;
		const packedPackage = {
			name: packageManifest.name,
			version: packageManifest.version,
			type: "module",
			...typeof packageManifest.description === "string" ? { description: packageManifest.description } : {},
			...typeof packageManifest.license === "string" ? { license: packageManifest.license } : {},
			...isRecord(packageManifest.peerDependencies) && typeof packageManifest.peerDependencies.openclaw === "string" ? { peerDependencies: { openclaw: packageManifest.peerDependencies.openclaw } } : {},
			openclaw: {
				...openclaw,
				extensions: ["./dist/index.js"],
				...setupEntry ? { setupEntry: "./dist/setup.js" } : {}
			}
		};
		await destination.create("package.json", `${JSON.stringify(packedPackage, null, 2)}\n`);
		await destination.create("openclaw.plugin.json", await source.readBytes("openclaw.plugin.json"));
		const files = await buildPluginBundle({
			absWorkingDir: rootDir,
			entryPoints: {
				index: entry,
				...setupEntry ? { setup: setupEntry } : {}
			},
			outdir: "dist",
			splitting: true,
			platform: "node",
			target: "node22",
			external: ["openclaw", "openclaw/*"]
		});
		for (const file of files) {
			const relativePath = path.relative(rootDir, file.path);
			await destination.mkdir(path.dirname(relativePath));
			await destination.create(relativePath, Buffer.from(file.contents));
		}
		const controlUi = loaded.manifest.controlUi;
		if (controlUi) {
			const { directory, assets } = await readPluginControlUiAssets(rootDir, controlUi);
			for (const [name, asset] of assets) {
				const relativePath = path.posix.join(directory, name);
				await destination.mkdir(path.posix.dirname(relativePath));
				await destination.create(relativePath, asset.body);
			}
		}
		const archive = path.join(staging, "plugin.tgz");
		await create({
			cwd: staging,
			file: archive,
			gzip: true,
			portable: true,
			noMtime: true,
			strict: true
		}, ["package"]);
		const bytes = await fs.readFile(archive);
		if (bytes.length > 33554432) throw new Error("Plugin artifacts must be at most 32 MiB.");
		await fs.writeFile(outputPath, bytes, {
			flag: "wx",
			mode: 384
		});
		const sha256 = createHash("sha256").update(bytes).digest("hex");
		return {
			path: outputPath,
			sha256,
			pluginId,
			bytes: bytes.length,
			activation: {
				action: "plugin_activate_artifact",
				path: outputPath,
				sha256
			}
		};
	} finally {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
	}
}
async function runPluginsPackCommand(opts) {
	const receipt = await packFeaturePlugin(opts);
	if (opts.json) {
		defaultRuntime.writeJson(receipt);
		return;
	}
	defaultRuntime.log(`Packed ${receipt.pluginId}: ${receipt.path}\nSHA256: ${receipt.sha256}\nUse plugin_activate_artifact with this path and digest to request activation approval.`);
}
//#endregion
export { runPluginsPackCommand };
