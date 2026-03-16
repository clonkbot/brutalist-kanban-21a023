import { useState } from 'react';
import type { Task } from '../App';

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, priority: Task['priority']) => void;
};

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('MED');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority);
      setTitle('');
      setPriority('MED');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border-6 border-black shadow-brutal-lg w-full max-w-md animate-modal-in">
        {/* Header */}
        <div className="border-b-6 border-black p-4 bg-warning flex items-center justify-between">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight">
            NEW WORK ORDER
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black text-white font-mono text-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            X
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Title Input */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-gray-600">
              WORK ORDER DESCRIPTION
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task description..."
              className="w-full border-4 border-black p-3 md:p-4 font-mono text-sm resize-none focus:outline-none focus:border-warning h-24 md:h-32"
              autoFocus
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-gray-600">
              PRIORITY LEVEL
            </label>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {(['LOW', 'MED', 'HIGH', 'CRIT'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`
                    border-4 border-black p-3 font-mono text-xs md:text-sm font-bold uppercase
                    transition-all duration-150 min-h-[48px]
                    ${priority === p ? 'shadow-brutal-sm -translate-y-1' : ''}
                    ${p === 'LOW' ? 'bg-gray-200 text-gray-700' : ''}
                    ${p === 'MED' ? 'bg-warning text-black' : ''}
                    ${p === 'HIGH' ? 'bg-orange text-white' : ''}
                    ${p === 'CRIT' ? 'bg-black text-white' : ''}
                    hover:-translate-y-1 hover:shadow-brutal-sm
                  `}
                >
                  {p === 'MED' ? 'MEDIUM' : p === 'CRIT' ? 'CRITICAL' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title.trim()}
            className={`
              w-full border-6 border-black p-4 font-display text-xl uppercase
              transition-all duration-150 min-h-[56px]
              ${title.trim()
                ? 'bg-black text-white hover:bg-warning hover:text-black shadow-brutal hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            CREATE WORK ORDER
          </button>
        </form>

        {/* Footer */}
        <div className="border-t-4 border-black p-3 bg-gray-100">
          <p className="font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-widest text-center">
            FORM // WO-CREATE-V3.2
          </p>
        </div>
      </div>
    </div>
  );
}
