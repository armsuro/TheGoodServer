CREATE TABLE `role_groups` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `role_groups` (`name`, `id`) VALUES
('Super Admin', 1);

CREATE TABLE `users` (
  `username` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role_group_id` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`username`, `first_name`, `last_name`, `password`, `email`, `role_group_id`, `token`, `is_active`, `secret_key`, `id`, `created_at`, `updated_at`) VALUES
('suren', 'Suren', 'Gasparyan', '81dc9bdb52d04dc20036dbd8313ed055', 'suren.gasparyan@gmail.com', 1, NULL, 1, '1111', 1, '2017-01-31 05:17:17', NULL);

ALTER TABLE `role_groups`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

ALTER TABLE `role_groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;