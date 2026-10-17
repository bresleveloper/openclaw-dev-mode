import { o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { i as formatInvalidConfigDetails, r as createInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-Bf_u2yr8.mjs";
import { a as registerLazyCommandGroup, n as getCommandGroupNames, o as removeCommandGroupNames, t as findCommandGroupEntry } from "./register-command-groups-CR5XGbKJ.mjs";
import { n as setCommandJsonMode } from "./json-mode-e6DlzpSi.mjs";
import { r as loadPluginCliRegistrationEntriesWithDefaults, t as createPluginCliLoadSession } from "./cli-registry-loader-0PWD2Uhz.mjs";
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
function commandNamesFor(program) {
	return new Set(program.commands.flatMap((command) => [command.name(), ...command.aliases()]));
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
		const existingCommands = parentPath.length === 0 ? params.existingCommands : commandNamesFor(targetProgram);
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
