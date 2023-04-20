import { List } from "@raycast/api";

export interface Filter {
  displayName: string;
  id: string;
}

export const FILTERS: Filter[] = [
  { displayName: "Articles", id: "article" },
  { displayName: "PDF", id: "pdf" },
  { displayName: "EPUB", id: "epub" },
  { displayName: "Tweets", id: "tweet" },
  { displayName: "Videos", id: "video" },
];

interface LibraryDropdownProps {
  filter: Filter;
  onFilterChange: (newValue: string) => void;
}

export default function LibraryDropdown({ filter, onFilterChange }: LibraryDropdownProps) {
  return (
    <List.Dropdown value={filter.displayName} onChange={onFilterChange} tooltip="Filter by content type">
      {FILTERS.map((filter) => {
        return <List.Dropdown.Item title={filter.displayName} value={filter.id} key={filter.id} />;
      })}
    </List.Dropdown>
  );
}
