
ALTER TABLE public.automatiseringen
ADD COLUMN laatst_geverifieerd timestamp with time zone DEFAULT NULL,
ADD COLUMN geverifieerd_door text DEFAULT '' NOT NULL;
