import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export function SalesChart({ orders, period }) {
  const chartData = useMemo(() => {
    const now = new Date();
    const data = {};

    // Initialize data based on period
    if (period === 'daily') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        data[key] = {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: 0,
          orders: 0,
        };
      }
    } else if (period === 'weekly') {
      // Last 8 weeks
      for (let i = 7; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const key = weekStart.toISOString().split('T')[0];
        data[key] = {
          date: `Week ${8 - i}`,
          sales: 0,
          orders: 0,
        };
      }
    } else if (period === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        data[key] = {
          date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          sales: 0,
          orders: 0,
        };
      }
    } else {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        data[year] = {
          date: year.toString(),
          sales: 0,
          orders: 0,
        };
      }
    }

    // Aggregate order data
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      let key;

      if (period === 'daily') {
        key = orderDate.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(orderDate);
        weekStart.setDate(orderDate.getDate() - orderDate.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      } else {
        key = orderDate.getFullYear().toString();
      }

      if (data[key]) {
        data[key].sales += order.total;
        data[key].orders += 1;
      }
    });

    return Object.values(data);
  }, [orders, period]);

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'var(--color-foreground)' }}
          />
          <Legend />
          <Bar dataKey="sales" fill="#6366f1" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="orders" fill="#22c55e" name="Orders" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
