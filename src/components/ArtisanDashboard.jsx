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

  // ✅ LOAD PRODUCTS
  const loadProducts = () => {
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    const mine = all.filter(p => p.artisanId === user?.id);
    setProducts(mine);
  };

  // ✅ LOAD ORDERS
  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const myOrders = allOrders.filter(order =>
      order.items?.some(item => products.some(p => p.id === item.productId))
    );
    setOrders(myOrders);
  };

  useEffect(() => {
    if (!user) return;
    loadProducts();
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [products]);

  const handleProductAdded = () => loadProducts();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  return (
    <DashboardLayout title="Artisan Dashboard">

      <div className="space-y-6">

        {/* ✅ INFO CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Total Revenue</CardTitle>
              <DollarSign className="size-4" />
            </CardHeader>
            <CardContent>₹{totalRevenue.toLocaleString()}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Total Products</CardTitle>
              <Package className="size-4" />
            </CardHeader>
            <CardContent>{products.length}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Total Orders</CardTitle>
              <ShoppingCart className="size-4" />
            </CardHeader>
            <CardContent>{totalOrders}</CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Pending Orders</CardTitle>
              <TrendingUp className="size-4" />
            </CardHeader>
            <CardContent>{pendingOrders}</CardContent>
          </Card>

        </div>

        {/* ✅ SALES GRAPH */}
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Day / Month / Year</CardDescription>
              </div>

              <Tabs value={salesPeriod} onValueChange={setSalesPeriod}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
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

        {/* ✅ PRODUCT & ORDER TABS */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Button onClick={() => setShowAddProduct(true)}>Add Product</Button>
            <ProductList
              products={products}
              showActions
              onEdit={(p) => { setEditProduct(p); setShowAddProduct(true); }}
              onUpdate={handleProductAdded}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable orders={orders} />
          </TabsContent>
        </Tabs>

      </div>

      {/* ✅ ADD DIALOG */}
      <AddProductDialog
        open={showAddProduct}
        initialProduct={editProduct}
        onClose={() => { setShowAddProduct(false); setEditProduct(null); }}
        onProductAdded={handleProductAdded}
      />

    </DashboardLayout>
  );
}
