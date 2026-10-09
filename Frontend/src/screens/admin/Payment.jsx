



import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  MoreVertical,
  Filter,
  ChevronDown,
  CreditCard,
  CircleDollarSign,
  Clock3,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useMsgHandler from "../../../utils/msgHandler";
import { useSelector,useDispatch } from "react-redux";
import { fetchOrders } from "../../redux(state managemant)/slices/order.slice";
import { data } from "react-router-dom";
const paymentStatus = ['pending', 'paid', 'failed', 'refunded'];
paymentStatus.unshift('All')
const Payment = () => {
  const dispatch = useDispatch();
  const {oSuccess,oError,oLoading,orders} = useSelector((state)=>state.order);
  const [activeTab, setActiveTab] = useState("All");

  // Temporary payment data
  // Later replace with API data
  // const payments = [
  //   {
  //     id: "TXN10245",
  //     orderId: "#MM10245",
  //     customer: "Rahul Sharma",
  //     amount: 846,
  //     method: "UPI",
  //     status: "Successful",
  //     date: "21 Sep 2026",
  //     time: "08:45 PM",
  //   },
  //   {
  //     id: "TXN10244",
  //     orderId: "#MM10244",
  //     customer: "Amit Kumar",
  //     amount: 540,
  //     method: "Card",
  //     status: "Successful",
  //     date: "21 Sep 2026",
  //     time: "07:30 PM",
  //   },
  //   {
  //     id: "TXN10243",
  //     orderId: "#MM10243",
  //     customer: "Priya Singh",
  //     amount: 1250,
  //     method: "UPI",
  //     status: "Pending",
  //     date: "20 Sep 2026",
  //     time: "09:15 PM",
  //   },
  //   {
  //     id: "TXN10242",
  //     orderId: "#MM10242",
  //     customer: "Rohit Verma",
  //     amount: 320,
  //     method: "Cash",
  //     status: "Refunded",
  //     date: "20 Sep 2026",
  //     time: "06:20 PM",
  //   },
  //   {
  //     id: "TXN10241",
  //     orderId: "#MM10241",
  //     customer: "Neha Gupta",
  //     amount: 672,
  //     method: "UPI",
  //     status: "Failed",
  //     date: "19 Sep 2026",
  //     time: "08:10 PM",
  //   },
  // ];

  function formatDate(date,time) {
    if(time){
       return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    
  }).replace(/ /g, "/");
    }
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, "/");
}

  const tabs = [
    "All",
    "Successful",
    "Pending",
    "Refunded",
    "Failed",
  ];



  const filteredPayments =
    activeTab === "All"
      ? orders
      : orders.filter((payment) => payment.paymentStatus  === activeTab);

  const statusStyle = (status) => {
    switch (status) {
      case "paid":
        return "border border-green-500/20 bg-green-500/10 text-green-400";

      case "pending":
        return "border border-yellow-500/20 bg-yellow-500/10 text-yellow-400";

      case "refunded":
        return "border border-blue-500/20 bg-blue-500/10 text-blue-400";

      case "failed":
        return "border border-red-500/20 bg-red-500/10 text-red-400";

      default:
        return "border border-gray-500/20 bg-gray-500/10 text-gray-400";
    }
  };

  useMsgHandler(oSuccess,oError);
  useEffect(()=>{
    dispatch(fetchOrders());
  },[dispatch])
  console.log('trsnasaction orders',orders);
   const sumBy = (statuses) =>
  orders
    .filter((o) => statuses.includes(o.paymentStatus))
    .reduce((sum, o) => sum + Number(o.itemTotal), 0);

const countBy = (statuses) =>
  orders.filter((o) => statuses.includes(o.paymentStatus)).length;

