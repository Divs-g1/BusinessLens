# Module 13 — Dataset Preview / Data Explorer

## Overview

Module 13 introduces the Dataset Preview / Data Explorer feature in BusinessLens.

Users can open an uploaded dataset from the Data Center and inspect its actual rows before analyzing the dataset.

## Objective

The objective of this module is to provide:

- Dataset metadata
- Actual uploaded data
- Column-wise table preview
- Pagination
- Loading states
- Empty states
- Error handling

## User Flow

Data Center
    ↓
View Data
    ↓
Dataset Preview
    ↓
Paginated Dataset Rows

## Route

```text
/datasets/:datasetId/preview