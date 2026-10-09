

import { addTocart } from "../../redux(state managemant)/slices/cart.slice";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFaivrates,
  getWishListIds,
  toggleWishList, // TODO: create this thunk (DELETE /api/favorites/:id) and remove the item from state
} from "../../redux(state managemant)/slices/wishlist.slice";
import { NavLink } from "react-router-dom";
import useMsgHandler from "../../../utils/msgHandler";

/* ---------- helpers ---------- */
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const getPricing = ({ price, discountPrice }) => {
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  return {
    final: hasDiscount ? discountPrice : price,
    original: hasDiscount ? price : null,
    off: hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0,
  };
};

const SORTS = {
  recent: { label: "Recently saved", fn: () => 0 },
  low: { label: "Price: low to high", fn: (a, b) => getPricing(a).final - getPricing(b).final },
  high: { label: "Price: high to low", fn: (a, b) => getPricing(b).final - getPricing(a).final },
  quick: { label: "Quickest to cook", fn: (a, b) => a.preparationTime - b.preparationTime },
  rated: { label: "Top rated", fn: (a, b) => b.rating - a.rating },
};

const SPICE = {
  mild: "bg-[#eef1ec] text-[#5d6d6b]",
  medium: "bg-[#fdf0d2] text-[#7a5600]",
  hot: "bg-[#fbdcd6] text-[#8c2415]",
  spicy: "bg-[#fbdcd6] text-[#8c2415]",
};

/* shared class strings */
const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#f0b429]";
const PILL = `h-[38px] whitespace-nowrap rounded-full border px-4 text-[15px] font-medium transition-colors ${FOCUS}`;
const pill = (on) => `${PILL} ${on ? "border-[#17282b] bg-[#17282b] text-white" : "border-[#dfe5df] bg-white hover:border-[#17282b]"}`;
const BTN = `inline-flex items-center justify-center gap-2 rounded-full bg-[#17282b] font-semibold text-white transition
  hover:bg-[#1c7a4b] active:scale-[.97] disabled:cursor-not-allowed disabled:bg-[#cfd6cf] disabled:text-[#7b8a86] ${FOCUS}`;
const FONT_HEAD = "font-['Bricolage_Grotesque',sans-serif]";

/* ---------- icons ---------- */
const Icon = ({ d, size = 18, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const HEART = "M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z";
const CLOCK = "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z";
const USERS = "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8";
const SEARCH = "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3";
const CLOSE = "M6 6l12 12M18 6L6 18";
const STAR = "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z";
const BAG = "M6 7h12l1 13H5L6 7zM9 7a3 3 0 0 1 6 0";

const VegMark = ({ type }) => {
  const color = type === "veg" ? "text-[#1c7a4b]" : "text-[#d3402b]";
  return (
    <span title={type === "veg" ? "Vegetarian" : "Non-vegetarian"} aria-label={type}
      className={`grid h-4 w-4 flex-none place-items-center rounded-[3px] border-2 border-current ${color}`}>
      <span className="h-[7px] w-[7px] rounded-full bg-current" />
    </span>
  );
};

const Price = ({ item, big }) => {
  const { final, original } = getPricing(item);
  return (
    <div className="flex items-baseline gap-2">
      <strong className={`${FONT_HEAD} ${big ? "text-2xl" : "text-[1.35rem]"}`}>{money(final)}</strong>
      {original && <s className="text-sm text-[#5d6d6b]">{money(original)}</s>}
    </div>
  );
};

/* ---------- card ---------- */
const FavCard = ({ item, onOpen, onRemove, onAdd , iswishlist}) => {
  const val = iswishlist(item._id)
  const { off } = getPricing(item);
  const unavailable = !item.inStock || !item.isAvailable || !item.isActive;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[20px] border border-[#dfe5df] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgba(23,40,43,.35)]">
      <button onClick={() => onOpen(item)} aria-label={`View ${item.name}`}
        className={`relative block aspect-[4/3] w-full overflow-hidden bg-[#e8ece6] ${FOCUS}`}>
        <img src={item.image} alt={item.name} loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${unavailable ? "opacity-70 grayscale" : ""}`} />
        {item.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-[#f0b429] px-2.5 py-1 text-xs font-semibold text-[#3a2a00]">Featured</span>
        )}
        {off > 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#1c7a4b] px-2.5 py-1 text-xs font-semibold text-white">{off}% off</span>
        )}
        {unavailable && (
          <span className="absolute bottom-3 right-3 rounded-full bg-[#17282b] px-2.5 py-1 text-xs font-semibold text-white">Unavailable</span>
        )}
      </button>

      <div onClick={() => onRemove(item._id)} aria-label={`Remove ${item.name} from favorites`}
        className={`absolute right-8  top-3 z-[1] grid h-10 w-10 place-items-center rounded-full bg-white text-[#d3402b] shadow-md transition hover:scale-110 active:scale-90 ${FOCUS}`}>
        <Icon d={HEART} className={`${val ? "text-blue-800":"bg-gray-600"}`} />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-[18px] pb-[18px] pt-4">
        <div className="flex items-center gap-2 text-sm text-[#5d6d6b]">
          <VegMark type={item.foodType} />
          <span>{cap(item.subCategory)}</span>
          {item.spiceLevel && item.spiceLevel !== "none" && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${SPICE[item.spiceLevel] || SPICE.mild}`}>{cap(item.spiceLevel)}</span>
          )}
        </div>

        <h3 onClick={() => onOpen(item)}
          className={`${FONT_HEAD} line-clamp-2 cursor-pointer text-lg font-bold leading-tight tracking-tight hover:underline hover:underline-offset-4`}>
          {item.name}
        </h3>

        <ul className="m-0 flex list-none flex-wrap gap-x-3.5 gap-y-1.5 p-0 text-sm text-[#5d6d6b]">
          <li className="flex items-center gap-1.5"><Icon d={CLOCK} size={15} />{item.preparationTime} min</li>
          <li className="flex items-center gap-1.5"><Icon d={USERS} size={15} />{item.servingSize}</li>
          <li className="flex items-center gap-1.5">
            <Icon d={STAR} size={15} fill={item.rating ? "currentColor" : "none"} />
            {item.totalReviews ? `${item.rating.toFixed(1)} (${item.totalReviews})` : "New"}
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-[#dfe5df] pt-3">
          <Price item={item} />
          <div disabled={unavailable} onClick={() => onAdd({product:item._id,quantity:1})} className={`${BTN} h-10 px-4 text-sm`}>
            <Icon d={BAG} size={16} />
            {unavailable ? "Sold out" : "Add to cart"}
          </div>
        </div>
      </div>
    </article>
  );
};

/* ---------- detail drawer ---------- */
const Drawer = ({ item, onClose, onAdd }) => {
  const [tab, setTab] = useState("about");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const tabs = [
    ["about", "About"],
    ["ingredients", `Ingredients (${item.ingredients?.length || 0})`],
    ["steps", `Method (${item.cookingInstructions?.length || 0})`],
  ];

  return (
    <div onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-end bg-[#17282b]/50 transition-opacity duration-200 sm:items-stretch ${shown ? "opacity-100" : "opacity-0"}`}>
      <aside role="dialog" aria-modal="true" aria-label={item.name} onClick={(e) => e.stopPropagation()}
        className={`relative flex h-[92%] w-full flex-col rounded-t-[20px] bg-white text-[#17282b] transition duration-300 sm:h-full sm:w-[520px] sm:rounded-none
          ${shown ? "translate-x-0 translate-y-0" : "translate-y-10 sm:translate-x-10 sm:translate-y-0"}`}>
        <div onClick={onClose} aria-label="Close"
          className={`absolute right-3.5 top-3.5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white shadow-md ${FOCUS}`}>
          <Icon d={CLOSE} />
        </div>

        <img src={item.image} alt={item.name} className="aspect-[16/10] w-full flex-none rounded-t-[20px] object-cover sm:rounded-none" />

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-6 pt-5">
          <div className="flex items-center gap-2 text-sm text-[#5d6d6b]">
            <VegMark type={item.foodType} />
            <span>{cap(item.category)} · {cap(item.subCategory)}</span>
          </div>
          <h2 className={`${FONT_HEAD} m-0 text-2xl font-bold leading-tight tracking-tight`}>{item.name}</h2>

          <div role="tablist" className="flex gap-1 border-b border-[#dfe5df]">
            {tabs.map(([k, l]) => (
              <div key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className={`-mb-px border-b-[3px] px-3.5 py-2.5 font-medium ${FOCUS}
                  ${tab === k ? "border-[#f0b429] text-[#17282b]" : "border-transparent text-[#5d6d6b]"}`}>
                {l}
              </div>
            ))}
          </div>

          <div className="max-w-[68ch] flex-1 overflow-y-auto pb-4 leading-relaxed text-[#34464a]">
            {tab === "about" && (
              <>
                <dl className="my-2 mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[["Prep time", `${item.preparationTime} min`], ["Serves", item.servingSize],
                    ["Spice", cap(item.spiceLevel)], ["Orders", item.totalOrders]].map(([t, v]) => (
                    <div key={t} className="rounded-xl bg-[#f3f5f1] p-2.5">
                      <dt className="text-xs text-[#5d6d6b]">{t}</dt>
                      <dd className="m-0 mt-0.5 text-[15px] font-semibold text-[#17282b]">{v}</dd>
                    </div>
                  ))}
                </dl>
                {item.description?.split(/\r?\n/).filter(Boolean).map((p, i) => <p key={i} className="mb-3">{p}</p>)}
              </>
            )}
            {tab === "ingredients" && (
              <ul className="my-2 list-disc space-y-2.5 pl-5 marker:text-[#1c7a4b]">
                {item.ingredients?.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            )}
            {tab === "steps" && (
              <ol className="my-2 list-decimal space-y-2.5 pl-5 marker:font-bold marker:text-[#1c7a4b]">
                {item.cookingInstructions?.map((x, i) => <li key={i} className="pl-1">{x}</li>)}
              </ol>
            )}
          </div>

          <div className="-mx-6 flex items-center justify-between gap-4 border-t border-[#dfe5df] bg-white px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Price item={item} big />
            <div disabled={!item.inStock || !item.isAvailable} onClick={() => onAdd(item)}
              className={`${BTN} h-12 px-6`}>Add to cart</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

/* ---------- page ---------- */
const Faivrate = () => {
  const dispatch = useDispatch();
  const { faivratesItem = [], wLoading :loading,wishListIds } = useSelector((s) => s.wishlist);
  
  const handlerIsFaiv = (id)=>{
    const isFaivrate = wishListIds.includes(id);
    return isFaivrate;
  }
  

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [diet, setDiet] = useState("all");
  const [sort, setSort] = useState("recent");
  const [selected, setSelected] = useState(null);
  const [count, setcount] = useState(faivratesItem.length)
  // const count = faivratesItem.length;
  useEffect(() => {
    
     dispatch(getFaivrates()); }, [dispatch,count]);
     const {cSuccess,cError,cLoading} = useSelector((state)=>state.cart);
  const categories = useMemo(
    () => ["all", ...new Set(faivratesItem.map((i) => i.category).filter(Boolean))],
    [faivratesItem]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faivratesItem
      .filter((i) => category === "all" || i.category === category)
      .filter((i) => diet === "all" || i.foodType === diet)
      .filter((i) => !q || `${i.name} ${i.subCategory} ${i.category}`.toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [faivratesItem, query, category, diet, sort]);

 const handleRemove =  (id) =>{
   dispatch(toggleWishList({ productId: id }));
   setcount((prev)=>prev - 1)
 };

 useMsgHandler(cSuccess,cError)
  const handleAdd = (item) => {
    dispatch(addTocart(item))
   
  };

  const filtersActive = query || category !== "all" || diet !== "all";
  const reset = () => { setQuery(""); setCategory("all"); setDiet("all"); };
  

  return (
    <main className="min-h-screen bg-[#f3f5f1] px-4 pb-20 pt-6 font-['DM_Sans',system-ui,sans-serif] text-[#17282b] sm:px-8 sm:pt-10 lg:px-14 lg:pt-12">
      <header>
        <h1 className={`${FONT_HEAD} m-0 text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl`}>Your favorites</h1>
        <p className="mb-0 mt-2.5 text-[1.05rem] text-[#5d6d6b]">
          {count ? `${count} saved ${count === 1 ? "meal" : "meals"}, ready when you are.` : "Meals you save will wait for you here."}
        </p>
      </header>

      {count > 0 && (
        <section aria-label="Filter favorites"
          className="sticky top-0 z-[5] -mx-4 mb-6 mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#dfe5df] bg-[#f3f5f1]/90 px-4 py-3.5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-14 lg:px-14">
          <label className="flex h-11 w-full flex-none items-center gap-2 rounded-full border border-[#dfe5df] bg-white px-3.5 text-[#5d6d6b] focus-within:border-[#17282b] sm:w-[300px]">
            <Icon d={SEARCH} size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your favorites"
              aria-label="Search favorites" className="min-w-0 flex-1 border-0 bg-transparent text-[#17282b] outline-none" />
          </label>

          <div role="group" aria-label="Category" className="flex flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={pill(category === c)}>
                {c === "all" ? "All meals" : cap(c)}
              </button>
            ))}
          </div>

          <div className="flex w-full items-center justify-between gap-2.5 sm:ml-auto sm:w-auto">
            <div role="group" aria-label="Diet" className="flex gap-1.5">
              {[["all", "All"], ["veg", "Veg"], ["non-veg", "Non-veg"]].map(([k, l]) => (
                <button key={k} onClick={() => setDiet(k)} className={pill(diet === k)}>{l}</button>
              ))}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"
              className={`h-[38px] rounded-full border border-[#dfe5df] bg-white px-3 ${FOCUS}`}>
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </section>
      )}

      {loading && !count ? (
        <div aria-busy="true" className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-[20px] bg-[#e3e8e0]" />)}
        </div>
      ) : !count ? (
        <div className="grid justify-items-center gap-2 px-4 py-[72px] text-center">
          <span className="mb-2 grid h-[72px] w-[72px] place-items-center rounded-full bg-[#fbdcd6] text-[#d3402b]"><Icon d={HEART} size={30} /></span>
          <h2 className={`${FONT_HEAD} m-0 text-2xl font-bold`}>No favorites yet</h2>
          <p className="mb-4 mt-0 max-w-[38ch] text-[#5d6d6b]">Tap the heart on any meal to keep it here for quick reordering.</p>
          <NavLink to="/" className={`${BTN} h-12 px-6 no-underline`}>Browse meals</NavLink>
        </div>
      ) : !visible.length ? (
        <div className="grid justify-items-center gap-2 px-4 py-[72px] text-center">
          <h2 className={`${FONT_HEAD} m-0 text-2xl font-bold`}>Nothing matches those filters</h2>
          <p className="mb-4 mt-0 max-w-[38ch] text-[#5d6d6b]">Try a different search or clear the filters.</p>
          {filtersActive && <button onClick={reset} className={`${BTN} h-12 px-6`}>Clear filters</button>}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6">
          {
            cLoading ? 'Add To Cart is processing' : visible.map((item) => (
            <FavCard key={item._id} item={item} onOpen={setSelected} iswishlist={handlerIsFaiv} onRemove={handleRemove} onAdd={handleAdd} />
          ))
          }
        </div>
      )}

      {selected && <Drawer item={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />}
    </main>
  );
};

export default Faivrate;