export interface Gift {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  price: number | null;
  priority: number;
  is_active: boolean;
  destinatario: string | null;
  categoria_regalos: string | null;
  max_quantity: number | null;
  created_at: string;
  updated_at: string;
}

export interface GiftAssignment {
  id: string;
  gift_id: string;
  assigned_to_name: string;
  assigned_to_user_id: string | null;
  assigned_at: string;
  created_at: string;
  updated_at: string;
}

export interface GiftWithAssignment extends Gift {
  gift_assignments: GiftAssignment | null;
  assignment_count?: number;
  my_assignment?: GiftAssignment | null;
  all_assignments?: GiftAssignment[];
}

export interface AdminSession {
  isAdmin: boolean;
  expiresAt: number;
}
