import { Plus, Heart } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import NudgeButton from "./NudgeButton";
import { Button } from "@/components/ui/button";
import {
  createContext,
  useContext,
  useRef,
  useCallback,
  ReactNode,
} from "react";

// Context for dialog triggers
interface DialogTriggerContextType {
  openMomentDialog: () => void;
  openTodoDialog: () => void;
  registerMomentDialog: (fn: () => void) => void;
  registerTodoDialog: (fn: () => void) => void;
}

const DialogTriggerContext = createContext<DialogTriggerContextType | null>(
  null
);

export const useDialogTriggers = () => {
  const context = useContext(DialogTriggerContext);
  if (!context) {
    return {
      openMomentDialog: () => {},
      openTodoDialog: () => {},
      registerMomentDialog: () => {},
      registerTodoDialog: () => {},
    };
  }
  return context;
};

export const DialogTriggerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const momentDialogRef = useRef<() => void>(() => {});
  const todoDialogRef = useRef<() => void>(() => {});

  const openMomentDialog = useCallback(() => {
    momentDialogRef.current();
  }, []);

  const openTodoDialog = useCallback(() => {
    todoDialogRef.current();
  }, []);

  const registerMomentDialog = useCallback((fn: () => void) => {
    momentDialogRef.current = fn;
  }, []);

  const registerTodoDialog = useCallback((fn: () => void) => {
    todoDialogRef.current = fn;
  }, []);

  return (
    <DialogTriggerContext.Provider
      value={{
        openMomentDialog,
        openTodoDialog,
        registerMomentDialog,
        registerTodoDialog,
      }}
    >
      {children}
    </DialogTriggerContext.Provider>
  );
};

const FloatingActionButton = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { openMomentDialog, openTodoDialog } = useDialogTriggers();

  // Don't show on login/install pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/install" ||
    !user
  ) {
    return null;
  }

  // Show nudge button on home and messages pages (for all users)
  if (
    (location.pathname === "/" || location.pathname === "/messages") &&
    user
  ) {
    return (
      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 safe-area-bottom">
        <NudgeButton />
      </div>
    );
  }

  // Show add moment button on moments page
  if (
    location.pathname === "/moments" ||
    location.pathname === "/countdowns" ||
    location.pathname === "/events"
  ) {
    return (
      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 safe-area-bottom">
        <Button
          onClick={openMomentDialog}
          className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary hover:shadow-2xl hover:scale-110 text-primary-foreground shadow-lg transition-all animate-breathe"
          title="Add Moment"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  // Show add todo button on todo page
  if (location.pathname === "/todo") {
    return (
      <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-50 safe-area-bottom">
        <Button
          onClick={openTodoDialog}
          className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary hover:shadow-2xl hover:scale-110 text-primary-foreground shadow-lg transition-all animate-breathe"
          title="Add Task"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return null;
};

export default FloatingActionButton;
