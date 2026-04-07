CREATE POLICY "Customers can update own order status"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);