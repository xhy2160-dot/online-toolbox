<script setup lang="ts">
import { ref, computed } from 'vue'

// SEO / Meta tags
useHead({
  title: 'ETF Fee Calculator — xoxy.cc',
  meta: [
    { name: 'description', content: 'Calculate how fund fees and management expense ratios (MER) impact your long-term investment returns. Visualize the real cost of drag over time.' }
  ]
})

definePageMeta({
  layout: 'default'
})

// Calculator state inputs
const initialInvestment = ref(10000)
const annualContribution = ref(1200)
const expectedReturn = ref(7) // annual gross return before fees
const expenseRatio = ref(0.2) // ETF Expense Ratio / MER in %
const horizonYears = ref(20)

// Computed calculations
const results = computed(() => {
  const P = initialInvestment.value
  const PMT = annualContribution.value
  const rGross = expectedReturn.value / 100
  const rNet = rGross - (expenseRatio.value / 100)
  const t = horizonYears.value

  const yearlyData = []

  let grossBalance = P
  let netBalance = P
  let totalContributed = P

  // Year 0 starting point
  yearlyData.push({
    year: 0,
    grossBalance,
    netBalance,
    totalContributed,
    lostToFees: 0
  })

  // Compound year by year (contributions made at beginning of year)
  for (let y = 1; y <= t; y++) {
    // Gross simulation (0% fees)
    grossBalance = (grossBalance + PMT) * (1 + rGross)

    // Net simulation (Post ETF expense ratio)
    netBalance = (netBalance + PMT) * (1 + rNet)

    totalContributed += PMT
    const lostToFees = Math.max(0, grossBalance - netBalance)

    yearlyData.push({
      year: y,
      grossBalance,
      netBalance,
      totalContributed,
      lostToFees
    })
  }

  const finalGross = grossBalance
  const finalNet = netBalance
  const totalFeesPaid = finalGross - finalNet
  const efficiencyPct = finalGross > 0 ? (finalNet / finalGross) * 100 : 100

  return {
    finalGross,
    finalNet,
    totalFeesPaid,
    efficiencyPct,
    totalContributed,
    yearlyData
  }
})

// Format helpers
const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

const formatPercent = (v: number) => v.toFixed(2) + '%'

// Chart path generator
const chartPath = computed(() => {
  const data = results.value?.yearlyData
  if (!data || data.length < 2) return { grossLine: '', netLine: '', grossArea: '', netArea: '', maxVal: 1, xScale: () => 0, yScale: () => 0, data: [] }

  const maxVal = Math.max(...data.map(d => d.grossBalance)) || 1
  const W = 560
  const H = 220
  const pad = { l: 8, r: 8, t: 8, b: 8 }

  const xScale = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
  const yScale = (v: number) => H - pad.b - (v / maxVal) * (H - pad.t - pad.b)

  const grossPoints = data.map((d, i) => `${xScale(i)},${yScale(d.grossBalance)}`).join(' ')
  const netPoints = data.map((d, i) => `${xScale(i)},${yScale(d.netBalance)}`).join(' ')

  const firstX = xScale(0)
  const lastX = xScale(data.length - 1)
  const bottomY = H - pad.b

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

  const gLine = toPath(grossPoints)
  const nLine = toPath(netPoints)

  return {
    grossLine: gLine,
    netLine: nLine,
    grossArea: gLine ? `${gLine} L ${lastX},${bottomY} L ${firstX},${bottomY} Z` : '',
    netArea: nLine ? `${nLine} L ${lastX},${bottomY} L ${firstX},${bottomY} Z` : '',
    maxVal,
    xScale,
    yScale,
    data
  }
})

// Tooltip interaction
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
</script>

