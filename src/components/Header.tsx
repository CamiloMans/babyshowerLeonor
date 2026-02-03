import { useState } from "react";
import { Lock, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLoginModal } from "./AdminLoginModal";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isAdmin: boolean;
  onLoginWithGoogle: () => Promise<boolean>;
  onLogout: () => void;
}

export function Header({ isAdmin, onLoginWithGoogle, onLogout }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Lista de Regalos
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Selecciona los regalos que quieras reservar
            </p>
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
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Panel Admin</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLoginModal(true)}
                title="Acceso admin"
              >
                <Lock className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <AdminLoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLoginWithGoogle={onLoginWithGoogle}
      />
    </>
  );
}
