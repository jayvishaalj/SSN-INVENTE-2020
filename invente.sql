-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql: 3306
-- Generation Time: Jan 03, 2021 at 11:47 AM
-- Server version: 8.0.2-dmr
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `invente`
--
CREATE DATABASE IF NOT EXISTS `invente` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `invente`;

-- --------------------------------------------------------

--
-- Table structure for table `attendees`
--

DROP TABLE IF EXISTS `attendees`;
CREATE TABLE `attendees` (
  `eventid` int(11) NOT NULL,
  `userid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `attendees`
--

TRUNCATE TABLE `attendees`;
-- --------------------------------------------------------

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` varchar(25) NOT NULL,
  `dept` varchar(10) NOT NULL,
  `day` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 TABLESPACE `mysql`;

--
-- Truncate table before insert `events`
--

TRUNCATE TABLE `events`;
--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `type`, `dept`, `day`) VALUES
(101, 'Codolympics', 'Technical', 'CSE', 1),
(102, 'Web-it-out', 'Technical', 'CSE', 1),
(103, 'App-off', 'Techinical', 'CSE', 2),
(104, 'Mock job drive', 'Non Technical', 'CSE', 1),
(105, 'Hackersasylum', 'Techinical', 'CSE', 1),
(106, 'Fun Oasis', 'Non Technical', 'CSE', 1),
(107, 'Paper presentation', 'Techinical', 'CSE', 2),
(108, 'UXI', 'Technical', 'CSE', 2),
(201, 'Enigma (Crypt It)', 'Techinical', 'IT', 1),
(202, 'Websitica (Web Dev)', 'Technical', 'IT', 1),
(203, 'Codera (DS and Algorithms)', 'Techinical', 'IT', 1),
(204, 'Reverse Gear (Reverse Coding)', 'Technical', 'IT', 1),
(205, 'Papyrus (Paper Presentation)', 'Techinical', 'IT', 2),
(206, 'Imitation Games (Mock Interview)', 'Technical', 'IT', 2),
(207, 'Analytics Sprint (Data Analytics)', 'Techinical', 'IT', 2),
(208, 'Sports Quiz', 'Non Technical', 'IT', 1),
(209, 'E-Treasure Hunt', 'Non Techinical', 'IT', 2),
(301, 'e-Treasure Hunt', 'Techinical', 'ECE', 1),
(302, 'Enigma', 'Technical', 'ECE', 1),
(303, 'Data Utopia', 'Techinical', 'ECE', 1),
(304, 'Entertainment Quiz', 'Non Technical', 'ECE', 1),
(305, 'Make-a-thon', 'Techinical', 'ECE', 1),
(306, 'Pitch it Please!', 'Technical', 'ECE', 1),
(307, 'Hackinfinity', 'Techinical', 'ECE', 1),
(308, 'IPL Auction', 'Non Technical', 'ECE', 2),
(309, 'Junkyard Jumble', 'Techinical', 'ECE', 2),
(310, 'Paper Presentation', 'Technical', 'ECE', 2),
(311, 'Think D', 'Techinical', 'ECE', 2),
(401, 'Ideate', 'Techinical', 'EEE', 1),
(402, 'Tech Quiz', 'Technical', 'EEE', 1),
(403, 'Inventino', 'Techinical', 'EEE', 1),
(404, 'Electronic Maze', 'Technical', 'EEE', 1),
(405, 'D-Sim', 'Techinical', 'EEE', 2),
(406, 'Paper Presentation', 'Technical', 'EEE', 2),
(407, 'IPL Bidding', 'Non Techinical', 'EEE', 2),
(408, 'Tentkota', 'Non Technical', 'EEE', 1),
(501, 'Paper Presentation', 'Techinical', 'CIVIL', 2),
(502, 'CAD-a-thon', 'Technical', 'CIVIL', 1),
(503, 'Just Add KLVs', 'Techinical', 'CIVIL', 1),
(504, 'Business Battle', 'Technical', 'CIVIL', 1),
(505, 'Quizophile', 'Techinical', 'CIVIL', 1),
(506, 'Extemporize', 'Technical', 'CIVIL', 2),
(507, 'Take De-Bail', 'Techinical', 'CIVIL', 2),
(508, 'Quarantine Shots', 'Non Technical', 'CIVIL', 1),
(509, 'PES Titans', 'Non Techinical', 'CIVIL', 2),
(510, 'Build-a-thon', 'Technical', 'CIVIL', 1),
(601, 'Medical Mystery', 'Techinical', 'BME', 1),
(602, 'Sketch Up – A 3D Designing Competition', 'Technical', 'BME', 1),
(603, 'Deadman’s Chest', 'Techinical', 'BME', 1),
(604, 'e-Biomart', 'Technical', 'BME', 2),
(605, 'Paper Presentation – Bio-Medical', 'Techinical', 'BME', 2),
(606, 'Escape the Hill House', 'Non Technical', 'BME', 1),
(607, 'Min-e Olympics', 'Non Techinical', 'BME', 2),
(701, 'Product analysis (Prosuchen)', 'Non Techinical', 'MECH', 1),
(702, '3D Printing', 'Technical', 'MECH', 1),
(703, 'Technical Jam', 'Techinical', 'MECH', 2),
(704, 'Mechathalon', 'Technical', 'MECH', 2),
(705, 'Auto Quiz', 'Technical', 'MECH', 2),
(706, 'Design Contest', 'Technical', 'MECH', 1),
(707, 'Paper Presentation', 'Technical', 'MECH', 2),
(708, 'Project Exhibition', 'Technical', 'MECH', 2),
(709, 'E Treasure Hunt', 'Non Technical', 'MECH', 1),
(710, 'Mystery Event', 'Non Technical', 'MECH', 2),
(801, 'Oral presentation', 'Techinical', 'CHEM', 1),
(802, 'Riddler’s Picture show', 'Technical', 'CHEM', 1),
(803, 'Black sheep', 'Techinical', 'CHEM', 1),
(804, 'PoCHEMon gotta quiz em al', 'Technical', 'CHEM', 2),
(805, 'The Chosen one', 'Technical', 'CHEM', 2),
(806, 'Kid vs Kat', 'Technical', 'CHEM', 1),
(807, 'Shutter up', 'Non Technical', 'CHEM', 1),
(808, 'Talent hunt', 'Non Technical', 'CHEM', 1),
(809, 'Memer Bros.', 'Non Technical', 'CHEM', 2);

