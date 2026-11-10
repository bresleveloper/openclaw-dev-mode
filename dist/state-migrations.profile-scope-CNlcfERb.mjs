import { n as normalizeProfileName, r as resolveProfileStateDir } from "./profile-utils-Bt5nN5dt.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import os from "node:os";
import path from "node:path";
//#region src/infra/state-migrations.profile-scope.ts
/** The only released migrations allowed to look outside the active state directory. */
function resolveLegacyProfileMigrationExceptions(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profileStateDir = resolveProfileStateDir(env.OPENCLAW_PROFILE?.trim() || "default", env, homedir);
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	const legacyStateDir = resolveProfileStateDir("default", {}, homedir);
	const standaloneAgent = path.join(legacyStateDir, "agent");
	const ownsStandaloneAgent = !profile && path.resolve(resolveStateDir(env, homedir)) === path.resolve(legacyStateDir) || params.configuredAgentDir !== void 0 && path.resolve(params.configuredAgentDir) === path.resolve(standaloneAgent);
	return {
		...profile ? { profileWorkspace: path.join(path.dirname(profileStateDir), ".openclaw", `workspace-${profile}`) } : {},
		...ownsStandaloneAgent ? { standaloneAgent } : {}
	};
}
//#endregion
export { resolveLegacyProfileMigrationExceptions as t };
