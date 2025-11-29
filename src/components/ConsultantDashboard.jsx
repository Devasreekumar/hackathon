import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { CreateExhibitionDialog } from './CreateExhibitionDialog';
import { BulkOrderDialog } from './BulkOrderDialog';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, ShoppingBag, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ConsultantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [bulkOrders, setBulkOrders] = useState([]);
  const [showCreateExhibition, setShowCreateExhibition] = useState(false);
  const [showBulkOrder, setShowBulkOrder] = useState(false);

  useEffect(() => {
    loadExhibitions();
    loadBulkOrders();
  }, [user]);

  const loadExhibitions = () => {
    const allExhibitions = JSON.parse(localStorage.getItem('exhibitions') || '[]');
    const myExhibitions = allExhibitions.filter((e) => e.consultantId === user?.id);
    setExhibitions(myExhibitions);
  };

  const loadBulkOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('bulkOrders') || '[]');
    const myOrders = allOrders.filter((o) => o.consultantId === user?.id);
    setBulkOrders(myOrders);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return '';
    }
  };

  return (
    <DashboardLayout title="Consultant Dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Exhibitions</CardTitle>
              <Calendar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{exhibitions.length}</div>
              <p className="text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Active Exhibitions</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">
                {exhibitions.filter(e => e.status === 'ongoing').length}
              </div>
              <p className="text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Bulk Orders</CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">{bulkOrders.length}</div>
              <p className="text-muted-foreground">Total placed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Value</CardTitle>
              <ShoppingBag className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">
                ₹{bulkOrders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}
              </div>
              <p className="text-muted-foreground">Bulk order value</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="exhibitions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
            <TabsTrigger value="bulk-orders">Bulk Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="exhibitions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-900 dark:text-white">My Exhibitions</h2>
              <Button onClick={() => setShowCreateExhibition(true)}>
                <Calendar className="size-4 mr-2" />
                Create Exhibition
              </Button>
            </div>

            {exhibitions.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">No exhibitions yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {exhibitions.map((exhibition) => (
                  <Card key={exhibition.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{exhibition.name}</CardTitle>
                          <CardDescription className="mt-2">{exhibition.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(exhibition.status)}>
                          {exhibition.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-muted-foreground">
                        <p>📍 {exhibition.location}</p>
                        <p>📅 {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}</p>
                        <p>🎨 {exhibition.products?.length || 0} products showcased</p>
                        <p>👥 {exhibition.visitors || 0} visitors</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => navigate(`/exhibitions#${exhibition.id}`)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bulk-orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-900 dark:text-white">Bulk Orders</h2>
              <Button onClick={() => setShowBulkOrder(true)}>
                <Package className="size-4 mr-2" />
                Place Bulk Order
              </Button>
            </div>

            {bulkOrders.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">No bulk orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bulkOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</h3>
                          <p className="text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-muted-foreground">Items: {order.items?.length || 0}</p>
                        <p className="text-muted-foreground">Purpose: {order.purpose}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateExhibitionDialog
        open={showCreateExhibition}
        onClose={() => setShowCreateExhibition(false)}
        onExhibitionCreated={loadExhibitions}
      />

      <BulkOrderDialog
        open={showBulkOrder}
        onClose={() => setShowBulkOrder(false)}
        onOrderPlaced={loadBulkOrders}
      />
    </DashboardLayout>
  );
}
