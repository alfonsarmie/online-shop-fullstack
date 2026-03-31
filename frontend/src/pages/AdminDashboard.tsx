import React, { useEffect, useState } from "react";
import "../styles/admin-dashboard.css";
import { orderService } from "../services/orderService";
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { FaMoneyBillWave } from 'react-icons/fa';

type SportsStat = {
  sport: string;
  ordersCount: number;
};

type StatusStat = {
  status: string;
  count: number;
};

interface CriticalProductInfo {
  name: string;
  stock: number;
}

type TopProductStat = {
  name: string;
  orderCount: number;
};

const AdminDashboard: React.FC = () => {
  const [sportsStats, setSportsStats] = useState<SportsStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [criticalStockProducts, setCriticalStockProducts] = useState<CriticalProductInfo[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductStat[]>([]);
  const [loadingCriticalStock, setLoadingCriticalStock] = useState(true);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);
  const [errorCriticalStock, setErrorCriticalStock] = useState<string | null>(null);
  const [errorTopProducts, setErrorTopProducts] = useState<string | null>(null);
  const [criticalStockLimit, setCriticalStockLimit] = useState<number | string>(10);
  const [monthlyWorth, setMonthlyWorth] = useState<number | null>(null);
  const [loadingMonthlyWorth, setLoadingMonthlyWorth] = useState(true);
  const [errorMonthlyWorth, setErrorMonthlyWorth] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapStatusToFrontend = (status: string) => {
    const normalized = status?.toLowerCase().trim().replace(/_/g, '-');
    switch (normalized) {
      case "confirmed":
        return { label: "Confirmado" };
      case "ready":
        return { label: "Listo para retirar" };
      case "cancelled":
        return { label: "Cancelado" };
      case "withdrawn":
        return { label: "Retirado" };
      case "pending-payment":
        return { label: "Pendiente de pago" };
      default:
        return { label: status };
    }
  };

const mapSportsToFrontend = (sport: string) => {
  switch (sport) {
    case "futbol":
      return { label: "Fútbol", color: "#81C784" }; 
    case "hockey":
      return { label: "Hockey", color: "#fdcae1" }; 
    case "futsal":
      return { label: "Futsal", color: "#E57373" }; 
    case "vela":
      return { label: "Vela", color: "#FFB74D" }; 
    case "voley":
      return { label: "Voley", color: "#FFF176" }; 
    case "natación":
      return { label: "Natación", color: "#64B5F6" };
    case "remo":
      return { label: "Remo", color: "#BA68C8" }; 
    default:
      return { label: sport, color: "#B0BEC5" };
  }
};

useEffect(() => {
  const loadStats = async () => {
    try {
      setLoadingCriticalStock(true);
      setLoadingTopProducts(true);
      setLoadingMonthlyWorth(true);

      const [sports, status, critical, top, worth] = await Promise.all([
        orderService.getSportsStats(),
        orderService.getStatusStats(),
        productService.getCriticalStockProducts(criticalStockLimit === '' ? 0 : Number(criticalStockLimit)),
        productService.getTopFiveProducts(),
        orderService.getMonthlyWorth(),
      ]);

      setSportsStats(sports);
      setStatusStats(status);
      setCriticalStockProducts(critical);
      setTopProducts(top);
      setMonthlyWorth(worth.total_monthly_worth);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
      setErrorCriticalStock("No se pudo cargar el stock crítico.");
      setErrorTopProducts("No se pudo cargar los productos más vendidos.");
      setErrorMonthlyWorth("No se pudo cargar el monto mensual.");
    } finally {
      setLoadingCriticalStock(false);
      setLoadingTopProducts(false);
      setLoadingMonthlyWorth(false);
    }
  };
  loadStats();
}, [criticalStockLimit]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value === '') {
      setCriticalStockLimit('');
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setCriticalStockLimit(parsedValue);
      }
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mapped = mapStatusToFrontend(label);
      return (
        <div
          style={{
            backgroundColor: "#145526ff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{`Estado: ${mapped.label}`}</p>
          <p style={{ margin: 0 }}>{`Cantidad de pedidos: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const SportsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const mapped = mapSportsToFrontend(data.sport);
      return (
        <div
          style={{
            backgroundColor: "#145526ff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{`Deporte: ${mapped.label}`}</p>
          <p style={{ margin: 0 }}>{`Cantidad de pedidos: ${data.ordersCount}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard">
        <h1>Dashboard estadísticas</h1>
        <p className="admin-dashboard-subtitle">
          Resumen ejecutivo del e-commerce del club...
        </p>

        
        <section>
          <div className="admin-dashboard-panel kpi-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Monto ganado este mes</h2>
            </div>
            <div className="admin-dashboard-panel-body">
              {loadingMonthlyWorth ? (
                <LoadingSpinner />
              ) : errorMonthlyWorth ? (
                <p style={{ color: "#d9534f" }}>{errorMonthlyWorth}</p>
              ) : (
                <div className="kpi-card monthly-worth-card kpi-fade-in">
                  <div className="kpi-icon"><FaMoneyBillWave /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">Total del mes</span>
                    <span className="kpi-value">
                      ${monthlyWorth?.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="admin-dashboard-grid-2">
          <div className="admin-dashboard-panel kpi-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Pedidos por deporte</h2>
            </div>
            <div className="admin-dashboard-panel-body kpi-card sports-pie-chart"> 
              <PieChart width={400} height={300}>
                <Pie
                  data={sportsStats}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={(entry: any) =>
                    `${mapSportsToFrontend(entry.sport).label}: ${entry.ordersCount}`
                  }
                  outerRadius={100}
                  dataKey="ordersCount"
                >
                  {sportsStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={mapSportsToFrontend(entry.sport).color}
                    />
                  ))}
                </Pie>
                <Tooltip content={<SportsTooltip />} />
              </PieChart>
            </div>
          </div>

          <div className="admin-dashboard-panel kpi-panel">
            <div className="admin-dashboard-panel-header">
              <h2>
                Estado de pedidos{" "}
                <span className="admin-dashboard-span-h2">(últimos 30 días)</span>
              </h2>
            </div>
            <div className="admin-dashboard-panel-body kpi-card status-bar-chart">
              <BarChart width={600} height={300} data={statusStats}> 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="status"
                  tickFormatter={(value) => mapStatusToFrontend(value).label}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="count"
                  name="Cantidad de pedidos"
                  fill="#1E7335"
                />
              </BarChart>
            </div>
          </div>
        </section> 

        <section className="admin-dashboard-grid-2">
          <div className="admin-dashboard-panel kpi-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Stock Crítico
                <span className='admin-dashboard-span-h2'>(Stock &lt; {criticalStockLimit === '' ? 0 : criticalStockLimit})</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="criticalStockLimitInput" className="admin-dashboard-label">Límite:</label>
                <input
                  id="criticalStockLimitInput"
                  type="number"
                  min="0"
                  value={criticalStockLimit}
                  onChange={handleLimitChange}
                  className="admin-dashboard-input"
                />
              </div>
            </div>
            
            <div className="admin-dashboard-panel-body kpi-card">
              {loadingCriticalStock ? (
                <LoadingSpinner />
              ) : errorCriticalStock ? (
                <p style={{ color: '#d9534f' }}>{errorCriticalStock}</p>
              ) : criticalStockProducts.length === 0 ? (
                <p style={{ color: '#bdbdbd' }}>No hay productos con stock crítico (menor a {criticalStockLimit === '' ? 0 : criticalStockLimit}).</p>
              ) : (
                <table className="admin-dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalStockProducts.map((product) => (
                      <tr key={product.name}>
                        <td>{product.name}</td>
                        <td>{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="admin-dashboard-panel kpi-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Top 5 productos más vendidos</h2>
            </div>
            <div className="admin-dashboard-panel-body kpi-card">
              {loadingTopProducts ? (
                <LoadingSpinner />
              ) : errorTopProducts ? (
                <p style={{ color: '#d9534f' }}>{errorTopProducts}</p>
              ) : topProducts.length === 0 ? (
                <p style={{ color: '#bdbdbd' }}>No hay datos disponibles para los productos más vendidos.</p>
              ) : (
                <table className="admin-dashboard-data-table">
                  <thead>
                    <tr>
                      <th>Ranking</th>
                      <th>Producto</th>
                      <th>Órdenes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product.name}>
                        <td className="rank">{index + 1}°</td>
                        <td>{product.name}</td>
                        <td>{product.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>



      </div>
    </div>
  );
};

export default AdminDashboard;