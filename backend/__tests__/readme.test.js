// If Bun runs JS tests only, ensure README validation also executes.
// Prefer TS test above; this file simply requires the TS one if Bun transpiles TS by default.
import "./readme.test.ts";