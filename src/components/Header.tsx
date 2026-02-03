import { useState } from "react";
import { Lock, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLoginModal } from "./AdminLoginModal";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isAdmin: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
}

export function Header({ isAdmin, onLogin, onLogout }: HeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Lista de Regalos
            </h1>
            <p className="text-sm text-muted-foreground">
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
        onLogin={onLogin}
      />
    </>
  );
}
