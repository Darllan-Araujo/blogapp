//Importa a lib sequelize usando o 'require' e já declara ela na const
const Sequelize = require('sequelize');

// Conexão com o BD
const sequelize = new Sequelize('postapp', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports={
    Sequelize: Sequelize,
    sequelize: sequelize,
}