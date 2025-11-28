import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ShoppingBag, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  Star,
  Moon,
  Sun,
  ChevronRight,
  Quote
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import tribalPattern from '../assets/tribal-pattern.svg';
import api from '../utils/api';

export function HomePage({ onNavigateToLogin, onNavigateToRegister, onNavigateToExhibitions }) {
  const { theme, toggleTheme } = useTheme();
  const [products, setProducts] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let mounted = true;
    // Load products from localStorage (app still uses localStorage for products)
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts);

    // Try to fetch exhibitions from backend, but helper falls back to localStorage
    api.fetchExhibitions().then((data) => {
      if (!mounted) return;
      const normalized = (data || []).map((d) => ({ ...(d || {}), id: d.id || d._id }));
      const sortedExhibitions = normalized.slice().sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setExhibitions(sortedExhibitions);

      // Countdown timer to next exhibition (nearest future start date)
      const upcomingExhibition = sortedExhibitions.find((e) => new Date(e.startDate) > new Date());

      if (upcomingExhibition) {
        const updateTimer = () => {
          const now = new Date().getTime();
          const target = new Date(upcomingExhibition.startDate).getTime();
          let difference = target - now;

          if (difference <= 0) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
          });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => { mounted = false; clearInterval(interval); };
      } else {
        // No upcoming exhibitions -> reset timer
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }).catch((err) => {
      console.warn('Failed to fetch exhibitions for HomePage', err);
    });

    return () => { mounted = false; };
  }, []);

  const categories = [
    { name: 'Jewelry', icon: '💍', count: products.filter(p => p.category === 'jewelry').length },
    { name: 'Home Decor', icon: '🏠', count: products.filter(p => p.category === 'home-decor').length },
    { name: 'Paintings', icon: '🎨', count: products.filter(p => p.category === 'art').length },
    { name: 'Wooden Crafts', icon: '🪵', count: products.filter(p => p.category === 'handicrafts').length },
  ];

  const newArrivals = products.slice(-4);
  const topSelling = products.slice(0, 4);
  const recentlyAdded = [...products].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 4);

  const upcomingExhibitions = exhibitions.filter(e => 
    new Date(e.startDate) > new Date()
  ).slice(0, 3);

  const testimonials = [
    { name: 'Priya Sharma', text: 'Beautiful handcrafted products! The quality is exceptional.', rating: 5 },
    { name: 'Rahul Verma', text: 'Supporting artisans while getting unique crafts. Love it!', rating: 5 },
    { name: 'Anita Patel', text: 'The exhibition experience was amazing. Met talented artisans!', rating: 5 },
  ];

  const featuredArtisan = {
    name: 'Ramesh Kumar',
    specialty: 'Wooden Craft Master',
    experience: '25+ years',
    products: 48,
    description: 'Specializing in traditional tribal wooden sculptures and decorative items.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Tribal Pattern Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
        }} />
      </div>

      {/* Header */}
      <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-orange-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                <ShoppingBag className="size-6 text-white" />
              </div>
              <span className="text-gray-900 dark:text-white">Tribal Heritage</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <Button variant="outline" onClick={onNavigateToLogin}>
                Sign In
              </Button>
              <Button onClick={onNavigateToRegister}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 dark:from-orange-800 dark:to-red-900">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url(${tribalPattern})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="size-3 mr-1" />
              Authentic Tribal Crafts
            </Badge>
            
            <h1 className="text-white mb-6">
              Celebrate Tribal Heritage
            </h1>
            
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Authentic Handcrafted Products from Skilled Artisans
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" onClick={onNavigateToRegister}>
                <ShoppingBag className="size-5 mr-2" />
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" onClick={onNavigateToExhibitions}>
                <CalendarIcon className="size-5 mr-2" />
                Explore Exhibitions
              </Button>
            </div>

            {/* Countdown Timer */}
            {timeLeft.days > 0 && (
              <div className="mt-12 inline-flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <span className="text-white/90">Next Exhibition Starts In:</span>
                <div className="flex gap-4">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-white min-w-[60px] bg-white/20 rounded-lg p-3">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className="text-white/70 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Festival Offer Banner */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-3 text-white">
              <Star className="size-5" />
              <span>Festival Craft Sale - Get 20% Off on Selected Items</span>
              <Button variant="outline" size="sm" className="bg-white text-indigo-600 hover:bg-gray-100 border-0">
                Shop Sale
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our curated collection of tribal crafts</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.count} Products</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Products Sections */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="new" className="space-y-8">
              <div className="flex items-center justify-center">
                <TabsList className="bg-orange-100 dark:bg-gray-800">
                  <TabsTrigger value="new">
                    <Sparkles className="size-4 mr-2" />
                    New Arrivals
                  </TabsTrigger>
                  <TabsTrigger value="top">
                    <TrendingUp className="size-4 mr-2" />
                    Top Selling
                  </TabsTrigger>
                  <TabsTrigger value="trending">
                    <Star className="size-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="recent">
                    Recently Added
                  </TabsTrigger>
                </TabsList>
              </div>

              {[
                { value: 'new', products: newArrivals },
                { value: 'top', products: topSelling },
                { value: 'trending', products: recentlyAdded },
                { value: 'recent', products: recentlyAdded },
              ].map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  {tab.products.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No products available yet
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {tab.products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <ImageWithFallback
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {product.mrp > product.price && (
                              <Badge className="absolute top-3 right-3 bg-red-500">
                                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                              </Badge>
                            )}
                          </div>
                          <CardHeader>
                            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                              {product.mrp > product.price && (
                                <span className="line-through text-muted-foreground">₹{product.mrp.toLocaleString()}</span>
                              )}
                            </div>
                            <p className="text-muted-foreground">by {product.artisanName}</p>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full" onClick={onNavigateToRegister}>
                              Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Exhibition Calendar Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 dark:text-white mb-3">Upcoming Exhibitions</h2>
              <p className="text-muted-foreground">Join us at our craft exhibitions and meet talented artisans</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle>Exhibition Calendar</CardTitle>
                  <CardDescription>Select a date to view events</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Exhibition List */}
              <div className="space-y-4">
                {upcomingExhibitions.length === 0 ? (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                      No upcoming exhibitions scheduled
                    </CardContent>
                  </Card>
                ) : (
                  upcomingExhibitions.map((exhibition) => (
                    <Card key={exhibition.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{exhibition.name}</CardTitle>
                            <CardDescription className="mt-2">{exhibition.description}</CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {exhibition.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="size-4" />
                          <span>{exhibition.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="size-4" />
                          <span>
                            {new Date(exhibition.startDate).toLocaleDateString()} - {new Date(exhibition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="size-4" />
                          <span>10:00 AM - 6:00 PM</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" onClick={onNavigateToRegister}>
                          Join Exhibition
                          <ChevronRight className="size-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Artisan of the Month */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <Star className="size-3 mr-1" />
                Featured Artisan
              </Badge>
              <h2 className="text-gray-900 dark:text-white mb-3">Artisan of the Month</h2>
            </div>

            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="size-32 rounded-full bg-white dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center text-6xl">
                      👨‍🎨
                    </div>
                    <h3 className="text-gray-900 dark:text-white mb-2">{featuredArtisan.name}</h3>
                    <p className="text-muted-foreground">{featuredArtisan.specialty}</p>
                  </div>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="text-gray-900 dark:text-white">{featuredArtisan.experience}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Products Listed:</span>
                      <p className="text-gray-900 dark:text-white">{featuredArtisan.products}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">About:</span>
                      <p className="text-gray-900 dark:text-white">{featuredArtisan.description}</p>
                    </div>
                    <Button className="w-full mt-4" onClick={onNavigateToRegister}>
                      View Products
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 dark:text-white mb-3">What Our Customers Say</h2>
              <p className="text-muted-foreground">Trusted by thousands of craft lovers</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-12 pb-6">
                    <Quote className="size-8 text-orange-500 mb-4" />
                    <p className="text-gray-900 dark:text-white mb-4">{testimonial.text}</p>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Real-time Product Ticker */}
        <div className="bg-indigo-600 dark:bg-indigo-800 py-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-white mx-8">
              🎨 New product added: Handwoven Basket by Maya Devi
            </span>
            <span className="text-white mx-8">
              ✨ Trending: Traditional Jewelry Set
            </span>
            <span className="text-white mx-8">
              🏺 Just Listed: Terracotta Vase Collection
            </span>
            <span className="text-white mx-8">
              🎁 Popular: Wooden Wall Art
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="size-6" />
                <span>Tribal Heritage</span>
              </div>
              <p className="text-gray-400">
                Connecting artisans with customers, preserving tribal crafts and culture.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={onNavigateToRegister}>Shop</button></li>
                <li><button onClick={onNavigateToExhibitions}>Exhibitions</button></li>
                <li><button>Artisans</button></li>
                <li><button>About Us</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Jewelry</li>
                <li>Home Decor</li>
                <li>Paintings</li>
                <li>Wooden Crafts</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Get Started</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={onNavigateToRegister}>
                  Sign Up Now
                </Button>
                <Button variant="ghost" className="w-full" onClick={onNavigateToLogin}>
                  Already a Member?
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Tribal Heritage. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
