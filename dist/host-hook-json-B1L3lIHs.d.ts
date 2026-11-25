/** Bounded JSON value shape accepted from plugin hooks. */
type PluginJsonValue = string | number | boolean | null | PluginJsonValue[] | {
  [key: string]: PluginJsonValue;
};
export { PluginJsonValue as t };