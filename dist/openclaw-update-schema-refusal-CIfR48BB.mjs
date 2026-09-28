import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/state/openclaw-update-schema-refusal.ts
/** An unfenced updater needs a manual update when safe publication deferral is unavailable. */
var UpdateSchemaRefusalError = class extends Error {
	constructor(databases, updaterVersion, options) {
		const { targetVersion } = options;
		const commands = options.recovery?.commands ?? [
			"openclaw gateway stop",
			`npm install -g openclaw@${targetVersion} --allow-scripts=openclaw`,
			"openclaw doctor --fix",
			"openclaw gateway start"
		];
		const reason = options.cause === void 0 ? "" : ` Deferral failed: ${formatErrorMessage(options.cause).slice(0, 600)}.`;
		super(`Doctor refused update-time schema repair driven by OpenClaw ${updaterVersion}: this updater reopens the ledger with old code after migration, and version publication could not be deferred safely. ` + databases.map((database) => `${database.kind} database ${database.path}: on-disk schema ${database.foundVersion}, this build's schema ${database.supportedVersion}.`).join(" ") + reason + " The blocked schema change was not applied." + (options.recovery ? `\n${options.recovery.message}` : ` Let the updater restore the previous package, then update manually: ${commands.join(" && ")}. Use the package manager that owns this install (pnpm: pnpm add -g --allow-build=openclaw openclaw@${targetVersion}; Bun: bun add -g --trust openclaw@${targetVersion}). On npm 11.15 and earlier, omit --allow-scripts=openclaw.`), options);
		this.databases = databases;
		this.updaterVersion = updaterVersion;
		this.code = "update-schema-bump-unfenced";
		this.name = "UpdateSchemaRefusalError";
		this.targetVersion = targetVersion;
		this.commands = commands;
	}
};
//#endregion
export { UpdateSchemaRefusalError as t };
