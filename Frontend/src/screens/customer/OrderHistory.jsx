// import React from 'react'
// import { useEffect } from 'react';
// import useMsgHandler from '../../../utils/msgHandler.js'
// import {useSelector,useDispatch} from 'react-redux'
// import { fetchOrders } from '../../redux(state managemant)/slices/order.slice';
// const OrderHistory = () => {
//   const dispatch = useDispatch();
//   const {oError,oSuccess,oLoading,orders} = useSelector((state)=>state.order);
//   useMsgHandler(oSuccess,oError);
//   useEffect(()=>{
//     dispatch(fetchOrders())
//   },[dispatch]);

//   console.log('My all orders here',orders);
  
//   return (
//     <div>
//       I am a order history page here
//     </div>
//   )
// }

// export default OrderHistory



import React, { useEffect, useState } from 'react'
import useMsgHandler from '../../../utils/msgHandler.js'
import { useSelector, useDispatch } from 'react-redux'
import { fetchOrders } from '../../redux(state managemant)/slices/order.slice'

const STEPS = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered']
const STEP_LABEL = {
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const money = (n = 0) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
      })
    : '—'

const OrderCard = ({ order, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen)
  const { deliveryAddress: a = {}, items = [] } = order
  const cancelled = order.orderStatus === 'cancelled'
  const stepIndex = STEPS.indexOf(order.orderStatus)
  const count = items.reduce((s, i) => s + (i.quantity || 0), 0)

  return (
    <article className="om-card">
      <header className="om-head">
        <div>
          <p className="om-id">Order #{String(order._id).slice(-8)}</p>
          <p className="om-muted">{fmtDate(order.createdAt)}</p>
        </div>
        <div className="om-head-right">
          <span className={`om-chip om-${order.orderStatus}`}>
            {STEP_LABEL[order.orderStatus] || order.orderStatus}
          </span>
          <strong className="om-total">{money(order.total)}</strong>
        </div>
      </header>

      {/* thumbnails + summary */}
      <div className="om-thumbs">
        {items.slice(0, 4).map((it) => (
          <img key={it._id || it.product} src={it.image} alt={it.name} loading="lazy" />
        ))}
        {items.length > 4 && <span className="om-more">+{items.length - 4}</span>}
        <p className="om-muted om-count">
          {count} item{count !== 1 && 's'} · {order.paymentStatus === 'paid' ? 'Paid' : 'Payment ' + order.paymentStatus}
          {order.paymentMethod ? ` via ${order.paymentMethod}` : ''}
        </p>
      </div>

      {/* progress */}
      {!cancelled && stepIndex >= 0 && (
        <ol className="om-track" aria-label="Order progress">
          {STEPS.map((s, i) => (
            <li key={s} className={i <= stepIndex ? 'done' : ''}>
              <span className="om-dot" />
              <span className="om-step">{STEP_LABEL[s]}</span>
            </li>
          ))}
        </ol>
      )}

      <button className="om-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? 'Hide details' : 'View details'}
      </button>

      {open && (
        <div className="om-details">
          <section>
            <h4>Items</h4>
            <ul className="om-items">
              {items.map((it) => (
                <li key={it._id || it.product}>
                  <img src={it.image} alt="" loading="lazy" />
                  <div className="om-item-name">
                    <span>{it.name}</span>
                    <span className="om-muted">{money(it.price)} × {it.quantity}</span>
                  </div>
                  <strong>{money(it.price * it.quantity)}</strong>
                </li>
              ))}
            </ul>
          </section>

          <div className="om-cols">
            <section>
              <h4>Delivering to</h4>
              <p><strong>{a.fullName}</strong></p>
              <p className="om-muted">{a.addressLine}</p>
              <p className="om-muted">{[a.city, a.pincode].filter(Boolean).join(' – ')}</p>
              {a.landmark && <p className="om-muted">Landmark: {a.landmark}</p>}
              {a.phone && <p className="om-muted">Phone: {a.phone}</p>}
              {order.notes && <p className="om-note">Note: {order.notes}</p>}
            </section>

            <section>
              <h4>Bill</h4>
              <dl className="om-bill">
                <div><dt>Items</dt><dd>{money(order.itemTotal)}</dd></div>
                <div><dt>Tax</dt><dd>{money(order.tax)}</dd></div>
                <div><dt>Delivery</dt><dd>{order.deliveryFee ? money(order.deliveryFee) : 'Free'}</dd></div>
                <div className="om-grand"><dt>Total</dt><dd>{money(order.total)}</dd></div>
              </dl>
              {order.paidAt && <p className="om-muted">Paid on {fmtDate(order.paidAt)}</p>}
              {order.razorpay?.paymentId && (
                <p className="om-muted om-mono">Payment ID: {order.razorpay.paymentId}</p>
              )}
            </section>
          </div>
        </div>
      )}
    </article>
  )
}

