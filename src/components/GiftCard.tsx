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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "gift-card",
        isAssigned && "gift-card-assigned",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="flex items-start gap-4">
        {!isAssigned && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(gift.id)}
            className="mt-1 h-5 w-5 rounded-md border-2"
          />
        )}

        {isAssigned && (
          <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-md bg-success/20">
            <Check className="h-3.5 w-3.5 text-success" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-xl font-semibold text-foreground">
              {gift.name}
            </h3>
            {gift.price && (
              <span className="price-tag">{formatPrice(gift.price)}</span>
            )}
          </div>

          {gift.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {gift.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            {gift.url && (
              <a
                href={gift.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver producto
              </a>
            )}

            {isAssigned && (
              <span className="assigned-badge">
                <GiftIcon className="h-3.5 w-3.5" />
                Reservado por {gift.gift_assignments!.assigned_to_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
