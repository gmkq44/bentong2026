#!/usr/bin/env python3
"""把 index.html 转成 Artifact 用的内容档（去掉外层 shell 与外部 script）。

Artifact 发布时会自己包上 <!doctype html><head>…</head><body>，
所以这里只取 <title>、<style> 与 <body> 内容。
外部 script（firebase-config.js）也去掉 —— Artifact 的 CSP 禁止对外请求，
页面会自动退回代码汇总模式。
"""
import re
import sys
import pathlib

SRC = pathlib.Path(__file__).parent / "index.html"


def build(src: str) -> str:
    head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", src, re.S).group(1)
    keep = "".join(re.findall(r"<title>.*?</title>|<style>.*?</style>", head, re.S))
    body = re.sub(r'\s*<script src="[^"]*"></script>', "", body)
    return keep + "\n" + body


if __name__ == "__main__":
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path("artifact.html")
    text = build(SRC.read_text(encoding="utf-8"))
    out.write_text(text, encoding="utf-8")
    print(f"{out} · {len(text):,} bytes")
