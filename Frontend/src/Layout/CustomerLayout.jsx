import React, { Suspense } from "react";
import Header from "./comman-componant/Header";
import Footer from "./comman-componant/Footer";
import { NavLink, Outlet } from "react-router-dom";
import { navigations } from "../assets/assets";

const CustomerLayout = () => {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col">

            {/* ================= HEADER ================= */}
            <Header />


            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 pb-20 md:pb-0">
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>


            {/* ================= FOOTER ================= */}
            <Footer />


            {/* ================= MOBILE BOTTOM NAV ================= */}
            <nav
                className="
                    fixed bottom-0 left-0 right-0 z-50
                    flex md:hidden
                    items-center justify-around
                    border-t border-zinc-200
                    bg-white/95
                    px-2 py-2
                    backdrop-blur-xl
                    shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
                "
            >

                {navigations.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `
                                group flex min-w-[64px]
                                flex-col items-center
                                justify-center gap-1
                                rounded-xl px-3 py-2
                                text-[11px] font-medium
                                transition-all duration-200
                                ${
                                    isActive
                                        ? "bg-zinc-900 text-white"
                                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                }
                                `
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon
                                        className={`
                                            h-5 w-5
                                            transition-transform duration-200
                                            ${
                                                isActive
                                                    ? "scale-105"
                                                    : "group-hover:scale-105"
                                            }
                                        `}
                                    />

                                    <span>
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    );
                })}

            </nav>

        </div>
    );
};

export default CustomerLayout;

