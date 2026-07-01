import { Type } from "typebox";
/**
 * Command catalog protocol schemas.
 *
 * Command entries describe native, skill, and plugin commands that clients can
 * render or route; limits keep command catalogs bounded for UI and transport.
 */
/** Maximum command display/name length accepted in catalog entries. */
export declare const COMMAND_NAME_MAX_LENGTH = 200;
/** Maximum command description length accepted in catalog entries. */
export declare const COMMAND_DESCRIPTION_MAX_LENGTH = 2000;
/** Maximum text aliases advertised for one command. */
export declare const COMMAND_ALIAS_MAX_ITEMS = 20;
/** Maximum declared arguments advertised for one command. */
export declare const COMMAND_ARGS_MAX_ITEMS = 20;
/** Maximum argument name length accepted in catalog entries. */
export declare const COMMAND_ARG_NAME_MAX_LENGTH = 200;
/** Maximum argument description length accepted in catalog entries. */
export declare const COMMAND_ARG_DESCRIPTION_MAX_LENGTH = 500;
/** Maximum static choices advertised for one argument. */
export declare const COMMAND_ARG_CHOICES_MAX_ITEMS = 50;
/** Maximum machine-readable choice value length. */
export declare const COMMAND_CHOICE_VALUE_MAX_LENGTH = 200;
/** Maximum user-facing choice label length. */
export declare const COMMAND_CHOICE_LABEL_MAX_LENGTH = 200;
/** Maximum commands returned by one catalog response. */
export declare const COMMAND_LIST_MAX_ITEMS = 500;
/** Source system that contributed a command. */
export declare const CommandSourceSchema: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
/** Surfaces where a command may be invoked. */
export declare const CommandScopeSchema: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
/** Coarse UI grouping for command catalog display. */
export declare const CommandCategorySchema: Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>;
/** Static argument choice shown to clients. */
export declare const CommandArgChoiceSchema: Type.TObject<{
    value: Type.TString;
    label: Type.TString;
}>;
/** One typed argument advertised for a command. */
export declare const CommandArgSchema: Type.TObject<{
    name: Type.TString;
    description: Type.TString;
    type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
    required: Type.TOptional<Type.TBoolean>;
    choices: Type.TOptional<Type.TArray<Type.TObject<{
        value: Type.TString;
        label: Type.TString;
    }>>>;
    dynamic: Type.TOptional<Type.TBoolean>;
}>;
/** One command catalog entry visible to clients. */
export declare const CommandEntrySchema: Type.TObject<{
    name: Type.TString;
    nativeName: Type.TOptional<Type.TString>;
    textAliases: Type.TOptional<Type.TArray<Type.TString>>;
    description: Type.TString;
    category: Type.TOptional<Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>>;
    source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
    scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
    acceptsArgs: Type.TBoolean;
    args: Type.TOptional<Type.TArray<Type.TObject<{
        name: Type.TString;
        description: Type.TString;
        type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
        required: Type.TOptional<Type.TBoolean>;
        choices: Type.TOptional<Type.TArray<Type.TObject<{
            value: Type.TString;
            label: Type.TString;
        }>>>;
        dynamic: Type.TOptional<Type.TBoolean>;
    }>>>;
}>;
/** Command catalog request filters. */
export declare const CommandsListParamsSchema: Type.TObject<{
    agentId: Type.TOptional<Type.TString>;
    provider: Type.TOptional<Type.TString>;
    scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>>;
    includeArgs: Type.TOptional<Type.TBoolean>;
}>;
/** Bounded command catalog response. */
export declare const CommandsListResultSchema: Type.TObject<{
    commands: Type.TArray<Type.TObject<{
        name: Type.TString;
        nativeName: Type.TOptional<Type.TString>;
        textAliases: Type.TOptional<Type.TArray<Type.TString>>;
        description: Type.TString;
        category: Type.TOptional<Type.TUnion<[Type.TLiteral<"session">, Type.TLiteral<"options">, Type.TLiteral<"status">, Type.TLiteral<"management">, Type.TLiteral<"media">, Type.TLiteral<"tools">, Type.TLiteral<"docks">]>>;
        source: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"skill">, Type.TLiteral<"plugin">]>;
        scope: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"native">, Type.TLiteral<"both">]>;
        acceptsArgs: Type.TBoolean;
        args: Type.TOptional<Type.TArray<Type.TObject<{
            name: Type.TString;
            description: Type.TString;
            type: Type.TUnion<[Type.TLiteral<"string">, Type.TLiteral<"number">, Type.TLiteral<"boolean">]>;
            required: Type.TOptional<Type.TBoolean>;
            choices: Type.TOptional<Type.TArray<Type.TObject<{
                value: Type.TString;
                label: Type.TString;
            }>>>;
            dynamic: Type.TOptional<Type.TBoolean>;
        }>>>;
    }>>;
}>;
