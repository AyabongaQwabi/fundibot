#!/usr/bin/env python3
"""
South African Higher Education Institution Data Enrichment Pipeline

Usage:
  python3 enrich_pipeline.py                # full run (all 96 institutions)
  python3 enrich_pipeline.py --test         # test: 1 institution, 5 programmes
  python3 enrich_pipeline.py --test --inst 363   # test a specific institution ID
  python3 enrich_pipeline.py --inst 363 364      # run only specific institutions
"""

import argparse
import json
import math
import os
import re
import sys
import time
import unicodedata
import difflib
from collections import defaultdict
from pathlib import Path
from typing import Any

# ─── CLI args ─────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser()
parser.add_argument("--test", action="store_true", help="Test mode: 1 institution, 5 programmes")
parser.add_argument("--inst", nargs="*", help="Only process these institution IDs")
parser.add_argument("--max-progs", type=int, default=None, help="Cap programmes per institution")
ARGS = parser.parse_args()

# ─── Logging ──────────────────────────────────────────────────────────────────
INDENT = 0
_SYMBOLS = {"info": "·", "ok": "✓", "warn": "⚠", "error": "✗", "head": "►", "data": "↳", "skip": "○"}

def log(msg: str, level: str = "info", indent: int = 0):
    sym = _SYMBOLS.get(level, "·")
    pad = "  " * (INDENT + indent)
    ts = time.strftime("%H:%M:%S")
    print(f"[{ts}] {pad}{sym} {msg}", flush=True)

class Section:
    def __init__(self, title: str, level: str = "head"):
        self.title = title
        self.level = level
    def __enter__(self):
        global INDENT
        log(self.title, self.level)
        INDENT += 1
        return self
    def __exit__(self, *_):
        global INDENT
        INDENT -= 1

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE      = Path("/Users/nonwork/dev/fundibot/seed")
INST_DIR  = BASE / "final/claude/merged/institutions"
PROSP_DIR = BASE / "prospectuses"
OUT_DIR   = BASE / "final/researched"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ─── Qualification taxonomy ───────────────────────────────────────────────────
QUAL_TYPES = [
    "doctoral degree", "phd", "master", "honours", "postgraduate diploma",
    "advanced diploma", "bachelor", "btech", "baccalaureus",
    "advanced certificate", "diploma", "higher certificate", "certificate",
    "national certificate", "national diploma", "nated", "ncv",
    "occupational certificate",
]
QUAL_NORM_MAP = {
    "phd":           "Doctoral Degree",
    "btech":         "Bachelor of Technology",
    "baccalaureus":  "Bachelor Degree",
    "masters":       "Master Degree",
    "hons":          "Honours Degree",
    "honours":       "Honours Degree",
    "pgdip":         "Postgraduate Diploma",
    "adv dip":       "Advanced Diploma",
    "advanced diploma": "Advanced Diploma",
    "adv cert":      "Advanced Certificate",
    "advanced certificate": "Advanced Certificate",
    "high cert":     "Higher Certificate",
    "higher certificate": "Higher Certificate",
    "nat cert":      "National Certificate",
    "national certificate": "National Certificate",
    "nat dip":       "National Diploma",
    "national diploma": "National Diploma",
    "nated":         "NATED",
    "ncv":           "NCV",
    "bachelor":      "Bachelor Degree",
    "diploma":       "Diploma",
    "certificate":   "Certificate",
    "occupational certificate": "Occupational Certificate",
    "postgraduate diploma": "Postgraduate Diploma",
    "doctoral degree": "Doctoral Degree",
}

def _normalize(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def _extract_qual_type(name: str) -> str | None:
    n = _normalize(name)
    for qt in QUAL_TYPES:
        if qt in n:
            return QUAL_NORM_MAP.get(qt, qt.title())
    return None

def _title_tokens(name: str) -> set[str]:
    stop = {"in", "of", "and", "the", "a", "an", "for", "with", "to", "ii", "iii", "iv"}
    return {t for t in _normalize(name).split() if t not in stop and len(t) > 1}

def _jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

def _programme_similarity(name_a: str, name_b: str) -> float:
    """Qual-type-guarded combined Jaccard + sequence similarity."""
    qt_a = _extract_qual_type(name_a)
    qt_b = _extract_qual_type(name_b)
    if qt_a and qt_b and qt_a != qt_b:
        return 0.0  # hard block: different qualification levels
    tok_a = _title_tokens(name_a)
    tok_b = _title_tokens(name_b)
    j = _jaccard(tok_a, tok_b)
    s = difflib.SequenceMatcher(None, _normalize(name_a), _normalize(name_b)).ratio()
    return 0.6 * j + 0.4 * s

# ─── PDF / text extraction ────────────────────────────────────────────────────
def _extract_pdf_text(pdf_path: Path) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(pdf_path))
        pages = []
        for i, page in enumerate(reader.pages):
            try:
                pages.append(page.extract_text() or "")
            except Exception:
                pages.append("")
        text = "\n".join(pages)
        return text
    except Exception as e:
        log(f"PDF extract failed {pdf_path.name}: {e}", "warn", 1)
        return ""

