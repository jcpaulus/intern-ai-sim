
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can insert their own submission files" ON public.submissions_files;
DROP POLICY IF EXISTS "Users can select their own submission files" ON public.submissions_files;
DROP POLICY IF EXISTS "Users can delete their own submission files" ON public.submissions_files;

CREATE POLICY "Users can insert own files"
ON public.submissions_files FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own files"
ON public.submissions_files FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
ON public.submissions_files FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
