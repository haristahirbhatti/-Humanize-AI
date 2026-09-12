export interface RecentDocument {
  id: string;
  createdAt: number;
  originalText: string;
  humanizedText: string;
  style: string;
  strength: string;
  naturalness: number;
}

const KEY = "humanize-ai-recent-documents";
const MAX_ITEMS = 10;

export function getRecentDocuments(): RecentDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentDocument[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentDocument(doc: RecentDocument) {
  if (typeof window === "undefined") return;
  const existing = getRecentDocuments();
  const updated = [doc, ...existing].slice(0, MAX_ITEMS);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // localStorage full or unavailable — fail silently, this is a nice-to-have
  }
}

export function clearRecentDocuments() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
