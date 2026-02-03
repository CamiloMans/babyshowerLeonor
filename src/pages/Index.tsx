import { Header } from "@/components/Header";
import { GiftList } from "@/components/GiftList";
import { useAdminSession } from "@/hooks/useAdminSession";

const Index = () => {
  const { isAdmin, login, logout } = useAdminSession();

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={isAdmin} onLogin={login} onLogout={logout} />
      <main>
        <GiftList />
      </main>
    </div>
  );
};

export default Index;
