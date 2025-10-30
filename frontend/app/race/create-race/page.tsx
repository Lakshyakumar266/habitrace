"use client";

import type * as React from "react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  IconBolt,
  IconCalendar,
  IconFlag,
  IconHash,
  IconNote,
  IconPlus,
  IconRepeat,
  IconRocket,
  IconTrash,
} from "@/components/ui/custome-icons";
import { AudioWaveform } from "lucide-react";
import { CreateRaceSchema, Frequency, RaceSchema } from "@/utils/types";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type MetadataRow = { key: string; value: string };

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY" | "MONTHLY">(
    "DAILY"
  );
  const [startMode, setStartMode] = useState<"immediately" | "custom">(
    "immediately"
  );
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [meta, setMeta] = useState<MetadataRow[]>([{ key: "", value: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startsImmediately = startMode === "immediately";

  const summary = useMemo(() => {
    const start = startsImmediately ? "Now" : startDate || "—";
    const end = endDate || "—";
    const metaPairs = meta
      .filter((m) => m.key || m.value)
      .map((m) => `${m.key || "…"}: ${m.value || "…"}`);
    return {
      title: title || "Untitled race",
      frequency: frequency || "—",
      window: `${start} → ${end}`,
      metaText: metaPairs.length ? metaPairs.join(" • ") : "No metadata yet",
    };
  }, [title, frequency, startsImmediately, startDate, endDate, meta]);

  const DESC_LIMIT = 3000;
  const descLength = description.length;
  const descPct = Math.min(100, Math.round((descLength / DESC_LIMIT) * 100));
  const isNearLimit = descLength >= Math.floor(DESC_LIMIT * 0.9);
  const barColor = isNearLimit ? "bg-destructive" : "bg-primary";

  function validate() {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Please enter a habit title.";
    if (!endDate) next.endDate = "Please enter a valid end date.";
    if (!frequency) next.frequency = "Please select a check-in frequency.";
    if (!startsImmediately && !startDate)
      next.startDate = "Choose a start date or start immediately.";
    if (endDate && !startsImmediately && startDate && endDate < startDate) {
      next.endDate = "End date must be after the start date.";
    }
    if (endDate && startsImmediately) {
      const today = new Date().toISOString().slice(0, 10);
      if (endDate < today) next.endDate = "End date must be in the future.";
    }
    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const dateTime = new Date();
    const raceStartDate = startsImmediately
      ? dateTime.toISOString()
      : new Date(startDate).toISOString();
    const raceEndDate = new Date(endDate).toISOString();
    const raceDescription = `${description}\n METADATA:\n${meta
      .filter((m) => m.key || m.value)
      .map((m) => `${m.key || "…"}: ${m.value || "…"}\n`)}`;

    setSubmitting(true);
    const formData: CreateRaceSchema = {
      name: title,
      description: raceDescription,
      startDate: raceStartDate,
      endDate: raceEndDate,
      frequency: frequency as Frequency,
    };
    try {
      const request = await axios.post(`${BACKEND_URL}api/v1/race`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("token"),
        },
      });

      const response: RaceSchema = request.data?.data;
      if (request.status === 201) {
        toast.success(
          `HabitRace ${response.name} created succesfully. view now at http://${window.location.host}/race/${response.raceSlug}`
        );
        router.push(`/race/${response.raceSlug}`);
      }
      if (request.status === 500) {
        toast.error(
          "Race not created!!! Please try again later or contact support."
        );
      }
    } catch (error) {
      console.error("Got Error - ", error);
      toast.error("Race not created!!! Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setFrequency("DAILY");
    setStartMode("immediately");
    setStartDate("");
    setEndDate("");
    setMeta([{ key: "", value: "" }]);
    setErrors({});
  }

  function updateMeta(index: number, field: keyof MetadataRow, value: string) {
    setMeta((rows) => {
      const next = [...rows];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addMetaRow() {
    setMeta((rows) => [...rows, { key: "", value: "" }]);
  }

  function removeMetaRow(index: number) {
    setMeta((rows) => rows.filter((_, i) => i !== index));
  }

  return (
    <main className="mx-auto max-w-full p-6 md:p-8">
      <header className="mb-6">
        <div className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground animate-in fade-in slide-in-from-bottom-1">
          <IconRocket className="mr-1.5 size-4" aria-hidden="true" />
          On your marks!
        </div>
        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          <span className="inline-flex items-center gap-2">
            <IconFlag className="size-5 text-primary" aria-hidden="true" />
            Start Your HabitRace
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Set up your habit race with an energetic cadence and clear timeframe.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Low‑key, your future self will thank you — no cap.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Form */}
        <Card className="md:col-span-3">
          <form onSubmit={onSubmit} noValidate>
            <CardHeader>
              <CardTitle>Race details</CardTitle>
              <CardDescription>
                Describe the habit and how you’ll check in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="grid gap-2">
                <Label
                  htmlFor="title"
                  className="inline-flex items-center gap-2"
                >
                  <IconHash
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Habit title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning Run"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  required
                />
                {errors.title ? (
                  <p
                    id="title-error"
                    className="text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.title}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Keep it short and punchy.
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label
                  htmlFor="desc"
                  className="inline-flex items-center gap-2"
                >
                  <IconNote
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Habit description
                </Label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add context, goals, or rules for this habit…"
                  rows={4}
                  cols={40}
                  minLength={100}
                  maxLength={DESC_LIMIT}
                  aria-describedby="desc-help desc-count"
                />
                <p id="desc-help" className="text-xs text-muted-foreground">
                  Share what success looks like and any constraints — keep it
                  tight, no essays frfr.
                </p>

                {/* Animated character meter and counter */}
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-1.5 ${barColor} rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${descPct}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Max {DESC_LIMIT} characters
                    </span>
                    <span
                      id="desc-count"
                      className={cn(
                        "tabular-nums transition-colors",
                        isNearLimit
                          ? "text-destructive animate-in fade-in-50"
                          : "text-muted-foreground"
                      )}
                      aria-live="polite"
                    >
                      {descLength}/{DESC_LIMIT}
                    </span>
                  </div>
                </div>
              </div>

              {/* Frequency */}
              <div className="grid gap-2">
                <Label className="inline-flex items-center gap-2">
                  <AudioWaveform
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  Check-in frequency
                </Label>
                <Select
                  value={frequency}
                  onValueChange={(v: "DAILY" | "WEEKLY" | "MONTHLY") =>
                    setFrequency(v)
                  }
                >
                  <SelectTrigger aria-invalid={!!errors.frequency}>
                    <SelectValue placeholder="Choose frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">DAILY</SelectItem>
                    <SelectItem value="WEEKLY">WEEKLY</SelectItem>
                    <SelectItem value="MONTHLY">MONTHLY</SelectItem>
                  </SelectContent>
                </Select>
                {errors.frequency ? (
                  <p
                    className="text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.frequency}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    How often you’ll log your progress.
                  </p>
                )}
              </div>

              {/* Start options */}
              <div className="grid gap-3">
                <Label>Start time</Label>
                <RadioGroup
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                  value={startMode}
                  onValueChange={(v: "immediately" | "custom") =>
                    setStartMode(v)
                  }
                >
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors",
                      startMode === "immediately"
                        ? "border-primary bg-accent/60"
                        : "hover:bg-accent"
                    )}
                  >
                    <RadioGroupItem value="immediately" id="start-now" />
                    <div className="flex items-center gap-2">
                      <IconBolt
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      <div className="space-y-0.5">
                        <span className="font-medium">Start immediately</span>
                        <p className="text-xs text-muted-foreground">
                          Kick off the race right away.
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors",
                      startMode === "custom"
                        ? "border-primary bg-accent/60"
                        : "hover:bg-accent"
                    )}
                  >
                    <RadioGroupItem value="custom" id="start-custom" />
                    <div className="flex items-center gap-2">
                      <IconCalendar
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="space-y-0.5">
                        <span className="font-medium">Pick a start date</span>
                        <p className="text-xs text-muted-foreground">
                          Schedule your launch for a later day.
                        </p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>

                {!startsImmediately && (
                  <div className="grid gap-2 animate-in fade-in-50 slide-in-from-top-1">
                    <Label htmlFor="start-date">Start date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      aria-invalid={!!errors.startDate}
                      aria-describedby={
                        errors.startDate ? "start-error" : undefined
                      }
                    />
                    {errors.startDate && (
                      <p
                        id="start-error"
                        className="text-sm text-destructive"
                        role="alert"
                        aria-live="polite"
                      >
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* End date */}
              <div className="grid gap-2">
                <Label htmlFor="end-date">End date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-invalid={!!errors.endDate}
                  aria-describedby={errors.endDate ? "end-error" : undefined}
                />
                {errors.endDate ? (
                  <p
                    id="end-error"
                    className="text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.endDate}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Kiddos must know when to stop.
                  </p>
                )}
              </div>

              {/* Metadata */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Habit metadata</Label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addMetaRow}
                    className="h-8"
                  >
                    <IconPlus className="mr-2 size-4" aria-hidden="true" />
                    Add row
                  </Button>
                </div>

                <div className="grid gap-2">
                  {meta.map((row, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-stretch gap-2 sm:flex-row"
                    >
                      <div className="flex-1">
                        <Input
                          placeholder="Key (e.g., Location)"
                          value={row.key}
                          onChange={(e) => updateMeta(i, "key", e.target.value)}
                          aria-label={`Metadata key ${i + 1}`}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Value (e.g., Park Loop)"
                          value={row.value}
                          onChange={(e) =>
                            updateMeta(i, "value", e.target.value)
                          }
                          aria-label={`Metadata value ${i + 1}`}
                        />
                      </div>
                      <div className="flex items-center sm:self-stretch">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeMetaRow(i)}
                          className="h-9"
                          aria-label={`Remove metadata row ${i + 1}`}
                        >
                          <IconTrash
                            className="mr-1.5 size-4"
                            aria-hidden="true"
                          />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Use key–value pairs to add context (e.g., coach, route, gear).
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 text-xs text-muted-foreground sm:order-1">
                You can{"'"}t edit these details later.
              </p>
              <div className="order-1 flex items-center gap-2 sm:order-2">
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    "Creating…"
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <IconFlag className="size-4" aria-hidden="true" />
                      Create race
                    </span>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Live Preview */}
        <Card className="md:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>Live preview</CardTitle>
            <CardDescription>Instant snapshot of your setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <IconHash className="size-4" aria-hidden="true" />
                Title
              </div>
              <div className="text-pretty text-lg font-medium">
                {summary.title}
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <IconRepeat className="size-4" aria-hidden="true" />
                Check-in frequency
              </div>
              <div className="font-medium">{summary.frequency}</div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <IconCalendar className="size-4" aria-hidden="true" />
                Window
              </div>
              <div className="font-medium">{summary.window}</div>
            </div>

            <div className="rounded-md border p-4">
              <div className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <IconNote className="size-4" aria-hidden="true" />
                Metadata
              </div>
              <div className="text-pretty text-sm">{summary.metaText}</div>
            </div>

            <div
              className={cn(
                "rounded-md border p-4 transition-colors",
                startsImmediately ? "bg-accent/60" : "bg-card"
              )}
            >
              <div className="mb-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <IconBolt className="size-4" aria-hidden="true" />
                Energy
              </div>
              <div className="text-pretty text-sm">
                {startsImmediately
                  ? "Starting now — feel the momentum!"
                  : "Scheduled start — count down and get ready."}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Tip: Keep the title action-oriented to boost motivation.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