def _extract_text_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""

# ─── Chunking + BM25 ─────────────────────────────────────────────────────────
CHUNK_SIZE    = 900
CHUNK_OVERLAP = 200

def _chunk_text(text: str) -> list[dict]:
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        chunks.append({"text": text[start:end], "char_start": start})
        if end == len(text):
            break
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks

def _tokenize(text: str) -> list[str]:
    return _normalize(text).split()

def _bm25(query: str, chunks: list[dict], k1: float = 1.5, b: float = 0.75) -> list[tuple[float, dict]]:
    q_tokens = set(_tokenize(query))
    if not q_tokens or not chunks:
        return []
    lengths = [len(_tokenize(c["text"])) for c in chunks]
    avg_len = sum(lengths) / len(lengths) if lengths else 1
    n = len(chunks)
    df: dict[str, int] = defaultdict(int)
    for c in chunks:
        present = set(_tokenize(c["text"]))
        for t in q_tokens:
            if t in present:
                df[t] += 1
    scores = []
    for i, chunk in enumerate(chunks):
        tokens = _tokenize(chunk["text"])
        freq: dict[str, int] = defaultdict(int)
        for t in tokens:
            freq[t] += 1
        dl = lengths[i]
        score = 0.0
        for t in q_tokens:
            f = freq.get(t, 0)
            idf = math.log((n - df[t] + 0.5) / (df[t] + 0.5) + 1)
            score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * dl / avg_len))
        scores.append((score, chunk))
    return sorted(scores, key=lambda x: -x[0])

# ─── Field extraction patterns ────────────────────────────────────────────────
_APS_PAT = [
    re.compile(r'\baps\s+(?:of\s+)?(\d{2})\b', re.I),
    re.compile(r'minimum\s+aps[:\s]+(\d{2})', re.I),
    re.compile(r'(\d{2})\s+aps\b', re.I),
    re.compile(r'aps[:\s=]+(\d{2})\b', re.I),
]
_NQF_PAT = [
    re.compile(r'\bnqf\s+level\s+(\d+)\b', re.I),
    re.compile(r'level\s+(\d+)\s+nqf\b', re.I),
    re.compile(r'nqf[:\s]+(\d)\b', re.I),
]
_CREDITS_PAT = [
    re.compile(r'(\d{2,4})\s+credits?\b', re.I),
    re.compile(r'credits?[:\s]+(\d{2,4})\b', re.I),
    re.compile(r'total\s+credits?[:\s]+(\d{2,4})\b', re.I),
]
_DUR_PAT = [
    # range: "3-4 years" — single digit only so we don't match "21-22 years"
    (re.compile(r'\b([1-9])\s*[-–]\s*([1-9])\s+years?\b', re.I),  lambda m: f"{m.group(1)}-{m.group(2)} years",  0.85),
    # single duration: "3 years" / "3.5 years" — 1-9 only
    (re.compile(r'\b([1-9](?:\.\d)?)\s+years?\b', re.I),           lambda m: f"{m.group(1)} year{'s' if float(m.group(1)) != 1 else ''}", 0.82),
    # months: 6-36 months
    (re.compile(r'\b(6|9|12|18|24|30|36)\s+months?\b', re.I),     lambda m: f"{m.group(1)} months",               0.78),
    # explicit duration label
    (re.compile(r'duration[:\s]+(\d)\s+semesters?\b', re.I),       lambda m: f"{int(m.group(1))//2} year{'s' if int(m.group(1))//2 != 1 else ''}", 0.70),
]
_SAQA_PAT = [
    re.compile(r'saqa\s+(?:id|no|#|qual(?:ification)?)[:\s#]+(\d+)', re.I),
    re.compile(r'saqa[:\s]+(\d{5,8})\b', re.I),
]
_QCODE_PAT = [
    # Must be ALL-CAPS alphanumeric looking like a real code, not plain words
    re.compile(r'qual(?:ification)?\s+code[:\s]+([A-Z]{2,4}[0-9]{3,8})\b'),
    re.compile(r'\bcode[:\s]+([A-Z]{2,4}[0-9]{3,8})\b'),
]
_CAREER_START = re.compile(
    r'(?:career(?:s)?\s+(?:opportunities|options|prospects|paths?)|'
    r'you\s+(?:can|could|will|may)\s+(?:work|become|pursue)|'
    r'graduates?\s+(?:can|could|will|may)|'
    r'employment\s+opportunities|career\s+prospects)',
    re.I,
)
_MODULE_START = re.compile(
    r'(?:modules?|subjects?|curriculum|course\s+content|year\s+[12]|semester\s+[12])',
    re.I,
)

def _find_int(patterns, text, lo, hi) -> tuple[int | None, float]:
    for p in patterns:
        m = p.search(text)
        if m:
            v = int(m.group(1))
            if lo <= v <= hi:
                return v, 0.87
    return None, 0.0

