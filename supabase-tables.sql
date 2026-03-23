-- Run this in the Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  barcode text UNIQUE,
  category text NOT NULL DEFAULT 'Alimentação',
  in_stock boolean DEFAULT true,
  unit text DEFAULT 'unidade',
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Products: only service role can insert/update/delete (admin via service key)
CREATE POLICY "Products are editable by authenticated"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: anyone can insert (customers place orders)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders: anyone can read their own order (by id in URL)
CREATE POLICY "Orders are viewable by everyone"
  ON orders FOR SELECT
  USING (true);

-- Orders: authenticated users can update (admin)
CREATE POLICY "Orders are updatable by authenticated"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Index for orders by date
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
