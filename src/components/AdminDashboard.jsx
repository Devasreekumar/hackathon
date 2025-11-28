import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Users, Package, ShoppingCart, AlertTriangle, Search, Ban, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const allExhibitions = JSON.parse(localStorage.getItem('exhibitions') || '[]');

    setUsers(allUsers);
    setProducts(allProducts);
    setOrders(allOrders);
    setExhibitions(allExhibitions);
  };

  const toggleBlockUser = (userId, currentStatus) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = allUsers.map((u) => (u.id === userId ? { ...u, isBlocked: !currentStatus } : u));
    localStorage.setItem('users', JSON.stringify(updated));
    
    toast.success(currentStatus ? 'User unblocked successfully' : 'User blocked for suspicious activity');
    loadData();
  };

  const deleteProduct = (productId) => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(filtered));
    
    toast.success('Product removed successfully');
    loadData();
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const blockedUsers = users.filter(u => u.isBlocked).length;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Users</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{users.length}</div>
              <p className="text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Products</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{products.length}</div>
              <p className="text-muted-foreground">Listed products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Orders</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{orders.length}</div>
              <p className="text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Blocked Users</CardTitle>
              <AlertTriangle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{blockedUsers}</div>
              <p className="text-muted-foreground">Suspicious activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Card */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle>Platform Revenue</CardTitle>
            <CardDescription className="text-indigo-100">
              Total revenue generated across all transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-white">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.isBlocked ? (
                              <Badge variant="destructive">
                                <Ban className="size-3 mr-1" />
                                Blocked
                              </Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <CheckCircle className="size-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={user.isBlocked ? 'outline' : 'destructive'}
                              onClick={() => toggleBlockUser(user.id, user.isBlocked)}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block User'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Artisan</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.artisanName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category}</Badge>
                          </TableCell>
                          <TableCell>₹{product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono">#{order.id.slice(0, 8)}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>₹{order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge>{order.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exhibitions" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exhibition Name</TableHead>
                        <TableHead>Consultant</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exhibitions.map((exhibition) => (
                        <TableRow key={exhibition.id}>
                          <TableCell>{exhibition.name}</TableCell>
                          <TableCell>{exhibition.consultantName}</TableCell>
                          <TableCell>{exhibition.location}</TableCell>
                          <TableCell>
                            {new Date(exhibition.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(exhibition.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge>{exhibition.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Suspicious Activity Alert */}
        {blockedUsers > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              {blockedUsers} user{blockedUsers > 1 ? 's have' : ' has'} been blocked due to suspicious activity.
              Please review the user management section.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
