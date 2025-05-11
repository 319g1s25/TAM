-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: ta_management
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authstaff`
--

DROP TABLE IF EXISTS `authstaff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authstaff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authstaff`
--

LOCK TABLES `authstaff` WRITE;
/*!40000 ALTER TABLE `authstaff` DISABLE KEYS */;
INSERT INTO `authstaff` VALUES (1,'Merve','Can','merve@bilkent.edu.tr','merve1234'),(2,'Mehmet','Öztürk','mehmet@bilkent.edu.tr','mehmet1234'),(3,'Ali ','Zafer','ali@bilkent.edu.tr','ali1234');
/*!40000 ALTER TABLE `authstaff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` varchar(45) NOT NULL,
  `capacity` int unsigned NOT NULL,
  `examCapacity` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES (1, 'BZ102', 64, 32), (2, 'BZ103', 64, 32);
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `department` varchar(60) NOT NULL,
  `course_code` varchar(60) NOT NULL,
  `description` varchar(700) DEFAULT NULL,
  `semester` varchar(60) NOT NULL,
  `credit` int NOT NULL,
  `ta_required` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (12,'Algorithms And Programming','Computer Science','CS101','entry level cs course','Spring 2024',3,3),(13,'Algorithms And Programming 2','Computer Science','CS102','entry level cs course','Spring 2024',3,3),(14,'Data Structures ','Computer Science','CS201','data structures course','Spring 2024',4,5);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_student`
--

DROP TABLE IF EXISTS `course_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `courseID` int DEFAULT NULL,
  `studentID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_student_id_cs` (`studentID`),
  KEY `fk_course_id_cs` (`courseID`),
  CONSTRAINT `fk_course_id_cs` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_id_cs` FOREIGN KEY (`studentID`) REFERENCES `student` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_student`
--

LOCK TABLES `course_student` WRITE;
/*!40000 ALTER TABLE `course_student` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deansoffice`
--

DROP TABLE IF EXISTS `deansoffice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deansoffice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deansoffice`
--

