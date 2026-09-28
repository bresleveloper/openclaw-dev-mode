//#region src/worker/memory-worker-entry.ts
try {
	const [mode, workspace, ...extra] = process.argv.slice(2);
	if (mode !== "--files" && mode !== "--watch-files" || !workspace || extra.length) throw new Error("Memory file worker requires --files or --watch-files <workspace>");
	console.log = console.info = (...values) => console.error(...values);
	const { loadBundledPluginPublicArtifactModuleSync } = await import("../public-surface-loader-BZAOxkem.mjs");
	const { serveMemoryFiles } = loadBundledPluginPublicArtifactModuleSync({
		dirName: "memory-core",
		artifactBasename: "worker-api.js"
	});
	await serveMemoryFiles({
		workspace,
		input: process.stdin,
		output: process.stdout,
		watch: mode === "--watch-files"
	});
} catch (error) {
	process.stderr.write(`Memory file worker failed: ${String(error)}\n`);
	process.exitCode = 1;
}
//#endregion
export {};
