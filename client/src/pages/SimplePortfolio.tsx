/*
 * Accessible “simple layout” — semantic structure without the handheld shell.
 */

import { useState, useEffect } from "react";
import { categories, OWNER } from "@/lib/data";
import { isSoundMuted, persistSoundMuted } from "@/lib/sound";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { ExternalLink } from "lucide-react";

const STORAGE_KEY = "psp-simple-layout";

export function readSimpleLayoutPref(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeSimpleLayoutPref(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export default function SimplePortfolio({
  onSwitchToHandheld,
  reduceMotion,
}: {
  onSwitchToHandheld: () => void;
  reduceMotion: boolean;
}) {
  const [catIdx, setCatIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [uiSoundMuted, setUiSoundMuted] = useState(() => isSoundMuted());
  const cat = categories[catIdx];
  const item = cat.items[itemIdx] ?? cat.items[0];

  useEffect(() => {
    setItemIdx(0);
  }, [catIdx]);

  const embed = item?.videoUrl ? getYoutubeEmbedUrl(item.videoUrl) : null;

  return (
    <div className="min-h-screen text-white bg-[#08081a]" id="simple-root">
      <a
        href="#simple-main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300] focus:px-3 focus:py-2 focus:bg-white focus:text-black rounded"
      >
        Skip to content
      </a>
      <header className="border-b border-white/10 bg-black/30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Portfolio</p>
            <h1 className="text-lg font-bold" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              {OWNER.name}
            </h1>
            <p className="text-sm text-white/55" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              {OWNER.title} · {OWNER.tagline}
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchToHandheld}
            className="text-[11px] px-3 py-2 rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d9dff]"
          >
            Handheld (PSP) view
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-6">
        <nav aria-label="Sections" className="sm:w-44 shrink-0">
          <ul className="space-y-1">
            {categories.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCatIdx(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/35 ${
                    i === catIdx ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/[0.05]"
                  }`}
                  style={i === catIdx ? { borderLeft: `3px solid ${c.color}` } : undefined}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main id="simple-main" className="flex-1 min-w-0 space-y-4">
          <section aria-labelledby="cat-heading">
            <h2 id="cat-heading" className="text-sm font-bold mb-2" style={{ color: cat.color }}>
              {cat.label}
            </h2>
            <ul className="space-y-1 mb-4">
              {cat.items.map((it, i) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => setItemIdx(i)}
                    className={`w-full text-left px-3 py-2 rounded-md text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      i === itemIdx ? "bg-white/10" : "hover:bg-white/[0.04] text-white/70"
                    }`}
                  >
                    {it.title}
                    {it.subtitle && <span className="block text-[10px] text-white/35">{it.subtitle}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {item && (
            <article
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              aria-labelledby="item-title"
            >
              <h3 id="item-title" className="text-base font-bold mb-1">
                {item.title}
              </h3>
              {item.subtitle && (
                <p className="text-[12px] text-white/45 mb-2" style={{ color: cat.color }}>
                  {item.subtitle}
                </p>
              )}
              {item.myRole && (
                <p className="text-[11px] text-white/55 mb-2">
                  <span className="text-white/35 font-semibold uppercase tracking-wide text-[10px]">
                    My role
                  </span>
                  <br />
                  {item.myRole}
                </p>
              )}
              {item.description && <p className="text-[12px] text-white/65 leading-relaxed mb-3">{item.description}</p>}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] border border-white/10 bg-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {embed && (
                <div
                  className="relative w-full rounded-lg overflow-hidden border border-white/10 mb-3"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <iframe
                    title={`${item.title} video`}
                    src={`${embed}?rel=0`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(item.demoUrl || item.websiteUrl)?.trim() && (
                  <a
                    href={(item.demoUrl || item.websiteUrl)!.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10"
                  >
                    Live demo <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.repoUrl?.trim() && (
                  <a
                    href={item.repoUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10"
                  >
                    Repository <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.link?.trim() && (
                  <a
                    href={item.link.trim()}
                    className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10"
                  >
                    Open link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {item.meta && (
                <dl className="mt-3 grid gap-2 text-[11px]">
                  {Object.entries(item.meta).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-white/35 inline font-semibold">{k}: </dt>
                      <dd className="text-white/60 inline">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          )}

          <section
            className="mt-8 pt-4 border-t border-white/10 space-y-3 text-[11px] text-white/45"
            aria-label="Tips and preferences"
          >
            <p className="leading-relaxed">
              With focus outside any text field, the arrow-key sequence (↑ ↑ ↓ ↓ ← → ← →) ending with{" "}
              <kbd className="px-1 rounded bg-white/10 border border-white/12">Enter</kbd> twice opens an
              extra panel (simple layout only).
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/40">UI sounds</span>
              <button
                type="button"
                onClick={() => {
                  const next = !uiSoundMuted;
                  persistSoundMuted(next);
                  setUiSoundMuted(next);
                }}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.06] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6d9dff]"
                aria-pressed={uiSoundMuted}
              >
                {uiSoundMuted ? "Muted" : "On"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
