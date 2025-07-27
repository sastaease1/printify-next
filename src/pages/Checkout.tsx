import React, { useState } from 'react';
import { CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const handleStripeCheckout = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: items.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${item.product.name} (${item.size})`,
                images: [item.product.image_url]
              },
              unit_amount: Math.round(item.product.price * 100)
            },
            quantity: item.quantity
          })),
          shipping_address: shippingData
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          status: 'pending',
          payment_method: 'cash_on_delivery',
          shipping_address: shippingData
        });

      if (error) throw error;

      await clearCart();
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully. You'll pay when it's delivered."
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingData.fullName || !shippingData.address || !shippingData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required shipping information.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === 'stripe') {
      handleStripeCheckout();
    } else {
      handleCashOnDelivery();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some items to proceed with checkout.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData(prev => ({ ...prev, address: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) => setShippingData(prev => ({ ...prev, city: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingData.state}
                        onChange={(e) => setShippingData(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData(prev => ({ ...prev, zipCode: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">
                            Secure payment via Stripe
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cash_on_delivery" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">
                            Pay when your order arrives
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Size: {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading 
                        ? 'Processing...' 
                        : paymentMethod === 'stripe' 
                          ? 'Pay with Card' 
                          : 'Place Order'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;