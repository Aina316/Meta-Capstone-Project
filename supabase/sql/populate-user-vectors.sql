TRUNCATE TABLE user_vectors;

WITH user_game_data AS (
  SELECT
    p.id AS user_id,
    LOWER(TRIM(UNNEST(string_to_array(c.genre, ',')))) AS genre,
    LOWER(TRIM(UNNEST(string_to_array(c.platform, ',')))) AS platform
  FROM profiles p
  LEFT JOIN requests r ON r.borrower_id = p.id AND r.status = 'Accepted'
  LEFT JOIN games g ON g.id = r.game_id
  LEFT JOIN catalog c ON c.id = g.catalog_id

  UNION ALL

  SELECT
    f.user_id,
    LOWER(TRIM(UNNEST(string_to_array(c.genre, ',')))) AS genre,
    LOWER(TRIM(UNNEST(string_to_array(c.platform, ',')))) AS platform
  FROM recommendation_feedback f
  JOIN catalog c ON c.id = f.catalog_id
  WHERE f.feedback = 'up'
),
genre_counts AS (
  SELECT user_id, genre, COUNT(*)::float AS count
  FROM user_game_data
  WHERE genre IS NOT NULL
  GROUP BY user_id, genre
),
platform_counts AS (
  SELECT user_id, platform, COUNT(*)::float AS count
  FROM user_game_data
  WHERE platform IS NOT NULL
  GROUP BY user_id, platform
),
normalized_genre_counts AS (
  SELECT
    user_id,
    genre,
    count / SUM(count) OVER (PARTITION BY user_id) AS normalized_count
  FROM genre_counts
),
genre_vector_agg AS (
  SELECT
    user_id,
    jsonb_object_agg(genre, normalized_count) AS genre_vector
  FROM normalized_genre_counts
  GROUP BY user_id
),
normalized_platform_counts AS (
  SELECT
    user_id,
    platform,
    count / SUM(count) OVER (PARTITION BY user_id) AS normalized_count
  FROM platform_counts
),
platform_vector_agg AS (
  SELECT
    user_id,
    jsonb_object_agg(platform, normalized_count) AS platform_vector
  FROM normalized_platform_counts
  GROUP BY user_id
),
combined AS (
  SELECT
    COALESCE(g.user_id, p.user_id) AS user_id,
    g.genre_vector,
    p.platform_vector
  FROM genre_vector_agg g
  FULL OUTER JOIN platform_vector_agg p ON g.user_id = p.user_id
)
INSERT INTO user_vectors (user_id, genre_vector, platform_vector)
SELECT
  user_id,
  COALESCE(genre_vector, '{}'::jsonb),
  COALESCE(platform_vector, '{}'::jsonb)
FROM combined
ON CONFLICT (user_id)
DO UPDATE SET
  genre_vector = EXCLUDED.genre_vector,
  platform_vector = EXCLUDED.platform_vector;