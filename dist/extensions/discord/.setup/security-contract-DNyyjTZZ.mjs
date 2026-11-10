import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/discord/src/security-contract.ts
const unsupportedSecretRefSurfacePatterns = ["channels.discord.threadBindings.webhookToken", "channels.discord.accounts.*.threadBindings.webhookToken"];
function collectUnsupportedSecretRefConfigCandidates(raw) {
	if (!isRecord(raw) || !isRecord(raw.channels) || !isRecord(raw.channels.discord)) return [];
	const candidates = [];
	const discord = raw.channels.discord;
	const addCandidate = (account, path) => {
		if (isRecord(account) && isRecord(account.threadBindings)) candidates.push({
			path: `${path}.threadBindings.webhookToken`,
			value: account.threadBindings.webhookToken
		});
	};
	addCandidate(discord, "channels.discord");
	for (const [accountId, account] of Object.entries(isRecord(discord.accounts) ? discord.accounts : {})) addCandidate(account, `channels.discord.accounts.${accountId}`);
	return candidates;
}
//#endregion
export { unsupportedSecretRefSurfacePatterns as n, collectUnsupportedSecretRefConfigCandidates as t };
