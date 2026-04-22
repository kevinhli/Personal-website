<p align="center">
  <img src="./public/readme-banner.svg" alt="Kevin Liu Portfolio banner" width="100%" />
</p>

<p align="center">
  <a href="https://kevinhli.github.io/Personal-website/">
    <img src="https://img.shields.io/badge/Live%20Site-GitHub%20Pages-0A7EA4?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live site badge" />
  </a>
  <a href="https://github.com/kevinhli/Personal-website/actions/workflows/deploy.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/kevinhli/Personal-website/deploy.yml?branch=main&style=for-the-badge&label=Deploy%20Portfolio" alt="Deploy workflow badge" />
  </a>
  <img src="https://img.shields.io/badge/React-19-0A2342?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React badge" />
  <img src="https://img.shields.io/badge/Vite-8-083A5E?style=for-the-badge&logo=vite&logoColor=F6C453" alt="Vite badge" />
  <img src="https://img.shields.io/badge/Framer%20Motion-12-03111F?style=for-the-badge&logo=framer&logoColor=7BE7F7" alt="Framer Motion badge" />
</p>

<p align="center">
  A swim-inspired portfolio experience for Kevin Liu that turns career milestones, projects, and contact into a motion-driven single-page site.
</p>

## Overview

This project is a personal website built with React, Vite, and Framer Motion. The interface uses a swim-meet concept to guide visitors through four main sections:

| Lane | What it shows |
| --- | --- |
| Intro + About | Background, core skills, and a personal narrative anchored in analytics and swimming |
| Experience | JPL, Oracle, Sonoco, and academic history with awards and education |
| Projects | Work and personal project highlights presented in grouped cards |
| Contact | A direct contact form for roles, projects, and collaboration |

## Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, Vite 8, Framer Motion, React Icons |
| Styling | Custom CSS with animated, swim-themed visuals |
| Deployment | GitHub Actions + GitHub Pages |

## Local Development

```bash
npm install
npm run dev
```

## Production Checks

```bash
npm run lint
npm run build
npm run preview
```

## Deployment Workflow

The repository is configured for GitHub Pages using [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

```mermaid
flowchart LR
  A["Push to main"] --> B["Deploy Portfolio workflow"]
  B --> C["npm ci"]
  C --> D["npm run build"]
  D --> E["Upload dist artifact"]
  E --> F["Deploy to GitHub Pages"]
```

## Why the Workflow Works

- The workflow builds on every push to `main` and publishes with `actions/deploy-pages`.
- [`vite.config.js`](./vite.config.js) uses `base: '/Personal-website/'`, which matches the GitHub Pages repository path.
- The project builds successfully with `npm run build` and passes `npm run lint`.

## GitHub Pages Setup

1. Push this repository to the `main` branch.
2. Open `Settings -> Pages` in GitHub.
3. Set the source to `GitHub Actions`.
4. Use the workflow manually or push a new commit to trigger deployment.

The expected live URL is [kevinhli.github.io/Personal-website](https://kevinhli.github.io/Personal-website/).
