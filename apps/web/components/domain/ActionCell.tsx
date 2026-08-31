import { Eye, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";

type ActionCellProps = {
  onView?: () => void;
  destructiveLabel?: string;
  destructiveVariant?: "danger" | "success";
  onDestructive?: () => void;
  onDelete?: () => void;
};

export function ActionCell({
  onView,
  destructiveLabel,
  destructiveVariant = "danger",
  onDestructive,
  onDelete,
}: ActionCellProps) {
  return (
    <>
      <IconButton variant="outline" size="sm" onClick={onView} label="Voir">
        <Eye className="h-3.5 w-3.5" />
      </IconButton>
      {destructiveLabel && onDestructive && (
        <Button
          variant={destructiveVariant === "success" ? "success" : "danger"}
          size="sm"
          onClick={onDestructive}
        >
          {destructiveLabel}
        </Button>
      )}
      <IconButton variant="danger" size="sm" onClick={onDelete} label="Supprimer">
        <Trash2 className="h-3.5 w-3.5" />
      </IconButton>
    </>
  );
}
