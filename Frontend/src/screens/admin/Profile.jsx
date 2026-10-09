import React, { useState } from "react";
import { GoSignOut } from "react-icons/go";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Edit3,
  Save,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  CalendarDays,
  Mail,
  Phone,
  User,
  KeyRound,
  Users,
  ShoppingBag,
  CreditCard,
  Store,
  BarChart3,
} from "lucide-react";
import useMsgHandler from '../../../utils/msgHandler'
import {useSelector , useDispatch} from 'react-redux';
import { logOutUser } from "../../redux(state managemant)/slices/user.slice";


const Profile = () => {

  const dispatch = useDispatch();

  const {uSuccess,uError,uLoading} = useSelector((state)=>state.user);

  useMsgHandler(uSuccess,uError);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Your actual admin data
  const [admin, setAdmin] = useState({
    _id: "6aa83934c94ab8e4d7bac3f6",
    name: "Ayush Soni Admin",
    userName: "ayushsoni45655",
    email: "ayush.soni84080@gmail.com",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIVg0Rtv20y5SaDVzqDfKE2KCNVDBJWC_p0Zx43Rwzlw&s",
    role: "admin",
    isVerified: false,
    createdAt: "2026-09-14T18:13:08.965Z",
    updatedAt: "2026-09-20T16:10:14.340Z",
  });


  const handlerLogout = ()=>{
  dispatch(logOutUser())
}
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);

    // Later:
    // dispatch(updateAdminProfile(admin))
  };

  if(uLoading){
    return (<div className="w-screen h-screen bg-[#1a1a1a] text-white flex flex-col gap-4 loader"></div>)
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Profile</h1>

          <p className="text-gray-400 mt-1">
            Manage your account information and security settings
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-medium"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-medium"
          >
            <Save size={18} />
            Save Changes
          </button>
        )}
      </div>

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-[#242424] border border-[#333] rounded-2xl overflow-hidden mb-6">
        {/* Banner */}
        <div className="h-32 md:h-40 bg-gradient-to-r from-orange-500/30 via-orange-400/10 to-transparent relative"></div>

        {/* Profile Info */}
        <div className="px-5 md:px-8 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-14">
            {/* Avatar */}
            <div className="relative w-fit">
              <img
                src={admin.image}
                alt={admin.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#242424] bg-[#333]"
              />

              {isEditing && (
                <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center border-4 border-[#242424]">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">{admin.name}</h2>

                <span className="px-3 py-1 text-xs rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20">
                  Administrator
                </span>
              </div>

              <p className="text-gray-400 mt-1">@{admin.userName}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Mail size={15} />
                  {admin.email}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  Joined {formatDate(admin.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ================= PERSONAL INFORMATION ================= */}
        <div className="xl:col-span-2 bg-[#242424] border border-[#333] rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <User className="text-orange-400" size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Personal Information</h3>

              <p className="text-sm text-gray-400">Your account details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  name="name"
                  value={admin.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Username
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  @
                </span>

                <input
                  type="text"
                  value={admin.userName}
                  disabled
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 pl-9 pr-4 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  value={admin.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 pl-10 pr-4 outline-none focus:border-orange-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  value="Administrator"
                  disabled
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* User ID */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Admin ID
              </label>

              <input
                type="text"
                value={admin._id}
                disabled
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 px-4 text-gray-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* ================= ACCOUNT STATUS ================= */}
        <div className="bg-[#242424] border border-[#333] rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <ShieldCheck className="text-orange-400" size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Account Status</h3>

              <p className="text-sm text-gray-400">Current account state</p>
            </div>
          </div>

          {/* Account Active */}
          <div className="flex items-center justify-between py-4 border-b border-[#333]">
            <div>
              <p className="font-medium">Account Status</p>

              <p className="text-xs text-gray-500 mt-1">
                Your admin account is active
              </p>
            </div>

            <span className="flex items-center gap-1.5 text-green-400 text-sm">
              <CheckCircle2 size={17} />
              Active
            </span>
          </div>

          {/* Email Verification */}
          <div className="flex items-center justify-between py-4 border-b border-[#333]">
            <div>
              <p className="font-medium">Email Verification</p>

              <p className="text-xs text-gray-500 mt-1">
                {admin.isVerified
                  ? "Your email is verified"
                  : "Your email is not verified"}
              </p>
            </div>

            {admin.isVerified ? (
              <span className="flex items-center gap-1.5 text-green-400 text-sm">
                <CheckCircle2 size={17} />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-red-400 text-sm">
                <XCircle size={17} />
                Not Verified
              </span>
            )}
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium">Account Role</p>

              <p className="text-xs text-gray-500 mt-1">Access level</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium">
              ADMIN
            </span>
          </div>
        </div>

        {/* ================= SECURITY ================= */}
        <div className="xl:col-span-2 relative bg-[#242424] border  border-[#333] rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Lock className="text-orange-400" size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Security</h3>

              <p className="text-sm text-gray-400">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">
                Password
              </label>

              <div className="relative">
                <KeyRound
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value="********"
                  readOnly
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-3 pl-10 pr-12 outline-none"
                />

                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#444] hover:bg-[#2d2d2d] transition">
              <Lock size={17} />
              Change Password
            </button>
          </div>
          <button onClick={handlerLogout} className="flex  items-center absolute bottom-3 left-0  justify-center w-full gap-2 px-5 py-3 rounded-lg border border-[#444] hover:bg-[#2d2d2d] transition">
            <GoSignOut size={17} />
            Log Out
          </button>
        </div>

        {/* ================= ADMIN PERMISSIONS ================= */}
        <div className="bg-[#242424] border border-[#333] rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <ShieldCheck className="text-orange-400" size={20} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Admin Permissions</h3>

              <p className="text-sm text-gray-400">Your access permissions</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                label: "Manage Orders",
                icon: ShoppingBag,
              },
              {
                label: "Manage Users",
                icon: Users,
              },
              {
                label: "Manage Payments",
                icon: CreditCard,
              },
              {
                label: "Manage Restaurants",
                icon: Store,
              },
              {
                label: "View Analytics",
                icon: BarChart3,
              },
            ].map((permission) => {
              const Icon = permission.icon;

              return (
                <div
                  key={permission.label}
                  className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-[#2d2d2d] transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} className="text-gray-400" />

                    <span className="text-sm">{permission.label}</span>
                  </div>

                  <CheckCircle2 size={17} className="text-green-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= FOOTER INFO ================= */}
      <div className="mt-6 bg-[#242424] border border-[#333] rounded-xl px-5 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm">
          <p className="text-gray-500">
            Admin ID: <span className="text-gray-400">{admin._id}</span>
          </p>

          <p className="text-gray-500">
            Last updated:{" "}
            <span className="text-gray-400">{formatDate(admin.updatedAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
