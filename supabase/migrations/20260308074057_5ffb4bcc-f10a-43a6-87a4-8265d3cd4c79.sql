
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Users can insert own runs" ON public.simulation_runs;
CREATE POLICY "Users can insert own runs"
ON public.simulation_runs
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
