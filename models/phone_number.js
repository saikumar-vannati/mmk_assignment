module.exports = (sequelize, DataTypes) => {
    const PhoneNumber = sequelize.define('phone_number', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        number: {
            type: DataTypes.STRING(40)
        },
        account_id: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    PhoneNumber.getPhoneNumberByAccountId = function (number, accountId) {

        
        return PhoneNumber.findOne({
            where: {
                number: number,
                account_id: accountId
            },
            raw: true
        })
    }

    return PhoneNumber
}