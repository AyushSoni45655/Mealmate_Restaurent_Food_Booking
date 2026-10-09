import React from "react";

const principles = [
    {
        title: "Plans should survive contact with a Tuesday.",
        body: "Swap a meal, push it a day, feed one more person — the plan bends instead of breaking.",
        size: "large",
    },
    {
        title: "Cooking is better shared.",
        body: "Plan a week with the people you actually eat with, not just yourself.",
        size: "small",
    },
    {
        title: "The list writes itself.",
        body: "Ingredients merge across meals automatically. No duplicate onions, no forgotten garlic.",
        size: "small",
    },
];

const steps = [
    {
        number: "01",
        title: "Plan the week",
        body: "Drag meals into days. Do it alone or hand a few days to whoever else is cooking.",
    },
    {
        number: "02",
        title: "Shop from one list",
        body: "Every ingredient from every planned meal, merged and organized by aisle — nothing duplicated.",
    },
    {
        number: "03",
        title: "Cook without guessing",
        body: "Steps, portions, and swaps stay open on your phone while your hands are busy with everything else.",
    },
];

const About = () => {
    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Fraunces:opsz,wght@9..144,400..600&display=swap');

                    .mm-about {
                        font-family: "Geist", sans-serif;
                        background: #F6F8F6;
                        color: #1F2937;
                    }
                    .mm-display {
                        font-family: "Fraunces", serif;
                        font-optical-sizing: auto;
                    }
                    @media (prefers-reduced-motion: no-preference) {
                        .mm-hero-in {
                            animation: mm-rise 0.7s ease-out both;
                        }
                        .mm-hero-in-delay {
                            animation: mm-rise 0.7s ease-out 0.12s both;
                        }
                    }
                    @keyframes mm-rise {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>

            <main className="mm-about">
                {/* Hero */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-8 items-center">
                    <div className="mm-hero-in">
                        <h1 className="mm-display text-[2.5rem] leading-[1.1] md:text-6xl md:leading-[1.08] font-medium text-[#0B4A43] max-w-[14ch]">
                            Eating well works better together.
                        </h1>
                        <p className="mt-6 text-base md:text-lg text-[#52616B] max-w-[42ch] leading-relaxed">
                            mealMate helps you plan meals, split the shopping, and actually
                            cook the thing you planned — with the people you eat with.
                        </p>
                        <a
                            href="/signup"
                            className="inline-flex items-center gap-2.5 mt-8 bg-[#0F766E] text-white text-sm font-medium pl-5 pr-2 py-2 rounded-full transition-colors hover:bg-[#0B4A43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]"
                        >
                            Get started
                            <span className="size-7 rounded-full bg-white flex items-center justify-center">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#0F766E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>

                    <div className="mm-hero-in-delay flex justify-center md:justify-end" aria-hidden="true">
                        <svg width="280" height="280" viewBox="0 0 280 280" className="w-56 h-56 md:w-72 md:h-72">
                            <circle cx="140" cy="150" r="118" fill="#E6F2F0" />
                            <circle cx="176" cy="108" r="34" fill="#F5B301" opacity="0.9" />
                            <g transform="translate(112,150) rotate(-22)">
                                <rect x="-9" y="-58" width="18" height="6" rx="2" fill="#0F766E" />
                                <rect x="-9" y="-52" width="7" height="30" rx="2" fill="#0F766E" />
                                <rect x="0" y="-52" width="7" height="30" rx="2" fill="#0F766E" />
                                <rect x="9" y="-52" width="7" height="30" rx="2" fill="#0F766E" />
                                <rect x="-4" y="-24" width="8" height="66" rx="4" fill="#0F766E" />
                            </g>
                            <g transform="translate(168,150) rotate(22)">
                                <ellipse cx="0" cy="-46" rx="16" ry="22" fill="#0B4A43" />
                                <rect x="-4" y="-24" width="8" height="66" rx="4" fill="#0B4A43" />
                            </g>
                        </svg>
                    </div>
                </section>

                {/* Story */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-20 border-t border-zinc-200">
                    <div className="max-w-[62ch]">
                        <h2 className="mm-display text-2xl md:text-3xl font-medium text-[#0B4A43]">
                            Why we built this
                        </h2>
                        <p className="mt-5 text-base md:text-[1.05rem] leading-relaxed text-[#3F4A50]">
                            Most meal planning apps assume you're feeding one person, alone,
                            forever. mealMate assumes something closer to the truth: you're
                            usually cooking for a house, a partner, a family, or friends who
                            just showed up — and the planning should reflect that.
                        </p>
                        <p className="mt-4 text-base md:text-[1.05rem] leading-relaxed text-[#3F4A50]">
                            So we built mealMate around shared plans, shared lists, and meals
                            that get made instead of just pinned to a board and forgotten.
                        </p>
                    </div>
                </section>

                {/* Principles */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-20 border-t border-zinc-200">
                    <h2 className="mm-display text-2xl md:text-3xl font-medium text-[#0B4A43] mb-10">
                        What we believe
                    </h2>
                    <div className="grid md:grid-cols-[1.3fr_1fr] gap-x-10 gap-y-10">
                        <div className="border-l-2 border-[#F5B301] pl-6 md:pl-8">
                            <p className="mm-display text-xl md:text-2xl font-medium text-[#0B4A43] leading-snug">
                                {principles[0].title}
                            </p>
                            <p className="mt-3 text-[#52616B] leading-relaxed max-w-[42ch]">
                                {principles[0].body}
                            </p>
                        </div>
                        <div className="flex flex-col gap-8">
                            {principles.slice(1).map((p) => (
                                <div key={p.title} className="border-l-2 border-[#0F766E]/30 pl-6">
                                    <p className="font-medium text-[#1F2937]">{p.title}</p>
                                    <p className="mt-2 text-sm text-[#6B7680] leading-relaxed max-w-[38ch]">
                                        {p.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-20 border-t border-zinc-200">
                    <h2 className="mm-display text-2xl md:text-3xl font-medium text-[#0B4A43] mb-10">
                        How mealMate works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10 md:gap-8">
                        {steps.map((step) => (
                            <div key={step.number}>
                                <span className="mm-display text-3xl text-[#F5B301] font-medium">
                                    {step.number}
                                </span>
                                <h3 className="mt-3 font-medium text-[#1F2937]">{step.title}</h3>
                                <p className="mt-2 text-sm text-[#6B7680] leading-relaxed max-w-[34ch]">
                                    {step.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Closing CTA */}
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 py-16 md:py-20 bg-[#0B4A43]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <h2 className="mm-display text-2xl md:text-3xl font-medium text-white max-w-[20ch]">
                            Ready to stop asking what's for dinner?
                        </h2>
                        <a
                            href="/signup"
                            className="inline-flex w-fit items-center gap-2.5 bg-[#F5B301] text-[#0B4A43] text-sm font-medium pl-5 pr-2 py-2 rounded-full transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Get started
                            <span className="size-7 rounded-full bg-[#0B4A43] flex items-center justify-center">
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#F5B301" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default About;