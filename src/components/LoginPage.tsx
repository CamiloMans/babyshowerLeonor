import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, Heart, Baby, Star } from "lucide-react";
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
      
      {/* Floating decorative icons */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-10 text-primary/20"
      >
        <Baby className="h-12 w-12" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5
        }}
        className="absolute top-32 right-16 text-accent/20"
      >
        <Heart className="h-10 w-10" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 left-20 text-primary/15"
      >
        <Star className="h-8 w-8" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 4.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute bottom-20 right-12 text-accent/20"
      >
        <Gift className="h-9 w-9" strokeWidth={1.5} />
      </motion.div>

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
          className="flex flex-col items-center space-y-8"
        >
          {/* Main icon container with enhanced design */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/25 via-primary/20 to-accent/25 shadow-2xl backdrop-blur-md border-2 border-primary/30">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent" />
              <Gift className="h-12 w-12 text-primary relative z-10" strokeWidth={2.5} />
            </div>
            
            {/* Multiple sparkles around the icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-6 w-6 text-accent" strokeWidth={2.5} />
            </motion.div>
            
            <motion.div
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
              className="absolute -bottom-1 -left-1"
            >
              <Star className="h-4 w-4 text-primary/60" strokeWidth={2} />
            </motion.div>
            
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute top-1/2 -left-3"
            >
              <Heart className="h-3.5 w-3.5 text-accent/70" strokeWidth={2} />
            </motion.div>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text"
            >
              Regalos para Leonor
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed font-medium"
            >
              Inicia sesión para ver y reservar regalos
            </motion.p>
            
            {/* Decorative line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-center gap-3 pt-2"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-primary/50 via-primary/30 to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Card container for button */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 blur-xl" />
            <div className="relative rounded-2xl border border-primary/20 bg-background/50 backdrop-blur-sm p-6 shadow-xl">
              <Button
                type="button"
                className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary/95 transform hover:scale-[1.02] active:scale-[0.98]"
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
            </div>
          </div>
          
          {/* Additional decorative elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
          >
            <Heart className="h-3 w-3" strokeWidth={2} />
            <span>Baby Shower</span>
            <Heart className="h-3 w-3" strokeWidth={2} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

