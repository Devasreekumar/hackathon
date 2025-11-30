import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../utils/api";  // 🔥 backend API

export function AddProductDialog({ open, onClose, onProductAdded, initialProduct }) {
  const { user } = useAuth();

  const emptyForm = {
    name: "",
    price: "",
    mrp: "",
    discount: "",
    category: "",
    description: "",
    imageUrl: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || "",
        price: initialProduct.price ?? "",
        mrp: initialProduct.mrp ?? "",
        discount: initialProduct.discount ?? "",
        category: initialProduct.category || "",
        description: initialProduct.description || "",
        imageUrl: (initialProduct.image || initialProduct.imageUrl) || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialProduct, open]);

  // Calculate discount automatically
  useEffect(() => {
    const price = parseFloat(formData.price);
    const mrp = parseFloat(formData.mrp);
    if (!isNaN(price) && !isNaN(mrp) && mrp > price) {
      const disc = ((mrp - price) / mrp) * 100;
      setFormData((prev) => ({ ...prev, discount: disc.toFixed(2) }));
    }
  }, [formData.price, formData.mrp]);

  // 🔥 FINAL FIXED SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "artisan") {
      toast.error("Only artisans can add products");
      return;
    }
    if (!formData.category) return toast.error("Please select a category");
    if (parseFloat(formData.price) > parseFloat(formData.mrp))
      return toast.error("Price cannot be greater than MRP");

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      image: formData.imageUrl,
    };

    try {
      if (initialProduct && (initialProduct.id || initialProduct._id)) {
        const id = initialProduct.id || initialProduct._id;
        await updateProduct(id, payload);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload); // 🔥 Save to backend (MongoDB)
        toast.success("Product added successfully!");
      }
      onProductAdded && onProductAdded(); // refresh Artisan dashboard
      onClose();
      setFormData(emptyForm);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product — check backend connection");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>Fill the details to list your product</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            <div>
              <Label>Product Name</Label>
              <Input required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" required value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div>
                <Label>MRP (₹)</Label>
                <Input type="number" required value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} />
              </div>
            </div>

            <div>
              <Label>Discount (%)</Label>
              <Input disabled value={formData.discount} />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}>
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
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
            </div>

            {formData.imageUrl && (
              <img src={formData.imageUrl} className="h-40 rounded object-cover mx-auto" alt="preview" />
            )}

            <div>
              <Label>Description</Label>
              <Textarea rows={4} required value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit">{initialProduct ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
