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
import { Textarea } from "@/components/ui/textarea";
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
  price: z.coerce.number().min(0, "El precio debe ser positivo").optional(),
  priority: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
  destinatario: z.string().min(1, "El destinatario es requerido"),
  categoria_regalos: z.string().min(1, "La categoría es requerida"),
});

type GiftFormData = z.infer<typeof giftSchema>;

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
      price: undefined,
      priority: 0,
      is_active: true,
      destinatario: "Leonor",
      categoria_regalos: "👶 Básicos útiles",
    },
  });

  useEffect(() => {
    if (gift) {
      form.reset({
        name: gift.name,
        description: gift.description || "",
        url: gift.url || "",
        price: gift.price || undefined,
        priority: gift.priority,
        is_active: gift.is_active,
        destinatario: gift.destinatario || "Leonor",
        categoria_regalos: gift.categoria_regalos || "👶 Básicos útiles",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        url: "",
        price: undefined,
        priority: 0,
        is_active: true,
        destinatario: "Leonor",
        categoria_regalos: "👶 Básicos útiles",
      });
    }
  }, [gift, form]);

  const handleSubmit = (data: GiftFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || null,
      url: data.url || null,
      price: data.price || null,
      priority: data.priority,
      is_active: data.is_active,
      destinatario: data.destinatario,
      categoria_regalos: data.categoria_regalos,
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
      <DialogContent className="sm:max-w-lg">
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
                    <Input placeholder="Ej: Cafetera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción opcional del regalo"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del producto</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (CLP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="29990"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <Trash2 className="h-4 w-4" />
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
