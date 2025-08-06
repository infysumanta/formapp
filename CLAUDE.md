# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` - Starts development server on http://localhost:3000
- **Build**: `pnpm build` - Build the application for production  
- **Preview**: `pnpm preview` - Preview production build locally
- **Generate**: `pnpm generate` - Generate static site
- **ESLint**: `pnpm eslint` (check package.json scripts first, may need to be `pnpm lint`)

## Project Architecture

This is a **Nuxt 4** application using Vue 3 and TypeScript, designed as a form submission application that integrates with Microsoft Dynamics 365 Marketing.

### Key Architecture Components

**Core Structure:**
- `app/app.vue` - Root application component using Nuxt UI (`<UApp><NuxtPage /></UApp>`)
- `app/pages/index.vue` - Main form page with Dynamics 365 integration
- `app/pages/result.vue` - Form submission result page (success/error states)

**Form Integration:**
- Integrates with Microsoft Dynamics 365 Marketing API for form submissions
- Uses external FormLoader bundle from Azure CDN for form rendering
- Custom form submission handling with retry logic, progress dialogs, and error management
- Processes specific fields like payor relationships and caregiver relationships via DOM manipulation

**Key Features:**
- Form submission with confirmation dialogs, progress indicators, and success/error feedback
- Retry logic for network failures and server errors
- Field processing for lookup values using DOM queries
- Redirect handling to result page with status parameters

### Technology Stack

- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **UI**: Nuxt UI with Tailwind CSS 4
- **Modules**: `@nuxt/eslint`, `@nuxt/scripts`, `@nuxt/ui`, `@nuxt/image`
- **External Dependencies**: Microsoft Dynamics 365 Marketing FormLoader

### Form Processing Flow

1. Form loads via external Dynamics 365 FormLoader script
2. Custom event listeners handle form lifecycle (`d365mkt-formsubmit`)
3. Form submission includes confirmation dialog, field processing, and API submission
4. Results redirect to `/result` page with status and error codes
5. Field processing includes payor and caregiver relationship lookups via DOM manipulation

### Important Configuration

- Form ID: `76438228-4767-f011-bec2-00224809e97b`
- Organization ID: `14e74438-32ad-42c2-91eb-3b40da498c56`  
- API Base URL: `https://public-usa.mkt.dynamics.com/api/v1.0`
- Max retries: 3 with exponential backoff
- Minimum 3-second progress display before showing results