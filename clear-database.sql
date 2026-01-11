-- ============================================
-- CLEAR DATABASE FOR FRESH DEPLOYMENT
-- ============================================
-- WARNING: This will delete ALL data from your database
-- Run this in your Supabase SQL Editor
-- Tables, policies, functions, and triggers will remain intact

-- ============================================
-- STEP 1: Delete all data from tables
-- ============================================
-- Order matters due to foreign key constraints
-- Delete in reverse order of dependencies

-- Clear comments
TRUNCATE TABLE comments CASCADE;

-- Clear likes
TRUNCATE TABLE likes CASCADE;

-- Clear post images
TRUNCATE TABLE post_images CASCADE;

-- Clear posts
TRUNCATE TABLE posts CASCADE;

-- Clear profiles (this will cascade to all related data)
TRUNCATE TABLE profiles CASCADE;

-- ============================================
-- STEP 2: Clear storage buckets
-- ============================================
-- Note: You need to manually delete files from storage buckets
-- Go to: Storage > post-images > Delete all files
-- Go to: Storage > profile-images > Delete all files

-- Or use these queries to list files (then delete via dashboard):
-- SELECT * FROM storage.objects WHERE bucket_id = 'post-images';
-- SELECT * FROM storage.objects WHERE bucket_id = 'profile-images';

-- ============================================
-- STEP 3: Clear authentication users
-- ============================================
-- WARNING: This will delete all user accounts
-- Uncomment the line below if you want to delete all auth users
-- DELETE FROM auth.users;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify all data is cleared:

-- SELECT COUNT(*) FROM profiles;      -- Should return 0
-- SELECT COUNT(*) FROM posts;         -- Should return 0
-- SELECT COUNT(*) FROM post_images;   -- Should return 0
-- SELECT COUNT(*) FROM likes;         -- Should return 0
-- SELECT COUNT(*) FROM comments;      -- Should return 0
-- SELECT COUNT(*) FROM auth.users;    -- Will show remaining users if any

-- ============================================
-- NOTES
-- ============================================
-- 1. This script preserves the database schema (tables, policies, functions, triggers)
-- 2. Storage bucket files must be deleted manually via Supabase Dashboard
-- 3. Authentication users are preserved by default (uncomment DELETE to remove them)
-- 4. After clearing data, existing users can still log in but will have empty profiles
-- 5. For a completely fresh start, also delete auth.users
