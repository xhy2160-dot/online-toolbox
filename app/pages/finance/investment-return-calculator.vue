<script setup lang="ts">
useHead({
  title: 'Investment Return Calculator — xoxy.cc',
  meta: [
    { name: 'description', content: 'Calculate your investment growth with compound interest. Visualize how your money grows over time with customizable contributions and rates.' }
  ]
})

definePageMeta({
  layout: 'default'
})

const principal = ref(10000)
const monthlyContrib = ref(500)
const annualRate = ref(7)
const years = ref(20)
const compoundFreq = ref(12)

const freqOptions = [
  { label: 'Annually', value: 1 },
  { label: 'Semi-annually', value: 2 },
  { label: 'Quarterly', value: 4 },
  { label: 'Monthly', value: 12 },
  { label: 'Daily', value: 365 },
]

const results = computed(() => {
  const P = principal.value
  const pmt = monthlyContrib.value
  const r = annualRate.value / 100
  const n = compoundFreq.value
  const t = years.value

  const ratePerPeriod = r / n
  const totalPeriods = n * t

  // Future value of lump sum
  const fvLump = P * Math.pow(1 + ratePerPeriod, totalPeriods)

  // Future value of periodic contributions (annuity formula, contributions monthly)
  const periodsPerMonth = n / 12
  const pmtPerPeriod = pmt / periodsPerMonth
  const fvContrib = pmtPerPeriod > 0
      ? pmtPerPeriod * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod)
      : 0

  const totalValue = fvLump + fvContrib
  const totalContributed = P + pmt * 12 * t
  const totalInterest = totalValue - totalContributed

  // Year-by-year data
  const yearlyData = []
  for (let y = 0; y <= t; y++) {
    const periods = n * y
    const lump = P * Math.pow(1 + ratePerPeriod, periods)
    const contrib = pmtPerPeriod > 0 && periods > 0
        ? pmtPerPeriod * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)
        : 0
    const contributed = P + pmt * 12 * y
    yearlyData.push({
      year: y,
      value: lump + contrib,
      contributed,
      interest: (lump + contrib) - contributed
    })
  }

  return { totalValue, totalContributed, totalInterest, yearlyData }
})

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

const formatPct = (v: number) => {
  const total = results.value?.totalValue || 0
  if (total === 0) return '0%'
  return ((v / total) * 100).toFixed(1) + '%'
}

