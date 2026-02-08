import { useState } from "react";
import { Lock, LogOut, Settings2, Gift, Baby, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLoginModal } from "./AdminLoginModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminSession } from "@/hooks/useAdminSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  isAdmin: boolean;
  selectedCount?: number;
  onClearSelection?: () => void;
}

export function Header({ isAdmin, selectedCount = 0, onClearSelection }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { login, logout: adminLogout } = useAdminSession();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-6 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Decorative icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-accent/20 shadow-md backdrop-blur-sm border border-primary/20"
            >
              <Gift className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </motion.div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Lista de regalos para Leonor
                </h1>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="hidden sm:block"
                >
                  <Baby className="h-5 w-5 text-primary/60" strokeWidth={2} />
                </motion.div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Selecciona los regalos que quieras reservar
                </p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className="hidden sm:block"
                >
                  <Heart className="h-3.5 w-3.5 text-accent/50" strokeWidth={2} />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin")}
                  className="gap-2"
                >
                  <Settings2 className="h-4 w-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Panel Admin</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={adminLogout}
                  title="Cerrar sesión admin"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLoginModal(true)}
                title="Acceso admin"
              >
                <Lock className="h-4 w-4" strokeWidth={2} />
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.user_metadata?.full_name || "Usuario"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" strokeWidth={2} />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Botón flotante de limpiar selección en móvil */}
      <AnimatePresence>
        {selectedCount > 0 && onClearSelection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-20 right-4 z-40 sm:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="rounded-full h-12 w-12 shadow-lg bg-background/95 backdrop-blur-sm border border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </header>

      <AdminLoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLogin={login}
      />
    </>
  );
}
