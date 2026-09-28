"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icons } from "../constants";
import type { ProjectView } from "../lib/public-data";

export default function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: ProjectView | null;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!project) return;
    setActiveImage(0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project || typeof document === "undefined") return null;
  const images = project.gallery.length ? project.gallery : project.image ? [project.image] : [];
  const content = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-950 md:grid-cols-[1.2fr_0.8fr]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-md bg-black/60 text-white"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="flex min-h-0 flex-col bg-zinc-100 dark:bg-black">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={project.title} className="max-h-[62dvh] w-full object-contain" />
            ) : (
              <div className="p-12 text-sm text-zinc-500">No project images</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${activeImage === index ? "border-accent-500" : "border-transparent"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="overflow-y-auto p-6 sm:p-8">
          <p className="eyebrow mb-3 text-xs">{project.category}</p>
          <h2 id="project-dialog-title" className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">{project.title}</h2>
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.description}</p>
          {project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700 dark:bg-white/10 dark:text-zinc-200">{tag}</span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {project.link !== "#" && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2.5 text-sm font-medium text-white">
                Live project <Icons.ExternalLink />
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-800 dark:border-white/20 dark:text-white">
                GitHub <Icons.Github />
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  return createPortal(content, document.body);
}