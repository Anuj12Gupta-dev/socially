import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

// Extract ButtonProps from the Button component's props
type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </Button>
  );
}