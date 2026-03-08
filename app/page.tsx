import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
            B
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">BrightPath</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-medium text-gray-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-primary transition-colors">About Us</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-secondary/10 -z-10" />
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
            Empower your education journey with <span className="text-primary relative inline-block">BrightPath<span className="absolute -bottom-2 left-0 w-full h-3 bg-secondary/40 rounded-full -z-10"></span></span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            The complete tuition management system designed specifically for students, teachers, and administration. Seamlessly track progress, attendance, and growth all in one simple platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Link href="/student" className="group w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/95 transition-all text-center flex items-center justify-center gap-2">
              Student Portal
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/teacher" className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 font-bold rounded-xl hover:border-secondary hover:text-primary transition-all text-center flex items-center justify-center gap-2">
              Teacher Portal
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors underline decoration-gray-300 underline-offset-4">
              Administrator Login
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">Everything you need to succeed.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Attendance Tracking</h3>
              <p className="text-gray-600 leading-relaxed">No more manual WhatsApp messages. Track your uncompromised attendance accurately.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-secondary/20 text-yellow-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Reports</h3>
              <p className="text-gray-600 leading-relaxed">Instantly download monthly exam progress reports and teacher evaluations directly in PDF.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Planning</h3>
              <p className="text-gray-600 leading-relaxed">Automated salary tracking for teachers and simple fee management for parents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-center text-gray-400 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <h4 className="text-xl font-bold text-white tracking-widest mb-4">BrightPath</h4>
          <p className="text-sm">© 2026 BrightPath Tuition Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
