# Finance — Personal Finance Dashboard

A clean, interactive, and beautiful finance dashboard built with **Next.js 15**, **Tailwind CSS**, **Recharts**, and **Zustand**.

---

## ✨ Features

### 📊 Dashboard Overview
- **4 Summary Cards**: Total Balance, Income, Expenses, Savings Rate with trend badges
- **Cash Flow Area Chart**: Income vs. expenses over time (area chart with gradients)
- **Spending Donut Chart**: Category breakdown with custom legend
- **Monthly Comparison Bar Chart**: 6-month income vs. expense bars
- **Recent Activity Feed**: Last 6 transactions with category icons

### 💳 Transactions
- Full sortable, filterable table with category icons and merchant info
- **Search** by description, category, or merchant
- **Filters**: Category, Type (income/expense), Date range, Amount range
- **Sort** by date, amount, category, or type (asc/desc)
- **Export to CSV** with one click
- **Admin only**: Add, Edit, Delete transactions via modal

### 🔐 Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View all data | ✅ | ✅ |
| Filter & search | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Switch roles instantly via the **Viewer / Admin toggle** in the top header.

### 💡 Insights
- **Smart insight cards**: Highest spending, savings rate alerts, spending spikes, daily averages
- **Category ranking** with animated progress bars
- **Monthly net balance** chart (green = surplus, red = deficit)
- **Radar chart**: Spending pattern visualization
- **6 key metrics**: Avg transaction, largest expense/income, daily burn rate, savings rate

### 🎨 UI/UX
- Dark mode toggle with system-level persistence
- Responsive from mobile to ultrawide (sidebar collapses on mobile)
- Syne + DM Sans typography pairing for a modern editorial feel
- Gradient mesh backgrounds, glassmorphism cards
- Smooth animations and hover states throughout
- Empty state handling for all data-dependent components

### 💾 State Management (Zustand + Persist)
- All transactions, filters, role, dark mode, and time range persist via `localStorage`
- Fully reactive — no prop drilling

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with dark mode wrapper
│   ├── page.tsx            # Main page with view routing
│   └── globals.css         # Tailwind base + design tokens + animations
├── components/
│   ├── Sidebar.tsx         # Fixed sidebar nav with role badge
│   ├── Header.tsx          # Sticky header: role switcher, dark mode, notifications
│   ├── DarkModeWrapper.tsx # Client wrapper to apply dark class to <html>
│   ├── DashboardOverview.tsx  # Main dashboard layout
│   ├── StatCard.tsx        # Animated summary stat cards
│   ├── TimeRangePicker.tsx # 7D / 30D / 90D / 1Y time range toggle
│   ├── BalanceTrendChart.tsx  # Area chart: income vs expenses over time
│   ├── SpendingPieChart.tsx   # Donut chart: spending by category
│   ├── MonthlyBarChart.tsx    # Grouped bar: income vs expenses monthly
│   ├── RecentTransactions.tsx # Compact recent activity feed
│   ├── TransactionsSection.tsx # Full transaction table with filters
│   ├── TransactionModal.tsx    # Add/Edit modal (admin only)
│   └── InsightsSection.tsx    # Analytics: insights, radar chart, metrics
├── lib/
│   ├── data.ts             # Mock transactions + category colors/icons
│   └── utils.ts            # cn(), formatCurrency, filter logic, aggregations
├── store/
│   └── useStore.ts         # Zustand store with localStorage persistence
└── types/
    └── index.ts            # TypeScript types: Transaction, FilterState, etc.
```

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **Zustand + persist** | Global state + localStorage |
| **Recharts** | All charts (area, bar, pie, radar) |
| **Lucide React** | Icon set |
| **date-fns** | Date formatting and manipulation |
| **clsx + tailwind-merge** | Conditional class utilities |

---

## 🎨 Design Decisions

- **Syne** (display font) paired with **DM Sans** (body) for a modern, editorial feel
- **Glass cards** with `backdrop-blur` for depth without heaviness
- **Gradient meshes** in the background add visual texture
- **Color-coded categories** consistently across pie chart, table badges, and category bars
- **Violet as primary** brand color — conveys trust, sophistication, and modernity
- Separate **income green** (#10b981) and **expense red** (#f43f5e) across all charts

---

## 📝 Assumptions

- Data is **mock/static** — no backend or API required
- The "role" system is **UI-only simulation** — switching roles does not require authentication
- All state (including added transactions) persists in **localStorage** across sessions
- Currency is fixed to **USD**

---

## 🔮 Possible Extensions

- Connect to a real API / database (Supabase, Prisma)
- Authentication (NextAuth.js) with real RBAC
- Recurring transactions / budget goals
- Email alerts for overspending
- Multi-currency support
- CSV / PDF import for bank statements
