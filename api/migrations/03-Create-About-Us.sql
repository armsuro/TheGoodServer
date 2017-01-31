CREATE TABLE `contuct_us` (
  `text` longtext,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `contuct_us`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `contuct_us`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;