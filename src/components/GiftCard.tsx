import { motion } from "framer-motion";
import { ExternalLink, Check, Gift as GiftIcon } from "lucide-react";
import { GiftWithAssignment } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface GiftCardProps {
  gift: GiftWithAssignment;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export function GiftCard({ gift, isSelected, onToggleSelect }: GiftCardProps) {
  const isAssigned = !!gift.gift_assignments;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "gift-card",
        isAssigned && "gift-card-assigned",
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}
    >
      <div className="flex items-start gap-2">
        {!isAssigned && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(gift.id)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          />
        )}

        {isAssigned && (
          <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm bg-success/10">
            <Check className="h-2.5 w-2.5 text-success" />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-xs font-semibold leading-tight text-foreground line-clamp-2">
              {gift.name}
            </h3>
            {gift.price && (
              <span className="price-tag shrink-0 text-[10px]">{formatPrice(gift.price)}</span>
            )}
          </div>

          {gift.description && (
            <p className="text-[10px] leading-snug text-muted-foreground line-clamp-1">
              {gift.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                Ver
              </a>
            )}

            {isAssigned && (
              <span className="assigned-badge text-[10px] px-1.5 py-0.5">
                <GiftIcon className="h-2.5 w-2.5" />
                <span className="truncate max-w-[100px]">{gift.gift_assignments!.assigned_to_name}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
