import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center bg-background bg-pattern px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-accent/8 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-10 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center space-y-6"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 shadow-lg backdrop-blur-sm border border-primary/20">
              <Gift className="h-10 w-10 text-primary" />
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-5 w-5 text-accent" />
            </motion.div>
          </motion.div>
          
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl font-semibold tracking-tight"
            >
              Lista de Regalos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-base text-muted-foreground leading-relaxed"
            >
              Inicia sesión para ver y reservar regalos
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-5"
        >
          <Button
            type="button"
            className="w-full h-12 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            size="lg"
          >
            <svg
              className="mr-3 h-5 w-5"
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xs text-muted-foreground leading-relaxed px-4"
          >
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

