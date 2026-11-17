"use client";
// Loads the store's tracking tags (get-pixel-config) as soon as the page loads.
// Never waits for scroll/click. Script tags are re-created so the browser executes them.
import { useEffect } from "react";
import { API_KEY, API_URL, TENANT_ID } from "@/lib/config";

let loaded = false;

export function PixelLoader() {
  useEffect(() => {
    if (loaded) return;
    loaded = true;
    fetch(`${API_URL}/get-pixel-config?tenant_id=${TENANT_ID}&page_type=${pageType()}`, {
      headers: { apikey: API_KEY },
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((res) => {
        const html: string | undefined = res?.data?.initialization?.html;
        const helper: string | undefined = res?.data?.helper_js;
        if (html) inject(html);
        if (helper) {
          const s = document.createElement("script");
          s.text = helper;
          document.head.appendChild(s);
        }
      })
      .catch(() => {});
  }, []);
  return null;
}

function pageType() {
  const p = location.pathname.split("/")[1] ?? "";
  return ({ product: "product", category: "category", quote: "cart" } as Record<string, string>)[p] ?? "home";
}

function inject(html: string) {
  const stage = document.createElement("div");
  stage.innerHTML = html;
  stage.querySelectorAll("script").forEach((old) => {
    const s = document.createElement("script");
    for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
    s.text = old.text;
    document.head.appendChild(s);
    old.remove();
  });
  Array.from(stage.childNodes).forEach((n) => document.head.appendChild(n));
}
