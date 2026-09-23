import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';

export const ShoppingBagDrawer: React.FC = () => {
  const { cart, removeFromCart, updateCartQty, clearCart, isCartOpen, setIsCartOpen, data } =
    useCms();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    deliveryAddress: '',
    city: 'Dhaka',
    paymentMethod: 'cod', // Cash on Delivery or Card/bKash
    specialNotes: '',
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = subtotal >= 10000 || cart.length === 0 ? 0 : formData.city === 'Dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.deliveryAddress) {
      alert('Please enter your full name, phone number, and delivery address.');
      return;
    }
    const orderId = `BS-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderId(orderId);
    setCheckoutStep('success');
    clearCart();
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between text-neutral-900">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-800" />
              <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-900 font-display">
                {checkoutStep === 'success'
                  ? 'Order Confirmed'
                  : checkoutStep === 'checkout'
                  ? 'Delivery Information'
                  : `Shopping Bag (${cart.reduce((t, i) => t + i.quantity, 0)})`}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutStep === 'success' ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-neutral-900">
                    Thank You for Your Order
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Order Reference:{' '}
                    <span className="font-mono text-amber-850 font-bold text-neutral-900">
                      {confirmedOrderId}
                    </span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-2 text-neutral-700">
                  <p>
                    <strong className="text-neutral-900">Customer:</strong> {formData.customerName}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Phone:</strong> {formData.phone}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Address:</strong> {formData.deliveryAddress},{' '}
                    {formData.city}
                  </p>
                  <p>
                    <strong className="text-neutral-900">Payment:</strong> Cash on Delivery (COD)
                  </p>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed">
                  Our atelier concierge will call your phone number within 2 business hours to verify
                  fabric measurements and dispatch your order.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-full bg-neutral-900 text-white font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                >
                  Continue Browsing Showroom
                </button>
              </div>
            ) : checkoutStep === 'checkout' ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="e.g. Samira Rahman"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">
                    Contact Phone (for delivery SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">Delivery Address *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, deliveryAddress: e.target.value })
                    }
                    placeholder="House, Road, Area details..."
                    className="w-full px-3.5 py-2 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-700">District / Region</label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs focus:bg-white focus:outline-none focus:border-neutral-400"
                  >
                    <option value="Dhaka">Inside Dhaka (৳ 80 delivery)</option>
                    <option value="Chittagong">Chittagong (৳ 150 delivery)</option>
                    <option value="Sylhet">Sylhet (৳ 150 delivery)</option>
                    <option value="Rajshahi">Rajshahi (৳ 150 delivery)</option>
                    <option value="Other">Outside Dhaka - Other Districts (৳ 150)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                  <div className="font-semibold text-neutral-900">Payment Method:</div>
                  <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      name="pay"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: 'cod' })
                      }
                    />
                    <span>Cash on Delivery (Pay when you receive the parcel)</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="flex-1 py-3 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs tracking-wider uppercase font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Back to Bag
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-neutral-900 text-white font-semibold text-xs tracking-wider uppercase hover:bg-neutral-800 transition-all cursor-pointer shadow-md"
                  >
                    Confirm Order (৳ {grandTotal.toLocaleString()})
                  </button>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto" />
                <p className="text-sm text-neutral-500">Your shopping bag is empty.</p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-full bg-neutral-100 text-xs uppercase tracking-wider text-neutral-800 hover:bg-neutral-200 transition-colors font-medium border border-neutral-200"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-4 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 items-center"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-lg bg-neutral-200"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                        <span>Size: {item.selectedSize}</span>
                        <span>·</span>
                        <span>{item.product.floor}</span>
                      </div>
                      <div className="text-xs font-serif text-neutral-900 tabular-nums font-semibold">
                        ৳ {item.product.price.toLocaleString()}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5 bg-white border border-neutral-300 rounded-md px-1.5 py-0.5 shadow-xs">
                          <button
                            onClick={() =>
                              updateCartQty(item.product.id, item.selectedSize, -1)
                            }
                            className="p-1 hover:text-neutral-950 text-neutral-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono text-neutral-900 font-semibold px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQty(item.product.id, item.selectedSize, 1)
                            }
                            className="p-1 hover:text-neutral-950 text-neutral-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.selectedSize)
                          }
                          className="text-neutral-400 hover:text-rose-600 text-xs transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout CTA */}
          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="p-6 border-t border-neutral-200 bg-neutral-50 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-mono tabular-nums font-semibold">
                    ৳ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Standard Delivery</span>
                  <span className="text-neutral-900 font-mono tabular-nums">
                    {deliveryFee === 0 ? 'Complimentary (Free)' : `৳ ${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-semibold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="text-neutral-900 font-mono text-base tabular-nums font-bold">
                    ৳ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery & Easy Inspection at Doorstep</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
