import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabase';

type Plan = { id: string; name: string; category: string; monthly_price: number; description: string | null; features: string[] | null };
const money = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
export function HostPricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    if (!supabase) { setError('Hosting data is unavailable.'); setLoading(false); return; }
    void supabase.from('host_plans').select('id,name,category,monthly_price,description,features').eq('is_active', true).order('sort_order').then(({ data, error: issue }) => {
      if (!active) return;
      setPlans((data || []) as Plan[]);
      setError(issue?.message || '');
      setLoading(false);
    });
    return () => { active = false; };
  }, []);
  return <><Header product="host"/><main className="mx-auto max-w-6xl px-6 py-14"><h1 className="text-4xl font-black">Hosting pricing</h1><p className="mt-3 text-muted">Compare currently available plans. Domain registration and renewals are quoted separately.</p>{loading && <p className="mt-8">Loading current plans…</p>}{error && <p role="alert" className="mt-8 text-rose-700">Unable to load prices: {error}</p>}{!loading && !error && !plans.length && <p className="mt-8">No plans are currently published. <Link className="text-cyan-700 underline" to="/host/get-in-touch">Ask for a quote</Link>.</p>}<div className="mt-8 grid gap-5 md:grid-cols-3">{plans.map(plan => <Card key={plan.id}><p className="text-sm font-bold uppercase text-cyan-700">{plan.category}</p><h2 className="mt-2 text-xl font-black">{plan.name}</h2><p className="mt-3 text-muted">{plan.description}</p><p className="mt-5 text-2xl font-black">{money(Number(plan.monthly_price))}<span className="text-sm font-normal"> / month</span></p><ul className="mt-4 space-y-2 text-sm">{(plan.features || []).map(feature => <li key={feature}>✓ {feature}</li>)}</ul><Link className="mt-6 inline-block font-bold text-cyan-700" to={`/host/order?plan=${encodeURIComponent(plan.id)}`}>Choose plan →</Link></Card>)}</div></main><Footer product="host"/></>;
}
