
import React, { useState } from "react";
import { ImSearch } from "react-icons/im";
import { CgMenuRight } from "react-icons/cg";
import { FaCoffee, FaHamburger, FaUtensils, FaCookie, FaLeaf } from "react-icons/fa";

const categories = [
    { name: "Breakfast", icon: FaCoffee },
    { name: "Lunch", icon: FaHamburger },
    { name: "Dinner", icon: FaUtensils },
    { name: "Desserts", icon: FaCookie },
    { name: "Healthy", icon: FaLeaf },
];

const featuredMeal = {
    name: "Grilled Salmon Bowl",
    tag: "Today's pick",
    body: "Seared salmon, charred greens, and a citrus dressing — on the table in under 25 minutes.",
};

const standardMeals = [
    { name: "Veggie Buddha Bowl", tag: "Vegan" },
    { name: "Classic Margherita", tag: "Chef's pick" },
    { name: "Spiced Chickpea Wrap", tag: "Quick, 15 min" },
];

const steps = [
    { number: "01", title: "Search", body: "Find meals by ingredient, cuisine, or how much time you've got." },
    { number: "02", title: "Pick", body: "Save the ones worth making — build a list as you browse." },
    { number: "03", title: "Enjoy", body: "Cook it yourself or send the list to whoever's cooking tonight." },
];

const LandingPage = () => {
    const [query, setQuery] = useState("");

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Fraunces:opsz,wght@9..144,400..600&display=swap');

                .mm-landing {
                    font-family: "Geist", sans-serif;
                    background: #F6F8F6;
                    color: #1F2937;
                }
                .mm-display {
                    font-family: "Fraunces", serif;
                    font-optical-sizing: auto;
                }
                @media (prefers-reduced-motion: no-preference) {
                    .mm-rise { animation: mm-rise 0.7s ease-out both; }
                    .mm-rise-delay { animation: mm-rise 0.7s ease-out 0.15s both; }
                }
                @keyframes mm-rise {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="mm-landing w-full">
                {/* ================= HERO ================= */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 pt-16 pb-20 md:pt-20 md:pb-28 grid md:grid-cols-[1.05fr_0.95fr] gap-14 md:gap-10 items-center">
                    <div className="mm-rise">
                        <h1 className="mm-display text-[2.75rem] leading-[1.08] sm:text-6xl md:text-7xl md:leading-[1.05] font-medium tracking-tight text-[#0B4A43] max-w-[13ch]">
                            Let's eat quality food.
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-[#52616B] max-w-[42ch] leading-relaxed">
                            Search thousands of meals, save the ones worth making, and
                            find something worth cooking tonight.
                        </p>

                        {/* Search bar */}
                        <div className="w-full max-w-lg mt-9">
                            <div className="h-14 rounded-full border border-zinc-200 bg-white shadow-sm flex items-center pl-5 pr-1.5 focus-within:border-[#0F766E]/40 focus-within:shadow-md transition-all">
                                <ImSearch className="h-4 w-4 text-zinc-400 shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search your food here"
                                    className="flex-1 h-full pl-3 outline-none border-none bg-transparent text-sm font-medium text-[#1F2937] placeholder:text-zinc-400 placeholder:font-normal"
                                />
                                <button
                                    type="button"
                                    aria-label="Filters"
                                    className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center bg-[#F5B301] text-[#0B4A43] transition-transform hover:scale-105"
                                >
                                    <CgMenuRight className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap items-center gap-2.5 mt-5">
                                {categories.map(({ name, icon: Icon }) => (
                                    <button
                                        key={name}
                                        type="button"
                                        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white pl-3.5 pr-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-[#0F766E]/30 hover:text-[#0B4A43]"
                                    >
                                        <Icon className="h-3.5 w-3.5" />
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Floating meal-card collage */}
                    <div className="mm-rise-delay relative h-[340px] md:h-[420px]" aria-hidden="true">
                        <div className="absolute inset-0 m-auto w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full bg-[#E6F2F0]" />

                        <div className="absolute top-6 left-2 md:left-6 w-48 rounded-2xl bg-white shadow-lg p-4 -rotate-6">
                            <div className="h-20 rounded-xl bg-[#E6F2F0] flex items-center justify-center">
                                <FaUtensils className="h-6 w-6 text-[#0F766E]/40" />
                            </div>
                            <p className="mt-3 text-xs font-medium text-[#0F766E]">Chef's pick</p>
                            <p className="text-sm font-medium text-[#1F2937]">Grilled Salmon Bowl</p>
                        </div>

                        <div className="absolute bottom-4 right-2 md:right-4 w-44 rounded-2xl bg-white shadow-lg p-4 rotate-6">
                            <div className="h-16 rounded-xl bg-[#FDF3D8] flex items-center justify-center">
                                <FaLeaf className="h-5 w-5 text-[#F5B301]" />
                            </div>
                            <p className="mt-3 text-xs font-medium text-[#F5B301]">Vegan</p>
                            <p className="text-sm font-medium text-[#1F2937]">Buddha Bowl</p>
                        </div>

                        <div className="absolute top-1/2 right-6 md:right-0 -translate-y-1/2 rotate-3 rounded-2xl bg-[#0B4A43] shadow-lg px-4 py-3">
                            <p className="text-[11px] font-medium text-white/60">Tonight's plan</p>
                            <p className="text-sm font-medium text-white">3 meals ready</p>
                        </div>
                    </div>
                </section>

                {/* ================= FEATURED MEALS ================= */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-20 border-t border-zinc-200">
                    <h2 className="mm-display text-2xl md:text-3xl font-medium text-[#0B4A43] mb-10">
                        Worth cooking tonight
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Featured, larger card */}
                        <div className="lg:col-span-2 rounded-2xl bg-white border border-zinc-200 overflow-hidden flex flex-col sm:flex-row">
                            <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto bg-[#E6F2F0] flex items-center justify-center">
                                <FaUtensils className="h-10 w-10 text-[#0F766E]/40" />
                            </div>
                            <div className="p-6 flex flex-col justify-center">
                                <p className="text-xs font-medium text-[#F5B301]">{featuredMeal.tag}</p>
                                <p className="mt-2 mm-display text-xl font-medium text-[#0B4A43]">
                                    {featuredMeal.name}
                                </p>
                                <p className="mt-2 text-sm text-[#6B7680] leading-relaxed max-w-[36ch]">
                                    {featuredMeal.body}
                                </p>
                            </div>
                        </div>

                        {/* Standard cards */}
                        <div className="flex flex-col gap-4">
                            {standardMeals.map((meal) => (
                                <div
                                    key={meal.name}
                                    className="rounded-2xl bg-white border border-zinc-200 flex items-center gap-4 p-4"
                                >
                                    <div className="h-16 w-16 shrink-0 rounded-xl bg-[#E6F2F0] flex items-center justify-center">
                                        <FaUtensils className="h-5 w-5 text-[#0F766E]/40" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#0F766E]">{meal.tag}</p>
                                        <p className="text-sm font-medium text-[#1F2937]">{meal.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

               


               

               
            </div>
        </>
    );
};

export default LandingPage;