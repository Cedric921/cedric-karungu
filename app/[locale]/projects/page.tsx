"use client";

import { Suspense } from "react";
import AllProjects from "../../../src/components/AllProjects";
import SiteShell from "../../../src/components/SiteShell";

export default function ProjectsPage() {
  return (
    <SiteShell>
      {/* useSearchParams (tag/type filters) needs a Suspense boundary for prerender */}
      <Suspense fallback={<div className="min-h-screen" />}>
        <AllProjects />
      </Suspense>
    </SiteShell>
  );
}
