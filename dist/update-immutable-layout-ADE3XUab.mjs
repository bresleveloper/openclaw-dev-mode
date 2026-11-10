import { o as packageActivationRuntimeIdentity } from "./package-update-activation-paths-CZ6aheGK.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/update-immutable-layout.ts
const SHA = /^[a-f0-9]{40}$/u;
function directoryIdentity(file) {
	const stat = fs.lstatSync(file);
	if (!stat.isDirectory() || stat.uid !== 0 || (stat.mode & 18) !== 0) throw new Error(`Immutable installation directory must be root-owned and protected: ${file}`);
	return `${stat.dev}:${stat.ino}`;
}
function readImmutableLayout(root) {
	if (fs.realpathSync(root) !== root) throw new Error("Immutable installation must have a canonical physical root.");
	const rootIdentity = directoryIdentity(root);
	const releases = path.join(root, "releases");
	const releasesIdentity = directoryIdentity(releases);
	const pointer = path.join(root, "current");
	const stat = fs.lstatSync(pointer);
	const target = stat.isSymbolicLink() ? fs.readlinkSync(pointer) : "";
	const generationPath = path.resolve(root, target);
	const sha = path.basename(generationPath);
	if (!stat.isSymbolicLink() || stat.uid !== 0 || !SHA.test(sha) || path.dirname(generationPath) !== releases) throw new Error("Immutable current must select a root-owned direct releases/<40-hex SHA> generation.");
	const identity = directoryIdentity(generationPath);
	if (fs.realpathSync(pointer) !== generationPath || rootIdentity.split(":")[0] !== releasesIdentity.split(":")[0] || identity.split(":")[0] !== releasesIdentity.split(":")[0]) throw new Error("Immutable release layout must be contained on one filesystem.");
	return {
		rootIdentity,
		releasesIdentity,
		current: {
			sha,
			path: generationPath,
			identity,
			pointerIdentity: `${stat.dev}:${stat.ino}`
		}
	};
}
function assertImmutableDescriptorCurrent(descriptor) {
	const layout = readImmutableLayout(descriptor.root);
	if (layout.rootIdentity !== descriptor.rootIdentity || layout.releasesIdentity !== descriptor.releasesIdentity || [
		"sha",
		"path",
		"identity",
		"pointerIdentity"
	].some((key) => layout.current[key] !== descriptor.current[key]) || packageActivationRuntimeIdentity(descriptor.runtime.path) !== descriptor.runtime.identity) throw new Error("Immutable installation changed since adoption; current was not modified.");
}
//#endregion
export { directoryIdentity as n, readImmutableLayout as r, assertImmutableDescriptorCurrent as t };
