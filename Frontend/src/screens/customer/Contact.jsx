import React, { useState } from "react";

const initialForm = { name: "", email: "", message: "" };

const Contact = () => {
    const [form, setForm] = useState(initialForm);
    const [sent, setSent] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Wire this up to your actual backend / email service.
        console.log("Contact form submitted:", form);
        setSent(true);
        setForm(initialForm);
    };

    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Fraunces:opsz,wght@9..144,400..600&display=swap');

                    .mm-contact {
                        font-family: "Geist", sans-serif;
                        background: #F6F8F6;
                        color: #1F2937;
                    }
                    .mm-display {
                        font-family: "Fraunces", serif;
                        font-optical-sizing: auto;
                    }
                    .mm-field {
                        width: 100%;
                        background: #ffffff;
                        border: 1px solid #D7DEDC;
                        border-radius: 0.75rem;
                        padding: 0.75rem 1rem;
                        font-size: 0.95rem;
                        color: #1F2937;
                        transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
                    }
                    .mm-field::placeholder {
                        color: #9AA5A2;
                    }
                    .mm-field:focus {
                        outline: none;
                        border-color: #0F766E;
                        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
                    }
                `}
            </style>

            <main className="mm-contact">
                <section className="px-6 md:px-12 lg:px-24 xl:px-40 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[0.95fr_1.05fr] gap-14 md:gap-16">
                    {/* Left: intro + direct info */}
                    <div>
                        <h1 className="mm-display text-[2.25rem] leading-[1.1] md:text-5xl md:leading-[1.1] font-medium text-[#0B4A43] max-w-[14ch]">
                            Talk to us.
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-[#52616B] max-w-[36ch] leading-relaxed">
                            Question about your plan, a bug, or an idea for what mealMate
                            should do next — this goes straight to the team, not a queue.
                        </p>

                        <div className="mt-10 flex flex-col gap-6 border-t border-zinc-200 pt-8">
                            <div>
                                <p className="text-xs font-medium text-[#6B7680] uppercase tracking-wide">Email</p>
                                <a href="mailto:hello@mealmate.app" className="mt-1 inline-block font-medium text-[#0B4A43] hover:text-[#0F766E]">
                                    hello@mealmate.app
                                </a>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#6B7680] uppercase tracking-wide">Response time</p>
                                <p className="mt-1 text-[#1F2937]">Usually within a day, most days sooner.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm">
                        {sent ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="size-12 rounded-full bg-[#E6F2F0] flex items-center justify-center">
                                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 8.5 7 14 19 1" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <p className="mt-4 mm-display text-xl font-medium text-[#0B4A43]">Message sent</p>
                                <p className="mt-2 text-sm text-[#6B7680] max-w-[30ch]">
                                    Thanks — we'll get back to you at the email you gave us.
                                </p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-6 text-sm font-medium text-[#0F766E] hover:text-[#0B4A43] bg-transparent border-0 cursor-pointer"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="mm-field"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        className="mm-field"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-[#1F2937] mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="What's on your mind?"
                                        className="mm-field resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-2 inline-flex items-center justify-center gap-2.5 bg-[#0F766E] text-white text-sm font-medium pl-5 pr-2 py-2 rounded-full transition-colors hover:bg-[#0B4A43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] self-start"
                                >
                                    Send message
                                    <span className="size-7 rounded-full bg-white flex items-center justify-center">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M.6 4.602h10m-4-4 4 4-4 4" stroke="#0F766E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Contact;