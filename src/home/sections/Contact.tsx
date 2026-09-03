"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { person } from "@/data/resume";
import { socials } from "../content";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  return (
    <section id="contact" className="hx-section hx-contact">
      <div className="hx-container">
        <p className="hx-eyebrow">Let&apos;s Talk</p>

        <motion.h2
          className="hx-contact__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Let&apos;s build something
          <span className="hx-contact__grad"> intelligent.</span>
        </motion.h2>

        <p className="hx-contact__lead">
          Open to roles and collaborations where AI meets real products. If you&apos;re hiring or
          have an idea worth shipping, my inbox is open.
        </p>

        <ul className="hx-contact__links">
          {socials.map((s) => (
            <li key={s.id}>
              <a
                className="hx-contact__link"
                href={s.href}
                target={s.external ? "_blank" : undefined}
                rel={s.external ? "noopener noreferrer" : undefined}
              >
                <span className="hx-contact__linklabel">{s.label}</span>
                <span className="hx-contact__linkvalue">
                  {s.value}
                  <ArrowUpRight size={16} strokeWidth={2} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <footer className="hx-footer">
          <span>© {new Date().getFullYear()} {person.name}</span>
          <span className="hx-footer__note">Designed &amp; built from scratch — no templates.</span>
          <button type="button" className="hx-footer__top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top ↑
          </button>
        </footer>
      </div>
    </section>
  );
}
