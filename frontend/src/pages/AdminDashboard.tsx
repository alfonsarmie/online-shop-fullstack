import React, { useEffect, useState } from "react";
import "../styles/admin-dashboard.css";
import { orderService } from "../services/orderService";
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

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
  const [criticalStockLimit, setCriticalStockLimit] = useState<number>(10);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapStatusToFrontend = (status: string) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmado" };
      case "ready":
        return { label: "Listo para retirar" };
      case "cancelled":
        return { label: "Cancelado" };
      case "withdrawn":
        return { label: "Retirado" };
      default:
        return { label: status };
    }
  };

  const mapSportsToFrontend = (sport: string) => {
    switch (sport) {
      case "futbol":
        return { label: "Fútbol", color: "#266a2fff" };
      case "hockey":
        return { label: "Hockey", color: "#00BFFF" };
      case "futsal":
        return { label: "Futsal", color: "#FF1493" };
      case "vela":
        return { label: "Vela", color: "#FF4500" };
      case "voley":
        return { label: "Voley", color: "#32CD32" };
      case "natación":
        return { label: "Natación", color: "#1E90FF" };
      case "remo":
        return { label: "Remo", color: "#8A2BE2" };
      default:
        return { label: sport, color: "#8884d8" };
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const sports = await orderService.getSportsStats();
        setSportsStats(sports);
        const status = await orderService.getStatusStats();
        setStatusStats(status);
        const criticalProducts = await productService.getCriticalStockProducts(criticalStockLimit); 
        setCriticalStockProducts(criticalProducts);
        const topProductsData = await productService.getTopFiveProducts();
        setTopProducts(topProductsData);
      } catch (error) {
        console.error("Error loading stats:", error);
      }
      
      setLoadingCriticalStock(true);
      setErrorCriticalStock(null);
      try {
        const criticalProducts = await productService.getCriticalStockProducts(criticalStockLimit); 
        setCriticalStockProducts(criticalProducts);
      } catch (error) {
        console.error('Error loading critical stock products:', error);
        setErrorCriticalStock('No se pudo cargar el stock crítico.');
      } finally {
        setLoadingCriticalStock(false);
      }

      setLoadingTopProducts(true);
      setErrorTopProducts(null);
      try {
        const topProductsData = await productService.getTopFiveProducts();
        setTopProducts(topProductsData);
      } catch (error) {
        console.error('Error loading top products:', error);
        setErrorTopProducts('No se pudo cargar los productos más vendidos.');
      } finally {
        setLoadingTopProducts(false);
      }
    };
    loadStats();
  }, [criticalStockLimit]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCriticalStockLimit(value);
    } else if (event.target.value === '') {
       setCriticalStockLimit(10);
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

  const TopProductsTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#145526ff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>{`Producto: ${data.name}`}</p>
          <p style={{ margin: 0 }}>{`Cantidad de órdenes: ${data.orderCount}`}</p>
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

        <section className="admin-dashboard-grid-2">
          <div className="admin-dashboard-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Pedidos por deporte</h2>
            </div>
            <div className="admin-dashboard-panel-body"> 
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

          <div className="admin-dashboard-panel">
            <div className="admin-dashboard-panel-header">
              <h2>
                Estado de pedidos{" "}
                <span className="admin-dashboard-span-h2">(últimos 30 días)</span>
              </h2>
            </div>
            <div className="admin-dashboard-panel-body">
              <BarChart width={500} height={300} data={statusStats}> 
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
          <div className="admin-dashboard-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Stock Crítico
                <span className='admin-dashboard-span-h2'>(Stock &lt; {criticalStockLimit})</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="criticalStockLimitInput" className="admin-dashboard-label">Límite:</label>
                <input
                  id="criticalStockLimitInput"
                  type="number"
                  min="1"
                  value={criticalStockLimit}
                  onChange={handleLimitChange}
                  className="admin-dashboard-input"
                />
              </div>
            </div>
            
            <div className="admin-dashboard-panel-body">
              {loadingCriticalStock ? (
                <LoadingSpinner />
              ) : errorCriticalStock ? (
                <p style={{ color: '#d9534f' }}>{errorCriticalStock}</p>
              ) : criticalStockProducts.length === 0 ? (
                <p style={{ color: '#bdbdbd' }}>No hay productos con stock crítico (menor a {criticalStockLimit}).</p>
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

          <div className="admin-dashboard-panel">
            <div className="admin-dashboard-panel-header">
              <h2>Top 5 productos más vendidos</h2>
            </div>
            <div className="admin-dashboard-panel-body">
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