
const normalizeColumnName = (columnName) => {
  return columnName
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
};

const ROLE_KEYWORDS = {
  revenue: [
    "revenue",
    "sales",
    "sales amount",
    "sales value",
    "total sales",
    "selling price",
    "sales revenue",
    "income",
  ],

  cost: [
    "cost",
    "total cost",
    "expense",
    "expenses",
    "purchase cost",
    "cost price",
  ],

  date: [
    "date",
    "order date",
    "sale date",
    "sales date",
    "transaction date",
    "created date",
    "timestamp",
  ],

  product: [
    "product",
    "product name",
    "item",
    "item name",
    "sku name",
  ],

  category: [
    "category",
    "product category",
    "item category",
    "type",
    "product type",
  ],

  region: [
    "region",
    "area",
    "territory",
    "location",
    "zone",
    "state",
    "city",
  ],

  quantity: [
    "quantity",
    "qty",
    "units",
    "unit sold",
    "units sold",
    "volume",
  ],

  sales_channel: [
    "sales channel",
    "channel",
    "sales type",
    "order channel",
    "platform",
  ],

  identifier: [
    "id",
    "order id",
    "order number",
    "transaction id",
    "transaction number",
    "invoice id",
    "invoice number",
  ],
};

const detectRole = (columnName, dataType) => {
  const normalizedName =
    normalizeColumnName(columnName);

  // First: exact match
  for (const [role, keywords] of Object.entries(
    ROLE_KEYWORDS
  )) {
    if (keywords.includes(normalizedName)) {
      return role;
    }
  }

  // Second: specific multi-word keyword match
  const sortedRoles = Object.entries(
    ROLE_KEYWORDS
  ).sort(([, keywordsA], [, keywordsB]) => {
    const longestA = Math.max(
      ...keywordsA.map((keyword) => keyword.length)
    );

    const longestB = Math.max(
      ...keywordsB.map((keyword) => keyword.length)
    );

    return longestB - longestA;
  });

  for (const [role, keywords] of sortedRoles) {
    const matched = keywords.some(
      (keyword) =>
        keyword.length >= 5 &&
        normalizedName.includes(keyword)
    );

    if (matched) {
      return role;
    }
  }

  if (dataType === "date") {
    return "date";
  }

  return "unknown";
};

export const detectSemanticColumns = (
  columns
) => {
  return columns.map((column) => ({
    columnName: column.columnName,
    dataType: column.dataType,
    role: detectRole(
      column.columnName,
      column.dataType
    ),
  }));
};