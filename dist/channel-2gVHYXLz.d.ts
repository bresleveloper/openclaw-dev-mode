import { t as BaseProbeResult } from "./types.core-DDKBE3_n.js";
import { t as ChannelPlugin } from "./types.plugin-DvEuFaxA.js";
import { t as ResolvedMatrixAccount } from "./accounts-C55Dx7wn.js";
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