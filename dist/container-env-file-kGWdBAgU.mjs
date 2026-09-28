import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { a as normalizeEnvVarKey } from "./host-env-security-D7wdDMke.mjs";
import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
//#region src/infra/container-env-file.ts
function getContainerEnvFileEntryIssue(key, value) {
	if (normalizeEnvVarKey(key, { portable: true }) !== key) return "invalid-name";
	if (/[\r\n]/u.test(value)) return "line-break";
	return value.includes("\0") ? "nul" : void 0;
}
function serializeContainerEnv(env) {
	let content = "";
	const entries = Object.entries(env).toSorted(([left], [right]) => left.localeCompare(right));
	for (const [key, value] of entries) {
		const issue = getContainerEnvFileEntryIssue(key, value);
		if (issue === "invalid-name") throw new Error(`Invalid container environment variable name ${JSON.stringify(key)}; use letters, digits, and underscores without a leading digit.`);
		if (issue === "line-break") throw new Error(`Container environment variable ${key} must have a single-line value because Docker and Podman --env-file entries are line-delimited.`);
		if (issue === "nul") throw new Error(`Container environment variable ${key} must not contain NUL bytes.`);
		content += `${key}=${value}\n`;
	}
	return content;
}
/** Stages engine environment values outside process arguments until the caller-owned cleanup. */
async function createContainerEnvFile(env) {
	const content = serializeContainerEnv(env);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-container-env-",
		dirMode: 448,
		mode: 384
	});
	try {
		return {
			path: await workspace.write("container.env", content),
			cleanup: async () => {
				await workspace.cleanup();
			}
		};
	} catch (error) {
		await workspace.cleanup().catch(() => void 0);
		throw error;
	}
}
/** Keeps a private container environment file alive only while its engine operation runs. */
async function withContainerEnvFile(env, run) {
	const file = await createContainerEnvFile(env);
	try {
		return await run(file.path);
	} finally {
		await file.cleanup();
	}
}
//#endregion
export { getContainerEnvFileEntryIssue as n, withContainerEnvFile as r, createContainerEnvFile as t };
