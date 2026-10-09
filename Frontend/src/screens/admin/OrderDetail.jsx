

// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   Eye,
//   MoreVertical,
//   Filter,
//   ChevronDown,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrders,updateOrderStatus } from "../../redux(state managemant)/slices/order.slice";
// import useMsgHandler from "../../../utils/msgHandler";

// const OrderDetail = () => {
//   const dispatch = useDispatch();
//   const {oError,oSuccess,oLoading,orders} = useSelector((state)=>state.order);
//   const [activeTab, setActiveTab] = useState("All");
//   const [cStatus, setcStatus] = useState("");
//   const [orderId, setorderId] = useState("")

//   const onChangeHandler = async(...val)=>{
//     const [status,id] = val;
//     setcStatus(prev=>prev = status)
//     setorderId(prev=>prev = id)

//    if(cStatus && orderId){
//    const response = await dispatch(updateOrderStatus({orderStatus: cStatus,  orderId})).unwrap();
//    if(response.data.success){
//     dispatch(fetchOrders())
//    }
//    }
    
    
    
//   }

//   useMsgHandler(oSuccess,oError)
//   useEffect(()=>{
//     dispatch(fetchOrders())
//   },[dispatch])

//   // useEffect(()=>{})


  
//   // const orders = [
//   //   {
//   //     id: "#MM10245",
//   //     customer: "Rahul Sharma",
//   //     items: 3,
//   //     amount: 846,
//   //     payment: "Paid",
//   //     status: "placed",
//   //     date: "21 Sep 2026",
//   //   },
//   //   {
//   //     id: "#MM10244",
//   //     customer: "Amit Kumar",
//   //     items: 2,
//   //     amount: 540,
//   //     payment: "Paid",
//   //     status: "preparing",
//   //     date: "21 Sep 2026",
//   //   },
//   //   {
//   //     id: "#MM10243",
//   //     customer: "Priya Singh",
//   //     items: 5,
//   //     amount: 1250,
//   //     payment: "Pending",
//   //     status: "placed",
//   //     date: "20 Sep 2026",
//   //   },
//   //   {
//   //     id: "#MM10242",
//   //     customer: "Rohit Verma",
//   //     items: 1,
//   //     amount: 320,
//   //     payment: "Paid",
//   //     status: "cancelled",
//   //     date: "20 Sep 2026",
//   //   },
//   // ];

//   const tabs = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
//   tabs.unshift('All')

//   const filteredOrders =
//     activeTab === "All"
//       ? orders
//       : orders.filter((order) => order.orderStatus === activeTab);

//   const statusStyle = (status) => {
//     switch (status) {
//       case "placed":
//         return "bg-yellow-100 text-yellow-700";

//       case "preparing":
//         return "bg-blue-100 text-blue-700";

//       case "out_for_delivery":
//         return "bg-orange-100 text-orange-700";

//       case "Out for Delivery":
//         return "bg-purple-100 text-purple-700";

//       case "delivered":
//         return "bg-green-100 text-green-700";

//       case "cancelled":
//         return "bg-red-100 text-red-700";

//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1a1a1a] !text-white p-4 sm:p-6 lg:p-8">

//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

//         <div>
//           <h1 className="text-2xl font-bold !text-white">
//             Orders
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Manage and track all customer orders
//           </p>
//         </div>

//         {/* Search */}
//         <div className="relative w-full md:w-80">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 !text-white"
//           />

//           <input
//             type="text"
//             placeholder="Search order or customer..."
//             className="w-full rounded-lg border bg-black py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mb-5 overflow-x-auto rounded-xl  bg-[#333333]">
//         <div className="flex min-w-max gap-4">

//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-5 py-4 text-sm font-medium transition ${
//                 activeTab === tab
//                   ? "border-b-2 border-orange-500 text-orange-500"
//                   : "text-gray-500 hover:text-gray-900"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}

//         </div>
//       </div>

//       {/* Filters */}
//       <div className="mb-5 flex flex-wrap gap-3">

//         <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
//           <Filter size={16} />
//           Filters
//         </button>

//         <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
//           Payment
//           <ChevronDown size={15} />
//         </button>

//         <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
//           Date
//           <ChevronDown size={15} />
//         </button>

//       </div>

//       {/* Orders Table */}
//       <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[900px] text-left">

//             <thead className="border-b bg-gray-50">
//               <tr>
//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Order
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Customer
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Items
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Amount
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Payment
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Status
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Date
//                 </th>

//                 <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">

//               {filteredOrders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="transition hover:bg-gray-50"
//                 >

//                   {/* Order */}
//                   <td className="px-5 py-4">
//                     <p className="font-semibold text-gray-900">
//                       #{order._id.substring(order._id.length - 6)}
//                     </p>
//                   </td>

//                   {/* Customer */}
//                   <td className="px-5 py-4 flex gap-2 h-fit w-fit">
//                     <img src={order.user?.image} alt={order.name} className="h-8 w-8 rounded-full" />
//                     <p className="font-medium text-gray-900">
//                       {order.deliveryAddress?.fullName}
//                     </p>
//                   </td>

//                   {/* Items */}
//                   <td className="px-5 py-4 text-sm text-gray-600">
//                     {order.items.length} items
//                   </td>

//                   {/* Amount */}
//                   <td className="px-5 py-4 font-semibold text-gray-900">
//                     ₹{order.total}
//                   </td>

