import React from "react";
import Reveal from "./Reveal";
import { ScrambleHover } from "../fx/Scramble";

const pad = (n: number) => String(n).padStart(2, "0");

type Props = {
  id: string;
  index: number;
  total: number;
  label: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Editorial section: a small sticky index/label column on the left and the
 * content on the right, separated from the previous section by a hairline.
 */
export default function Section({ id, index, total, label, title, intro, children }: Props) {
  return (
    <section id={id} className="scroll-mt-16 border-t hairline py-20 md:py-28">
      <div className="wrap grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-28 md:self-start">
          <p className="label flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-accent-500" aria-hidden="true" />
            {pad(index)} / {pad(total)}
          </p>
          <ScrambleHover as="p" text={label} className="mt-3 w-fit cursor-default text-sm font-medium text-ink" />
          {intro && <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">{intro}</p>}
        </aside>
        <div className="min-w-0">
          {title && (
            <Reveal>
              <h2 className="h-display mb-10 text-3xl leading-[1.05] md:mb-14 md:text-5xl">{title}</h2>
            </Reveal>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
