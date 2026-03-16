import { useDroppable } from '@dnd-kit/core';
import type { ColumnType, Task } from '../App';
import TaskCard from './TaskCard';

type ColumnProps = {
  column: ColumnType;
  index: number;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
};

const columnColors = ['bg-white', 'bg-warning', 'bg-orange', 'bg-white'];
const columnTextColors = ['text-black', 'text-black', 'text-white', 'text-black'];

export default function Column({ column, index, onAddTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 min-w-[280px] md:min-w-[300px] max-w-full md:max-w-[400px]
        border-6 border-black
        ${columnColors[index % columnColors.length]}
        transition-all duration-150
        ${isOver ? 'scale-[1.02] shadow-brutal-lg' : 'shadow-brutal'}
        flex flex-col
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Column Header */}
      <div className={`
        border-b-6 border-black p-3 md:p-4
        ${index === 3 ? 'bg-black' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <span className={`
              font-display text-2xl md:text-3xl uppercase tracking-tight
              ${index === 3 ? 'text-white' : columnTextColors[index % columnTextColors.length]}
            `}>
              {column.title}
            </span>
            <span className={`
              font-mono text-xs px-2 py-1 border-4 border-black bg-white text-black
            `}>
              {column.tasks.length}
            </span>
          </div>
          <div className={`
            w-3 h-3 md:w-4 md:h-4 rounded-full border-4 border-black
            ${index === 0 ? 'bg-gray-400' : ''}
            ${index === 1 ? 'bg-warning animate-pulse' : ''}
            ${index === 2 ? 'bg-orange' : ''}
            ${index === 3 ? 'bg-green-500' : ''}
          `} />
        </div>
        <p className={`
          font-mono text-[10px] md:text-xs uppercase tracking-widest mt-1
          ${index === 3 ? 'text-gray-400' : 'text-gray-600'}
        `}>
          SECTOR {String(index + 1).padStart(2, '0')} // {column.id.toUpperCase().replace('-', '_')}
        </p>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-3 md:p-4 space-y-3 md:space-y-4 overflow-y-auto min-h-[200px] max-h-[60vh] md:max-h-none">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => onDeleteTask(task.id)} />
        ))}

        {column.tasks.length === 0 && (
          <div className="border-4 border-dashed border-gray-400 p-4 md:p-6 text-center">
            <p className="font-mono text-xs text-gray-500 uppercase">
              NO ACTIVE WORK ORDERS
            </p>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className={`
          border-t-6 border-black p-3 md:p-4
          font-mono text-sm uppercase tracking-widest font-bold
          hover:bg-black hover:text-white
          transition-colors duration-150
          ${index === 3 ? 'bg-gray-900 text-white hover:bg-gray-700' : 'bg-white text-black'}
          active:scale-95 min-h-[48px]
        `}
      >
        + ADD WORK ORDER
      </button>
    </div>
  );
}
