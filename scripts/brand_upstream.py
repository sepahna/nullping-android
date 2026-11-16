#!/usr/bin/env python3
"""Apply the minimal Null Ping brand overlay to the pinned upstream checkout."""
from pathlib import Path
import re
import sys

root = Path(sys.argv[1]).resolve()
strings = root / "V2rayNG/app/src/main/res/values/strings.xml"
if not strings.is_file():
    raise SystemExit(f"Missing upstream resource file: {strings}")

source = strings.read_text(encoding="utf-8")
updated, count = re.subn(
    r'(<string\s+name="app_name"[^>]*>).*?(</string>)',
    r'\1Null Ping\2',
    source,
    count=1,
    flags=re.DOTALL,
)
if count != 1:
    raise SystemExit("Could not safely locate the upstream app_name resource")
strings.write_text(updated, encoding="utf-8")
print("Applied Null Ping launcher label. Core and applicationId remain upstream unchanged.")
