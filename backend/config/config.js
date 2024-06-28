const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_SERVICE_NAME,
  POSTGRES_PORT,
  NODE_ENV
} = process.env;

let options = {
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  host: POSTGRES_SERVICE_NAME,
  port: POSTGRES_PORT,
  dialect: 'postgres',
  seederStorage: 'sequelize',
  define: {
      timestamps: true,
      paranoid: true
  },

};

if (NODE_ENV !== 'dev')
  options.dialectOptions = {
      ssl: true
  };

module.exports = options;