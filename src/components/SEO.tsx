import { useEffect } from 'react';

type Props = { title: string; description?: string; canonical?: string };

export default function SEO({ title, description, canonical }: Props) {
  useEffect(() => {
    document.title = title;
    const ensure = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      return el;
    };
    if (description) ensure('description').setAttribute('content', description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);
  }, [title, description, canonical]);
  return null;
}
