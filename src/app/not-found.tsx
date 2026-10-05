import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-[#b85c38] mb-6">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      
      <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
        Lost in the Universe
      </h1>
      
      <p className="text-primary/70 text-lg mb-8 max-w-md mx-auto leading-relaxed">
        It seems the page you are looking for has shifted its energy and cannot be found. 
      </p>
      
      <Link 
        href="/shop" 
        className="bg-primary text-secondary text-sm tracking-[0.2em] uppercase px-8 py-4 hover:bg-accent transition-colors"
      >
        Return to the Shop
      </Link>
    </div>
  );
}
