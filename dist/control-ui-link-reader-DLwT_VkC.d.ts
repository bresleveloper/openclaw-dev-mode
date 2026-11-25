import { Type } from "typebox";
declare const ControlUiLinkReaderDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  id: Type.TString;
  label: Type.TString;
  /** Existing Control UI icon name; unknown names use the generic link icon. */
  icon: Type.TOptional<Type.TString>;
  linkReader: Type.TObject<{
    /** Exact lowercase DNS hostnames; no schemes, ports, or wildcards. */
    hosts: Type.TArray<Type.TString>;
    /** Anchored pathname regular expression authored by the installed trusted plugin. */
    pathPattern: Type.TString;
    /** Same-plugin gateway method requiring operator.read. */
    detailMethod: Type.TString;
    previewMethod: Type.TOptional<Type.TString>;
    /** Optional same-plugin read method resolving inline images without browser CORS. */
    imageMethod: Type.TOptional<Type.TString>;
    /** Forward this pane's session key; the receiving owner still authorizes every read. */
    sessionScoped: Type.TOptional<Type.TBoolean>;
    /** Supports overview-first detail requests with independently loaded sections. */
    progressive: Type.TOptional<Type.TBoolean>;
  }>;
}>;
export { ControlUiLinkReaderDescriptorSchema as t };