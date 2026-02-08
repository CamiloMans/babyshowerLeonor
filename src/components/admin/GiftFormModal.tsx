import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Gift } from "@/lib/types";

const giftSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  priority: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
  destinatario: z.string().min(1, "El destinatario es requerido"),
  categoria_regalos: z.string().min(1, "La categoría es requerida"),
  max_quantity: z.preprocess(
    (val) => {
      // Si es "infinito" o null, retornar null
      if (val === "infinito" || val === null || val === "null") return null;
      if (val === "" || val === undefined) return 1;
      const num = typeof val === "string" ? parseInt(val, 10) : val;
      return isNaN(num) || num < 1 ? 1 : num;
    },
    z.number().int().min(1, "El límite debe ser al menos 1").nullable()
  ).default(1),
});

type GiftFormData = z.infer<typeof giftSchema> & {
  hasUnlimitedQuantity?: boolean;
};

interface GiftFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift?: Gift | null;
  onSubmit: (data: Omit<Gift, "id" | "created_at" | "updated_at">) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function GiftFormModal({
  open,
  onOpenChange,
  gift,
  onSubmit,
  onDelete,
  isLoading,
}: GiftFormModalProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (gift && onDelete) {
      onDelete(gift.id);
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };
  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      priority: 0,
      is_active: true,
      destinatario: "Leonor",
      categoria_regalos: "👶 Básicos útiles",
      max_quantity: 1,
      hasUnlimitedQuantity: false,
    },
  });

  useEffect(() => {
    if (gift) {
      form.reset({
        name: gift.name,
        description: gift.description || "",
        url: gift.url || "",
        priority: gift.priority,
        is_active: gift.is_active,
        destinatario: gift.destinatario || "Leonor",
        categoria_regalos: gift.categoria_regalos || "👶 Básicos útiles",
        max_quantity: gift.max_quantity ?? 1,
        hasUnlimitedQuantity: gift.max_quantity === null,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        url: "",
        priority: 0,
        is_active: true,
        destinatario: "Leonor",
        categoria_regalos: "👶 Básicos útiles",
        max_quantity: 1,
        hasUnlimitedQuantity: false,
      });
    }
  }, [gift, form]);

  const handleSubmit = (data: GiftFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || null,
      url: data.url || null,
      price: null,
      priority: data.priority,
      is_active: data.is_active,
      destinatario: data.destinatario,
      categoria_regalos: data.categoria_regalos,
      max_quantity: data.hasUnlimitedQuantity ? null : (data.max_quantity ?? 1),
    });
  };

  const categoriasPorDestinatario: Record<string, string[]> = {
    Leonor: [
      "👶 Básicos útiles",
      "🧸 Para jugar y estimular",
      "🛁 Cuidado y baño",
      "📸 Recuerdos y especiales",
    ],
    Padres: [
      "🍼 Apoyo en la crianza",
      "🧸 Para hacerles la vida más fácil",
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {gift ? "Editar Regalo" : "Nuevo Regalo"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cafetera" {...field} autoFocus={false} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} autoFocus={false} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasUnlimitedQuantity"
                render={({ field: unlimitedField }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer">Sin límite</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Permitir que este regalo sea reservado ilimitadamente
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={unlimitedField.value || false}
                        onCheckedChange={(checked) => {
                          unlimitedField.onChange(checked);
                          if (checked) {
                            form.setValue("max_quantity", null);
                          } else {
                            form.setValue("max_quantity", 1);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("hasUnlimitedQuantity") && (
                <FormField
                  control={form.control}
                  name="max_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite de cantidad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          autoFocus={false}
                          value={field.value === "" || field.value === null || field.value === undefined ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Permitir borrar (valor vacío)
                            if (value === "") {
                              field.onChange("");
                              return;
                            }
                            // Convertir a número y validar
                            const numValue = parseInt(value, 10);
                            if (!isNaN(numValue) && numValue > 0) {
                              field.onChange(numValue);
                            }
                          }}
                          onBlur={(e) => {
                            // Al salir del campo, si está vacío, 0 o negativo, poner 1
                            const value = e.target.value;
                            if (value === "" || value === "0" || parseInt(value, 10) < 1) {
                              field.onChange(1);
                            }
                            field.onBlur();
                          }}
                          min={1}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Máximo número de veces que se puede regalar. Por defecto: 1. Puedes borrar el valor para usar el defecto.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="destinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatario *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Actualizar categoría al primer valor disponible para el nuevo destinatario
                        const nuevasCategorias = categoriasPorDestinatario[value];
                        if (nuevasCategorias && nuevasCategorias.length > 0) {
                          form.setValue("categoria_regalos", nuevasCategorias[0]);
                        }
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona destinatario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Leonor">Leonor</SelectItem>
                        <SelectItem value="Padres">Padres</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria_regalos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!form.watch("destinatario")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {form.watch("destinatario") && categoriasPorDestinatario[form.watch("destinatario")]?.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Activo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
              {gift && onDelete && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar regalo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. El regalo <strong>"{gift.name}"</strong> será
                        eliminado permanentemente de la lista.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {!gift && <div />}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : gift ? "Guardar cambios" : "Crear regalo"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
