-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 27 2017 г., 18:39
-- Версия сервера: 5.7.19
-- Версия PHP: 5.6.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `hm`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cf001`
--

DROP TABLE IF EXISTS `cf001`;
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
('root', '2017', '11');

-- --------------------------------------------------------

--
-- Структура таблицы `gl001`
--

DROP TABLE IF EXISTS `gl001`;
CREATE TABLE IF NOT EXISTS `gl001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dayin` date NOT NULL,
  `dayout` date NOT NULL,
  `room` int(3) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `paid` decimal(10,2) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `gl001`
--

INSERT INTO `gl001` (`id`, `dayin`, `dayout`, `room`, `price`, `paid`, `name`, `tel`, `info`, `user`, `timestamp`) VALUES
(1, '2017-11-10', '2017-11-13', 21, '100.00', '150.00', 'Ð˜Ð²Ð°Ð½Ð¾Ð² ÐÐ³Ð²Ð°Ð½ Ð¡Ñ‚Ð¸Ñ…Ð°Ð½Ð¾Ð²Ð¸Ñ‡', '+7(978)111-22-33', 'Ð¥Ð¾Ñ€Ð¾ÑˆÐ¸Ð¹ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº', '', '2017-11-20 17:54:53'),
(34, '2017-11-16', '2017-11-19', 21, '0.00', '0.00', 'Ð’Ð°ÑÐ¸Ð»Ð¸Ð¹ Ð˜Ð²Ð°Ð½Ð¾Ð²Ð¸Ñ‡', '', '', '', '2017-11-22 12:31:08'),
(35, '2017-11-22', '2017-11-25', 21, '0.00', '0.00', 'Ð§ÐµÐ±ÑƒÑ€Ð°ÑˆÐºÐ°', '', '', '', '2017-11-27 13:34:14'),
(36, '2017-11-28', '2017-11-30', 21, '0.00', '0.00', 'Ð“ÐµÐ½Ð°', '', '', '', '2017-11-22 12:35:07'),
(37, '2017-11-04', '2017-11-07', 23, '0.00', '0.00', 'Ð¥Ð¾Ñ‚Ñ‚Ð°Ð±Ñ‹Ñ‡', '', '', '', '2017-11-22 12:38:48'),
(32, '2017-11-18', '2017-11-21', 13, '0.00', '0.00', 'ÐœÐµÐ½ÑÐµÑ‚', '', '', '', '2017-11-22 12:42:20'),
(6, '2017-11-28', '2017-12-05', 12, '1.00', '1.00', 'ÐŸÐµÑ‚Ñ€Ð¾Ð² ÐÐ¸ÐºÐ¾Ð»Ð°Ð¹ Ð—Ð°Ñ‚Ñ‹Ñ‡ÐºÐ¸Ð½', '', '', '', '2017-11-18 22:55:29'),
(31, '2017-11-16', '2017-11-19', 33, '0.00', '0.00', 'ÐŸÐµÑ‚ÑŒÐºÐ° ', '265485', '', '', '2017-11-26 10:39:09'),
(29, '2017-11-09', '2017-11-12', 11, '0.00', '0.00', 'Ð“ÑƒÑ€Ð³ÐµÐ½ ÐŸÑƒÑ€Ð³ÐµÐ½Ð¾Ð²', '', '', '', '2017-11-20 17:55:13'),
(30, '2017-11-01', '2017-11-10', 11, '0.00', '0.00', 'Ð˜Ð³Ð¾Ñ€', '', 'Ð¨ÐºÐµÑ‚', '', '2017-11-19 22:50:44'),
(38, '2017-11-14', '2017-11-19', 23, '0.00', '0.00', 'Ð¥Ð¾Ñ‚Ñ‚Ð°Ð±Ñ‹Ñ‡', '', '', '', '2017-11-26 12:51:11');

-- --------------------------------------------------------

--
-- Структура таблицы `lg001`
--

DROP TABLE IF EXISTS `lg001`;
CREATE TABLE IF NOT EXISTS `lg001` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `rm001`
--

DROP TABLE IF EXISTS `rm001`;
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

DROP TABLE IF EXISTS `us001`;
CREATE TABLE IF NOT EXISTS `us001` (
  `user` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `begda` date NOT NULL,
  `endda` date NOT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`user`),
  UNIQUE KEY `user` (`user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `us001`
--

INSERT INTO `us001` (`user`, `pass`, `begda`, `endda`, `active`) VALUES
('root', 'DB692CB80294827A26F5695CC270E5B06C7124CF5631A126D994DB8FD85291B34C63E33C48D07C4DD8493288354DB0EBB20C0447084E2BEE80FE35AD3F77990E', '2017-11-13', '9999-12-31', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
