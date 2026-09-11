'use client';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
    const phoneNumber = "+918590878148";
    const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=Hi%20Brightpath%2C%20I%20need%20support%20regarding%20your%20academic%20programs.`;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
            <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all group relative"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute right-full mr-3 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                    WhatsApp Us
                </span>
            </a>

            <a 
                href={`tel:${phoneNumber}`}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all group relative"
            >
                <Phone className="w-5 h-5" />
                <span className="absolute right-full mr-3 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                    Call Us
                </span>
            </a>
        </div>
    );
}
