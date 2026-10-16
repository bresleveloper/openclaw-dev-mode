import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as readCliStartupMetadata } from "./startup-metadata-Cz8N34wN.mjs";
//#region src/cli/channel-options.ts
function resolveCliChannelOptions() {
	try {
		const parsed = readCliStartupMetadata(import.meta.url);
		if (parsed && Array.isArray(parsed.channelOptions)) return uniqueStrings(parsed.channelOptions.filter((value) => typeof value === "string" && Boolean(value)));
	} catch {}
	return [];
}
function formatCliChannelOptions(extra = []) {
	const options = [...extra, ...resolveCliChannelOptions()];
	return options.length > 0 ? options.join("|") : "channel";
}
//#endregion
export { resolveCliChannelOptions as n, formatCliChannelOptions as t };
