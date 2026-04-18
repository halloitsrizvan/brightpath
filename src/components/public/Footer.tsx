'use client';
import Link from 'next/link';

export default function PublicFooter() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-12 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-12 text-center md:text-left">
                <div className="space-y-6">
                    <div className="flex items-center justify-center md:items-start md:justify-start gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg">B</div>
                        <span className="text-2xl font-black tracking-tighter text-gray-900 leading-none">BRIGHTPATH</span>
                    </div>
                    <p className="text-gray-400 font-bold text-sm leading-relaxed px-4 md:px-0">
                        Kerala's premier 1:1 online mentorship academy for personalized academic excellence from KG to 12.
                    </p>
                </div>

                <div>
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-8 md:mb-10 text-primary">Quick Navigation</h4>
                    <ul className="space-y-4">
                        {['About', 'Tutors', 'Subjects', 'Services', 'Blog', 'Contact'].map(f => (
                            <li key={f}>
                                <Link href={`/${f.toLowerCase()}`} className="text-gray-400 font-bold text-sm hover:text-primary transition-colors italic uppercase tracking-widest text-[11px]">
                                    {f}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-8 md:mb-10 text-primary">Institutional Policy</h4>
                    <ul className="space-y-4">
                        {['Privacy Registry', 'Terms of Service', 'Cookie Directive', 'Student Safety'].map(f => (
                            <li key={f}>
                                <a href="#" className="text-gray-400 font-bold text-sm hover:text-primary transition-colors italic uppercase tracking-widest text-[11px]">
                                    {f}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">© 2026 BRIGHTPATH KERALA | ACADEMIC CORE</p>
                <div className="flex gap-6">
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">Instagram</a>
                    <a href="#" className="text-gray-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}
