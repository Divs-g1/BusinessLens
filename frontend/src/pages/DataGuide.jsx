
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  FileSpreadsheet,
  Lightbulb,
  ShieldCheck,
  Table2,
  UploadCloud,
  X,
} from "lucide-react";

const sampleRows = [
  ["ORD001", "2026-01-05", "Laptop", "Electronics", 2, 120000, 90000, "North", "Online"],
  ["ORD002", "2026-01-08", "Office Chair", "Furniture", 5, 25000, 16000, "West", "Store"],
  ["ORD003", "2026-02-02", "Phone", "Electronics", 3, 45000, 33000, "South", "Online"],
];

const columns = [
  {
    name: "Order ID",
    type: "Text",
    purpose: "Identifies each transaction.",
    example: "ORD001",
  },
  {
    name: "Date",
    type: "Date",
    purpose: "Enables time-based trends.",
    example: "2026-01-05",
  },
  {
    name: "Product",
    type: "Text",
    purpose: "Compares product performance.",
    example: "Laptop",
  },
  {
    name: "Category",
    type: "Text",
    purpose: "Groups products or services.",
    example: "Electronics",
  },
  {
    name: "Quantity",
    type: "Number",
    purpose: "Tracks units sold.",
    example: "2",
  },
  {
    name: "Revenue",
    type: "Number",
    purpose: "Measures sales value.",
    example: "120000",
  },
  {
    name: "Cost",
    type: "Number",
    purpose: "Supports cost and margin analysis.",
    example: "90000",
  },
  {
    name: "Region",
    type: "Text",
    purpose: "Compares geographic performance.",
    example: "North",
  },
  {
    name: "Sales Channel",
    type: "Text",
    purpose: "Compares sales sources.",
    example: "Online",
  },
];

const checklistItems = [
  "My file is CSV, XLS, or XLSX and under 10 MB.",
  "The first row contains clear column headers.",
  "Each row represents one transaction or observation.",
  "Dates use one consistent format.",
  "Revenue, cost, quantity, and other numeric fields contain numbers.",
  "Categories and labels use consistent spelling.",
  "I have reviewed missing values and duplicate records.",
  "I have removed unnecessary title rows and merged cells.",
];