def _extract_aps(text):     return _find_int(_APS_PAT, text, 10, 60)
def _extract_nqf(text):     return _find_int(_NQF_PAT, text, 1, 10)
def _extract_credits(text): return _find_int(_CREDITS_PAT, text, 60, 600)

def _extract_duration(text) -> tuple[str | None, float]:
    for pat, fmt, conf in _DUR_PAT:
        m = pat.search(text)
        if m:
            return fmt(m), conf
    return None, 0.0

def _extract_saqa(text) -> tuple[str | None, float]:
    for p in _SAQA_PAT:
        m = p.search(text)
        if m:
            return m.group(1), 0.88
    return None, 0.0

def _extract_qual_code(text) -> tuple[str | None, float]:
    for p in _QCODE_PAT:
        m = p.search(text)
        if m:
            return m.group(1), 0.75
    return None, 0.0

_STUDY_MODE_PAT = [
    (re.compile(r'\b(contact\s+and\s+distance|contact\s*/\s*distance)\b', re.I), "Contact and Distance", 0.88),
    (re.compile(r'\b(distance\s+learning|distance\s+education|correspondence)\b', re.I), "Distance Learning", 0.85),
    # "online learning / online course" — not just the word "online" in a URL
    (re.compile(r'\b(online\s+learning|online\s+course|online\s+study|online\s+programme)\b', re.I), "Online", 0.82),
    (re.compile(r'\bcontact\s+learning\b|\bcontact\s+session|\bcontact\s+tuition\b|\bfull[- ]time\s+contact\b', re.I), "Contact", 0.80),
    (re.compile(r'\bdelivery\s+mode[:\s]+contact\b', re.I), "Contact", 0.85),
    (re.compile(r'\bpart[- ]time\b', re.I), "Part-time", 0.75),
    (re.compile(r'\bfull[- ]time\b', re.I), "Full-time", 0.75),
]

def _extract_study_mode(text) -> tuple[str | None, float]:
    for pat, mode, conf in _STUDY_MODE_PAT:
        if pat.search(text):
            return mode, conf
    return None, 0.0

def _extract_career_outcomes(text) -> tuple[list[str], float]:
    m = _CAREER_START.search(text)
    if not m:
        return [], 0.0
    snippet = text[m.start(): m.start() + 700]
    items = re.findall(r'[•\-\*]\s*([^\n•\-\*]{5,80})', snippet)
    if not items:
        lines = [l.strip() for l in snippet.split('\n') if 8 < len(l.strip()) < 80]
        items = lines[1:6]
    careers = [re.sub(r'\s+', ' ', i).strip() for i in items if i.strip()][:8]
    return careers, 0.72 if careers else 0.0

_MOD_REJECT = re.compile(
    r'\b(minimum|requirement|subject|aps|english|mathematics|diploma|bachelor|'
    r'certificate|degree|faculty|campus|apply|register|home language|language)\b',
    re.I,
)

def _extract_modules(text) -> tuple[list[str], float]:
    m = _MODULE_START.search(text)
    if not m:
        return [], 0.0
    snippet = text[m.start(): m.start() + 1000]
    # Require bullet-point style items — not arbitrary lines
    items = re.findall(r'[•\*]\s*([^\n•\*]{10,80})', snippet)
    mods = []
    for item in items:
        clean = re.sub(r'\s+', ' ', item).strip()
        # Reject items that are clearly admission criteria or qualification names
        if _MOD_REJECT.search(clean):
            continue
        # Reject if it's mostly numbers/codes
        if sum(c.isdigit() for c in clean) > len(clean) * 0.4:
            continue
        mods.append(clean)
    mods = mods[:12]
    return mods, 0.72 if len(mods) >= 2 else 0.0

def _extract_campuses(text, institution_campuses) -> tuple[list[str], float]:
    found = []
    n = _normalize(text)
    for c in institution_campuses:
        cname = c.get("name", "")
        if cname and _normalize(cname) in n:
            found.append(cname)
    return (found, 0.78) if found else ([], 0.0)

