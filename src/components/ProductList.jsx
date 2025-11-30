import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Heart, ShoppingCart, Eye } from 'lucide-react';
import { ImageWithFallback } from './fix/ImageWithFallback';
import { useState } from 'react';

export function ProductList({ products, onUpdate, showActions, onAddToCart, onEdit }) {
  const [wishlist, setWishlist] = useState(new Set());

  const handleDelete = async (productId) => {
    try {
      const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const filtered = allProducts.filter((p) => p.id !== productId && p._id !== productId);
      localStorage.setItem('products', JSON.stringify(filtered));
      onUpdate && onUpdate();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const discount = (product) => {
    if (product.discount !== undefined && product.discount !== null && product.discount !== '') {
      return Math.round(Number(product.discount) || 0);
    }
    return 0;
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card group">
          {/* Product Image */}
          <div className="product-image-container">
            <ImageWithFallback
              src={
                product.image || product.imageUrl ||
                'https://images.unsplash.com/photo-1762628437902-315a5efb810c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzYzNjU5MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
              }
              alt={product.name}
              className="product-image"
            />

            {/* Badge */}
            {discount(product) > 0 && (
              <div className="product-badge">
                {discount(product)}% OFF
              </div>
            )}

            {/* Quick Actions - Amazon Style */}
            <div className="product-quick-actions">
              {showActions ? (
                <>
                  <button 
                    className="quick-action-btn"
                    onClick={() => onEdit && onEdit(product)}
                    title="Edit"
                  >
                    <Edit className="size-3" />
                    Edit
                  </button>
                  <button 
                    className="quick-action-btn icon-btn"
                    onClick={() => handleDelete(product.id)}
                    title="Delete"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="quick-action-btn"
                    onClick={() => onAddToCart && onAddToCart(product)}
                  >
                    <ShoppingCart className="size-3" />
                    Cart
                  </button>
                  <button 
                    className="quick-action-btn icon-btn"
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <Heart className={`size-3 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            {/* Title */}
            <h3 className="product-title">{product.name}</h3>

            {/* Rating */}
            <div className="product-rating">
              <div className="product-rating-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <span className="product-rating-count">(42 reviews)</span>
            </div>

            {/* Pricing */}
            <div className="product-pricing">
              <div className="product-price">
                <span className="price-current">₹{Number(product.price || 0).toLocaleString()}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="price-original">₹{product.mrp.toLocaleString()}</span>
                    <span className="price-discount">
                      {discount(product) > 0 ? `${discount(product)}% off` : ''}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="seller-info">
              by <strong>{product.artisanName || 'Artisan'}</strong>
            </div>

            {/* Category Badge */}
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category || 'Uncategorized'}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions" style={{ padding: '0 12px 12px 12px' }}>
            {showActions ? (
              <>
                <button 
                  className="product-add-to-cart"
                  onClick={() => onEdit && onEdit(product)}
                  style={{ 
                    background: '#0ea5e9',
                    marginRight: '8px'
                  }}
                >
                  <Edit className="size-4" />
                  Edit
                </button>
                <button 
                  className="product-wishlist-btn"
                  onClick={() => handleDelete(product.id)}
                  style={{ background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
                >
                  <Trash2 className="size-4" />
                </button>
              </>
            ) : (
              <>
                <button 
                  className="product-add-to-cart"
                  onClick={() => onAddToCart && onAddToCart(product)}
                >
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </button>
                <button 
                  className={`product-wishlist-btn ${wishlist.has(product.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`size-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
