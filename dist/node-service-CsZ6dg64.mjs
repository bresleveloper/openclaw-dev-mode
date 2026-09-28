import { g as resolveNodeServiceIdentityEnvironment } from "./constants-CJCmIHb-.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
//#region src/daemon/node-service.ts
/** Adapts the generic gateway service manager for OpenClaw node-host services. */
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
/** Returns a service controller bound to node-host labels across all platforms. */
function resolveNodeService() {
	const base = resolveGatewayService("node");
	const { hasInstalledDefinition, isAbsent } = base;
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
		readCommand: (env, opts) => base.readCommand(withNodeServiceEnv(env), opts),
		readRuntime: (env, opts) => base.readRuntime(withNodeServiceEnv(env), opts)
	};
}
//#endregion
export { resolveNodeService as t };
