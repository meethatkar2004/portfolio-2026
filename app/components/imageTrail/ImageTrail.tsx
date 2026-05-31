import ImageTrailClient from './ImageTrailClient';

const skillImages = [
  { src: '/skills/tailwind_css.webp', alt: 'Tailwind CSS', name: 'TAILWIND CSS' },
  { src: '/skills/grafana.webp', alt: 'Grafana', name: 'GRAFANA' },
  { src: '/skills/github.webp', alt: 'GitHub', name: 'GITHUB' },
  { src: '/skills/redux.webp', alt: 'Redux', name: 'REDUX' },
  { src: '/skills/typescript.webp', alt: 'TypeScript', name: 'TYPESCRIPT' },
  { src: '/skills/docker.webp', alt: 'Docker', name: 'DOCKER' },
  { src: '/skills/python.webp', alt: 'Python', name: 'PYTHON' },
  { src: '/skills/next_js.webp', alt: 'Next.js', name: 'NEXT.JS' },
  { src: '/skills/three_js.webp', alt: 'Three.js', name: 'THREE.JS' },
];

type ImageTrailProps = {
  enabled?: boolean;
  threshold?: number;
};

export default function ImageTrail({ enabled = true, threshold = 100 }: ImageTrailProps) {
  return (
    <ImageTrailClient
      skillImages={skillImages}
      enabled={enabled}
      threshold={threshold}
    />
  );
}
