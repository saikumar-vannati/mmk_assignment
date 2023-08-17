module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('account', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        auth_id: {
            type: DataTypes.STRING(40)
        },
        username: {
            type: DataTypes.STRING(30)
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    Account.getUserAccount = function getUserAccount(username, authId) {

        return Account.findOne({
            where: {
                username: username,
                auth_id: authId
            },
            raw: true
        })
    }

    return Account
}