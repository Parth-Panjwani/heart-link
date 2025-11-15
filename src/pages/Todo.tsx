import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Flag,
  Tag,
  FileText,
  AlertCircle,
  Eye,
  Users,
  User,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDialogTriggers } from "@/components/FloatingActionButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { todosApi, Todo as TodoType } from "@/lib/api";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  notes?: string;
  isShared?: boolean;
  userId?: string;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-secondary" },
  { value: "medium", label: "Medium", color: "text-primary" },
  { value: "high", label: "High", color: "text-destructive" },
];

const CATEGORY_OPTIONS = [
  "School",
  "Home",
  "Personal",
  "Health",
  "Shopping",
  "Other",
];

const Todo = () => {
  const { registerTodoDialog } = useDialogTriggers();
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [newCategory, setNewCategory] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [editCategory, setEditCategory] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [viewingNotesId, setViewingNotesId] = useState<string | null>(null);

  // Register dialog trigger function
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    registerTodoDialog(openDialog);
  }, [registerTodoDialog, openDialog]);

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await todosApi.getAll(user.id);
      if (result.success && result.data) {
        setTodos(result.data);
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewTodo("");
    setNewDueDate("");
    setNewPriority("medium");
    setNewCategory("");
    setNewNotes("");
    setIsShared(false);
    setEditingId(null);
    setEditText("");
    setEditDueDate("");
    setEditPriority("medium");
    setEditCategory("");
    setEditNotes("");
    setIsOpen(false);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast.error("Please enter a task");
      return;
    }

    if (!user) {
      toast.error("Please log in");
      return;
    }

    try {
      const result = await todosApi.create({
        userId: user.id,
        text: newTodo.trim(),
        completed: false,
        dueDate: newDueDate || undefined,
        priority: newPriority,
        category: newCategory || undefined,
        notes: newNotes.trim() || undefined,
        isShared: isShared,
      });

      if (result.success && result.data) {
        toast.success(isShared ? "Together Task added!" : "Task added!");
        await loadTodos();
        resetForm();
      } else {
        toast.error(result.error || "Failed to add task");
      }
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const result = await todosApi.update(id, {
        userId: user.id,
        completed: !todo.completed,
      });

      if (result.success) {
        await loadTodos();
      } else {
        toast.error(result.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;
    try {
      const result = await todosApi.delete(id, user.id);
      if (result.success) {
        toast.success("Task deleted");
        await loadTodos();
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const openEditDialog = (todo: TodoType) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate || "");
    setEditPriority(todo.priority || "medium");
    setEditCategory(todo.category || "");
    setEditNotes(todo.notes || "");
    setIsOpen(true);
  };

  const saveEdit = async () => {
    if (!editText.trim() || !editingId || !user) return;

    try {
      const result = await todosApi.update(editingId, {
        userId: user.id,
        text: editText.trim(),
        dueDate: editDueDate || undefined,
        priority: editPriority,
        category: editCategory || undefined,
        notes: editNotes.trim() || undefined,
      });

      if (result.success) {
        toast.success("Task updated!");
        await loadTodos();
        resetForm();
      } else {
        toast.error(result.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return (
      new Date(dueDate) < new Date() &&
      new Date(dueDate).toDateString() !== new Date().toDateString()
    );
  };

  const isDueToday = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate).toDateString() === new Date().toDateString();
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const personalTodos = todos.filter((t) => !t.isShared);
  const sharedTodos = todos.filter((t) => t.isShared);

  const sortTodos = (todos: TodoType[]) =>
    todos.sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[b.priority || "medium"] || 0) -
        (priorityOrder[a.priority || "medium"] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      // Then by due date (overdue first, then soonest)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });

  const activePersonalTodos = sortTodos([
    ...personalTodos.filter((t) => !t.completed),
  ]);
  const completedPersonalTodos = personalTodos.filter((t) => t.completed);

  const activeSharedTodos = sortTodos([
    ...sharedTodos.filter((t) => !t.completed),
  ]);
  const completedSharedTodos = sharedTodos.filter((t) => t.completed);

  return (
    <div className="min-h-screen pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Space Tasks
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activePersonalTodos.length + activeSharedTodos.length} active,{" "}
                {completedPersonalTodos.length + completedSharedTodos.length}{" "}
                completed
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) {
              resetForm();
            } else {
              setIsOpen(true);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Task" : "Add New Task"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!editingId && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    {isShared ? (
                      <Users className="w-5 h-5 text-primary" />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label className="text-sm font-medium">
                        {isShared ? "Shared Task" : "Personal Task"}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {isShared
                          ? "Visible to all space members"
                          : "Only visible to you"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={isShared} onCheckedChange={setIsShared} />
                </div>
              )}
              <div>
                <Label htmlFor="task-text">Task</Label>
                <Input
                  id="task-text"
                  value={editingId ? editText : newTodo}
                  onChange={(e) => {
                    if (editingId) {
                      setEditText(e.target.value);
                    } else {
                      setNewTodo(e.target.value);
                    }
                  }}
                  placeholder="What needs to be done?"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={editingId ? editDueDate : newDueDate}
                    onChange={(e) => {
                      if (editingId) {
                        setEditDueDate(e.target.value);
                      } else {
                        setNewDueDate(e.target.value);
                      }
                    }}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={editingId ? editPriority : newPriority}
                    onValueChange={(value: "low" | "medium" | "high") => {
                      if (editingId) {
                        setEditPriority(value);
                      } else {
                        setNewPriority(value);
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          <div className="flex items-center gap-2">
                            <Flag className={`w-4 h-4 ${p.color}`} />
                            <span>{p.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingId ? editCategory : newCategory}
                  onValueChange={(value) => {
                    if (editingId) {
                      setEditCategory(value);
                    } else {
                      setNewCategory(value);
                    }
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={editingId ? editNotes : newNotes}
                  onChange={(e) => {
                    if (editingId) {
                      setEditNotes(e.target.value);
                    } else {
                      setNewNotes(e.target.value);
                    }
                  }}
                  placeholder="Add any additional notes..."
                  className="mt-2 min-h-[80px] resize-none"
                />
              </div>

              <Button
                onClick={editingId ? saveEdit : addTodo}
                className="w-full"
              >
                {editingId ? "Update Task" : "Add Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Together Tasks (Shared) */}
        {activeSharedTodos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Shared Tasks
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks visible to everyone in your space
              </p>
            </div>
            <div className="space-y-2">
              {activeSharedTodos.map((todo) => {
                const daysUntil = getDaysUntilDue(todo.dueDate);
                const overdue = isOverdue(todo.dueDate);
                const dueToday = isDueToday(todo.dueDate);
                const priorityInfo = PRIORITY_OPTIONS.find(
                  (p) => p.value === todo.priority
                );

                return (
                  <div
                    key={todo.id}
                    className={`glass-card rounded-xl p-4 card-elevated transition-all duration-300 group relative ${
                      overdue ? "border-l-4 border-destructive" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-foreground pt-0.5 flex-1">
                            {todo.text}
                          </p>
                          {priorityInfo && (
                            <Flag
                              className={`w-4 h-4 ${priorityInfo.color} flex-shrink-0`}
                            />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                          {todo.category && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              <Tag className="w-3 h-3" />
                              {todo.category}
                            </span>
                          )}
                          {todo.dueDate && (
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                overdue
                                  ? "bg-destructive/10 text-destructive"
                                  : dueToday
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {overdue
                                ? "Overdue"
                                : dueToday
                                ? "Due today"
                                : daysUntil !== null && daysUntil > 0
                                ? `${daysUntil}d left`
                                : "Due"}
                            </span>
                          )}
                          {todo.notes && (
                            <button
                              onClick={() => setViewingNotesId(todo.id)}
                              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Notes
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditDialog(todo)}
                          className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-110 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-md hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {overdue && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span>This task is overdue</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Personal Tasks */}
        {activePersonalTodos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                Personal Tasks
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your private tasks - only visible to you
              </p>
            </div>
            <div className="space-y-2">
              {activePersonalTodos.map((todo) => {
                const daysUntil = getDaysUntilDue(todo.dueDate);
                const overdue = isOverdue(todo.dueDate);
                const dueToday = isDueToday(todo.dueDate);
                const priorityInfo = PRIORITY_OPTIONS.find(
                  (p) => p.value === todo.priority
                );

                return (
                  <div
                    key={todo.id}
                    className={`glass-card rounded-xl p-4 card-elevated transition-all duration-300 group relative ${
                      overdue ? "border-l-4 border-destructive" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-foreground pt-0.5 flex-1">
                            {todo.text}
                          </p>
                          {priorityInfo && (
                            <Flag
                              className={`w-4 h-4 ${priorityInfo.color} flex-shrink-0`}
                            />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                          {todo.category && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              <Tag className="w-3 h-3" />
                              {todo.category}
                            </span>
                          )}
                          {todo.dueDate && (
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                                overdue
                                  ? "bg-destructive/10 text-destructive"
                                  : dueToday
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {overdue
                                ? "Overdue"
                                : dueToday
                                ? "Due today"
                                : daysUntil !== null && daysUntil > 0
                                ? `${daysUntil}d left`
                                : "Due"}
                            </span>
                          )}
                          {todo.notes && (
                            <button
                              onClick={() => setViewingNotesId(todo.id)}
                              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Notes
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditDialog(todo)}
                          className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-110 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-md hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {overdue && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span>This task is overdue</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Todos */}
        {(completedPersonalTodos.length > 0 ||
          completedSharedTodos.length > 0) && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Completed
            </h2>
            <div className="space-y-2">
              {[...completedSharedTodos, ...completedPersonalTodos].map(
                (todo) => (
                  <div
                    key={todo.id}
                    className="glass-card rounded-xl p-4 card-elevated opacity-75 group relative"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </button>
                      <p className="flex-1 text-foreground line-through pt-0.5">
                        {todo.text}
                      </p>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-md hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No tasks yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first task to get started
            </p>
          </div>
        )}

        {/* Notes View Dialog */}
        <Dialog
          open={viewingNotesId !== null}
          onOpenChange={(open) => !open && setViewingNotesId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task Notes</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              {viewingNotesId && (
                <p className="text-foreground whitespace-pre-wrap">
                  {todos.find((t) => t.id === viewingNotesId)?.notes ||
                    "No notes"}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Todo;