LOCK TABLES `deansoffice` WRITE;
/*!40000 ALTER TABLE `deansoffice` DISABLE KEYS */;
INSERT INTO `deansoffice` VALUES (1,'Çınar','Kurt','cinar@bilkent.edu.tr','cinar1234');
/*!40000 ALTER TABLE `deansoffice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departmentchair`
--

DROP TABLE IF EXISTS `departmentchair`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departmentchair` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departmentchair`
--

LOCK TABLES `departmentchair` WRITE;
/*!40000 ALTER TABLE `departmentchair` DISABLE KEYS */;
INSERT INTO `departmentchair` VALUES (1,'Begüm','Çınar','begum@bilkent.edu.tr','begum1234');
/*!40000 ALTER TABLE `departmentchair` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam`
--

DROP TABLE IF EXISTS `exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `courseID` int DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `proctorsRequired` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_course_id` (`courseID`),
  CONSTRAINT `fk_course_id` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam`
--

LOCK TABLES `exam` WRITE;
/*!40000 ALTER TABLE `exam` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_classroom`
--

DROP TABLE IF EXISTS `exam_classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_classroom` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examID` int DEFAULT NULL,
  `classroomID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exam_id` (`examID`),
  KEY `fk_classroom_id` (`classroomID`),
  CONSTRAINT `fk_classroom_id` FOREIGN KEY (`classroomID`) REFERENCES `classroom` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exam_id` FOREIGN KEY (`examID`) REFERENCES `exam` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_classroom`
--

LOCK TABLES `exam_classroom` WRITE;
/*!40000 ALTER TABLE `exam_classroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor`
--

DROP TABLE IF EXISTS `instructor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor`
--

LOCK TABLES `instructor` WRITE;
/*!40000 ALTER TABLE `instructor` DISABLE KEYS */;
INSERT INTO `instructor` VALUES (1,'Uğur','Doğrusöz','Computer Science','ugur@bilkent.edu.tr','ugur1234'),(2,'Uğur','Güdükbay','Computer Science','ugurg@bilkent.edu.tr','ugurg1234'),(3,'Ercüment','Çiçek','Computer Science','ercument@bilkent.edu.tr','ercument1234');
/*!40000 ALTER TABLE `instructor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructor_course`
--

DROP TABLE IF EXISTS `instructor_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructor_course` (
  `courseID` int NOT NULL,
  `instructorID` int NOT NULL,
  PRIMARY KEY (`courseID`,`instructorID`),
  KEY `fk_instructor_id_ic` (`instructorID`),
  CONSTRAINT `fk_course_id_ic` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_instructor_id_ic` FOREIGN KEY (`instructorID`) REFERENCES `instructor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructor_course`
--

LOCK TABLES `instructor_course` WRITE;
/*!40000 ALTER TABLE `instructor_course` DISABLE KEYS */;
INSERT INTO `instructor_course` VALUES (12,1),(13,2),(14,3);
/*!40000 ALTER TABLE `instructor_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaverequest`
--

DROP TABLE IF EXISTS `leaverequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaverequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taID` int NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `note` varchar(400) ,
  `reviewedBy` VARCHAR(100) DEFAULT NULL,
  `reviewDate` DATETIME DEFAULT NULL,
  `reviewComments` TEXT DEFAULT NULL, 
  PRIMARY KEY (`id`),
  KEY `fk_ta_id` (`taID`),
  CONSTRAINT `fk_ta_id` FOREIGN KEY (`taID`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaverequest`
--

LOCK TABLES `leaverequest` WRITE;
/*!40000 ALTER TABLE `leaverequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `leaverequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proctoringassignment`
--

DROP TABLE IF EXISTS `proctoringassignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proctoringassignment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taID` int NOT NULL,
  `examID` int NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exam_id_pa` (`examID`),
  KEY `fk_ta_id_pa` (`taID`),
  CONSTRAINT `fk_exam_id_pa` FOREIGN KEY (`examID`) REFERENCES `exam` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ta_id_pa` FOREIGN KEY (`taID`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proctoringassignment`
--

LOCK TABLES `proctoringassignment` WRITE;
/*!40000 ALTER TABLE `proctoringassignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `proctoringassignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `surname` varchar(60) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_exam_classroom`
--

DROP TABLE IF EXISTS `student_exam_classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_exam_classroom` (
  `studentID` int NOT NULL,
  `exam_classroomID` int NOT NULL,
  PRIMARY KEY (`studentID`,`exam_classroomID`),
  KEY `fk_exam_classroom_id_sec` (`exam_classroomID`),
  CONSTRAINT `fk_exam_classroom_id_sec` FOREIGN KEY (`exam_classroomID`) REFERENCES `exam_classroom` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_student_id_sec` FOREIGN KEY (`studentID`) REFERENCES `student` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_exam_classroom`
--

LOCK TABLES `student_exam_classroom` WRITE;
/*!40000 ALTER TABLE `student_exam_classroom` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_exam_classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `swaprequest`
--

DROP TABLE IF EXISTS `swaprequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `swaprequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `examID` int NOT NULL,
  `swappingTaID` int NOT NULL,
  `swappedTaID` int NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_exam_id_sr` (`examID`),
  KEY `fk_swapping_ta_id` (`swappingTaID`),
  KEY `fk_swapped_ta_id` (`swappedTaID`),
  CONSTRAINT `fk_exam_id_sr` FOREIGN KEY (`examID`) REFERENCES `exam` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_swapped_ta_id` FOREIGN KEY (`swappedTaID`) REFERENCES `ta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_swapping_ta_id` FOREIGN KEY (`swappingTaID`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `swaprequest`
--

LOCK TABLES `swaprequest` WRITE;
/*!40000 ALTER TABLE `swaprequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `swaprequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ta`
--

DROP TABLE IF EXISTS `ta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `isOnLeave` tinyint DEFAULT NULL,
  `totalWorkload` int DEFAULT NULL,
  `msOrPhdStatus` varchar(10) DEFAULT NULL,
  `proctoringEnabled` tinyint DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ta`
--

LOCK TABLES `ta` WRITE;
/*!40000 ALTER TABLE `ta` DISABLE KEYS */;
INSERT INTO `ta` VALUES
(1, 'Ahmet', 'Yılmaz', 'ahmet@bilkent.edu.tr', 'ahmet1234', 1, 20, 'MS', 1, 'Computer Science'),
(2, 'Elif', 'Kara', 'elif@bilkent.edu.tr', 'elif1234', 0, 15, 'PhD', 1, 'Endustrial Engineering'),
(3, 'Mehmet', 'Öztürk', 'mehmet@bilkent.edu.tr', 'mehmet1234', 1, 25, 'PhD', 0, 'Computer Science'),
(4, 'Nazlı', 'Çevik', 'nazli@bilkent.edu.tr', 'nazli1234', 0, 25, 'PhD', 1, 'Computer Science'),
(5, 'Zeynep', 'Demir', 'zeynep@bilkent.edu.tr', 'zeynep1234', 0, 18, 'MS', 0, 'Computer Science'),
(6, 'Burak', 'Aslan', 'burak@bilkent.edu.tr', 'burak1234', 1, 20, 'MS', 1, 'Industrial Engineering'),
(7, 'Ece', 'Aydın', 'ece@bilkent.edu.tr', 'ece1234', 0, 22, 'PhD', 1, 'Industrial Engineering'),
(8, 'Mert', 'Çelik', 'mert@bilkent.edu.tr', 'mert1234', 1, 30, 'MS', 0, 'Computer Science');
/*!40000 ALTER TABLE `ta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tacourse`
--

DROP TABLE IF EXISTS `tacourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tacourse` (
  `courseID` int NOT NULL,
  `taID` int NOT NULL,
  PRIMARY KEY (`courseID`,`taID`),
  KEY `fk_ta_id_tc` (`taID`),
  CONSTRAINT `fk_course_id_tc` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ta_id_tc` FOREIGN KEY (`taID`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tacourse`
--

LOCK TABLES `tacourse` WRITE;
/*!40000 ALTER TABLE `tacourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `tacourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `taID` int NOT NULL,
  `courseID` int NOT NULL,
  `date` date NOT NULL,
  `hoursspent` int NOT NULL,
  `description` varchar(700) DEFAULT NULL,
  `tasktype` varchar(100) NOT NULL,
  `approved` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ta_id_tasks` (`taID`),
  KEY `fk_course_id_tasks` (`courseID`),
  CONSTRAINT `fk_course_id_tasks` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ta_id_tasks` FOREIGN KEY (`taID`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (3,4,12,'2025-05-04',1,'aa','labAssistance',0),(4,4,12,'2025-05-04',2,'work performed','labAssistance',1),(5,4,12,'2025-05-04',7,'work performed again','officeHours',1),(6,4,13,'2025-05-04',1,'bla bla','labAssistance',1);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `surname` varchar(60) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nikki','Lauda',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_assignments_course_id` (`course_id`),
  CONSTRAINT `fk_assignments_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES 
(1, 12, 'Assignment 1', 'Basic programming concepts', '2024-04-15'),
(2, 12, 'Assignment 2', 'Arrays and loops', '2024-04-22'),
(3, 13, 'Assignment 1', 'Object-oriented programming', '2024-04-16'),
(4, 14, 'Assignment 1', 'Linked lists', '2024-04-17');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workload`
--

DROP TABLE IF EXISTS `workload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `workload` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ta_id` int NOT NULL,
  `course_id` int NOT NULL,
  `date` date NOT NULL,
  `hours` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `approved` boolean DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ta_id_workload` (`ta_id`),
  KEY `fk_course_id_workload` (`course_id`),
  CONSTRAINT `fk_course_id_workload` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ta_id_workload` FOREIGN KEY (`ta_id`) REFERENCES `ta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workload`
--

LOCK TABLES `workload` WRITE;
/*!40000 ALTER TABLE `workload` DISABLE KEYS */;
INSERT INTO `workload` VALUES 
(1, 1, 12, '2024-04-11', 2.5, 'Graded assignment 1', true),
(2, 2, 12, '2024-04-12', 3.0, 'Graded assignment 2', true),
(3, 3, 13, '2024-04-13', 2.0, 'Graded assignment 1', true),
(4, 4, 14, '2024-04-14', 2.5, 'Graded assignment 1', true);
/*!40000 ALTER TABLE `workload` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-04  2:40:15
