import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import path from "node:path";
//#region src/infra/package-json.ts
function isPackageDependencyName(name) {
	if (name.startsWith("@")) {
		const parts = name.split("/");
		return parts.length === 2 && parts.every((part) => part.length > 0 && part !== "." && part !== "..");
	}
	return name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== "..";
}
/** Reads package.json as a loose object, returning null for missing or invalid manifests. */
async function readPackageJson(root, options) {
	return asNullableRecord(await tryReadJson(path.join(root, "package.json"), options));
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
export { readPackageVersion as i, readPackageManagerSpec as n, readPackageName as r, isPackageDependencyName as t };
