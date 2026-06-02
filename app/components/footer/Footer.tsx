import FooterClient from './FooterClient';

const connectLinks = [
  { label: 'Whatsup', href: 'https://wa.me/8355959889' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/meethatkar/' },
  { label: 'Instagram', href: 'https://www.instagram.com/hatkarmeet/' },
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
