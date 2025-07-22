
INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
VALUES (
  '7323622b-3960-495d-92d2-5a81addf4bb3', 
  '{}', 
  '{}'
)
ON CONFLICT (user_id) DO UPDATE
SET genre_vector = EXCLUDED.genre_vector,
    platform_vector = EXCLUDED.platform_vector;


INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
VALUES (
  '0fac0c35-e754-4632-a45f-592567332b2b', 
  '{}', 
  '{}'
)
ON CONFLICT (user_id) DO UPDATE
SET genre_vector = EXCLUDED.genre_vector,
    platform_vector = EXCLUDED.platform_vector;


INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
VALUES (
  '979d098d-26dc-4f28-b1cb-1f41a1acab6c', 
  '{}', 
  '{}'
)
ON CONFLICT (user_id) DO UPDATE
SET genre_vector = EXCLUDED.genre_vector,
    platform_vector = EXCLUDED.platform_vector;


INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
VALUES (
  '37374ef3-8dec-4b0a-b59f-18b9977f2f01', 
  '{}', 
  '{}'
)
ON CONFLICT (user_id) DO UPDATE
SET genre_vector = EXCLUDED.genre_vector,
    platform_vector = EXCLUDED.platform_vector;


INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
VALUES (
  'f1c22577-f8f4-4929-bf6a-86b9c148fee2', 
  '{}', 
  '{}'
)
ON CONFLICT (user_id) DO UPDATE
SET genre_vector = EXCLUDED.genre_vector,
    platform_vector = EXCLUDED.platform_vector;

