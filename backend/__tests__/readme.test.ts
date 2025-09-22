import { describe, it, expect, beforeAll } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("backend/README.md documentation integrity", () => {
  let md = "";
  beforeAll(() => {
    const p = join(process.cwd(), "backend", "README.md");
    md = readFileSync(p, "utf8");
  });

  describe("headings and core sections", () => {
    it("starts with a single H1 title", () => {
      const firstLine = md.split("\n")[0]?.trim();
      expect(firstLine).toBe("# HabitRace Backend");
    });

    it("contains expected top-level sections", () => {
      const required = [
        "## Prerequisites",
        "## Getting Started",
        "## Available Scripts",
        "## Docker Commands",
        "## Project Structure",
        "## Technologies Used",
        "## Development Tips",
        "## Troubleshooting",
        "## Contributing",
      ];
      for (const h of required) {
        expect(md.includes(h)).toBeTrue();
      }
    });

    it("contains numbered 'Getting Started' subsections 1 through 6", () => {
      const subs = [
        "### 1. Clone the Repository",
        "### 2. Install Dependencies",
        "### 3. Start the Database",
        "### 4. Environment Setup",
        "### 5. Database Generation/Migration",
        "### 6. Start the Development Server",
      ];
      for (const s of subs) {
        expect(md.includes(s)).toBeTrue();
      }
    });
  });

  describe("commands and code blocks", () => {
    const hasInCodeFence = (snippet: string) => {
      // crude search ensuring snippet appears between any pair of code fences
      const parts = md.split("```");
      for (let i = 1; i < parts.length; i += 2) {
        const content = parts[i];
        if (content.includes(snippet)) return true;
      }
      return false;
    };

    it("documents cloning and directory change", () => {
      expect(hasInCodeFence("git clone https://github.com/Lakshyakumar266/habitrace.git")).toBeTrue();
      expect(hasInCodeFence("cd backend")).toBeTrue();
    });

    it("documents dependency install with Bun", () => {
      expect(hasInCodeFence("bun install")).toBeTrue();
    });

    it("documents starting database with docker-compose", () => {
      expect(hasInCodeFence("docker-compose up -d")).toBeTrue();
    });

    it("documents environment file copy", () => {
      expect(hasInCodeFence("cp .env.example .env")).toBeTrue();
    });

    it("documents Prisma generation/migration scripts", () => {
      expect(hasInCodeFence("bun run db:generate")).toBeTrue();
      expect(hasInCodeFence("bun run db:migrate")).toBeTrue();
      expect(hasInCodeFence("bun run prisma:migrate")).toBeTrue();
    });

    it("documents running the dev server", () => {
      expect(hasInCodeFence("bun dev")).toBeTrue();
    });

    it("lists common Bun scripts in Available Scripts", () => {
      // ensure they appear as inline code items in that section
      const sectionMatch = md.match(/## Available Scripts[\s\S]*?## /);
      expect(sectionMatch).toBeTruthy();
      const section = sectionMatch ? sectionMatch[0] : "";
      const items = ["`bun dev`", "`bun start`", "`bun test`", "`bun run build`"];
      for (const i of items) {
        expect(section.includes(i)).toBeTrue();
      }
    });

    it("provides troubleshooting commands for clearing bun cache and reinstalling", () => {
      expect(hasInCodeFence("bun pm cache rm")).toBeTrue();
      expect(hasInCodeFence("rm -rf node_modules")).toBeTrue();
      expect(hasInCodeFence("bun install")).toBeTrue();
    });
  });

  describe("environment configuration block", () => {
    const extractEnvBlock = (): string => {
      const re = /```env\s*([\s\S]*?)```/m;
      const m = md.match(re);
      return m?.[1] ?? "";
    };

    it("includes all expected keys in the env example", () => {
      const envBlock = extractEnvBlock();
      const keys = [
        "DATABASE_URL=",
        "DB_NAME=",
        "DB_USER=",
        "DB_PASSWORD=",
        "DB_PORT=",
        "PORT=",
        "SECRET_KEY=",
        "NODE_ENV=",
      ];
      for (const k of keys) {
        expect(envBlock.includes(k)).toBeTrue();
      }
    });

    it("uses default DB and app ports consistent with prose", () => {
      const envBlock = extractEnvBlock();
      const portMatch = envBlock.match(/^PORT\s*=\s*(\d+)/m);
      const proseMatch = md.match(/http:\/\/localhost:(\d+)[^0-9]?/);
      expect(portMatch).toBeTruthy();
      expect(proseMatch).toBeTruthy();
      if (portMatch && proseMatch) {
        expect(proseMatch[1]).toBe(portMatch[1]);
      }
    });

    it("includes a valid DATABASE_URL shape", () => {
      const envBlock = extractEnvBlock();
      const urlLine = envBlock
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.startsWith('DATABASE_URL='));
      expect(urlLine).toBeTruthy();
      if (urlLine) {
        const val = urlLine.split("=", 2)[1]?.replace(/^"+|"+$/g, "");
        // basic shape: postgresql://user:pass@host:port/db
        expect(/^postgresql:\/\/[^:@\/\s]+:[^@\/\s]+@[^:\/\s]+:\d+\/[^\/\s]+$/i.test(val)).toBeTrue();
      }
    });
  });

  describe("links and formatting", () => {
    it("uses valid markdown links with absolute http(s) URLs", () => {
      const links = Array.from(md.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g));
      expect(links.length).toBeGreaterThan(0);
      for (const [, _text, url] of links as any) {
        expect(/^https?:\/\/[^\s)]+$/i.test(url)).toBeTrue();
      }
    });

    it("has a project structure code fence with expected entries", () => {
      const block = md.match(/```[\s\S]*?backend\/[\s\S]*?```/m)?.[0] ?? "";
      const expected = [
        "backend/",
        "src/",
        "controllers/",
        "models/",
        "routes/",
        "utils/",
        "prisma/",
        "docker-compose.yml",
        ".env.example",
        "package.json",
      ];
      for (const item of expected) {
        expect(block.includes(item)).toBeTrue();
      }
    });

    it("mentions Bun v1.2.22 explicitly in prerequisites or footer", () => {
      expect(md.includes("v1.2.22")).toBeTrue();
    });
  });

  describe("docker command references", () => {
    it("lists core docker-compose commands", () => {
      const section = md.match(/## Docker Commands[\s\S]*?## /)?.[0] ?? "";
      const expected = [
        "docker-compose up -d",
        "docker-compose down",
        "docker-compose logs postgres",
        "docker-compose exec postgres psql -U",
      ];
      for (const cmd of expected) {
        expect(section.includes(cmd)).toBeTrue();
      }
    });
  });
});