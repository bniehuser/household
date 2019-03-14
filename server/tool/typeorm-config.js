const {DefaultNamingStrategy} = require('typeorm');
const {snakeCase} = require('typeorm/util/StringUtils');

// use dem snake names
class SnakeNamingStrategy extends DefaultNamingStrategy {
    tableName(className, customName) {
        return customName ? customName : snakeCase(className)
    }

    columnName(propertyName, customName, embeddedPrefixes) {
        return snakeCase(embeddedPrefixes.join('_')) + (customName ? customName : snakeCase(propertyName))
    }

    relationName(propertyName) {
        return snakeCase(propertyName)
    }

    joinColumnName(relationName, referencedColumnName) {
        return snakeCase(relationName + "_" + referencedColumnName)
    }

    joinTableName(firstTableName, secondTableName, firstPropertyName, secondPropertyName) {
        return snakeCase(firstTableName + "_" + firstPropertyName.replace(/\./gi, "_") + "_" + secondTableName)
    }

    joinTableColumnName(tableName, propertyName, columnName = null) {
        return snakeCase(tableName + "_" + (columnName ? columnName : propertyName))
    }

    classTableInheritanceParentColumnName(parentTableName, parentTableIdPropertyName) {
        return snakeCase(parentTableName + "_" + parentTableIdPropertyName)
    }
}

module.exports = { SnakeNamingStrategy };