<template>
  <div class="calculator-container">
    <header class="calc-header">
      <h1 class="title">Mortgage Calculator</h1>
      <p class="subtitle">Estimate your monthly mortgage payment with taxes, insurance, and an amortization breakdown.</p>
    </header>

    <div class="calc-grid">
      <section class="card inputs-card">
        <h2 class="section-title">Loan Details</h2>
        <form @submit.prevent class="form-grid">

          <div class="input-group">
            <label for="homePrice">Home Price</label>
            <div class="input-wrapper">
              <span class="prefix">$</span>
              <input id="homePrice" v-model.number="homePrice" type="number" min="0" step="1000" />
            </div>
          </div>

          <div class="input-group-row">
            <div class="input-group basis-2/3">
              <label for="downPayment">Down Payment</label>
              <div class="input-wrapper">
                <span class="prefix">$</span>
                <input id="downPayment" v-model.number="downPayment" type="number" min="0" :max="homePrice" step="1000" @input="updateDownPaymentPct" />
              </div>
            </div>
            <div class="input-group basis-1/3">
              <label for="downPaymentPct">Percentage</label>
              <div class="input-wrapper">
                <input id="downPaymentPct" v-model.number="downPaymentPct" type="number" min="0" max="100" step="0.1" @input="updateDownPaymentAmt" />
                <span class="suffix">%</span>
              </div>
            </div>
          </div>

          <div class="input-group">
            <label for="interestRate">Interest Rate</label>
            <div class="input-wrapper">
              <input id="interestRate" v-model.number="interestRate" type="number" min="0.01" max="25" step="0.01" />
              <span class="suffix">%</span>
            </div>
          </div>

          <div class="input-group">
            <label for="loanTerm">Loan Term</label>
            <select id="loanTerm" v-model.number="loanTermYears" class="select-input">
              <option :value="30">30 Years Fixed</option>
              <option :value="20">20 Years Fixed</option>
              <option :value="15">15 Years Fixed</option>
              <option :value="10">10 Years Fixed</option>
            </select>
          </div>

          <hr class="divider" />

          <h2 class="section-title pt-2">Taxes & fees (Monthly estimates)</h2>

          <div class="input-group">
            <label for="propertyTax">Annual Property Tax</label>
            <div class="input-wrapper">
              <span class="prefix">$</span>
              <input id="propertyTax" v-model.number="annualPropertyTax" type="number" min="0" step="100" />
            </div>
          </div>

          <div class="input-group">
            <label for="homeInsurance">Annual Home Insurance</label>
            <div class="input-wrapper">
              <span class="prefix">$</span>
              <input id="homeInsurance" v-model.number="annualInsurance" type="number" min="0" step="100" />
            </div>
          </div>

          <div class="input-group">
            <label for="hoa">HOA Fees (Monthly)</label>
            <div class="input-wrapper">
              <span class="prefix">$</span>
              <input id="hoa" v-model.number="monthlyHoa" type="number" min="0" step="10" />
            </div>
          </div>

        </form>
      </section>

      <section class="results-column">
        <div class="card summary-card">
          <h2 class="section-title text-center text-gray-700">Estimated Monthly Payment</h2>
          <div class="total-payment-badge">
            ${{ totalMonthlyPayment.toFixed(2) }}
          </div>

          <div class="breakdown-list">
            <div class="breakdown-item">
              <span class="label font-semibold"><span class="bullet p-and-i"></span> Principal & Interest</span>
              <span class="value">${{ monthlyPrincipalAndInterest.toFixed(2) }}</span>
            </div>
            <div class="breakdown-item">
              <span class="label"><span class="bullet tax"></span> Property Taxes</span>
              <span class="value">${{ (annualPropertyTax / 12).toFixed(2) }}</span>
            </div>
            <div class="breakdown-item">
              <span class="label"><span class="bullet insurance"></span> Home Insurance</span>
              <span class="value">${{ (annualInsurance / 12).toFixed(2) }}</span>
            </div>
            <div class="breakdown-item">
              <span class="label"><span class="bullet hoa-bullet"></span> HOA Fees</span>
              <span class="value">${{ monthlyHoa.toFixed(2) }}</span>
            </div>
          </div>

          <div class="loan-summary-box">
            <p><strong>Total Loan Amount:</strong> ${{ loanAmount.toLocaleString() }}</p>
            <p><strong>Total Interest Paid:</strong> ${{ totalInterestPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2}) }}</p>
          </div>
        </div>
      </section>
    </div>

    <div class="card mt-8">
      <h2 class="section-title mb-4">Amortization Schedule (First Year Overview)</h2>
      <div class="table-wrapper">
        <table class="schedule-table">
          <thead>
          <tr>
            <th>Month</th>
            <th>Payment</th>
            <th>Principal Paid</th>
            <th>Interest Paid</th>
            <th>Remaining Balance</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in amortizationSchedule.slice(0, 12)" :key="row.month">
            <td class="font-medium">Month {{ row.month }}</td>
            <td>${{ row.payment.toFixed(2) }}</td>
            <td>${{ row.principalPaid.toFixed(2) }}</td>
            <td>${{ row.interestPaid.toFixed(2) }}</td>
            <td>${{ Math.max(0, row.remainingBalance).toFixed(2) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Reactive input state
const homePrice = ref(400000)
const downPayment = ref(80000)
const downPaymentPct = ref(20)
const interestRate = ref(6.5)
const loanTermYears = ref(30)
const annualPropertyTax = ref(4800)
const annualInsurance = ref(1200)
const monthlyHoa = ref(150)

// Synchronize Down Payment Dollar Input with Percentages
function updateDownPaymentPct() {
  if (homePrice.value > 0) {
    downPaymentPct.value = Math.round((downPayment.value / homePrice.value) * 1000) / 10
  }
}

function updateDownPaymentAmt() {
  downPayment.value = Math.round((downPaymentPct.value / 100) * homePrice.value)
}

// Calculations
const loanAmount = computed(() => {
  const amt = homePrice.value - downPayment.value
  return amt > 0 ? amt : 0
})

const monthlyPrincipalAndInterest = computed(() => {
  const P = loanAmount.value
  const monthlyRate = (interestRate.value / 100) / 12
  const n = loanTermYears.value * 12

  if (P <= 0) return 0
  if (monthlyRate === 0) return P / n

  // Standard amortization calculation formula
  return (P * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
})

const totalMonthlyPayment = computed(() => {
  const tax = annualPropertyTax.value / 12
  const ins = annualInsurance.value / 12
  return monthlyPrincipalAndInterest.value + tax + ins + monthlyHoa.value
})

// Generate complete matrix table mapping out payments
const amortizationSchedule = computed(() => {
  const schedule = []
  let balance = loanAmount.value
  const monthlyRate = (interestRate.value / 100) / 12
  const totalMonths = loanTermYears.value * 12
  const payment = monthlyPrincipalAndInterest.value

  for (let month = 1; month <= totalMonths; month++) {
    const interestPaid = balance * monthlyRate
    const principalPaid = payment - interestPaid
    balance -= principalPaid

    schedule.push({
      month,
      payment,
      interestPaid,
      principalPaid,
      remainingBalance: balance
    })
  }
  return schedule
})

const totalInterestPaid = computed(() => {
  return amortizationSchedule.value.reduce((sum, row) => sum + row.interestPaid, 0)
})
</script>

<style scoped>
.calculator-container {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
  color: #1f2937;
}

.calc-header {
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4b5563;
  font-size: 1.05rem;
}

.calc-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .calc-grid {
    grid-template-columns: 3fr 2fr;
  }
}

.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group-row {
  display: flex;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  display: flex;
  position: relative;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
}

.input-wrapper:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.input-wrapper input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  outline: none;
  border-radius: 8px;
  font-size: 1rem;
}

.prefix {
  padding-left: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.suffix {
  padding-right: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.select-input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
  background-color: #fff;
}

.select-input:focus {
  border-color: #2563eb;
}

.divider {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

/* SUMMARY / BADGE DESIGN */
.results-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: #f9fafb;
  border-color: #e5e7eb;
  position: sticky;
  top: 2rem;
}

.total-payment-badge {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #111827;
  margin: 1.5rem 0 2rem 0;
  letter-spacing: -0.03em;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.bullet {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}
.p-and-i { background-color: #2563eb; }
.tax { background-color: #10b981; }
.insurance { background-color: #f59e0b; }
.hoa-bullet { background-color: #6b7280; }

.loan-summary-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* TABLE STYLING */
.table-wrapper {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.schedule-table th {
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.schedule-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
}
</style>