# ─── Data Index ────────────────────────────────────────────────────────────────
class DataIndex:
    def __init__(self):
        self.json_by_institution: dict[str, list[dict]] = defaultdict(list)
        self.adm_by_institution:  dict[str, list[dict]] = defaultdict(list)
        self.pdf_texts:  dict[str, str]         = {}
        self.pdf_chunks: dict[str, list[dict]]  = {}
        self.institution_to_files: dict[str, list[str]] = defaultdict(list)

    # ── JSON sources ──────────────────────────────────────────────────────────
    def build_json_index(self):
        with Section("Building JSON source index"):
            json_scan_dirs = [
                BASE / "generated/v1",
                BASE / "generated/v2",
                BASE / "generated/v3",
                BASE / "output/v1",
            ]
            root_files = [
                BASE / "enriched_universities.json",
                BASE / "courses.json",
                BASE / "prospectus_results.json",
            ]
            prog_keys  = ["programmes.json", "programmes.final.json", "programmes.raw.json"]
            adm_keys   = ["admissions.json", "admissions.final.json", "admissions.raw.json",
                          "admission-requirements.json", "admissions_rules.json", "aps-rules.json"]

            prog_total = 0
            adm_total  = 0

            def _ingest_programmes(data: Any, src: str):
                nonlocal prog_total
                if isinstance(data, list):
                    for item in data:
                        if not isinstance(item, dict):
                            continue
                        iid = str(item.get("institution_id") or item.get("institutionId") or "")
                        if iid:
                            self.json_by_institution[iid].append(item)
                            prog_total += 1
                elif isinstance(data, dict):
                    if "programmes" in data:
                        _ingest_programmes(data["programmes"], src)
                    else:
                        for v in data.values():
                            if isinstance(v, list):
                                _ingest_programmes(v, src)

            def _ingest_admissions(data: Any, src: str):
                nonlocal adm_total
                if isinstance(data, list):
                    for item in data:
                        if not isinstance(item, dict):
                            continue
                        iid = str(item.get("institution_id") or item.get("institutionId") or "")
                        if iid:
                            self.adm_by_institution[iid].append(item)
                            adm_total += 1
                elif isinstance(data, dict):
                    for key in ("admissions", "requirements", "aps_rules",
                                "admission_requirements", "rules"):
                        if key in data:
                            _ingest_admissions(data[key], src)
                            return
                    for v in data.values():
                        if isinstance(v, list):
                            _ingest_admissions(v, src)

            for d in json_scan_dirs:
                for fname in prog_keys:
                    fp = d / fname
                    if fp.exists():
                        try:
                            _ingest_programmes(json.loads(fp.read_text()), str(fp))
                            log(f"Loaded programmes: {fp.relative_to(BASE)}", "ok", 1)
                        except Exception as e:
                            log(f"Failed {fp.name}: {e}", "warn", 1)
                for fname in adm_keys:
                    fp = d / fname
                    if fp.exists():
                        try:
                            _ingest_admissions(json.loads(fp.read_text()), str(fp))
                            log(f"Loaded admissions: {fp.relative_to(BASE)}", "ok", 1)
                        except Exception as e:
                            log(f"Failed {fp.name}: {e}", "warn", 1)

            for fp in root_files:
                if fp.exists():
                    try:
                        _ingest_programmes(json.loads(fp.read_text()), str(fp))
                        log(f"Loaded root file: {fp.relative_to(BASE)}", "ok", 1)
                    except Exception:
                        pass

            inst_with_data = len(self.json_by_institution)
            log(f"JSON programmes indexed : {prog_total:,} entries across {inst_with_data} institutions", "data", 1)
            log(f"Admission rules indexed : {adm_total:,} entries", "data", 1)

    # ── PDF / text sources ────────────────────────────────────────────────────
    def build_pdf_index(self, institution_slugs: dict[str, str],
                        target_ids: list[str] | None = None):
        with Section("Building PDF / prospectus index"):
            # Load existing mappings
            mapping_file = BASE / "prospectus_file_mapping.json"
            if mapping_file.exists():
                try:
                    data = json.loads(mapping_file.read_text())
                    for entry in data.get("mappings", []):
                        iid = str(entry.get("institutionId", ""))
                        for f in entry.get("files", []):
                            full = str(BASE / f)
                            if full not in self.institution_to_files[iid]:
                                self.institution_to_files[iid].append(full)
                    log(f"Loaded {len(data.get('mappings',[]))} pre-existing mappings", "ok", 1)
                except Exception as e:
                    log(f"Mapping file error: {e}", "warn", 1)

            # Auto-match by filename ↔ slug similarity
            all_sources = (
                list(PROSP_DIR.glob("*.pdf")) +
                list(PROSP_DIR.glob("*.txt")) +
                list((BASE / "workik/batch1").glob("*.pdf"))
            )
            already_mapped = {f for fl in self.institution_to_files.values() for f in fl}
            new_mappings = 0

            # Generic tokens that appear in almost every institution name — penalise them
            GENERIC_TOKENS = {
                "university", "college", "of", "the", "and", "tvet",
                "technology", "sector", "education", "training", "authority",
                "institute", "institution", "seta",
            }

            for iid, slug in institution_slugs.items():
                if target_ids and iid not in target_ids:
                    continue
                slug_tokens = set(re.split(r"[-_\s]", _normalize(slug)))
                slug_tokens.discard("")
                # Specific tokens = slug tokens that aren't generic
                specific_tokens = slug_tokens - GENERIC_TOKENS
                if not specific_tokens:
                    specific_tokens = slug_tokens  # fallback if all are generic

                for src in all_sources:
                    src_str = str(src)
                    if src_str in already_mapped:
                        continue
                    src_tokens = set(re.split(r"[-_\s]", _normalize(src.stem)))
                    src_tokens.discard("")
                    # Must match on specific (non-generic) tokens
                    specific_overlap = specific_tokens & src_tokens
                    if not specific_overlap:
                        continue
                    # Score based on specific token coverage
                    score = len(specific_overlap) / max(len(specific_tokens), 1)
                    if score >= 0.6:
                        self.institution_to_files[iid].append(src_str)
                        already_mapped.add(src_str)
                        new_mappings += 1
                        log(f"[{iid}] Auto-mapped: {src.name}  (specific_score={score:.2f}, matched={specific_overlap})", "data", 1)

            log(f"New auto-mappings: {new_mappings}", "data", 1)

            # Extract text only for institutions we'll process
            process_ids = set(target_ids) if target_ids else set(institution_slugs.keys())
            files_to_extract = {
                f for iid in process_ids
                for f in self.institution_to_files.get(iid, [])
            }

            log(f"Extracting text from {len(files_to_extract)} file(s)...", "info", 1)
            for src_str in sorted(files_to_extract):
                src = Path(src_str)
                if not src.exists():
                    log(f"Missing: {src.name}", "warn", 2)
                    continue
                if src_str in self.pdf_texts:
                    continue
                size_kb = src.stat().st_size // 1024
                log(f"Extracting: {src.name} ({size_kb} KB)", "info", 2)
                t0 = time.time()
                text = _extract_pdf_text(src) if src.suffix.lower() == ".pdf" \
                       else _extract_text_file(src)
                elapsed = time.time() - t0
                self.pdf_texts[src_str] = text
                self.pdf_chunks[src_str] = _chunk_text(text)
                char_count = len(text)
                chunk_count = len(self.pdf_chunks[src_str])
                log(f"↳ {char_count:,} chars → {chunk_count} chunks  [{elapsed:.1f}s]", "ok", 2)

            log(f"PDF index ready: {len(self.pdf_texts)} files", "data", 1)


