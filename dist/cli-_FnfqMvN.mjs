import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-YqkPeFye.mjs";
import { a as registerLazyCommandGroup, n as getCommandGroupNames, o as removeCommandGroupNames, t as findCommandGroupEntry } from "./register-command-groups-Uzwp5G4x.mjs";
import { n as setCommandJsonMode } from "./json-mode-BIqJ-P-D.mjs";
import { r as loadPluginCliRegistrationEntriesWithDefaults, t as createPluginCliLoadSession } from "./cli-registry-loader-DUphUrT7.mjs";
//#region src/plugins/register-plugin-cli-command-groups.ts
function canRegisterPluginCliLazily(entry) {
	if (entry.placeholders.length === 0) return false;
	const descriptorNames = new Set(entry.placeholders.map((descriptor) => descriptor.name));
	return getCommandGroupNames(entry).every((command) => descriptorNames.has(command));
}
function findCommandByPath(program, path) {
	let current = program;
	for (const segment of path) {
		const next = current.commands.find((command) => command.name() === segment || command.aliases().includes(segment));
		if (!next) return null;
		current = next;
	}
	return current;
}
function applyMachineOutputMode(program, descriptor) {
	if (!descriptor.machineOutput) return;
	const command = program.commands.find((candidate) => candidate.name() === descriptor.name);
	if (!command) return;
	setCommandJsonMode(command, "output", ({ argv, stdoutIsTTY }) => descriptor.machineOutput?.({
		argv,
		stdoutIsTTY
	}) === true);
}
async function registerPluginCliCommandGroups(program, entries, params) {
	for (const entry of entries) {
		const parentPath = entry.parentPath ?? [];
		const targetProgram = findCommandByPath(program, parentPath);
		if (!targetProgram) {
			params.logger.debug?.(`plugin CLI register skipped (${entry.pluginId}): parent command missing (${parentPath.join(" ")})`);
			continue;
		}
		const existingCommands = parentPath.length === 0 ? params.existingCommands : new Set(targetProgram.commands.flatMap((command) => [command.name(), ...command.aliases()]));
		const registerEntry = async () => {
			await entry.register(targetProgram);
			for (const descriptor of entry.placeholders) applyMachineOutputMode(targetProgram, descriptor);
			for (const command of getCommandGroupNames(entry)) existingCommands.add(command);
		};
		if (params.primary && (parentPath[0] === params.primary || findCommandGroupEntry([entry], params.primary))) {
			removeCommandGroupNames(targetProgram, entry);
			await registerEntry();
			continue;
		}
		const overlaps = getCommandGroupNames(entry).filter((command) => existingCommands.has(command));
		if (overlaps.length > 0) {
			params.logger.debug?.(`plugin CLI register skipped (${entry.pluginId}): command already registered (${overlaps.join(", ")})`);
			continue;
		}
		try {
			if (params.mode === "lazy" && canRegisterPluginCliLazily(entry)) {
				for (const placeholder of entry.placeholders) {
					registerLazyCommandGroup(targetProgram, {
						...entry,
						register: registerEntry
					}, placeholder);
					applyMachineOutputMode(targetProgram, placeholder);
				}
				continue;
			}
			if (params.mode === "lazy" && entry.placeholders.length > 0) params.logger.debug?.(`plugin CLI lazy register fallback to eager (${entry.pluginId}): descriptors do not cover all command roots`);
			await registerEntry();
		} catch (error) {
			params.logger.warn(`plugin CLI register failed (${entry.pluginId}): ${String(error)}`);
		}
	}
}
//#endregion
//#region src/plugins/cli.ts
const logger = createPluginRuntimeLoaderLogger();
async function registerPluginCliCommandsFromValidatedConfig(program, env, loaderOptions, options) {
	const session = options?.session ?? createPluginCliLoadSession(getPluginCache());
	try {
		const snapshot = await session.readConfig(() => readConfigFileSnapshot({ skipPluginValidation: options?.skipPluginValidation }));
		if (!snapshot.valid) throw createInvalidConfigError(snapshot.path, formatInvalidConfigDetails(snapshot.issues));
		const cfg = getRuntimeConfigSnapshot() ?? snapshot.runtimeConfig;
		const mode = options?.mode ?? "eager";
		const primary = options?.primary ?? void 0;
		await registerPluginCliCommandGroups(program, (await loadPluginCliRegistrationEntriesWithDefaults({
			cfg,
			env,
			loaderOptions,
			primaryCommand: primary,
			session
		}, mode === "metadata" ? "metadata" : "runtime")).map((entry) => {
			if (mode === "eager" || mode === "lazy" && primary && (entry.parentPath[0] === primary || entry.names.includes(primary) || entry.placeholders.some((descriptor) => descriptor.name === primary))) return entry;
			return Object.assign({}, entry, { register: async (target) => {
				const deferred = createPluginCliLoadSession(getPluginCache(), { resources: session.resources });
				try {
					const match = (await loadPluginCliRegistrationEntriesWithDefaults({
						cfg,
						env,
						loaderOptions,
						primaryCommand: mode === "metadata" ? primary : void 0,
						session: deferred
					})).find((candidate) => candidate.pluginId === entry.pluginId && candidate.parentPath.join("\0") === entry.parentPath.join("\0") && candidate.names.join("\0") === entry.names.join("\0"));
					if (!match) throw new Error(`Plugin CLI registration is no longer available (${entry.pluginId}).`);
					await match.register(target);
				} finally {
					deferred.close();
				}
			} });
		}), {
			mode: mode === "metadata" ? "lazy" : mode,
			primary: mode === "metadata" ? void 0 : primary,
			existingCommands: new Set(program.commands.flatMap((cmd) => [cmd.name(), ...cmd.aliases()])),
			logger
		});
		return cfg;
	} finally {
		if (!options?.session) session.close();
	}
}
//#endregion
export { registerPluginCliCommandsFromValidatedConfig };
