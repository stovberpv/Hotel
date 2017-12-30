-- phpMyAdmin SQL Dump
-- version 3.5.8.2
-- http://www.phpmyadmin.net
--
-- Хост: sql213.ezyro.com
-- Время создания: Дек 30 2017 г., 06:15
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
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user`),
  UNIQUE KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `cf001`
--

INSERT INTO `cf001` (`user`, `year`, `month`) VALUES
('root', '2017', '12'),
('naxa', '2017', '12');

-- --------------------------------------------------------

--
-- Структура таблицы `gl001`
--

CREATE TABLE IF NOT EXISTS `gl001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dayin` date NOT NULL,
  `dayout` date NOT NULL,
  `room` int(3) NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `paid` decimal(10,2) DEFAULT '0.00',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `tel` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `fn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

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
-- Структура таблицы `pb001`
--

CREATE TABLE IF NOT EXISTS `pb001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `tel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Структура таблицы `rm001`
--

CREATE TABLE IF NOT EXISTS `rm001` (
  `room` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`room`),
  UNIQUE KEY `room` (`room`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `rm001`
--

INSERT INTO `rm001` (`room`, `info`) VALUES
('11', ''),
('12', ''),
('13', ''),
('21', ''),
('22', ''),
('23', ''),
('31', ''),
('32', ''),
('33', ''),
('34', '');

-- --------------------------------------------------------

--
-- Структура таблицы `us001`
--

CREATE TABLE IF NOT EXISTS `us001` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `login` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `begda` date NOT NULL,
  `endda` date NOT NULL,
  `active` tinyint(1) NOT NULL,
  `sesid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=4 ;

--
-- Дамп данных таблицы `us001`
--

INSERT INTO `us001` (`id`, `login`, `pass`, `begda`, `endda`, `active`, `sesid`) VALUES
(1, 'root', 'root', '2017-09-01', '9999-12-31', 1, ''),
(2, 'user', 'user', '2017-09-01', '9999-12-31', 1, ''),
(3, 'naxa', 'Kolbaska', '2017-09-01', '9999-12-31', 1, '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
