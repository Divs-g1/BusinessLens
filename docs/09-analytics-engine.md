# Module 09 — Analytics Engine

## Overview

The Analytics Engine is the business intelligence layer of BusinessLens.

It takes structured dataset data stored in MySQL and transforms it into business metrics that can be consumed by the frontend dashboard.

The analytics layer is designed to avoid hardcoding exact column names.

Instead, BusinessLens first detects the semantic meaning of dataset columns and then performs analytics using those semantic roles.

---

## Architecture

```text
Uploaded Dataset
       ↓
Dataset Rows
       ↓
Semantic Column Detection
       ↓
Semantic Mapping
       ↓
Analytics Services
       ↓
Analytics Controllers
       ↓
REST API
       ↓
React Dashboard 