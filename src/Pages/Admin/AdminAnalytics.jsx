import { BarChart3, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import "./AdminCustomers.css";

const sampleData = [
  { month: "Jan", sales: 4000, visitors: 240 },
  { month: "Feb", sales: 3000, visitors: 198 },
  { month: "Mar", sales: 5000, visitors: 280 },
  { month: "Apr", sales: 4500, visitors: 260 },
  { month: "May", sales: 6000, visitors: 310 },
  { month: "Jun", sales: 5500, visitors: 290 },
];

const AdminAnalytics = () => (
  <div className="admin-analytics">
    <div className="admin-analytics-header">
      <div>
        <h2>Analytics</h2>
        <p className="admin-dash-subtitle">Deep insights into your business performance</p>
      </div>
    </div>

    <div className="admin-dash-metrics">
      {[
        { label: "Total Revenue", value: "₹28,000", icon: TrendingUp, color: "#609966", change: "+12.5%" },
        { label: "Sales Growth", value: "8.3%", icon: Activity, color: "#40513B", change: "+2.1%" },
        { label: "Avg. Order Value", value: "₹1,250", icon: TrendingDown, color: "#7BAF78", change: "-0.8%" },
        { label: "Conversion", value: "3.2%", icon: TrendingUp, color: "#9DC08B", change: "+0.4%" },
      ].map((m, i) => (
        <div key={i} className="admin-dash-metric-card">
          <div className="admin-dash-metric-icon" style={{ background: `${m.color}15`, color: m.color }}>
            <m.icon size={22} />
          </div>
          <div className="admin-dash-metric-body">
            <span className="admin-dash-metric-value">{m.value}</span>
            <span className="admin-dash-metric-label">{m.label} <span style={{ color: m.change.startsWith("+") ? "#609966" : "#ef4444", fontSize: "0.78rem" }}>{m.change}</span></span>
          </div>
        </div>
      ))}
    </div>

    <div className="admin-dash-charts">
      <div className="admin-dash-chart-card">
        <h3 className="admin-dash-chart-title">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eae8e3" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#b0aca4" }} />
            <YAxis tick={{ fontSize: 12, fill: "#b0aca4" }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eae8e3" }} />
            <Bar dataKey="sales" fill="#609966" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="admin-dash-chart-card">
        <h3 className="admin-dash-chart-title">Visitor Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eae8e3" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#b0aca4" }} />
            <YAxis tick={{ fontSize: 12, fill: "#b0aca4" }} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eae8e3" }} />
            <Line type="monotone" dataKey="visitors" stroke="#40513B" strokeWidth={2} dot={{ fill: "#40513B", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="admin-page-stub" style={{ minHeight: 200, padding: "40px 24px" }}>
      <p style={{ fontSize: "0.9rem", color: "#b0aca4" }}>
        Full analytics with date range filtering, export, and custom metrics coming soon.
      </p>
    </div>
  </div>
);

export default AdminAnalytics;
