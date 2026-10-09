


import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getcarts } from '../../redux(state managemant)/slices/cart.slice'
import useMsgHandler from '../../../utils/msgHandler';
import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const { cError,cSuccess, cLoading, cartData } = useSelector((state) => state.cart);

  useMsgHandler(cSuccess,cError)
  useEffect(() => {
    dispatch(getcarts());
  }, [dispatch]);

  // cartData kabhi { items: [...] } hoga, kabhi null
  const items = cartData?.items || [];

  // Totals: discountPrice ho to wo use karo, warna price
  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + (product?.discountPrice ?? product?.price ?? 0) * quantity,
    0
  );
  const originalTotal = items.reduce(
    (sum, { product, quantity }) => sum + (product?.price ?? 0) * quantity,
    0
  );
  const savings = originalTotal - subtotal;
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (cLoading) {
    return <p className="p-6 text-center">Loading cart...</p>;
  }

  if (cError) {
    return <p className="p-6 text-center text-red-600">{String(cError)}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some delicious food to get started.</p>
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">
        My Cart <span className="text-gray-500 text-base">({totalItems} items)</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items list */}
        <div className="md:col-span-2 space-y-4">
          {items.map(({ product, quantity, _id }) => {
            if (!product) return null; // product delete ho gaya ho to skip
            const unitPrice = product.discountPrice ?? product.price;
            const hasDiscount = product.discountPrice && product.discountPrice < product.price;

            return (
              <div
                key={_id}
                className="flex gap-4 p-4 border rounded-xl shadow-sm bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* veg / non-veg indicator */}
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        product.foodType === 'veg' ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                  </div>

                  <p className="text-sm text-gray-500 capitalize">
                    {product.category} • {product.subCategory} • {product.servingSize}
                  </p>

                  {!product.inStock && (
                    <p className="text-sm text-red-600 mt-1">Out of stock</p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-bold">₹{unitPrice}</span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm">Qty: <b>{quantity}</b></p>
                    <p className="font-semibold">₹{unitPrice * quantity}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="p-4 border rounded-xl shadow-sm bg-white h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>Items ({totalItems})</span>
            <span>₹{originalTotal}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-sm mb-2 text-green-600">
              <span>Discount</span>
              <span>- ₹{savings}</span>
            </div>
          )}

          <hr className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <NavLink  to={`/app/customer/check-out`}>
            <button  className="w-full mt-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600">
            Proceed to Checkout
          </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Cart;