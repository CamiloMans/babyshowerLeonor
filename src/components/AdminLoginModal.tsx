import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface AdminLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginWithGoogle: () => Promise<boolean>;
}

export function AdminLoginModal({
  open,
  onOpenChange,
  onLoginWithGoogle,
}: AdminLoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await onLoginWithGoogle();
      if (success) {
        toast.success("Redirigiendo a Google...");
        // The redirect will happen automatically
      } else {
        toast.error("Error al iniciar sesión con Google");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al iniciar sesión con Google");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Acceso Administrador
          </DialogTitle>
          <DialogDescription className="text-center">
            Inicia sesión con tu cuenta de Google para acceder al panel de administración
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            variant="outline"
          >
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 52.6 94.3 256s164.2 203.4 253.5 183.1c41.5-10.3 76.9-33.3 96.8-69.1H248v-85.2h240z"
              ></path>
            </svg>
            {isLoading ? "Cargando..." : "Continuar con Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Solo administradores autorizados
              </span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Si no tienes acceso, contacta al administrador del sistema
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
