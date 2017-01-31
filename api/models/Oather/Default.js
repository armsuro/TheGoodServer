/**
 * Default.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'defaults',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        value: {
            type: 'String'
        },
        name: {
            type: "String"
        }
    },
    startQuestion: function() {
        return this.findOne({
            'name': 'START_QUESTION'
        });
    }
};