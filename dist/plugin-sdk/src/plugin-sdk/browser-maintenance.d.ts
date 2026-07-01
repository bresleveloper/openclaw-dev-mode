export { movePathToTrash, type MovePathToTrashOptions } from "./browser-trash.js";
type CloseTrackedBrowserTabsParams = {
    sessionKeys: Array<string | undefined>;
    closeTab?: (tab: {
        targetId: string;
        baseUrl?: string;
        profile?: string;
    }) => Promise<void>;
    onWarn?: (message: string) => void;
};
/** Closes tracked browser tabs for requested session keys when the browser plugin is active. */
export declare function closeTrackedBrowserTabsForSessions(params: CloseTrackedBrowserTabsParams): Promise<number>;
