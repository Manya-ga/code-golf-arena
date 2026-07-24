import { Construction } from 'lucide-react';

export const PlaceholderPage = ({ title }) => (
  <section className="placeholder-page container">
    <Construction size={32} />
    <p className="eyebrow">IN PROGRESS</p>
    <h1>{title}</h1>
    <p>This page is next in the incremental redesign.</p>
  </section>
);
