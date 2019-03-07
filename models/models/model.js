const Sequelize = require("sequelize")

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:4567/Pick_A_Park', {
    dialect: 'postgres'
  });

// const db = new Sequelize({
//     database: "Pick_A_Park",
//     dialect: "postgres"
//  })

const User = db.define('users', {
    user_name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    session_token: {
        type: Sequelize.STRING // May Not Need
    }
})

const Camp = db.define('camps', {
    camp_id: {
        type: Sequelize.INTEGER
    },
    park_code: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    directions_overview: {
        type: Sequelize.TEXT
    },
    weather_overview: {
        type: Sequelize.TEXT
    },
    directions_url: {
        type: Sequelize.TEXT
    },
    lat_long: {
        type: Sequelize.STRING
    }
})

const Park = db.define('parks', {
    park_code: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    designation: {
        type: Sequelize.TEXT
    },
    lat_long: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    directions: {
        type: Sequelize.TEXT
    },
    weather: {
        type: Sequelize.TEXT
    },
    url: {
        type: Sequelize.STRING
    },
})

Park.hasMany(Camp, {onDelete: "cascade"})
Camp.belongsTo(Park, {onDelete: "cascade"})

Park.belongsToMany(User, {
    through: "park_user_xref",
})
User.belongsToMany(Park, {
    through: "park_user_xref",
})

Camp.belongsToMany(User, {through: {
    model: "camp_user_xref"
}})
User.belongsToMany(Camp, {through: {
    model: "camp_user_xref"
}})

module.exports = {
    db,
    User,
    Camp,
    Park
}