# Field Shift Ghana

**Field Shift Ghana** is a climate-adaptive decision-support web application for smallholder farmers in Ghana. Built for the **NASA Space Apps Challenge 2026** under the challenge **"Field Shift: Adapting Farms with NASA Data"**, it translates 24 years of NASA Earth observation data into practical, three-season crop rotation plans that help farmers protect their soil, conserve water, and maintain stable household incomes under shifting rainfall patterns.

---

## The Problem

Across West Africa and Ghana in particular, smallholder farmers face increasingly unpredictable rainfall, prolonged mid-season dry spells, and rising temperatures. Farmers who have historically relied on generational planting calendars now experience sudden crop failure when traditional staples like maize or yam encounter water stress. Smallholders rarely have access to complex meteorological software, expensive inputs, or irrigation infrastructure. They need actionable, low-cost agronomic adaptation tools that work with the resources they already have—starting with the choice and sequence of crops they plant.

---

## How It Works

Field Shift Ghana bridges satellite Earth observations with grounded agronomic science through a simple 3-step farmer workflow:

1. **Location & NASA POWER Earth Observations:**
   - The farmer selects their administrative region (Northern, Ashanti, Bono East, or Volta).
   - The application queries the **NASA POWER (Prediction Of Worldwide Energy Resources) Agroclimatology (AG)** API for the exact geographic coordinates.
   - It fetches 24 years (2001–2024) of monthly-annual precipitation (`PRECTOTCORR`) and 2-meter air temperature (`T2M`) derived from satellite observations and NASA MERRA-2 assimilation models.
   - Using Ordinary Least Squares (OLS) linear regression, it calculates 10-year decadal rates of change for rainfall and temperature, assessing dry-spell vulnerability by comparing recent 5-year averages against the 24-year historical baseline.
   - Responses are cached locally in the browser (`localStorage`) for 7 days with automated offline sample fallback if NASA servers are momentarily unreachable.

2. **Field Profile & Priorities:**
   - The farmer provides their field characteristics: soil texture (sandy, loam, clay), water access (rain-fed, irrigated), last crop grown (selected from 10 regional staple and cash crops), and their core priority (more income, healthier soil, saving water, or lower risk).

3. **Agronomic Rotation Engine:**
   The recommendation engine scores and schedules a tailored three-season rotation following four core principles:
   - **Strict Family Alternation:** Never repeats the same botanical family (cereal, legume, root & tuber, vegetable) back-to-back, breaking pest and pathogen cycles naturally.
   - **Legume Nitrogen Economy:** Strategically introduces nitrogen-fixing legumes (groundnut, cowpea, soybean) to replenish soil fertility without artificial fertilizers, while ensuring plans maintain botanical diversity.
   - **Climate & Water Calibration:** Adjusts water penalties dynamically based on NASA dry-spell risk. Farmers with rain-fed fields in drought-prone zones receive hardy, deep-rooting varieties (pearl millet, sorghum, cassava), while irrigated fields unlock high-margin horticultural crops (tomato, pepper).
   - **Soil Matching:** Rewards soil-appropriate varieties (e.g. pearl millet and groundnut in sandy soil; moisture-loving cereals and soybean in heavy clay) and penalizes waterlogging-sensitive crops.

---

## Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool:** [Vite 7](https://vitejs.dev/) with automated code-splitting (`vendor-react`, `vendor-recharts`)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) with responsive breakpoints and full light/dark theme design tokens
- **Routing:** [React Router v7](https://reactrouter.com/) in `HashRouter` mode for static host compatibility
- **Data Visualization:** [Recharts](https://recharts.org/) with responsive SVG line charts, trend lines, and `prefers-reduced-motion` support
- **Icons:** [Lucide React](https://lucide.dev/) + custom vector crop SVGs
- **Data Source:** [NASA POWER Agroclimatology API](https://power.larc.nasa.gov/) (MERRA-2 assimilation & satellite observations)

---

## Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (or pnpm / yarn)

### Quick Start
1. Clone or navigate to the repository directory:
   ```bash
   cd "Field Shift Ghana"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to view the application.

4. Run static type checking and linting:
   ```bash
   npm run typecheck
   npm run lint
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## Deployment

The application is pre-configured for zero-configuration deployment to any modern static hosting platform:

### Deploying to Vercel
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into your [Vercel Dashboard](https://vercel.com/).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

### Deploying to GitHub Pages
Because `vite.config.ts` includes `base: './'` and routing uses `HashRouter`, the built site can be served from any subdirectory repository URL without asset 404 errors or server rewrite requirements:
1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` directory to your repository's `gh-pages` branch, or configure GitHub Actions:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

---

## Honest Limitations & Disclaimer

- **Decision-Support Only:** Field Shift Ghana is an informational decision-support tool. It does not replace on-the-ground agronomic extension services.
- **Rule-Based Guidance:** Recommendations are generated through rule-based scoring models calibrated to general Ghanaian agro-ecological zones and 24-year satellite climate trends. Local microclimates, drainage patterns, pest outbreaks, and soil chemistry vary significantly from field to field.
- **Seasonal Timing:** In northern Ghana, rainfall is largely unimodal (one main rainy season per calendar year followed by a dry season), meaning a three-season plan can span up to three agricultural years. In southern Ghana, rainfall is bimodal (major and minor rainy seasons).
- **Extension Officer Verification:** **Always confirm crop selections and planting schedules with your local agricultural extension officer** or district Ministry of Food and Agriculture (MoFA) representative before purchasing seeds or planting.

