# Module 11 — Dashboard Analytics API Integration

## Overview

This module connects the BusinessLens React dashboard with the backend analytics and business-insights APIs.

The goal is to ensure that dashboard components consume real backend data instead of using hardcoded business values.

The frontend does not perform the core business analytics calculations. It requests processed analytics from the backend and focuses on presentation.

---

## Architecture

```text
                         BusinessLens
                              |
                    React Dashboard
                              |
                    useDashboardAnalytics
                              |
                       Analytics API
                              |
                    Axios HTTP Requests
                              |
                     Express REST API
                              |
                Analytics / Insights Services
                              |
                           MySQL