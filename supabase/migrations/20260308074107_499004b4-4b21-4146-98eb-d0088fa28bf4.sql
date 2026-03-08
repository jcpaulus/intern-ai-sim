
DROP POLICY IF EXISTS "Users can select own runs" ON public.simulation_runs;
CREATE POLICY "Users can select own runs"
ON public.simulation_runs
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
