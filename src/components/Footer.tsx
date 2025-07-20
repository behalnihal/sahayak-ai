export const Footer = () => {
  return (
    <footer className="py-8 max-w-7xl mx-auto px-6 flex justify-between items-center backdrop-blur-sm bg-background/50 border-t border-border/50">
      <div className="flex flex-col gap-2">
        <span className="font-bold">Sahayak AI</span>
        <span className="text-sm font-light">Made with ❤️ using Next.js</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-light">Licensed under GPL-3.0</span>
        <span className="text-sm font-light">
          © 2025 Sahayak AI | All rights reserved
        </span>
      </div>
    </footer>
  );
};