const OrderHistory = () => {
  const dispatch = useDispatch()
  const { oError, oSuccess, oLoading, orders } = useSelector((state) => state.order)
  useMsgHandler(oSuccess, oError)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  const list = (Array.isArray(orders) ? orders : [])
    .slice()
    .sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt))

  return (
    <div className="om-page">
      <style>{css}</style>
      <h2 className="om-title">Your orders</h2>

      {oLoading && <p className="om-state">Loading your orders…</p>}

      {!oLoading && oError && list.length === 0 && (
        <div className="om-state">
          <p>We couldn't load your orders.</p>
          <button className="om-toggle" onClick={() => dispatch(fetchOrders())}>Try again</button>
        </div>
      )}

      {!oLoading && !oError && list.length === 0 && (
        <p className="om-state">You haven't placed any orders yet. Your first one will show up here.</p>
      )}

      {list.map((o, i) => (
        <OrderCard key={o._id} order={o} defaultOpen={i === 0} />
      ))}
    </div>
  )
}

const css = `
.om-page{--ink:#1c2a24;--mute:#6a766f;--line:#e4e9e5;--bg:#f6f8f5;--card:#fff;--green:#1f6f4a;--saffron:#e0a526;
  max-width:760px;margin:0 auto;padding:24px 16px 48px;color:var(--ink);font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.om-title{font-size:1.6rem;margin:0 0 16px;font-weight:700}
.om-state{padding:32px 16px;text-align:center;color:var(--mute)}
.om-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin-bottom:16px}
.om-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.om-head p{margin:0}
.om-id{font-weight:700}
.om-muted{color:var(--mute);font-size:.88rem;margin:2px 0}
.om-head-right{display:flex;align-items:center;gap:12px}
.om-total{font-size:1.15rem}
.om-chip{padding:4px 10px;border-radius:999px;font-size:.8rem;font-weight:600;background:#fdf3d8;color:#8a6210}
.om-confirmed,.om-preparing{background:#e3eefb;color:#245a9b}
.om-out_for_delivery{background:#e9e3fa;color:#5b3fa8}
.om-delivered{background:#dff3e7;color:var(--green)}
.om-cancelled{background:#fbe3e1;color:#a83a32}
.om-thumbs{display:flex;align-items:center;gap:8px;margin:14px 0;flex-wrap:wrap}
.om-thumbs img{width:48px;height:48px;border-radius:10px;object-fit:cover;background:var(--bg)}
.om-more{width:48px;height:48px;border-radius:10px;background:var(--bg);display:grid;place-items:center;font-size:.85rem;color:var(--mute)}
.om-count{margin-left:6px}
.om-track{display:flex;list-style:none;padding:0;margin:8px 0 14px}
.om-track li{flex:1;text-align:center;position:relative;font-size:.72rem;color:var(--mute)}
.om-track li::before{content:'';position:absolute;top:5px;left:-50%;width:100%;height:2px;background:var(--line)}
.om-track li:first-child::before{display:none}
.om-track li.done::before{background:var(--green)}
.om-dot{display:block;width:12px;height:12px;border-radius:50%;background:var(--line);margin:0 auto 4px;position:relative;z-index:1}
.om-track li.done .om-dot{background:var(--green)}
.om-track li.done{color:var(--ink)}
.om-toggle{background:none;border:1px solid var(--line);border-radius:8px;padding:7px 14px;font-size:.88rem;cursor:pointer;color:var(--green);font-weight:600}
.om-toggle:hover{background:var(--bg)}
.om-toggle:focus-visible{outline:2px solid var(--saffron);outline-offset:2px}
.om-details{margin-top:16px;border-top:1px solid var(--line);padding-top:14px}
.om-details h4{margin:0 0 8px;font-size:.95rem}
.om-details p{margin:2px 0}
.om-items{list-style:none;padding:0;margin:0 0 16px}
.om-items li{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--line)}
.om-items img{width:52px;height:52px;border-radius:10px;object-fit:cover}
.om-item-name{flex:1;display:flex;flex-direction:column;font-size:.92rem}
.om-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.om-bill{margin:0}
.om-bill div{display:flex;justify-content:space-between;padding:3px 0;font-size:.92rem}
.om-bill dt{color:var(--mute)}
.om-bill dd{margin:0}
.om-grand{border-top:1px solid var(--line);margin-top:4px;padding-top:6px!important;font-weight:700}
.om-grand dt{color:var(--ink)!important}
.om-note{margin-top:8px!important;padding:8px 10px;background:#fdf3d8;border-radius:8px;font-size:.85rem}
.om-mono{word-break:break-all}
@media(max-width:560px){.om-cols{grid-template-columns:1fr}.om-track li{font-size:.62rem}}
`

export default OrderHistory