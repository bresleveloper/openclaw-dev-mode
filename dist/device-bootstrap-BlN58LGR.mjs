import { t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import "./device-bootstrap-profile-DQKf7Vz1.mjs";
import "./device-pairing-_Xo0MHGf.mjs";
import "./device-pairing-approval-JMglc3pN.mjs";
import "./device-bootstrap-FJ4oQdcl.mjs";
//#region src/plugin-sdk/device-bootstrap.ts
const resolvePairingGatewayUrl = createLazyRuntimeMethod(() => import("./setup-code-BxCvyjeP.mjs"), (pairing) => pairing.resolvePairingGatewayUrl);
//#endregion
export { resolvePairingGatewayUrl as t };