<template>
  <div class="calculator-page">
    <div class="page-header">
      <div class="header-eyebrow">Investment Analysis</div>
      <h1>ETF Fee Drag Calculator</h1>
      <p class="header-sub">See how small fund expense ratios add up to eat away your compound interest.</p>
    </div>

    <div class="calculator-grid">
      <div class="inputs-panel">
        <div class="panel-title">Fund Parameters</div>

        <div class="field-group">
          <label class="field-label">Initial Balance</label>
          <div class="input-prefix-wrap">
            <span class="prefix">$</span>
            <input v-model.number="initialInvestment" type="number" min="0" step="1000" class="field-input" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Annual Contribution</label>
          <div class="input-prefix-wrap">
            <span class="prefix">$</span>
            <input v-model.number="annualContribution" type="number" min="0" step="100" class="field-input" />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Expected Annual Return</label>
          <div class="input-suffix-wrap">
            <input v-model.number="expectedReturn" type="number" min="0" max="30" step="0.1" class="field-input" />
            <span class="suffix">%</span>
          </div>
          <input v-model.number="expectedReturn" type="range" min="1" max="15" step="0.5" class="range-slider" />
        </div>

        <div class="field-group">
          <label class="field-label">ETF Expense Ratio (MER)</label>
          <div class="input-suffix-wrap">
            <input v-model.number="expenseRatio" type="number" min="0" max="5" step="0.01" class="field-input" />
            <span class="suffix">%</span>
          </div>
          <input v-model.number="expenseRatio" type="range" min="0.03" max="2.5" step="0.01" class="range-slider" />
          <div class="range-labels">
            <span>Vanguard Low ~0.05%</span>
            <span>Avg Active ~0.75%</span>
            <span>High Fee 1.5%+</span>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Time Horizon</label>
          <div class="input-suffix-wrap">
            <input v-model.number="horizonYears" type="number" min="1" max="50" step="1" class="field-input" />
            <span class="suffix">years</span>
          </div>
          <input v-model.number="horizonYears" type="range" min="1" max="50" step="1" class="range-slider" />
        </div>
      </div>

      <div class="results-panel">
        <div class="panel-title">Fee Breakdown Analysis</div>

        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-label">Ending Portfolio</div>
            <div class="card-value">{{ formatCurrency(results.finalNet) }}</div>
            <div class="card-sub">Actual amount you keep</div>
          </div>
          <div class="summary-card summary-card--highlight">
            <div class="card-label">Lost to Fund Fees</div>
            <div class="card-value card-value--large">{{ formatCurrency(results.totalFeesPaid) }}</div>
            <div class="card-sub">Wealth eaten by compounding fees</div>
          </div>
          <div class="summary-card">
            <div class="card-label">Fee Efficiency</div>
            <div class="card-value card-value--green">{{ formatPercent(results.efficiencyPct) }}</div>
            <div class="card-sub">Of gross potential kept</div>
          </div>
        </div>

        <div class="chart-wrap">
          <div class="chart-legend">
            <span class="legend-dot legend-dot--gross"></span>
            <span class="legend-label">Gross Value (0% Fee)</span>
            <span class="legend-dot legend-dot--net"></span>
            <span class="legend-label">Net Value (After Fees)</span>
          </div>

          <svg viewBox="0 0 560 236" class="growth-chart" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
            <path v-if="chartPath.grossArea" :d="chartPath.grossArea" class="area-gross" />
            <path v-if="chartPath.netArea" :d="chartPath.netArea" class="area-net" />

            <path v-if="chartPath.grossLine" :d="chartPath.grossLine" class="line-gross" />
            <path v-if="chartPath.netLine" :d="chartPath.netLine" class="line-net" />

            <template v-if="hoveredYear !== null && chartPath.data?.[hoveredYear]">
              <line :x1="chartPath.xScale(hoveredYear)" y1="8" :x2="chartPath.xScale(hoveredYear)" y2="228" class="hover-line" />
              <circle :cx="chartPath.xScale(hoveredYear)" :cy="chartPath.yScale(chartPath.data[hoveredYear].grossBalance)" r="4" class="hover-dot hover-dot--gross" />
              <circle :cx="chartPath.xScale(hoveredYear)" :cy="chartPath.yScale(chartPath.data[hoveredYear].netBalance)" r="4" class="hover-dot hover-dot--net" />
            </template>
          </svg>

          <div v-if="hoveredYear !== null && chartPath.data?.[hoveredYear]" class="chart-tooltip" :style="{
              left: Math.min(tooltipX + 12, 360) + 'px',
              top: Math.max(tooltipY - 60, 0) + 'px'
            }">
            <div class="tooltip-year">Year {{ chartPath.data[hoveredYear].year }}</div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--gross"></span>
              <span class="tooltip-label">No Fee Growth:</span>
              <span class="tooltip-val">{{ formatCurrency(chartPath.data[hoveredYear].grossBalance) }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--net"></span>
              <span class="tooltip-label">Actual Balance:</span>
              <span class="tooltip-val">{{ formatCurrency(chartPath.data[hoveredYear].netBalance) }}</span>
            </div>
            <div class="tooltip-row">
              <span class="tooltip-dot tooltip-dot--fee"></span>
              <span class="tooltip-label">Lost to Fees:</span>
              <span class="tooltip-val tooltip-val--red">{{ formatCurrency(chartPath.data[hoveredYear].lostToFees) }}</span>
            </div>
          </div>

          <div class="chart-x-labels">
            <span>Year 0</span>
            <span>Year {{ Math.round(horizonYears / 2) }}</span>
            <span>Year {{ horizonYears }}</span>
          </div>
        </div>

        <div class="breakdown-section">
          <div class="panel-title panel-title--sm">Milestones Progression</div>
          <div class="milestone-table">
            <div class="milestone-header">
              <span>Year</span>
              <span>Net Portfolio</span>
              <span>Total Contributed</span>
              <span>Total Fee Loss</span>
            </div>
            <div v-for="row in (results.yearlyData ? results.yearlyData.filter((_, i) => i % Math.max(1, Math.floor(horizonYears / 5)) === 0 || i === horizonYears) : [])" :key="row.year" class="milestone-row">
              <span class="milestone-year">{{ row.year }}</span>
              <span class="milestone-value">{{ formatCurrency(row.netBalance) }}</span>
              <span class="milestone-contrib">{{ formatCurrency(row.totalContributed) }}</span>
              <span class="milestone-fee">{{ formatCurrency(row.lostToFees) }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <p class="disclaimer">
      This fee assessment models linear returns net of expense ratios compounded annually. Actual ETF internal fees are accrued daily inside the Net Asset Value (NAV) and fund dividends may affect real performance parameters.
    </p>
  </div>
</template>

<style scoped>
.calculator-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
}

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
  border: 1px solid #e5e7eb;
}