// Chart SVG path helpers
const chartPath = computed(() => {
  const data = results.value.yearlyData
  if (!data || data.length < 2) return { value: '', contrib: '', valueArea: '', contribArea: '', maxVal: 1, data: [], xScale: () => 0, yScale: () => 0 }

  const maxVal = Math.max(...data.map(d => d.value)) || 1
  const W = 560
  const H = 220
  const pad = { l: 8, r: 8, t: 8, b: 8 }

  const xScale = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
  const yScale = (v: number) => H - pad.b - (v / maxVal) * (H - pad.t - pad.b)

  const valuePoints = data.map((d, i) => `${xScale(i)},${yScale(d.value)}`).join(' ')
  const contribPoints = data.map((d, i) => `${xScale(i)},${yScale(d.contributed)}`).join(' ')

  const firstX = xScale(0)
  const lastX = xScale(data.length - 1)
  const bottomY = H - pad.b

  // Smooth polyline
  const toPath = (points: string) => {
    const pts = points.split(' ').map(p => p.split(',').map(Number))
    if (pts.length < 2) return ''
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1][0] + (pts[i][0] - (pts[i - 2]?.[0] ?? pts[i - 1][0])) / 6
      const cp1y = pts[i - 1][1] + (pts[i][1] - (pts[i - 2]?.[1] ?? pts[i - 1][1])) / 6
      const cp2x = pts[i][0] - (pts[i + 1]?.[0] ?? pts[i][0] - pts[i - 1][0]) / 6
      const cp2y = pts[i][1] - (pts[i + 1]?.[1] ?? pts[i][1] - pts[i - 1][1]) / 6
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i][0]} ${pts[i][1]}`
    }
    return d
  }

  const valueLinePath = toPath(valuePoints)
  const contribLinePath = toPath(contribPoints)

  return {
    value: valueLinePath,
    contrib: contribLinePath,
    valueArea: valueLinePath ? `${valueLinePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z` : '',
    contribArea: contribLinePath ? `${contribLinePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z` : '',
    maxVal,
    data,
    xScale,
    yScale
  }
})

// Tooltip
const hoveredYear = ref<number | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

function handleMouseMove(e: MouseEvent) {
  const data = results.value?.yearlyData
  if (!data || data.length < 2) return

  const svg = e.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const x = e.clientX - rect.left
  const W = 560 - 16
  const idx = Math.round((x - 8) / W * (data.length - 1))
  const clamped = Math.max(0, Math.min(idx, data.length - 1))
  hoveredYear.value = clamped
  tooltipX.value = x
  tooltipY.value = e.clientY - rect.top
}

function handleMouseLeave() {
  hoveredYear.value = null
}

// Multiplier
const multiplier = computed(() => {
  const total = results.value?.totalValue || 0
  const init = principal.value
  return init > 0 ? (total / init).toFixed(1) + 'x' : '—'
})
</script>

<template>
  <div class="calculator-page">
    <div class="page-header">
      <div class="header-eyebrow">Productivity Tools</div>
      <h1>Investment Return Calculator</h1>
      <p class="header-sub">See how your money grows with compound interest over time.</p>
    </div>

    <div class="calculator-grid">
      <div class="inputs-panel">
        <div class="panel-title">Your parameters</div>

        <div class="field-group">
          <label class="field-label">Initial investment</label>
          <div class="input-prefix-wrap">
            <span class="prefix">$</span>
            <input
                v-model.number="principal"
                type="number"
                min="0"
                step="1000"
                class="field-input"
            />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Monthly contribution</label>
          <div class="input-prefix-wrap">
            <span class="prefix">$</span>
            <input
                v-model.number="monthlyContrib"
                type="number"
                min="0"
                step="100"
                class="field-input"
            />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Annual return rate</label>
          <div class="input-suffix-wrap">
            <input
                v-model.number="annualRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                class="field-input"
            />
            <span class="suffix">%</span>
          </div>
          <input
              v-model.number="annualRate"
              type="range"
              min="1"
              max="20"
              step="0.5"
              class="range-slider"
          />
          <div class="range-labels">
            <span>1%</span>
            <span>Conservative ~4%</span>
            <span>S&P ~10%</span>
            <span>20%</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Time horizon</label>
          <div class="input-suffix-wrap">
            <input
                v-model.number="years"
                type="number"
                min="1"
                max="50"
                step="1"
                class="field-input"
            />
            <span class="suffix">yrs</span>
          </div>
          <input
              v-model.number="years"
              type="range"
              min="1"
              max="50"
              step="1"
              class="range-slider"
          />
          <div class="range-labels">
            <span>1 yr</span>
            <span>25 yrs</span>
            <span>50 yrs</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Compound frequency</label>
          <select v-model.number="compoundFreq" class="field-select">
            <option v-for="opt in freqOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="results-panel">
        <div class="panel-title">Projected outcome</div>

        <div class="summary-cards">
          <div class="summary-card summary-card--highlight">
            <div class="card-label">Total value</div>
            <div class="card-value card-value--large">{{ formatCurrency(results.totalValue) }}</div>
            <div class="card-sub">{{ multiplier }} your initial investment</div>
          </div>
          <div class="summary-card">
            <div class="card-label">Total contributed</div>
            <div class="card-value">{{ formatCurrency(results.totalContributed) }}</div>
            <div class="card-sub">{{ formatPct(results.totalContributed) }} of total</div>
          </div>
          <div class="summary-card">
            <div class="card-label">Interest earned</div>
            <div class="card-value card-value--green">{{ formatCurrency(results.totalInterest) }}</div>
            <div class="card-sub">{{ formatPct(results.totalInterest) }} of total</div>
          </div>
        </div>

        <div class="chart-wrap">
          <div class="chart-legend">
            <span class="legend-dot legend-dot--value"></span>
            <span class="legend-label">Portfolio value</span>
            <span class="legend-dot legend-dot--contrib"></span>
            <span class="legend-label">Amount contributed</span>
          </div>

          <svg
              viewBox="0 0 560 236"
              class="growth-chart"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
          >
            <path
                v-if="chartPath.valueArea"
                :d="chartPath.valueArea"
                class="area-value"
            />
            <path
                v-if="chartPath.contribArea"
                :d="chartPath.contribArea"
                class="area-contrib"
            />
            <path
                v-if="chartPath.value"
                :d="chartPath.value"
                class="line-value"
            />
            <path
                v-if="chartPath.contrib"
                :d="chartPath.contrib"
                class="line-contrib"
            />

            <template v-if="hoveredYear !== null && chartPath.data?.[hoveredYear]">
              <line
                  :x1="chartPath.xScale(hoveredYear)"
                  y1="8"
                  :x2="chartPath.xScale(hoveredYear)"
                  y2="228"
                  class="hover-line"
              />
              <circle
                  :cx="chartPath.xScale(hoveredYear)"
                  :cy="chartPath.yScale(chartPath.data[hoveredYear].value)"
                  r="4"
                  class="hover-dot hover-dot--value"
              />
              <circle
                  :cx="chartPath.xScale(hoveredYear)"
                  :cy="chartPath.yScale(chartPath.data[hoveredYear].contributed)"
                  r="4"
                  class="hover-dot hover-dot--contrib"
              />
            </template>
          </svg>

          <div
              v-if="hoveredYear !== null && chartPath.data?.[hoveredYear]"
              class="chart-tooltip"
              :style="{
              left: Math.min(tooltipX + 12, 360) + 'px',
              top: Math.max(tooltipY - 60, 0) + 'px'
            }"
          >
            <div class="tooltip-year">Year {{ chartPath.data[hoveredYear].year }}</div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--value"></span>
              <span class="tooltip-label">Value</span>
              <span class="tooltip-val">{{ formatCurrency(chartPath.data[hoveredYear].value) }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--contrib"></span>
              <span class="tooltip-label">Contributed</span>
              <span class="tooltip-val">{{ formatCurrency(chartPath.data[hoveredYear].contributed) }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--interest"></span>
              <span class="tooltip-label">Interest</span>
              <span class="tooltip-val tooltip-val--green">{{ formatCurrency(chartPath.data[hoveredYear].interest) }}</span>
            </div>
          </div>

          <div class="chart-x-labels">
            <span>Year 0</span>
            <span>Year {{ Math.round(years / 4) }}</span>
            <span>Year {{ Math.round(years / 2) }}</span>
            <span>Year {{ Math.round(years * 3 / 4) }}</span>
            <span>Year {{ years }}</span>
          </div>
        </div>

        <div class="breakdown-section">
          <div class="panel-title panel-title--sm">Milestones</div>
          <div class="milestone-table">
            <div class="milestone-header">
              <span>Year</span>
              <span>Portfolio value</span>
              <span>Contributed</span>
              <span>Interest earned</span>
            </div>
            <div
                v-for="row in (results.yearlyData ? results.yearlyData.filter((_, i) => i % Math.max(1, Math.floor(years / 5)) === 0 || i === years) : [])"
                :key="row.year"
                class="milestone-row"
            >
              <span class="milestone-year">{{ row.year }}</span>
              <span class="milestone-value">{{ formatCurrency(row.value) }}</span>
              <span class="milestone-contrib">{{ formatCurrency(row.contributed) }}</span>
              <span class="milestone-interest">{{ formatCurrency(row.interest) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="disclaimer">
      This calculator is for illustrative purposes only. Past returns do not guarantee future results.
      Figures do not account for taxes, inflation, or investment fees.
    </p>
  </div>
</template>

<style scoped>
.calculator-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

/* Header */
.page-header {
  margin-bottom: 2.5rem;
}

.header-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4f8ef7;
  margin-bottom: 0.5rem;
}

.page-header h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #111111;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.header-sub {
  font-size: 1rem;
  color: #555555;
  margin: 0;
}

/* Grid layout */
.calculator-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 820px) {
  .calculator-grid {
    grid-template-columns: 1fr;
  }
}

/* Panels */
.inputs-panel,
.results-panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem;
}

.panel-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888888;
  margin-bottom: 1.5rem;
}

.panel-title--sm {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

/* Fields */
.field-group {
  margin-bottom: 1.4rem;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #555555;
  margin-bottom: 0.4rem;
}

.input-prefix-wrap,
.input-suffix-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
  transition: border-color 0.15s;
}

.input-prefix-wrap:focus-within,
.input-suffix-wrap:focus-within {
  border-color: #4f8ef7;
  background: #ffffff;
}

.prefix,
.suffix {
  padding: 0 10px;
  font-size: 14px;
  color: #9ca3af;
  user-select: none;
  white-space: nowrap;
}

.field-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 9px 10px;
  font-size: 15px;
  font-weight: 500;
  color: #111111;
  min-width: 0;
  font-family: 'JetBrains Mono', monospace;
}

.field-select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  font-size: 14px;
  color: #111111;
  cursor: pointer;
  outline: none;
}

.field-select:focus {
  border-color: #4f8ef7;
}

.range-slider {
  width: 100%;
  margin-top: 10px;
  accent-color: #4f8ef7;
  cursor: pointer;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
}

/* Summary cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}

.summary-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 1rem;
}

.summary-card--highlight {
  background: linear-gradient(135deg, #1e3a5f 0%, #0f2240 100%);
}

.card-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.3rem;
}

.summary-card--highlight .card-label {
  color: rgba(255, 255, 255, 0.55);
}

.card-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #111111;
  line-height: 1.2;
}

.card-value--large {
  font-size: 1.5rem;
  color: #ffffff;
}

.card-value--green {
  color: #16a34a;
}

.card-sub {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

.summary-card--highlight .card-sub {
  color: rgba(240, 165, 0, 0.85);
}

/* Chart */
.chart-wrap {
  position: relative;
  margin: 0 -0.25rem;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #555555;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-dot--value {
  background: #4f8ef7;
}

.legend-dot--contrib {
  background: #93c5fd;
}

.legend-label {
  margin-right: 8px;
}

.growth-chart {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
}

.area-value {
  fill: #4f8ef7;
  opacity: 0.15;
}

.area-contrib {
  fill: #1e3a5f;
  opacity: 0.25;
}

.line-value {
  fill: none;
  stroke: #4f8ef7;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.line-contrib {
  fill: none;
  stroke: #93c5fd;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.7;
}

.hover-line {
  stroke: #d1d5db;
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.hover-dot {
  r: 4;
}

.hover-dot--value {
  fill: #4f8ef7;
  stroke: #ffffff;
  stroke-width: 2;
}

.hover-dot--contrib {
  fill: #93c5fd;
  stroke: #ffffff;
  stroke-width: 2;
}

.chart-tooltip {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  pointer-events: none;
  z-index: 10;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.tooltip-year {
  font-size: 12px;
  font-weight: 600;
  color: #555555;
  margin-bottom: 6px;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin: 3px 0;
}

.tooltip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tooltip-dot--value { background: #4f8ef7; }
.tooltip-dot--contrib { background: #93c5fd; }
.tooltip-dot--interest { background: #16a34a; }

.tooltip-label {
  color: #555555;
  flex: 1;
}

.tooltip-val {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #111111;
}

.tooltip-val--green {
  color: #16a34a;
}

.chart-x-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

/* Milestone table */
.milestone-table {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  font-size: 13px;
}

.milestone-header,
.milestone-row {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr;
  gap: 0;
}

.milestone-header {
  background: #f9fafb;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
}

.milestone-header span,
.milestone-row span {
  padding: 8px 10px;
}

.milestone-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.1s;
}

.milestone-row:last-child {
  border-bottom: none;
}

.milestone-row:hover {
  background: #f9fafb;
}

.milestone-year {
  color: #555555;
  font-weight: 600;
}

.milestone-value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #111111;
}

.milestone-contrib {
  font-family: 'JetBrains Mono', monospace;
  color: #555555;
}

.milestone-interest {
  font-family: 'JetBrains Mono', monospace;
  color: #16a34a;
}

/* Disclaimer */
.disclaimer {
  margin-top: 2rem;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  .page-header h1 {
    color: #f3f4f6;
  }
  .header-sub, .field-label, .chart-legend, .tooltip-year, .tooltip-label, .milestone-year, .milestone-contrib {
    color: #9ca3af;
  }
  .inputs-panel,
  .results-panel {
    background: #1a1a2e;
    border-color: #2d2d44;
  }
  .field-input, .field-select, .card-value, .tooltip-val, .milestone-value {
    color: #f3f4f6;
  }
  .input-prefix-wrap, .input-suffix-wrap, .field-select {
    background: #12122a;
    border-color: #2d2d44;
  }
  .input-prefix-wrap:focus-within, .input-suffix-wrap:focus-within {
    border-color: #4f8ef7;
    background: #1a1a2e;
  }
  .summary-card, .milestone-header, .milestone-row:hover {
    background: #12122a;
  }
  .milestone-table, .milestone-header, .milestone-row, .chart-tooltip {
    border-color: #2d2d44;
  }
  .hover-line {
    stroke: #2d2d44;
  }
  .chart-tooltip {
    background: #1a1a2e;
  }
  .area-contrib {
    fill: #93c5fd;
    opacity: 0.1;
  }
  .card-value--green,
  .milestone-interest,
  .tooltip-val--green {
    color: #4ade80;
  }
}
</style>