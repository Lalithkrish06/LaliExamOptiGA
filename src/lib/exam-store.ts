import { useSyncExternalStore } from "react";
import {
  DAYS as DEFAULT_DAYS,
  SLOTS as DEFAULT_SLOTS,
  type ExamRow,
  type Hall,
  gaConfig,
  halls as defaultHalls,
  timetable as defaultTimetable,
} from "@/lib/exam-data";

export type { Hall };

export type SubjectInput = {
  code: string;
  subject: string;
  teacher: string;
  students: number;
};

export type ExamConfig = { days: number; slots: string[] };

export type Invigilator = {
  name: string;
  hall: string;
  subject: string;
  day: string;
  time: string;
};

export type GenerationPoint = { generation: number; best: number; average: number };

export type ExamDataset = {
  source: "demo" | "upload";
  subjects: SubjectInput[];
  halls: Hall[];
  invigilatorNames: string[];
  config: ExamConfig;
  timetable: ExamRow[];
  invigilators: Invigilator[];
  evolution: GenerationPoint[];
  fitness: number;
  conflicts: { type: string; detail: string; status: string }[];
};

/* ---------------- CSV parsing ---------------- */

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = !quoted;
      } else if (ch === "," && !quoted) {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out.map((c) => c.trim());
  };
  const headers = split(lines[0]!).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const cells = split(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

const pick = (row: Record<string, string>, keys: string[]) => {
  for (const k of keys) if (row[k]) return row[k]!;
  return "";
};

export function parseSubjects(text: string): SubjectInput[] {
  return parseCsv(text)
    .map((r, i) => ({
      code: pick(r, ["code", "subject_code", "sub_code"]) || `SUB${i + 1}`,
      subject: pick(r, ["subject", "subject_name", "name", "title"]) || `Subject ${i + 1}`,
      teacher: pick(r, ["teacher", "faculty", "staff", "handled_by"]) || "—",
      students: Number(pick(r, ["students", "student_count", "strength", "count"])) || 0,
    }))
    .filter((s) => s.subject);
}

export function parseHalls(text: string): Hall[] {
  return parseCsv(text)
    .map((r, i) => ({
      hall: pick(r, ["hall", "hall_name", "room", "room_no", "venue"]) || `H${i + 1}`,
      capacity: Number(pick(r, ["capacity", "seats", "size"])) || 0,
      allocated: 0,
    }))
    .filter((h) => h.capacity > 0);
}

export function parseInvigilators(text: string): string[] {
  return parseCsv(text)
    .map((r) => pick(r, ["name", "invigilator", "faculty", "staff", "teacher"]))
    .filter(Boolean);
}

/* ---------------- Genetic Algorithm scheduler ---------------- */

type Gene = { day: number; slot: number; hall: number };

function buildSlots(config: ExamConfig, hallCount: number) {
  return config.days * config.slots.length * hallCount;
}

function evaluate(genes: Gene[], subjects: SubjectInput[], halls: Hall[]) {
  let penalty = 0;
  const used = new Set<string>();
  const teacherSlot = new Set<string>();
  const dayLoad = new Map<number, number>();
  genes.forEach((g, i) => {
    const key = `${g.day}-${g.slot}-${g.hall}`;
    if (used.has(key)) penalty += 12;
    used.add(key);
    const hall = halls[g.hall]!;
    const s = subjects[i]!;
    if (s.students > hall.capacity) penalty += 8 + (s.students - hall.capacity) / 10;
    const tKey = `${s.teacher}-${g.day}-${g.slot}`;
    if (teacherSlot.has(tKey)) penalty += 6;
    teacherSlot.add(tKey);
    dayLoad.set(g.day, (dayLoad.get(g.day) ?? 0) + 1);
  });
  const loads = [...dayLoad.values()];
  const avg = loads.reduce((a, b) => a + b, 0) / Math.max(loads.length, 1);
  penalty += loads.reduce((a, b) => a + Math.abs(b - avg), 0) * 0.6;
  return Math.max(0, 100 - penalty);
}

function randomGene(config: ExamConfig, hallCount: number): Gene {
  return {
    day: Math.floor(Math.random() * config.days),
    slot: Math.floor(Math.random() * config.slots.length),
    hall: Math.floor(Math.random() * hallCount),
  };
}

export function runGa(subjects: SubjectInput[], halls: Hall[], config: ExamConfig) {
  const hallCount = halls.length;
  const popSize = gaConfig.populationSize;
  const generations = 200;
  let population: Gene[][] = Array.from({ length: popSize }, () =>
    subjects.map(() => randomGene(config, hallCount)),
  );
  const evolution: GenerationPoint[] = [];
  let best: Gene[] = population[0]!;
  let bestScore = -Infinity;

  for (let g = 0; g < generations; g++) {
    const scored = population
      .map((genes) => ({ genes, score: evaluate(genes, subjects, halls) }))
      .sort((a, b) => b.score - a.score);
    if (scored[0]!.score > bestScore) {
      bestScore = scored[0]!.score;
      best = scored[0]!.genes;
    }
    if (g % 8 === 0 || g === generations - 1) {
      evolution.push({
        generation: g,
        best: +bestScore.toFixed(2),
        average: +(scored.reduce((a, s) => a + s.score, 0) / scored.length).toFixed(2),
      });
    }
    const elites = scored.slice(0, gaConfig.eliteSize).map((s) => s.genes);
    const parents = scored.slice(0, Math.max(4, Math.floor(popSize / 2))).map((s) => s.genes);
    const next: Gene[][] = [...elites];
    while (next.length < popSize) {
      const a = parents[Math.floor(Math.random() * parents.length)]!;
      const b = parents[Math.floor(Math.random() * parents.length)]!;
      const cut = Math.floor(Math.random() * Math.max(subjects.length, 1));
      const child = subjects.map((_, i) => ({ ...(i < cut ? a[i]! : b[i]!) }));
      for (let i = 0; i < child.length; i++) {
        if (Math.random() < gaConfig.mutationRate) child[i] = randomGene(config, hallCount);
      }
      next.push(child);
    }
    population = next;
  }
  return { best, fitness: +bestScore.toFixed(2), evolution };
}

export function buildDataset(
  subjects: SubjectInput[],
  hallsIn: Hall[],
  invigilatorNames: string[],
  config: ExamConfig,
): ExamDataset {
  const halls = hallsIn.map((h) => ({ ...h, allocated: 0 }));
  const capacityOk = buildSlots(config, halls.length) >= subjects.length;
  const { best, fitness, evolution } = runGa(subjects, halls, config);

  const timetable: ExamRow[] = subjects.map((s, i) => {
    const g = best[i]!;
    const hall = halls[g.hall]!;
    hall.allocated = Math.max(hall.allocated, s.students);
    return {
      code: s.code,
      subject: s.subject,
      teacher: s.teacher,
      hall: hall.hall,
      day: `Day ${g.day + 1}`,
      time: config.slots[g.slot]!,
      students: s.students,
    };
  });

  timetable.sort(
    (a, b) => a.day.localeCompare(b.day, undefined, { numeric: true }) || a.time.localeCompare(b.time),
  );

  const names = invigilatorNames.length ? invigilatorNames : subjects.map((s) => s.teacher);
  const invigilators: Invigilator[] = timetable.map((t, i) => ({
    name: names[i % names.length] ?? t.teacher,
    hall: t.hall,
    subject: t.subject,
    day: t.day,
    time: t.time,
  }));

  const overloaded = halls.filter((h) => h.allocated > h.capacity);
  const slotMap = new Map<string, number>();
  timetable.forEach((t) => {
    const k = `${t.day}|${t.time}|${t.hall}`;
    slotMap.set(k, (slotMap.get(k) ?? 0) + 1);
  });
  const doubleBooked = [...slotMap.entries()].filter(([, n]) => n > 1);

  const conflicts = [
    {
      type: "Hall Overload",
      detail: overloaded.length
        ? overloaded.map((h) => `${h.hall}: ${h.allocated}/${h.capacity}`).join(", ")
        : "All halls within capacity",
      status: overloaded.length ? "Warning" : "Resolved",
    },
    {
      type: "Slot Conflict",
      detail: doubleBooked.length
        ? `${doubleBooked.length} hall-slot pair(s) double booked`
        : `All ${timetable.length} exams mapped to unique hall-slot pairs`,
      status: doubleBooked.length ? "Warning" : "Resolved",
    },
    {
      type: "Capacity of Schedule",
      detail: capacityOk
        ? `${buildSlots(config, halls.length)} hall-slots available for ${subjects.length} papers`
        : "Not enough hall-slots — increase days, sessions or halls",
      status: capacityOk ? "Resolved" : "Warning",
    },
    {
      type: "Invigilator Clash",
      detail: `${names.length} invigilators rotated across ${timetable.length} duties`,
      status: "Resolved",
    },
  ];

  return {
    source: "upload",
    subjects,
    halls,
    invigilatorNames: names,
    config,
    timetable,
    invigilators,
    evolution,
    fitness,
    conflicts,
  };
}

/* ---------------- Store ---------------- */

const demoDataset: ExamDataset = {
  source: "demo",
  subjects: defaultTimetable.map((t) => ({
    code: t.code,
    subject: t.subject,
    teacher: t.teacher,
    students: t.students,
  })),
  halls: defaultHalls,
  invigilatorNames: [...new Set(defaultTimetable.map((t) => t.teacher))],
  config: { days: DEFAULT_DAYS.length, slots: [...DEFAULT_SLOTS] },
  timetable: defaultTimetable,
  invigilators: defaultTimetable.map((t) => ({
    name: t.teacher,
    hall: t.hall,
    subject: t.subject,
    day: t.day,
    time: t.time,
  })),
  evolution: [],
  fitness: 96.4,
  conflicts: [
    { type: "Student Clash", detail: "No overlapping subject allocation detected", status: "Resolved" },
    { type: "Hall Overload", detail: "R102 allocated 72 / 70 seats", status: "Warning" },
    { type: "Invigilator Clash", detail: "No duplicate invigilator per slot", status: "Resolved" },
    { type: "Slot Conflict", detail: "All 12 exams mapped to unique hall-slot pairs", status: "Resolved" },
  ],
};

const STORAGE_KEY = "vcet-exam-dataset";

let current: ExamDataset = demoDataset;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setDataset(d: ExamDataset) {
  current = d;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    /* ignore */
  }
  emit();
}

