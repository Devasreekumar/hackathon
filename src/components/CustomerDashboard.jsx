import { useState, useEffect } from 'react';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ProductList } from './ProductList';
import { OrdersTable } from './OrdersTable';
import { CheckoutDialog } from './CheckoutDialog';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import { ShoppingCart, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCart();
    loadOrders();
  }, [user]);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const loadProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts);
  };

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem(`cart_${user?.id}`) || '[]');
    setCart(savedCart);
  };

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const myOrders = allOrders.filter((o) => o.customerId === user?.id);
    setOrders(myOrders);
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(updatedCart));
    toast.success('Added to cart!');
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(updatedCart));
    toast.success('Removed from cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <DashboardLayout title="Customer Dashboard">
      <Tabs defaultValue="products" className="space-y-8">
        <div className="flex justify-center overflow-x-auto pb-2">
          <TabsList className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-gray-800 dark:to-gray-700 border-2 border-orange-200 dark:border-orange-700">
            <TabsTrigger value="products" className="gap-2">
              <ShoppingCart className="size-4" />
              Browse Products
            </TabsTrigger>
            <TabsTrigger value="cart" className="gap-2">
              <ShoppingCart className="size-4" />
              Cart {cart.length > 0 && `(${cart.length})`}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="size-4" />
              My Orders
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-6 animate-slide-up">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-orange-200 dark:border-gray-700 shadow-md">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-orange-600 dark:text-orange-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 border-2 border-orange-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/50 text-lg"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className={selectedCategory === category ? 'shadow-lg' : ''}
                >
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <ProductList 
            products={filteredProducts} 
            onAddToCart={addToCart}
          />
        </TabsContent>

        <TabsContent value="cart" className="space-y-6 animate-slide-up">
          {cart.length === 0 ? (
            <Card className="border-2 border-dashed border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <ShoppingCart className="size-16 text-orange-300 dark:text-orange-700 mb-4" />
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">Your cart is empty</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add some products to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="border-2 border-orange-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <CardContent className="flex items-center gap-6 p-6">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1762628437902-315a5efb810c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzYzNjU5MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080'}
                        alt={item.name}
                        className="size-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-orange-600 dark:text-orange-400 font-semibold">₹{item.price.toLocaleString()}</p>
                        <Badge variant="secondary" className="mt-2 uppercase tracking-wide">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-3 rounded-lg">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="font-bold"
                        >
                          −
                        </Button>
                        <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="font-bold"
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-3">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold"
                        >
                          ✕ Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 shadow-lg">
                <CardContent className="flex items-center justify-between p-8">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold uppercase tracking-wide">Total Amount</p>
                    <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">₹{cartTotal.toLocaleString()}</p>
                  </div>
                  <Button size="lg" onClick={() => setShowCheckout(true)} className="shadow-lg hover:shadow-xl">
                    Proceed to Checkout →
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border-2 border-orange-200 dark:border-orange-700">
            <Package className="size-6 text-orange-600 dark:text-orange-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h2>
            <span className="ml-auto bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">{orders.length}</span>
          </div>
          <OrdersTable orders={orders} />
        </TabsContent>
      </Tabs>

      <CheckoutDialog
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        total={cartTotal}
        onOrderComplete={() => {
          setCart([]);
          localStorage.removeItem(`cart_${user?.id}`);
          loadOrders();
        }}
      />
    </DashboardLayout>
  );
}
