require('dotenv').config();
const { DefaultNamingStrategy } = require('typeorm');
const { snakeCase } = require('typeorm/util/StringUtils');

// use dem snake names
class SnakeNamingStrategy extends DefaultNamingStrategy {
    tableName(className, customName) { return customName ? customName : snakeCase(className) }
    columnName(propertyName, customName, embeddedPrefixes) { return snakeCase(embeddedPrefixes.join('_')) + (customName ? customName : snakeCase(propertyName)) }
    relationName(propertyName) { return snakeCase(propertyName) }
    joinColumnName(relationName, referencedColumnName) { return snakeCase(relationName + "_" + referencedColumnName) }
    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) { return snakeCase(firstTableName + "_" + firstPropertyName.replace(/\./gi, "_") + "_" + secondTableName) }
    joinTableColumnName(tableName, propertyName, columnName = null) { return snakeCase(tableName + "_" + (columnName ? columnName : propertyName)) }
    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) { return snakeCase(parentTableName + "_" + parentTableIdPropertyName) }
}

// get env vars
const {
    DB_TYPE,
    DB_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

// export opts
module.exports = {
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    "src/models/**/*.ts"
  ],
  migrations: [
    "migrations/**/*.ts"
  ],
  cli: {
    migrationsDir: "migrations"
  }
};

