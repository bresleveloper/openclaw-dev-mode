import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-CYT6MDvz.mjs";
import { a as WIDGET_HTML_MAX_UTF8_BYTES } from "./canvas-CTYLqV3I.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/board.ts
const BoardTabIdSchema = Type.String({ pattern: "^[a-z0-9-]{1,40}$" });
const BoardWidgetNameSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetGeneratedIdentitySchema = closedObject({
	source: Type.Literal("show_widget"),
	key: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	fallbackName: BoardWidgetNameSchema
});
const BoardWidgetPluginKindSchema = Type.String({ pattern: "^[a-z0-9][a-z0-9-]{0,63}:[a-z0-9][a-z0-9._-]{0,63}$" });
const BoardWidgetPluginPropsSchema = Type.Record(Type.String(), Type.Unknown());
const BoardChatDockSchema = Type.Union([
	Type.Literal("left"),
	Type.Literal("right"),
	Type.Literal("bottom"),
	Type.Literal("hidden")
]);
const BoardSizeSchema = Type.Union([
	Type.Literal("sm"),
	Type.Literal("md"),
	Type.Literal("lg"),
	Type.Literal("xl"),
	Type.Literal("full")
]);
const BoardWidgetPresentationSchema = Type.Union([
	Type.Literal("card"),
	Type.Literal("full-bleed"),
	Type.Literal("frameless")
]);
const BoardWidgetHeightModeSchema = Type.Union([Type.Literal("auto"), Type.Literal("fixed")]);
const BOARD_CRON_JOB_ID_MAX_LENGTH = 256;
const BOARD_CRON_TRIGGER_PREFIX = "cron.trigger:";
const BOARD_WIDGET_TOOL_MAX_LENGTH = 269;
const BOARD_DATA_BINDING_ID_MAX_LENGTH = 64;
const BoardTabSchema = closedObject({
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	position: Type.Integer({ minimum: 0 }),
	chatDock: BoardChatDockSchema
});
const BoardWidgetDeclaredSchema = closedObject({
	netOrigins: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 2048
	}), { maxItems: 32 })),
	tools: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 269
	}), { maxItems: 64 }))
});
const BoardWidgetSchema = closedObject({
	name: BoardWidgetNameSchema,
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	contentKind: Type.Union([
		Type.Literal("html"),
		Type.Literal("mcp-app"),
		Type.Literal("plugin")
	]),
	contentOwner: Type.Optional(Type.Enum([
		"html",
		"mcp-app",
		"plugin",
		"registered"
	], { type: "string" })),
	registeredContentKind: Type.Optional(Type.String({ pattern: "^[a-z][a-z0-9-]{0,31}$" })),
	pluginKind: Type.Optional(BoardWidgetPluginKindSchema),
	props: Type.Optional(BoardWidgetPluginPropsSchema),
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	sizeW: Type.Integer({
		minimum: 1,
		maximum: 12
	}),
	sizeH: Type.Integer({
		minimum: 1,
		maximum: 20
	}),
	position: Type.Integer({ minimum: 0 }),
	grantState: Type.Union([
		Type.Literal("none"),
		Type.Literal("pending"),
		Type.Literal("granted"),
		Type.Literal("rejected")
	]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: Type.Optional(NonEmptyString),
	declaredSummary: Type.Optional(Type.Array(Type.String())),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	frameUrl: Type.Optional(Type.String()),
	viewTicket: Type.Optional(Type.String()),
	viewTicketTtlMs: Type.Optional(Type.Integer({ minimum: 1 })),
	viewGeneration: Type.Optional(Type.String({ pattern: "^[a-f0-9]{32}$" })),
	sandboxUrl: Type.Optional(Type.String()),
	sandboxPort: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 65535
	})),
	sandboxOrigin: Type.Optional(Type.String()),
	kindLabel: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	}))
});
const BoardSnapshotFields = {
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	tabs: Type.Array(BoardTabSchema),
	widgets: Type.Array(BoardWidgetSchema)
};
const BoardSnapshotSchema = closedObject(BoardSnapshotFields);
const BoardTabCreateOpSchema = closedObject({
	kind: Type.Literal("tab_create"),
	tabId: BoardTabIdSchema,
	title: Type.String({
		minLength: 1,
		maxLength: 80
	}),
	chatDock: Type.Optional(BoardChatDockSchema)
});
const BoardTabUpdateOpSchema = closedObject({
	kind: Type.Literal("tab_update"),
	tabId: BoardTabIdSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	chatDock: Type.Optional(BoardChatDockSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 }))
});
const BoardTabDeleteOpSchema = closedObject({
	kind: Type.Literal("tab_delete"),
	tabId: BoardTabIdSchema
});
const BoardTabsReorderOpSchema = closedObject({
	kind: Type.Literal("tabs_reorder"),
	tabIds: Type.Array(BoardTabIdSchema)
});
const BoardWidgetMoveOpSchema = closedObject({
	kind: Type.Literal("widget_move"),
	name: BoardWidgetNameSchema,
	tabId: Type.Optional(BoardTabIdSchema),
	position: Type.Optional(Type.Integer({ minimum: 0 })),
	after: Type.Optional(BoardWidgetNameSchema)
});
const BoardWidgetResizeOpSchema = closedObject({
	kind: Type.Literal("widget_resize"),
	name: BoardWidgetNameSchema,
	sizeW: Type.Integer(),
	sizeH: Type.Integer(),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema)
});
const BoardWidgetRemoveOpSchema = closedObject({
	kind: Type.Literal("widget_remove"),
	name: BoardWidgetNameSchema
});
const BoardOpSchema = Type.Union([
	BoardTabCreateOpSchema,
	BoardTabUpdateOpSchema,
	BoardTabDeleteOpSchema,
	BoardTabsReorderOpSchema,
	BoardWidgetMoveOpSchema,
	BoardWidgetResizeOpSchema,
	BoardWidgetRemoveOpSchema
]);
const BoardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
const BoardUpdateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ops: Type.Array(BoardOpSchema)
});
const BoardMcpAppDescriptorSchema = closedObject({
	serverName: NonEmptyString,
	toolName: NonEmptyString,
	uiResourceUri: NonEmptyString,
	toolCallId: NonEmptyString
});
const BoardWidgetHtmlContentSchema = closedObject({
	kind: Type.Literal("html"),
	html: Type.String({ maxLength: WIDGET_HTML_MAX_UTF8_BYTES })
});
const BoardWidgetMcpAppContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	descriptor: BoardMcpAppDescriptorSchema
});
const BoardWidgetMcpAppPutContentSchema = closedObject({
	kind: Type.Literal("mcp-app"),
	viewId: NonEmptyString
});
const BoardWidgetPluginContentSchema = closedObject({
	kind: Type.Literal("plugin"),
	pluginKind: BoardWidgetPluginKindSchema,
	props: Type.Optional(BoardWidgetPluginPropsSchema)
});
const BoardWidgetRegisteredContentSchema = closedObject({
	kind: Type.Literal("registered"),
	contentKind: Type.String({ pattern: "^[a-z][a-z0-9-]{0,31}$" }),
	source: Type.String({ maxLength: 262144 })
});
const BoardWidgetContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppContentSchema,
	BoardWidgetPluginContentSchema,
	BoardWidgetRegisteredContentSchema
]);
const BoardCanvasDocumentSourceSchema = closedObject({
	kind: Type.Literal("canvas-doc"),
	docId: NonEmptyString
});
const BoardWidgetPutContentSchema = Type.Union([
	BoardWidgetHtmlContentSchema,
	BoardWidgetMcpAppPutContentSchema,
	BoardWidgetPluginContentSchema,
	BoardWidgetRegisteredContentSchema,
	BoardCanvasDocumentSourceSchema
]);
const BoardWidgetPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	title: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 80
	})),
	content: BoardWidgetPutContentSchema,
	presentation: Type.Optional(BoardWidgetPresentationSchema),
	heightMode: Type.Optional(BoardWidgetHeightModeSchema),
	placement: Type.Optional(closedObject({
		tabId: Type.Optional(BoardTabIdSchema),
		size: Type.Optional(BoardSizeSchema),
		after: Type.Optional(BoardWidgetNameSchema)
	})),
	declared: Type.Optional(BoardWidgetDeclaredSchema),
	generatedIdentity: Type.Optional(BoardWidgetGeneratedIdentitySchema)
});
const BoardWidgetPutResultSchema = closedObject({
	...BoardSnapshotFields,
	resolvedWidgetName: BoardWidgetNameSchema
});
const BoardWidgetGrantParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	decision: Type.Union([Type.Literal("granted"), Type.Literal("rejected")]),
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	name: BoardWidgetNameSchema,
	revision: Type.Integer({ minimum: 1 }),
	instanceId: NonEmptyString
});
const BoardWidgetAppViewResultSchema = closedObject({
	viewId: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const BoardViewTicketSchema = Type.String({
	minLength: 1,
	maxLength: 2048
});
const BoardLegacyEventParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	widget: BoardWidgetNameSchema,
	payload: Type.Unknown()
});
const BoardTicketEventParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	payload: Type.Unknown()
});
const BoardEventParamsSchema = Type.Union([BoardLegacyEventParamsSchema, BoardTicketEventParamsSchema]);
const BoardPromptAuthorizeParamsSchema = closedObject({ ticket: BoardViewTicketSchema });
const BoardDataReadParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	bindingId: Type.String({
		minLength: 1,
		maxLength: 64
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardCronActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.Literal("cron.trigger"),
	jobId: Type.String({
		minLength: 1,
		maxLength: 256
	})
});
const BoardPluginActionParamsSchema = closedObject({
	ticket: BoardViewTicketSchema,
	action: Type.String({
		minLength: 1,
		maxLength: 269
	}),
	params: Type.Optional(Type.Record(Type.String({
		minLength: 1,
		maxLength: 80
	}), Type.Unknown(), { maxProperties: 64 }))
});
const BoardActionParamsSchema = Type.Union([BoardCronActionParamsSchema, BoardPluginActionParamsSchema]);
const BoardChangedEventSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 0 }),
	widget: Type.Optional(BoardWidgetNameSchema)
});
const BoardFocusTabCommandSchema = closedObject({
	kind: Type.Literal("focus_tab"),
	tabId: BoardTabIdSchema
});
const BoardSetChatDockCommandSchema = closedObject({
	kind: Type.Literal("set_chat_dock"),
	dock: BoardChatDockSchema
});
const BoardCommandSchema = Type.Union([BoardFocusTabCommandSchema, BoardSetChatDockCommandSchema]);
const BoardCommandEventSchema = closedObject({
	sessionKey: NonEmptyString,
	command: BoardCommandSchema
});
//#endregion
export { BoardWidgetRemoveOpSchema as $, BoardTicketEventParamsSchema as A, BoardWidgetHtmlContentSchema as B, BoardSnapshotSchema as C, BoardTabSchema as D, BoardTabIdSchema as E, BoardWidgetContentSchema as F, BoardWidgetPluginContentSchema as G, BoardWidgetMcpAppPutContentSchema as H, BoardWidgetDeclaredSchema as I, BoardWidgetPresentationSchema as J, BoardWidgetPluginKindSchema as K, BoardWidgetGeneratedIdentitySchema as L, BoardViewTicketSchema as M, BoardWidgetAppViewParamsSchema as N, BoardTabUpdateOpSchema as O, BoardWidgetAppViewResultSchema as P, BoardWidgetRegisteredContentSchema as Q, BoardWidgetGrantParamsSchema as R, BoardSizeSchema as S, BoardTabDeleteOpSchema as T, BoardWidgetMoveOpSchema as U, BoardWidgetMcpAppContentSchema as V, BoardWidgetNameSchema as W, BoardWidgetPutParamsSchema as X, BoardWidgetPutContentSchema as Y, BoardWidgetPutResultSchema as Z, BoardMcpAppDescriptorSchema as _, BoardActionParamsSchema as a, BoardPromptAuthorizeParamsSchema as b, BoardChatDockSchema as c, BoardCronActionParamsSchema as d, BoardWidgetResizeOpSchema as et, BoardDataReadParamsSchema as f, BoardLegacyEventParamsSchema as g, BoardGetParamsSchema as h, BOARD_WIDGET_TOOL_MAX_LENGTH as i, BoardUpdateParamsSchema as j, BoardTabsReorderOpSchema as k, BoardCommandEventSchema as l, BoardFocusTabCommandSchema as m, BOARD_CRON_TRIGGER_PREFIX as n, BoardCanvasDocumentSourceSchema as o, BoardEventParamsSchema as p, BoardWidgetPluginPropsSchema as q, BOARD_DATA_BINDING_ID_MAX_LENGTH as r, BoardChangedEventSchema as s, BOARD_CRON_JOB_ID_MAX_LENGTH as t, BoardWidgetSchema as tt, BoardCommandSchema as u, BoardOpSchema as v, BoardTabCreateOpSchema as w, BoardSetChatDockCommandSchema as x, BoardPluginActionParamsSchema as y, BoardWidgetHeightModeSchema as z };
