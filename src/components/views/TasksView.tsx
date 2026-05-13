import React, { useState } from 'react';
import { 
  CheckCircle, 
  Trash2, 
  Calendar, 
  Sparkles, 
  X, 
  Circle, 
  Flame, 
  Minus, 
  ArrowDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  theme: 'dark' | 'light';
  lang: 'az' | 'en';
  t: (az: string, en: string) => string;
  isTaskSaving: boolean;
  addTask: (title: string, dueDate: string, priority: string, category: string) => Promise<void>;
  toggleTask: (taskId: string, currentStatus: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  theme,
  lang,
  t,
  isTaskSaving,
  addTask,
  toggleTask,
  deleteTask
}) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskCategory, setNewCategory] = useState<'personal' | 'work' | 'health' | 'other'>('personal');

  const PRIORITY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    high:   { label: t("Yüksək", "High"), icon: <Flame size={12} />,    color: "text-red-400 bg-red-400/10" },
    medium: { label: t("Orta", "Medium"),   icon: <Minus size={12} />,    color: "text-yellow-400 bg-yellow-400/10" },
    low:    { label: t("Aşağı", "Low"),  icon: <ArrowDown size={12} />, color: "text-teal-400 bg-teal-400/10" },
  };

  const CATEGORY_CONFIG: Record<string, { label: string; emoji: string }> = {
    personal: { label: t("Şəxsi", "Personal"),     emoji: "👤" },
    work:     { label: t("İş", "Work"),        emoji: "💼" },
    health:   { label: t("Sağlamlıq", "Health"), emoji: "💚" },
    other:    { label: t("Digər", "Other"),     emoji: "📌" },
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const doneTasks   = tasks.filter(t =>  t.completed);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, newTaskDueDate, newTaskPriority, newTaskCategory);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    setNewPriority("medium");
    setNewCategory("personal");
    setIsTaskModalOpen(false);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const pCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const cCfg = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.other;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 rounded-[28px] border transition-all duration-200 ${
          task.completed
            ? "bg-white/3 border-white/5 opacity-60"
            : `glass ${theme === 'dark' ? 'glass-dark bg-[#0E1521] border-white/10' : 'glass-light bg-white border-navy/5'} hover:border-teal-brand/30`
        }`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={() => toggleTask(task.id, task.completed)}
            className={`mt-0.5 flex-shrink-0 transition-colors ${
              task.completed ? "text-teal-brand" : "text-white/30 hover:text-white/60"
            }`}
          >
            {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-black leading-snug ${
              task.completed ? "line-through opacity-40" : ""
            }`}>
              {task.title}
            </h4>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${pCfg.color}`}>
                {pCfg.icon}
                {pCfg.label}
              </span>
              <span className="text-[10px] font-bold opacity-30">
                {cCfg.emoji} {cCfg.label}
              </span>
              {task.dueDate && (
                <span className="text-[10px] font-bold opacity-30 flex items-center gap-1">
                  <Calendar size={10} />
                  {task.dueDate}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0 p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{t("Tapşırıqlar", "Tasks")}</h2>
          <p className="text-xs font-bold opacity-40">{t("Gündəlik hədəf və planlarınız", "Your daily goals and plans")}</p>
        </div>
        <motion.button
          onClick={() => setIsTaskModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-2xl bg-teal-brand text-navy flex items-center justify-center shadow-lg shadow-teal-brand/20"
        >
          <Sparkles size={20} />
        </motion.button>
      </div>

      {tasks.length === 0 ? (
        <div className={`p-12 rounded-[40px] text-center space-y-4 glass ${theme === 'dark' ? 'bg-white/5' : 'bg-navy/5'}`}>
          <div className="w-16 h-16 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mx-auto">
            <CheckSquare size={32} />
          </div>
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{t("Heç bir tapşırıq yoxdur", "No tasks yet")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTasks.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </AnimatePresence>
            </div>
          )}

          {doneTasks.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] px-1">
                {t("TAMAMLANMIŞ", "DONE")} · {doneTasks.length}
              </p>
              <AnimatePresence mode="popLayout">
                {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isTaskModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsTaskModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 border shadow-2xl ${theme === 'dark' ? 'bg-[#0E1521] border-white/10' : 'bg-white border-navy/10'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black">{t("Yeni Tapşırıq", "New Task")}</h3>
                <button onClick={() => setIsTaskModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("Nə etməlisən?", "What to do?")}</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder={t("Məsələn: 10 dəqiqə meditasiya", "e.g. 10 min meditation")}
                    className={`w-full p-4 rounded-2xl text-sm font-bold border outline-none focus:border-teal-brand/50 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/10'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("Son tarix", "Due date")}</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-xs font-bold border outline-none focus:border-teal-brand/50 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/10'}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("Prioritet", "Priority")}</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e: any) => setNewPriority(e.target.value)}
                      className={`w-full p-4 rounded-2xl text-xs font-bold border outline-none appearance-none focus:border-teal-brand/50 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-navy/5 border-navy/10'}`}
                    >
                      <option value="high">{t("Yüksək", "High")}</option>
                      <option value="medium">{t("Orta", "Medium")}</option>
                      <option value="low">{t("Aşağı", "Low")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("Kateqoriya", "Category")}</label>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {(["personal", "work", "health", "other"] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setNewCategory(c)}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
                          newTaskCategory === c
                            ? "bg-teal-brand text-navy shadow-lg shadow-teal-brand/20"
                            : theme === 'dark' ? 'bg-white/5 text-white/40' : 'bg-navy/5 text-navy/40'
                        }`}
                      >
                        {CATEGORY_CONFIG[c].emoji} {CATEGORY_CONFIG[c].label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle || isTaskSaving}
                  className="w-full py-5 rounded-2xl bg-teal-brand text-navy text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-brand/30 disabled:opacity-30 transition-all active:scale-95"
                >
                  {isTaskSaving ? t("ƏLAVƏ EDİLİR...", "ADDING...") : t("ƏLAVƏ ET", "ADD TASK")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksView;
