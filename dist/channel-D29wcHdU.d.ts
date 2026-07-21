import { t as BaseProbeResult } from "./types.core-TwXPgPau.js";
import { t as ChannelPlugin } from "./types.plugin-DeFN_A48.js";
import { t as ResolvedMatrixAccount } from "./accounts-DjEvSAsU.js";
//#region extensions/matrix/src/matrix/probe.d.ts
type MatrixProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  userId?: string | null;
};
//#endregion
//#region extensions/matrix/src/channel.d.ts
declare const matrixPlugin: ChannelPlugin<ResolvedMatrixAccount, MatrixProbe>;
//#endregion
export { matrixPlugin as t };