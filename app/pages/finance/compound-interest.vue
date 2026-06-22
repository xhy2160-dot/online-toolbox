<!-- pages/productivity/compound-interest.vue -->
<template>
  <div class="tool">
    <div class="tool-header">
      <NuxtLink to="/productivity" class="back">← Tools</NuxtLink>
      <h1>Compound Interest Calculator</h1>
      <p>Calculate how your investment grows over time with compound interest.</p>
    </div>

    <div class="layout">
      <!-- inputs -->
      <div class="panel">
        <div class="field">
          <label>Initial Investment</label>
          <div class="input-wrap">
            <span class="prefix">$</span>
            <input v-model.number="principal" type="number" min="0" placeholder="10000" />
          </div>
        </div>

        <div class="field">
          <label>Monthly Contribution</label>
          <div class="input-wrap">
            <span class="prefix">$</span>
            <input v-model.number="monthlyContribution" type="number" min="0" placeholder="500" />
          </div>
        </div>

        <div class="field">
          <label>Annual Interest Rate</label>
          <div class="input-wrap">
            <input v-model.number="rate" type="number" min="0" max="100" step="0.1" placeholder="7" />
            <span class="suffix">%</span>
          </div>
        </div>

        <div class="field">
          <label>Time Period</label>
          <div class="input-wrap">
            <input v-model.number="years" type="number" min="1" max="50" placeholder="20" />
            <span class="suffix">yrs</span>
          </div>
        </div>

        <div class="field">
          <label>Compound Frequency</label>
          <select v-model.number="frequency">
            <option :value="1">Annually</option>
            <option :value="2">Semi-annually</option>
            <option :value="4">Quarterly</option>
            <option :value="12">Monthly</option>
            <option :value="365">Daily</option>
          </select>
        </div>
      </div>

      <!-- results -->
      <div class="results">
        <div class="result-card highlight">
          <span class="result-label">Final Balance</span>
          <span class="result-value">{{ formatCurrency(finalBalance) }}</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Invested</span>
          <span class="result-value">{{ formatCurrency(totalInvested) }}</span>
        </div>

        <div class="result-card">
          <span class="result-label">Total Interest Earned</span>
          <span class="result-value green">{{ formatCurrency(totalInterest) }}</span>
        </div>

        <div class="result-card">
          <span class="result-label">Return on Investment</span>
          <span class="result-value green">{{ roi }}%</span>
        </div>

        <!-- year by year breakdown -->
        <div class="breakdown">
          <h3>Year by Year</h3>
          <div class="table-wrap">
            <table>
              <thead>
              <tr>
                <th>Year</th>
                <th>Balance</th>
                <th>Invested</th>
                <th>Interest</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in breakdown" :key="row.year">
                <td>{{ row.year }}</td>
                <td>{{ formatCurrency(row.balance) }}</td>
                <td>{{ formatCurrency(row.invested) }}</td>
                <td class="green">{{ formatCurrency(row.interest) }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Compound Interest Calculator — Free Online Tool',
  description: 'Calculate how your investments grow over time with compound interest. Supports monthly contributions and multiple compounding frequencies.',
  ogTitle: 'Compound Interest Calculator',
  ogDescription: 'See how your money grows with compound interest. Free and instant.',
})

useSchemaOrg([
  defineWebPage(),
  {
    '@type': 'SoftwareApplication',
    name: 'Compound Interest Calculator',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0' }
  }
])



const principal = ref(10000)
const monthlyContribution = ref(500)
const rate = ref(7)
const years = ref(20)
const frequency = ref(12)

const breakdown = computed(() => {
  const rows = []
  const r = rate.value / 100 / frequency.value
  const contributionsPerYear = 12 // monthly contributions always monthly

  let balance = principal.value
  let totalInvestedSoFar = principal.value

  for (let y = 1; y <= years.value; y++) {
    // compound principal + contributions for this year
    for (let p = 0; p < frequency.value; p++) {
      balance *= (1 + r)
    }

    // add monthly contributions for this year
    const monthlyContribForYear = monthlyContribution.value * contributionsPerYear
    // compound contributions added mid-year (simplified: add at end of year)
    balance += monthlyContribForYear
    totalInvestedSoFar += monthlyContribForYear

    rows.push({
      year: y,
      balance: Math.round(balance),
      invested: Math.round(totalInvestedSoFar),
      interest: Math.round(balance - totalInvestedSoFar),
    })
  }

  return rows
})

const finalBalance = computed(() => {
  $fetch(`/api/productivity/${'Compound Interest Calculator'}/counter`, { method: 'POST' })
  return breakdown.value[breakdown.value.length - 1]?.balance ?? 0
})
const totalInvested = computed(() => breakdown.value[breakdown.value.length - 1]?.invested ?? 0)
const totalInterest = computed(() => finalBalance.value - totalInvested.value)
const roi = computed(() => {
  if (totalInvested.value === 0) return '0.00'
  return ((totalInterest.value / totalInvested.value) * 100).toFixed(2)
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.tool {
  max-width: 960px;
  margin: 0 auto;
}

.tool-header {
  margin-bottom: 2rem;
}

.back {
  font-size: 0.85rem;
  color: #999;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.back:hover {
  color: #1a1a1a;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.tool-header p {
  color: #666;
  font-size: 0.95rem;
}

.layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
  align-items: start;
}

/* inputs panel */
.panel {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.4rem;
}

.input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid #d8d0c7;
  border-radius: 10px;
  overflow: hidden;
}

.prefix,
.suffix {
  padding: 0.7rem 0.75rem;
  background: #f5f1ea;
  color: #888;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
}

.input-wrap input {
  flex: 1;
  padding: 0.7rem 0.9rem;
  border: none;
  outline: none;
  font-size: 0.9rem;
  color: #1a1a1a;
  width: 100%;
}

select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d8d0c7;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #1a1a1a;
  outline: none;
  background: #fff;
}

/* results */
.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-card.highlight {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.result-card.highlight .result-label {
  color: #aaa;
}

.result-card.highlight .result-value {
  color: #fff;
  font-size: 1.5rem;
}

.result-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.green {
  color: #16a34a;
}

/* breakdown table */
.breakdown {
  background: #fff;
  border: 1px solid #e8e0d8;
  border-radius: 12px;
  padding: 1.25rem;
}

.breakdown h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.table-wrap {
  overflow-x: auto;
  max-height: 320px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

thead {
  position: sticky;
  top: 0;
  background: #f5f1ea;
  z-index: 1;
}

th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #f0ebe3;
  color: #333;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: #faf8f5;
}

/* responsive */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>