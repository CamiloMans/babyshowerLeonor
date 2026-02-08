import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AdminGiftCard } from "./AdminGiftCard";
import { GiftWithAssignment } from "@/lib/types";
import { GripVertical } from "lucide-react";

interface SortableGiftCardProps {
  gift: GiftWithAssignment;
  onEdit: (gift: GiftWithAssignment) => void;
  onDelete: (id: string) => void;
  onUnassign: (giftId: string) => void;
}

export function SortableGiftCard({
  gift,
  onEdit,
  onDelete,
  onUnassign,
}: SortableGiftCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: gift.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-primary/10 hover:border border-primary/20"
        title="Arrastrar para reordenar"
      >
        <GripVertical className="h-4 w-4 text-primary" />
      </div>
      <AdminGiftCard
        gift={gift}
        onEdit={onEdit}
        onDelete={onDelete}
        onUnassign={onUnassign}
      />
    </div>
  );
}

