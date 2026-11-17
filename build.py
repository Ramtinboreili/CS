#!/usr/bin/env python3
"""Concatenate src/parts/* in order into index.html. Usage: python3 build.py"""
import pathlib
ORDER="p01_head.html p02_sql.js p03_lib.js p04_core.js p04b_lab.js p05_wA.js p06_wB.js p07_wC.js p08_wX.js c_A1.js c_A2.js c_B1.js c_B2.js c_C1.js c_C2.js c_X.js l_A.js l_B.js p99_tail.html".split()
root=pathlib.Path(__file__).parent
out="".join((root/"src/parts"/n).read_text(encoding="utf-8") for n in ORDER)
(root/"index.html").write_text(out,encoding="utf-8",newline="")
print("index.html", len(out.encode()), "bytes")
