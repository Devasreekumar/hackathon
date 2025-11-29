import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { toast } from 'sonner';

export function AddProductDialog({ open, onClose, onProductAdded, initialProduct }) {
  const { user } = useAuth();

  const emptyForm = {
    name: '',
    price: '',
    mrp: '',
    discount: '',
    category: '',
    description: '',
    imageUrl: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  // Auto-load product values when editing
  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        price: initialProduct.price ?? '',
        mrp: initialProduct.mrp ?? '',
        discount: initialProduct.discount ?? '',
        category: initialProduct.category || '',
        description: initialProduct.description || '',
        imageUrl: initialProduct.imageUrl || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialProduct, open]);

  // Auto calculate discount from MRP & Price
  useEffect(() => {
    const price = parseFloat(formData.price);
    const mrp = parseFloat(formData.mrp);

    if (!isNaN(price) && !isNaN(mrp) && mrp > price) {
      const disc = ((mrp - price) / mrp) * 100;
      setFormData(prev => ({
        ...prev,
        discount: disc.toFixed(2)
      }));
    }
  }, [formData.price, formData.mrp]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Role safety
    if (user?.role !== 'artisan') {
      toast.error('Only artisans can add products');
      return;
    }

    // Validations
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (formData.discount && (formData.discount < 0 || formData.discount > 100)) {
      toast.error('Discount must be between 0 and 100');
      return;
    }

    if (parseFloat(formData.price) > parseFloat(formData.mrp)) {
      toast.error('Selling price cannot be greater than MRP');
      return;
    }

    if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
      toast.error('Invalid image URL');
      return;
    }

    const products = JSON.parse(localStorage.getItem('products') || '[]');

    // Update product
    if (initialProduct?.id) {
      const idx = products.findIndex(p => p.id === initialProduct.id);
      if (idx === -1) {
        toast.error('Product not found');
        return;
      }

      products[idx] = {
        ...products[idx],
        ...formData,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        discount: parseFloat(formData.discount) || 0,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem('products', JSON.stringify(products));
      toast.success('Product updated successfully!');
    } 
    // Add new product
    else {
      const newProduct = {
        id: Date.now().toString(),
        artisanId: user?.id,
        artisanName: user?.name,
        ...formData,
        price: parseFloat(formData.price),
        mrp: parseFloat(formData.mrp),
        discount: parseFloat(formData.discount) || 0,
        createdAt: new Date().toISOString(),
      };

      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      toast.success('Product added successfully!');
    }

    onProductAdded && onProductAdded();
    onClose();
    setFormData(emptyForm);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            Fill the details to list your product
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            <div>
              <Label>Product Name</Label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" required value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>

              <div>
                <Label>MRP (₹)</Label>
                <Input type="number" required value={formData.mrp}
                  onChange={e => setFormData({ ...formData, mrp: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Discount (%)</Label>
              <Input type="number" value={formData.discount}
                onChange={e => setFormData({ ...formData, discount: e.target.value })} />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={formData.category}
                onValueChange={val => setFormData({ ...formData, category: val })}>
                <SelectTrigger><SelectValue placeholder="Choose Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="handicrafts">Handicrafts</SelectItem>
                  <SelectItem value="pottery">Pottery</SelectItem>
                  <SelectItem value="textiles">Textiles</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="home-decor">Home Decor</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Image URL</Label>
              <Input value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
            </div>

            {formData.imageUrl && (
              <img src={formData.imageUrl} className="h-40 rounded object-cover mx-auto" />
            )}

            <div>
              <Label>Description</Label>
              <Textarea rows={4} required value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialProduct ? 'Update' : 'Add'}</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
