'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Header from '../../commonComponents/Header/Header';
import { sendEmail } from '../../actions/sendEmail';

// 1. Move static data outside the component to prevent recreation on every render
const textArr = [
  "Let’s create something people remember.",
  "Ready to build something impossible to ignore?",
  "Your brand deserves better than basic.",
  "Ready for a website that actually feels premium?",
  "Let’s build something the market hasn’t seen yet.",
  "Work with us if average isn’t your thing.",
  "Have an idea, want to collaborate, or just want to discuss some creative web experiences? Shoot a message."
];

// 2. Move utility hook outside the component body
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// 3. ISOLATE rapid re-renders. Only this tiny span updates and triggers transitions.
// Also includes IntersectionObserver to run animations ONLY when in the viewport.
const ScramblingText = ({ texts }: { texts: string[] }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(texts[0]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  // Setup Intersection Observer to only animate when visible in the viewport
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 } // triggers when 10% of the element is visible
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  const scrambleText = (newText: string) => {
    const chars = '!@#$%^&*()_+{}:"<>?,./;[]\\-';
    const scrambleDuration = 1000; // 1 second
    const intervalTime = 30; // 30ms per frame (~33fps)
    const totalFrames = scrambleDuration / intervalTime;
    let currentFrame = 0;

    const intervalId = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;

      const scrambled = newText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index / newText.length < progress) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayedText(scrambled);

      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        setDisplayedText(newText);
      }
    }, intervalTime);
  };

  // The interval is active ONLY when in the viewport (delay is null when offscreen, which kills the interval)
  useInterval(() => {
    const nextIndex = (textIndex + 1) % texts.length;
    setTextIndex(nextIndex);
    scrambleText(texts[nextIndex]);
  }, isIntersecting ? 8000 : null);

  return <span ref={elementRef}>{displayedText}</span>;
};

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // 4. Use modern React Transitions for Server Actions (clean loading/pending state)
  const [isPending, startTransition] = useTransition();

  // 5. Cleanup timeout to prevent memory leaks if component unmounts
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSubmitted) {
      timeout = setTimeout(() => setIsSubmitted(false), 5000);
    }
    return () => clearTimeout(timeout);
  }, [isSubmitted]);

  const handleFocus = (field: string) => setFocusedField(field);
  const handleBlur = (field: string, value: string) => {
    if (!value) setFocusedField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Wrap the async server action in startTransition
    startTransition(async () => {
      try {
        const result = await sendEmail(formState);

        if (result.error) {
          setErrorMsg(result.error);
          return;
        }

        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      } catch (error) {
        setErrorMsg('Failed to send email. Please try again.');
      }
    });
  };

  return (
    <Header
      title="Let's Work Together"
      description={<ScramblingText texts={textArr} />}
      className="w-full pt-16 pb-24 text-center"
      titleClass="text-white! text-[5vmax]"
      descClass="text-gray-300! text-[clamp(2rem,2vmax,3rem)]"
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
                  className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${
                    focusedField === 'name' || formState.name
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
                  disabled={isPending}
                  value={formState.name}
                  onFocus={() => handleFocus('name')}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  onChange={handleChange}
                  data-cursor="link"
                  className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium disabled:opacity-50"
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${
                    focusedField === 'name' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Email input */}
              <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
                <label
                  htmlFor="email"
                  className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${
                    focusedField === 'email' || formState.email
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
                  disabled={isPending}
                  value={formState.email}
                  onFocus={() => handleFocus('email')}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  onChange={handleChange}
                  data-cursor="link"
                  className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium disabled:opacity-50"
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${
                    focusedField === 'email' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </div>

            {/* Subject input */}
            <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
              <label
                htmlFor="subject"
                className={`absolute left-0 bottom-3 text-lg transition-all duration-300 pointer-events-none ${
                  focusedField === 'subject' || formState.subject
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
                disabled={isPending}
                value={formState.subject}
                onFocus={() => handleFocus('subject')}
                onBlur={(e) => handleBlur('subject', e.target.value)}
                onChange={handleChange}
                data-cursor="link"
                className="w-full bg-transparent text-white border-none outline-hidden py-1 text-lg font-sans font-medium disabled:opacity-50"
              />
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${
                  focusedField === 'subject' ? 'w-full' : 'w-0'
                }`}
              />
            </div>

            {/* Message input */}
            <div className="relative border-b border-white/20 pb-2 group transition-colors duration-300 hover:border-yellow-400/50">
              <label
                htmlFor="message"
                className={`absolute left-0 top-1 text-lg transition-all duration-300 pointer-events-none ${
                  focusedField === 'message' || formState.message
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
                disabled={isPending}
                rows={4}
                value={formState.message}
                onFocus={() => handleFocus('message')}
                onBlur={(e) => handleBlur('message', e.target.value)}
                onChange={handleChange}
                data-cursor="link"
                className="w-full bg-transparent text-white border-none outline-hidden py-2 text-lg font-sans font-medium resize-none disabled:opacity-50"
              />
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${
                  focusedField === 'message' ? 'w-full' : 'w-0'
                }`}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-right">
                <span className="inline-block text-red-400 font-mono text-sm tracking-wide bg-red-950/20 border border-red-500/20 px-4 py-2 rounded-lg">
                  ⚠️ {errorMsg}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isPending}
                data-cursor="link"
                className={`relative overflow-hidden group border border-yellow-400/40 text-white hover:text-black font-heading tracking-widest uppercase font-bold text-xl px-12 py-5 rounded-full transition-colors duration-500 ease-out cursor-pointer ${
                  isPending ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <span className="absolute inset-0 bg-yellow-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                <span className="relative z-10">{isPending ? 'SENDING...' : 'SEND MESSAGE'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Header>
  );
}