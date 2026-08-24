import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Armchair,
  Building2,
  CalendarDays,
  Dna,
  FileBarChart2,
  Info,
  LayoutDashboard,
  Menu,
  Upload,
  UserCheck,
  X,
} from "lucide-react";
import logo from "@/assets/vcet-logo.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AboutSection,
  DashboardSection,
  GaSection,
  HallSection,
  InvigilatorSection,
  ReportsSection,
  SeatingSection,
  TimetableSection,
} from "@/components/exam/sections";
import { UploadSection } from "@/components/exam/upload";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VCET Smart Examination Management System" },
      {
        name: "description",
        content:
          "Genetic Algorithm powered examination timetable, hall, invigilator and seating management dashboard for VCET AI & Data Science.",
      },
      { property: "og:title", content: "VCET Smart Examination Management System" },
      {
        property: "og:description",
        content:
          "University examination timetable scheduler using Genetic Algorithm — timetable, halls, invigilators, seating and reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "upload", label: "Upload Data", icon: Upload },
  { key: "timetable", label: "Generate Timetable", icon: CalendarDays },
  { key: "halls", label: "Hall Allocation", icon: Building2 },
  { key: "invigilators", label: "Invigilator Allocation", icon: UserCheck },
  { key: "seating", label: "Seating Arrangement", icon: Armchair },
  { key: "ga", label: "Genetic Algorithm", icon: Dna },
  { key: "reports", label: "Reports", icon: FileBarChart2 },
  { key: "about", label: "About Project", icon: Info },
] as const;

type MenuKey = (typeof MENU)[number]["key"];

function Index() {
  const [active, setActive] = useState<MenuKey>("dashboard");
  const [open, setOpen] = useState(false);

  const sections: Record<MenuKey, React.ReactNode> = {
    dashboard: <DashboardSection />,
    upload: <UploadSection />,
    timetable: <TimetableSection />,
    halls: <HallSection />,
    invigilators: <InvigilatorSection />,
    seating: <SeatingSection />,
    ga: <GaSection />,
    reports: <ReportsSection />,
    about: <AboutSection />,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-header-gradient text-primary-foreground">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-5 sm:px-6">
          <button
            className="rounded-lg p-2 hover:bg-primary-foreground/10 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <img
            src={logo}
            alt="Velalar College of Engineering and Technology emblem"
            width={512}
            height={512}
            className="size-14 shrink-0 rounded-full bg-primary-foreground/95 p-1 sm:size-16"
          />
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold uppercase tracking-wide sm:text-xl">
              Velalar College of Engineering and Technology
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] opacity-80">(Autonomous)</p>
            <p className="mt-1 font-display text-sm font-semibold sm:text-lg">
              VCET Smart Examination Management System
            </p>
            <p className="text-xs opacity-85">
              University Examination Timetable Scheduler Using Genetic Algorithm
            </p>
          </div>
          <div className="ml-auto hidden text-right text-xs opacity-85 xl:block">
            <p className="font-semibold">Department of Artificial Intelligence and Data Science</p>
            <p>Examination Cell · Odd Semester 2026</p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-0 px-0 sm:px-6">
        <aside
          className={cn(
            "fixed inset-x-0 top-0 z-40 h-full overflow-y-auto bg-sidebar p-4 text-sidebar-foreground transition-transform duration-300 lg:sticky lg:top-6 lg:mt-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:rounded-2xl",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <span className="font-display text-sm font-semibold">Navigation</span>
            <button onClick={() => setOpen(false)} aria-label="Close navigation">
              <X className="size-5" />
            </button>
          </div>
          <p className="px-3 pb-3 text-[11px] uppercase tracking-[0.2em] text-sidebar-foreground/60">
            Menu
          </p>
          <nav className="space-y-1">
            {MENU.map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setActive(m.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active === m.key
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/85 hover:translate-x-1 hover:bg-sidebar-accent",
                )}
              >
                <m.icon className="size-4 shrink-0" />
                {m.label}
              </button>
            ))}
          </nav>
          <div className="mt-6 rounded-xl bg-sidebar-accent p-4 text-xs text-sidebar-accent-foreground/90">
            <p className="font-semibold">GA Engine Status</p>
            <p className="mt-1 opacity-80">Converged · Best fitness 96.4%</p>
            <Button
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                setActive("ga");
                setOpen(false);
              }}
            >
              View Evolution
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:pl-8">{sections[active]}</main>
      </div>

      <footer className="border-t border-border bg-card py-5 text-center text-xs text-muted-foreground">
        VCET Smart Examination Management System · Department of Artificial Intelligence and Data
        Science · Velalar College of Engineering and Technology (Autonomous)
      </footer>
    </div>
  );
}
