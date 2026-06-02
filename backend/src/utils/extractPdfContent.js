const pdfParse = require("pdf-parse");
const { PdfReader } = require("pdfreader");

const TABLE_COLUMN_GAP = 1.5;
const MIN_TABLE_COLUMNS = 2;
const MIN_TABLE_ROWS = 2;

const parsePdfItems = (buffer) =>
  new Promise((resolve, reject) => {
    const pages = [];
    let currentPage = [];

    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
        return;
      }

      if (!item) {
        if (currentPage.length) {
          pages.push(currentPage);
        }

        resolve(pages);
        return;
      }

      if (item.page) {
        if (currentPage.length) {
          pages.push(currentPage);
        }

        currentPage = [];
        return;
      }

      if (item.text) {
        currentPage.push({
          text: item.text.trim(),
          x: item.x,
          y: item.y,
        });
      }
    });
  });

const groupRows = (items) => {
  const rows = [];

  items
    .filter((item) => item.text)
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .forEach((item) => {
      const row = rows.find((candidate) => Math.abs(candidate.y - item.y) < 0.35);

      if (row) {
        row.items.push(item);
        row.y = (row.y + item.y) / 2;
        return;
      }

      rows.push({
        y: item.y,
        items: [item],
      });
    });

  return rows.map((row) =>
    row.items.sort((a, b) => a.x - b.x)
  );
};

const rowToCells = (row) => {
  const cells = [];

  row.forEach((item) => {
    const previous = cells[cells.length - 1];

    if (previous && item.x - previous.lastX < TABLE_COLUMN_GAP) {
      previous.text = `${previous.text} ${item.text}`;
      previous.lastX = item.x;
      return;
    }

    cells.push({
      text: item.text,
      lastX: item.x,
    });
  });

  return cells.map((cell) => cell.text);
};

const escapeMarkdownCell = (value) =>
  value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();

const tableToMarkdown = (rows) => {
  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalizedRows = rows.map((row) =>
    Array.from({ length: columnCount }, (_, index) =>
      escapeMarkdownCell(row[index] || "")
    )
  );

  const [header, ...body] = normalizedRows;
  const separator = Array.from({ length: columnCount }, () => "---");

  return [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...body.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
};

const extractTables = (pages) => {
  const tables = [];

  pages.forEach((items, pageIndex) => {
    const rows = groupRows(items).map(rowToCells);

    let currentTable = [];

    rows.forEach((row) => {
      if (row.length >= MIN_TABLE_COLUMNS) {
        currentTable.push(row);
        return;
      }

      if (currentTable.length >= MIN_TABLE_ROWS) {
        tables.push({
          page: pageIndex + 1,
          rows: currentTable,
        });
      }

      currentTable = [];
    });

    if (currentTable.length >= MIN_TABLE_ROWS) {
      tables.push({
        page: pageIndex + 1,
        rows: currentTable,
      });
    }
  });

  return tables;
};

const extractPdfContent = async (buffer) => {
  const pdfData = await pdfParse(buffer);
  const text = pdfData.text?.trim() || "";
  let tables = [];

  try {
    const pages = await parsePdfItems(buffer);
    tables = extractTables(pages);
  } catch (err) {
    console.error("PDF table extraction failed:", err.message);
  }

  const tableText = tables
    .map(
      (table, index) =>
        `[Table ${index + 1} - Page ${table.page}]\n${tableToMarkdown(table.rows)}`
    )
    .join("\n\n");

  return {
    text,
    tables,
    content: [text, tableText].filter(Boolean).join("\n\n"),
  };
};

module.exports = extractPdfContent;
