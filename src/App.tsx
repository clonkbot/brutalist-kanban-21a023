import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './components/Column';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import './styles.css';

export type Task = {
  id: string;
  title: string;
  priority: 'LOW' | 'MED' | 'HIGH' | 'CRIT';
  code: string;
  timestamp: string;
};

export type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

const generateCode = () => `WO-${Math.floor(Math.random() * 9000 + 1000)}`;
const generateTimestamp = () => {
  const now = new Date();
  return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
};

const initialColumns: ColumnType[] = [
  {
    id: 'backlog',
    title: 'BACKLOG',
    tasks: [
      { id: '1', title: 'Review structural integrity report', priority: 'MED', code: 'WO-4521', timestamp: '2024.01.15' },
      { id: '2', title: 'Order reinforced steel beams', priority: 'HIGH', code: 'WO-4522', timestamp: '2024.01.14' },
    ],
  },
  {
    id: 'in-progress',
    title: 'IN PROGRESS',
    tasks: [
      { id: '3', title: 'Foundation excavation phase 2', priority: 'CRIT', code: 'WO-4518', timestamp: '2024.01.12' },
      { id: '4', title: 'Electrical conduit installation', priority: 'MED', code: 'WO-4519', timestamp: '2024.01.13' },
    ],
  },
  {
    id: 'review',
    title: 'REVIEW',
    tasks: [
      { id: '5', title: 'Safety compliance audit', priority: 'HIGH', code: 'WO-4515', timestamp: '2024.01.10' },
    ],
  },
  {
    id: 'done',
    title: 'COMPLETE',
    tasks: [
      { id: '6', title: 'Site perimeter fencing', priority: 'LOW', code: 'WO-4510', timestamp: '2024.01.08' },
    ],
  },
];

export default function App() {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string>('backlog');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const findColumn = useCallback((taskId: string) => {
    return columns.find(col => col.tasks.some(task => task.id === taskId));
  }, [columns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const column = findColumn(active.id as string);
    if (column) {
      const task = column.tasks.find(t => t.id === active.id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = findColumn(activeId);
    let destColumn = columns.find(col => col.id === overId);

    if (!destColumn) {
      destColumn = findColumn(overId);
    }

    if (!sourceColumn || !destColumn) return;

    if (sourceColumn.id === destColumn.id) {
      return;
    }

    const task = sourceColumn.tasks.find(t => t.id === activeId);
    if (!task) return;

    setColumns(prev => prev.map(col => {
      if (col.id === sourceColumn.id) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== activeId) };
      }
      if (col.id === destColumn.id) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    }));
  };

  const handleAddTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      code: generateCode(),
      timestamp: generateTimestamp(),
    };

    setColumns(prev => prev.map(col => {
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, newTask] };
      }
      return col;
    }));
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    })));
  };

  const openAddModal = (columnId: string) => {
    setTargetColumnId(columnId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-concrete relative overflow-hidden flex flex-col">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <header className="relative z-10 border-b-6 border-black bg-white p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-5xl uppercase tracking-tighter">
              KANBAN<span className="text-warning">.</span>BOARD
            </h1>
            <p className="font-mono text-xs md:text-sm uppercase tracking-widest text-gray-600 mt-1">
              WORK ORDER MANAGEMENT SYSTEM // REV.03
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block border-4 border-black px-4 py-2 bg-warning">
              <span className="font-mono text-xs font-bold">ACTIVE TASKS: {columns.reduce((acc, col) => acc + col.tasks.length, 0)}</span>
            </div>
            <div className="border-4 border-black px-4 py-2 bg-black text-white">
              <span className="font-mono text-xs font-bold">STATUS: ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Board */}
      <main className="relative z-10 flex-1 p-4 md:p-6 lg:p-8 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-full pb-20">
            {columns.map((column, index) => (
              <SortableContext
                key={column.id}
                items={column.tasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  column={column}
                  index={index}
                  onAddTask={() => openAddModal(column.id)}
                  onDeleteTask={handleDeleteTask}
                />
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 scale-105">
                <TaskCard task={activeTask} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-black bg-white px-4 py-3 text-center">
        <p className="font-mono text-xs text-gray-500 tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
