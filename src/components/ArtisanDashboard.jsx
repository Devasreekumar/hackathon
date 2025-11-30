import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "./ui/tabs";
import { AddProductDialog } from "./AddProductDialog";
import { ProductList } from "./ProductList";
import { SalesChart } from "./SalesChart";
import { OrdersTable } from "./OrdersTable";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function ArtisanDashboard() {
  const { user } = useAuth();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesPeriod, setSalesPeriod] = useState("daily");

  // Load artisan products from localStorage
  const loadProducts = () => {
    try {
      const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductAdded = () => {
    loadProducts(); // refresh dashboard after adding products
  };

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <DashboardLayout title="Artisan Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Revenue */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-muted-foreground">From all sales</p>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Products</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{products.length}</div>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Total Orders</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{totalOrders}</div>
            </CardContent>
          </Card>

          {/* Pending Orders */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Pending Orders</CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{pendingOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Tab */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-900 dark:text-white">Product Catalog</h2>
              <Button onClick={() => { setEditProduct(null); setShowAddProduct(true); }}>
                <Package className="size-4 mr-2" /> Add New Product
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
        onProductAdded={handleProductAdded}
      />
    </DashboardLayout>
  );
}
