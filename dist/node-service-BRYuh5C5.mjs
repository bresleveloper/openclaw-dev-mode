import { v as resolveNodeServiceIdentityEnvironment } from "./constants-BLghGsId.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
//#region src/daemon/node-service.ts
function withNodeServiceEnv(env) {
	return {
		...env,
		...resolveNodeServiceIdentityEnvironment()
	};
}
function withNodeInstallEnv(args) {
	return {
		...args,
		env: withNodeServiceEnv(args.env),
		environment: withNodeServiceEnv(args.environment ?? {})
	};
}
function resolveNodeService() {
	const base = resolveGatewayService("node");
	const { hasInstalledDefinition, isAbsent, readDefinitionMutationCapability } = base;
	return {
		...base,
		stage: (args) => base.stage(withNodeInstallEnv(args)),
		install: (args) => base.install(withNodeInstallEnv(args)),
		uninstall: (args) => base.uninstall({
			...args,
			env: withNodeServiceEnv(args.env)
		}),
		start: (args) => base.start({
			...args,
			env: withNodeServiceEnv(args.env ?? {})
		}),
		stop: (args) => base.stop({
			...args,
			env: withNodeServiceEnv(args.env ?? {})
		}),
		restart: (args) => base.restart({
			...args,
			env: withNodeServiceEnv(args.env ?? {})
		}),
		isLoaded: (args) => {
			return base.isLoaded({
				env: withNodeServiceEnv(args.env ?? {}),
				timeoutMs: args.timeoutMs
			});
		},
		hasInstalledDefinition: hasInstalledDefinition ? (args) => hasInstalledDefinition({
			...args,
			env: withNodeServiceEnv(args.env ?? {})
		}) : void 0,
		isAbsent: isAbsent ? (args) => isAbsent({
			...args,
			env: withNodeServiceEnv(args.env ?? {})
		}) : void 0,
		readDefinitionMutationCapability: readDefinitionMutationCapability ? (args) => readDefinitionMutationCapability({
			...args,
			env: withNodeServiceEnv(args.env ?? {}),
			environment: args.environment ? withNodeServiceEnv(args.environment) : void 0
		}) : void 0,
		readCommand: (env, opts) => base.readCommand(withNodeServiceEnv(env), opts),
		readRuntime: (env, opts) => base.readRuntime(withNodeServiceEnv(env), opts)
	};
}
//#endregion
export { resolveNodeService as t };
