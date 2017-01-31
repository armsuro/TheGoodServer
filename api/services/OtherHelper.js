module.exports = {
    filterNumber: function(number) {
        if (number) {
            number = number.replace(/\s\s+/g, ' ');
            number = number.replace(/ /g, '');
            number = number.replace(/[\[\]&()-]+/g, '');
            number = number.replace(/[\[\]&()-]+/g, '');
            return number.length > 10 ? number.slice(1, 11) : number;
        }else {
            return false
        }
    },
    pagInation: function(page, limit) {
        if(page == 1) return "LIMIT " + limit;

        return "LIMIT " + limit + " OFFSET " + page;
    },
    encrypt: function(model, length, type) {
        return new Promise(function(resolve, reject) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            if (type == 1) {
                var obj = {
                    status: 1,
                    encrypt: text
                }
            } else if (type == 2) {
                var obj = {
                    short_code: text
                }
            } else if (type == 3) {
                var obj = {
                    code: text
                }
            } else if (type == 4) {
                var obj = {
                    quiz_code: text
                }
            }
            model.findOne(obj).exec(function(err, data) {
                if (err) console.error(err)

                if (data) {
                    OtherHelper.encrypt(model, length, type)
                } else {
                    resolve(text)
                }
            })
        })
    },
    groupUsersUnique: function(groups) {
        var phoneNumbers = {}
        var dublicateNumers = 0
        return Promise.map(groups, function(group, i) {
            var groupUsers = []
            return Promise.map(group.groupUsers, function(groupUser, j) {
                if (!phoneNumbers[groupUser.phone]) {
                    groupUsers.push(groupUser)
                    phoneNumbers[groupUser.phone] = true;
                } else {
                    dublicateNumers += 1;
                }
            }).then(function() {
                groups[i].groupUsers = groupUsers
            })
        }).then(function() {
            return new Promise(function(resolve, reject) {
                resolve({
                    'groups': groups,
                    'dublicate_numbers': dublicateNumers
                })
            })
        })
    },
    getDateWithTimeZone: function(time, time_zone) {
        return moment(new Date(time + " " + time_zone)).utc().format("YYYY:MM:DD HH-mm-ss");
    },
    filterCompanyName: function(message, companyName) {
        var replace = message.replace(":COMPANY_NAME", companyName)

        if (replace.length > MAX_MESSAGE_SIZE) {
            var name = companyName.slice(0, MAX_MESSAGE_SIZE - replace.length)
            return message.replace(":COMPANY_NAME", name)
        } else {
            return replace
        }
    },
    createGroupUserLog: function(obj) {
        return ConfirmationLogs.create(obj)
    }
}