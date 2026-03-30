import { BookOpen, GraduationCap, Layers, Users } from 'lucide-react';
import { ReactNode } from 'react';

export default function StatsSection() {
  return (
    <section className="w-full px-4 py-4 dark:bg-gray-800 mb-3">
      <div className="w-full flex justify-center-center flex-col items-center px-4">
        <div className="flex w-full flex-wrap justify-center gap-3 md:gap-5 py-6 shadow-[5px_5px_0_0_hsl(var(--foreground))] border-3 rounded-2xl">
          <StatsCard
            icon={<Users className="h-10 w-10 text-black" />}
            title="1M+"
            text="Users Worldwide"
            iconBgColor="bg-neo-magenta"
          />
          <StatsCard
            icon={<Layers className="h-10 w-10 text-black" />}
            title="500K+"
            text="Lessons Completed"
            iconBgColor="bg-neo-teal"
          />
          <StatsCard
            icon={<BookOpen className="h-10 w-10 text-black" />}
            title="150+"
            text="Countries Reached"
            iconBgColor="bg-neo-blue"
          />
          <StatsCard
            icon={<GraduationCap className="h-10 w-10 text-black" />}
            title="95%+"
            text="Success Rate"
            iconBgColor="bg-neo-coral"
          />
        </div>
      </div>
    </section>
  );
}

function StatsCard({
  icon,
  title,
  text,
  iconBgColor,
}: {
  icon?: ReactNode;
  title: string;
  text: string;
  iconBgColor?: string;
}) {
  return (
    <div className="flex w-full max-w-70 flex-col lg:w-70 items-center rounded-lg p-4">
      <div
        className={`mb-4 ${iconBgColor || 'bg-blue-100'} rounded-xl p-2 border-3 shadow-[3px_3px_0_0_hsl(var(--foreground))]`}
      >
        {icon}
      </div>
      <h3 className="text-5xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 font-medium">{text}</p>
    </div>
  );
}
