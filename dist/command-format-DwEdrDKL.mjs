import { n as normalizeProfileName } from "./profile-utils-BsmgdpgZ.mjs";
//#region src/cli/command-format.ts
const CLI_PREFIX_RE = /^(?:pnpm|npm|bunx|npx)\s+openclaw\b|^openclaw\b/;
const CONTAINER_FLAG_RE = /(?:^|\s)--container(?:\s|=|$)/;
const PROFILE_FLAG_RE = /(?:^|\s)--profile(?:\s|=|$)/;
const DEV_FLAG_RE = /(?:^|\s)--dev(?:\s|$)/;
const UPDATE_RE = /^(?:\s+--(?:dev|no-color|(?:profile|log-level)[=\s]+\S+))*\s+update(?:\s|$)/;
const CONTAINER_HINT_RE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/;
function formatCliCommand(command, env = process.env) {
	const rawContainer = env.OPENCLAW_CONTAINER_HINT?.trim();
	const container = rawContainer && CONTAINER_HINT_RE.test(rawContainer) ? rawContainer : void 0;
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	if (!container && !profile) return command;
	if (!CLI_PREFIX_RE.test(command)) return command;
	let addition;
	if (container && !CONTAINER_FLAG_RE.test(command) && !UPDATE_RE.test(command.replace(CLI_PREFIX_RE, ""))) addition = `--container ${container}`;
	if (!container && profile && !PROFILE_FLAG_RE.test(command) && !DEV_FLAG_RE.test(command)) addition = `--profile ${profile}`;
	return addition ? command.replace(CLI_PREFIX_RE, (match) => `${match} ${addition}`) : command;
}
//#endregion
export { formatCliCommand as t };
