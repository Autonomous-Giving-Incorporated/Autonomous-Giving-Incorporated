import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  OFFICIAL_PUBLIC_HTML_PAGES,
  ROBOTS_DISALLOW_PATHS,
  officialPublicSitemapEntries,
  officialPublicSitemapUrls,
  robotsSitemapUrl,
} from "../site-public.ts";
import { SITE_ORIGIN, absoluteSiteUrl } from "../site.ts";

const ROOT = new URL("../", import.meta.url);

const EXPECTED_OFFICIAL_URLS = [
  "https://autogive.app/",
  "https://autogive.app/legal",
  "https://autogive.app/legal/privacy",
  "https://autogive.app/legal/terms",
] as const;

const PAGE_SOURCE_BY_PATH: Record<string, string> = {
  "/": "app/layout.tsx",
  "/legal": "app/legal/page.tsx",
  "/legal/privacy": "app/legal/privacy/page.tsx",
  "/legal/terms": "app/legal/terms/page.tsx",
};

const PRIVATE_PAGE_SOURCES = {
  "/login": "app/login/page.tsx",
  "/admin": "app/admin/page.tsx",
} as const;

function readRepoFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, ROOT), "utf8");
}

describe("official public SEO surfaces", () => {
  it("lists exactly the official unique public HTML pages on the apex", () => {
    const urls = officialPublicSitemapUrls();
    assert.deepEqual(urls, [...EXPECTED_OFFICIAL_URLS]);
    assert.equal(OFFICIAL_PUBLIC_HTML_PAGES.length, EXPECTED_OFFICIAL_URLS.length);
    assert.equal(SITE_ORIGIN, "https://autogive.app");
    assert.equal(absoluteSiteUrl(), "https://autogive.app/");
  });

  it("keeps sitemap locs on https://autogive.app and excludes private hosts", () => {
    for (const url of officialPublicSitemapUrls()) {
      assert.match(url, /^https:\/\/autogive\.app(?:\/|$)/);
      assert.doesNotMatch(url, /www\.autogive\.app/);
      assert.doesNotMatch(url, /vercel\.app/);
      assert.doesNotMatch(url, /github\.io/);
    }
  });

  it("builds sitemap entries from the official page list", () => {
    const entries = officialPublicSitemapEntries();
    assert.deepEqual(
      entries.map((entry) => entry.url),
      [...EXPECTED_OFFICIAL_URLS],
    );
    const sitemapSource = readRepoFile("app/sitemap.ts");
    assert.match(sitemapSource, /officialPublicSitemapEntries/);
    assert.doesNotMatch(sitemapSource, /\/login|\/admin|\/workspace/);
  });

  it("does not list auth, admin, workspace, or PII-adjacent paths", () => {
    const urls = officialPublicSitemapUrls().join("\n");
    for (const path of ROBOTS_DISALLOW_PATHS) {
      assert.equal(
        urls.includes(path),
        false,
        `sitemap must not include ${path}`,
      );
    }
    assert.doesNotMatch(urls, /\/brand(?:\/|$)/);
    assert.doesNotMatch(urls, /\/portfolio-signals/);
    assert.doesNotMatch(urls, /\/impact-relay/);
  });

  it("allows crawlers, points Sitemap at the apex, and disallows private paths", () => {
    assert.equal(robotsSitemapUrl(), "https://autogive.app/sitemap.xml");
    const robotsSource = readRepoFile("app/robots.ts");
    assert.match(robotsSource, /userAgent:\s*["']\*["']/);
    assert.match(robotsSource, /allow:\s*["']\/["']/);
    assert.match(robotsSource, /ROBOTS_DISALLOW_PATHS/);
    assert.match(robotsSource, /robotsSitemapUrl/);
    for (const path of [
      "/login",
      "/admin",
      "/workspace",
      "/portfolio-signals/workspace",
      "/portfolio-signals/members",
      "/portfolio-signals/donor-impact",
      "/portfolio-signals/finance-impact",
      "/portfolio-signals/import-review",
    ]) {
      assert.ok(
        (ROBOTS_DISALLOW_PATHS as readonly string[]).includes(path),
        `robots must disallow ${path}`,
      );
    }
  });

  it("sets matching apex canonicals on official public HTML pages", () => {
    for (const [path, file] of Object.entries(PAGE_SOURCE_BY_PATH)) {
      const source = readRepoFile(file);
      const expected =
        path === "/" ? "absoluteSiteUrl()" : `absoluteSiteUrl("${path}")`;
      assert.match(
        source,
        new RegExp(
          `alternates:\\s*\\{\\s*canonical:\\s*${expected.replace(/[()]/g, "\\$&")}`,
        ),
        `${file} must canonical to ${absoluteSiteUrl(path)}`,
      );
    }
  });

  it("keeps parked login and admin shells noindex and canonical to the homepage", () => {
    for (const [path, file] of Object.entries(PRIVATE_PAGE_SOURCES)) {
      const source = readRepoFile(file);
      assert.match(source, /robots:\s*\{\s*index:\s*false/);
      assert.match(source, /alternates:\s*\{\s*canonical:\s*absoluteSiteUrl\(\)/);
      assert.doesNotMatch(
        source,
        new RegExp(`absoluteSiteUrl\\("${path.replace("/", "\\/")}"\\)`),
      );
    }
  });
});
