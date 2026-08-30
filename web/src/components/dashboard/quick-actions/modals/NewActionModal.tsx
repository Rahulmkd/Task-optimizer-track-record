/* -------------------------------------------------------------------------- */
/* NEW ACTION MODAL                                  */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { Backdrop } from "./Backdrop";
import { Sparkles, X } from "lucide-react";
import { ModelPanel } from "./ModalPanel";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateActionMutation } from "@/features/actions/services/action.service";
import { quickActions } from "../data/action.data";
import { NewActionButton } from "../components/NewActionButton";

export function NewActionModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [createAction, { isLoading }] = useCreateActionMutation();

  const handleSave = async () => {
    if (!name.trim()) return;

    setError(null);

    try {
      await createAction({
        actionName: name.trim(),
      }).unwrap();

      onClose();
    } catch {
      setError("Couldn't create this action. Please try again.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModelPanel>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold leading-none">
                Create New Action
              </h3>
              <p className="text-white/40 text-xs mt-1">
                Add a custom quick-log button
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-white/60" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <FormField id="na-name" label="Action name" required>
            <Input
              ref={inputRef}
              id="na-name"
              placeholder="e.g. Log Meditation"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </FormField>

          {/* Action buttons grid card panel */}

          {/* <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/30 px-0.5">
              Or choose a quick preset
            </p>

            <div className="max-h-64 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {quickActions.map((action, i) => (
                  <NewActionButton
                    key={action.label}
                    action={action}
                    index={i}
                    onClick={() => {
                      setName(action.label);
                      if (error) setError(null);
                    }}
                  />
                ))}
              </div>
            </div>
          </div> */}

          {error && (
            <p className="text-xs font-medium text-red-400 px-0.5 pt-0.5">
              {error}
            </p>
          )}

          {/* Action Footer Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              className="flex-1 h-11"
              onClick={handleSave}
              disabled={!name.trim() || isLoading}
              loading={isLoading}
            >
              Create action
            </Button>
          </div>
        </div>
      </ModelPanel>
    </Backdrop>
  );
}
