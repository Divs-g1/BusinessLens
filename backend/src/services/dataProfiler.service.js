const isMissing = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
};

const isNumber = (value) => {
  if (isMissing(value)) {
    return false;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return false;
    }

    return !Number.isNaN(Number(trimmedValue));
  }

  return false;
};

const isDate = (value) => {
  if (isMissing(value)) {
    return false;
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  // Handles formats such as:
  // 2026-01-03
  // 2026/01/03
  // 03-01-2026
  const datePattern =
    /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;

  if (!datePattern.test(trimmedValue)) {
    return false;
  }

  const parsedDate = new Date(trimmedValue);

  return !Number.isNaN(parsedDate.getTime());
};

const detectDataType = (values) => {
  const validValues = values.filter(
    (value) => !isMissing(value)
  );

  if (!validValues.length) {
    return "unknown";
  }

  const allNumbers = validValues.every(isNumber);

  if (allNumbers) {
    return "number";
  }

  const allDates = validValues.every(isDate);

  if (allDates) {
    return "date";
  }

  const allBooleans = validValues.every((value) => {
    if (typeof value === "boolean") {
      return true;
    }

    if (typeof value !== "string") {
      return false;
    }

    return ["true", "false"].includes(
      value.trim().toLowerCase()
    );
  });

  if (allBooleans) {
    return "boolean";
  }

  return "string";
};

const getUniqueCount = (values) => {
  const uniqueValues = new Set();

  for (const value of values) {
    if (!isMissing(value)) {
      uniqueValues.add(String(value).trim());
    }
  }

  return uniqueValues.size;
};

const getMissingCount = (values) => {
  return values.filter(isMissing).length;
};

export const profileDataset = (rows) => {
  if (!rows.length) {
    return {
      rowCount: 0,
      columnCount: 0,
      columns: [],
      duplicateRowCount: 0,
      totalMissingValues: 0,
    };
  }

  const columnNames = Object.keys(rows[0]);

  const columns = columnNames.map((columnName, index) => {
    const values = rows.map(
      (row) => row[columnName]
    );

    return {
      columnName,
      dataType: detectDataType(values),
      nullable: getMissingCount(values) > 0,
      missingCount: getMissingCount(values),
      uniqueCount: getUniqueCount(values),
      columnIndex: index,
    };
  });

  const rowSignatures = new Set();
  let duplicateRowCount = 0;

  for (const row of rows) {
    const signature = JSON.stringify(row);

    if (rowSignatures.has(signature)) {
      duplicateRowCount++;
    } else {
      rowSignatures.add(signature);
    }
  }

  const totalMissingValues = columns.reduce(
    (total, column) => {
      return total + column.missingCount;
    },
    0
  );

  return {
    rowCount: rows.length,
    columnCount: columnNames.length,
    columns,
    duplicateRowCount,
    totalMissingValues,
  };
};