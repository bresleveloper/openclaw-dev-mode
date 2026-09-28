import { t as readCliStartupMetadata } from "./startup-metadata-Cz8N34wN.mjs";
//#region src/cli/root-help-metadata.ts
const precomputedHelpText = /* @__PURE__ */ new Map();
function loadPrecomputedHelpText(key) {
	const cached = precomputedHelpText.get(key);
	if (cached !== void 0) return cached;
	let helpText = null;
	try {
		const parsed = readCliStartupMetadata(import.meta.url);
		let value;
		if (isPrecomputedSubcommandHelpName(key)) {
			const subcommandHelpText = parsed?.subcommandHelpText;
			if (isSubcommandHelpTextRecord(subcommandHelpText)) value = subcommandHelpText[key];
		} else if (parsed) value = parsed[key];
		if (typeof value === "string" && value.length > 0) helpText = value;
	} catch {}
	precomputedHelpText.set(key, helpText);
	return helpText;
}
function outputPrecomputedHelpText(key) {
	const helpText = loadPrecomputedHelpText(key);
	if (!helpText) return false;
	process.stdout.write(helpText);
	return true;
}
function outputPrecomputedRootHelpText() {
	return outputPrecomputedHelpText("rootHelpText");
}
function outputPrecomputedBrowserHelpText() {
	return outputPrecomputedHelpText("browserHelpText");
}
function outputPrecomputedSecretsHelpText() {
	return outputPrecomputedHelpText("secretsHelpText");
}
function outputPrecomputedNodesHelpText() {
	return outputPrecomputedHelpText("nodesHelpText");
}
function outputPrecomputedSubcommandHelpText(commandName) {
	return isPrecomputedSubcommandHelpName(commandName) && outputPrecomputedHelpText(commandName);
}
function isPrecomputedSubcommandHelpName(commandName) {
	return commandName === "config" || commandName === "doctor" || commandName === "gateway" || commandName === "models" || commandName === "plugins" || commandName === "sessions" || commandName === "tasks";
}
function isSubcommandHelpTextRecord(value) {
	return typeof value === "object" && value !== null;
}
//#endregion
export { outputPrecomputedBrowserHelpText, outputPrecomputedNodesHelpText, outputPrecomputedRootHelpText, outputPrecomputedSecretsHelpText, outputPrecomputedSubcommandHelpText };
