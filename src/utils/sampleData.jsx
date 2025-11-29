// Sample data to populate the application
export function initializeSampleData() {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized')) {
    return;
  }

  // Sample Users
  const sampleUsers = [
    {
      id: '1',
      email: 'admin@tribal.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      isBlocked: false,
    },
    {
      id: '2',
      email: 'artisan@tribal.com',
      password: 'artisan123',
      name: 'Ramesh Kumar',
      role: 'artisan',
      isBlocked: false,
    },
    {
      id: '3',
      email: 'customer@tribal.com',
      password: 'customer123',
      name: 'Priya Sharma',
      role: 'customer',
      isBlocked: false,
    },
    {
      id: '4',
      email: 'consultant@tribal.com',
      password: 'consultant123',
      name: 'Amit Verma',
      role: 'consultant',
      isBlocked: false,
    },
  ];

  // Sample Products — include one artisan product for testing orders
  const sampleProducts = [
    {
      id: 'p1',
      artisanId: '2',
      artisanName: 'Ramesh Kumar',
      name: 'Handwoven Basket',
      price: 500,
      mrp: 700,
      discount: 28.57,
      category: 'handicrafts',
      description: 'Handwoven basket made from natural fibers',
      imageUrl: '',
      createdAt: new Date().toISOString(),
    },
  ];

  // Sample Exhibitions (kept as-is)
  const sampleExhibitions = [
    {
      id: '1',
      consultantId: '4',
      consultantName: 'Amit Verma',
      name: 'Tribal Art & Craft Festival',
      description: 'A grand exhibition showcasing the finest tribal arts and crafts from across the region.',
      location: 'Delhi Convention Center',
      startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      products: [],
      visitors: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      consultantId: '4',
      consultantName: 'Amit Verma',
      name: 'Heritage Handicrafts Expo',
      description: 'Discover authentic handcrafted products made by skilled tribal artisans.',
      location: 'Mumbai Exhibition Hall',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      products: [],
      visitors: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      consultantId: '4',
      consultantName: 'Amit Verma',
      name: 'Traditional Jewelry Showcase',
      description: 'An exclusive exhibition featuring traditional tribal jewelry and ornaments.',
      location: 'Bangalore Cultural Center',
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 47 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      products: [],
      visitors: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  // Sample Orders — a customer purchase that includes the artisan product above
  const sampleOrders = [
    {
      id: 'o1',
      customerId: '3',
      customerName: 'Priya Sharma',
      items: [
        {
          id: 'p1',
          name: 'Handwoven Basket',
          quantity: 2,
          price: 500,
          total: 1000,
        },
      ],
      total: 1000,
      status: 'pending',
      paymentMethod: 'cod',
      address: '123 Sample Street',
      phone: '9999999999',
      createdAt: new Date().toISOString(),
    },
  ];

  // Sample Bulk Orders — placed by consultant for exhibition (will be stored under 'bulkOrders')
  const sampleBulkOrders = [
    {
      id: 'b1',
      consultantId: '4',
      consultantName: 'Amit Verma',
      items: [
        {
          productId: 'p1',
          productName: 'Handwoven Basket',
          quantity: 10,
          price: 450,
          total: 4500,
        },
      ],
      total: 4500,
      purpose: 'Exhibition inventory',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ];

  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(sampleUsers));
  localStorage.setItem('products', JSON.stringify(sampleProducts));
  localStorage.setItem('exhibitions', JSON.stringify(sampleExhibitions));
  localStorage.setItem('orders', JSON.stringify(sampleOrders));
  localStorage.setItem('bulkOrders', JSON.stringify(sampleBulkOrders));
  localStorage.setItem('dataInitialized', 'true');
}
