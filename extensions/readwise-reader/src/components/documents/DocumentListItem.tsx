import { List, ActionPanel, Action, Icon, Color } from "@raycast/api";

type DocumentListItemProps = {
  document: Document;
};

export default function DocumentListItem({ document }: DocumentListItemProps) {
  function accessories(document: Document): List.Item.Accessory[] {
    return Object.values(document.tags ?? {}).map(listItem);
  }

  function keywords(document: Document): string[] {
    return [document.title, document.author ?? "", document.url ?? ""];
  }

  function listItem(tag: Tag): List.Item.Accessory {
    return { tag: { value: tag.name, color: Color.Green } };
  }

  return (
    <List.Item
      key={document.id}
      title={document.title ?? "Untitled"}
      subtitle={document.author}
      actions={
        <ActionPanel>
          {document.url && <Action.OpenInBrowser url={document.url} />}
          {document.url && <Action.CopyToClipboard title="Copy URL" content={document.url} />}
        </ActionPanel>
      }
      accessories={accessories(document)}
      keywords={keywords(document)}
    />
  );
}
