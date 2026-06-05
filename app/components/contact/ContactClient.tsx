'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Header from '../../commonComponents/Header/Header';
import { sendEmail } from '../../actions/sendEmail';
import FilmGrain from '../../commonComponents/FilmGrain/FilmGrain';

// Utility hook
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

const SCRAMBLE_CHARS = '!@#$%^&*()_+{}:"<>?,./;[]\\-';

// Scrambling Text Component
const ScramblingText = ({ texts }: { texts: string[] }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(texts[0]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  const scrambleText = (newText: string) => {
    const scrambleDuration = 1000;
    const intervalTime = 30;
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
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');

      setDisplayedText(scrambled);

      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        setDisplayedText(newText);
      }
    }, intervalTime);
  };

  useInterval(() => {
    const nextIndex = (textIndex + 1) % texts.length;
    setTextIndex(nextIndex);
    scrambleText(texts[nextIndex]);
  }, isIntersecting ? 8000 : null);

  return <span ref={elementRef}>{displayedText}</span>;
};

// Client Component
interface ContactClientProps {
  textArr: string[];
}

export default function ContactClient({ textArr }: ContactClientProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

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

    startTransition(async () => {
      try {
        const result = await sendEmail(formState);

        if (result.error) {
          setErrorMsg(result.error);
          return;
        }

        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
      } catch {
        setErrorMsg('Failed to send email. Please try again.');
      }
    });
  };

  return (
    <section className="w-full relative overflow-hidden">
      <FilmGrain />
      <Header
        title="Let's Work Together"
        description={<ScramblingText texts={textArr} />}
        className="w-full pt-16 pb-24 text-center relative z-30"
        titleClass="text-white! text-[clamp(2rem,5vmax,4.5rem)]"
        descClass="text-gray-300! text-[clamp(2rem,2vmax,3rem)]"
      >
        <div className="w-full mt-[10%] max-w-4xl mx-auto p-[3%] mt-12 text-left bg-yellow-700/5 backdrop-blur-md rounded-2xl border border-yellow-300/10 relative z-30">
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center transition-all duration-500 ease-out">
              <div className="w-20 h-20 rounded-full border border-yellow-400/30 flex items-center justify-center mb-6 animate-pulse">
                <span className="text-[clamp(2rem,3vw,2.5rem)]">🧿</span>
              </div>
              <h3 className="text-[clamp(1.5rem,2.5vw,1.875rem)] font-heading text-white tracking-wider mb-2">MESSAGE SENT</h3>
              <p className="text-gray-400 font-medium text-[clamp(0.875rem,0.8rem+0.3vw,1rem)]">
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
                    className={`absolute left-0 bottom-3 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] transition-all duration-300 pointer-events-none ${focusedField === 'name' || formState.name
                      ? '-translate-y-8 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-yellow-500 font-bold uppercase tracking-wider'
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
                    className="w-full bg-transparent text-white border-none outline-hidden py-1 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] font-sans font-medium disabled:opacity-50"
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
                    className={`absolute left-0 bottom-3 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] transition-all duration-300 pointer-events-none ${focusedField === 'email' || formState.email
                      ? '-translate-y-8 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-yellow-500 font-bold uppercase tracking-wider'
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
                    className="w-full bg-transparent text-white border-none outline-hidden py-1 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] font-sans font-medium disabled:opacity-50"
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
                  className={`absolute left-0 bottom-3 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] transition-all duration-300 pointer-events-none ${focusedField === 'subject' || formState.subject
                    ? '-translate-y-8 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-yellow-500 font-bold uppercase tracking-wider'
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
                  className="w-full bg-transparent text-white border-none outline-hidden py-1 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] font-sans font-medium disabled:opacity-50"
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
                  className={`absolute left-0 top-1 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] transition-all duration-300 pointer-events-none ${focusedField === 'message' || formState.message
                    ? '-translate-y-8 text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] text-yellow-500 font-bold uppercase tracking-wider'
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
                  className="w-full bg-transparent text-white border-none outline-hidden py-2 text-[clamp(1rem,0.9rem+0.4vw,1.125rem)] font-sans font-medium resize-none disabled:opacity-50"
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-yellow-600 transition-all duration-500 ease-out ${focusedField === 'message' ? 'w-full' : 'w-0'
                    }`}
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="text-right">
                  <span className="inline-block text-red-400 font-mono text-[clamp(0.75rem,0.7rem+0.2vw,0.875rem)] tracking-wide bg-red-950/20 border border-red-500/20 px-4 py-2 rounded-lg">
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
                  className={`relative overflow-hidden group border border-yellow-400/40 text-white hover:text-black font-heading tracking-widest uppercase font-bold text-[clamp(1.125rem,1rem+0.5vw,1.25rem)] px-12 py-5 rounded-full transition-colors duration-500 ease-out cursor-pointer ${isPending ? 'opacity-50 pointer-events-none' : ''
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
    </section>
  );
}
