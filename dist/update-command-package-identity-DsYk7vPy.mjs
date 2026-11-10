import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
//#region src/cli/update-cli/update-command-package-identity.ts
async function readPackageUpdateIdentity(root) {
	const [version, buildId] = await Promise.all([readPackageVersion(root), readBuiltGatewayBuildId(root)]);
	return {
		version,
		...buildId ? { buildId } : {}
	};
}
//#endregion
export { readPackageUpdateIdentity as t };
