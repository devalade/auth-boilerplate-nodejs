module.exports = function(sequelize, DataTypes) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        googleId: {
            type: DataTypes.STRING
        },
        facebookId: {
            type: DataTypes.STRING
        },
        twitterId: {
            type: DataTypes.STRING
        },
        githubId: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING,
            notEmpty: true
        },
        lastname: {
            type: DataTypes.STRING,
            notEmpty: true
        },
 
        username: {
            type: DataTypes.TEXT,
            notEmpty: true
        },
 
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },

        salt: {
            type: DataTypes.TEXT
        },
 
        last_login: {
            type: DataTypes.DATE
        },
 
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
 
 
    });
 
    return User;
 
}