# ─── Programme enricher ────────────────────────────────────────────────────────
class ProgrammeEnricher:
    def __init__(self, index: DataIndex):
        self.index = index

    # ── JSON match ────────────────────────────────────────────────────────────
    def _find_json_matches(self, prog_name: str, inst_id: str) -> list[tuple[float, dict]]:
        candidates = self.index.json_by_institution.get(inst_id, [])
        results = []
        for cand in candidates:
            cname = cand.get("name") or cand.get("programme_name") or ""
            if not cname:
                continue
            sim = _programme_similarity(prog_name, cname)
            if sim >= 0.35:
                results.append((sim, cand))
        return sorted(results, key=lambda x: -x[0])[:5]

    def _find_adm_matches(self, prog_name: str, inst_id: str) -> list[tuple[float, dict]]:
        candidates = self.index.adm_by_institution.get(inst_id, [])
        results = []
        for cand in candidates:
            cname = cand.get("programme_name") or ""
            if not cname:
                continue
            sim = _programme_similarity(prog_name, cname)
            if sim >= 0.35:
                results.append((sim, cand))
        return sorted(results, key=lambda x: -x[0])[:5]

    # ── PDF search ────────────────────────────────────────────────────────────
    def _search_pdf_for_programme(
        self, prog_name: str, inst_id: str
    ) -> list[tuple[float, dict, str]]:
        files = self.index.institution_to_files.get(inst_id, [])
        results = []
        for src_str in files:
            chunks = self.index.pdf_chunks.get(src_str, [])
            if not chunks:
                continue
            scored = _bm25(prog_name, chunks)
            for score, chunk in scored[:4]:
                if score > 0.5:
                    results.append((score, chunk, src_str))
        return sorted(results, key=lambda x: -x[0])[:8]

    # ── Core enrichment ───────────────────────────────────────────────────────
    def enrich_programme(
        self, prog: dict, inst_id: str, inst_campuses: list[dict],
        verbose: bool = False
    ) -> tuple[dict, list[dict]]:
        prog_name = prog.get("name", "")
        enriched  = dict(prog)
        evidence: list[dict] = []

        def _apply(field: str, value: Any, conf: float, source: str,
                   src_file: str = "", method: str = ""):
            if value is None or value == "" or value == [] or value == {}:
                return
            current = enriched.get(field)
            if current not in (None, "", [], {}) and conf <= 0.90:
                return  # don't overwrite existing data with low-conf value
            enriched[field] = value
            evidence.append({
                "field":         field,
                "value":         value if not isinstance(value, list) else value[:3],
                "confidence":    round(conf, 3),
                "source":        source,
                "sourceFile":    src_file,
                "matchingMethod": method,
            })
            if verbose:
                v_short = str(value)[:60].replace('\n', ' ')
                log(f"  SET {field} = {v_short}  [{source} conf={conf:.2f}]", "ok", 3)

        # ── Derive qualification type from name ────────────────────────────
        if not enriched.get("qualification_type"):
            qt = _extract_qual_type(prog_name)
            if qt:
                _apply("qualification_type", qt, 0.72, "derived", method="name-pattern")

        # ── JSON programme matches ────────────────────────────────────────
        json_matches = self._find_json_matches(prog_name, inst_id)
        if verbose and json_matches:
            log(f"  JSON matches: {[(round(s,2), c.get('name','?')) for s,c in json_matches[:3]]}", "data", 2)

        for sim, cand in json_matches:
            src_file = cand.get("source_file") or cand.get("sourceFile") or ""
            method   = f"json-sim:{sim:.2f}"
            conf     = sim * 0.88
            field_map = [
                ("nqf_level",      ["nqf_level"]),
                ("duration",       ["duration"]),
                ("study_mode",     ["study_mode"]),
                ("credits",        ["credits"]),
                ("programme_code", ["programme_code"]),
                ("saqa_code",      ["saqa_code"]),
                ("faculty_name",   ["faculty_name", "faculty"]),
                ("department",     ["department"]),
                ("career_outcomes",["career_outcomes", "career_opportunities"]),
                ("campus",         ["campus"]),
            ]
            for dest, keys in field_map:
                for k in keys:
                    v = cand.get(k)
                    if v not in (None, "", [], {}):
                        _apply(dest, v, conf, "json", src_file, method)
                        break

        # ── JSON admission matches ────────────────────────────────────────
        adm_matches = self._find_adm_matches(prog_name, inst_id)
        if verbose and adm_matches:
            log(f"  Admission matches: {[(round(s,2), c.get('programme_name','?')) for s,c in adm_matches[:3]]}", "data", 2)

        for sim, adm in adm_matches:
            src_file  = adm.get("source_file") or ""
            rule_type = adm.get("rule_type") or adm.get("ruleType") or ""
            method    = f"adm-sim:{sim:.2f}"

            if "aps" in rule_type.lower():
                aps_val = adm.get("aps_minimum") or adm.get("min_aps")
                if aps_val:
                    _apply("min_aps", int(aps_val), round(sim * 0.90, 3),
                           "json-admission", src_file, method)

            subj_comp = adm.get("subjects_compulsory") or []
            subj_or   = adm.get("subject_or_groups") or []
            if subj_comp or subj_or:
                _apply("admissionRequirements",
                       {"subjects_compulsory": subj_comp, "subject_or_groups": subj_or},
                       round(sim * 0.85, 3), "json-admission", src_file, method)

        # ── PDF / prospectus search ──────────────────────────────────────
        pdf_results = self._search_pdf_for_programme(prog_name, inst_id)
        if verbose and pdf_results:
            log(f"  PDF chunks found: {len(pdf_results)}, top BM25={pdf_results[0][0]:.1f}", "data", 2)

        for bm25_score, chunk, src_file in pdf_results:
            text      = chunk["text"]
            conf_base = min(bm25_score / 35.0, 1.0) * 0.90
            if conf_base < 0.12:
                continue
            method   = f"pdf-bm25:{bm25_score:.1f}"
            src_name = Path(src_file).name

            for extractor, field in [
                (_extract_aps,       "min_aps"),
                (_extract_nqf,       "nqf_level"),
                (_extract_credits,   "credits"),
                (_extract_saqa,      "saqa_code"),
                (_extract_qual_code, "qualification_code"),
            ]:
                val, c = extractor(text)
                if val is not None:
                    _apply(field, val, round(c * conf_base, 3), "prospectus", src_name, method)

            dur, c = _extract_duration(text)
            if dur:
                _apply("duration", dur, round(c * conf_base, 3), "prospectus", src_name, method)

            mode, c = _extract_study_mode(text)
            if mode:
                _apply("study_mode", mode, round(c * conf_base, 3), "prospectus", src_name, method)

            careers, c = _extract_career_outcomes(text)
            if careers:
                _apply("career_outcomes", careers, round(c * conf_base, 3), "prospectus", src_name, method)

            mods, c = _extract_modules(text)
            if mods:
                _apply("modules", mods, round(c * conf_base, 3), "prospectus", src_name, method)

            camps, c = _extract_campuses(text, inst_campuses)
            if camps:
                _apply("campuses_offering", camps, round(c * conf_base, 3), "prospectus", src_name, method)

        return enriched, evidence


