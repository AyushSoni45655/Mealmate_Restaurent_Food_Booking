

import React from "react";
import { navigations, assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { headerButton } from "../../assets/assets";

const Header = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Fraunces:opsz,wght@9..144,400..600&display=swap');

                .mm-header {
                    font-family: "Geist", sans-serif;
                }
                .mm-display {
                    font-family: "Fraunces", serif;
                    font-optical-sizing: auto;
                }
            `}</style>

            <nav className="mm-header sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">

                    {/* ================= LOGO ================= */}
                    <NavLink
                        to="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-[#E6F2F0] shadow-sm ring-1 ring-[#0F766E]/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                            <img
                                src={assets.mealmate}
                                alt="MealMate"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="hidden sm:block">
                            <h1 className="mm-display text-lg font-medium tracking-tight text-[#0B4A43]">
                                meal<span className="text-[#F5B301]">Mate</span>
                            </h1>

                            <p className="text-[11px] font-medium text-zinc-400 tracking-wide">
                                Eat smart. Together.
                            </p>
                        </div>
                    </NavLink>


                    {/* ================= DESKTOP NAV ================= */}
                    <div className="hidden md:flex items-center rounded-full border border-zinc-200 bg-zinc-50/80 p-1 shadow-sm">

                        {navigations.map((item) => (
                            <NavLink
                                to={item.path}
                                key={item.id}
                                className={({ isActive }) =>
                                    `
                                    rounded-full px-5 py-2 text-sm font-medium
                                    transition-all duration-200
                                    ${
                                        isActive
                                            ? "bg-[#F5B301] text-[#0B4A43] shadow-sm"
                                            : "text-zinc-500 hover:bg-white/70 hover:text-[#0B4A43]"
                                    }
                                    `
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}

                    </div>


                    {/* ================= RIGHT ACTIONS ================= */}
                    <div className="flex items-center gap-2">

                        {headerButton.map((item)=>{
                          const Icon = item.icon;
                          return (<NavLink to={`${item.path}`}><div key={item.id} className="h-fit shadow w-fit p-2 rounded-full"><Icon className="text-yellow-300 h-6 w-6"/></div></NavLink>)
                        })}

                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;