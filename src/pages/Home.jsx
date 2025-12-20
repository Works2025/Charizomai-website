import Hero from '../components/Hero';
import ImpactHighlights from '../components/ImpactHighlights';
import FeaturedCampaigns from '../components/FeaturedCampaigns';
import DiscoverGrid from '../components/DiscoverGrid';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';

import PartnersSection from '../components/PartnersSection';
import NewsletterSection from '../components/NewsletterSection';
import GetInvolvedSection from '../components/GetInvolvedSection';
import PreFooter from '../components/PreFooter';
import ChatBot from '../components/ChatBot';

export default function Home() {
    return (
        <main>
            <Hero />
            <ImpactHighlights />
            <FeaturedCampaigns />
            <DiscoverGrid />
            <StatsSection />
            <TestimonialsSection />

            <PartnersSection />
            <NewsletterSection />
            <GetInvolvedSection />
            <PreFooter />
            <ChatBot />
        </main>
    );
}
