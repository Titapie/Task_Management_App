import { Clock } from "lucide-react";

export default function UpcomingTask() {
  const tasks = [
    {
      id: 1,
      title: "Creating Mobile App Design",
      category: "UI/UX Design",
      progress: 75,
      days: 3,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400",
    },
    {
      id: 2,
      title: "Creating 3D Illustration",
      category: "Graphic Design",
      progress: 40,
      days: 5,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Upcoming Task
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-900 p-4 rounded-[32px] card-shadow transition-colors"
          >
            {/* Image */}
            <div className="aspect-[16/9] rounded-[24px] overflow-hidden mb-4">
              <img
                src={task.image}
                className="w-full h-full object-cover"
                alt={task.title}
              />
            </div>

            {/* Title */}
            <h4 className="font-bold text-slate-900 dark:text-white">
              {task.title}
            </h4>
            <p className="text-xs text-slate-400 mb-4">{task.category}</p>

            {/* Progress */}
            <div className="flex justify-between text-xs font-bold mb-2 text-slate-900 dark:text-white">
              <span>Progress</span>
              <span className="text-indigo-600">{task.progress}%</span>
            </div>

            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${task.progress}%` }}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                <Clock size={14} className="text-slate-400" />
                {task.days} Days Left
              </div>

              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="team"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
