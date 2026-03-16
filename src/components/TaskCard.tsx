import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../App';

type TaskCardProps = {
  task: Task;
  isDragging?: boolean;
  onDelete?: () => void;
};

const priorityConfig = {
  LOW: { bg: 'bg-gray-200', text: 'text-gray-700', label: 'LOW' },
  MED: { bg: 'bg-warning', text: 'text-black', label: 'MEDIUM' },
  HIGH: { bg: 'bg-orange', text: 'text-white', label: 'HIGH' },
  CRIT: { bg: 'bg-black', text: 'text-white', label: 'CRITICAL' },
};

export default function TaskCard({ task, isDragging = false, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const priority = priorityConfig[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white border-4 border-black
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        ${isDragging ? 'shadow-brutal-lg opacity-90 z-50' : 'shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1'}
        touch-manipulation
        group relative
      `}
    >
      {/* Work Order Header */}
      <div className="border-b-4 border-black p-2 md:p-3 flex items-center justify-between bg-gray-100">
        <span className="font-mono text-xs md:text-sm font-bold tracking-wider">{task.code}</span>
        <span className="font-mono text-[10px] md:text-xs text-gray-600">{task.timestamp}</span>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <p className="font-mono text-sm md:text-base leading-tight mb-3 md:mb-4 pr-6">
          {task.title}
        </p>

        {/* Priority Stamp */}
        <div className="flex items-center justify-between">
          <div className={`
            ${priority.bg} ${priority.text}
            px-2 md:px-3 py-1 border-4 border-black
            font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest
            transform -rotate-2
          `}>
            {priority.label}
          </div>

          {/* Stamp Effect */}
          <div className="relative">
            <div className={`
              w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-dashed
              flex items-center justify-center
              ${task.priority === 'CRIT' ? 'border-red-600 text-red-600' : 'border-gray-400 text-gray-400'}
              transform rotate-12
            `}>
              <span className="font-display text-[8px] md:text-[10px] uppercase tracking-tight leading-none text-center">
                WORK<br />ORDER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button - appears on hover/touch */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`
            absolute top-2 right-2 w-8 h-8 md:w-7 md:h-7
            bg-black text-white border-2 border-black
            font-mono text-xs font-bold
            opacity-100 md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-150
            hover:bg-red-600 hover:border-red-600
            flex items-center justify-center
            z-10
          `}
          aria-label="Delete task"
        >
          X
        </button>
      )}

      {/* Corner Fold Effect */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[16px] md:border-l-[20px] border-l-transparent border-b-[16px] md:border-b-[20px] border-b-gray-300" />
    </div>
  );
}
