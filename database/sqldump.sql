-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_tracker`
--

DROP TABLE IF EXISTS `app_tracker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_tracker` (
  `uuid` varchar(36) DEFAULT NULL,
  `company_name` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `job_title` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_tracker`
--

LOCK TABLES `app_tracker` WRITE;
/*!40000 ALTER TABLE `app_tracker` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_tracker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocks`
--

DROP TABLE IF EXISTS `blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocks` (
  `uuid` varchar(36) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `type` enum('headers','skills','jobs','projects','clubs','interests') DEFAULT NULL,
  `label` varchar(30) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `summary` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `blocks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocks`
--

LOCK TABLES `blocks` WRITE;
/*!40000 ALTER TABLE `blocks` DISABLE KEYS */;
INSERT INTO `blocks` VALUES ('5915c474-d60c-11e7-9932-000c291b6367','2017-11-30 12:23:38','skills','sales associate','2017-11-30 12:23:38','7bb327a5-cb4b-11e7-821a-026d4863120d','## SALES ASSOCIATE @PLACE \n ..* make monthly sales goals \n ..* increase company profits by 5% annually with new promotion'),('c297e95b-cf3d-11e7-a173-000c291b6367','2017-11-21 20:29:42','headers','block 1','2017-11-21 20:29:42','7bb327a5-cb4b-11e7-821a-026d4863120d',' ## JOE SMITH \n #### city, state | phone: 111-111-1111 | email: joesmith@email.com\n ==='),('cef2510c-cf3d-11e7-a173-000c291b6367','2017-11-21 20:30:03','headers','block 2','2017-11-21 20:30:03','7bb327a5-cb4b-11e7-821a-026d4863120d','## SARAH LEE \n '),('d7d628a9-d60d-11e7-9932-000c291b6367','2017-11-30 12:34:20','headers','extra','2017-11-30 12:34:20','7bb327a5-cb4b-11e7-821a-026d4863120d','-----'),('e457b5cc-d60b-11e7-9932-000c291b6367','2017-11-30 12:20:22','skills','donut shop job','2017-11-30 12:20:22','7bb327a5-cb4b-11e7-821a-026d4863120d','## DONUT PLACE\n -decorated and baked donuts \n -took customer orders and told them about promotions');
/*!40000 ALTER TABLE `blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `uuid` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `document_id` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`uuid`),
  KEY `document_id` (`document_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('05b5883e-cff1-11e7-92cb-000c291b6367','7bb327a5-cb4b-11e7-821a-026d4863120d','5479dcaf-cce6-11e7-810c-000c291b6367','2017-11-22 05:52:54',NULL,NULL,'meh'),('5768a25e-cff0-11e7-92cb-000c291b6367','7bb327a5-cb4b-11e7-821a-026d4863120d','5479dcaf-cce6-11e7-810c-000c291b6367','2017-11-22 05:48:01',NULL,NULL,'hello'),('9d5ec2d5-d014-11e7-92cb-000c291b6367','7bb327a5-cb4b-11e7-821a-026d4863120d','5479dcaf-cce6-11e7-810c-000c291b6367','2017-11-22 10:07:41',NULL,NULL,'hello'),('a7daa374-cff0-11e7-92cb-000c291b6367','7bb327a5-cb4b-11e7-821a-026d4863120d','5479dcaf-cce6-11e7-810c-000c291b6367','2017-11-22 05:50:16',NULL,NULL,'woot woot'),('aded571d-cff0-11e7-92cb-000c291b6367','7bb327a5-cb4b-11e7-821a-026d4863120d','58a5bbb4-ce45-11e7-a4f8-000c291b6367','2017-11-22 05:50:26',NULL,NULL,'tree');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_blocks`
--

DROP TABLE IF EXISTS `document_blocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document_blocks` (
  `document_id` varchar(36) NOT NULL,
  `block_id` varchar(36) NOT NULL,
  `block_order` int(11) NOT NULL,
  KEY `document_id` (`document_id`),
  KEY `block_id` (`block_id`),
  CONSTRAINT `document_blocks_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`uuid`),
  CONSTRAINT `document_blocks_ibfk_2` FOREIGN KEY (`block_id`) REFERENCES `blocks` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_blocks`
--

LOCK TABLES `document_blocks` WRITE;
/*!40000 ALTER TABLE `document_blocks` DISABLE KEYS */;
INSERT INTO `document_blocks` VALUES ('5479dcaf-cce6-11e7-810c-000c291b6367','c297e95b-cf3d-11e7-a173-000c291b6367',1),('5479dcaf-cce6-11e7-810c-000c291b6367','c297e95b-cf3d-11e7-a173-000c291b6367',2),('5479dcaf-cce6-11e7-810c-000c291b6367','cef2510c-cf3d-11e7-a173-000c291b6367',3),('58a5bbb4-ce45-11e7-a4f8-000c291b6367','cef2510c-cf3d-11e7-a173-000c291b6367',1);
/*!40000 ALTER TABLE `document_blocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `uuid` varchar(36) NOT NULL,
  `created_at` datetime NOT NULL,
  `title` varchar(30) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `version` int(11) NOT NULL,
  `filepath` varchar(50) DEFAULT NULL,
  `filename` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`,`version`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES ('5479dcaf-cce6-11e7-810c-000c291b6367','2017-11-18 20:58:48','first document','7bb327a5-cb4b-11e7-821a-026d4863120d',1,'1/3/3/','EipjRV.pdf'),('58a5bbb4-ce45-11e7-a4f8-000c291b6367','2017-11-18 20:59:59','Second Document','7bb327a5-cb4b-11e7-821a-026d4863120d',1,'1/1/3/','HmYibh.pdf');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shared_files`
--

DROP TABLE IF EXISTS `shared_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shared_files` (
  `owner_id` varchar(36) DEFAULT NULL,
  `user_email` varchar(30) DEFAULT NULL,
  `document_id` varchar(36) DEFAULT NULL,
  KEY `owner_id` (`owner_id`),
  KEY `user_email` (`user_email`),
  KEY `document_id` (`document_id`),
  CONSTRAINT `shared_files_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`uuid`),
  CONSTRAINT `shared_files_ibfk_2` FOREIGN KEY (`user_email`) REFERENCES `users` (`email_address`),
  CONSTRAINT `shared_files_ibfk_3` FOREIGN KEY (`document_id`) REFERENCES `documents` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shared_files`
--

LOCK TABLES `shared_files` WRITE;
/*!40000 ALTER TABLE `shared_files` DISABLE KEYS */;
INSERT INTO `shared_files` VALUES ('7bb327a5-cb4b-11e7-821a-026d4863120d','user2@email.com','58a5bbb4-ce45-11e7-a4f8-000c291b6367');
/*!40000 ALTER TABLE `shared_files` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `uuid` varchar(36) NOT NULL,
  `type` varchar(36),
  `user_id` varchar(36) NOT NULL,
  `sender` varchar(36)  NOT NULL,
  `document_id` varchar(36),
  `created_at` datetime NOT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`uuid`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`document_id`) REFERENCES `documents` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
	



DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `uuid` varchar(36) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `cas_id` varchar(20) DEFAULT NULL,
  `linkedin_id` varchar(50) DEFAULT NULL,
  `email_address` varchar(30) NOT NULL,
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email_address` (`email_address`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0909bc3a-ccd7-11e7-9de2-000c291b6367','sel','$2a$10$.YbLianXD11B9GVmuvBYbO670qMs6czUSriJ2lA8Bv7r5JEa1j6Gm',NULL,NULL,NULL,NULL,'sel@email.com'),('4b4ddc10-ccd7-11e7-9de2-000c291b6367','pas','$2a$10$wx8n2JcRrl5IG6RgnmGxduuBWbLmfPRGt3nnVOxJ9BJvznBAv1iRa',NULL,NULL,NULL,NULL,'pas@email.com'),('7bb327a5-cb4b-11e7-821a-026d4863120d','user1','$2a$10$HnxCd1bRpqC00vzhVyqO8uwMuoi3Et02DkQpN/LyceAJbZczWOOHG','user1','smith',NULL,NULL,'user1@email.com'),('8da2bb6e-cb4b-11\ne7-821a-026d4863120','user2','$2a$10$HnxCd1bRpqC00vzhVyqO8uwMuoi3Et02DkQpN/LyceAJbZczWOOHG','user2','smith',NULL,NULL,'user2@email.com'),('99d3ced7-cb4b-11e7-821a-026d4863120d','user3','$2a$10$HnxCd1bRpqC00vzhVyqO8uwMuoi3Et02DkQpN/LyceAJbZczWOOHG','user3','peters\n',NULL,NULL,'user3@email.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-04 10:09:04
