import { useEffect } from "react";
import { WAVE_BACKGROUNDS } from "@/lib/data";

const LOGO_PATH = "/__psp__/logo.svg";

export default function PreloadAssets() {
  useEffect(() => {
    const hrefs = [...Object.values(WAVE_BACKGROUNDS), LOGO_PATH];
    const links: HTMLLinkElement[] = [];

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (origin) {
      const docHref = `${origin}/`;
      if (!document.querySelector(`link[rel="prefetch"][href="${docHref}"]`)) {
        const pf = document.createElement("link");
        pf.rel = "prefetch";
        pf.href = docHref;
        document.head.appendChild(pf);
        links.push(pf);
      }
    }

    for (const href of hrefs) {
      if (document.querySelector(`link[rel="preload"][href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      if (href.startsWith("http")) link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      for (const link of links) {
        link.remove();
      }
    };
  }, []);

  return null;
}
