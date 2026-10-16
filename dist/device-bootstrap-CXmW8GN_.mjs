import { t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import "./device-bootstrap-profile-DPDpvU9k.mjs";
import "./device-pairing-Drmq_Czv.mjs";
import "./device-pairing-approval-DyoNg7Fe.mjs";
import "./device-bootstrap-oFZT97Lm.mjs";
//#region src/plugin-sdk/device-bootstrap.ts
const resolvePairingGatewayUrl = createLazyRuntimeMethod(() => import("./setup-code-_g8bwewu.mjs"), (pairing) => pairing.resolvePairingGatewayUrl);
//#endregion
export { resolvePairingGatewayUrl as t };
