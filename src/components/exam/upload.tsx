import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, FileUp, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { downloadFile } from "@/lib/exam-data";
import {
  SAMPLE_HALLS_CSV,
  SAMPLE_INVIGILATORS_CSV,
  SAMPLE_SUBJECTS_CSV,
  buildDataset,
  loadStoredDataset,
  parseHalls,
  parseInvigilators,
  parseSubjects,
  resetDataset,
  setDataset,
  useExamData,
} from "@/lib/exam-store";
import type { Hall } from "@/lib/exam-data";
import type { SubjectInput } from "@/lib/exam-store";

type UploadCardProps = {
  title: string;
  hint: string;
  columns: string;
  sample: string;
  sampleName: string;
  count: number | null;
  onFile: (text: string, fileName: string) => void;
  fileName: string | null;
};

function UploadCard({
  title,
  hint,
  columns,
  sample,
  sampleName,
  count,
  onFile,
  fileName,
}: UploadCardProps) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Card className="card-elevated animate-rise">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        {count !== null && (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 className="size-3.5" /> {count}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="rounded-lg bg-muted/60 p-2 font-mono text-[11px] text-muted-foreground">
          {columns}
        </p>
        <input
          ref={ref}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            onFile(await file.text(), file.name);
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => ref.current?.click()}>
            <FileUp className="size-4" /> Upload CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={() => downloadFile(sampleName, sample)}>
            <Download className="size-4" /> Sample
          </Button>
        </div>
        {fileName && <p className="truncate text-xs text-muted-foreground">Loaded: {fileName}</p>}
      </CardContent>
    </Card>
  );
}

export function UploadSection() {
  const data = useExamData();
  const [subjects, setSubjects] = useState<SubjectInput[] | null>(null);
  const [halls, setHalls] = useState<Hall[] | null>(null);
  const [names, setNames] = useState<string[] | null>(null);
  const [files, setFiles] = useState<{
    subjects: string | null;
    halls: string | null;
    invigilators: string | null;
  }>({ subjects: null, halls: null, invigilators: null });
  const [days, setDays] = useState(5);
  const [slots, setSlots] = useState("09:30 - 12:30, 01:30 - 04:30");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadStoredDataset();
  }, []);

  const generate = () => {
    if (!subjects?.length) {
      toast.error("Upload the subjects CSV first");
      return;
    }
    const hallList = halls?.length ? halls : data.halls;
    const slotList = slots
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!hallList.length || !slotList.length || days < 1) {
      toast.error("Provide halls, exam days and at least one session time");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const dataset = buildDataset(subjects, hallList, names ?? [], {
        days,
        slots: slotList,
      });
      setDataset(dataset);
      setBusy(false);
      toast.success(
        `Timetable generated · ${dataset.timetable.length} papers · fitness ${dataset.fitness}%`,
      );
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="animate-rise">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Upload Examination Data</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload subject, hall and invigilator CSV files, set the examination window, then generate a
          conflict-free timetable with the Genetic Algorithm engine.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <UploadCard
          title="1 · Subjects & Students"
          hint="Total subjects with registered student strength"
          columns="code, subject, teacher, students"
          sample={SAMPLE_SUBJECTS_CSV}
          sampleName="sample_subjects.csv"
          count={subjects?.length ?? null}
          fileName={files.subjects}
          onFile={(text, name) => {
            const rows = parseSubjects(text);
            if (!rows.length) {
              toast.error("No valid subject rows found");
              return;
            }
            setSubjects(rows);
            setFiles((f) => ({ ...f, subjects: name }));
            toast.success(`${rows.length} subjects loaded`);
          }}
        />
        <UploadCard
          title="2 · Examination Halls"
          hint="Available venues and seating capacity"
          columns="hall, capacity"
          sample={SAMPLE_HALLS_CSV}
          sampleName="sample_halls.csv"
          count={halls?.length ?? null}
          fileName={files.halls}
          onFile={(text, name) => {
            const rows = parseHalls(text);
            if (!rows.length) {
              toast.error("No valid hall rows found");
              return;
            }
            setHalls(rows);
            setFiles((f) => ({ ...f, halls: name }));
            toast.success(`${rows.length} halls loaded`);
          }}
        />
        <UploadCard
          title="3 · Invigilators"
          hint="Faculty available for duty allocation"
          columns="name"
          sample={SAMPLE_INVIGILATORS_CSV}
          sampleName="sample_invigilators.csv"
          count={names?.length ?? null}
          fileName={files.invigilators}
          onFile={(text, name) => {
            const rows = parseInvigilators(text);
            if (!rows.length) {
              toast.error("No valid invigilator rows found");
              return;
            }
            setNames(rows);
            setFiles((f) => ({ ...f, invigilators: name }));
            toast.success(`${rows.length} invigilators loaded`);
          }}
        />
      </div>

      <Card className="card-elevated animate-rise">
        <CardHeader>
          <CardTitle className="text-base">4 · Examination Window</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="days">Number of exam days</Label>
            <Input
              id="days"
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slots">Session timings (comma separated)</Label>
            <Input id="slots" value={slots} onChange={(e) => setSlots(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated animate-rise">
        <CardContent className="flex flex-wrap items-center gap-3 p-5">
          <Button size="lg" onClick={generate} disabled={busy}>
            <Sparkles className="size-4" /> {busy ? "Evolving schedule…" : "Generate Timetable"}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              resetDataset();
              setSubjects(null);
              setHalls(null);
              setNames(null);
              setFiles({ subjects: null, halls: null, invigilators: null });
              toast.success("Reset to demo dataset");
            }}
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
          <p className="text-xs text-muted-foreground">
            Current data source:{" "}
            <span className="font-semibold text-foreground">
              {data.source === "upload" ? "Uploaded CSV" : "Demo dataset"}
            </span>{" "}
            · {data.timetable.length} papers · fitness {data.fitness}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
