import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  hint,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  hint?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-12 rounded-xl border-border/80 bg-secondary/40 px-4 text-base shadow-sm transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:bg-background focus-visible:ring-primary/20"
        {...props}
      />
      {hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