const DataGuide = () => {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleItem = (index) => {
    setCheckedItems((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

 
const downloadTemplate = () => {
  const link = document.createElement("a");

  link.href = "/samples/sampleData5.csv";
  link.download = "businesslens_sample_sales_with_errors.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();
};


  const completedCount = checkedItems.length;

  return (
    <div className="min-h-screen bg-[#050507] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/datasets"
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Datasets
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#102a30] via-[#0b151c] to-[#09090b] p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1.5 text-xs font-medium text-cyan-300">
              <FileSpreadsheet size={14} />
              BUSINESSLENS DATA GUIDE
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
              Better data.
              <span className="block text-cyan-300">
                Better decisions.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Prepare your spreadsheet correctly so BusinessLens can
              understand your business data and generate more useful
              analytics, trends, and insights.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={downloadTemplate}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-[#061114] transition hover:bg-cyan-200"
              >
                <ArrowDownToLine size={17} />
                Download Sample CSV
              </button>

              <Link
                to="/datasets"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Go to Datasets
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/60">
              {["CSV", "XLS", "XLSX", "Maximum 10 MB"].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Quick rules */}
        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Start here
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              The four rules of good data
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              A clean structure helps the analytics engine interpret your
              columns more reliably.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "One header row",
                description:
                  "Use a single first row with clear names such as Date, Revenue, Product, and Region.",
              },
              {
                number: "02",
                title: "One record per row",
                description:
                  "Keep each transaction or observation on its own row.",
              },
              {
                number: "03",
                title: "Consistent values",
                description:
                  "Use the same date format, category spelling, and measurement units throughout.",
              },
              {
                number: "04",
                title: "Correct data types",
                description:
                  "Keep amounts and quantities numeric, dates recognizable, and identifiers consistent.",
              },
            ].map((rule) => (
              <article
                key={rule.number}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-cyan-400/20"
              >
                <span className="text-sm font-bold text-cyan-300">
                  {rule.number}
                </span>
                <h3 className="mt-4 font-semibold">{rule.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {rule.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Spreadsheet example */}
        <section className="mt-12">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Example format
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                What your spreadsheet should look like
              </h2>
            </div>

            <span className="inline-flex items-center gap-2 text-xs text-white/40">
              <Table2 size={15} />
              Sample business transactions
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left text-xs">
                <thead className="bg-white/[0.06] text-white/75">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.name}
                        className="border-b border-white/10 px-4 py-4 font-semibold"
                      >
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.map((row, rowIndex) => (
                    <tr
                      key={row[0]}
                      className={
                        rowIndex % 2 === 0
                          ? "bg-white/[0.02]"
                          : "bg-transparent"
                      }
                    >
                      {row.map((value, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className="border-b border-white/[0.06] px-4 py-4 text-white/60 last:border-b-0"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-3 bg-cyan-400/[0.05] p-4">
              <Lightbulb
                size={18}
                className="mt-0.5 shrink-0 text-cyan-300"
              />
              <p className="text-xs leading-6 text-white/55">
                This is illustrative sample data. Keep your own currency
                and units consistent. The column names are examples, not
                a guarantee that every column is required by every
                BusinessLens analysis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadTemplate}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08]"
          >
            <ArrowDownToLine size={15} />
            Download this template as CSV
          </button>
        </section>

        {/* Column guide */}
        <section className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Column reference
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Which columns should you include?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Choose fields that answer your business questions. Use the
            columns relevant to your business rather than adding every
            possible field.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            {columns.map((column, index) => (
              <div
                key={column.name}
                className={`grid gap-2 px-4 py-4 sm:grid-cols-[150px_1fr_100px] sm:items-center sm:gap-4 ${
                  index !== columns.length - 1
                    ? "border-b border-white/[0.07]"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{column.name}</p>
                  <p className="mt-1 text-[11px] text-cyan-300/70">
                    {column.type}
                  </p>
                </div>

                <p className="text-xs leading-5 text-white/45">
                  {column.purpose}
                </p>

                <span className="w-fit rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[11px] text-white/65">
                  {column.example}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Good vs bad */}
        <section className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Avoid common mistakes
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Clean it before you upload
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.035] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-red-300">
                <X size={18} />
                <h3 className="font-semibold">Avoid</h3>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/55">
                <li>• Different date formats in the same column.</li>
                <li>• Values such as `₹1,200` mixed with numeric amounts.</li>
                <li>• Category variations such as `North`, `north`, and `NORTH`.</li>
                <li>• Merged cells, blank header names, or multiple title rows.</li>
                <li>• Duplicate records or unexplained missing values.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.035] p-5 sm:p-6">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={18} />
                <h3 className="font-semibold">Prefer</h3>
              </div>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/55">
                <li>• Dates consistently formatted as `YYYY-MM-DD`.</li>
                <li>• Numeric amounts such as `1200`, with currency documented separately.</li>
                <li>• Standardized category and region labels.</li>
                <li>• One clear header row and a rectangular data table.</li>
                <li>• Reviewed duplicates and explicitly handled missing values.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <ClipboardCheck size={20} />
                <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                  Final review
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                Ready to upload?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Use this checklist before sending your file to BusinessLens.
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-2xl font-bold">
                {completedCount}/{checklistItems.length}
              </p>
              <p className="text-xs text-white/40">items checked</p>
            </div>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300 transition-all duration-300"
              style={{
                width: `${(completedCount / checklistItems.length) * 100}%`,
              }}
            />
          </div>

          <div className="mt-6 space-y-3">
            {checklistItems.map((item, index) => {
              const isChecked = checkedItems.includes(index);

              return (
                <label
                  key={item}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    isChecked
                      ? "border-cyan-400/20 bg-cyan-400/[0.04]"
                      : "border-white/[0.07] bg-black/10 hover:bg-white/[0.025]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(index)}
                    className="sr-only"
                  />

                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                      isChecked
                        ? "border-cyan-300 bg-cyan-300 text-black"
                        : "border-white/20"
                    }`}
                  >
                    {isChecked && <Check size={13} />}
                  </span>

                  <span
                    className={`text-sm leading-6 ${
                      isChecked ? "text-white/75" : "text-white/50"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              );
            })}
          </div>

          {completedCount === checklistItems.length && (
            <p className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
              <CheckCircle2 size={17} />
              Checklist complete. You're ready for a final review of your file.
            </p>
          )}

          <Link
            to="/datasets"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black transition hover:bg-white/90 sm:w-auto"
          >
            <UploadCloud size={17} />
            Go to Dataset Upload
            <ArrowRight size={16} />
          </Link>
        </section>

        {/* Help */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/[0.07] p-4">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0 text-white/40"
          />
          <p className="text-xs leading-6 text-white/40">
            Data quality affects the usefulness of analytics. BusinessLens
            may recognize columns automatically, but naming conventions and
            sample data cannot guarantee that every metric will be available
            for every dataset.
          </p>
        </div>

        <div className="mt-6 pb-4 text-center">
          <Link
            to="/datasets"
            className="inline-flex items-center gap-2 text-xs text-white/35 transition hover:text-white/70"
          >
            <CircleHelp size={14} />
            Need to upload a file? Return to your datasets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DataGuide;
