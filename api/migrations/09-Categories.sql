CREATE TABLE `categories` (
  `name` varchar(255) DEFAULT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;