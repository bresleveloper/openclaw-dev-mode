import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-Cg4widap.mjs";
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
