interface Document {
  id: string;
  url: string;
  title?: string;
  author?: string;
  source?: string;
  category: string;
  location: string;
  tags?: Tag[];
  site_name?: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  published_date: string;
  summary?: string;
  image_url?: string;
  content: null;
}

interface DocumentListResponse {
  count: number;
  nextPageCursor?: string;
  results: Document[];
}

interface ListParameters extends QueryParams {
  id?: string;
  location?: string;
  category?: string;
  pageCursor?: string;
}

interface Tag {
  name: string;
  type: string;
  created: number;
}

interface QueryParams {
  [key: string]: string | number | boolean;
}
