# Tests validating the Backend environment README/documentation.
# Test runner: Prefer pytest if available; otherwise compatible with unittest.
# These tests focus on the diff-provided environment setup instructions.

import os
import re
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

try:
    import pytest  # type: ignore
    USING_PYTEST = True
except ImportError:  # pragma: no cover
    USING_PYTEST = False

# Heuristics to locate the README containing "HabitRace Backend"
CANDIDATE_FILENAMES = [
    "README.md",
    "readme.md",
    "Readme.md",
    "backend/README.md",
    "docs/README.md",
    "README",
]

UNIQUE_MARKERS = [
    "HabitRace Backend",
    "docker-compose up -d",
    "bun dev",
    "DATABASE_URL",
    "This project was created using `bun init` in bun v1.2.22",
]

def find_backend_readme() -> Path | None:
    repo_root = Path(__file__).resolve().parents[1]
    # 1) Check common filenames
    for rel in CANDIDATE_FILENAMES:
        p = repo_root / rel
        if p.is_file():
            try:
                txt = p.read_text(encoding="utf-8", errors="ignore")
            except OSError as exc:
                logger.debug("Could not read candidate README %s: %s", p, exc)
                continue
            if all(m in txt for m in UNIQUE_MARKERS[:2]) or "HabitRace Backend" in txt:
                return p
    # 2) Scan all markdown files for unique markers
    for p in repo_root.rglob("*.md"):
        try:
            txt = p.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            logger.debug("Could not read markdown file %s: %s", p, exc)
            continue
        if any(m in txt for m in UNIQUE_MARKERS):
            return p
    # 3) Fallback: scan any text files for markers (bounded)
    for p in list(repo_root.rglob("*"))[:2000]:
        if not p.is_file():
            continue
        if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".ico"}:
            continue
        try:
            txt = p.read_text(encoding="utf-8", errors="ignore")
        except OSError as exc:
            logger.debug("Could not read file %s during fallback scan: %s", p, exc)
            continue
        if "HabitRace Backend" in txt and "bun dev" in txt:
            return p
    return None

def _readme_text():
    readme = find_backend_readme()
    assert readme is not None, "Could not locate backend environment README with expected markers."
    return readme, readme.read_text(encoding="utf-8", errors="ignore")

def _code_blocks(text: str):
    # Capture ```lang\n...\n``` blocks
    pattern = re.compile(r"```(\w+)?\n(.*?)\n```", re.DOTALL)
    return pattern.findall(text)

def _extract_section(text: str, title: str) -> str | None:
    # Find '## Title' or '### Title' and return following lines up to next header
    hdr = re.escape(title.strip())
    m = re.search(rf"^#{2,3}\s+{hdr}\s*$", text, re.MULTILINE)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^\#{2,3}\s+", text[start:], re.MULTILINE)
    if nxt:
        return text[start:start + nxt.start()]
    return text[start:]

def test_readme_present_and_identified():
    path, text = _readme_text()
    assert "HabitRace Backend" in text
    assert path.suffix.lower() in (".md", "", ".markdown"), f"README should be markdown/plain, got: {path}"

def test_prerequisites_section_lists_required_tools():
    _, text = _readme_text()
    sec = _extract_section(text, "Prerequisites")
    assert sec is not None, "Prerequisites section missing."
    # Bun requirement
    assert re.search(r"\bBun\b.*\(https?://[^)]+\).*(v1\.2\.22|1\.2\.22).*(or higher)", sec, re.IGNORECASE), \
        "Bun prerequisite should mention https URL and v1.2.22 or higher."
    # Docker and Git
    assert re.search(r"Docker.*Compose", sec, re.IGNORECASE), "Docker and Docker Compose should be listed."
    assert re.search(r"\bGit\b", sec), "Git should be listed."

def test_getting_started_has_clone_and_cd_backend():
    _, text = _readme_text()
    sec = _extract_section(text, "Getting Started")
    assert sec is not None, "Getting Started section missing."
    blocks = _code_blocks(sec)
    # Expect a bash block with clone and cd backend
    found = any(lang in ("bash", "sh") and "git clone" in body and re.search(r"\bcd\s+backend\b", body)
                for lang, body in blocks)
    assert found, "Getting Started should include a bash code block cloning the repo and 'cd backend'."

def test_install_dependencies_uses_bun_install():
    _, text = _readme_text()
    sec = _extract_section(text, "2. Install Dependencies")
    assert sec is not None, "Install Dependencies step missing."
    assert "bun install" in sec, "Install step should use 'bun install'."

def test_database_start_uses_docker_compose_up_detached():
    _, text = _readme_text()
    sec = _extract_section(text, "3. Start the Database")
    assert sec is not None
    assert re.search(r"docker-compose\s+up\s+-d", sec), "Should use 'docker-compose up -d'."
    assert "localhost:5432" in sec, "Should mention database available on localhost:5432."

