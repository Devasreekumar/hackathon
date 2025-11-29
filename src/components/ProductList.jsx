import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductList({ products, onUpdate, showActions, onAddToCart, onEdit }) {
  const handleDelete = (productId) => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = allProducts.filter((p) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(filtered));
    onUpdate && onUpdate();
  };

  const discount = (product) => {
    // Only use an explicitly provided discount value (no automatic generation)
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader className="p-0">
            <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
              <ImageWithFallback
                src={
                  product.imageUrl ||
                  'https://images.unsplash.com/photo-1762628437902-315a5efb810c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzYzNjU5MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount(product) > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  {discount(product)}% OFF
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 pt-4">
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.mrp > product.price && (
                  <span className="line-through text-muted-foreground">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.artisanName && (
                  <span className="text-muted-foreground">by {product.artisanName}</span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 gap-2">
            {showActions ? (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit && onEdit(product)}>
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => onAddToCart && onAddToCart(product)}>
                Add to Cart
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
