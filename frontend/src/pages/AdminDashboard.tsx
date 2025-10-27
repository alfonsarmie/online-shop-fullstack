import React, { useEffect, useState } from 'react';
import '../styles/admin-dashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { orderService } from '../services/orderService';

type SportsStat = {
  sport: string;
  ordersCount: number;
};

type StatusStat = {
  status: string;
  count: number;
};

const AdminDashboard: React.FC = () => {
  const [sportsStats, setSportsStats] = useState<SportsStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  // Ensure we land at top when entering dashboard
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapStatusToFrontend = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmado'};
      case 'ready':
        return { label: 'Listo para retirar'};
      case 'cancelled':
        return { label: 'Cancelado'};
      case 'withdrawn':
        return { label: 'Retirado'};
      default:
        return { label: status};
    }
  };

  const mapSportsToFrontend = (sport: string) => {
    switch (sport) {
      case 'futbol':
        return { label: 'Fútbol', color: '#266a2fff' };
      case 'hockey':
        return { label: 'Hockey', color: '#00BFFF' };
      case 'futsal':
        return { label: 'Futsal', color: '#FF1493' };
      case 'vela':
        return { label: 'Vela', color: '#FF4500' };
      case 'voley':
        return { label: 'Voley', color: '#32CD32' };
      case 'natación':
        return { label: 'Natación', color: '#1E90FF' };
      case 'remo':
        return { label: 'Remo', color: '#8A2BE2' };
      default:
        return { label: sport, color: '#8884d8' };
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
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const mapped = mapStatusToFrontend(label);
      return (
        <div style={{ backgroundColor: '#145526ff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
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
        <div style={{ backgroundColor: '#145526ff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
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
      <p className="subtitle">Resumen ejecutivo del e-commerce del club: ventas, pedidos, conversión y stock con señales accionables y actualización diaria</p>

      {/* Sales trend and order status */}
      <section className="grid-2">

        <div className="panel">
          <div className="panel-header">
            <h2>Pedidos por deporte</h2>
          </div>
          <div className="panel-body">
            <PieChart width={400} height={300}>
              <Pie
                data={sportsStats}
                cx={200}
                cy={150}
                labelLine={false}
                label={(entry: any) => `${mapSportsToFrontend(entry.sport).label}: ${entry.ordersCount}`}
                outerRadius={100}
                dataKey="ordersCount"
              >
                {sportsStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={mapSportsToFrontend(entry.sport).color} />
                ))}
              </Pie>
              <Tooltip content={<SportsTooltip />} />
            </PieChart>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Estado de pedidos <span className='span-h2'>(últimos 30 días)</span></h2>
          </div>
          <div className="panel-body">
            <BarChart width={500} height={300} data={statusStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" tickFormatter={(value) => mapStatusToFrontend(value).label} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" name="Cantidad de pedidos" fill="#1E7335" />
            </BarChart>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
