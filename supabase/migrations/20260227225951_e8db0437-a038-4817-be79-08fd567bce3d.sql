-- Create storage bucket for task submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-submissions', 'task-submissions', false);

-- Users can upload their own files
CREATE POLICY "Users can upload their own submission files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own files
CREATE POLICY "Users can view their own submission files"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own submission files
CREATE POLICY "Users can delete their own submission files"
ON storage.objects FOR DELETE
USING (bucket_id = 'task-submissions' AND auth.uid()::text = (storage.foldername(name))[1]);