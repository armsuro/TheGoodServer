CREATE TABLE `single_page_themes` (
  `name` varchar(255) DEFAULT NULL,
  `styles` longtext,
  `icon` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `single_page_themes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `single_page_themes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;