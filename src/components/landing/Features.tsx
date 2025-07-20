import { BrainCircuit, FileQuestion, FileText } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Mindmap Generator",
    desc: "Turn complex topic into clean, interactive visual mindmaps using AI.",
  },
  {
    icon: FileQuestion,
    title: "MCQ Generator",
    desc: "Create engaging MCQ tests from your notes to test your understanding.",
  },
  {
    icon: FileText,
    title: "Summary Generator",
    desc: "Generate concise summaries from your notes to help you retain information better.",
  },
];

export const Features = () => {
  return (
    <section className="relative bg-background/50 backdrop-blur-sm border-y border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-24 text-center relative z-[1]">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Features
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
          Our platform is designed to help you learn and retain information
          effectively. We offer a range of features that are tailored to your
          learning style and needs.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group bg-card/50 border border-border/50 backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:border-border hover:shadow-lg hover:bg-card/70"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
