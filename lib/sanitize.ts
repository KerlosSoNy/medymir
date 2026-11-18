// Cleans rich text from TheCoins (CMS texts, product descriptions) before it is put on the page.
// Uses `xss` (pure JavaScript, no browser emulation), so it runs everywhere, including Vercel's servers,
// where the previous jsdom-based cleaner crashed every page built on request.
// Only the usual rich-text tags are kept; scripts, styles, event handlers and javascript: links are removed.
import { FilterXSS } from "xss";

const text = ["class"];
const filter = new FilterXSS({
  whiteList: {
    p: text,
    br: [],
    hr: [],
    span: text,
    div: text,
    strong: [],
    b: [],
    em: [],
    i: [],
    u: [],
    s: [],
    small: [],
    sub: [],
    sup: [],
    code: [],
    pre: [],
    blockquote: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    ul: [],
    ol: [],
    li: [],
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    table: [],
    thead: [],
    tbody: [],
    tr: [],
    th: [],
    td: [],
  },
  stripIgnoreTag: true, // unknown tags are removed (their text is kept)
  stripIgnoreTagBody: ["script", "style"], // …except these, whose content is removed too
});

/** Safe HTML for dangerouslySetInnerHTML. */
export function sanitize(html: string): string {
  return filter.process(html ?? "");
}
