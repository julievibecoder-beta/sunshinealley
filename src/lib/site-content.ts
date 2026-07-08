import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  defaultSiteContent,
  mergeSiteContent,
  type SiteContent,
  type TrustItem,
  type Testimonial,
  type TimelineItem,
  type SpotlightItem,
  type AboutCard,
  type AboutIcon,
  type SeoMeta,
  type HeritagePage,
  type AboutPage,
  type ContactPage,
} from "./site-content-defaults";
import {
  getSiteContentFn,
  saveSiteContentFn,
  resetSiteContentFn,
} from "./site-content.functions";

export type {
  SiteContent,
  TrustItem,
  Testimonial,
  TimelineItem,
  SpotlightItem,
  AboutCard,
  AboutIcon,
  SeoMeta,
  HeritagePage,
  AboutPage,
  ContactPage,
};
export { defaultSiteContent };

const KEY = ["site-content"] as const;
const EVENT = "kc-store-change";
const isClient = typeof window !== "undefined";

let cache: SiteContent = defaultSiteContent;

async function fetchSiteContent(): Promise<SiteContent> {
  const data = await getSiteContentFn();
  cache = mergeSiteContent(data);
  return cache;
}

export function loadSiteContent(): SiteContent {
  return cache;
}

export function useSiteContent(): SiteContent {
  const { data } = useQuery({
    queryKey: KEY,
    queryFn: fetchSiteContent,
    placeholderData: cache,
    staleTime: 30_000,
  });
  return data ?? cache;
}

function broadcast() {
  if (isClient) window.dispatchEvent(new Event(EVENT));
}

export async function saveSiteContent(c: SiteContent) {
  await saveSiteContentFn({ data: { content: c } });
  cache = await fetchSiteContent();
  broadcast();
}

export async function resetSiteContent() {
  await resetSiteContentFn();
  cache = await fetchSiteContent();
  broadcast();
}

// Bridge: invalidate site-content query when broadcast fires.
let _qc: ReturnType<typeof useQueryClient> | null = null;
function _bridge() {
  if (_qc) _qc.invalidateQueries({ queryKey: KEY });
}
export function useSiteContentRefreshBridge() {
  const qc = useQueryClient();
  _qc = qc;
  if (isClient) {
    window.removeEventListener(EVENT, _bridge);
    window.addEventListener(EVENT, _bridge);
  }
  return null;
}
