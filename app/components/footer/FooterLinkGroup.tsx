import Link from 'next/link';

interface LinkItem {
  label: string;
  href: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: LinkItem[];
  className?: string;
  align?: 'left' | 'right';
}

export default function FooterLinkGroup({ title, links, className = '', align = 'left' }: FooterLinkGroupProps) {
  return (
    <div className={`flex flex-col gap-6 ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} ${className}`}>
      <h4 className="footer-title text-[0.65rem] md:text-xs font-bold tracking-[0.2em] text-primary uppercase font-mono">
        {title}
      </h4>
      <ul className={`flex flex-col gap-3 ${align === 'right' ? 'items-end' : 'items-start'}`}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="footer-link text-sm md:text-base text-primary hover:text-black transition-colors font-small">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
