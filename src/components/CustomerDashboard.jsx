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
import { ShoppingCart, Search, Package } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerDashboard() {
  const { user } = useAuth();
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
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Browse Products</TabsTrigger>
          <TabsTrigger value="cart">
            <ShoppingCart className="size-4 mr-2" />
            Cart {cart.length > 0 && `(${cart.length})`}
          </TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <ProductList 
            products={filteredProducts} 
            onAddToCart={addToCart}
          />
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          {cart.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="size-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1762628437902-315a5efb810c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzYzNjU5MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080'}
                        alt={item.name}
                        className="size-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-900 dark:text-white">{item.name}</h3>
                        <p className="text-muted-foreground">₹{item.price.toLocaleString()}</p>
                        <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 dark:text-white">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 mt-1"
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="text-gray-900 dark:text-white">₹{cartTotal.toLocaleString()}</p>
                  </div>
                  <Button size="lg" onClick={() => setShowCheckout(true)}>
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="size-5" />
            <h2 className="text-gray-900 dark:text-white">My Orders</h2>
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
