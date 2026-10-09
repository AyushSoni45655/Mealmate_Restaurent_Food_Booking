import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addTocart } from '../../redux(state managemant)/slices/cart.slice';
import useMsgHandler from '../../../utils/msgHandler';

const FONT_IMPORT_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap';

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '—';
  return `₹${Number(value).toLocaleString('en-IN')}`;
};

const formatDuration = (minutes) => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

// Standard Indian food-label mark: green square+dot for veg, brown/rust for non-veg.
const FoodTypeMark = ({ foodType }) => {
  const isVeg = String(foodType).toLowerCase() === 'veg';
  const color = isVeg ? '#3F7A3A' : '#A3401C';
  return (
    <span
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 16,
        height: 16,
        border: `1.5px solid ${color}`,
        borderRadius: 3,
        flexShrink: 0,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
    </span>
  );
};

const Divider = () => <div className="h-px w-full bg-[var(--line)]" />;

const Details = () => {
  const { allProduct } = useSelector((state) => state.product);
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const myProduct = allProduct?.find((item) => item._id === String(id));

  if (!myProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF6EC]">
        <style>{`@import url('${FONT_IMPORT_URL}');`}</style>
        <div className="text-center px-6">
          <p
            className="text-2xl text-[#2A1D14] mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            We couldn't find that dish
          </p>
          <p className="text-[#6B5A4C] mb-6" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            It may have been removed, or the link is off.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-full bg-[#B34A1E] text-white text-sm font-medium hover:bg-[#9c3f19] transition-colors"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    description,
    image,
    price,
    discountPrice,
    rating,
    totalReviews,
    totalOrders,
    foodType,
    isSpicy,
    spiceLevel,
    preparationTime,
    servingSize,
    category,
    subCategory,
    ingredients = [],
    cookingInstructions = [],
    inStock,
    isAvailable,
    isFeatured,
  } = myProduct;

  const hasDiscount = discountPrice != null && discountPrice < price;
  const discountPct = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const canOrder = inStock && isAvailable;

  const diapatch = useDispatch();


  const {cError,cSuccess,cLoading,cartData} = useSelector((state)=>state.cart);
    useMsgHandler(cSuccess,cError);
  const handlerAddToCart = (id)=>{
    if(!id)return;
    
    diapatch(addTocart({quantity:qty,product:id}))
  }
  return (
    <div
      className="min-h-screen bg-[#FBF6EC] text-[#2A1D14]"
      style={{ '--line': '#E7DCC8', fontFamily: "'Work Sans', sans-serif" }}
    >
      <style>{`@import url('${FONT_IMPORT_URL}');`}</style>

      {/* Back nav */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#6B5A4C] hover:text-[#2A1D14] transition-colors inline-flex items-center gap-1.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-5 pb-10 grid md:grid-cols-[42%_1fr] gap-8 md:gap-12">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden bg-[#F3ECDD] aspect-[4/5] md:sticky md:top-6">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {isFeatured && (
            <span className="absolute top-3 left-3 bg-[#C99A44] text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-[#6B5A4C] capitalize">
            {category}
            {subCategory ? ` · ${subCategory}` : ''}
          </p>

          <h1
            className="mt-1 text-3xl sm:text-4xl leading-tight text-[#2A1D14]"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            {name}
          </h1>

          <div className="mt-3 flex items-center flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <FoodTypeMark foodType={foodType} />
              <span className="capitalize text-[#6B5A4C]">{foodType}</span>
            </span>

            <span className="text-[#E7DCC8]">|</span>

            <span className="text-[#6B5A4C]">
              {rating > 0 ? (
                <>
                  <span className="text-[#2A1D14] font-medium">{rating.toFixed(1)}</span> rating ·{' '}
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </>
              ) : (
                'No reviews yet'
              )}
            </span>

            {isSpicy && (
              <>
                <span className="text-[#E7DCC8]">|</span>
                <span className="text-[#A3401C]">Spicy · {spiceLevel}</span>
              </>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-[#4A3B2E] max-w-[62ch]">
            {description}
          </p>

          {/* Quick facts strip */}
          <div className="mt-6 grid grid-cols-3 rounded-xl border border-[var(--line)] overflow-hidden">
            <div className="p-4 text-center border-r border-[var(--line)]">
              <p className="text-lg font-medium text-[#2A1D14]">{formatDuration(preparationTime)}</p>
              <p className="text-xs text-[#6B5A4C] mt-0.5">Prep time</p>
            </div>
            <div className="p-4 text-center border-r border-[var(--line)]">
              <p className="text-lg font-medium text-[#2A1D14]">{servingSize}</p>
              <p className="text-xs text-[#6B5A4C] mt-0.5">Serving size</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-lg font-medium text-[#2A1D14]">{totalOrders}</p>
              <p className="text-xs text-[#6B5A4C] mt-0.5">Orders placed</p>
            </div>
          </div>

          {/* Price + order */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-5 pt-5 border-t border-[var(--line)]">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#B34A1E]">
                  {formatCurrency(hasDiscount ? discountPrice : price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-[#A69382] line-through">{formatCurrency(price)}</span>
                    <span className="text-sm text-[#3F7A3A] font-medium">{discountPct}% off</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#6B5A4C] mt-1">
                {canOrder ? 'In stock, ready to prepare' : 'Currently unavailable'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[var(--line)] rounded-full">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-[#2A1D14] hover:bg-[#F3ECDD] rounded-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-[#2A1D14] hover:bg-[#F3ECDD] rounded-full transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
              onClick={()=>handlerAddToCart(myProduct._id)}
                disabled={cLoading}
                className="px-6 py-2.5 rounded-full bg-[#B34A1E] text-white text-sm font-medium hover:bg-[#9c3f19] disabled:bg-[#D9CBB8] disabled:cursor-not-allowed transition-colors"
              >
                {
                  cLoading ? <h2>Processing...</h2>:  <h2>Add to Cart</h2>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients + Instructions */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-16 grid md:grid-cols-[38%_1fr] gap-10 md:gap-12">
        <div>
          <h2
            className="text-xl text-[#2A1D14] mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Ingredients
          </h2>
          <ul className="space-y-3">
            {ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] text-[#4A3B2E]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6E8B5C] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2
            className="text-xl text-[#2A1D14] mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Method
          </h2>
          <ol className="space-y-5">
            {cookingInstructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F3ECDD] text-[#B34A1E] text-sm font-medium flex items-center justify-center"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-[#4A3B2E] pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Details;