const stats = [
  {
    name: 'Total Revenue',
    id: 'dkjwij938y9ifhiq29u89u3',
    icon: CircleDollarSign,
    data: sumBy(['paid', 'pending']),
    sData: countBy(['paid', 'pending']),
  },
  {
    name: 'Successful Payments',
    id: 'mxkskj39ur938748y99y99',
    icon: CheckCircle2,
    data: sumBy(['paid']),
    sData: countBy(['paid']),
  },
  {
    name: 'Pending Payments',
    id: 'bvnjdiiei9388eu8ukwkid',
    icon: Clock3,
    data: sumBy(['pending']),
    sData: countBy(['pending']),
  },
  {
    name: 'Refunded',
    id: 'alksjeiu3idnsjdejejdnjs',
    icon: RotateCcw,
    data: sumBy(['refunded']),
    sData: countBy(['refunded']),
  },
];
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 text-white sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Track and manage all payment transactions
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            placeholder="Search transaction or order..."
            className="w-full rounded-lg border border-[#333] bg-[#242424] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-orange-500"
          />

        </div>

      </div>

      {/* =====================================================
          PAYMENT STATS
      ====================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item)=>{
          const Icon = item.icon;
          return ( <div key={item.id} className="rounded-xl border border-[#333] bg-[#242424] p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                {item.name}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {`₹ ${item.data}`}
              </h2>

              <p className="mt-1 text-xs text-green-400">
                {item.sData}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Icon size={21} />
            </div>

          </div>

        </div>)
        })}

      

      </div>

      {/* =====================================================
          PAYMENT TABS
      ====================================================== */}
      <div className="mb-5 overflow-x-auto rounded-xl border border-[#333] bg-[#242424]">

        <div className="flex min-w-max gap-4">

          {
          
          paymentStatus.map((tab) => (

            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.toUpperCase()}
            </div>

          ))}

        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="mb-5 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          <Filter size={16} />
          Filters
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          Payment Method
          <ChevronDown size={15} />
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          Date
          <ChevronDown size={15} />
        </div>

      </div>

      {/* =====================================================
          PAYMENT TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-xl border border-[#333] bg-[#242424] shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            {/* HEADER */}
            <thead className="border-b border-[#333] bg-[#202020]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Transaction
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Order
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Amount
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Method
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Date
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Action
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-[#333]">

              {filteredPayments.map((payment) => (

                <tr
                  key={payment._id}
                  className="transition hover:bg-[#2d2d2d]"
                >

                  {/* TRANSACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                        <CreditCard size={17} />
                      </div>

                      <div>

                        <p className="font-medium text-white">
                          {payment.razorpay?.paymentId}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Transaction ID
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* ORDER */}
                  <td className="px-5 py-4">

                    <p className="font-medium text-gray-300">
                      {payment.razorpay?.orderId}
                    </p>

                  </td>

                  {/* CUSTOMER */}
                  <td className="px-5 py-4">

                    <p className="font-medium text-gray-200">
                      {payment.deliveryAddress?.fullName}
                    </p>

                  </td>

                  {/* AMOUNT */}
                  <td className="px-5 py-4">

                    <p className="font-semibold text-white">
                      ₹{payment.itemTotal?.toLocaleString("en-IN")}
                    </p>

                  </td>

                  {/* METHOD */}
                  <td className="px-5 py-4">

                    <span className="text-sm text-gray-400">
                      {payment.paymentMethod}
                    </span>

                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                        payment.paymentStatus

                      )}`}
                    >
                      {payment.paymentStatus
}
                    </span>

                  </td>

                  {/* DATE */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-gray-400">
                      {formatDate(payment.createdAt,"")}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                      {formatDate(payment.createdAt, 'time')}
                    </p>

                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-[#333] hover:text-orange-500"
                        title="View Payment"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-[#333] hover:text-white"
                        title="More Actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {filteredPayments.length === 0 && (

          <div className="py-16 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#333] text-gray-500">
              <CreditCard size={22} />
            </div>

            <p className="font-medium text-gray-300">
              No payments found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              There are no {activeTab.toLowerCase()} payments.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-gray-500">
          Showing 1–5 of 1,248 transactions
        </p>

        <div className="flex items-center gap-2">

          <button className="rounded-lg border border-[#333] bg-[#242424] px-4 py-2 text-sm text-gray-500 transition hover:bg-[#2d2d2d] hover:text-white">
            Previous
          </button>

          <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white">
            1
          </button>

          <button className="rounded-lg border border-[#333] bg-[#242424] px-4 py-2 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
            2
          </button>

          <button className="rounded-lg border border-[#333] bg-[#242424] px-4 py-2 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
            3
          </button>

          <button className="rounded-lg border border-[#333] bg-[#242424] px-4 py-2 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default Payment;

