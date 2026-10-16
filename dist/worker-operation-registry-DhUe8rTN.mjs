import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region src/state/worker-operation-registry.ts
function createWorkerOperationRegistry(loaders) {
	const domains = new Map(Object.entries(loaders).map(([name, load]) => [name, { load: createLazyRuntimeModule(load) }]));
	const domainFor = (type) => typeof type === "string" ? domains.get(type) ?? domains.get(type.slice(0, type.indexOf("."))) : void 0;
	const handlerFor = (type) => {
		const handlers = domainFor(type)?.handlers;
		return handlers && Object.hasOwn(handlers, type) ? handlers[String(type)] : void 0;
	};
	return {
		prepare(type) {
			const domain = domainFor(type);
			if (domain && !domain.handlers) return domain.load().then((handlers) => {
				domain.handlers = handlers;
			});
		},
		has(command) {
			return handlerFor(command.type) !== void 0;
		},
		execute(command, context) {
			const handler = handlerFor(command.type);
			if (!handler) throw new Error(`Worker operation is not prepared: ${String(command.type)}`);
			return handler(command.input, context);
		}
	};
}
//#endregion
export { createWorkerOperationRegistry as t };
