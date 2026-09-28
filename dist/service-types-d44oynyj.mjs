//#region src/daemon/service-types.ts
const SERVICE_DEFINITION_ARTIFACTS = {
	"service-directory": "service directory (~/.config/systemd/user) or its nearest existing ancestor",
	"state-directory": "service state directory or its nearest existing ancestor",
	"definition-directory": "loaded service definition directory",
	"service-file": "service file"
};
const SERVICE_DEFINITION_REASONS = {
	"unsafe-permissions": "is group/world-writable. Inspect ownership and permissions locally. If the path is yours and not intentionally shared, remove group/other write access with chmod go-w <path>, then retry. Use 0700 for private directories; ask the deployment owner about shared paths. Do not use recursive chmod or sudo to bypass this check.",
	"invalid-artifact": "has an unexpected file type. Inspect the service directories and files locally; have their owner repair the layout before retrying. Changing permissions alone will not repair it.",
	symlink: "is a symbolic link. Ask the deployment owner to replace the managed file through the deployment process; OpenClaw will not rewrite the link or its target.",
	"foreign-owner": "belongs to another account. Ask the privileged deployment owner to repair or replace it; do not take ownership or use --force to bypass this check.",
	"sealed-mount": "cannot be replaced on its mount. Ask the deployment owner to update the mounted artifact or deployment; chmod and --force cannot make it replaceable.",
	"system-owned": "is owned by a system service. Ask the privileged deployment owner to update it; do not create a competing user service.",
	"system-ownership-unverified": "has unverifiable system-service ownership. Restore system service-manager and filesystem inspection access from the service account, then retry; do not create a competing user service.",
	"inspection-failed": "cannot be safely inspected. Inspect service definition access and native service-manager availability from the service account, then retry. Do not share config or environment contents."
};
function assertServiceDefinitionWritable(capability) {
	if (capability.kind === "writable") return;
	const reason = Object.hasOwn(SERVICE_DEFINITION_REASONS, capability.reason) ? capability.reason : "inspection-failed";
	const artifact = capability.artifact && Object.hasOwn(SERVICE_DEFINITION_ARTIFACTS, capability.artifact) ? SERVICE_DEFINITION_ARTIFACTS[capability.artifact] : "service definition";
	const code = capability.kind === "sealed" ? "SERVICE_DEFINITION_SEALED" : "SERVICE_DEFINITION_UNKNOWN";
	const location = capability.path ? ` ${JSON.stringify(capability.path)}` : "";
	throw new Error(`${code}: [${reason}] The ${artifact}${location} ${SERVICE_DEFINITION_REASONS[reason]}`);
}
function resolveManagedGatewayServiceCommand(command) {
	return command?.managedDefinition ?? command ?? null;
}
/** Operator-owned launcher overrides cannot be repaired by rewriting the managed base. */
function hasGatewayServiceLauncherOverride(command, options) {
	const managedOverrides = command?.managedOverrides;
	const includeWorkingDirectory = options?.includeWorkingDirectory !== false;
	if (managedOverrides) return Boolean(managedOverrides.launcher && (includeWorkingDirectory || managedOverrides.launcher !== "working-directory"));
	const managedDefinition = command?.managedDefinition;
	return Boolean(managedDefinition && (includeWorkingDirectory && managedDefinition.workingDirectory !== command.workingDirectory || managedDefinition.programArguments.join("\0") !== command.programArguments.join("\0")));
}
function hasGatewayServiceEnvironmentOverride(command, keys, options) {
	const managedOverrides = command?.managedOverrides;
	if (!managedOverrides) return hasGatewayServiceEnvironmentDifference(command, keys);
	const environment = managedOverrides.environment;
	if (environment === true || !environment) return environment === true && keys.length > 0;
	const normalize = options?.normalizeKey ?? ((key) => key);
	const ownedKeys = new Set(environment.keys?.map(normalize));
	const sources = options?.environmentValueSources ?? command.managedDefinition?.environmentValueSources;
	return keys.some((key) => {
		const normalized = normalize(key);
		if (normalized !== null && ownedKeys.has(normalized)) return true;
		if (options?.ignoreResets) return false;
		const source = sources?.[key] ?? (options?.normalizeKey && Object.entries(sources ?? {}).find(([rawKey]) => normalize(rawKey) === normalized)?.[1]) ?? "inline";
		return Boolean(environment.resetInline && source !== "file" || environment.resetFiles && source !== "inline");
	});
}
function hasGatewayServiceEnvironmentDifference(command, keys) {
	const managedDefinition = command?.managedDefinition;
	return Boolean(managedDefinition && keys.some((key) => command.environment?.[key] !== managedDefinition.environment?.[key] || (command.environmentValueSources?.[key] ?? "inline") !== (managedDefinition.environmentValueSources?.[key] ?? "inline")));
}
/** Remove inherited operator overrides before a managed definition is rewritten. */
function resolveManagedGatewayServiceProcessEnv(command, processEnv) {
	const overrides = command?.managedOverrides?.environment;
	if (overrides === true || overrides?.resetInline || overrides?.resetFiles) return null;
	const managedEnvironment = resolveManagedGatewayServiceCommand(command)?.environment;
	const environment = {
		...processEnv,
		...managedEnvironment
	};
	for (const key of [...Object.keys(command?.environment ?? {}), ...overrides?.keys ?? []]) if (!Object.hasOwn(managedEnvironment ?? {}, key)) delete environment[key];
	return environment;
}
//#endregion
export { resolveManagedGatewayServiceCommand as a, hasGatewayServiceLauncherOverride as i, hasGatewayServiceEnvironmentDifference as n, resolveManagedGatewayServiceProcessEnv as o, hasGatewayServiceEnvironmentOverride as r, assertServiceDefinitionWritable as t };
