-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  bio TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Komik table
CREATE TABLE IF NOT EXISTS komik (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  genre VARCHAR(100),
  author VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Ongoing',
  cover VARCHAR(500),
  views INT DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  komik_id UUID NOT NULL REFERENCES komik(id) ON DELETE CASCADE,
  nomor_chapter INT NOT NULL,
  judul VARCHAR(255),
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table (untuk setiap halaman komik)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  urutan INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  komik_id UUID NOT NULL REFERENCES komik(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, komik_id)
);

-- Reading progress
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  komik_id UUID NOT NULL REFERENCES komik(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  page_number INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments/Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  komik_id UUID NOT NULL REFERENCES komik(id) ON DELETE CASCADE,
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_komik_genre ON komik(genre);
CREATE INDEX idx_komik_author ON komik(author);
CREATE INDEX idx_chapters_komik ON chapters(komik_id);
CREATE INDEX idx_pages_chapter ON pages(chapter_id);
CREATE INDEX idx_favorit_user ON favorit(user_id);
CREATE INDEX idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX idx_reviews_komik ON reviews(komik_id);
