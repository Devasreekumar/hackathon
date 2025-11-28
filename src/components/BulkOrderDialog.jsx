import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export function BulkOrderDialog({ open, onClose, onOrderPlaced }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts);
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      const newItems = { ...selectedItems };
      delete newItems[productId];
      setSelectedItems(newItems);
    } else {
      setSelectedItems({ ...selectedItems, [productId]: quantity });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(selectedItems).length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    const items = Object.entries(selectedItems).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return {
        productId,
        productName: product?.name,
        quantity,
        price: product?.price,
        total: (product?.price || 0) * quantity,
      };
    });

    const total = items.reduce((sum, item) => sum + item.total, 0);

    const order = {
      id: Date.now().toString(),
      consultantId: user?.id,
      consultantName: user?.name,
      items,
      total,
      purpose,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const bulkOrders = JSON.parse(localStorage.getItem('bulkOrders') || '[]');
    bulkOrders.push(order);
    localStorage.setItem('bulkOrders', JSON.stringify(bulkOrders));

    toast.success('Bulk order placed successfully!');
    onOrderPlaced();
    onClose();

    // Reset form
    setSelectedItems({});
    setPurpose('');
  };

  const totalAmount = Object.entries(selectedItems).reduce((sum, [productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return sum + ((product?.price || 0) * quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Bulk Order</DialogTitle>
          <DialogDescription>
            Select products and quantities for your bulk order
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Bulk Order</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., For exhibition, corporate gifts, retail inventory..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Select Products and Quantities</Label>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No products available
                    </CardContent>
                  </Card>
                ) : (
                  products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1762628437902-315a5efb810c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0cyUyMGFydGlzYW58ZW58MXx8fHwxNzYzNjU5MTk0fDA&ixlib=rb-4.1.0&q=80&w=1080'}
                            alt={product.name}
                            className="size-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-gray-900 dark:text-white">{product.name}</h4>
                            <p className="text-muted-foreground">₹{product.price.toLocaleString()}</p>
                            <Badge variant="secondary" className="mt-1">{product.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`qty-${product.id}`} className="text-muted-foreground">Qty:</Label>
                            <Input
                              id={`qty-${product.id}`}
                              type="number"
                              min="0"
                              className="w-20"
                              value={selectedItems[product.id] || 0}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                            />
                          </div>
                          {selectedItems[product.id] > 0 && (
                            <div className="text-right">
                              <p className="text-gray-900 dark:text-white">
                                ₹{((product.price || 0) * selectedItems[product.id]).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {Object.keys(selectedItems).length > 0 && (
              <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-muted-foreground">Total Items: {Object.keys(selectedItems).length}</p>
                      <p className="text-muted-foreground">
                        Total Quantity: {Object.values(selectedItems).reduce((a, b) => a + b, 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Place Bulk Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
