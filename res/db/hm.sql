-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Хост: sql213.ezyro.com
-- Время создания: Апр 15 2018 г., 18:44
-- Версия сервера: 5.6.35-81.0
-- Версия PHP: 5.3.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `ezyro_21252859_hm`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cf001`
--

CREATE TABLE IF NOT EXISTS `cf001` (
  `unid` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `moon` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`unid`),
  UNIQUE KEY `user` (`unid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `cf001`
--

INSERT INTO `cf001` (`unid`, `year`, `moon`) VALUES
('1', '2017', '12'),
('3', '2017', '12'),
('5', '2017', '12'),
('6', '2017', '12'),
('7', '2017', '12');

-- --------------------------------------------------------

--
-- Структура таблицы `gl001`
--

CREATE TABLE IF NOT EXISTS `gl001` (
  `unid` int(11) NOT NULL AUTO_INCREMENT,
  `dbeg` date NOT NULL,
  `dend` date NOT NULL,
  `days` int(11) DEFAULT '0',
  `room` int(3) NOT NULL,
  `base` decimal(10,2) DEFAULT '0.00',
  `adjs` decimal(10,2) DEFAULT '0.00',
  `cost` decimal(10,2) DEFAULT '0.00',
  `paid` decimal(10,2) DEFAULT '0.00',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teln` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fnot` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`unid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=201 ;

--
-- Дамп данных таблицы `gl001`
--

INSERT INTO `gl001` (`unid`, `dbeg`, `dend`, `days`, `room`, `base`, `adjs`, `cost`, `paid`, `name`, `teln`, `fnot`, `city`, `user`, `timestamp`) VALUES
(1, '2017-11-01', '2017-11-21', 21, 21, '300.00', '10.00', '6510.00', '6510.00', 'some name', ' 777', 'some note', 'some city', 'naxa', '2018-03-22 21:04:17'),
(157, '2017-12-15', '2017-12-20', 6, 32, '220.00', '0.00', '1320.00', '1300.00', 'name', ' 6', 'some note', 'some city', 'naxa', '2018-03-22 20:54:32'),
(158, '2017-12-10', '2017-12-18', 9, 21, '300.00', '0.00', '2700.00', '2700.00', 'Человек', ' 7', 'Текст', 'Симф', 'naxa', '2018-03-22 20:51:24'),
(178, '2017-12-12', '2017-12-14', 3, 34, '100.00', '0.00', '300.00', '300.00', 'Яська', '333', '', 'Симф', 'root', '2018-03-22 20:54:36'),
(190, '2017-07-13', '2017-07-15', 3, 12, '100.00', '0.00', '300.00', '300.00', '', '', '', '', 'root', '2018-03-22 21:04:28'),
(188, '2017-06-01', '2017-06-30', 30, 23, '120.00', '0.00', '3600.00', '3600.00', 'Засухина', '', '', 'мухосранск', 'naxa', '2018-03-22 20:56:01'),
(165, '2017-12-04', '2017-12-05', 2, 11, '200.00', '-5.00', '390.00', '200.00', 'new', '666-999-333', 'new fnote', 'new city', 'naxa', '2018-04-13 18:38:24'),
(167, '2017-10-11', '2017-10-14', 4, 22, '250.00', '0.00', '1000.00', '1000.00', 'Человек 1', ' 10', 'Примечание 1', 'Город 1', 'naxa', '2018-03-22 20:54:53'),
(168, '2017-10-14', '2017-10-17', 4, 22, '250.00', '0.00', '1000.00', '100.00', 'Человек 2', ' 20', 'Примечание 2', 'Город 2', 'naxa', '2018-03-23 10:33:46'),
(169, '2017-10-14', '2017-10-14', 1, 32, '220.00', '0.00', '220.00', '220.00', 'Иванов Кирилл Петрович', ' 2(353)778-913-22', 'Не любит море', 'Люберцы', 'naxa', '2018-03-22 20:55:01'),
(193, '2018-03-22', '2018-03-26', 5, 21, '300.00', '0.00', '1500.00', '1500.00', '', '', '', '', 'root', '2018-03-23 20:16:34'),
(194, '2018-03-20', '2018-03-22', 3, 21, '300.00', '0.00', '900.00', '900.00', '', '', '', '', 'root', '2018-03-23 20:16:49'),
(191, '2017-08-15', '2017-08-18', 4, 22, '250.00', '0.00', '1000.00', '1000.00', '', '', '', '', 'root', '2018-03-22 21:04:34'),
(192, '2017-09-15', '2017-09-21', 7, 13, '150.00', '0.00', '1050.00', '1050.00', '', '', '', '', 'root', '2018-03-22 21:04:43'),
(195, '2017-07-09', '2017-07-16', 8, 22, '250.00', '0.00', '2000.00', '2000.00', '', '', '', '', 'root', '2018-03-25 18:01:20'),
(197, '2018-04-12', '2018-04-14', 3, 21, '300.00', '0.00', '900.00', '2400.00', 'Эрнесто Че Гевара', '', 'Viva la cuba! Viva la revolucion! ', 'Росарио', 'root', '2018-03-31 19:43:52'),
(198, '2018-05-13', '2018-05-16', 4, 21, '300.00', '0.00', '1200.00', '4000.00', '', '', '', '', 'root', '2018-03-25 18:21:19');

-- --------------------------------------------------------

--
-- Структура таблицы `lg001`
--

CREATE TABLE IF NOT EXISTS `lg001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `nt001`
--

CREATE TABLE IF NOT EXISTS `nt001` (
  `unid` int(11) NOT NULL AUTO_INCREMENT,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `stat` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`unid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `pb001`
--

CREATE TABLE IF NOT EXISTS `pb001` (
  `unid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `teln` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  PRIMARY KEY (`unid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=39 ;

--
-- Дамп данных таблицы `pb001`
--

INSERT INTO `pb001` (`unid`, `name`, `teln`, `city`, `info`) VALUES
(26, 'Засухина', '', 'мухосранск', ''),
(14, 'Черногоров Денис Борисович', '7(978)727-22-31', 'СПб', 'Просто человек'),
(15, 'Цикало Иван Петрович', '', '', ''),
(17, 'Василий Иванович', '111', '', 'СССР');

-- --------------------------------------------------------

--
-- Структура таблицы `rm001`
--

CREATE TABLE IF NOT EXISTS `rm001` (
  `unid` int(11) NOT NULL DEFAULT '0',
  `room` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base` decimal(10,2) DEFAULT '0.00',
  `info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  PRIMARY KEY (`unid`),
  UNIQUE KEY `room` (`room`),
  UNIQUE KEY `room_2` (`room`),
  UNIQUE KEY `unid` (`unid`),
  UNIQUE KEY `unid_2` (`unid`),
  UNIQUE KEY `unid_3` (`unid`),
  UNIQUE KEY `unid_4` (`unid`),
  UNIQUE KEY `unid_5` (`unid`),
  KEY `room_3` (`room`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `rm001`
--

INSERT INTO `rm001` (`unid`, `room`, `base`, `info`) VALUES
(1, '11', '200.00', ''),
(2, '12', '100.00', ''),
(3, '13', '150.00', ''),
(4, '21', '300.00', ''),
(5, '22', '250.00', ''),
(6, '23', '120.00', ''),
(7, '31', '410.00', ''),
(8, '32', '220.00', ''),
(9, '33', '500.00', ''),
(10, '34', '100.00', '');

-- --------------------------------------------------------

--
-- Структура таблицы `ts001`
--

CREATE TABLE IF NOT EXISTS `ts001` (
  `unid` int(11) NOT NULL AUTO_INCREMENT,
  `text` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `stat` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plnd` datetime NOT NULL,
  `crtd` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`unid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `us001`
--

CREATE TABLE IF NOT EXISTS `us001` (
  `unid` int(10) NOT NULL AUTO_INCREMENT,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pswd` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dbeg` date NOT NULL,
  `dend` date NOT NULL,
  `actv` tinyint(1) NOT NULL,
  `seid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`unid`),
  UNIQUE KEY `id` (`unid`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=8 ;

--
-- Дамп данных таблицы `us001`
--

INSERT INTO `us001` (`unid`, `user`, `pswd`, `dbeg`, `dend`, `actv`, `seid`) VALUES
(1, 'root', 'Kolbaska', '2017-09-01', '9999-12-31', 1, '3671c7bfa22a1d58daba'),
(3, 'naxa', 'Kolbaska', '2017-09-01', '9999-12-31', 1, 'c312d8628f8c9ed34294'),
(5, 'globa', 'toyota1', '2018-03-21', '9999-12-31', 1, ''),
(6, 'anna', 'anna', '2018-03-25', '9999-12-31', 1, ''),
(7, 'test', 'test', '2018-03-28', '2018-04-28', 1, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