# ─── Completeness scoring ─────────────────────────────────────────────────────
TARGET_FIELDS = [
    "qualification_type", "nqf_level", "duration", "credits",
    "min_aps", "faculty_name", "career_outcomes", "study_mode",
    "department", "programme_code", "saqa_code", "admissionRequirements",
    "campus", "modules", "qualification_code",
]

def _completeness(prog: dict) -> float:
    present = sum(1 for f in TARGET_FIELDS if prog.get(f) not in (None, "", [], {}))
    return round(present / len(TARGET_FIELDS), 3)

def _quality_summary(progs: list[dict]) -> dict:
    scores = [_completeness(p) for p in progs]
    if not scores:
        return {"mean": 0, "min": 0, "max": 0, "count": 0}
    return {
        "mean":  round(sum(scores) / len(scores), 3),
        "min":   round(min(scores), 3),
        "max":   round(max(scores), 3),
        "count": len(scores),
    }

# ─── Bar renderer ─────────────────────────────────────────────────────────────
def _bar(value: float, width: int = 20) -> str:
    filled = round(value * width)
    return f"[{'█' * filled}{'░' * (width - filled)}] {value:.0%}"


# ─── Main pipeline ─────────────────────────────────────────────────────────────
def run():
    global INDENT
    test_mode  = ARGS.test
    only_ids   = set(ARGS.inst) if ARGS.inst else None
    max_progs  = ARGS.max_progs if ARGS.max_progs else (5 if test_mode else None)

    if test_mode and not only_ids:
        # Default test institution: University of Fort Hare (363)
        only_ids = {"363"}

    start_time = time.time()
    log("=" * 60, "info")
    log("SA HE Data Enrichment Pipeline", "head")
    if test_mode:
        log("MODE: TEST  (limited institutions + programmes)", "warn")
    log(f"Target institution IDs: {list(only_ids) if only_ids else 'ALL'}", "info")
    log("=" * 60, "info")

    # Discover institution files
    inst_files = sorted(INST_DIR.glob("*.rich.json"))
    institution_slugs: dict[str, str] = {}
    for fp in inst_files:
        m = re.match(r"institution-(\d+)-(.*?)\.rich\.json", fp.name)
        if m:
            institution_slugs[m.group(1)] = m.group(2)

    log(f"Found {len(inst_files)} institution files in total", "info")

    # Filter if needed
    if only_ids:
        inst_files = [fp for fp in inst_files
                      if re.match(r"institution-(\d+)-", fp.name) and
                         re.match(r"institution-(\d+)-", fp.name).group(1) in only_ids]
        log(f"Filtered to {len(inst_files)} institution(s)", "info")

    # Build indexes
    idx = DataIndex()
    idx.build_json_index()
    idx.build_pdf_index(
        institution_slugs,
        target_ids=list(only_ids) if only_ids else None
    )

    enricher = ProgrammeEnricher(idx)

    # ── Per-institution processing ────────────────────────────────────────────
    pipeline_stats = {
        "institutions_processed": 0,
        "total_programmes": 0,
        "total_field_enrichments": 0,
    }

    log("\n" + "─" * 60, "info")
    log("ENRICHMENT PHASE", "head")
    log("─" * 60, "info")

    for fp in inst_files:
        m = re.match(r"institution-(\d+)-(.*?)\.rich\.json", fp.name)
        if not m:
            continue
        inst_id, slug = m.group(1), m.group(2)

        with Section(f"[{inst_id}] {slug.replace('-', ' ').title()}"):
            # Load institution
            try:
                institution = json.loads(fp.read_text())
            except Exception as e:
                log(f"Cannot read file: {e}", "error")
                continue

            meta      = institution.get("meta", {})
            inst_name = meta.get("name", slug)
            campuses  = institution.get("campuses", [])
            programmes = institution.get("programmes", [])

            log(f"Institution : {inst_name}", "data")
            log(f"Programmes  : {len(programmes)} total", "data")
            log(f"Campuses    : {len(campuses)}", "data")
            pdf_files = idx.institution_to_files.get(inst_id, [])
            log(f"Prosp. files: {len(pdf_files)} — {[Path(f).name for f in pdf_files]}", "data")

            if not programmes:
                log("No programmes found — skipping", "skip")
                continue

            # Optionally cap programmes (test mode)
            progs_to_run = programmes[:max_progs] if max_progs else programmes
            if max_progs and len(programmes) > max_progs:
                log(f"Capped to {max_progs} programmes (test mode)", "warn")

            # Before scores
            before_scores = [_completeness(p) for p in progs_to_run]
            avg_before    = sum(before_scores) / len(before_scores) if before_scores else 0
            log(f"Completeness before: {_bar(avg_before)}", "info")

            enriched_progs: list[dict] = []
            all_evidence:   list[dict] = []
            field_hit_counts:  dict[str, int] = defaultdict(int)
            field_miss_counts: dict[str, int] = defaultdict(int)
            confidence_vals:   list[float]    = []

            with Section("Enriching programmes"):
                for i, prog in enumerate(progs_to_run):
                    pname = prog.get("name", f"prog#{i}")
                    verbose = test_mode  # only print per-field detail in test mode

                    log(f"[{i+1}/{len(progs_to_run)}] {pname}", "info")
                    before_c = _completeness(prog)

                    ep, evidence = enricher.enrich_programme(
                        prog, inst_id, campuses, verbose=verbose
                    )

                    enriched_progs.append(ep)
                    all_evidence.extend(evidence)

                    for e in evidence:
                        field_hit_counts[e["field"]] += 1
                        confidence_vals.append(e["confidence"])
                        pipeline_stats["total_field_enrichments"] += 1

                    for f in TARGET_FIELDS:
                        if ep.get(f) in (None, "", [], {}):
                            field_miss_counts[f] += 1

                    after_c = _completeness(ep)
                    delta   = after_c - before_c
                    delta_s = f"+{delta:.0%}" if delta > 0 else "no change"
                    new_fields = [e["field"] for e in evidence]
                    log(f"  ↳ completeness {before_c:.0%} → {after_c:.0%}  ({delta_s})"
                        f"  fields set: {new_fields if new_fields else '—'}", "ok")

            # For non-capped progs, copy through unenriched ones unchanged
            if max_progs and len(programmes) > max_progs:
                enriched_progs.extend(programmes[max_progs:])

            after_scores = [_completeness(p) for p in enriched_progs[:len(progs_to_run)]]
            avg_after    = sum(after_scores) / len(after_scores) if after_scores else 0
            improvement  = avg_after - avg_before

            log(f"Completeness after : {_bar(avg_after)}", "info")
            log(f"Improvement        : {improvement:+.1%}", "data")
            log(f"Fields enriched    : {sum(field_hit_counts.values())} total", "data")

            if field_hit_counts:
                log(f"Fields touched     : {dict(sorted(field_hit_counts.items(), key=lambda x:-x[1]))}", "data")
            top_missing = [f for f, cnt in sorted(field_miss_counts.items(), key=lambda x:-x[1])
                           if cnt == len(progs_to_run)]
            if top_missing:
                log(f"Still all-missing  : {top_missing}", "warn")

            # ── Write outputs ─────────────────────────────────────────────
            with Section("Writing outputs"):
                out_base = OUT_DIR / f"institution-{inst_id}-{slug}"

                enriched_inst = dict(institution)
                enriched_inst["programmes"] = enriched_progs
                enriched_inst["_enrichment"] = {
                    "pipeline_version":    "1.1",
                    "enriched_at":         time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                    "test_mode":           test_mode,
                    "completeness_before": round(avg_before, 3),
                    "completeness_after":  round(avg_after,  3),
                    "improvement":         round(improvement, 3),
                    "fields_enriched":     sum(field_hit_counts.values()),
                    "prospectus_files":    idx.institution_to_files.get(inst_id, []),
                }
                with open(f"{out_base}.json", "w", encoding="utf-8") as f:
                    json.dump(enriched_inst, f, indent=2, ensure_ascii=False)
                log(f"institution.json  → {out_base.name}.json", "ok")

                # Research metadata
                conf_dist: dict[str, int] = {"high≥0.8": 0, "mid 0.5-0.8": 0, "low<0.5": 0}
                for c in confidence_vals:
                    if c >= 0.8:   conf_dist["high≥0.8"] += 1
                    elif c >= 0.5: conf_dist["mid 0.5-0.8"] += 1
                    else:          conf_dist["low<0.5"] += 1

                research_meta = {
                    "institution_id":   inst_id,
                    "institution_name": inst_name,
                    "sources_used":     list({e["sourceFile"] for e in all_evidence if e["sourceFile"]}),
                    "prospectus_files": idx.institution_to_files.get(inst_id, []),
                    "evidence":         all_evidence[:600],
                    "confidence_distribution": conf_dist,
                    "confidence_mean":  round(sum(confidence_vals) / len(confidence_vals), 3)
                                        if confidence_vals else 0,
                }
                with open(f"{out_base}.research.json", "w", encoding="utf-8") as f:
                    json.dump(research_meta, f, indent=2, ensure_ascii=False)
                log(f"research.json     → {out_base.name}.research.json", "ok")

                # Completion report
                report = {
                    "institution_id":        inst_id,
                    "institution_name":      inst_name,
                    "programme_count":       len(programmes),
                    "programmes_enriched":   len(progs_to_run),
                    "completeness_before":   round(avg_before, 3),
                    "completeness_after":    round(avg_after,  3),
                    "improvement":           round(improvement, 3),
                    "overall_quality":       _quality_summary(enriched_progs[:len(progs_to_run)]),
                    "fields_completed":      dict(field_hit_counts),
                    "fields_still_missing":  {f: c for f, c in field_miss_counts.items() if c > 0},
                    "per_programme": [
                        {
                            "name":               p.get("name", ""),
                            "completeness_before": round(before_scores[i], 3),
                            "completeness_after":  round(after_scores[i], 3),
                        }
                        for i, p in enumerate(progs_to_run)
                    ],
                }
                with open(f"{out_base}.report.json", "w", encoding="utf-8") as f:
                    json.dump(report, f, indent=2, ensure_ascii=False)
                log(f"report.json       → {out_base.name}.report.json", "ok")

            pipeline_stats["institutions_processed"] += 1
            pipeline_stats["total_programmes"]       += len(progs_to_run)

    # ── Final summary ─────────────────────────────────────────────────────────
    elapsed = time.time() - start_time
    log("\n" + "=" * 60, "info")
    log("PIPELINE COMPLETE", "head")
    log(f"  Elapsed              : {elapsed:.1f}s", "data")
    log(f"  Institutions done    : {pipeline_stats['institutions_processed']}", "data")
    log(f"  Programmes processed : {pipeline_stats['total_programmes']}", "data")
    log(f"  Total fields written : {pipeline_stats['total_field_enrichments']}", "data")
    log(f"  Output directory     : {OUT_DIR}", "data")
    log("=" * 60, "info")


if __name__ == "__main__":
    run()
