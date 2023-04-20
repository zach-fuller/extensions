interface QueryParams {
  [key: string]: string | number | boolean;
}

export function useQueryParams(url: string, queryParams: QueryParams) {
  // @ts-expect-error: Don’t know how to satify URLSearchParams’s type.
  return url + "?" + new URLSearchParams(queryParams);
}
