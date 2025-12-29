import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({ columns }) {
  return (
    <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
      {columns.map((col, index) => (
        <KanbanColumn key={index} col={col} />
      ))}
    </div>
  );
}
