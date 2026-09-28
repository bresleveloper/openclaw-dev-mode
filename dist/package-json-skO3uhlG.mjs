import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import path from "node:path";
//#region src/infra/package-json.ts
/** Reads package.json as a loose object, returning null for missing or invalid manifests. */
async function readPackageJson(root, options) {
	const parsed = await tryReadJson(path.join(root, "package.json"), options);
	return asNullableRecord(parsed);
}
/** Reads and trims the package version string, returning null for blank or non-string values. */
async function readPackageVersion(root, options) {
	return normalizeNullableString((await readPackageJson(root, options))?.version);
}
/** Reads and trims the package name string, returning null for blank or non-string values. */
async function readPackageName(root) {
	return normalizeNullableString((await readPackageJson(root))?.name);
}
/** Reads and trims the packageManager spec, returning null for blank or non-string values. */
async function readPackageManagerSpec(root) {
	return normalizeNullableString((await readPackageJson(root))?.packageManager);
}
//#endregion
export { readPackageName as n, readPackageVersion as r, readPackageManagerSpec as t };
