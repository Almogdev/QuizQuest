-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.5.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6816
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table quizquest.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `level` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table quizquest.admins: ~0 rows (approximately)

-- Dumping structure for table quizquest.player_data
CREATE TABLE IF NOT EXISTS `player_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `school_id` int(11) NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `quizes_done` int(11) NOT NULL DEFAULT 0,
  `personal_score` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  KEY `player_data_fk2` (`school_id`),
  CONSTRAINT `player_data_fk2` FOREIGN KEY (`school_id`) REFERENCES `schools_data` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table quizquest.player_data: ~2 rows (approximately)
INSERT INTO `player_data` (`id`, `user_name`, `school_id`, `grade`, `quizes_done`, `personal_score`) VALUES
	(1, 'almog', 1, 'c', 0, 18),
	(2, 'almogi', 1, 'c', 0, 0);

-- Dumping structure for table quizquest.questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer_1` text NOT NULL,
  `answer_2` text NOT NULL,
  `answer_3` text NOT NULL,
  `answer_4` text NOT NULL,
  `correct_answer` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `questions_fk1` (`quiz_id`),
  CONSTRAINT `questions_fk1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table quizquest.questions: ~5 rows (approximately)
INSERT INTO `questions` (`id`, `quiz_id`, `question`, `answer_1`, `answer_2`, `answer_3`, `answer_4`, `correct_answer`) VALUES
	(1, 1, '2 + 2 = ?', '4', '5', '6', '3', '4'),
	(2, 1, '5 + 5 = ?', '5', '10', '3', '15', '10'),
	(3, 1, '6 * 2 = ?', '55', '2', '0', '12', '12'),
	(4, 2, 'Capital of France?', 'Paris', 'Jerusalem', 'Canada', 'Tel Aviv', 'Paris'),
	(5, 2, 'Capital of Israel?', 'Tel Aviv', 'Tiberas', 'Jerusalem', 'Paris', 'Jerusalem');

-- Dumping structure for table quizquest.quizzes
CREATE TABLE IF NOT EXISTS `quizzes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `difficulty` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table quizquest.quizzes: ~0 rows (approximately)
INSERT INTO `quizzes` (`id`, `name`, `category`, `difficulty`, `image_url`) VALUES
	(1, 'Mathmatics1', 'Math', 1, ''),
	(2, 'Capitals', 'General', 1, '');

-- Dumping structure for table quizquest.schools_data
CREATE TABLE IF NOT EXISTS `schools_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT 'Unknown school',
  `score` int(11) NOT NULL DEFAULT 0,
  `lat` decimal(20,6) unsigned zerofill DEFAULT NULL,
  `lng` decimal(20,6) unsigned zerofill DEFAULT NULL,
  `best_category` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `logo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table quizquest.schools_data: ~3 rows (approximately)
INSERT INTO `schools_data` (`id`, `name`, `score`, `lat`, `lng`, `best_category`, `city`, `logo`) VALUES
	(1, 'school 1', 121, 00000000000032.781000, 00000000000035.528000, 'מתמטיקה', 'חולון', '/images/logo_example.png'),
	(2, 'אורט', 11, NULL, NULL, 'גאוגרפיה', 'באר שבע', '/images/logo_example.png'),
	(3, 'school 2', 55, 00000000000032.836202, 00000000000035.461462, 'אזרחות', 'תל אביב', '/images/logo_example.png'),
	(4, 'בית ספר אמירים', 60, NULL, NULL, 'עברית', 'טבריה', '/images/logo_example.png');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
