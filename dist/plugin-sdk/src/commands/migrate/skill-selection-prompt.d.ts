type MigrationSkillSelectionOption = {
    value: string;
    label?: string;
    hint?: string;
    disabled?: boolean;
};
/** Options for the migration selection prompt, including testable IO streams. */
type MigrationSkillSelectionPromptOptions = {
    message: string;
    options: MigrationSkillSelectionOption[];
    initialValues?: string[];
    maxItems?: number;
    required?: boolean;
    cursorAt?: string;
    input?: NodeJS.ReadStream;
    output?: NodeJS.WriteStream;
    signal?: AbortSignal;
    withGuide?: boolean;
    selectableValues: readonly string[];
};
/** Prompts for migration selection values and reconciles all/none/recommended shortcuts. */
export declare function promptMigrationSkillSelectionValues(opts: MigrationSkillSelectionPromptOptions): Promise<string[] | symbol | undefined>;
export {};
