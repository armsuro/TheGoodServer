CREATE TABLE `sliders` (
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `image_url` longtext,
  `status` tinyint(1) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sliders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;