// AdminDashboard: Executive overview for the store performance.
// - Displays high-level KPIs (revenue, orders, conversion, AOV)
// - Lightweight charts without external libraries (SVG sparkline, stacked bars)
// - Mock data placeholders to be replaced by real backend data
// How to wire real data:
//   - Replace the mock constants with API calls (e.g., useEffect + fetch)
//   - Map responses to the KPI shape and chart series expected here
//   - Keep presentational code (labels/titles) separate from data wiring
import React, { useEffect } from 'react';
import '../styles/admin-dashboard.css';

// KPI card shape used for the top summary tiles
type KPI = {
  label: string;
  value: string;
  sub?: string;
};

// Helper to format numbers as Argentine pesos without decimals
const currency = (n: number) =>
  n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const AdminDashboard: React.FC = () => {
  // Ensure we land at top when entering dashboard
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Mock data (replace with real backend wiring)
  // Executive, consistent labels for clarity across the team
  const kpis: KPI[] = [
    { label: 'Ingresos de hoy', value: currency(185000), sub: 'vs. ayer +12%' },
    { label: 'Pedidos de hoy', value: '42', sub: 'Devoluciones 1.2%' },
    { label: 'Tasa de conversión', value: '2.4%', sub: 'Sesiones 3.1k' },
    { label: 'Ticket promedio', value: currency(4400), sub: 'vs. semana anterior +5%' },
  ];

  // Normalized sales for last 7 days (units or indexed revenue)
  const salesLast7 = [35, 52, 44, 60, 48, 72, 58];
  const topProducts = [
    { name: 'Camiseta Titular 24/25', units: 184, revenue: 520000 },
    { name: 'Buzo Entrenamiento', units: 132, revenue: 310000 },
    { name: 'Pantalón Deportivo', units: 96, revenue: 210000 },
  ];
  const lowStock = [
    { name: 'Camiseta Alternativa (M)', stock: 6 },
    { name: 'Short Entrenamiento (S)', stock: 8 },
    { name: 'Medias Ofciales', stock: 12 },
  ];
  const orderStatus = [
    { label: 'Entregados', value: 46, color: '#1E7335' },
    { label: 'Pendientes', value: 9, color: '#E6B800' },
    { label: 'Devueltos', value: 3, color: '#C0392B' },
  ];
  const traffic = [
    { label: 'Orgánico', pct: 42, color: '#1E7335' },
    { label: 'Redes', pct: 28, color: '#16572A' },
    { label: 'Email', pct: 15, color: '#7FB77E' },
    { label: 'Directo', pct: 15, color: '#A3D9A5' },
  ];

  // Build simple sparkline path from the 7-day series
  // Explanation:
  //   - chartWidth / chartHeight define a small canvas
  //   - Each point (day) is spaced evenly on X using stepX
  //   - Y is inverted so larger values go “up” visually
  //   - We generate an SVG path using M/L commands: M for the first point, L for lines
  const chartWidth = 280;
  const chartHeight = 80;
  const maxVal = Math.max(...salesLast7);
  const stepX = chartWidth / (salesLast7.length - 1);
  const path = salesLast7
    .map((v, i) => {
      const x = i * stepX;
      const y = chartHeight - (v / maxVal) * chartHeight;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="page-with-nav-spacing">
      <div className="admin-dashboard">
        <h1>Dashboard estadísticas</h1>
      <p className="subtitle">Resumen ejecutivo del e‑commerce del club: ventas, pedidos, conversión y stock con señales accionables y actualización diaria</p>

      {/* KPI summary tiles */}
      <section className="kpis">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <span className="kpi-label">{k.label}</span>
            <span className="kpi-value">{k.value}</span>
            {k.sub && <span className="kpi-sub">{k.sub}</span>}
          </div>
        ))}
      </section>

      {/* Sales trend and order status */}
      <section className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h2>Evolución de ventas (7 días)</h2>
          </div>
          <div className="panel-body">
            <svg width={chartWidth} height={chartHeight} className="sparkline">
              <path d={path} stroke="#1E7335" strokeWidth="3" fill="none" />
            </svg>
            <div className="legend">
              {salesLast7.map((v, i) => (
                <span key={i} className="legend-item">
                  D{i + 1}: {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Estado de pedidos</h2>
          </div>
          <div className="panel-body">
            <div className="stacked-bar">
              {orderStatus.map((s) => (
                <span
                  key={s.label}
                  className="stacked-seg"
                  style={{ width: `${(s.value / orderStatus.reduce((a, b) => a + b.value, 0)) * 100}%`, backgroundColor: s.color }}
                  title={`${s.label}: ${s.value}`}
                />
              ))}
            </div>
            <ul className="status-list">
              {orderStatus.map((s) => (
                <li key={s.label}>
                  <span className="dot" style={{ background: s.color }} />
                  {s.label}
                  <span className="right">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Top sellers and low-stock alerts */}
      <section className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <h2>Top de productos</h2>
          </div>
          <div className="panel-body">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Unidades</th>
                  <th>Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.units}</td>
                    <td>{currency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Alertas de stock</h2>
          </div>
          <div className="panel-body">
            <ul className="list">
              {lowStock.map((i) => (
                <li key={i.name}>
                  <span>{i.name}</span>
                  <span className={`badge ${i.stock < 10 ? 'danger' : 'warn'}`}>{i.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Traffic mix by acquisition channel */}
      <section className="grid-1">
        <div className="panel">
          <div className="panel-header">
            <h2>Mix de tráfico</h2>
          </div>
          <div className="panel-body">
            <div className="stacked-bar large">
              {traffic.map((t) => (
                <span
                  key={t.label}
                  className="stacked-seg"
                  style={{ width: `${t.pct}%`, backgroundColor: t.color }}
                  title={`${t.label}: ${t.pct}%`}
                />
              ))}
            </div>
            <ul className="status-list">
              {traffic.map((t) => (
                <li key={t.label}>
                  <span className="dot" style={{ background: t.color }} />
                  {t.label}
                  <span className="right">{t.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