.summary-card--highlight {
  background: linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%);
  border: none;
}

.card-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
}

.summary-card--highlight .card-label {
  color: rgba(254, 226, 226, 0.7);
}

.card-value {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #111111;
  line-height: 1.4;
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
  margin-top: 2px;
}

.summary-card--highlight .card-sub {
  color: #fca5a5;
}

/* Charts */
.chart-wrap {
  position: relative;
  margin: 1.5rem -0.25rem 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #555555;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-dot--gross { background: #9ca3af; }
.legend-dot--net { background: #4f8ef7; }

.legend-label {
  margin-right: 12px;
}

.growth-chart {
  display: block;
  width: 100%;
  height: auto;
  cursor: crosshair;
}

.area-gross {
  fill: #9ca3af;
  opacity: 0.1;
}

.area-net {
  fill: #4f8ef7;
  opacity: 0.15;
}

.line-gross {
  fill: none;
  stroke: #9ca3af;
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
}

.line-net {
  fill: none;
  stroke: #4f8ef7;
  stroke-width: 2.5;
}

.hover-line {
  stroke: #d1d5db;
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.hover-dot--gross { fill: #9ca3af; stroke: #ffffff; stroke-width: 2; }
.hover-dot--net { fill: #4f8ef7; stroke: #ffffff; stroke-width: 2; }

/* Tooltip definitions */
.chart-tooltip {
  position: absolute;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  pointer-events: none;
  z-index: 10;
  min-width: 190px;
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
  margin: 4px 0;
}

.tooltip-dot { width: 7px; height: 7px; border-radius: 50%; }
.tooltip-dot--gross { background: #9ca3af; }
.tooltip-dot--net { background: #4f8ef7; }
.tooltip-dot--fee { background: #dc2626; }

.tooltip-label { color: #555555; flex: 1; }
.tooltip-val { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #111111; }
.tooltip-val--red { color: #dc2626; }

.chart-x-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
  margin-top: 6px;
}

/* Milestone Data Layouts */
.milestone-table {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  font-size: 13px;
}

.milestone-header, .milestone-row {
  display: grid;
  grid-template-columns: 50px 1fr 1fr 1fr;
}

.milestone-header {
  background: #f9fafb;
  padding: 8px 14px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
}

.milestone-header span, .milestone-row span {
  padding: 8px 10px;
}

.milestone-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.1s;
}

.milestone-row:last-child { border-bottom: none; }
.milestone-row:hover { background: #f9fafb; }

.milestone-year { color: #555555; font-weight: 600; }
.milestone-value { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #111111; }
.milestone-contrib { font-family: 'JetBrains Mono', monospace; color: #555555; }
.milestone-fee { font-family: 'JetBrains Mono', monospace; color: #dc2626; font-weight: 500; }

.disclaimer {
  margin-top: 2.5rem;
  font-size: 11px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
}

/* Dark mode variations override */
@media (prefers-color-scheme: dark) {
  .page-header h1 { color: #f3f4f6; }
  .header-sub, .field-label, .chart-legend, .tooltip-year, .tooltip-label, .milestone-year, .milestone-contrib { color: #9ca3af; }
  .inputs-panel, .results-panel { background: #1a1a2e; border-color: #2d2d44; }
  .field-input, .card-value, .tooltip-val, .milestone-value { color: #f3f4f6; }
  .input-prefix-wrap, .input-suffix-wrap { background: #12122a; border-color: #2d2d44; }
  .input-prefix-wrap:focus-within, .input-suffix-wrap:focus-within { border-color: #4f8ef7; background: #1a1a2e; }
  .summary-card { background: #12122a; border-color: #2d2d44; }
  .milestone-table, .milestone-header, .milestone-row, .chart-tooltip { border-color: #2d2d44; }
  .milestone-header, .milestone-row:hover { background: #12122a; }
  .hover-line { stroke: #2d2d44; }
  .chart-tooltip { background: #1a1a2e; }
  .milestone-fee, .tooltip-val--red { color: #f87171; }
}
</style>