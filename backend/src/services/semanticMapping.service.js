

export const buildSemanticMapping = (
  columns
) => {
  const mapping = {};

  for (const column of columns) {
    if (
      column.role &&
      column.role !== "unknown" &&
      !mapping[column.role]
    ) {
      mapping[column.role] =
        column.columnName;
    }
  }

  return mapping;
};

export const getSemanticValue = (
  row,
  mapping,
  role
) => {
  const columnName = mapping[role];

  if (!columnName) {
    return null;
  }

  return row[columnName];
};