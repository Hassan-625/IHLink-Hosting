import {ServiceGuide} from '@/components/ServiceGuide';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuickContact } from "@/components/QuickContact";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExperiencePhoto } from "@/components/ExperiencePhoto";
import { ManagedContentSections } from "@/components/ManagedContentSections";
import { useManagedHero } from "@/hooks/useManagedHero";
import { useAuth } from "@/context/AuthContext";
import { IH_LINK_LOGO } from "@/assets/ihlinkLogo";
import { supabase } from "@/lib/supabase";
import {
  Check,
  Search,
  Server,
  ShieldCheck,
  Gauge,
  Globe2,
  Database,
  Headphones,
  ArrowRight,
  Plus,
  MoreVertical,
  CreditCard,
  Activity,
  RefreshCw,
  LifeBuoy,
} from "lucide-react";

type HostPlan={id:string;code:string;name:string;category:string;monthly_price:number;description:string|null;features:string[];is_active:boolean};
type DomainPrice={id:string;extension:string;registration_price:number;renewal_price:number;transfer_price:number;lookup_provider?:string;lookup_url?:string|null;is_restricted?:boolean;eligibility_summary?:string|null;requirements?:string[]};
type HostOrderRow={id:string;order_number:string;order_type:string;domain_name:string|null;amount:number;status:string;payment_status:string;provisioning_status:string;created_at:string;plan_id:string|null};
type HostServiceRow={id:string;service_type:string;service_name:string;domain_name:string|null;status:string;provider_reference:string|null;control_panel_url:string|null;nameservers:string[];renews_at:string|null};
type HostOpsRow=Record<string,any>;
const naira=(value:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(value);
const field="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100";
const hostStatus=(value:string)=>{const tone=value==='active'||value==='resolved'?'bg-emerald-50 text-emerald-700':value==='rejected'||value==='cancelled'||value==='expired'?'bg-rose-50 text-rose-700':'bg-amber-50 text-amber-700';return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${tone}`}>{value.replaceAll('_',' ')}</span>};

const catalog: Record<
  string,
  { title: string; lead: string; icon: typeof Server; items: string[] }
> = {
  hosting: {
    title: "Fast web hosting for growing ideas",
    lead: "Launch business websites and web apps on reliable, managed infrastructure with a simple local billing experience.",
    icon: Globe2,
    items: ["Shared Hosting", "WordPress Hosting", "Business Hosting"],
  },
  reseller: {
    title: "Build your own hosting business",
    lead: "Sell hosting under your brand with isolated client accounts, flexible packages and central management.",
    icon: Database,
    items: ["White-label portal", "WHM access", "Custom nameservers"],
  },
  vps: {
    title: "Cloud VPS with room to scale",
    lead: "Flexible virtual servers for applications, databases and production workloads that need dedicated resources.",
    icon: Server,
    items: ["Linux VPS", "Managed VPS", "Developer VPS"],
  },
  dedicated: {
    title: "Dedicated performance, full control",
    lead: "Single-tenant servers for demanding platforms, high traffic workloads and custom infrastructure.",
    icon: Gauge,
    items: ["Custom configuration", "DDoS protection", "Priority support"],
  },
};

function SearchBox() {
  const [domain, setDomain] = useState("");
  const navigate=useNavigate();
  function search(){const value=domain.trim().toLowerCase().replace(/^https?:\/\//,'').split('/')[0];if(value)navigate(`/host/domains?q=${encodeURIComponent(value)}`);}
  return (
    <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 max-w-2xl">
      <div className="flex-1 flex items-center gap-3 px-4">
        <Search className="w-5 h-5 text-cyan-700" />
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter')search();}}
          placeholder="Find your perfect domain name"
          className="w-full py-3 outline-none text-ink"
        />
      </div>
      <Button type="button" onClick={search} themeClass="bg-cyan-600 hover:bg-cyan-700">Search domain</Button>
    </div>
  );
}

export function HostHome() {
  const hero = useManagedHero("host");
  const [homePlans,setHomePlans]=useState<HostPlan[]>([]);
  useEffect(()=>{if(!supabase)return;void (async()=>{const r=await supabase.from("host_plans").select("id,code,name,category,monthly_price,description,features,is_active").eq("is_active",true).order("sort_order").limit(3);setHomePlans(((r.data||[]) as HostPlan[]).map(x=>({...x,monthly_price:Number(x.monthly_price),features:Array.isArray(x.features)?x.features:[]})));})();},[]);
  return (
    <>
      <Header
        product="host"
        announcementText="Launch online with domains, hosting and cloud infrastructure from IHLink Host"
      />
      <main>
        <section className="bg-gradient-to-br from-cyan-950 via-cyan-800 to-blue-700 text-white overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-24 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm">
                {hero?.eyebrow || "Domains • Hosting • Cloud servers"}
              </span>
              <h1 className="text-5xl lg:text-6xl font-black mt-6 leading-tight">
                {hero?.title || "Your business belongs online."}
              </h1>
              <p className="text-lg text-cyan-100 mt-5 max-w-xl">
                {hero?.body || "Register a memorable domain, host your website and manage everything from one clear dashboard—with support close to home."}
              </p>
              <div className="mt-8">
                <SearchBox />
              </div>
              <p className="text-xs text-cyan-200 mt-3">
                Popular: .com.ng • .ng • .com • .org
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 bg-cyan-300/20 blur-3xl rounded-full" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
                <img src="/images/ihlink-service-scene.webp" alt="IHLink Hosting and Domains branded infrastructure illustration" width="1672" height="941" className="block h-auto w-full" /><div className="absolute left-5 top-5 flex items-center gap-2 rounded-xl bg-white/95 p-2 pr-4 text-slate-900 shadow-lg"><img src={IH_LINK_LOGO} alt="IHLink" className="h-10 w-10 rounded-lg object-contain"/><div><b className="block text-sm">IHLink Host</b><span className="text-xs text-slate-500">Domains • Hosting • Cloud</span></div></div>
              </div>
              <Card className="relative !bg-white/95 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted">Hosting options</p>
                    <p className="text-xl font-black text-ink">
                      Hosting services
                    </p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {[
                    ["Plans", "Approved catalogue"],
                    ["Secure", "Account access"],
                    ["SSL", "Plan-dependent"],
                    ["Support", "Ticket workflow"],
                  ].map((x) => (
                    <div className="bg-cyan-50 rounded-xl p-4" key={x[1]}>
                      <p className="text-2xl font-black text-cyan-800">
                        {x[0]}
                      </p>
                      <p className="text-xs text-muted">{x[1]}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
        <ServiceGuide/><ExperiencePhoto src="/images/ihlink-service-scene.webp" alt="IHLink Hosting service illustration" eyebrow="Infrastructure with people behind it" title="Hosting supported by practical technical expertise" text="Launch with confidence knowing that domains, servers, security and migrations are backed by people who understand real infrastructure." accentClass="text-cyan-700" />
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 py-20">
          <div className="text-center">
            <p className="text-cyan-700 font-bold">Simple packages</p>
            <h2 className="text-4xl font-black mt-2">
              Hosting that grows with you
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {homePlans.map((p, index) => (
              <Card
                hover
                key={p.id}
                className=""
              >
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-black">{naira(p.monthly_price)}</span>
                  <span className="text-muted">/month</span>
                </p>
                <div className="space-y-3 my-6">
                  {p.features.map((f) => (
                    <p className="flex gap-2 text-sm" key={f}>
                      <Check className="w-4 h-4 text-emerald-500" />
                      {f}
                    </p>
                  ))}
                </div>
                <Link to="/host/order">
                  <Button
                    fullWidth
                    variant="secondary"

                  >
                    Choose {p.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20">
          <div className="text-center mb-10"><p className="text-cyan-700 font-bold">Everything needed to operate</p><h2 className="text-4xl font-black mt-2">A working hosting environment, not just a storefront</h2></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              [Globe2,"Domain & DNS management","Domain lifecycle, nameservers, DNS zones and DNS records from your account."],
              [ShieldCheck,"SSL & security","Track SSL certificates and secure provisioned services."],
              [Database,"Backups & migration","Hosting backup records plus assisted website migration workflows."],
              [Server,"Web hosting & servers","Shared hosting, reseller hosting, VPS and dedicated-server service management."],
              [CreditCard,"Billing & renewals","Verified payments, invoices, payment retry and service renewal."],
              [Activity,"Usage & service status","Provisioning state, active-service status and hosting usage records."],
              [Headphones,"Support tickets","Authenticated support for domains, hosting, billing, migration and servers."],
              [RefreshCw,"Lifecycle management","Order, provision, renew and manage services from one Hosting dashboard."]
            ].map(([I,t,d])=>{const Icon=I as typeof Server;return <Card hover key={String(t)}><Icon className="w-7 h-7 text-cyan-700"/><h3 className="font-bold mt-4">{String(t)}</h3><p className="text-sm text-muted mt-2">{String(d)}</p></Card>})}
          </div>
        </section>
        <section className="bg-cyan-50 py-16">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-6">
            {[
              [
                ShieldCheck,
                "Secure by default",
                "SSL, monitoring and protection",
              ],
              [Gauge, "Built for speed", "Modern storage and caching"],
              [Headphones, "Helpful support", "Get help when you need it"],
              [Globe2, "One dashboard", "Domains, servers and billing"],
            ].map(([I, t, d]) => {
              const Icon = I as typeof Server;
              return (
                <Card key={String(t)}>
                  <Icon className="w-8 h-8 text-cyan-700" />
                  <h3 className="font-bold mt-4">{String(t)}</h3>
                  <p className="text-sm text-muted mt-1">{String(d)}</p>
                </Card>
              );
            })}
          </div>
        </section>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-10 pb-20"><div className="grid gap-6 lg:grid-cols-3"><Card><h2 className="text-xl font-black">Choose infrastructure by workload</h2><p className="mt-3 text-sm text-muted">Shared and WordPress hosting suit conventional sites; VPS fits applications needing isolated resources; dedicated infrastructure is for workloads requiring greater control and capacity. We recommend against paying for infrastructure you do not need.</p></Card><Card><h2 className="text-xl font-black">Migration and launch support</h2><p className="mt-3 text-sm text-muted">Existing sites can be reviewed for domain/DNS changes, files, databases, SSL and mailbox considerations. New launches can start with domain registration, hosting selection and the DNS records needed to put the service online.</p></Card><Card><h2 className="text-xl font-black">Operational lifecycle</h2><p className="mt-3 text-sm text-muted">Your workspace keeps orders, provisioning state, domains, active services, renewals, billing and support together so hosting is managed after purchase rather than treated as a one-time checkout.</p></Card></div><div className="mt-8 rounded-3xl bg-cyan-950 p-8 text-white"><h2 className="text-2xl font-black">Not sure which plan or server class fits?</h2><p className="mt-3 max-w-4xl text-cyan-100">Share the type of website or application, expected traffic, storage, email needs, software/runtime requirements, current provider if migrating, and any compliance or availability constraints. The team can review the requirement before you order.</p><Link to="/host/get-in-touch" className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-300">Discuss your hosting requirement <ArrowRight className="h-4 w-4"/></Link></div></section><ManagedContentSections pageKey="host" />
      </main>
      <Footer product="host" />
    </>
  );
}

export function DomainSearch() {
  const [params]=useSearchParams();const query=(params.get('q')||'').toLowerCase().replace(/[^a-z0-9.-]/g,'');const base=(query.split('.')[0]||'mybusiness').replace(/[^a-z0-9-]/g,'');const [prices,setPrices]=useState<DomainPrice[]>([]),[loading,setLoading]=useState(true);
  useEffect(()=>{if(!supabase){setLoading(false);return;}void supabase.from('host_domain_prices').select('id,extension,registration_price,renewal_price,transfer_price,lookup_provider,lookup_url,is_restricted,eligibility_summary,requirements').eq('is_active',true).order('registration_price').then(({data})=>{setPrices(((data||[])as DomainPrice[]).map(x=>({...x,registration_price:Number(x.registration_price),renewal_price:Number(x.renewal_price),transfer_price:Number(x.transfer_price)})));setLoading(false);});},[]);
  const requestedTld=query.includes('.')?`.${query.split('.').slice(1).join('.')}`:'';
  const invalidUi=requestedTld==='.ui';const unsupportedTld=Boolean(requestedTld&&!prices.some(p=>p.extension===requestedTld));
  return (
    <>
      <Header product="host" />
      <main className="min-h-screen bg-cyan-50/40">
        <section className="bg-gradient-to-r from-cyan-900 to-blue-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Globe2 className="w-12 h-12 mx-auto text-cyan-300" />
            <h1 className="text-4xl font-black mt-4">Find your place online</h1>
            <p className="text-cyan-100 mt-3 mb-8">
              Search, register and manage your domain from one account.
            </p>
            <SearchBox />
          </div>
        </section>
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-xl font-bold">{query?`Registration options for “${base}”`:'Suggested domains'}</h2>
          <p className="mt-1 text-sm text-muted">Availability is confirmed by our upstream registrar before payment and activation.</p>
          {invalidUi&&<div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><b>.ui is not a delegated public top-level domain.</b> Please choose an available extension such as .com, .org, .ng, .com.ng, or a valid country-code domain.</div>}
          {!loading&&unsupportedTld&&!invalidUi&&<div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900"><b>{requestedTld} requires assisted handling.</b> This extension is not in the self-service catalogue. <Link className="font-bold underline" to={`/host/support?category=domain&subject=${encodeURIComponent('TLD enquiry: '+query)}`}>Contact Hosting Support</Link> for availability, eligibility and registration guidance.</div>}
          <div className="space-y-3 mt-5">
            {loading?<Card><p className="text-sm text-muted">Loading current domain pricing…</p></Card>:prices.map((d) => {const domain=`${base}${d.extension}`;const isNg=d.extension.endsWith('.ng');const provider=d.lookup_provider||(isNg?'NiRA':'WHOIS.com');const lookup=d.lookup_url||(isNg?'https://nira.org.ng/whois/':`https://www.whois.com/whois/${domain}`);return (
              <Card key={d.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-lg">{domain}</p>
                  <p className="text-sm text-cyan-700">Availability check via {provider}</p>
                  {d.eligibility_summary&&<p className="mt-1 max-w-xl text-xs text-muted">{d.eligibility_summary}</p>}
                  {d.is_restricted&&<span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Restricted namespace · documents required</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold">{naira(d.registration_price)}/year</span>
                  <a href={lookup} target="_blank" rel="noreferrer"><Button variant="secondary">Check {provider}</Button></a>
                  {d.is_restricted ? <Link to={`/host/support?category=domain&subject=${encodeURIComponent('Restricted domain request: '+domain)}`}><Button themeClass="bg-amber-600 hover:bg-amber-700">Contact support</Button></Link> : <Link to={`/host/order?domain=${encodeURIComponent(domain)}&domain_price=${d.id}`}><Button themeClass="bg-cyan-600 hover:bg-cyan-700">Request registration</Button></Link>}
                </div>
              </Card>
            )})}
            {!loading&&!prices.length&&<Card><p className="text-sm text-muted">Domain pricing is being configured. Please contact support.</p></Card>}
          </div>
        </section>
      </main>
      <Footer product="host" />
    </>
  );
}

