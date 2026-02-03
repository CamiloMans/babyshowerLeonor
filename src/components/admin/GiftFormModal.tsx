import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
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
import { Gift } from "@/lib/types";

const giftSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  price: z.coerce.number().min(0, "El precio debe ser positivo").optional(),
  priority: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

type GiftFormData = z.infer<typeof giftSchema>;

interface GiftFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift?: Gift | null;
  onSubmit: (data: Omit<Gift, "id" | "created_at" | "updated_at">) => void;
  isLoading?: boolean;
}

export function GiftFormModal({
  open,
  onOpenChange,
  gift,
  onSubmit,
  isLoading,
}: GiftFormModalProps) {
  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      price: undefined,
      priority: 0,
      is_active: true,
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
      });
    } else {
      form.reset({
        name: "",
        description: "",
        url: "",
        price: undefined,
        priority: 0,
        is_active: true,
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
    });
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad (orden)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
