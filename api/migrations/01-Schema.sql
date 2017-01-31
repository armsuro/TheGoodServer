CREATE TABLE `billing_informations` (
  `user_id` int(11) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO `billing_informations` VALUES (null, '4803354830', '16601 n 40th st, Unit 218', 'phoenix', 'az', '85032', '1', '2016-10-28 19:28:42');
INSERT INTO `billing_informations` VALUES ('8', '1111111111', 'zeytun', 'Suren', 'Gasparyan', '1111', '2', '2016-10-29 19:56:24');
INSERT INTO `billing_informations` VALUES ('12', '4803354830', '7222 E Gainey Ranch Rd, 241', 'scottsdale', 'AZ', '85258', '3', '2016-11-10 16:55:43');
INSERT INTO `billing_informations` VALUES ('13', '9287583830', '2840 Highway 95 Ste 422', 'Bullhead City', 'AZ', '86442', '4', '2016-11-11 17:32:44');
INSERT INTO `billing_informations` VALUES ('17', '6028708700', '10040 N Metro Pkwy W', 'Phoenix', 'AZ', '85051', '5', '2016-11-30 22:54:26');
INSERT INTO `billing_informations` VALUES ('20', '5208861003', '112 S Kolb Rd', 'Tucson', 'AZ', '85712', '6', '2016-12-22 00:36:18');
INSERT INTO `billing_informations` VALUES ('21', '6024822019', '7950 E Acoma Dr #108', 'Scottsdale', 'AZ', '85260', '7', '2017-01-03 21:06:34');
INSERT INTO `billing_informations` VALUES ('22', '9286848880', '1175 W. Wickenburg Way Suite #4', 'Wickenburg', 'AZ', '85390', '8', '2017-01-20 19:31:47');

CREATE TABLE `company` (
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `callback_url` varchar(255) DEFAULT NULL,
  `live_messaging` tinyint(4) DEFAULT NULL,
  `quiz` tinyint(4) NOT NULL DEFAULT '1',
  `vip` tinyint(4) DEFAULT NULL,
  `schedule` tinyint(4) NOT NULL DEFAULT '0',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

INSERT INTO `company` VALUES ('DataOwl', '13109097377', null, null, '1', '0', '0', '0', '1', '2016-10-24 15:18:19');
INSERT INTO `company` VALUES ('Oxford', '16029262052', null, null, '1', '0', '0', '0', '2', '2016-10-28 19:28:42');
INSERT INTO `company` VALUES ('Test', '12013405927', null, null, '1', '0', '0', '0', '3', '2016-10-29 19:56:24');
INSERT INTO `company` VALUES ('VartanCODE', '18554441778', '::ffff:172.17.42.1', null, '1', '1', '1', '1', '4', '2016-11-10 16:55:43');
INSERT INTO `company` VALUES ('Valley Healing Group', '18662328250', '::ffff:172.17.42.1', null, '1', '0', '1', '1', '5', '2016-11-11 17:32:44');
INSERT INTO `company` VALUES ('Metro Meds', '18554441987', '::ffff:172.17.42.1', null, '1', '0', '1', '1', '6', '2016-11-30 22:54:26');
INSERT INTO `company` VALUES ('Southern Arizona Integrated Therapies', '18554442062', '::ffff:172.17.42.1', null, '1', '0', '1', '1', '7', '2016-12-22 00:36:18');
INSERT INTO `company` VALUES ('Uncle Herbs', '18555086253', '::ffff:172.17.42.1', null, '1', '0', '1', '1', '8', '2017-01-03 21:06:34');
INSERT INTO `company` VALUES ('MMJ Apothecary', '18552076888', '::ffff:172.17.42.1', 'https://api.dataowl.io/users/changeCallbackUrl', '1', '1', '1', '0', '9', '2017-01-20 19:31:46');


CREATE TABLE `confirmation_logs` (
  `group_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT '0',
  `company_id` int(11) DEFAULT '0',
  `message` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;


CREATE TABLE `contuct_us` (
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `contuct_us` VALUES ('Davit', 'Davtayn', 'davtyan96@gmail.com', 'This is Text Message', '1', '2016-11-07 15:16:51');

CREATE TABLE `defaults` (
  `value` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `dlr_logs` (
  `from` varchar(255) DEFAULT NULL,
  `to` varchar(255) DEFAULT NULL,
  `json` longtext,
  `status` varchar(255) DEFAULT NULL,
  `body` longtext,
  `type` varchar(255) DEFAULT NULL,
  `status_code` varchar(255) DEFAULT NULL,
  `flowroute_id` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114513 DEFAULT CHARSET=utf8;

CREATE TABLE `group_users` (
  `group_id` int(11) DEFAULT NULL,
  `company_id` int(11) NOT NULL,
  `short_code` varchar(15) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `reference_id` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_type` varchar(255) NOT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31317 DEFAULT CHARSET=latin1;

CREATE TABLE `group_users_logs` (
  `group_id` int(11) DEFAULT NULL,
  `log_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `record_id` varchar(255) DEFAULT NULL,
  `quiz` tinyint(4) NOT NULL DEFAULT '0',
  `sent_type` tinyint(4) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158597 DEFAULT CHARSET=latin1;

CREATE TABLE `groups` (
  `name` varchar(255) DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `replay_message` longtext,
  `company_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

CREATE TABLE `inbounds` (
  `record_id` varchar(255) DEFAULT NULL,
  `to` varchar(255) DEFAULT NULL,
  `from` varchar(255) DEFAULT NULL,
  `reviewed` tinyint(1) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2053 DEFAULT CHARSET=latin1;

CREATE TABLE `inbounds_logs` (
  `phone` varchar(255) DEFAULT NULL,
  `company_id` int(11) NOT NULL DEFAULT '0',
  `inbounds_id` int(11) DEFAULT NULL,
  `record_id` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `user_message` tinyint(1) DEFAULT NULL,
  `reviewed` tinyint(4) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3415 DEFAULT CHARSET=latin1;


CREATE TABLE `link_tracker` (
  `group_id` int(11) DEFAULT NULL,
  `message_id` int(11) DEFAULT NULL,
  `url` longtext,
  `encrypt` longtext,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

CREATE TABLE `link_tracker_logs` (
  `link_id` int(11) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;


CREATE TABLE `message_templates` (
  `name` varchar(255) DEFAULT NULL,
  `message` longtext,
  `company_id` int(11) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;


CREATE TABLE `migrations` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8;


CREATE TABLE `notifications` (
  `message` longtext,
  `deleted` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `npas_codes` (
  `npas` int(11) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=336 DEFAULT CHARSET=utf8;


INSERT INTO `npas_codes` VALUES ('877', '333', '2017-01-10 13:36:44');
INSERT INTO `npas_codes` VALUES ('866', '334', '2017-01-10 13:36:50');
INSERT INTO `npas_codes` VALUES ('855', '335', '2017-01-10 13:37:06');


CREATE TABLE `phone_numbers` (
  `number` varchar(255) DEFAULT NULL,
  `payed` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

INSERT INTO `phone_numbers` VALUES ('13109097377', '1', '1', '2016-10-24 16:14:00');
INSERT INTO `phone_numbers` VALUES ('16029262052', '1', '2', '2016-10-28 19:28:42');
INSERT INTO `phone_numbers` VALUES ('12013405927', '1', '3', '2016-10-29 19:56:24');
INSERT INTO `phone_numbers` VALUES ('18554441778', '1', '4', '2016-11-10 16:55:43');
INSERT INTO `phone_numbers` VALUES ('18662328250', '1', '5', '2016-11-11 17:32:44');
INSERT INTO `phone_numbers` VALUES ('18554441987', '1', '6', '2016-11-30 22:54:26');
INSERT INTO `phone_numbers` VALUES ('18554442062', '1', '7', '2016-12-22 00:36:18');
INSERT INTO `phone_numbers` VALUES ('18555086253', '1', '8', '2017-01-03 21:06:34');
INSERT INTO `phone_numbers` VALUES ('18552076888', '1', '9', '2017-01-20 19:31:46');

CREATE TABLE `pricing_plans` (
  `name` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `sub_title` varchar(255) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `one_message_price` float DEFAULT NULL,
  `description` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `pricing_plans` VALUES ('Silver', '1000', 'Startup', '49', '0.04', '<b>Included</b> <ul class=\"no-p lstn\"> <li>1,000 FREE TEXT CREDITS</li> <li>Unlimited Subscribers</li> <li>Unlimited Keywords</li> <li>Reporting</li> </ul>', '1', '2016-10-24 18:21:10');
INSERT INTO `pricing_plans` VALUES ('Platinum', '10000', 'Established', '149', '0.02', '<b>Included</b> <ul class=\"no-p lstn\"> <li>10,000 FREE TEXT CREDITS</li> <li>Unlimited Subscribers</li> <li>Unlimited Keywords</li> <li>Reporting</li> <li>Automatic Replies</li> <li>Two Way Texting</li> </ul>', '2', '2016-10-24 18:38:10');
INSERT INTO `pricing_plans` VALUES ('Gold', '2500', 'Growing', '99', '0.03', '<b>Included</b> <ul class=\"no-p lstn\"> <li>3,000 FREE TEXT CREDITS</li> <li>Unlimited Subscribers</li> <li>Unlimited Keywords</li> <li>Reporting</li> <li>Automatic Replies</li> </ul>', '3', '2016-10-24 18:32:10');


CREATE TABLE `quiz` (
  `quiz` longtext,
  `code` varchar(255) DEFAULT NULL,
  `author_id` int(11) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=170 DEFAULT CHARSET=utf8;

CREATE TABLE `quiz_answers` (
  `quiz_code` varchar(255) DEFAULT NULL,
  `answer_code` varchar(255) DEFAULT NULL,
  `user_code` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `quiz_questions` (
  `quiz_id` int(11) DEFAULT NULL,
  `question` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8;

CREATE TABLE `referral_codes` (
  `user_id` int(11) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `replay_messages` (
  `message` longtext,
  `code` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

CREATE TABLE `role_groups` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


INSERT INTO `role_groups` VALUES ('Client Admin', '1');
INSERT INTO `role_groups` VALUES ('Menager', '2');
INSERT INTO `role_groups` VALUES ('Super Admin', '3');
INSERT INTO `role_groups` VALUES ('Referral User', '4');

CREATE TABLE `schedule` (
  `name` varchar(255) DEFAULT NULL,
  `message` longtext,
  `groups` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `select_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sent_time` timestamp NULL DEFAULT NULL,
  `sented` tinyint(4) NOT NULL DEFAULT '0',
  `urls` longtext,
  `state` varchar(255) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

CREATE TABLE `single_page` (
  `company_id` int(11) DEFAULT NULL,
  `url_code` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` longtext,
  `logo_url` varchar(255) DEFAULT NULL,
  `group_ids` varchar(255) DEFAULT NULL,
  `style` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;


CREATE TABLE `stop_codes` (
  `code` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `username` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role_group_id` int(11) DEFAULT '1',
  `token` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `reset_key` varchar(255) DEFAULT NULL,
  `secret_key` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `referral_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `stripe_user_id` varchar(255) DEFAULT NULL,
  `stripe_user_token` varchar(255) DEFAULT NULL,
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `stripe_card_id` varchar(255) DEFAULT NULL,
  `update_card` tinyint(4) DEFAULT NULL,
  `account_canceled` tinyint(4) DEFAULT NULL,
  `debt` varchar(100) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

INSERT INTO `users` VALUES ('cpm_vartan', 'Vartan', 'Arabyan', '58426993bf7e473a8de6ebf3e73dd15a', 'vartancode@gmail.com', '3', '38fb4fefb7a13e8ecffc3b9f66ec9c0b', '1', null, null, '1', null, null, '2017-01-23 17:20:48', null, null, null, null, '0', null, null, '9');
INSERT INTO `users` VALUES ('vartanarabyan', 'Vartan', 'Arabyan', '58426993bf7e473a8de6ebf3e73dd15a', 'vartana@gmail.com', '1', '1b96e87ef6b752aaae9d44c8aae8fbc1', '1', '1ee5da09ab0f15909b6aa352ef5a1522448f7230b4af90274004d1824c54749e9a0c76ebe1d693c2d4', 'oP1EkH0yE2K5TonJpE', '4', null, '2016-11-10 16:55:43', '2017-01-24 09:26:27', 'cus_9XQhPo95mETFiM', 'tok_19ELqVF80DfTwaWppkbmXcMt', 'sub_9XQhPjuHndeCOl', 'card_19ELqVF80DfTwaWpSdHCJp0g', '0', '0', null, '12');
INSERT INTO `users` VALUES ('VhgMaster', 'James', 'MCGUE', 'cf0e3b43f61dfd57894c7d28dec1d6f0', 'MCGUEJAMES@GMAIL.COM', '1', 'c54c0922332268858f199eab3f9ff8f4', '1', null, null, '5', null, '2016-11-11 17:32:44', '2017-01-24 16:21:18', 'cus_9XoWALMGs13Kvy', 'tok_19EitLF80DfTwaWpzlzTFGom', 'sub_9XoWErZ6Zav2cD', 'card_19d3sLF80DfTwaWpVW5qifnv', null, '0', null, '13');
INSERT INTO `users` VALUES ('davo', 'Davit', 'Davtyan', '823da4223e46ec671a10ea13d7823534', 'davtyan96@gmail.com', '2', '836582012052622cb3f87719a9af7726', '1', '', null, '4', null, '2016-11-17 10:17:40', '2017-01-18 16:24:25', null, null, null, null, '0', '0', null, '14');
INSERT INTO `users` VALUES ('admin', 'admin', 'admin', '751cb3f4aa17c36186f4856c8982bf27', 'admin@admin.com', '2', 'f54fbec9f8acb20d6f7f25be81d20f19', '1', null, null, '4', null, '2016-11-23 20:52:46', '2016-12-13 11:04:56', null, null, null, null, '0', '0', null, '15');
INSERT INTO `users` VALUES ('conner', 'Conner', 'Aiken', '62e57c374cafa7f2f10579a723be8c0c', 'conner.aiken@biotrackthc.com', '2', '1b1b2141dc877d66d8fa2db70852ce0a', '1', '', null, '4', null, '2016-11-24 10:16:01', '2017-01-23 17:14:30', null, null, null, null, '0', '0', null, '16');
INSERT INTO `users` VALUES ('metromeds', 'Martin', 'Yono', 'cd3045588e57fb01293b6590e2b838b1', 'celestia.r.rodriguez@gmail.com', '1', 'fa7e75a58382321994ac09214fff499b', '1', '1ee0da09ab0f1b94966aa054ef5a1522458f7033b4ae9c274006d1824c54749e9a0c76ebe1d693c2d4', null, '6', null, '2016-11-30 22:54:26', '2017-01-17 16:46:57', 'cus_9f0dPVcJISkbo2', '', 'sub_9f0dF5wOH5Xr1W', 'card_19Z4NyF80DfTwaWpvtjzolEN', '0', '0', '0', '17');
INSERT INTO `users` VALUES ('referral', 'Referral', 'Ref', '823da4223e46ec671a10ea13d7823534', 'referral@gmail.com', '4', '8b9e9fa0591317a9383fa5fa203724ed', '1', null, null, null, null, '2016-12-01 14:44:54', '2016-12-02 13:46:50', null, null, null, null, null, '0', null, '18');
INSERT INTO `users` VALUES ('suren.gasparyan', 'Suren', 'Gasparyan', '59a9fd481727704f87826fc8ebe6e624', 'suren.gasparyan1997@gmail.com', '2', '0f2f80f3bfae298a9b482fa31b754ead', '1', '1eeecb1ea60f15909b6aa25aef5a1522448f7238b4a89727440ad1824c54749e9a0c76ebe1d693c2d4', null, '4', null, '2016-12-05 10:17:45', '2017-01-24 16:16:26', null, null, null, null, '0', '0', null, '19');
INSERT INTO `users` VALUES ('TucsonSaints', 'Tim', 'Arnold', 'e71764dd00d4aa402322ac22543b51e9', 'tucsonsaints@gmail.com', '1', '08c46f579343224dc8d641273dfa4b03', '1', null, null, '7', null, '2016-12-22 00:36:18', '2017-01-23 01:27:56', 'cus_9muNcIQIAbpkDh', 'tok_19TKZ9F80DfTwaWpSRCoYWny', 'sub_9muNkHnMEYAcDE', 'card_19bK3rF80DfTwaWpaQluaFkH', '0', '0', '0', '20');
INSERT INTO `users` VALUES ('UncleHerbs', 'Rolley', 'White', 'e0f889f8f0cc160a5e054a0a883ba68b', 'info@uncleherbsaz.com', '1', '3d9038f5b939e37cf05f15e85e179c72', '1', null, null, '8', null, '2017-01-03 21:06:34', '2017-01-22 17:56:01', 'cus_9riwsJn31sQJnf', 'tok_19XzUJF80DfTwaWpIJL78McP', 'sub_9riwzBU27FE5iy', 'card_19XzUJF80DfTwaWplHyD07QQ', null, '0', null, '21');
INSERT INTO `users` VALUES ('mmjapothecary', 'Stephen', 'Yurek', '06ce0df304a4301a04c565c0c99659bc', 'stephenyurek@gmail.com', '1', '6741c0e0416c3a0602d43c3cc0fa79f1', '1', null, null, '9', null, '2017-01-20 19:31:46', '2017-01-24 00:47:03', 'cus_9y4FSYTo6OMOBs', 'tok_19e86sF80DfTwaWpemXA6jlP', 'sub_9y4FW8mgZ6m8GN', 'card_19e86sF80DfTwaWpZNQtvCjz', null, '0', null, '22');

CREATE TABLE `users_charges` (
  `user_id` int(11) DEFAULT NULL,
  `pricing_id` int(11) DEFAULT NULL,
  `charge_id` varchar(255) DEFAULT NULL,
  `keyword` varchar(255) DEFAULT NULL,
  `charge_amount` varchar(255) NOT NULL,
  `description` longtext,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

INSERT INTO `users_charges` VALUES ('12', '4', 'Monthly', '1', '149', null, '1', '2016-11-10 16:55:43');
INSERT INTO `users_charges` VALUES ('13', '5', 'Monthly', '1', '149', null, '4', '2016-11-11 17:32:44');
INSERT INTO `users_charges` VALUES ('17', '6', 'Monthly', '1', '149', null, '5', '2016-11-30 22:54:26');
INSERT INTO `users_charges` VALUES ('13', '5', '2', null, '177.98', null, '6', '2016-12-07 14:53:20');
INSERT INTO `users_charges` VALUES ('12', '2', '', '1', '49', null, '7', '2016-12-10 16:56:31');
INSERT INTO `users_charges` VALUES ('13', '2', '', '1', '149', null, '8', '2016-12-11 17:32:56');
INSERT INTO `users_charges` VALUES ('12', '1', null, '1', '49', 'Montly Silver', '9', '2016-12-10 17:32:56');
INSERT INTO `users_charges` VALUES ('17', '2', 'ch_19RPmYF80DfTwaWpWM2DCJDL', '2', '89.94', 'Charge 4497 messages', '10', '2016-12-16 17:46:11');
INSERT INTO `users_charges` VALUES ('20', '7', 'Monthly', '1', '149', 'Monthly charge', '11', '2016-12-22 00:36:18');
INSERT INTO `users_charges` VALUES ('17', '2', 'ch_19TQNzF80DfTwaWpfekT79fa', '2', '80.28', 'Charge 4014 messages', '12', '2016-12-22 06:49:08');
INSERT INTO `users_charges` VALUES ('17', '2', 'ch_19VTdQF80DfTwaWpeqzS87a5', '2', '220.18', 'Charge 11009 messages', '13', '2016-12-27 22:41:33');
INSERT INTO `users_charges` VALUES ('17', '2', '', '1', '149', 'Montly Platinum', '14', '2016-12-30 22:32:31');
INSERT INTO `users_charges` VALUES ('21', '8', 'Monthly', '1', '149', 'Monthly charge', '15', '2017-01-03 21:06:34');
INSERT INTO `users_charges` VALUES ('12', '1', '', '1', '49', 'Montly Silver', '16', '2017-01-10 16:57:02');
INSERT INTO `users_charges` VALUES ('13', '2', 'ch_19aa7rF80DfTwaWpJeAg1NZX', '2', '168.56', 'Charge 8428 messages', '17', '2017-01-11 00:38:04');
INSERT INTO `users_charges` VALUES ('13', '2', '', '1', '149', 'Montly Platinum', '18', '2017-01-11 17:33:04');
INSERT INTO `users_charges` VALUES ('20', '2', 'ch_19bbpBF80DfTwaWp6YIodlTz', '2', '198.76', 'Charge 9938 messages', '19', '2017-01-13 20:39:02');
INSERT INTO `users_charges` VALUES ('20', '2', 'ch_19cN5eF80DfTwaWpHtfUE6fs', '2', '88', 'Charge 4400 messages', '20', '2017-01-15 23:07:11');
INSERT INTO `users_charges` VALUES ('20', '2', 'ch_19dMKUF80DfTwaWpMzc6Gu8D', '2', '83.64', 'Charge 4182 messages', '21', '2017-01-18 16:30:35');
INSERT INTO `users_charges` VALUES ('17', '2', 'ch_19dMLFF80DfTwaWp9dCQbs8w', '2', '349.64', 'Charge 17482 messages', '22', '2017-01-18 16:31:22');
INSERT INTO `users_charges` VALUES ('13', '2', 'ch_19dMLkF80DfTwaWp54QRl2g9', '2', '35.980000000000004', 'Charge 1799 messages', '23', '2017-01-18 16:31:53');
INSERT INTO `users_charges` VALUES ('22', '9', 'Monthly', '1', '149', 'Monthly charge', '24', '2017-01-20 19:31:46');
INSERT INTO `users_charges` VALUES ('20', '2', 'ch_19eUqLF80DfTwaWprk6qG2c8', '2', '134.34', 'Charge 6717 messages', '25', '2017-01-21 19:48:10');
INSERT INTO `users_charges` VALUES ('20', '2', '', '1', '149', 'Montly Platinum', '26', '2017-01-22 00:37:57');

-- ----------------------------
-- Table structure for users_notifications
-- ----------------------------
CREATE TABLE `users_notifications` (
  `user_id` int(11) DEFAULT NULL,
  `notification_id` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users_notifications
-- ----------------------------

-- ----------------------------
-- Table structure for users_plans
-- ----------------------------
CREATE TABLE `users_plans` (
  `user_id` int(11) DEFAULT NULL,
  `pricing_id` int(11) DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users_plans
-- ----------------------------
INSERT INTO `users_plans` VALUES ('6', '2', '2016-11-30 19:40:33', '1', '2016-10-31 15:33:07');
INSERT INTO `users_plans` VALUES ('8', '1', '2016-11-30 19:41:01', '2', '2016-10-29 19:56:24');
INSERT INTO `users_plans` VALUES ('1', '2', '2016-11-09 15:49:01', '3', '2016-11-08 15:49:01');
INSERT INTO `users_plans` VALUES ('12', '1', '2017-02-10 16:56:16', '4', '2017-01-10 16:56:16');
INSERT INTO `users_plans` VALUES ('13', '2', '2017-02-11 17:32:45', '5', '2017-01-11 17:32:45');
INSERT INTO `users_plans` VALUES ('17', '2', '2017-01-30 22:32:18', '6', '2016-12-30 22:32:18');
INSERT INTO `users_plans` VALUES ('20', '2', '2017-02-22 00:36:16', '7', '2017-01-22 00:36:16');
INSERT INTO `users_plans` VALUES ('21', '2', '2017-02-03 21:06:33', '8', '2017-01-03 21:06:33');
INSERT INTO `users_plans` VALUES ('22', '2', '2017-02-20 19:31:44', '9', '2017-01-20 19:31:44');

-- ----------------------------
-- Table structure for wish_list
-- ----------------------------
CREATE TABLE `wish_list` (
  `message` longtext,
  `user_id` int(11) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
