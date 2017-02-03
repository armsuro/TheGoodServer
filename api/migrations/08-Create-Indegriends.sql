CREATE TABLE `ingridents` (
  `name` varchar(255) DEFAULT NULL,
  `parcent` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `ingridents`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `ingridents`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;