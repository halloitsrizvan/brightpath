'use client';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
    const phoneNumber = "+918590878148";
    const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=Hi%20Brightpath%2C%20I%20need%20support%20regarding%20your%20academic%20programs.`;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
            {/* WhatsApp Button */}
            <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all group relative"
            >
                <MessageCircle className="w-7 h-7" />
                <span className="absolute right-full mr-4 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-gray-100 italic">
                    WhatsApp Us
                </span>
            </a>

            {/* Call Button */}
            <a 
                href={`tel:${phoneNumber}`}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all group relative"
            >
                <Phone className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap border border-gray-100 italic">
                    Call Center
                </span>
            </a>
        </div>
    );
}
