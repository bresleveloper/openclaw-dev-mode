import type { ServerResponse } from "node:http";
/** Minimal ServerResponse double for route tests that inspect headers and body. */
export declare function createMockServerResponse(): ServerResponse & {
    body?: string;
};
