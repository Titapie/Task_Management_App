import { Clock, Users } from "lucide-react";

export default function TaskDetailContent() {
  return (
    <div className="space-y-6">
      {/* Video */}
      <div className="rounded-2xl overflow-hidden">
        <video
          controls
          className="w-full h-[360px] object-cover rounded-2xl"
          poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
        />
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Creating Awesome Mobile Apps
      </h2>

      <div className="flex gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Users size={14} /> 230 Students Involved
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} /> 1 Hour
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Description
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Follow the video tutorial above. Understand how to use each tool in
          the Figma application. Learn how to make a good and correct design.
          Starting from spacing, typography, content, and many other design
          hierarchies.
        </p>
      </div>

      {/* Essence */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white">
          Essence of Assessment
        </h3>
        <ul className="space-y-2 text-sm text-slate-500">
          <li>• Understanding the tools in Figma</li>
          <li>• Understanding the basics of making designs</li>
          <li>• Designing a mobile application using Figma</li>
          <li>• Presenting the design flow</li>
        </ul>
      </div>
    </div>
  );
}
