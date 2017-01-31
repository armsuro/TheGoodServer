module.exports = {
    validateUser: function(user) {
        var password = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})")
        var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (password.test(user.password) && email.test(user.email)) {
            return true;
        } else {
            return false
        }
    }
}