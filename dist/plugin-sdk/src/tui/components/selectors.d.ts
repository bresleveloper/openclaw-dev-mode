import { type SelectItem, type SettingItem, SettingsList } from "@earendil-works/pi-tui";
import { FilterableSelectList, type FilterableSelectItem } from "./filterable-select-list.js";
import { SearchableSelectList } from "./searchable-select-list.js";
/** Creates a themed searchable select list for TUI overlays. */
export declare function createSearchableSelectList(items: SelectItem[], maxVisible?: number): SearchableSelectList;
/** Creates a themed filterable select list for TUI overlays. */
export declare function createFilterableSelectList(items: FilterableSelectItem[], maxVisible?: number): FilterableSelectList;
/** Creates a themed settings list with change and cancel callbacks. */
export declare function createSettingsList(items: SettingItem[], onChange: (id: string, value: string) => void, onCancel: () => void, maxVisible?: number): SettingsList;
