import path from "node:path";
//#region src/plugins/package-entrypoints.ts
/** True when a package entrypoint needs built JavaScript candidates. */
function isTypeScriptPackageEntry(entryPath) {
	return [
		".ts",
		".tsx",
		".mts",
		".cts"
	].includes(path.extname(entryPath).toLowerCase());
}
/** Lists built runtime entry candidates for a TypeScript package entrypoint. */
function listBuiltRuntimeEntryCandidates(entryPath) {
	if (!isTypeScriptPackageEntry(entryPath)) return [];
	const normalized = entryPath.replace(/\\/g, "/");
	const withoutExtension = normalized.replace(/\.[^.]+$/u, "");
	const normalizedRelative = withoutExtension.replace(/^\.\//u, "");
	const distWithoutExtension = normalizedRelative.startsWith("src/") ? `./dist/${normalizedRelative.slice(4)}` : `./dist/${normalizedRelative}`;
	const sourceExtension = path.extname(normalized).toLowerCase();
	const outputExtensions = sourceExtension === ".mts" ? [
		".mjs",
		".js",
		".cjs"
	] : sourceExtension === ".cts" ? [
		".cjs",
		".js",
		".mjs"
	] : [
		".js",
		".mjs",
		".cjs"
	];
	return [
		distWithoutExtension,
		...normalizedRelative.startsWith("src/") ? [`./dist/${normalizedRelative}`] : [],
		withoutExtension
	].flatMap((basePath) => outputExtensions.map((extension) => `${basePath}${extension}`));
}
//#endregion
export { listBuiltRuntimeEntryCandidates as n, isTypeScriptPackageEntry as t };
