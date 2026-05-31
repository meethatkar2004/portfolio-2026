'use client';

import React, { useState } from 'react';
import Header from '../../commonComponents/Header/Header';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  /*
   
  // const texArr = [
  //   "Let’s create something people remember.",
  //   "Ready to build something impossible to ignore?",
  //   "Your brand deserves better than basic.",
  //   "Ready for a website that actually feels premium?",
  //   "Let’s build something the market hasn’t seen yet.",
  //   "Work with us if average isn’t your thing."
  // ]

  */

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = (field: string, value: string) => {
    if (!value) {
      setFocusedField(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate premium submit transition
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <Header
      title="Let's Create Impact"
      description="Have an idea, want to collaborate, or just want to discuss some creative web experiences? Shoot a message."
      className="w-full pt-16 pb-24 text-center"
      titleClass="text-white! text-[5vmax]"
      descClass="text-gray-300!"
    >
      <div className="w-full max-w-4xl mx-auto p-[3%] mt-12 text-left bg-yellow-700/5 rounded-2xl border border-yellow-300/10">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-16 text-center transition-all duration-500 ease-out">
            <div className="w-20 h-20 rounded-full border border-yellow-400/30 flex items-center justify-center mb-6 animate-pulse">
              <span className="text-4xl">🧿</span>
            </div>
            <h3 className="text-3xl font-heading text-white tracking-wider mb-2">MESSAGE SENT</h3>
            <p className="text-gray-400 font-medium text-sm md:text-base">
              Thank you for reaching out! I will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {/* Name input */}
              <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
                <label
                  htmlFor="name"
                  className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${focusedField === 'name' || formState.name
                    ? '-translate-y-8 text-sm text-yellow-500 font-bold uppercase tracking-wider'
                    : 'text-gray-400 font-semibold'
                    }`}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onFocus={() => handleFocus('name')}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  onChange={handleChange}
                  data-cursor="link"
                  className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium"
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${focusedField === 'name' ? 'w-full' : 'w-0'
                    }`}
                />
              </div>

              {/* Email input */}
              <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
                <label
                  htmlFor="email"
                  className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${focusedField === 'email' || formState.email
                    ? '-translate-y-8 text-sm text-yellow-500 font-bold uppercase tracking-wider'
                    : 'text-gray-400 font-semibold'
                    }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onFocus={() => handleFocus('email')}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  onChange={handleChange}
                  data-cursor="link"
                  className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium"
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${focusedField === 'email' ? 'w-full' : 'w-0'
                    }`}
                />
              </div>
            </div>

            {/* Subject input */}
            <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
              <label
                htmlFor="subject"
                className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${focusedField === 'subject' || formState.subject
                  ? '-translate-y-8 text-sm text-yellow-500 font-bold uppercase tracking-wider'
                  : 'text-gray-400 font-semibold'
                  }`}
              >
                What are you looking for? (e.g. Web Design, Three.js, Creative Development)
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formState.subject}
                onFocus={() => handleFocus('subject')}
                onBlur={(e) => handleBlur('subject', e.target.value)}
                onChange={handleChange}
                data-cursor="link"
                className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium"
              />
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${focusedField === 'subject' ? 'w-full' : 'w-0'
                  }`}
              />
            </div>

            {/* Message input */}
            <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
              <label
                htmlFor="message"
                className={`absolute left-0 top-1 text-lg transition-all duration-300 pointer-events-none ${focusedField === 'message' || formState.message
                  ? '-translate-y-8 text-sm text-yellow-500 font-bold uppercase tracking-wider'
                  : 'text-gray-400 font-semibold'
                  }`}
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formState.message}
                onFocus={() => handleFocus('message')}
                onBlur={(e) => handleBlur('message', e.target.value)}
                onChange={handleChange}
                data-cursor="link"
                className="w-full bg-transparent text-white border-none outline-hidden py-2 text-lg font-sans font-medium resize-none"
              />
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${focusedField === 'message' ? 'w-full' : 'w-0'
                  }`}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                data-cursor="link"
                className="relative overflow-hidden group border border-yellow-400/40 text-white hover:text-black font-heading tracking-widest uppercase font-bold text-xl px-12 py-5 rounded-full transition-colors duration-500 ease-out cursor-pointer"
              >
                <span className="absolute inset-0 bg-yellow-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                <span className="relative z-10">SEND MESSAGE</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Header>
  );
}