export function HostingCatalog({
  type = "hosting",
}: {
  type?: keyof typeof catalog;
}) {
  const c = catalog[type],
    Icon = c.icon;
  const [publishedPlans, setPublishedPlans] = useState<HostPlan[]>([]);
  const [planError, setPlanError] = useState('');
  const [plansLoading, setPlansLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setPlanError('Hosting pricing is unavailable.'); setPlansLoading(false); return; }
    let active = true;
    void supabase.from('host_plans').select('id,code,name,category,monthly_price,description,features,is_active').eq('is_active', true).order('sort_order').then(({data,error}) => {
      if (!active) return;
      setPublishedPlans(((data || []) as HostPlan[]).filter(plan => type === 'hosting' ? ['shared','business','hosting'].includes(plan.category) : plan.category === type));
      setPlanError(error?.message || '');
      setPlansLoading(false);
    });
    return () => { active = false; };
  }, [type]);
  return (
    <>
      <Header product="host" />
      <main>
        <section className="bg-gradient-to-br from-cyan-950 to-blue-800 text-white">
          <div className="max-w-[1200px] mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-cyan-300 font-bold uppercase text-sm">
                IHLink Host
              </p>
              <h1 className="text-5xl font-black mt-3">{c.title}</h1>
              <p className="text-cyan-100 mt-5 text-lg">{c.lead}</p>
              <div className="flex gap-3 mt-8">
                <Link to="/host/order">
                  <Button themeClass="bg-cyan-500 hover:bg-cyan-600">
                    Configure a plan
                  </Button>
                </Link>
                <Link to="/host/support">
                  <Button variant="secondary">Talk to an expert</Button>
                </Link>
              </div>
            </div>
            <div className="grid place-items-center">
              <div className="w-56 h-56 rounded-[3rem] bg-white/10 border border-white/20 grid place-items-center">
                <Icon className="w-24 h-24 text-cyan-300" />
              </div>
            </div>
          </div>
        </section>
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="text-2xl font-black">Available plans</h2>
          {plansLoading && <p className="mt-4 text-muted">Loading current prices…</p>}
          {planError && <p role="alert" className="mt-4 text-rose-700">Unable to load prices: {planError}</p>}
          {!plansLoading && !planError && !publishedPlans.length && <p className="mt-4 text-muted">No plans are published for this service. <Link to="/host/get-in-touch" className="font-bold text-cyan-700">Ask for a quote</Link>.</p>}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {publishedPlans.map(plan => <Card hover key={plan.id}>
              <div className="w-11 h-11 rounded-xl bg-cyan-100 grid place-items-center"><Server className="w-5 h-5 text-cyan-700" /></div>
              <h3 className="font-bold text-xl mt-4">{plan.name}</h3>
              <p className="text-sm text-muted mt-2">{plan.description || 'Contact IHLink for plan details.'}</p>
              <p className="font-black text-2xl mt-5">{naira(Number(plan.monthly_price))}<span className="text-sm font-normal text-muted">/mo</span></p>
              <Link to={`/host/order?plan=${encodeURIComponent(plan.id)}`} className="inline-flex gap-2 items-center text-cyan-700 font-bold mt-5">View configuration <ArrowRight className="w-4 h-4" /></Link>
            </Card>)}
          </div>
        </section>
      </main>
      <Footer product="host" />
    </>
  );
}

