# Module 12 — Dataset Management

## Overview

Module 12 adds dataset management functionality to BusinessLens.

Previously, the application could upload a dataset and open its analytics dashboard. This module extends that workflow by providing a centralized Data Center where users can view all uploaded datasets and open any ready dataset for analysis.

The module connects the React frontend with a new backend dataset listing API.

---

## Objective

The main objectives of this module are:

- Fetch all datasets belonging to the current user.
- Display uploaded datasets in the Data Center.
- Show dataset metadata.
- Display dataset processing status.
- Provide an Analyze action for ready datasets.
- Preserve the existing dataset upload workflow.
- Refresh the dataset list after a successful upload.
- Provide loading, empty, error, and refresh states.
- Keep the frontend API model independent from the MySQL naming convention.

---

# Architecture

```text
                    React Frontend
                         │
                         │ GET /api/datasets
                         ▼
                dataset.api.js
                         │
                         ▼
              Dataset Management UI
                         │
                         │
                         ▼
                 Express Backend
                         │
                         ▼
             dataset.controller.js
                         │
                         ▼
              dataset.service.js
                         │
                         ▼
                     MySQL
                         │
                         ▼
                    datasets
                     table