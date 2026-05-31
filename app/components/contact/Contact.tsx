import ContactClient from './ContactClient';

const textArr = [
  "Let’s create something people remember.",
  "Ready to build something impossible to ignore?",
  "Your brand deserves better than basic.",
  "Ready for a website that actually feels premium?",
  "Let’s build something the market hasn’t seen yet.",
  "Work with us if average isn’t your thing.",
  "Have an idea, want to collaborate, or just want to discuss some creative web experiences? Shoot a message."
];

export default function Contact() {
  return <ContactClient textArr={textArr} />;
}