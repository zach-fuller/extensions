import fetch from "node-fetch";
import { useQueryParams } from "./query";
import { useDefaultHeaders } from "./headers";

const API_BASE = "https://readwise.io/api/v3";
enum Endpoint {
  List = "/list",
}

export async function fetchDocuments(params: ListParameters, documents: Document[] = []): Promise<Document[]> {
  const response = await request(Endpoint.List, params);

  if (!response.nextPageCursor) {
    return documents.concat(response.results);
  }

  params = { ...params, pageCursor: response.nextPageCursor };
  return await fetchDocuments(params, documents.concat(response.results));
}

async function request(endpoint: Endpoint, params: QueryParams) {
  const url = API_BASE + endpoint.toString();
  const response = await fetch(useQueryParams(url, params), {
    headers: useDefaultHeaders(),
  });

  return (await response.json()) as DocumentListResponse;
}
