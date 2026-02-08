import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { GiftList } from "@/components/GiftList";
import { useAdminSession } from "@/hooks/useAdminSession";

const Index = () => {
  const { isAdmin } = useAdminSession();

  return (
    <div className="min-h-screen bg-background bg-pattern relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 gradient-overlay pointer-events-none" />
      
      {/* Subtle background elements */}
      <div className="fixed -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      
      <Header isAdmin={isAdmin} />
      
      <main className="relative z-10">
        <GiftList />
      </main>
    </div>
  );
};

export default Index;
