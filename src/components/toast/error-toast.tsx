import { toast } from "sonner";

export function showErrorToast(title: string, content: string) {
  if (!content) {
    toast.error(title, {
      description: (
        // w-[340px]
        <div className="mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4">
          <span className="text-white">{content}</span>
        </div>
      ),
    });
    return;
  }
  toast.error(title);
}
