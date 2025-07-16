export const Subscription = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 bg-background text-foreground">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock the full power of Sahayak AI. Simple, transparent pricing.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {/* Basic Plan */}
        <div className="flex-1 max-w-sm bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl shadow-md p-8 flex flex-col items-center transition-all hover:scale-[1.03]">
          <h2 className="text-xl font-semibold mb-2">Basic</h2>
          <div className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Free
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-6 space-y-2">
            <li>• Limited AI queries per day</li>
            <li>• Community support</li>
            <li>• Access to basic features</li>
          </ul>
          <button className="w-full rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-2 font-medium shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition">
            Current Plan
          </button>
        </div>
        {/* Pro Plan (Highlighted) */}
        <div className="flex-1 max-w-sm bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl shadow-md p-8 flex flex-col items-center transition-all hover:scale-[1.03]">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
              Most Popular
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <div className="text-4xl font-extrabold mb-4 text-indigo-700 dark:text-indigo-300">
            $9<span className="text-lg font-medium">/mo</span>
          </div>
          <ul className="text-base text-gray-900 dark:text-gray-100 mb-8 space-y-2">
            <li>• Unlimited AI queries</li>
            <li>• Priority email support</li>
            <li>• Early access to new features</li>
            <li>• Custom AI models</li>
          </ul>
          <button className="w-full rounded-lg bg-indigo-600 dark:bg-indigo-500 py-2 text-base font-semibold text-white shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            Upgrade to Pro
          </button>
        </div>
        {/* Enterprise Plan */}
        <div className="flex-1 max-w-sm bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl shadow-md p-8 flex flex-col items-center transition-all hover:scale-[1.03]">
          <h2 className="text-xl font-semibold mb-2">Enterprise</h2>
          <div className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
            Custom
          </div>
          <ul className="text-sm text-gray-700 dark:text-gray-300 mb-6 space-y-2">
            <li>• Dedicated support</li>
            <li>• SLA & custom integrations</li>
            <li>• Team management</li>
          </ul>
          <button className="w-full rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-2 font-medium shadow-sm hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
