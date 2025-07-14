export const Footer = () => {
  return (
    <footer className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center backdrop-blur-md bg-background/50 border-t">
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
