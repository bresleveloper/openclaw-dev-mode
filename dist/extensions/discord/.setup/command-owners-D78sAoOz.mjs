//#region extensions/discord/src/command-owners.ts
function resolveDiscordCommandOwnerEntries(cfg) {
	const entries = (cfg.commands?.ownerAllowFrom ?? []).map((entry) => String(entry).trim()).filter((entry) => entry && (/^(discord|user|pk):/i.test(entry) || !entry.includes(":")));
	return entries.length > 0 ? entries.filter((entry) => !/^discord:user:/i.test(entry)) : void 0;
}
function resolveDiscordCommandOwnerAllowFrom(cfg) {
	return resolveDiscordCommandOwnerEntries(cfg)?.map((entry) => entry.replace(/^discord:/i, "").trim()).filter(Boolean);
}
//#endregion
export { resolveDiscordCommandOwnerEntries as n, resolveDiscordCommandOwnerAllowFrom as t };
