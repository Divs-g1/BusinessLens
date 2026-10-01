# Module 09 — Analytics Engine

## Objective

The Analytics Engine converts stored dataset rows into meaningful business metrics that can be consumed by the frontend dashboard.

## Architecture

```text
MySQL Dataset
      ↓
Analytics Service
      ↓
Business Metrics
      ↓
Analytics API
      ↓
React Dashboard