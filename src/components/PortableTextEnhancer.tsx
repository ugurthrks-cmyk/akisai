"use client";

import { useEffect } from "react";

function enhanceAlternativesSection(root: Element) {
  const headings = Array.from(root.querySelectorAll("h2"));
  const heading = headings.find((candidate) =>
    candidate.textContent?.trim().toLocaleLowerCase("tr-TR").startsWith("alternatif ai sunum araçları karşılaştırması"),
  );

  if (!heading) {
    return;
  }

  const intro = heading.nextElementSibling;

  if (!intro || intro.tagName !== "P") {
    return;
  }

  const sectionNodes: HTMLParagraphElement[] = [];
  let current = intro.nextElementSibling;

  while (current && current.tagName === "P") {
    sectionNodes.push(current as HTMLParagraphElement);
    current = current.nextElementSibling;
  }

  if (sectionNodes.length < 15 || sectionNodes.length % 5 !== 0) {
    return;
  }

  if ((intro as HTMLElement).dataset.alternativesEnhanced === "true") {
    return;
  }

  const [headerA, headerB, headerC, headerD, headerE, ...cellNodes] = sectionNodes;
  const headers = [headerA, headerB, headerC, headerD, headerE].map((node) => node.textContent?.trim() || "");

  if (headers.some((header) => !header)) {
    return;
  }

  const section = document.createElement("section");
  section.className = "portable-alternatives-list";
  section.setAttribute("aria-label", headers[0]);

  const scroll = document.createElement("div");
  scroll.className = "portable-alternatives-scroll";

  const table = document.createElement("table");
  table.className = "portable-alternatives-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = header;
    headRow.appendChild(th);
  });

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (let index = 0; index < cellNodes.length; index += headers.length) {
    const row = document.createElement("tr");
    const rowCells = cellNodes.slice(index, index + headers.length).map((node) => node.textContent?.trim() || "");

    if (rowCells.length !== headers.length || rowCells.some((cell) => !cell)) {
      return;
    }

    const rowHeading = document.createElement("th");
    rowHeading.scope = "row";
    rowHeading.textContent = rowCells[0];
    row.appendChild(rowHeading);

    rowCells.slice(1).forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      row.appendChild(td);
    });

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  scroll.appendChild(table);
  section.appendChild(scroll);
  intro.insertAdjacentElement("afterend", section);

  sectionNodes.forEach((node) => node.remove());
  (intro as HTMLElement).dataset.alternativesEnhanced = "true";
}

export default function PortableTextEnhancer() {
  useEffect(() => {
    document.querySelectorAll("[data-portable-content]").forEach((root) => {
      enhanceAlternativesSection(root);
    });
  }, []);

  return null;
}
