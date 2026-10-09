import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getcarts } from '../../redux(state managemant)/slices/cart.slice';
import { orderCreate, orderVerify } from '../../redux(state managemant)/slices/order.slice';
import useMsgHandler from '../../../utils/msgHandler';
import { loadRazorpayScript } from '../../../utils/loadRazorpay';
// ---- Pricing rules (change to match your backend) ----
const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 40;
const GST_RATE = 0.05;

const rupee = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay when your food arrives' },
  {id:"razorpay",label:'Razorpay',hint:'Pay amount right now'}
];

const emptyForm = {
  fullName: '',
  phone: '',
  addressLine: '',
  landmark: '',
  city: '',
  pincode: '',
  notes: '',
};

const validate = (f) => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = 'Enter your full name';
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a valid 10-digit mobile number';
  if (f.addressLine.trim().length < 5) e.addressLine = 'Enter your house number and street';
  if (!f.city.trim()) e.city = 'Enter your city';
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Enter a 6-digit pincode';
  return e;
};

// Defined outside CheckOut so inputs keep focus while typing
const Field = ({ label, error, className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-medium text-stone-700">{label}</span>
    <input
      {...props}
      aria-invalid={!!error}
      className={`mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-400 ${
        error ? 'border-red-400' : 'border-stone-300'
      }`}
    />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

const Section = ({ step, title, children }) => (
  <section className="rounded-2xl border border-stone-200 bg-white p-5 md:p-6">
    <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold text-stone-900">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
        {step}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const Row = ({ label, value, className = '' }) => (
  <div className={`flex justify-between text-sm ${className}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {oError,oSuccess,oLoading,orderData} = useSelector((state)=>state.order);
  const { cartData, cLoading, cError } = useSelector((state) => state.cart);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    dispatch(getcarts());
  }, [dispatch]);

  // Skip items whose product was deleted
  const items = useMemo(() => (cartData?.items || []).filter((i) => i.product), [cartData]);

  const bill = useMemo(() => {
    const mrp = items.reduce((s, { product, quantity }) => s + product.price * quantity, 0);
    const itemTotal = items.reduce(
      (s, { product, quantity }) => s + (product.discountPrice ?? product.price) * quantity,
      0
    );
    const delivery = itemTotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
    const tax = itemTotal * GST_RATE;
    return {
      mrp,
      itemTotal,
      savings: mrp - itemTotal,
      delivery,
      tax,
      total: itemTotal + delivery + tax,
      count: items.reduce((s, i) => s + i.quantity, 0),
      prepTime: Math.max(0, ...items.map((i) => i.product.preparationTime || 0)),
    };
  }, [items]);

  const unavailable = items.filter(({ product }) => !product.inStock || !product.isAvailable);
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_ABOVE - bill.itemTotal);

  const onChange = (e) => {
    const { name, value } = e.target;
    const v = name === 'phone' || name === 'pincode' ? value.replace(/\D/g, '') : value;
    setForm((f) => ({ ...f, [name]: v }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  useMsgHandler(oSuccess,oError);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    if (unavailable.length) {
      toast.error('Remove unavailable items from your cart to continue');
      return;
    }

    const payload = {
      cartId: cartData._id,
      items: items.map(({ product, quantity }) => ({ product: product._id, quantity })),
      deliveryAddress: {
        fullName: form.fullName.trim(),
        phone: form.phone,
        addressLine: form.addressLine.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        pincode: form.pincode,
      },
      paymentMethod: payment,
      notes: form.notes.trim(),
    };

    setPlacing(true);
    try {
      // TODO: connect your order API, e.g.
      const mydata =  await dispatch(orderCreate(payload)).unwrap();
     const {data:orderData} = mydata;
      
       
       if(orderData.paymentMethod === 'cod'){
      toast.success('Order placed');
      dispatch(getcarts());
      setPlacing(false);
      navigate('/app/customer/order-history'); // your orders route
      return;
      }


    // 2b. Online: open Razorpay
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Could not load Razorpay. Check your connection.');

    const rzp = new window.Razorpay({
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'MealMate',
      description: 'Food order',
      order_id: orderData.razorpayOrderId,
      prefill: { name: form.fullName, contact: form.phone },
      theme: { color: '#f97316' },
      modal: { ondismiss: () => setPlacing(false) }, // user closed the popup
      handler: async (response) => {
        // 3. Payment done in the popup: verify on the server
        try {
          await dispatch(orderVerify({
             razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })).unwrap()
         
          toast.success('Payment successful. Order placed.');
          dispatch(getcarts());
          navigate('/app/customer/order-history');
        } catch (err) {
          toast.error(err?.response?.data?.message || 'Payment could not be verified');
        } 
      },
    });
    rzp.on('payment.failed',(resp)=>{
       toast.error(resp.error?.description || 'Payment failed. Try again.');
      setPlacing(false);
    })

    rzp.open();
      
      // navigate('/app/customer/orders');
    } catch (err) {
      toast.error(err?.message || 'Could not place your order. Try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cLoading) return <p className="p-10 text-center text-stone-500">Loading checkout...</p>;
  if (cError) return <p className="p-10 text-center text-red-600">{String(cError)}</p>;

  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold text-stone-900">Nothing to check out</h2>
        <p className="mt-2 text-stone-500">Add some food to your cart first.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
        >
          Back to cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <form onSubmit={handlePlaceOrder} noValidate className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            Edit cart
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: address + payment */}
          <div className="space-y-6">
            <Section step={1} title="Delivery address">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="fullName" autoComplete="name" value={form.fullName} onChange={onChange} error={errors.fullName} />
                <Field label="Mobile number" name="phone" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" value={form.phone} onChange={onChange} error={errors.phone} />
                <Field label="House number and street" name="addressLine" autoComplete="street-address" className="sm:col-span-2" value={form.addressLine} onChange={onChange} error={errors.addressLine} />
                <Field label="Landmark (optional)" name="landmark" className="sm:col-span-2" value={form.landmark} onChange={onChange} error={errors.landmark} />
                <Field label="City" name="city" autoComplete="address-level2" value={form.city} onChange={onChange} error={errors.city} />
                <Field label="Pincode" name="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pincode} onChange={onChange} error={errors.pincode} />
              </div>

              <label className="mt-4 block">
                <span className="text-sm font-medium text-stone-700">Note for the kitchen or rider (optional)</span>
                <textarea
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={onChange}
                  placeholder="Less spicy, ring the bell twice..."
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-400"
                />
              </label>
            </Section>

            <Section step={2} title="Payment method">
              <div className="space-y-3" role="radiogroup" aria-label="Payment method">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      payment === opt.id ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)}
                      className="h-4 w-4 accent-orange-500"
                    />
                    <span>
                      <span className="block font-medium text-stone-900">{opt.label}</span>
                      <span className="block text-sm text-stone-500">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </Section>
          </div>

          {/* Right: order summary */}
          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 md:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-stone-900">
              Your order <span className="text-sm font-normal text-stone-500">({bill.count} items)</span>
            </h2>

            <ul className="mt-4 divide-y divide-stone-100">
              {items.map(({ product, quantity, _id }) => {
                const unit = product.discountPrice ?? product.price;
                const off = product.discountPrice != null && product.discountPrice < product.price;
                const unavailableItem = !product.inStock || !product.isAvailable;
                return (
                  <li key={_id} className="flex gap-3 py-3">
                    <img src={product.image} alt={product.name} className="h-16 w-16 flex-none rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <span
                          aria-label={product.foodType === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}
                          className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${product.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}
                        />
                        <p className="line-clamp-2 text-sm font-medium text-stone-900">{product.name}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {product.servingSize} · Qty {quantity}
                      </p>
                      {unavailableItem && <p className="mt-0.5 text-xs font-medium text-red-600">Currently unavailable</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-stone-900">{rupee(unit * quantity)}</p>
                      {off && <p className="text-xs text-stone-400 line-through">{rupee(product.price * quantity)}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>

            {toFreeDelivery > 0 && (
              <div className="mt-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-800">
                Add {rupee(toFreeDelivery)} more for free delivery.
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-orange-100">
                  <div className="h-full bg-orange-500" style={{ width: `${(bill.itemTotal / FREE_DELIVERY_ABOVE) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-stone-600">
              <Row label="Item total" value={rupee(bill.mrp)} />
              {bill.savings > 0 && <Row label="Discount" value={`- ${rupee(bill.savings)}`} className="text-green-600" />}
              <Row label="Delivery" value={bill.delivery === 0 ? 'Free' : rupee(bill.delivery)} />
              <Row label={`GST (${GST_RATE * 100}%)`} value={rupee(bill.tax)} />
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-stone-200 pt-4">
              <span className="text-base font-semibold text-stone-900">Total to pay</span>
              <span className="text-2xl font-bold text-stone-900">{rupee(bill.total)}</span>
            </div>

            {bill.savings > 0 && (
              <p className="mt-1 text-right text-xs font-medium text-green-600">You save {rupee(bill.savings)} on this order</p>
            )}

            {bill.prepTime > 0 && (
              <p className="mt-3 text-sm text-stone-500">Ready in about {bill.prepTime} min, plus delivery time.</p>
            )}

            {unavailable.length > 0 && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {unavailable.length} item{unavailable.length > 1 ? 's are' : ' is'} unavailable. Remove
                {unavailable.length > 1 ? ' them' : ' it'} from your cart to continue.
              </p>
            )}

            <button
              type="submit"
              disabled={placing || unavailable.length > 0}
              className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placing ? 'Placing order...' : `Place order · ${rupee(bill.total)}`}
            </button>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;