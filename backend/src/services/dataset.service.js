import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import XLSX from "xlsx";

import pool from "../config/db.js";
import { profileDataset } from "./dataProfiler.service.js";

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", reject);
  });
};

const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);

  const firstSheetName = workbook.SheetNames[0];

  const worksheet =
    workbook.Sheets[firstSheetName];

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
  });
};

export const parseDatasetFile = async (
  filePath,
  fileType
) => {
  const extension = path
    .extname(filePath)
    .toLowerCase();

  if (extension === ".csv" || fileType === "csv") {
    return parseCSV(filePath);
  }

  if (
    extension === ".xlsx" ||
    extension === ".xls" ||
    fileType === "excel"
  ) {
    return parseExcel(filePath);
  }

  throw new Error("Unsupported file format");
};

export const saveDataset = async ({
  userId,
  datasetName,
  originalFilename,
  fileType,
  rows,
}) => {
  const profile = profileDataset(rows);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [datasetResult] =
      await connection.execute(
        `
        INSERT INTO datasets (
          user_id,
          name,
          original_filename,
          file_type,
          row_count,
          column_count,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          userId,
          datasetName,
          originalFilename,
          fileType,
          profile.rowCount,
          profile.columnCount,
          "processing",
        ]
      );

    const datasetId = datasetResult.insertId;

    // Save column metadata
    for (const column of profile.columns) {
      await connection.execute(
        `
        INSERT INTO dataset_columns (
          dataset_id,
          column_name,
          data_type,
          nullable,
          missing_count,
          unique_count,
          column_index
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          datasetId,
          column.columnName,
          column.dataType,
          column.nullable,
          column.missingCount,
          column.uniqueCount,
          column.columnIndex,
        ]
      );
    }

    // Save rows in batches
    const batchSize = 500;

    for (
      let start = 0;
      start < rows.length;
      start += batchSize
    ) {
      const batch = rows.slice(
        start,
        start + batchSize
      );

      const placeholders = batch
        .map(() => "(?, ?, ?)")
        .join(", ");

      const values = [];

      batch.forEach((row, index) => {
        values.push(
          datasetId,
          start + index + 1,
          JSON.stringify(row)
        );
      });

      await connection.execute(
        `
        INSERT INTO dataset_rows (
          dataset_id,
          row_index,
          row_data
        )
        VALUES ${placeholders}
        `,
        values
      );
    }

    await connection.execute(
      `
      UPDATE datasets
      SET status = ?
      WHERE id = ?
      `,
      ["ready", datasetId]
    );

    await connection.commit();

    return {
      datasetId,
      profile,
    };
  } catch (error) {
    await connection.rollback();

    throw error;
  } finally {
    connection.release();
  }
};

export const getDatasetProfile = async (datasetId, userId) => {
  const [datasets] = await pool.execute(
    `
    SELECT
      id,
      name,
      original_filename,
      file_type,
      row_count,
      column_count,
      status,
      created_at,
      updated_at
    FROM datasets
    WHERE id = ? AND user_id = ?
    `,
    [datasetId, userId]
  );

  if (!datasets.length) {
    return null;
  }

  const dataset = datasets[0];

  const [columns] = await pool.execute(
    `
    SELECT
      id,
      column_name,
      data_type,
      nullable,
      missing_count,
      unique_count,
      column_index
    FROM dataset_columns
    WHERE dataset_id = ?
    ORDER BY column_index ASC
    `,
    [datasetId]
  );

  const totalMissingValues = columns.reduce(
    (total, column) => {
      return total + column.missing_count;
    },
    0
  );

  return {
    dataset: {
      id: dataset.id,
      name: dataset.name,
      originalFilename: dataset.original_filename,
      fileType: dataset.file_type,
      rows: dataset.row_count,
      columns: dataset.column_count,
      status: dataset.status,
      createdAt: dataset.created_at,
      updatedAt: dataset.updated_at,
    },

    profile: {
      rowCount: dataset.row_count,
      columnCount: dataset.column_count,
      totalMissingValues,
      columns: columns.map((column) => ({
        id: column.id,
        columnName: column.column_name,
        dataType: column.data_type,
        nullable: Boolean(column.nullable),
        missingCount: column.missing_count,
        uniqueCount: column.unique_count,
        columnIndex: column.column_index,
      })),
    },
  };
};

export const getDatasetById = async (datasetId, userId) => {
  const [datasets] = await pool.execute(
    `
    SELECT
      id,
      user_id,
      name,
      original_filename,
      file_type,
      row_count,
      column_count,
      status,
      created_at,
      updated_at
    FROM datasets
    WHERE id = ? AND user_id = ?
    `,
    [datasetId, userId]
  );

  if (!datasets.length) {
    return null;
  }

  const dataset = datasets[0];

  const [columns] = await pool.execute(
    `
    SELECT
      id,
      column_name,
      data_type,
      nullable,
      missing_count,
      unique_count,
      column_index
    FROM dataset_columns
    WHERE dataset_id = ?
    ORDER BY column_index ASC
    `,
    [datasetId]
  );

  return {
    id: dataset.id,
    name: dataset.name,
    originalFilename: dataset.original_filename,
    fileType: dataset.file_type,
    rows: dataset.row_count,
    columns: dataset.column_count,
    status: dataset.status,
    createdAt: dataset.created_at,
    updatedAt: dataset.updated_at,
    columns: columns.map((column) => ({
      id: column.id,
      name: column.column_name,
      dataType: column.data_type,
      nullable: Boolean(column.nullable),
      missingCount: column.missing_count,
      uniqueCount: column.unique_count,
      index: column.column_index,
    })),
};
  };


export const getDatasetRows = async (
  datasetId,
  userId,
  page = 1,
  limit = 50
) => {
  const offset = (page - 1) * limit;

  const [rows] = await pool.execute(
    `
    SELECT
      dr.id,
      dr.row_index,
      dr.row_data
    FROM dataset_rows AS dr
    INNER JOIN datasets AS d
      ON d.id = dr.dataset_id
    WHERE dr.dataset_id = ?
      AND d.user_id = ?
    ORDER BY dr.row_index ASC
    LIMIT ? OFFSET ?
    `,
    [datasetId, userId, limit, offset]
  );

  const [countResult] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM dataset_rows AS dr
    INNER JOIN datasets AS d
      ON d.id = dr.dataset_id
    WHERE dr.dataset_id = ?
      AND d.user_id = ?
    `,
    [datasetId, userId]
  );

  const total = Number(countResult[0].total);

  return {
    rows: rows.map((row) => ({
      id: row.id,
      rowIndex: row.row_index,
      data: row.row_data,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const getUserDatasets = async (userId) => {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        name,
        original_filename,
        file_type,
        row_count,
        column_count,
        status,
        created_at,
        updated_at
      FROM datasets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows.map((dataset) => ({
    id: dataset.id,
    name: dataset.name,
    originalFilename: dataset.original_filename,
    fileType: dataset.file_type,
    rows: dataset.row_count,
    columns: dataset.column_count,
    status: dataset.status,
    createdAt: dataset.created_at,
    updatedAt: dataset.updated_at,
  }));
};