//                   {/* Payment */}
//                   <td className="px-5 py-4">
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-medium ${
//                         order.paymentStatus === "paid"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {order.paymentStatus === "paid" ? "Paid" : "pending"}
//                     </span>
//                   </td>

//                   {/* Status */}
//                   <td className="px-5 py-4">
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
//                         order.orderStatus
//                       )}`}
//                     >
//                       {order.orderStatus}
//                     </span>
//                   </td>

//                   {/* Date */}
//                   <td className="px-5 py-4 text-sm text-gray-500">
//                     {new Date(order.createdAt).toLocaleDateString('en-IN', {
//   day: '2-digit',
//   month: 'short',
//   year: 'numeric',
// })}
//                   </td>

//                   {/* Action */}
//                   <td className="px-5 py-4">

//                     <div className="flex relative  group items-center gap-2">

//                       <button
//                         className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-orange-500"
//                         title="View Order"
//                       >
//                         <Eye size={18} />
//                       </button>

//                       <button
                      
//                         className="rounded-lg p-2   text-gray-500 hover:bg-gray-100 h-fit w-fit"
//                         title="More"
//                       >
                        
//                         <MoreVertical size={18} />
//                       </button>

//                       <select value={cStatus} onChange={(e)=>onChangeHandler(e.target.value,order._id)}  name="" id="" className="w-fit h-fit outline-none border-2 border-black left-0 top-0 absolute hidden group-hover:flex bg-gray-500 text-black">
//                           <option value="select">Choose Status</option>
//                           {
//                             tabs.filter((item)=>item !== 'All').map((item,id)=><option key={id} value={item}>{item}</option>)
//                           }
//                         </select>

//                     </div>

//                   </td>

//                 </tr>
//               ))}

//             </tbody>

//           </table>
//         </div>

//         {/* Empty State */}
//         {filteredOrders.length === 0 && (
//           <div className="py-16 text-center">

//             <p className="font-medium text-gray-700">
//               No orders found
//             </p>

//             <p className="mt-1 text-sm text-gray-500">
//               There are no {activeTab.toLowerCase()} orders.
//             </p>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default OrderDetail;




import React, { useEffect, useState } from "react";
import { Search, Eye, MoreVertical, Filter, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../redux(state managemant)/slices/order.slice";
import useMsgHandler from "../../../utils/msgHandler";

const TABS = ["All", "placed", "preparing", "out_for_delivery", "delivered", "cancelled"];

// Must match TRANSITIONS on the backend
const NEXT = {
  placed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

const statusStyle = (status) => {
  switch (status) {
    case "placed":
      return "bg-yellow-100 text-yellow-700";
    case "preparing":
      return "bg-blue-100 text-blue-700";
    case "out_for_delivery":
      return "bg-orange-100 text-orange-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { oError, oSuccess, orders } = useSelector((state) => state.order);
  const [activeTab, setActiveTab] = useState("All");

  const onChangeHandler = async (status, id) => {
    if (!status || !id) return;
    try {
      await dispatch(updateOrderStatus({ orderStatus: status, orderId: id })).unwrap();
      dispatch(fetchOrders());
    } catch (e) {
      // error is already stored in oError by the slice
    }
  };

  useMsgHandler(oSuccess, oError);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === activeTab);

  return (
    <div className="min-h-screen bg-[#1a1a1a] !text-white p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold !text-white">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all customer orders</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 !text-white"
          />
          <input
            type="text"
            placeholder="Search order or customer..."
            className="w-full rounded-lg border bg-black py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 overflow-x-auto rounded-xl bg-[#333333]">
        <div className="flex min-w-max gap-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-4 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
          <Filter size={16} />
          Filters
        </button>
        <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
          Payment
          <ChevronDown size={15} />
        </button>
        <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-600">
          Date
          <ChevronDown size={15} />
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                {["Order", "Customer", "Items", "Amount", "Payment", "Status", "Date", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-xs font-semibold uppercase text-gray-500"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="transition hover:bg-gray-50">
                  {/* Order */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">
                      #{order._id.substring(order._id.length - 6)}
                    </p>
                  </td>

                  {/* Customer */}
                  <td className="px-5 py-4 flex gap-2 h-fit w-fit">
                    <img
                      src={order.user?.image}
                      alt={order.deliveryAddress?.fullName || "customer"}
                      className="h-8 w-8 rounded-full"
                    />
                    <p className="font-medium text-gray-900">
                      {order.deliveryAddress?.fullName}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.items.length} items
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4 font-semibold text-gray-900">₹{order.total}</td>

                  {/* Payment */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "Paid" : "pending"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <div className="flex relative group items-center gap-2">
                      <button
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-orange-500"
                        title="View Order"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 h-fit w-fit"
                        title="More"
                      >
                        <MoreVertical size={18} />
                      </button>

                      <select
                        value={order.orderStatus}
                        onChange={(e) => onChangeHandler(e.target.value, order._id)}
                        className="w-fit h-fit outline-none border-2 border-black left-0 top-0 absolute hidden group-hover:flex bg-gray-500 text-black"
                      >
                        {[order.orderStatus, ...(NEXT[order.orderStatus] || [])].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-medium text-gray-700">No orders found</p>
            <p className="mt-1 text-sm text-gray-500">
              There are no {activeTab.toLowerCase()} orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;