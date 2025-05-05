-- Create exam table if it doesn't exist
CREATE TABLE IF NOT EXISTS exam (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userID INT NOT NULL,
  courseID INT NOT NULL,
  date DATETIME NOT NULL,
  duration DECIMAL(5,2) NOT NULL,
  proctorsRequired INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create proctoringassignment table if it doesn't exist
CREATE TABLE IF NOT EXISTS proctoringassignment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examID INT NOT NULL,
  taID INT NOT NULL,
  status ENUM('assigned', 'accepted', 'declined', 'completed') DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_exam_ta (examID, taID)
);
