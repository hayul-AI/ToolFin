# ToolFin Project Blueprint

## Overview
ToolFin is a "money problem solving platform" designed for English-speaking global users. It provides contextual financial narratives and calculators to support clarity and education. The site is built as a static platform using pure HTML, CSS, and Vanilla JavaScript, optimized for SEO (pSEO-ready) and mobile responsiveness.

## Project Outline
- **Tech Stack:** HTML5, CSS3 (Modern Baseline), Vanilla JavaScript (ES Modules).
- **Design:** SaaS UI (White + Blue), card-based layout, responsive typography.
- **Branding:** Minimalist finance chart icon (blue graph on white).
- **Compliance:** Strict avoidance of advisory language; mandatory disclosure statements on all results; dedicated trust signals.
- **UI Fixes & Enhancements:**
    - Fixed currency unit clipping in header by increasing `min-width` and setting `line-height: normal`.
    - Added global `.has-prefix` and `.prefix` styling to `style.css` to fix currency symbols in calculator inputs.
    - **Global Currency Options:** Implemented `assets/currency-options.js` to standardize the currency dropdown across ALL pages (30+ pages).
    - **TF State Management & Export:** Created `assets/tf-state.js` and `assets/tf-export.js` to automatically inject Save/Load/Clear/Export PDF capabilities into all calculator pages via generic DOM scanning, requiring no page-specific overrides.
- **IA:** 
    - **Home:** Category-based portal (Loans, Income, Investments, Housing, Everyday).
    - **Category Pages:** `loans.html`, `income.html`, `investments.html`, `housing.html`, `everyday.html`.
    - **Calculators:** Dedicated pages for each tool (e.g., `calculators/mortgage.html`).
    - **Support Pages:** About, Methodology, Disclaimer, Editorial Policy, Contact, 404.
- **Hosting:** Static hosting compatible (e.g., Firebase Hosting).

## Current Implementation Plan
1.  **Shared Assets:** `assets/style.css` (Global SaaS look) and `assets/common.js` (Shared functionality).
2.  **Trust Architecture:** `about.html`, `methodology.html`, `disclaimer.html`, `editorial-policy.html`, `contact.html`.
3.  **Category Structure:** 
    - Homepage (`index.html`) links to 5 category pages.
    - Category pages list specific calculators.
4.  **Core Calculators:** 
    - Implemented: Mortgage, Compound Interest, ROI, Salary/Hourly.
    - Planned: Credit Card Payoff, Debt Snowball, Rent vs Buy, Savings Goal, etc.
5.  **Navigation & SEO:** Breadcrumb navigation and semantic structure for all pages.
6.  **Validation:** Ensure no prohibited phrases exist and all mandatory compliance rules are met.
