import { useState } from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: () => Promise<boolean>;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await onLogin();
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Lista de Regalos
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Inicia sesión para ver y reservar regalos
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            size="lg"
          >
            <svg
              className="mr-2 h-5 w-5"
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

          <p className="text-xs text-muted-foreground">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>
      </div>
    </div>
  );
}

