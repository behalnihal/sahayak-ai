export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="min-w-0">
          <span className="block text-base font-semibold tracking-tight">
            Sahayak AI
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            Built with Next.js for focused AI-assisted learning.
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted-foreground md:items-end md:text-right">
          <span>Licensed under GPL-3.0</span>
          <span>© 2025 Sahayak AI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
