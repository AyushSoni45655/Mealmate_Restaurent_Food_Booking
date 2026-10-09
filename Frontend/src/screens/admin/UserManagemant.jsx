



import React, { useEffect, useState } from "react";
import {
  Search,
  Eye,
  MoreVertical,
  Filter,
  ChevronDown,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {useDispatch,useSelector} from 'react-redux';
import useMsgHandler from '../../../utils/msgHandler'
import { getAllUsers } from "../../redux(state managemant)/slices/user.slice";

const UserManagemant = () => {
  const dispatch = useDispatch();

  const {users,uSuccess,uError,uLoading} = useSelector((state)=>state.user);
  const [activeTab, setActiveTab] = useState("All");



  const tabs = ["All", "Active", "Blocked"];

  const filteredUsers =
    activeTab === "All"
      ? users
      : users.filter((user) => user.status === activeTab);

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, "/");
}

  const statusStyle = (status) => {
    switch (status) {
      case status === true:
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case status === false:
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };


  // api to get the all users and manage the state
  useMsgHandler(uSuccess,uError);
  useEffect(()=>{
    dispatch(getAllUsers())
  },[dispatch])


  

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 text-white sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            User Management
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Manage and monitor all MealMate customers
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
            placeholder="Search user..."
            className="w-full rounded-lg border border-[#333] bg-[#242424] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-orange-500"
          />

        </div>

      </div>

      {/* =====================================================
          STATS
      ====================================================== */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Users */}
        <div className="rounded-xl border border-[#333] bg-[#242424] p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Total Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                1,248
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Users size={21} />
            </div>

          </div>

        </div>

        {/* Active Users */}
        <div className="rounded-xl border border-[#333] bg-[#242424] p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Active Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                1,182
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
              <UserCheck size={21} />
            </div>

          </div>

        </div>

        {/* Blocked Users */}
        <div className="rounded-xl border border-[#333] bg-[#242424] p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Blocked Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                66
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <UserX size={21} />
            </div>

          </div>

        </div>

        {/* New Users */}
        <div className="rounded-xl border border-[#333] bg-[#242424] p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                New This Month
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                86
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Users size={21} />
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          TABS
      ====================================================== */}
      <div className="mb-5 overflow-x-auto rounded-xl border border-[#333] bg-[#242424]">

        <div className="flex min-w-max gap-4">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}
      <div className="mb-5 flex flex-wrap gap-3">

        <button className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          <Filter size={16} />
          Filters
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          Joined Date
          <ChevronDown size={15} />
        </button>

        <button className="flex items-center gap-2 rounded-lg border border-[#333] bg-[#242424] px-4 py-2.5 text-sm text-gray-400 transition hover:bg-[#2d2d2d] hover:text-white">
          Orders
          <ChevronDown size={15} />
        </button>

      </div>

      {/* =====================================================
          USERS TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-xl border border-[#333] bg-[#242424] shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px] text-left">

            {/* TABLE HEADER */}
            <thead className="border-b border-[#333] bg-[#202020]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  User
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Contact
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Orders
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Total Spent
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Joined
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Action
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-[#333]">

              {filteredUsers.map((user,id) => (

                <tr
                  key={user.id}
                  className="transition hover:bg-[#2d2d2d]"
                >

                  {/* USER */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 font-semibold text-orange-500">
                        {user.name.charAt(0)}
                      </div>

                      <div>

                        <p className="font-medium text-white">
                          {user.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {`USR00${id + 1}`}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CONTACT */}
                  <td className="px-5 py-4">

                    <p className="text-sm text-gray-300">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {user.phone}
                    </p>

                  </td>

                  {/* ORDERS */}
                  <td className="px-5 py-4">

                    <span className="font-medium text-gray-200">
                      12
                    </span>

                    <span className="ml-1 text-sm text-gray-500">
                      orders
                    </span>

                  </td>

                  {/* TOTAL SPENT */}
                  <td className="px-5 py-4 font-semibold text-gray-200">
                    ₹{'5600'.toLocaleString("en-IN")}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                        user.isActive
                      )}`}
                    >
                      {user.isActive ? 'Active':"Block"}
                    </span>

                  </td>

                  {/* JOINED */}
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1">

                      <button
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-[#333] hover:text-orange-500"
                        title="View User"
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
        {filteredUsers.length === 0 && (

          <div className="py-16 text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#333] text-gray-500">
              <Users size={22} />
            </div>

            <p className="font-medium text-gray-300">
              No users found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              There are no {activeTab.toLowerCase()} users.
            </p>

          </div>

        )}

      </div>

      {/* =====================================================
          PAGINATION
      ====================================================== */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-gray-500">
          Showing 1–5 of 1,248 users
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

export default UserManagemant
