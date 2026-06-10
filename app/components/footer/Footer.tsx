import FooterClient from './FooterClient';

const connectLinks = [
  { label: 'Github', href: 'https://github.com/meethatkar' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/meethatkar/' },
  { label: 'Instagram', href: 'https://www.instagram.com/hatkarmeet/' },
  { label: 'Whatsup', href: 'https://wa.me/918355959889' },
];

const navigateLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projectList' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  return (
    <FooterClient
      connectLinks={connectLinks}
      navigateLinks={navigateLinks}
    />
  );
}
