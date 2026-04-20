-- Allow admins to upload to product-images bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can upload product images' AND tablename = 'objects'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can upload product images"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'product-images'
        AND public.has_role(auth.uid(), 'admin'::app_role)
      )
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update product images' AND tablename = 'objects'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can update product images"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'product-images'
        AND public.has_role(auth.uid(), 'admin'::app_role)
      )
      WITH CHECK (
        bucket_id = 'product-images'
        AND public.has_role(auth.uid(), 'admin'::app_role)
      )
    $policy$;
  END IF;
END $$;