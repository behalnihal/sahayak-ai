export const Subscription = () => {
  return (
    <section className="relative bg-background/30 backdrop-blur-sm border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the full power of Sahayak AI. Simple, transparent pricing.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Basic Plan */}
          <div className="flex-1 max-w-sm bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl shadow-sm p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:border-border hover:shadow-lg hover:bg-card/70">
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Basic
            </h3>
            <div className="text-3xl font-bold mb-4 text-primary">Free</div>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li>• Limited AI queries per day</li>
              <li>• Community support</li>
              <li>• Access to basic features</li>
            </ul>
            <button className="w-full rounded-lg bg-primary/10 text-primary py-2 font-medium shadow-sm hover:bg-primary/20 transition-colors">
              Current Plan
            </button>
          </div>
          {/* Pro Plan (Highlighted) */}
          <div className="flex-1 max-w-sm bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl shadow-sm p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:border-border hover:shadow-lg hover:bg-card/70 relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-semibold shadow">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Pro</h3>
            <div className="text-4xl font-extrabold mb-4 text-primary">
              $9<span className="text-lg font-medium">/mo</span>
            </div>
            <ul className="text-base text-foreground mb-8 space-y-2">
              <li>• Unlimited AI queries</li>
              <li>• Priority email support</li>
              <li>• Early access to new features</li>
              <li>• Custom AI models</li>
            </ul>
            <button className="w-full rounded-lg bg-primary py-2 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
              Upgrade to Pro
            </button>
          </div>
          {/* Enterprise Plan */}
          <div className="flex-1 max-w-sm bg-card/50 border border-border/50 backdrop-blur-sm rounded-2xl shadow-sm p-8 flex flex-col items-center transition-all duration-300 hover:scale-[1.02] hover:border-border hover:shadow-lg hover:bg-card/70">
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Enterprise
            </h3>
            <div className="text-3xl font-bold mb-4 text-primary">Custom</div>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li>• Dedicated support</li>
              <li>• SLA & custom integrations</li>
              <li>• Team management</li>
            </ul>
            <button className="w-full rounded-lg bg-primary/10 text-primary py-2 font-medium shadow-sm hover:bg-primary/20 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