def test_env_setup_includes_cp_and_required_vars():
    _, text = _readme_text()
    sec = _extract_section(text, "4. Environment Setup")
    assert sec is not None, "Environment Setup section missing."
    assert re.search(r"\bcp\s+\.env\.example\s+\.env\b", sec), "Should include 'cp .env.example .env'."
    # Validate env var block
    required = ["DATABASE_URL", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_PORT", "PORT", "SECRET_KEY", "NODE_ENV"]
    present = [k for k in required if re.search(rf"^{k}\s*=", sec, re.MULTILINE)]
    assert set(present) == set(required), f"Missing env vars: {set(required)-set(present)}"

def test_db_migration_commands_cover_generate_and_migrate():
    _, text = _readme_text()
    sec = _extract_section(text, "5. Database Generation/Migration")
    assert sec is not None
    # Accept either prisma migrate or project scripts
    ok = any(cmd in sec for cmd in ["bun run db:generate", "bun run db:migrate", "bun run prisma:migrate"])
    assert ok, "DB migration section should include bun run db:generate/db:migrate or prisma:migrate."

def test_dev_server_section_mentions_bun_dev_and_port_3001():
    _, text = _readme_text()
    sec = _extract_section(text, "6. Start the Development Server")
    assert sec is not None
    assert re.search(r"\bbun\s+dev\b", sec), "Development section should include 'bun dev'."
    # After section, confirm note about port
    assert re.search(r"http://localhost:3001", text), "Should mention server starts on http://localhost:3001."

def test_available_scripts_list_required_entries():
    _, text = _readme_text()
    sec = _extract_section(text, "Available Scripts")
    assert sec is not None
    for script in ("bun dev", "bun start", "bun test", "bun run build"):
        assert script in sec, f"Scripts section should list '{script}'."

def test_docker_commands_examples_present():
    _, text = _readme_text()
    sec = _extract_section(text, "Docker Commands")
    assert sec is not None
    for cmd in (
        "docker-compose up -d",
        "docker-compose down",
        "docker-compose logs postgres",
        "docker-compose exec postgres psql -U",
    ):
        assert cmd.split()[0] in sec and cmd.split()[1] in sec, f"Missing docker command example '{cmd}'."

def test_project_structure_block_contains_expected_paths():
    _, text = _readme_text()
    sec = _extract_section(text, "Project Structure")
    assert sec is not None
    assert "backend/" in sec and "src/" in sec and "docker-compose.yml" in sec, "Structure should show backend layout."

def test_technologies_used_lists_bun_postgres_prisma_express():
    _, text = _readme_text()
    sec = _extract_section(text, "Technologies Used")
    assert sec is not None
    for kw in ("Bun", "PostgreSQL", "Prisma", "Express"):
        assert re.search(kw, sec, re.IGNORECASE), f"Technologies should include {kw}."

def test_development_tips_mentions_hot_reload_db_gui_and_env_security():
    _, text = _readme_text()
    sec = _extract_section(text, "Development Tips")
    assert sec is not None
    assert re.search(r"Hot Reload", sec, re.IGNORECASE)
    assert re.search(r"pgAdmin|DBeaver", sec, re.IGNORECASE)
    assert re.search(r"Never commit your `\.env`", sec)

def test_troubleshooting_covers_docker_health_ports_and_dependencies():
    _, text = _readme_text()
    sec = _extract_section(text, "Troubleshooting")
    assert sec is not None
    assert "docker ps" in sec and "docker-compose ps" in sec, "Troubleshooting should include docker checks."
    # Port conflicts and dependency fixes
    assert re.search(r"Port Conflicts", sec)
    assert re.search(r"Dependencies Issues|Dependency Issues", sec)
    assert re.search(r"bun pm cache rm", sec) and re.search(r"bun install", sec)

def test_final_bun_note_mentions_version_1_2_22_and_bun_link():
    _, text = _readme_text()
    # Ensure explicit Bun version and a link in the document
    assert re.search(r"bun v?1\.2\.22", text, re.IGNORECASE), "README should mention bun v1.2.22."
    # Validate any Bun link uses https and domain chars
    bun_links = re.findall(r"\[Bun\]\((https?://[^)]+)\)", text)
    assert bun_links, "A Bun hyperlink should be present."
    for url in bun_links:
        assert url.startswith("https://"), f"Bun link should be https: {url}"
        assert re.match(r"^https://[A-Za-z0-9\.\-]+(?:/.*)?$", url), f"Suspicious Bun URL: {url}"

def test_spelling_environment_preferred_over_enviournment():
    _, text = _readme_text()
    # Encourage correct spelling by asserting the incorrect spelling is absent
    assert "enviournment" not in text.lower(), "Typo detected: 'enviournment' should be 'environment'."

def test_markdown_code_blocks_have_languages_where_applicable():
    _, text = _readme_text()
    blocks = _code_blocks(text)
    # Ensure at least one bash/sh and one env block present
    langs = { (lang or "").lower() for lang, _ in blocks }
    assert "bash" in langs or "sh" in langs, "Expect bash/sh code blocks for commands."
    assert "env" in langs, "Expect env code block for environment variables."

# Optional: mark xfail if strict style checks are not desired
if USING_PYTEST:
    import pytest  # type: ignore

    @pytest.mark.parametrize("header", [
        "Prerequisites", "Getting Started", "Start the Database",
        "Environment Setup", "Database Generation/Migration",
        "Start the Development Server", "Available Scripts",
        "Docker Commands", "Project Structure", "Technologies Used",
        "Development Tips", "Troubleshooting",
    ])
    def test_each_key_section_exists(header):
        _, text = _readme_text()
        assert re.search(rf"^##\s+{re.escape(header)}\s*$", text, re.MULTILINE) or \
               re.search(rf"^###\s+{re.escape(header)}\s*$", text, re.MULTILINE), f"Missing section: {header}"