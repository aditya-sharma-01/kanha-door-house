import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, CheckCircle2, Phone, MapPin, Calculator, Wrench, ArrowRight, Clock, Star, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function HomePage() {
  const [productCategory, setProductCategory] = useState('WPVC Door');
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(7);
  const [glassType, setGlassType] = useState('5mm Toughened');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const getRatePerSqFt = () => {
    if (productCategory === 'WPVC Door') return 450;
    if (productCategory === 'UPVC Window') return 520;
    if (productCategory === 'Aluminium Window') return 480;
    if (productCategory === 'Flush Door') return 380;
    return 450;
  };

  const sqFt = width * height;
  const estimatedPrice = sqFt * getRatePerSqFt() * quantity;

  const handleSendQuoteWhatsApp = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please enter your name and phone number.');
      return;
    }
    const text = encodeURIComponent(
      `Hello Kanha Door House,\nI would like an official quote for:\n\n*Product:* ${productCategory}\n*Dimensions:* ${width}ft x ${height}ft (${sqFt} sq.ft)\n*Quantity:* ${quantity} units\n*Glass/Option:* ${glassType}\n*Estimated Price:* ~₹${estimatedPrice.toLocaleString('en-IN')}\n\n*Name:* ${customerName}\n*Phone:* ${customerPhone}\n*Location:* Jamalpur/Bihar`
    );
    window.open(`https://wa.me/919504083165?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-emerald-400" /> High Precision Machinery Manufacturing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Precision Crafted <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                WPVC & UPVC Doors
              </span> & Windows
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Welcome to <strong>{BUSINESS_INFO.name}</strong>. Owned by <strong>{BUSINESS_INFO.owner}</strong> (Estd. {BUSINESS_INFO.established}). We manufacture and install waterproof WPVC doors, soundproof UPVC windows, heavy aluminium frames, and durable flush doors with automatic CNC machinery precision.
            </p>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">100% Waterproof</div>
                  <div className="text-[10px] text-slate-400">Zero Rotting WPVC</div>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">GST Verified</div>
                  <div className="text-[10px] text-slate-400">{BUSINESS_INFO.gstin}</div>
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center gap-3 col-span-2 sm:col-span-1">
                <Wrench className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Expert Fitting</div>
                  <div className="text-[10px] text-slate-400">On-Site Technicians</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#quote"
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <Calculator className="w-4 h-4" /> Calculate Instant Quote <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contact"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4 text-emerald-400" /> Visit Shop
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-2 border border-slate-700/80 shadow-2xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?w=800&auto=format&fit=crop&q=80"
                  alt="Kanha Door House WPVC and UPVC Door Installation"
                  className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">Kanha Door House Shop</span>
                    <span className="text-emerald-400 font-bold text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Estd. 2016</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">Marwadi Mohalla, Jamalpur, Bihar - 811214</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* PRODUCTS & MANUFACTURING RANGE */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Our Specialty Range</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Precision Manufactured Doors & Windows</h2>
          <p className="text-slate-600 text-sm">Every product is cut, welded, and assembled using automatic machinery for exact millimeter accuracy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🚪
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">WPVC Waterproof Doors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              100% waterproof and termite-proof solid polymer door panels. Perfect for main entrances, bathrooms, and high-moisture rooms.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 30mm Solid Thickness</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fire Retardant & UV Safe</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pre-fitted Multi-Lock Sets</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🪟
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">UPVC Doors & Windows</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-chambered German technology profiles providing maximum noise reduction, dust seal, and thermal insulation.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 2-Track & 3-Track Sliding</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 5mm/6mm Toughened Glass</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stainless Steel Fly Mesh</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🏢
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">Aluminium Extrusions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Heavy-gauge powder coated and anodized aluminium frames for modern residential homes and commercial complexes.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bronze & White Anodized</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Heavy Duty Bearing Rollers</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Casement & Sliding Options</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
              🪵
            </div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">Waterproof Flush Doors</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-density solid timber core flush doors with boiling-water resistance and elegant veneer laminate pressing.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium pt-2 border-t border-slate-100">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> BWP Grade Pine Timber</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Anti-Warping Guarantee</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom Laminate Finishes</li>
            </ul>
          </div>

        </div>
      </section>


      {/* PRECISION MACHINERY SHOWCASE */}
      <section id="machinery" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
            <div>
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">State-of-the-Art Workshop</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Automatic Machinery Precision</h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md">
              At Kanha Door House, we don't rely on manual guesswork. Our Jamalpur manufacturing unit utilizes automated double-head mitre saws and seamless corner welders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700">01</span>
                Double-Head Profile Cutter
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                45° and 90° precision profile cutting ensures zero gap joints for superior soundproofing and thermal sealing.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700">02</span>
                Automatic Seamless Welder
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High-temperature fusion welding bonds UPVC/WPVC frames with immense joint strength tested up to 450 kg load.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
              <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700">03</span>
                On-Site Precision Fitting
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our field installation technicians measure with laser tools and anchor frames securely into brick or concrete walls.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* INTERACTIVE QUOTE ESTIMATOR */}
      <section id="quote" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full mb-3">
                <Calculator className="w-3.5 h-3.5" /> Instant Price Estimator
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Calculate Door & Window Cost</h3>
              <p className="text-xs text-slate-400 mt-1">Select dimensions and specifications to get instant estimation for your home or project.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Category</label>
                <select
                  value={productCategory}
                  onChange={e => setProductCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="WPVC Door">WPVC Waterproof Door (₹450 / sq ft)</option>
                  <option value="UPVC Window">UPVC Soundproof Window (₹520 / sq ft)</option>
                  <option value="Aluminium Window">Aluminium 3-Track Window (₹480 / sq ft)</option>
                  <option value="Flush Door">Waterproof Flush Door (₹380 / sq ft)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Glass / Option</label>
                <select
                  value={glassType}
                  onChange={e => setGlassType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="5mm Toughened">5mm Toughened Clear Glass</option>
                  <option value="6mm Double Glass">6mm Double Glazed Acoustic</option>
                  <option value="Frosted Privacy">Frosted Bathroom Privacy</option>
                  <option value="Solid Panel">Solid WPVC Panel (No Glass)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Width (Feet)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={width}
                  onChange={e => setWidth(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Height (Feet)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={height}
                  onChange={e => setHeight(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-bold text-center"
                />
              </div>
            </div>

            <form onSubmit={handleSendQuoteWhatsApp} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9835112345"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Send Quote Request via WhatsApp
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated Summary</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-2">
                ₹{estimatedPrice.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400 block mt-0.5">* Estimated Total (Inclusive of basic installation)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-800 pt-4 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Area:</span>
                <span className="font-bold text-white">{sqFt} Sq. Ft. / unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Rate:</span>
                <span className="font-bold text-white">₹{getRatePerSqFt()} / sq ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Units Selected:</span>
                <span className="font-bold text-white">{quantity} Door/Window(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST Registration:</span>
                <span className="font-mono text-emerald-400 font-bold">{BUSINESS_INFO.gstin}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="font-bold text-slate-200">On-Site Measurement Guarantee:</div>
              <p>Sonu Sharma & Kanha Door House technical staff will visit your premises in Jamalpur / Munger for exact measurements before cutting profiles.</p>
            </div>
          </div>

        </div>
      </section>


      {/* SHOWROOM LOCATION & CONTACT CARD */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-6">
            <div>
              <div className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Visit Shop</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Kanha Door House</h2>
              <p className="text-xs text-slate-500 mt-1">Serving Jamalpur, Munger, Bhagalpur, Lakhisarai, and all surrounding Bihar regions.</p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Address</div>
                  <div className="text-slate-600">{BUSINESS_INFO.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Phone & WhatsApp</div>
                  <div className="text-slate-600">{BUSINESS_INFO.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">GST Registration & Owner</div>
                  <div className="text-slate-600">Proprietor: <strong>{BUSINESS_INFO.owner}</strong> | GSTIN: <span className="font-mono text-emerald-700 font-bold">{BUSINESS_INFO.gstin}</span></div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`tel:${BUSINESS_INFO.phone.split('/')[0].trim()}`}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" /> Call Shop Direct
              </a>
              <a
                href="https://maps.google.com/?q=Marwadi+Mohalla+Jamalpur+Bihar"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-600" /> Get Google Directions
              </a>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <div className="font-bold text-lg text-emerald-400">Shop Business Hours</div>
                <div className="text-xs text-slate-400">Open 6 Days a Week</div>
              </div>
              <Clock className="w-6 h-6 text-slate-500" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Monday - Saturday:</span>
                <span className="font-bold text-white">9:00 AM – 8:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sunday:</span>
                <span className="font-bold text-amber-400">10:00 AM – 2:00 PM</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Field Installation Support:</span>
                <span className="font-bold text-emerald-400">Available 7 Days</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl text-xs text-slate-300 space-y-2 border border-slate-700">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Customer Satisfaction Guarantee
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                "We take pride in providing top-grade WPVC and UPVC doors that withstand Bihar's weather, heavy rain, and humidity without fading or rotting."
              </p>
              <div className="text-[10px] text-emerald-400 font-semibold">— Sonu Sharma, Proprietor</div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
