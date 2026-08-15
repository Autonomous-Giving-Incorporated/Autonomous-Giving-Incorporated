"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const links = [
  ["Platform", "#platform"],
  ["Proof", "#demo"],
  ["Signals", "#signals"],
  ["About", "#about"],
  ["Sign in", "/login"],
] as const;

const suiteLinks = [
  ["Portfolio Signals", "https://autogive.app/portfolio-signals/"],
  ["Impact Relay", "https://autogive.app/impact-relay/"],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="floating-nav" aria-label="Main navigation">
        <a
          className="brand focus-ring"
          href="#top"
          aria-label="Autonomously Giving Incorporated, home"
        >
          <Image
            className="brand-symbol"
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/agi-wordmark.png`}
            alt="Autonomously Giving Incorporated"
            width="1200"
            height="290"
          />
        </a>
        <div className="desktop-links">
          {links.map(([label, href]) => (
            <a className="nav-link focus-ring" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="suite-links" aria-label="AGI product suite">
          {suiteLinks.map(([label, href]) => (
            <a className="suite-link focus-ring" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <a className="nav-action focus-ring" href="#contact">
          Request demo
        </a>
        <button
          className="menu-toggle focus-ring"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
        {open ? (
          <div className="mobile-menu" id="mobile-navigation">
            {links.map(([label, href]) => (
              <a
                className="nav-link focus-ring"
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            {suiteLinks.map(([label, href]) => (
              <a
                className="nav-link suite-link focus-ring"
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              className="nav-link focus-ring"
              href="#contact"
              onClick={() => setOpen(false)}
            >
              Request demo
            </a>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
