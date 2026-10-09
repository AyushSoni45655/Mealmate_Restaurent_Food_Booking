import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOutUser } from '../../redux(state managemant)/slices/user.slice'

/* ---------- helpers ---------- */
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-'

const daysSince = (date) =>
  date ? Math.max(0, Math.floor((Date.now() - new Date(date)) / 86400000)) : 0

/* ---------- tiny icon set (no dependency) ---------- */
const paths = {
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
  phone:
    'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
  copy: 'M9 9h11v11H9zM5 15V5h10',
  check: 'M5 13l4 4L19 7',
}

const Icon = ({ name, className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={paths[name]} />
  </svg>
)

/* ---------- small components ---------- */
const InfoRow = ({ icon, label, value, copyable }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50/60 transition">
      <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
        <Icon name={icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
        <p className="font-medium text-gray-800 truncate">{value}</p>
      </div>
      {copyable && (
        <button
          onClick={handleCopy}
          title="Copy"
          className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-100 opacity-0 group-hover:opacity-100 transition"
        >
          <Icon name={copied ? 'check' : 'copy'} className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

const StatCard = ({ icon, label, value, tone = 'orange' }) => {
  const tones = {
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
  }
  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 capitalize">{value}</p>
      </div>
    </div>
  )
}

const Skeleton = () => (
  
  <div className="max-w-4xl mx-auto p-4 md:p-6 animate-pulse">
    <div className="h-44 rounded-3xl bg-gray-200" />
    <div className="-mt-14 px-6">
      <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white" />
      <div className="h-6 w-48 bg-gray-200 rounded mt-4" />
      <div className="h-4 w-32 bg-gray-200 rounded mt-2" />
    </div>
  </div>
)

/* ---------- main page ---------- */
const User = () => {
  const dispatch = useDispatch();
  
  // Apne slice ke hisaab se path badal lena
  const { user, uLoading, uError,uSuccess } = useSelector((state) => state.user)
  const handleLogOut = ()=>{
    dispatch(logOutUser())
  }
  if (uLoading) return <Skeleton />

  if (uError) {
    return <p className="p-6 text-center text-red-600">{String(uError)}</p>
  }

  if (!user) {
    return <p className="p-6 text-center text-gray-500">No user data found</p>
  }

  const { name, userName, email, phone, image, role, isVerified, createdAt, updatedAt } = user

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* ===== Hero card ===== */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover */}
          <div className="relative h-44 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-white/10" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
              {/* Avatar */}
              <div className="relative w-fit">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-orange-100 text-orange-600 flex items-center justify-center text-4xl font-bold">
                    {name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                {isVerified && (
                  <span
                    title="Verified"
                    className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-green-500 text-white border-2 border-white flex items-center justify-center"
                  >
                    <Icon name="check" className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="flex-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{name}</h1>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700 capitalize">
                    {role}
                  </span>
                </div>
                <p className="text-gray-500">@{userName}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:pb-2">
                <div className="px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 active:scale-95 transition">
                  Edit Profile
                </div>
                <div onClick={handleLogOut} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 active:scale-95 transition">
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <StatCard
            icon="shield"
            label="Account Status"
            value={isVerified ? 'Verified' : 'Not verified'}
            tone={isVerified ? 'green' : 'orange'}
          />
          <StatCard icon="user" label="Account Type" value={role} tone="blue" />
          <StatCard
            icon="calendar"
            label="Member For"
            value={`${daysSince(createdAt)} days`}
            tone="orange"
          />
        </div>

        {/* ===== Details ===== */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            <h2 className="px-4 pt-4 pb-2 font-semibold text-gray-900">Contact Information</h2>
            <InfoRow icon="mail" label="Email" value={email} copyable />
            <InfoRow icon="phone" label="Phone" value={phone ? `+91 ${phone}` : '-'} copyable />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            <h2 className="px-4 pt-4 pb-2 font-semibold text-gray-900">Account Details</h2>
            <InfoRow icon="user" label="Username" value={`@${userName}`} copyable />
            <InfoRow icon="calendar" label="Joined On" value={formatDate(createdAt)} />
            <InfoRow icon="clock" label="Last Updated" value={formatDate(updatedAt)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default User