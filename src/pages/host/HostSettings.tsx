import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/Card';
export function HostSettings() {
  return <><Header product="host"/><main className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-3xl font-black">Hosting settings</h1><p className="mt-2 text-muted">Manage your account and hosting communications.</p><div className="mt-7 grid gap-4"><Card><h2 className="font-bold">Personal details</h2><p className="mt-2 text-sm text-muted">Update the contact name and phone number used for your hosting account.</p><Link className="mt-3 inline-block font-bold text-cyan-700" to="/host/profile">Edit profile →</Link></Card><Card><h2 className="font-bold">Service notices</h2><p className="mt-2 text-sm text-muted">View notices about orders, renewals and support activity.</p><Link className="mt-3 inline-block font-bold text-cyan-700" to="/host/notifications">View notifications →</Link></Card><Card><h2 className="font-bold">Billing</h2><p className="mt-2 text-sm text-muted">Review pending payments and settlement history.</p><Link className="mt-3 inline-block font-bold text-cyan-700" to="/host/payments">View payments →</Link></Card></div></main><Footer product="host"/></>;
}