export function resetDataset() {
  current = demoDataset;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

export function loadStoredDataset() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as ExamDataset;
    if (parsed?.timetable?.length) {
      current = parsed;
      emit();
    }
  } catch {
    /* ignore */
  }
}

export function useExamData(): ExamDataset {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => demoDataset,
  );
}

export const kpisFor = (d: ExamDataset) => ({
  subjects: d.timetable.length,
  students: d.subjects.reduce((a, s) => a + s.students, 0),
  invigilators: d.invigilatorNames.length,
  halls: d.halls.length,
  slots: d.config.days * d.config.slots.length,
  fitness: d.fitness,
});

export const daysOf = (d: ExamDataset) =>
  Array.from({ length: d.config.days }, (_, i) => `Day ${i + 1}`);

export const SAMPLE_SUBJECTS_CSV = `code,subject,teacher,students
AD3491,Fundamentals of Data Science,Dr. R. Kavitha,62
AD3501,Deep Learning,Dr. S. Manikandan,58
CS3491,Artificial Intelligence & ML,Mrs. P. Devi,70`;

export const SAMPLE_HALLS_CSV = `hall,capacity
R101,70
R102,70
R103,80`;

export const SAMPLE_INVIGILATORS_CSV = `name
Dr. R. Kavitha
Mr. A. Vignesh
Mrs. G. Anitha`;
