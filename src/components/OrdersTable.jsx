import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function OrdersTable({ orders, isArtisan }) {
  const [filter, setFilter] = useState('all');

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateOrderStatus = (orderId, newStatus) => {
    // Try to update in regular orders first
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    let updated = allOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));

    const foundInOrders = allOrders.some((o) => o.id === orderId);

    if (foundInOrders) {
      localStorage.setItem('orders', JSON.stringify(updated));
      toast.success(`Order status updated to ${newStatus}`);
      window.location.reload();
      return;
    }

    // Otherwise try bulk orders
    const allBulk = JSON.parse(localStorage.getItem('bulkOrders') || '[]');
    const foundInBulk = allBulk.some((o) => o.id === orderId);
    if (foundInBulk) {
      const updatedBulk = allBulk.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('bulkOrders', JSON.stringify(updatedBulk));
      toast.success(`Bulk order status updated to ${newStatus}`);
      window.location.reload();
      return;
    }

    toast.error('Order not found');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({shippedCount})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({deliveredCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  {isArtisan && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                    <TableCell>{order.customerName || order.consultantName || order.consultant || '—'}</TableCell>
                    <TableCell>{order.items?.length || 0} item(s)</TableCell>
                    <TableCell>₹{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {order.paymentMethod ? (
                        <Badge variant="outline">{order.paymentMethod}</Badge>
                      ) : (
                        <span className="text-muted-foreground">{order.purpose ? order.purpose : '—'}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>

                    {isArtisan && (
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
