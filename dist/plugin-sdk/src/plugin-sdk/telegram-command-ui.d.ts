/**
 * Telegram command UI helpers exposed for plugin command pagination.
 */
/** Builds an inline keyboard row for paginated Telegram command listings. */
export declare function buildCommandsPaginationKeyboard(currentPage: number, totalPages: number, agentId?: string): Array<Array<{
    text: string;
    callback_data: string;
}>>;
