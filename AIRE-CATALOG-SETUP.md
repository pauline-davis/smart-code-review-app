# AIRE Catalog Registration Instructions

This document provides instructions for registering a repository with the Credera Internal Developer Platform (IDP) as an AIRE (AI Reference for Engineering) project.

## Overview

To appear in the AIRE plugin's "AI Projects" list on the Credera IDP, your repository needs a `catalog-info.yaml` file in its root directory with the appropriate tags.

## Instructions for Claude Code

When asked to set up this repository for the Credera IDP AIRE catalog, create a `catalog-info.yaml` file in the repository root with the following structure:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: <repository-name>
  description: <brief description of what this project does>
  tags:
    - aire
    - ai
    - <add other relevant tags like: python, typescript, langchain, openai, azure-ai, etc.>
  annotations:
    github.com/project-slug: crederauk/<repository-name>
    backstage.io/techdocs-ref: dir:.
  links:
    - url: https://github.com/crederauk/<repository-name>
      title: GitHub Repository
      icon: github
spec:
  type: <component-type>
  lifecycle: <lifecycle-stage>
  owner: <team-or-user>
```

## Field Definitions

### Required Fields

| Field | Description | Example Values |
|-------|-------------|----------------|
| `metadata.name` | Unique identifier for the component (use repo name, lowercase, hyphens) | `aire-project-template`, `my-ai-chatbot` |
| `metadata.description` | Brief description of the project | `"AI-powered document analysis service"` |
| `metadata.tags` | Array of tags - **must include `aire` or `ai`** to appear in AIRE plugin | `[aire, ai, python, langchain]` |
| `spec.type` | The type of component | `service`, `library`, `tool`, `website`, `documentation` |
| `spec.lifecycle` | Current lifecycle stage | `experimental`, `development`, `production` |
| `spec.owner` | Team or user who owns this component | `team-data-science`, `user:james.milward` |

### Optional but Recommended Fields

| Field | Description | Example |
|-------|-------------|---------|
| `metadata.annotations.github.com/project-slug` | GitHub org/repo path | `crederauk/my-repo` |
| `metadata.annotations.backstage.io/techdocs-ref` | TechDocs source location | `dir:.` (for docs in repo) |
| `metadata.links` | External links to show on entity page | GitHub, documentation, Slack channels |

## Lifecycle Values

Choose the appropriate lifecycle stage:

- **`experimental`** - Early stage, proof of concept, not for production use (shows orange badge)
- **`development`** - Active development, may have breaking changes (shows blue badge)
- **`production`** - Stable, production-ready (shows green badge)

## Component Types

Common types for AI projects:

- **`service`** - A deployed service/API
- **`library`** - A reusable code library/package
- **`tool`** - A CLI tool or utility
- **`website`** - A web application or frontend
- **`documentation`** - Documentation-only project
- **`template`** - A project template

## Example: Full catalog-info.yaml

Here's a complete example for an AI project:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: ai-document-analyzer
  description: AI-powered service for analyzing and extracting insights from documents using Azure OpenAI
  tags:
    - aire
    - ai
    - python
    - azure-openai
    - langchain
    - document-processing
  annotations:
    github.com/project-slug: crederauk/ai-document-analyzer
    backstage.io/techdocs-ref: dir:.
  links:
    - url: https://github.com/crederauk/ai-document-analyzer
      title: GitHub Repository
      icon: github
    - url: https://ai-doc-analyzer.credera.cloud
      title: Live Service
      icon: cloud
spec:
  type: service
  lifecycle: experimental
  owner: team-data-engineering
```

## Adding TechDocs (Optional)

If you want documentation to appear in the IDP, add a `mkdocs.yml` file to your repository root:

```yaml
site_name: AI Document Analyzer
nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - API Reference: api-reference.md
  - Architecture: architecture.md

plugins:
  - techdocs-core
```

Then create a `docs/` folder with your markdown documentation files.

## Verification

After creating the `catalog-info.yaml`:

1. Commit and push to GitHub
2. The IDP will automatically discover it (may take up to 5 minutes)
3. Or manually register at: `https://<idp-url>/catalog-import`
4. Verify it appears in the AIRE plugin at `/aire`

## Tags Reference

Recommended tags for AI projects:

| Category | Tags |
|----------|------|
| **Required for AIRE** | `aire`, `ai` |
| **Languages** | `python`, `typescript`, `javascript`, `go` |
| **AI Frameworks** | `langchain`, `llamaindex`, `semantic-kernel`, `autogen` |
| **AI Providers** | `azure-openai`, `openai`, `anthropic`, `bedrock`, `vertex-ai` |
| **Use Cases** | `chatbot`, `rag`, `agent`, `embeddings`, `fine-tuning` |
| **Infrastructure** | `azure`, `aws`, `gcp`, `kubernetes`, `docker` |
