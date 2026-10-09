import React from 'react'

const STATUS_STYLES = {
  Delivered: 'bg-emerald-500/15 text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Cancelled: 'bg-red-500/15 text-red-400',
}

const ORDERS = [
  { id: '#OD1042', customer: 'Riya Sharma', image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLtrDntdop0mXd1ybl9ANWw4rnWZmd2h6SGf6HT0Xdssv2r4luMXZRa4zo&s=10", item: 'Cheese Burger', amount: '10.00', status: 'Delivered', date: '18 Sep 2026' },
  { id: '#OD1043', customer: 'Aman Verma',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUOndilPmxfa4lhs5NBbqjSViYdRbkbF8FV_a662hjCA&s=10", item: 'Veggie Pizza', amount: '14.50', status: 'Pending', date: '19 Sep 2026' },
  { id: '#OD1044', customer: 'Kabir Singh',image:"https://mxp-media.ilnmedia.com/media/content/2019/Jun/shahid-kapoor-was-never-the-first-choice-for-kabir-singh-and-now-we-know-who-was-1200x900-1559561077.jpg", item: 'Grilled Sandwich', amount: '8.25', status: 'Delivered', date: '19 Sep 2026' },
  { id: '#OD1045', customer: 'Neha Gupta',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFFzmCLyvbQuBUf96Wd7h6R0t-55IOrgq2wVi6QiveiSqVT_one0qPmB94&s=10", item: 'Pasta Alfredo', amount: '12.00', status: 'Cancelled', date: '20 Sep 2026' },
  { id: '#OD1046', customer: 'Rohit Mehta',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiKAvghIlulCZslbYIBYUmEC0z3sfhKV1eOh8tsR9ZsjLJiWGUN6zSPX8&s=10", item: 'Chicken Wrap', amount: '9.75', status: 'Delivered', date: '20 Sep 2026' },
]

const OrderReports = () => {
  return (
    <div className="w-full rounded-2xl bg-[#262626] border border-white/10 overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {['Order ID', 'Customer', 'Item', 'Amount', 'Status', 'Date'].map((head) => (
              <th
                key={head}
                className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wide !text-white/40"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {ORDERS.map((order) => (
            <tr key={order.id} className="hover:bg-white/[0.03] transition-colors duration-150">
              <td className="px-5 py-3.5 !text-white/70 font-medium">{order.id}</td>
              <td className="px-5 py-3.5 !text-white flex gap-2 items-center"><img src={order.image} alt={order.customer} className='h-10 w-10 rounded-full' /><p>{order.customer}</p></td>
              <td className="px-5 py-3.5 !text-white/70">{order.item}</td>
              <td className="px-5 py-3.5 !text-white/70">${order.amount}</td>
              <td className="px-5 py-3.5">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-5 py-3.5 !text-white/50">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderReports