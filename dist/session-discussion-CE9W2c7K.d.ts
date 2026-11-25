import { Static, Type } from "typebox";
declare const SessionDiscussionStateSchema: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
declare const SessionDiscussionInfoSchema: Type.TObject<{
  state: Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"available">, Type.TLiteral<"open">]>;
  embedUrl: Type.TOptional<Type.TString>;
  openUrl: Type.TOptional<Type.TString>;
}>;
type SessionDiscussionState = Static<typeof SessionDiscussionStateSchema>;
type SessionDiscussionInfo = Static<typeof SessionDiscussionInfoSchema>;
export { SessionDiscussionState as n, SessionDiscussionInfo as t };