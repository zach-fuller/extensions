import { List } from "@raycast/api";
import { fetchDocuments } from "./api/readwise";
import { useCachedPromise } from "@raycast/utils";
import DocumentListItem from "./components/documents/DocumentListItem";
import LibraryDropdown, { FILTERS } from "./components/library/LibraryDropdown";
import { useState } from "react";

export default function Command(): JSX.Element {
  const [filter, setFilter] = useState(FILTERS[0]);
  const { isLoading, data } = useCachedPromise(fetchDocuments, [{ category: filter.id }]);

  function onFilterChange(newValue: string) {
    setFilter(FILTERS.find((item) => item.id === newValue) || FILTERS[0]);
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search library"
      searchBarAccessory={<LibraryDropdown filter={filter} onFilterChange={onFilterChange} />}
    >
      {(data ?? []).map((document) => (
        <DocumentListItem document={document} key={document.id} />
      ))}
    </List>
  );
}
