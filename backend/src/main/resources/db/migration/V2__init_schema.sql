-- PREF ERE NCE (один-на-один с профилем через user_profile.preference_id)
CREATE TABLE IF NOT EXISTS preference (
    id BIGSERIAL PRIMARY KEY,
    preferred_gender VARCHAR(10),       -- MAN | WOMAN
    age_min INTEGER,
    age_max INTEGER,
    max_distance_km DOUBLE PRECISION
    );

-- USER_PROFILE (соответствует твоему @Entity)
CREATE TABLE IF NOT EXISTS user_profile (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(32) NOT NULL UNIQUE,
    name TEXT,
    age INTEGER,
    birthdate DATE,
    gender VARCHAR(10),                 -- MAN | WOMAN
    bio VARCHAR(500),
    location GEOGRAPHY(Point,4326),
    preference_id BIGINT UNIQUE,        -- one-to-one
    CONSTRAINT fk_user_pref
    FOREIGN KEY (preference_id)
    REFERENCES preference(id)
    ON DELETE SET NULL
    );

-- индекс под геопоиск
CREATE INDEX IF NOT EXISTS idx_user_location
    ON user_profile
    USING GIST (location);

-- PHOTO (как у тебя)
CREATE TABLE IF NOT EXISTS photo (
    id BIGSERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    main BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_photo_user
    FOREIGN KEY (user_id)
    REFERENCES user_profile(id)
    ON DELETE CASCADE
    );
CREATE INDEX IF NOT EXISTS idx_photo_user ON photo(user_id);

-- SWIPE (для исключения уже просмотренных/лайкнутых)
CREATE TABLE IF NOT EXISTS swipe (
    id BIGSERIAL PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id   BIGINT NOT NULL,
    decision VARCHAR(10) NOT NULL,        -- 'LIKE' | 'PASS' | 'SUPER'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_swipe_from
    FOREIGN KEY (from_user_id) REFERENCES user_profile(id) ON DELETE CASCADE,
    CONSTRAINT fk_swipe_to
    FOREIGN KEY (to_user_id)   REFERENCES user_profile(id) ON DELETE CASCADE,
    CONSTRAINT ux_swipe_from_to UNIQUE (from_user_id, to_user_id),
    CONSTRAINT ck_swipe_decision CHECK (decision IN ('LIKE','PASS','SUPER'))
    );

CREATE INDEX IF NOT EXISTS idx_swipe_from ON swipe(from_user_id);
CREATE INDEX IF NOT EXISTS idx_swipe_to   ON swipe(to_user_id);
