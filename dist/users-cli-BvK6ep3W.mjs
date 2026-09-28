import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-DXO3PHhc.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
//#region src/cli/users-cli.ts
const DEFAULT_USERS_TIMEOUT_MS = 1e4;
function addUsersGatewayOptions(command) {
	return command.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--timeout <ms>", "Timeout in ms", String(DEFAULT_USERS_TIMEOUT_MS)).option("--json", "Output JSON", false);
}
function writeUsersList(result, json) {
	if (json) {
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
		return;
	}
	const response = result;
	const profiles = response.profiles ?? (response.profile ? [response.profile] : []);
	if (profiles.length === 0) {
		process.stdout.write("No user profiles found.\n");
		return;
	}
	for (const profile of profiles) process.stdout.write(`${sanitizeTerminalText(profile.id ?? "")}\t${sanitizeTerminalText(profile.displayName ?? "")}\t${sanitizeTerminalText((profile.emails ?? []).join(","))}\n`);
}
function registerUsersCli(program) {
	const users = program.command("users").description("Manage durable user profiles and email aliases");
	addUsersGatewayOptions(users.command("list").description("List durable user profiles").action(async (opts) => {
		writeUsersList(await callGatewayFromCli("users.list", opts, {}, { scopes: ["operator.read"] }), opts.json === true);
	}));
	addUsersGatewayOptions(users.command("link-email <email>").description("Link an email alias to a user profile").requiredOption("--to <profileId>", "Target profile id").action(async (email, opts) => {
		writeUsersList(await callGatewayFromCli("users.linkEmail", opts, {
			email,
			targetProfileId: opts.to
		}, { scopes: ["operator.admin"] }), opts.json === true);
	}));
	applyParentDefaultHelpAction(users);
}
//#endregion
export { registerUsersCli };
