import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AddProductDialog } from './AddProductDialog';
import { ProductList } from './ProductList';
import { SalesChart } from './SalesChart';
import { OrdersTable } from './OrdersTable';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ArtisanDashboard() {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesPeriod, setSalesPeriod] = useState('daily');

  useEffect(() => {
    // Load artisan's products
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const myProducts = allProducts.filter((p) => p.artisanId === user?.id);
    setProducts(myProducts);

    // Load orders for artisan's products
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = allOrders.filter((o) =>
      myProducts.some((p) => o.items?.some((item) => item.productId === p.id))
    );
    setOrders(myOrders);
  }, [user]);

  const handleProductAdded = () => {
    // Reload products
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const myProducts = allProducts.filter((p) => p.artisanId === user?.id);
    setProducts(myProducts);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <DashboardLayout title="Artisan Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-muted-foreground">From all sales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Products</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{products.length}</div>
              <p className="text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Orders</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{totalOrders}</div>
              <p className="text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Pending Orders</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{pendingOrders}</div>
              <p className="text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Track your sales performance over time</CardDescription>
              </div>
              <Tabs value={salesPeriod} onValueChange={(v) => setSalesPeriod(v)}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <SalesChart orders={orders} period={salesPeriod} />
          </CardContent>
        </Card>

        {/* Products and Orders Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-900 dark:text-white">Product Catalog</h2>
              <Button onClick={() => { setEditProduct(null); setShowAddProduct(true); }}>
                <Package className="size-4 mr-2" />
                Add New Product
              </Button>
            </div>
            <ProductList products={products} onUpdate={handleProductAdded} showActions onEdit={(p) => { setEditProduct(p); setShowAddProduct(true); }} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-gray-900 dark:text-white">Customer Orders</h2>
            <OrdersTable orders={orders} isArtisan />
          </TabsContent>
        </Tabs>
      </div>

      <AddProductDialog
        open={showAddProduct}
        initialProduct={editProduct}
        onClose={() => { setShowAddProduct(false); setEditProduct(null); }}
        onProductAdded={() => { handleProductAdded(); setEditProduct(null); }}
      />
    </DashboardLayout>
  );
}