export function HostOrder() {
  const {user}=useAuth();const navigate=useNavigate();const [params]=useSearchParams();const [availablePlans,setAvailablePlans]=useState<HostPlan[]>([]),[domainProduct,setDomainProduct]=useState<DomainPrice|null>(null),[planId,setPlanId]=useState(''),[domain,setDomain]=useState(params.get('domain')||''),[cycle,setCycle]=useState(12),[notes,setNotes]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState<{error?:boolean;text:string}|null>(null);
  useEffect(()=>{if(!supabase)return;void supabase.from('host_plans').select('id,code,name,category,monthly_price,description,features,is_active').eq('is_active',true).order('sort_order').then(({data})=>{const rows=((data||[])as HostPlan[]).map(x=>({...x,monthly_price:Number(x.monthly_price)}));setAvailablePlans(rows);setPlanId(v=>v||params.get('plan')||(params.get('domain')?'':rows[0]?.id)||'');});},[params]);
  const domainPriceId=params.get('domain_price');
  useEffect(()=>{if(!supabase||!domainPriceId){setDomainProduct(null);return;}let active=true;void supabase.from('host_domain_prices').select('id,extension,registration_price,renewal_price,transfer_price,is_restricted').eq('id',domainPriceId).eq('is_active',true).maybeSingle().then(({data})=>{if(active)setDomainProduct(data?{...data,registration_price:Number(data.registration_price),renewal_price:Number(data.renewal_price),transfer_price:Number(data.transfer_price)}:null)});return()=>{active=false};},[domainPriceId]);
  const selected=availablePlans.find(x=>x.id===planId),isDomainOnly=Boolean(params.get('domain')&&!selected),amount=isDomainOnly?Number(domainProduct?.registration_price||0):(selected?.monthly_price||0)*cycle,isRestricted=Boolean(domainProduct?.is_restricted);
  async function submit(e:FormEvent){e.preventDefault();if(!supabase||!user||amount<=0||(isDomainOnly&&!domainProduct))return;setBusy(true);setMessage(null);const category=selected?.category;const orderType=isDomainOnly?'domain_registration':category==='reseller'?'reseller':category==='vps'?'vps':category==='dedicated'?'dedicated':'hosting';const {data,error}=await supabase.rpc('create_host_order',{p_order_type:orderType,p_domain:domain.trim()||null,p_plan:selected?.id||null,p_domain_price:isDomainOnly?domainProduct?.id:null,p_cycle:isDomainOnly?12:cycle,p_notes:notes||null});if(error){setBusy(false);setMessage({error:true,text:error.message});return;}if(data.status==='pending_review'){setBusy(false);setMessage({text:`Order ${data.order_number} created. IHLink must confirm domain availability/eligibility before payment is enabled. Do not transfer money yet.`});return;}setBusy(false);setMessage({text:`Order ${data.order_number} created. Open Payments to view the two company bank accounts and submit your transfer receipt. Payment must be verified before provisioning.`});}

  return (
    <>
      <Header product="host" />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-cyan-700 font-bold">Secure checkout</p>
          <h1 className="text-3xl font-black mt-1">Configure your hosting</h1>
          {message&&<div className={`mt-5 rounded-xl border p-3 text-sm ${message.error?'border-rose-200 bg-rose-50 text-rose-700':'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}
          <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6 mt-8">
            <Card className="lg:col-span-2">
              <div className="flex gap-3 mb-6">
                {["1. Plan", "2. Domain", "3. Checkout"].map((x, i) => (
                  <span
                    className={`px-3 py-2 rounded-lg text-sm font-semibold ${i === 0 ? "bg-cyan-600 text-white" : "bg-gray-100"}`}
                    key={x}
                  >
                    {x}
                  </span>
                ))}
              </div>
              <label className="font-bold text-sm">Choose plan</label>
              <div className="grid md:grid-cols-3 gap-3 mt-3">
                {availablePlans.map((p) => (
                  <button
                    type="button"
                    key={p.name}
                    onClick={()=>setPlanId(p.id)}
                    className={`text-left p-4 rounded-xl border-2 ${planId===p.id ? "border-cyan-500 bg-cyan-50" : "border-gray-200"}`}
                  >
                    <p className="font-bold">{p.name}</p>
                    <p className="text-sm text-muted">{naira(p.monthly_price)}/mo</p>
                  </button>
                ))}
              </div>
              <label className="font-bold text-sm block mt-6">Domain name</label>
              <input className={`${field} mt-2`} value={domain} onChange={e=>setDomain(e.target.value.toLowerCase())} placeholder="yourbusiness.com.ng" />
              <label className="font-bold text-sm block mt-6">
                Billing cycle
              </label>
              <select className={`${field} mt-2`} value={cycle} onChange={e=>setCycle(Number(e.target.value))} disabled={isDomainOnly}>
                <option value={12}>12 months</option><option value={1}>Monthly</option><option value={24}>24 months</option>
              </select>
              <label className="font-bold text-sm block mt-6">Notes for provisioning</label><textarea className={`${field} mt-2 min-h-24`} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Migration, configuration or nameserver requirements"/>
              {isRestricted&&<div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><b>Eligibility verification is required.</b> Add the institution or government entity name and the documents you can provide. IHLink will review these before requesting registration; submitting this form does not guarantee approval.</div>}
            </Card>
            <Card>
              <h2 className="font-bold">Order summary</h2>
              <div className="py-5 border-b">
                <div className="flex justify-between">
                  <span>{isDomainOnly?'Domain registration':selected?.name||'Select a plan'}</span>
                  <b>{naira(amount)}</b>
                </div>
                <div className="flex justify-between text-sm text-muted mt-2">
                  <span>SSL certificate</span>
                  <span>Included</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-black py-5">
                <span>Total</span>
                <span>{naira(amount)}</span>
              </div>
              <Button fullWidth disabled={busy||(!selected&&!isDomainOnly)||amount<=0} themeClass="bg-cyan-600 hover:bg-cyan-700">
                {busy?'Submitting…':'Submit order for review'}
              </Button>
              <p className="text-xs text-muted mt-4 text-center">
                Final availability and infrastructure are confirmed before
                activation.
              </p>
            </Card>
          </form>
        </div>
      </main>
    </>
  );
}

const dashNav = [
  ["Overview", "/host/dashboard"],
  ["My domains", "/host/dashboard/domains"],
  ["Hosting services", "/host/dashboard/services"],
  ["DNS / SSL / Email / Backups", "/host/dashboard/operations"],
  ["Support", "/host/support"],
];
export function HostDashboard({
  view = "overview",
}: {
  view?: "overview" | "domains" | "services" | "operations";
}) {
  const {user,profile}=useAuth();const [ops,setOps]=useState<Record<string,HostOpsRow[]>>({}),[orders,setOrders]=useState<HostOrderRow[]>([]),[services,setServices]=useState<HostServiceRow[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null);
  const load=useCallback(async()=>{if(!supabase||!user)return;const client=supabase;setLoading(true);const [o,s]=await Promise.all([supabase.from('host_orders').select('id,order_number,order_type,domain_name,amount,status,payment_status,provisioning_status,created_at,plan_id').eq('user_id',user.id).order('created_at',{ascending:false}),supabase.from('host_services').select('id,service_type,service_name,domain_name,status,provider_reference,control_panel_url,nameservers,renews_at').eq('user_id',user.id).order('created_at',{ascending:false})]);const issue=o.error||s.error;setError(issue?.message||null);setOrders(((o.data||[])as HostOrderRow[]).map(x=>({...x,amount:Number(x.amount)})));setServices((s.data||[])as HostServiceRow[]);const names=['host_dns_zones','host_ssl_certificates','host_backups','host_mailboxes','host_migrations','host_invoices','host_payments','host_notifications'];const rs=await Promise.all(names.map(n=>client.from(n).select('*').limit(50)));const next:Record<string,HostOpsRow[]>={};names.forEach((n,i)=>next[n]=rs[i].data||[]);setOps(next);setLoading(false);},[user]);useEffect(()=>{void load();},[load]);function payOrder(id:string){window.location.assign('/host/payments');}async function renewService(id:string){if(!supabase)return;const{data,error}=await supabase.rpc('create_host_renewal_order',{p_service:id});if(error){setError(error.message);return;}await payOrder(data.order_id);await load();}
  const domains=services.filter(x=>x.service_type==='domain'),hosting=services.filter(x=>x.service_type!=='domain'),firstName=profile?.first_name||'Customer';
  return (
    <div className="min-h-screen bg-slate-50">
      <Header product="host" showAnnouncement={false} />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8 grid lg:grid-cols-[230px_1fr] gap-8">
        <aside>
          <p className="text-xs font-bold text-muted uppercase mb-3">
            Hosting account
          </p>
          <nav className="space-y-1">
            {dashNav.map((x) => (
              <Link
                className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-cyan-50 hover:text-cyan-700"
                to={x[1]}
                key={x[0]}
              >
                {x[0]}
              </Link>
            ))}
          </nav>
          <Link to="/host/order">
            <Button
              fullWidth
              themeClass="bg-cyan-600 hover:bg-cyan-700"
              className="mt-5"
            >
              <Plus className="w-4 h-4" /> New service
            </Button>
          </Link>
        </aside>
        <main>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-cyan-700 font-bold">IHLink Host</p>
              <h1 className="text-3xl font-black capitalize">
                {view === "overview" ? `Welcome, ${firstName}` : view}
              </h1>
            </div>
            <Button size="sm" variant="secondary" leftIcon={<RefreshCw className="h-4 w-4"/>} onClick={()=>void load()}>Refresh</Button>
          </div>
          {error&&<div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
          {loading&&<Card className="mt-6"><p className="text-sm text-muted">Loading your domains and services…</p></Card>}
          {view === "operations" ? <><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[['DNS zones','host_dns_zones'],['SSL certificates','host_ssl_certificates'],['Backups','host_backups'],['Mailboxes','host_mailboxes'],['Migrations','host_migrations'],['Invoices','host_invoices'],['Payments','host_payments'],['Notifications','host_notifications']].map(([label,key])=><Card key={key}><p className="font-bold">{label}</p><p className="mt-3 text-3xl font-black">{(ops[key]||[]).length}</p><p className="mt-2 text-xs text-muted">Records available in your hosting account.</p></Card>)}</div><Card className="mt-6"><h2 className="font-bold">Hosting operations</h2><p className="mt-2 text-sm text-muted">DNS, SSL, mailbox, backup, migration, billing and notification records are loaded from the internal hosting backend. Provider-dependent actions activate when their configured adapters are enabled.</p></Card></> : view === "overview" ? (
            <>
              <div className="grid md:grid-cols-4 gap-4 mt-7">
                {[
                  [Globe2, "Domains", String(domains.length)],
                  [Server, "Hosting services", String(hosting.length)],
                  [Activity, "Open orders", String(orders.filter(x=>!['active','rejected','cancelled'].includes(x.status)).length)],
                  [CreditCard, "Orders value", naira(orders.reduce((n,x)=>n+x.amount,0))],
                ].map(([I, l, v]) => {
                  const Icon = I as typeof Server;
                  return (
                    <Card key={String(l)}>
                      <Icon className="w-5 h-5 text-cyan-700" />
                      <p className="text-xs text-muted mt-4">{String(l)}</p>
                      <p className="text-2xl font-black mt-1">{String(v)}</p>
                    </Card>
                  );
                })}
              </div>
              <Card className="mt-6">
                <h2 className="font-bold text-lg">Active services</h2>
                <div className="mt-4 divide-y">
                  {services.map((x) => (
                    <div
                      className="py-4 flex justify-between items-center"
                      key={x.id}
                    >
                      <div>
                        <p className="font-bold">{x.domain_name||x.service_name}</p>
                        <p className="text-sm text-muted">{x.service_name}{x.renews_at?` · Renews ${new Date(x.renews_at).toLocaleDateString('en-NG')}`:''}</p>
                      </div>
                      {hostStatus(x.status)}
                    </div>
                  ))}
                  {!services.length&&!loading&&<p className="py-8 text-center text-sm text-muted">No active service yet. Submitted orders appear below while our team confirms availability and provisions them.</p>}
                </div>
              </Card>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[[Globe2,'DNS zones','host_dns_zones','Manage domain DNS and nameserver records.','/host/dashboard/domains'],[ShieldCheck,'SSL certificates','host_ssl_certificates','Review certificate and security status.','/host/dashboard/operations'],[Database,'Backups','host_backups','Review hosting backup records.','/host/dashboard/operations'],[Server,'Mailboxes','host_mailboxes','Review hosted mailbox records.','/host/dashboard/operations'],[RefreshCw,'Migrations','host_migrations','Track website migration activity.','/host/dashboard/operations'],[CreditCard,'Invoices','host_invoices','Review hosting invoices and billing.','/host/payments'],[CreditCard,'Payments','host_payments','Open verified payment records.','/host/payments'],[Activity,'Notifications','host_notifications','Review service and account updates.','/host/notifications']].map(([I,label,key,description,href])=>{const Icon=I as typeof Server;return <Link key={String(key)} to={String(href)} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md"><div className="flex items-start justify-between"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-950 text-white"><Icon className="h-5 w-5"/></div><span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-black text-cyan-800">{(ops[String(key)]||[]).length}</span></div><h3 className="mt-4 font-black">{String(label)}</h3><p className="mt-2 min-h-10 text-sm text-muted">{String(description)}</p><span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-700 px-3 py-2 text-xs font-bold text-white">Open module <ArrowRight className="h-4 w-4"/></span></Link>})}</div>
              <Card className="mt-6"><h2 className="font-bold text-lg">Recent orders</h2><div className="mt-4 divide-y">{orders.slice(0,6).map(x=><div key={x.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"><div><p className="font-bold">{x.domain_name||x.order_type.replaceAll('_',' ')}</p><p className="text-sm text-muted">{x.order_number} · {naira(x.amount)} · {new Date(x.created_at).toLocaleDateString('en-NG')} · Payment: {x.payment_status.replaceAll('_',' ')} · Provisioning: {x.provisioning_status.replaceAll('_',' ')}</p></div><div className="flex items-center gap-2">{x.payment_status!=='paid'&&x.status!=='pending_review'&&<Button size="sm" onClick={()=>void payOrder(x.id)}>Pay / retry</Button>}{x.status==='pending_review'&&<span className="text-xs font-semibold text-amber-700">Availability review required before payment</span>}{hostStatus(x.status)}</div></div>)}{!orders.length&&!loading&&<p className="py-6 text-sm text-muted">No orders submitted yet.</p>}</div></Card>
            </>
          ) : (
            <Card className="mt-7">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">
                    {view === "domains"
                      ? "Registered domains"
                      : "Hosting & server services"}
                  </h2>
                  <p className="text-sm text-muted">
                    Manage renewals, configuration and service status.
                  </p>
                </div>
                <Link to="/host/order">
                  <Button themeClass="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="w-4 h-4" /> Add new
                  </Button>
                </Link>
              </div>
              <div className="mt-5 divide-y">
                {(view === "domains"?domains:hosting).map((x) => (
                  <div
                    className="py-5 flex justify-between items-center"
                    key={x.id}
                  >
                    <div>
                      <p className="font-bold">{x.domain_name||x.service_name}</p>
                      <p className="text-sm text-muted">{x.renews_at?`Renews ${new Date(x.renews_at).toLocaleDateString('en-NG')}`:x.provider_reference||'Provisioning details pending'}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      {hostStatus(x.status)}
                      <Button size="sm" variant="secondary" onClick={()=>void renewService(x.id)}>Renew</Button>
                      {x.control_panel_url&&<a href={x.control_panel_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-cyan-700">Control panel</a>}
                      <MoreVertical className="w-5 h-5 text-muted" />
                    </div>
                  </div>
                ))}
                {!(view==='domains'?domains:hosting).length&&!loading&&<p className="py-8 text-center text-sm text-muted">No {view==='domains'?'registered domain':'provisioned hosting service'} yet.</p>}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

export function HostSupport() {
  const {user}=useAuth();const [supportParams]=useSearchParams();const [form,setForm]=useState({subject:supportParams.get('subject')||'',category:supportParams.get('category')||'hosting',priority:'normal',message:''}),[busy,setBusy]=useState(false),[notice,setNotice]=useState<{error?:boolean;text:string}|null>(null),[showKnowledge,setShowKnowledge]=useState(false);
  function continueSupport(index:number){if(index===0){setShowKnowledge(true);setTimeout(()=>document.getElementById('host-knowledge')?.scrollIntoView({behavior:'smooth'}),50);return;}setShowKnowledge(false);if(index===2)setForm(v=>({...v,category:'migration',subject:v.subject||'Website migration assistance'}));setTimeout(()=>document.querySelector('main form')?.scrollIntoView({behavior:'smooth',block:'center'}),50);}
  async function submit(e:FormEvent){e.preventDefault();if(!supabase||!user)return;setBusy(true);setNotice(null);const {error}=await supabase.from('host_support_tickets').insert({user_id:user.id,...form});setBusy(false);if(error){setNotice({error:true,text:error.message});return;}setNotice({text:'Support ticket submitted. Our hosting team will respond from your account.'});setForm({subject:'',category:'hosting',priority:'normal',message:''});}
  return (
    <>
      <Header product="host" />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center">
          <Headphones className="w-12 h-12 text-cyan-700 mx-auto" />
          <h1 className="text-4xl font-black mt-4">How can we help?</h1>
          <p className="text-muted mt-2">
            Get help with domains, hosting, migration, billing and server
            management.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {["Knowledge base", "Open a ticket", "Migration help"].map((x, i) => (
            <Card hover key={x}>
              <h2 className="font-bold text-lg">{x}</h2>
              <p className="text-sm text-muted mt-2">
                {
                  [
                    "Browse practical guides and common solutions.",
                    "Tell our support team what you need.",
                    "Move an existing website with less downtime.",
                  ][i]
                }
              </p>
              <button type="button" onClick={()=>continueSupport(i)} className="text-cyan-700 font-bold text-sm mt-5">
                Continue →
              </button>
            </Card>
          ))}
        </div>
        <QuickContact className="mt-8" />
        {showKnowledge&&<Card id="host-knowledge" className="mt-8 scroll-mt-24"><h2 className="text-xl font-bold">Hosting knowledge base</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{[['Connect a domain','Use the nameservers or DNS records shown in your active hosting service.'],['Enable SSL','Issue the included SSL certificate after the domain DNS resolves.'],['Create business email','Create a mailbox in the control panel and use its IMAP and SMTP settings.'],['Website unavailable','Check hosting status, DNS and SSL, then open a ticket if the issue continues.']].map(x=><details key={x[0]} className="rounded-xl border p-4"><summary className="cursor-pointer font-bold">{x[0]}</summary><p className="mt-2 text-sm text-muted">{x[1]}</p></details>)}</div></Card>}
        <Card className="mt-8"><div className="flex items-start gap-3"><LifeBuoy className="mt-1 h-6 w-6 text-cyan-700"/><div><h2 className="text-xl font-bold">Open a support ticket</h2><p className="mt-1 text-sm text-muted">For domain, migration, billing and infrastructure assistance.</p></div></div>{notice&&<div className={`mt-4 rounded-xl border p-3 text-sm ${notice.error?'border-rose-200 bg-rose-50 text-rose-700':'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{notice.text}</div>}{user?<form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2"><input required minLength={4} className={field} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Subject"/><select className={field} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['domain','hosting','migration','billing','server','other'].map(x=><option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)}</option>)}</select><select className={field} value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{['low','normal','high','urgent'].map(x=><option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)} priority</option>)}</select><textarea required minLength={10} className={`${field} min-h-28 md:col-span-2`} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe the issue, affected domain and any error message"/><div className="md:col-span-2"><Button disabled={busy} themeClass="bg-cyan-600 hover:bg-cyan-700">{busy?'Submitting…':'Submit ticket'}</Button></div></form>:<div className="mt-5 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900">Sign in to open and track a support ticket. <Link className="font-bold underline" to="/signin">Sign in</Link></div>}</Card>
      </main>
      <Footer product="host" />
    </>
  );
}

