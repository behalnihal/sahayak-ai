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
    <section className="px-6 py-5 relative bg-background text-foreground">
      <div className="max-w-6xl mx-auto text-center relative z-[1]">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Features</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-14">
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
                className="group bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl transition-transform hover:scale-[1.02] hover:border-white/20 shadow-md"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
