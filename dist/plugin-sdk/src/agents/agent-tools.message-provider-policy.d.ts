/** Applies message-provider filtering while preserving duplicate tool entries. */
export declare function filterToolsByMessageProvider<TTool extends {
    name: string;
}>(tools: readonly TTool[], messageProvider?: string): TTool[];