-- --------------------------------------------------------

--
-- Table structure for table `pwdreset`
--

DROP TABLE IF EXISTS `pwdreset`;
CREATE TABLE `pwdreset` (
  `email` varchar(150) NOT NULL,
  `token` varchar(50) NOT NULL,
  `expires` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `pwdreset`
--

TRUNCATE TABLE `pwdreset`;
-- --------------------------------------------------------

--
-- Table structure for table `superuser`
--

DROP TABLE IF EXISTS `superuser`;
CREATE TABLE `superuser` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `superuser`
--

TRUNCATE TABLE `superuser`;
--
-- Dumping data for table `superuser`
--

INSERT INTO `superuser` (`id`, `name`, `email`, `password`) VALUES
(1, 'Jay Vishaal J', 'jayvishaalj.01@gmail.com', '$2a$10$l1Y0hBl.HbNkSwzXJtkHbO2d9WxfXqprOnhUq29MuaJTsqJMMbK5C');

-- --------------------------------------------------------

--
-- Table structure for table `updatedby`
--

DROP TABLE IF EXISTS `updatedby`;
CREATE TABLE `updatedby` (
  `superuserid` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `useremail` varchar(150) NOT NULL,
  `transactionid` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `updatedby`
--

TRUNCATE TABLE `updatedby`;
-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `phone` bigint(10) NOT NULL,
  `college` varchar(150) NOT NULL,
  `regno` bigint(20) NOT NULL,
  `paid` int(3) NOT NULL DEFAULT '0',
  `dept` varchar(150) NOT NULL,
  `year` varchar(10) NOT NULL,
  `workshopPaid` tinyint(1) NOT NULL DEFAULT '0',
  `workshopId` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `users`
--

TRUNCATE TABLE `users`;
--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `college`, `regno`, `paid`, `dept`, `year`, `workshopPaid`, `workshopId`) VALUES
(6, 'Test', 'test@test.com', '$2a$10$wKRvskrkw1CDLYieReD9IeNZnxesxGH5uHEawpWWW.JRF5QYwnvjO', 9123456789, 'SSN', 312217104000, 0, 'CSE', '4th Year', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workshops`
--

DROP TABLE IF EXISTS `workshops`;
CREATE TABLE `workshops` (
  `id` int(3) NOT NULL,
  `name` varchar(150) NOT NULL,
  `dept` varchar(10) NOT NULL,
  `day` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncate table before insert `workshops`
--

TRUNCATE TABLE `workshops`;
--
-- Dumping data for table `workshops`
--

INSERT INTO `workshops` (`id`, `name`, `dept`, `day`) VALUES
(901, 'CSE WORKSHOP', 'CSE', 1),
(902, 'ECE WORKSOP', 'ECE', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendees`
--
ALTER TABLE `attendees`
  ADD PRIMARY KEY (`eventid`,`userid`),
  ADD KEY `USER` (`userid`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pwdreset`
--
ALTER TABLE `pwdreset`
  ADD PRIMARY KEY (`token`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `superuser`
--
ALTER TABLE `superuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `updatedby`
--
ALTER TABLE `updatedby`
  ADD PRIMARY KEY (`superuserid`,`userid`,`useremail`,`amount`),
  ADD UNIQUE KEY `transactionid` (`transactionid`),
  ADD UNIQUE KEY `transactionid_2` (`transactionid`),
  ADD KEY `userID` (`userid`),
  ADD KEY `userEmail` (`useremail`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `regno` (`regno`),
  ADD KEY `WORKSHOP` (`workshopId`);

--
-- Indexes for table `workshops`
--
ALTER TABLE `workshops`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `superuser`
--
ALTER TABLE `superuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendees`
--
ALTER TABLE `attendees`
  ADD CONSTRAINT `EVENT` FOREIGN KEY (`eventid`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `USER` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `updatedby`
--
ALTER TABLE `updatedby`
  ADD CONSTRAINT `superUserID` FOREIGN KEY (`superuserid`) REFERENCES `superuser` (`id`),
  ADD CONSTRAINT `userEmail` FOREIGN KEY (`useremail`) REFERENCES `users` (`email`),
  ADD CONSTRAINT `userID` FOREIGN KEY (`userid`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `WORKSHOP` FOREIGN KEY (`workshopId`) REFERENCES `workshops` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
