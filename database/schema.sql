-- Create tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
    id VARCHAR(255) PRIMARY KEY,
    tutorial_id VARCHAR(255) NOT NULL,
    topic_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle TEXT,
    cover_image_url TEXT,
    alt_text TEXT,
    estimated_time_mins INTEGER DEFAULT 0,
    reading_level VARCHAR(50) DEFAULT 'medium',
    preferred_learning_style JSON,
    story_context TEXT,
    learning_objectives JSON,
    prerequisites JSON,
    bite_size_sections JSON,
    key_takeaways JSON,
    fun_fact TEXT,
    reflection_prompt TEXT,
    discussion_thread_url TEXT,
    progress_badge VARCHAR(255),
    xp_points INTEGER DEFAULT 0,
    streak_multiplier BOOLEAN DEFAULT FALSE,
    milestone_badges JSON,
    spaced_repetition_id VARCHAR(255),
    next_tutorial_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    body TEXT,
    meta_description TEXT,
    category VARCHAR(255),
    tags JSON,
    status VARCHAR(50) DEFAULT 'draft',
    publish_date TIMESTAMP NULL,
    introduction TEXT,
    conclusion TEXT,
    images JSON,
    diagrams JSON,
    downloadable_assets JSON,
    code_snippets JSON,
    slug VARCHAR(255),
    estimated_read_time INTEGER DEFAULT 0,
    filled_summary TEXT,
    built_in_points JSON,
    INDEX idx_created_at (created_at),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_reading_level (reading_level),
    INDEX idx_tutorial_id (tutorial_id),
    INDEX idx_topic_id (topic_id)
);

-- Create users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create drives table (for placement drives)
CREATE TABLE IF NOT EXISTS drives (
    id VARCHAR(255) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    drive_title VARCHAR(500) NOT NULL,
    drive_type VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    remote BOOLEAN DEFAULT FALSE,
    app_link TEXT,
    branches JSON,
    years JSON,
    cgpa VARCHAR(50),
    backlog VARCHAR(100),
    reg_window VARCHAR(100),
    seat_cap VARCHAR(100),
    notify BOOLEAN DEFAULT FALSE,
    notif_template TEXT,
    reminders JSON,
    approval VARCHAR(100),
    visibility VARCHAR(50),
    module VARCHAR(255),
    thumbnail_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company (company),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date),
    INDEX idx_created_at (created_at)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    category VARCHAR(255),
    total_time INTEGER DEFAULT 0,
    passing_score INTEGER DEFAULT 70,
    tags JSON,
    questions JSON,
    settings JSON,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    code VARCHAR(100) UNIQUE,
    type VARCHAR(100) DEFAULT 'Engineering',
    website TEXT,
    logo TEXT,
    address JSON,
    contact JSON,
    status VARCHAR(50) DEFAULT 'Active',
    has_departments BOOLEAN DEFAULT TRUE,
    notes TEXT,
    departments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'normal',
    target_audience JSON,
    publish_date TIMESTAMP,
    expiry_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_publish_date (publish_date),
    INDEX idx_created_at (created_at)
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    badges JSON,
    achievements JSON,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_total_points (total_points),
    INDEX idx_rank (rank),
    INDEX idx_created_at (created_at)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    event_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);

-- Insert sample data for testing
INSERT INTO tutorials (id, tutorial_id, topic_id, title, subtitle, reading_level, status, created_at) VALUES
('sample-1', 'TUT-001', 'TOP-001', 'Introduction to React', 'Learn the basics of React development', 'easy', 'published', NOW()),
('sample-2', 'TUT-002', 'TOP-002', 'Advanced JavaScript Patterns', 'Master advanced JavaScript concepts', 'hard', 'draft', NOW());

-- Insert sample user
INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES
('admin-1', 'admin@forgetrain.com', '$2b$10$hashedpassword', 'Admin User', 'admin', TRUE); 