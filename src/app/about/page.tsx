import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors mb-12">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="font-serif text-4xl md:text-5xl mb-8 tracking-widest text-primary">About Us</h1>
        
        <div className="prose prose-stone mx-auto max-w-none text-primary/80 leading-relaxed text-left md:text-center space-y-8">
          <p className="text-lg">
            At Riya Tarot Crystals, we believe in the profound intersection of natural beauty and spiritual intention. 
            Born from a deep passion for tarot, astrology, and the healing arts, our brand is dedicated to offering 
            more than just jewelry—we offer wearable daily intentions.
          </p>

          <p>
            Every crystal is unique, carrying its own vibrational energy formed over thousands of years deep within the earth. 
            We meticulously hand-select our stones to ensure they are of the highest quality, both aesthetically and energetically. 
            Whether you are seeking abundance with Citrine, protection with Black Obsidian, or unconditional love with Rose Quartz, 
            our pieces are designed to serve as a physical anchor for your spiritual goals.
          </p>

          <p>
            Our process is deeply rooted in authenticity. We cleanse and energize each piece before it reaches you, 
            ensuring it arrives ready to attune to your unique frequency. We invite you to wear these crystals not just 
            as accessories, but as powerful tools for transformation, healing, and self-discovery.
          </p>
          
          <div className="pt-8">
            <h3 className="font-serif text-2xl mb-4 text-primary">Our Mission</h3>
            <p>
              To empower individuals on their spiritual journey by providing ethically sourced, deeply intentional crystal jewelry 
              that beautifully bridges the gap between ancient wisdom and modern everyday style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
