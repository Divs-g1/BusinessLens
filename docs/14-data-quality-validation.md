# Module 14 — Data Quality & Validation

## Overview

Module 14 introduces the Data Quality and Validation layer of BusinessLens.

The purpose of this module is to evaluate whether an uploaded business dataset is structurally complete, consistent, and suitable for analytics.

Data quality is intentionally separated from business performance.

A dataset can be technically clean while still containing poor business outcomes such as loss-making transactions.

---

## Objective

The module provides:

- Dataset-level quality metrics
- Missing value detection
- Duplicate row detection
- Data completeness calculation
- Analytics readiness validation
- Semantic role detection
- Column-level quality analysis
- Data type information
- Unique value counts
- Column missing value counts
- Quality status for each column

---

## Architecture

```text
Dataset
   ↓
Data Quality API
   ↓
Analytics Controller
   ↓
Analytics Service
   ↓
MySQL
   ↓
Data Quality Response
   ↓
React Data Quality Page