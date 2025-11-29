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
import { useLocale } from '../contexts/LocaleContext';

export function AdminDashboard() {
  const { t } = useLocale();

  // Safe Parse Helper
  const safeParse = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  };

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(safeParse('users'));
    setProducts(safeParse('products'));
    setOrders(safeParse('orders'));
    setExhibitions(safeParse('exhibitions'));
  };

  const toggleBlockUser = (userId, currentStatus) => {
    const updated = users.map(u =>
      u.id === userId ? { ...u, isBlocked: !currentStatus } : u
    );

    localStorage.setItem('users', JSON.stringify(updated));
    toast.success(currentStatus ? 'User unblocked' : 'User blocked');
    loadData();
  };

  const deleteProduct = (productId) => {

    if (!confirm('Are you sure you want to delete this product?')) return;

    const updated = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updated));
    toast.success('Product deleted');
    loadData();
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const blockedUsers = users.filter(u => u.isBlocked).length;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <Stat title={t('totalUsers')} value={users.length} icon={<Users />} />
          <Stat title={t('totalProducts')} value={products.length} icon={<Package />} />
          <Stat title={t('totalOrders')} value={orders.length} icon={<ShoppingCart />} />
          <Stat title={t('blockedUsers')} value={blockedUsers} icon={<AlertTriangle />} />

        </div>

        {/* Revenue */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle>{t('revenue')}</CardTitle>
            <CardDescription className="text-indigo-200">
              {t('totalIncome')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-white">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="users">

          <TabsList>
            <TabsTrigger value="users">{t('users')}</TabsTrigger>
            <TabsTrigger value="products">{t('products')}</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="exhibitions">{t('exhibitions')}</TabsTrigger>
          </TabsList>

          {/* USERS */}
          <TabsContent value="users">
            <div className="flex gap-4 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder={t('searchUsers')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <AdminTable
              headers={[t('name'), t('email'), t('role'), t('status'), t('actions')]}
              empty={t('noUsersFound')}
              data={filteredUsers.map(u => ([
                u.name,
                u.email,
                <Badge key="r" variant="outline">{u.role}</Badge>,
                u.isBlocked
                  ? <Badge key="b" variant="destructive"><Ban size={12}/> {t('blocked')}</Badge>
                  : <Badge key="a" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle size={12}/> {t('active')}</Badge>,
                <Button key="btn" size="sm" variant={u.isBlocked?'outline':'destructive'}
                  onClick={() => toggleBlockUser(u.id, u.isBlocked)}>
                  {u.isBlocked ? t('unblock') : t('block')}
                </Button>
              ]))}
            />
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products">
            <AdminTable
              headers={[t('name'), t('artisan'), t('category'), t('price'), t('actions')]}
              empty={t('noProductsAvailable')}
              data={products.map(p => ([
                p.name,
                p.artisanName,
                <Badge key="c" variant="secondary">{p.category}</Badge>,
                `₹${Number(p.price).toLocaleString()}`,
                <Button key="d" size="sm" variant="destructive"
                  onClick={() => deleteProduct(p.id)}>
                  {t('delete')}
                </Button>
              ]))}
            />
          </TabsContent>

          {/* ORDERS */}
          <TabsContent value="orders">
            <AdminTable
              headers={[t('order'), t('customer'), t('total'), t('paymentMethod'), t('status'), 'Date']}
              empty={t('noOrdersYet')}
              data={orders.map(o => ([
                `#${o.id?.slice(0,8)}`,
                o.customerName,
                `₹${Number(o.total).toLocaleString()}`,
                <Badge key="p" variant="outline">{o.paymentMethod}</Badge>,
                <Badge key="s">{o.status}</Badge>,
                new Date(o.createdAt).toLocaleDateString()
              ]))}
            />
          </TabsContent>

          {/* EXHIBITIONS */}
          <TabsContent value="exhibitions">
            <AdminTable
              headers={[t('name'), t('consultant'), t('location'), t('start'), t('end'), t('status')]}
              empty={t('noExhibitions')}
              data={exhibitions.map(e => ([
                e.name,
                e.consultantName,
                e.location,
                new Date(e.startDate).toLocaleDateString(),
                new Date(e.endDate).toLocaleDateString(),
                <Badge key="st">{e.status}</Badge>
              ]))}
            />
          </TabsContent>

        </Tabs>

        {/* ALERT */}
        {blockedUsers > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              {blockedUsers} {t('suspiciousActivity')}
            </AlertDescription>
          </Alert>
        )}

      </div>
    </DashboardLayout>
  );
}


// ✅ REUSABLE COMPONENTS

function Stat({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div>{value}</div>
      </CardContent>
    </Card>
  );
}

function AdminTable({ headers, data, empty }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
                    {empty}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
