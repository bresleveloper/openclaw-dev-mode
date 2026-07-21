import { i as OpenClawConfig } from "../types.openclaw-B5gtuEn_.js";
import { i as MsgContext } from "../templating-Bl_fNKHX.js";

//#region src/link-understanding/apply.d.ts
type ApplyLinkUnderstandingResult = {
  outputs: string[];
  urls: string[];
};
/** Runs link understanding and folds successful outputs into the inbound context. */
declare function applyLinkUnderstanding(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
}): Promise<ApplyLinkUnderstandingResult>;
//#endregion
export { applyLinkUnderstanding };