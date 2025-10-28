import React, { useEffect, useState } from "react";
import "../styles/admin-dashboard.css";
import { BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // ResponsiveContainer ya no se usa para el de stock, pero lo dejamos por el de Pedidos
import { orderService } from "../services/orderService";
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';

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

const AdminDashboard: React.FC = () => {
  const [sportsStats, setSportsStats] = useState<SportsStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [criticalStockProducts, setCriticalStockProducts] = useState<CriticalProductInfo[]>([]);
  const [loadingCriticalStock, setLoadingCriticalStock] = useState(true);
  const [errorCriticalStock, setErrorCriticalStock] = useState<string | null>(null);
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

  return (
    <div className="page-with-nav-spacing admin-surface">
      <div className="admin-dashboard">
        <h1>Dashboard estadísticas</h1>
        <p className="subtitle">
          Resumen ejecutivo del e-commerce del club...
        </p>

        <section className="grid-2">
          <div className="panel">
            <div className="panel-header">
              <h2>Pedidos por deporte</h2>
            </div>
            {/* Este panel-body no tiene estilos en línea y funciona */}
            <div className="panel-body"> 
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

          <div className="panel">
            <div className="panel-header">
              <h2>
                Estado de pedidos{" "}
                <span className="span-h2">(últimos 30 días)</span>
              </h2>
            </div>
            <div className="panel-body">
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

        <section>
            <div className="panel">
              <div className="panel-header">
                <h2>Stock Crítico
                  <span className='span-h2'>(Stock &lt; {criticalStockLimit})</span>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="criticalStockLimitInput" style={{ fontSize: '13px', color: '#bdbdbd' }}>Límite:</label>
                  <input
                    id="criticalStockLimitInput"
                    type="number"
                    min="1"
                    value={criticalStockLimit}
                    onChange={handleLimitChange}
                    style={{ width: '60px', padding: '4px 8px', fontSize: '13px', background: '#151515', border: '1px solid #2a2a2a', color: '#e6e6e6', borderRadius: '4px' }}
                  />
                </div>
              </div>
              
              <div className="panel-body">
                {loadingCriticalStock ? (
                  <LoadingSpinner />
                ) : errorCriticalStock ? (
                  <p style={{ color: '#d9534f' }}>{errorCriticalStock}</p>
                ) : criticalStockProducts.length === 0 ? (
                  <p style={{ color: '#bdbdbd' }}>No hay productos con stock crítico (menor a {criticalStockLimit}).</p>
                ) : (

                  <BarChart 
                    width={1400} 
                    height={300} 
                    data={criticalStockProducts} 
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                      <XAxis dataKey="name" tick={{ fill: '#bdbdbd', fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fill: '#bdbdbd', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#151515', border: '1px solid #2a2a2a', borderRadius: '4px' }}
                        labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        itemStyle={{ color: '#d9534f' }} 
                        formatter={(value: number) => [`${value} unidades`, 'Stock']}
                      />
                      <Bar dataKey="stock" name="Stock Actual" fill="#d9534f" barSize={30} />
                  </BarChart>
                )}
              </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;