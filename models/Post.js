const db = require('./db')

const Post = db.sequelize.define('postagens', {
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    }
})

//o post.sync serve pra criar a tabela no bd
//Post.sync({force: true})

module.exports = Post