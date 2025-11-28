import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

export function CreateExhibitionDialog({ open, onClose, onExhibitionCreated }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
  });

  useEffect(() => {
    // Load all products
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const exhibition = {
      id: Date.now().toString(),
      consultantId: user?.id,
      consultantName: user?.name,
      ...formData,
      products: selectedProducts,
      visitors: 0,
      createdAt: new Date().toISOString(),
    };

    const exhibitions = JSON.parse(localStorage.getItem('exhibitions') || '[]');
    exhibitions.push(exhibition);
    localStorage.setItem('exhibitions', JSON.stringify(exhibitions));

    toast.success('Exhibition created successfully!');
    onExhibitionCreated();
    onClose();

    // Reset form
    setFormData({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
    });
    setSelectedProducts([]);
  };

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exhibition</DialogTitle>
          <DialogDescription>
            Organize an exhibition to showcase artisan products
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exhibition Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter exhibition name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the exhibition..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Products to Showcase</Label>
              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {products.length === 0 ? (
                  <p className="text-muted-foreground">No products available</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {product.name} - ₹{product.price} ({product.artisanName})
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-muted-foreground">{selectedProducts.length} product(s) selected</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Exhibition</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
