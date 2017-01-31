/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {


    '*': ['tokenAuth', 'checkCart'],

    'SignupController': true,

    'UrlController': true,

    'QuizController': {
        'openUrl': true,
        'createQuiz': ['tokenAuth', 'checkCart'],
        'updateQuiz': ['tokenAuth', 'checkCart'],
        'updateQuizQuestion': ['tokenAuth', 'checkCart'],
        'deleteQuiz': ['tokenAuth', 'checkCart']
    },
    'SingleController': {
        "getSinglePageData": true,
        "checkUrlCode": true,
        "addUserInList": true,
        "openSinglePage": true
    },
    'UsersController': {
        'signIn': true,
        'generaterResetKey': true,
        'resetPassword': true,
        'createNewCard': ['tokenAuth'],
        'create': ['tokenAuth'],
        'updateUser': ['tokenAuth']
    },
    'InboundsController': {
        'sendInbound': true,
        'dlr': true
    },
    'DashboardController': {
        'sendContuctUs': true
    },
    'ManageController': {
        'stripeCallback': true,
        'getCuponCodes': ['tokenAuth', 'manageAuth'],
        'createCoupon': ['tokenAuth', 'manageAuth'],
        'updateCoupon': ['tokenAuth', 'manageAuth'],
        'deleteCoupon': ['tokenAuth', 'manageAuth'],
        'getClients': ['tokenAuth', 'manageAuth'],
        'getDashboardData': ['tokenAuth', 'manageAuth'],
        'getUserHistory': ['tokenAuth', 'manageAuth'],
        'getUsersHistory': ['tokenAuth', 'manageAuth'],
        'chargeByUserId': ['tokenAuth', 'manageAuth'],
        'getUserPaymentsHistory': ['tokenAuth'],
        'findWishList': ['tokenAuth', 'manageAuth'],
        'getClientInfo': ['tokenAuth', 'manageAuth'],
        'findContuctUs': ['tokenAuth', 'manageAuth'],
        'createStopCode': ['tokenAuth', 'manageAuth'],
        'updateStopCode': ['tokenAuth', 'manageAuth'],
        'deleteStopCode': ['tokenAuth', 'manageAuth'],
        'getStopCodes': ['tokenAuth', 'manageAuth'],
        'getClientReferrals': ['tokenAuth', 'manageAuth'],
        'getAllReferralUsers': ['tokenAuth', 'manageAuth'],
        'updateReferalUser': ['tokenAuth', 'manageAuth'],
        'getAllSubscribersLists': ['tokenAuth', 'manageAuth'],
        'updateSubscribersListStatus': ['tokenAuth', 'manageAuth'],
        'getInvoiceDetails': ['tokenAuth'],
        'writeLanguages': ['tokenAuth', 'manageAuth'],
        'readLanguages': true,
        'createReplayMessage': ['tokenAuth', 'manageAuth'],
        'getReplayMessages': ['tokenAuth', 'manageAuth'],
        'updateReplayMessage': ['tokenAuth', 'manageAuth'],
        'checkCodeUnique': ['tokenAuth', 'manageAuth'],
        'createNotification': ['tokenAuth', 'manageAuth'],
        'updateNotification': ['tokenAuth', 'manageAuth'],
        'deleteNotification': ['tokenAuth', 'manageAuth'],
        'getNotifications': ['tokenAuth', 'manageAuth'],
        'getCompanyList': ['tokenAuth', 'manageAuth'],
        'getDlrLogs': ['tokenAuth', 'manageAuth'],
        'uploadSql': ['tokenAuth', 'manageAuth'],
        'changeClientPhoneNumber': ['tokenAuth', 'manageAuth']
    },
    'ReferralController': {
        'createReferralCode': ['tokenAuth', 'referralAuth'],
        'updateReferralCode': ['tokenAuth', 'referralAuth'],
        'deleteReferralCode': ['tokenAuth', 'referralAuth'],
        'getReferralCode': ['tokenAuth', 'referralAuth']
    },
    'ScheduleController': {
        'sentJob': true
    }
};