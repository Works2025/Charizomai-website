import { ChevronRight } from 'lucide-react';

export default function TrustBar() {
    const items = [
        { text: "10,000+ Donors" },
        { text: "100% Transparent" },
        { text: "Direct to Beneficiaries" },
        { text: "Verified Campaigns" }
    ];

    return (
        <div className="trust-bar">
            <div className="container trust-grid">
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="trust-item">
                            {item.text}
                        </div>
                        {index < items.length - 1 && (
                            <ChevronRight
                                size={18}
                                color="#7F8C8D"
                                strokeWidth={2}
                                style={{ flexShrink: 0, opacity: 0.5 }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
