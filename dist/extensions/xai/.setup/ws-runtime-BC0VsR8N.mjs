import { createRequire } from "node:module";
import path from "node:path";
//#region extensions/xai/ws-runtime.ts
const require = createRequire(import.meta.url);
const WebSocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
export { WebSocket as t };
