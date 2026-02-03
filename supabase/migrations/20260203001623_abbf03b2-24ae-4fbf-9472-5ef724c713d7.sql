-- Create gifts table
CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  price INTEGER,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift_assignments table with unique constraint on gift_id
CREATE TABLE public.gift_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
  assigned_to_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_gift_assignment UNIQUE (gift_id)
);

-- Create indexes for performance
CREATE INDEX idx_gifts_priority ON public.gifts(priority);
CREATE INDEX idx_gifts_is_active ON public.gifts(is_active);
CREATE INDEX idx_gift_assignments_gift_id ON public.gift_assignments(gift_id);

-- Enable RLS on both tables
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_assignments ENABLE ROW LEVEL SECURITY;

-- Public read access for gifts (everyone can see the gift list)
CREATE POLICY "Anyone can view active gifts"
ON public.gifts
FOR SELECT
USING (is_active = true);

-- Public read access for assignments (to show who claimed gifts)
CREATE POLICY "Anyone can view gift assignments"
ON public.gift_assignments
FOR SELECT
USING (true);

-- Public insert access for assignments (visitors can claim gifts)
CREATE POLICY "Anyone can create gift assignments"
ON public.gift_assignments
FOR INSERT
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_gifts_updated_at
BEFORE UPDATE ON public.gifts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_assignments_updated_at
BEFORE UPDATE ON public.gift_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();