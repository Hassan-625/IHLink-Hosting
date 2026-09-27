import { Link } from 'react-router-dom';
import { PageShell } from '@/components/PageShell';
import { QuickContact } from '@/components/QuickContact';
import { Card } from '@/components/ui/Card';
export function HostContact() {
  return <PageShell product="host"><main className="mx-auto max-w-5xl px-6 py-16"><p className="font-bold text-cyan-700">IHLink Hosting & Domains</p><h1 className="mt-2 text-4xl font-black">Contact Hosting</h1><p className="mt-3 max-w-2xl text-muted">Ask about domains, hosting plans, renewals or an existing service.</p><QuickContact className="mt-8"/><div className="mt-8 grid gap-4 sm:grid-cols-2"><Card><h2 className="font-bold">Find a domain</h2><Link className="mt-3 inline-block font-bold text-cyan-700" to="/host/domains">Search domains →</Link></Card><Card><h2 className="font-bold">Existing order support</h2><p className="mt-2 text-sm text-muted">Sign in to create and track a Hosting support ticket.</p><Link className="mt-3 inline-block font-bold text-cyan-700" to="/host/support">Hosting support →</Link></Card></div></main></PageShell>;
}
