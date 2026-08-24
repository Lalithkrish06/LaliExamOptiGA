export type ExamRow = {
  code: string;
  subject: string;
  teacher: string;
  hall: string;
  day: string;
  time: string;
  students: number;
};

export const DAYS = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
export const SLOTS = ["09:30 - 12:30", "01:30 - 04:30"];

export const timetable: ExamRow[] = [
  { code: "AD3491", subject: "Fundamentals of Data Science", teacher: "Dr. R. Kavitha", hall: "R101", day: "Day 1", time: "09:30 - 12:30", students: 62 },
  { code: "AD3501", subject: "Deep Learning", teacher: "Dr. S. Manikandan", hall: "R102", day: "Day 1", time: "09:30 - 12:30", students: 58 },
  { code: "CS3491", subject: "Artificial Intelligence & ML", teacher: "Mrs. P. Devi", hall: "R103", day: "Day 1", time: "01:30 - 04:30", students: 70 },
  { code: "MA3354", subject: "Discrete Mathematics", teacher: "Dr. K. Sundaram", hall: "R201", day: "Day 2", time: "09:30 - 12:30", students: 66 },
  { code: "CS3452", subject: "Theory of Computation", teacher: "Mr. A. Vignesh", hall: "R202", day: "Day 2", time: "01:30 - 04:30", students: 54 },
  { code: "AD3311", subject: "Big Data Analytics", teacher: "Dr. M. Lakshmi", hall: "R203", day: "Day 3", time: "09:30 - 12:30", students: 48 },
  { code: "CS3491L", subject: "Computer Networks", teacher: "Mr. T. Bharath", hall: "R101", day: "Day 3", time: "01:30 - 04:30", students: 60 },
  { code: "AD3391", subject: "Database Design & Management", teacher: "Mrs. G. Anitha", hall: "R102", day: "Day 4", time: "09:30 - 12:30", students: 72 },
  { code: "GE3791", subject: "Human Values and Ethics", teacher: "Dr. V. Ramesh", hall: "R201", day: "Day 4", time: "01:30 - 04:30", students: 44 },
  { code: "AD3551", subject: "Data & Information Security", teacher: "Dr. N. Priya", hall: "R203", day: "Day 5", time: "09:30 - 12:30", students: 56 },
  { code: "CS3591", subject: "Compiler Design", teacher: "Mr. S. Karthik", hall: "R202", day: "Day 5", time: "01:30 - 04:30", students: 50 },
  { code: "AD3271", subject: "Cloud Computing", teacher: "Mrs. J. Sowmiya", hall: "R103", day: "Day 5", time: "01:30 - 04:30", students: 40 },
];

export type Hall = { hall: string; capacity: number; allocated: number };

export const halls: Hall[] = [
  { hall: "R101", capacity: 70, allocated: 62 },
  { hall: "R102", capacity: 70, allocated: 72 },
  { hall: "R103", capacity: 80, allocated: 70 },
  { hall: "R201", capacity: 90, allocated: 66 },
  { hall: "R202", capacity: 60, allocated: 54 },
  { hall: "R203", capacity: 75, allocated: 56 },
];

export function hallStatus(h: Hall) {
  const ratio = h.allocated / h.capacity;
  if (ratio > 1) return { label: "Overloaded", tone: "danger" as const };
  if (ratio >= 0.85) return { label: "Nearly Full", tone: "warning" as const };
  return { label: "Available", tone: "success" as const };
}

export const invigilators = timetable.map((r, i) => ({
  name: [
    "Dr. R. Kavitha", "Mr. A. Vignesh", "Mrs. G. Anitha", "Dr. K. Sundaram",
    "Mr. T. Bharath", "Dr. N. Priya", "Mrs. J. Sowmiya", "Dr. S. Manikandan",
    "Mr. S. Karthik", "Dr. M. Lakshmi", "Mrs. P. Devi", "Dr. V. Ramesh",
  ][i % 12],
  hall: r.hall,
  subject: r.subject,
  day: r.day,
  time: r.time,
}));

export function seatingFor(hall: string, count: number, cols = 5) {
  const seats = Array.from({ length: count }, (_, i) => `ST${String(i + 1).padStart(3, "0")}`);
  const rows: string[][] = [];
  for (let i = 0; i < seats.length; i += cols) rows.push(seats.slice(i, i + cols));
  return { hall, rows };
}

export const gaConfig = {
  populationSize: 120,
  generations: 250,
  mutationRate: 0.05,
  eliteSize: 10,
  crossoverRate: 0.85,
};

export const fitnessScore = 96.4;

export const evolution = Array.from({ length: 26 }, (_, i) => {
  const g = i * 10;
  const best = 96.4 - 46 * Math.exp(-g / 45);
  const avg = best - 8 * Math.exp(-g / 90) - 2;
  return { generation: g, best: +best.toFixed(2), average: +avg.toFixed(2) };
});

export const conflicts = [
  { type: "Student Clash", detail: "No overlapping subject allocation detected", status: "Resolved" },
  { type: "Hall Overload", detail: "R102 allocated 72 / 70 seats", status: "Warning" },
  { type: "Invigilator Clash", detail: "No duplicate invigilator per slot", status: "Resolved" },
  { type: "Slot Conflict", detail: "All 12 exams mapped to unique hall-slot pairs", status: "Resolved" },
];

export const kpis = {
  subjects: timetable.length,
  students: 680,
  invigilators: 12,
  halls: halls.length,
  slots: DAYS.length * SLOTS.length,
  fitness: fitnessScore,
};

export function toCsv(rows: Record<string, string | number>[]) {
  const first = rows[0];
  if (!first) return "";
  const headers = Object.keys(first);
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
}

export function downloadFile(name: string, content: string, mime = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
