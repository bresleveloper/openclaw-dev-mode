/** Merges imported CLI transcript messages into local history without duplicating overlaps. */
export declare function mergeImportedChatHistoryMessages(params: {
    localMessages: unknown[];
    importedMessages: unknown[];
}): unknown[];
