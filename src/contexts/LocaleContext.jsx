import React, { createContext, useContext, useEffect, useState } from 'react';

const LocaleContext = createContext(null);

const translations = {
  en: {
    // Header & Navigation
    siteTitle: 'Tribal Heritage',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    shopNow: 'Shop Now',
    exploreExhibitions: 'Explore Exhibitions',
    logout: 'Logout',
    
    // Home
    festivalSale: 'Festival Craft Sale - Get 20% Off on Selected Items',
    shopByCategory: 'Shop by Category',
    nextExhibition: 'Next Exhibition Starts In:',
    celebrateTribalHeritage: 'Celebrate Tribal Heritage',
    authenticHandcrafted: 'Authentic Handcrafted Products from Skilled Artisans',
    newArrivals: 'New Arrivals',
    topSelling: 'Top Selling',
    trending: 'Trending',
    recentlyAdded: 'Recently Added',
    products: 'Products',
    featuredArtisan: 'Featured Artisan',
    years: 'years',
    speciality: 'Speciality',
    experience: 'Experience',
    testimonials: 'What Our Customers Say',
    newsletter: 'Newsletter',
    getStartedNewsletter: 'Get the latest updates and exclusive offers',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    footer: 'All rights reserved.',
    getStartedSection: 'Get Started',
    browseProducts: 'Browse our curated collection',
    learnMore: 'Learn More',
    
    // Dashboard
    welcome: 'Welcome,',
    adminDashboard: 'Admin Dashboard',
    artisanDashboard: 'Artisan Dashboard',
    customerDashboard: 'Customer Dashboard',
    consultantDashboard: 'Consultant Dashboard',
    totalUsers: 'Total Users',
    totalProducts: 'Total Products',
    totalOrders: 'Total Orders',
    blockedUsers: 'Blocked Users',
    revenue: 'Revenue (₹)',
    totalIncome: 'Total income from all orders',
    users: 'Users',
    exhibitions: 'Exhibitions',
    searchUsers: 'Search users...',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    actions: 'Actions',
    blocked: 'Blocked',
    active: 'Active',
    block: 'Block',
    unblock: 'Unblock',
    delete: 'Delete',
    noUsersFound: 'No users found',
    artisan: 'Artisan',
    category: 'Category',
    price: 'Price',
    noProductsAvailable: 'No products available',
    order: 'Order',
    customer: 'Customer',
    total: 'Total',
    paymentMethod: 'Payment',
    noOrdersYet: 'No orders yet',
    consultant: 'Consultant',
    location: 'Location',
    start: 'Start',
    end: 'End',
    noExhibitions: 'No exhibitions',
    suspiciousActivity: 'user(s) blocked due to suspicious activity.',
    
    // Forms
    addNewProduct: 'Add New Product',
    editProduct: 'Edit Product',
    fillDetails: 'Fill the details to list your product',
    productName: 'Product Name',
    priceLabel: 'Price (₹)',
    mrp: 'MRP (₹)',
    discountLabel: 'Discount (%)',
    imageURL: 'Image URL',
    description: 'Description',
    cancel: 'Cancel',
    add: 'Add',
    update: 'Update',
    
    // Login/Register
    loginTitle: 'Sign in to your account to continue',
    signingIn: 'Signing in...',
    registerTitle: 'Register to get started with our platform',
    registerDescription: 'Create an account and join our artisan community',
    fullName: 'Full Name',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    selectRole: 'Select Your Role',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signInHere: 'Sign in here',
    dontHaveAccount: 'Don\'t have an account?',
    registerHere: 'Register here',
  },
  hi: {
    // Header & Navigation
    siteTitle: 'ट्राइबल हेरिटेज',
    signIn: 'साइन इन',
    getStarted: 'शुरू करें',
    shopNow: 'अभी खरीदें',
    exploreExhibitions: 'प्रदर्शनी देखें',
    logout: 'लॉग आउट',
    
    // Home
    festivalSale: 'त्योहार शिल्प विक्रय - चयनित वस्तुओं पर 20% की छूट',
    shopByCategory: 'श्रेणी द्वारा खरीदारी करें',
    nextExhibition: 'अगली प्रदर्शनी शुरू होने में:',
    celebrateTribalHeritage: 'ट्राइबल हेरिटेज का जश्न मनाएं',
    authenticHandcrafted: 'कुशल कारीगरों से प्रामाणिक हस्तनिर्मित उत्पाद',
    newArrivals: 'नई आगमन',
    topSelling: 'सर्वाधिक बिक्री',
    trending: 'ट्रेंडिंग',
    recentlyAdded: 'हाल ही में जोड़ा गया',
    products: 'उत्पाद',
    featuredArtisan: 'विशेष कारीगर',
    years: 'साल',
    speciality: 'विशेषता',
    experience: 'अनुभव',
    testimonials: 'हमारे ग्राहकों का अनुभव',
    newsletter: 'समाचार पत्र',
    getStartedNewsletter: 'नवीनतम अपडेट और विशेष ऑफर प्राप्त करें',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    subscribe: 'सदस्यता लें',
    footer: 'सभी अधिकार सुरक्षित हैं।',
    getStartedSection: 'शुरू करें',
    browseProducts: 'हमारे सुचिंतित संग्रह को ब्राउज़ करें',
    learnMore: 'और जानें',
    
    // Dashboard
    welcome: 'स्वागत है,',
    adminDashboard: 'प्रशासक डैशबोर्ड',
    artisanDashboard: 'कारीगर डैशबोर्ड',
    customerDashboard: 'ग्राहक डैशबोर्ड',
    consultantDashboard: 'सलाहकार डैशबोर्ड',
    totalUsers: 'कुल उपयोगकर्ता',
    totalProducts: 'कुल उत्पाद',
    totalOrders: 'कुल ऑर्डर',
    blockedUsers: 'अवरुद्ध उपयोगकर्ता',
    revenue: 'राजस्व (₹)',
    totalIncome: 'सभी ऑर्डर से कुल आय',
    users: 'उपयोगकर्ता',
    exhibitions: 'प्रदर्शनियां',
    searchUsers: 'उपयोगकर्ताओं को खोजें...',
    name: 'नाम',
    email: 'ईमेल',
    role: 'भूमिका',
    status: 'स्थिति',
    actions: 'कार्य',
    blocked: 'अवरुद्ध',
    active: 'सक्रिय',
    block: 'ब्लॉक',
    unblock: 'अनब्लॉक',
    delete: 'हटाएं',
    noUsersFound: 'कोई उपयोगकर्ता नहीं मिला',
    artisan: 'कारीगर',
    category: 'श्रेणी',
    price: 'कीमत',
    noProductsAvailable: 'कोई उत्पाद उपलब्ध नहीं',
    order: 'आदेश',
    customer: 'ग्राहक',
    total: 'कुल',
    paymentMethod: 'भुगतान',
    noOrdersYet: 'अभी तक कोई ऑर्डर नहीं',
    consultant: 'सलाहकार',
    location: 'स्थान',
    start: 'शुरू',
    end: 'अंत',
    noExhibitions: 'कोई प्रदर्शनी नहीं',
    suspiciousActivity: 'उपयोगकर्ता संदिग्ध गतिविधि के कारण ब्लॉक किए गए।',
    
    // Forms
    addNewProduct: 'नया उत्पाद जोड़ें',
    editProduct: 'उत्पाद संपादित करें',
    fillDetails: 'अपने उत्पाद को सूचीबद्ध करने के लिए विवरण भरें',
    productName: 'उत्पाद का नाम',
    priceLabel: 'कीमत (₹)',
    mrp: 'एमआरपी (₹)',
    discountLabel: 'छूट (%)',
    imageURL: 'छवि URL',
    description: 'विवरण',
    cancel: 'रद्द करें',
    add: 'जोड़ें',
    update: 'अपडेट',
    
    // Login/Register
    loginTitle: 'जारी रखने के लिए अपने खाते में साइन इन करें',
    signingIn: 'साइन इन हो रहा है...',
    registerTitle: 'हमारे प्लेटफॉर्म के साथ शुरू करने के लिए पंजीकरण करें',
    registerDescription: 'एक खाता बनाएं और हमारे कारीगर समुदाय में शामिल हों',
    fullName: 'पूरा नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    selectRole: 'अपनी भूमिका चुनें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    signInHere: 'यहाँ साइन इन करें',
    dontHaveAccount: 'खाता नहीं है?',
    registerHere: 'यहाँ पंजीकरण करें',
  }
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      const stored = localStorage.getItem('locale');
      if (stored && translations[stored]) return stored;
    } catch (e) {}
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale);
    } catch (e) {}
  }, [locale]);

  const t = (key) => {
    return (translations[locale] && translations[locale][key]) || (translations['en'] && translations['en'][key]) || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
