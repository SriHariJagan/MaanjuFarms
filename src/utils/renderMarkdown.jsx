import React from "react";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export function renderMarkdown(text) {
  if (!text) return "";

  const html = escapeHtml(text)
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^(\d+)\. /gm, "")
    .replace(/^- /gm, "")
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");

  return html;
}

export function MarkdownBlock({ content }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let inList = false;
  let listItems = [];
  let listType = null;

  const flushList = (key) => {
    if (listItems.length === 0) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    elements.push(<Tag key={key}>{listItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</Tag>);
    listItems = [];
    inList = false;
    listType = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headers
    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (hMatch) {
      flushList(`list-${idx}`);
      const Tag = `h${hMatch[1].length + 1}`;
      elements.push(<Tag key={idx} dangerouslySetInnerHTML={{ __html: inlineMarkdown(escapeHtml(hMatch[2])) }} />);
      return;
    }

    // Ordered list
    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList) { flushList(`list-${idx}`); inList = true; listType = "ol"; }
      listItems.push(inlineMarkdown(escapeHtml(olMatch[1])));
      return;
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (!inList) { flushList(`list-${idx}`); inList = true; listType = "ul"; }
      listItems.push(inlineMarkdown(escapeHtml(ulMatch[1])));
      return;
    }

    // Empty line = paragraph break
    if (trimmed === "") {
      flushList(`list-${idx}`);
      return;
    }

    // Regular paragraph
    flushList(`list-${idx}`);
    elements.push(<p key={idx} dangerouslySetInnerHTML={{ __html: inlineMarkdown(escapeHtml(trimmed)) }} />);
  });

  flushList(`flush-end`);

  return elements;
}

function inlineMarkdown(html) {
  return html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}
