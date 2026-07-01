import "./errors-4r1y6XFh.js";
import { n as testing$1 } from "./manager-CnlRhuXY.js";
import { i as testing$2 } from "./registry-BvEYhdfU.js";
import "./session-meta-SVmmuxkv.js";
import "./acp-runtime-backend-DmJzpLxm.js";
//#region src/plugin-sdk/acp-runtime.ts
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
const testing = new Proxy({}, {
	get(_target, prop, receiver) {
		if (Reflect.has(testing$1, prop)) return Reflect.get(testing$1, prop, receiver);
		return Reflect.get(testing$2, prop, receiver);
	},
	has(_target, prop) {
		return Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop);
	},
	ownKeys() {
		return Array.from(new Set([...Reflect.ownKeys(testing$1), ...Reflect.ownKeys(testing$2)]));
	},
	getOwnPropertyDescriptor(_target, prop) {
		if (Reflect.has(testing$1, prop) || Reflect.has(testing$2, prop)) return {
			configurable: true,
			enumerable: true
		};
	}
});
//#endregion
export { testing as t };
