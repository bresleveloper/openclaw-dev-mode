import type { OpenClawPluginHttpRouteMatch } from "./types.js";
type PluginHttpRouteLike = {
    path: string;
    match: OpenClawPluginHttpRouteMatch;
};
/** Finds the first existing route whose exact/prefix match space overlaps a candidate. */
export declare function findOverlappingPluginHttpRoute<T extends {
    path: string;
    match: OpenClawPluginHttpRouteMatch;
}>(routes: readonly T[], candidate: PluginHttpRouteLike): T | undefined;
export {};
