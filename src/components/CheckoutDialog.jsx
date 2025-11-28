import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { CreditCard, Smartphone, Building2, Banknote } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutDialog({ open, onClose, cart, total, onOrderComplete }) {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      toast.error('Please fill in delivery address and phone number');
      return;
    }

    setProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const order = {
      id: Date.now().toString(),
      customerId: user?.id,
      customerName: user?.name,
      items: cart,
      total,
      status: 'pending',
      paymentMethod,
      address,
      phone,
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    toast.success('Order placed successfully!');
    setProcessing(false);
    onOrderComplete();
    onClose();

    // Reset form
    setAddress('');
    setPhone('');
    setPaymentMethod('cod');
  };

  const paymentMethods = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', icon: Building2 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Complete your order by providing delivery details and payment method</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-3">Order Summary</h3>
            <Card>
              <CardContent className="p-4 space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-gray-900 dark:text-white">₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <h3 className="text-gray-900 dark:text-white">Delivery Details</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Textarea
                id="address"
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-gray-900 dark:text-white">Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === method.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <method.icon className="size-5" />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Payment Info */}
          {paymentMethod === 'upi' && (
            <Card>
              <CardContent className="p-4">
                <Label>UPI ID</Label>
                <Input placeholder="example@upi" className="mt-2" />
              </CardContent>
            </Card>
          )}

          {paymentMethod === 'card' && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" className="mt-2" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" maxLength={3} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === 'bank' && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <Label>Account Number</Label>
                  <Input placeholder="Enter account number" className="mt-2" />
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <Input placeholder="Enter IFSC code" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handlePlaceOrder} disabled={processing} className="flex-1">
            {processing ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
