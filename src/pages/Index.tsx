import { Header } from "@/components/Header";
import { GiftList } from "@/components/GiftList";
import { useAdminSession } from "@/hooks/useAdminSession";

const Index = () => {
  const { isAdmin, loginWithGoogle, logout } = useAdminSession();

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={isAdmin} onLoginWithGoogle={loginWithGoogle} onLogout={logout} />
      <main>
        <GiftList />
      </main>
    </div>
  );
};

export default Index;
