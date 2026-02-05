import { getDatabase, isPostgresDB } from '../database.js'

/**
 * Universal query helper that works with both SQLite and PostgreSQL
 */
export class QueryHelper {
  static async all(sql, params = []) {
    const db = getDatabase()
    
    if (isPostgresDB()) {
      // Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
      const pgSql = this.convertSqlToPostgres(sql)
      const client = await db.connect()
      try {
        const result = await client.query(pgSql, params)
        return result.rows
      } catch (error) {
        console.error('❌ QueryHelper.all error:', error.message)
        console.error('SQL:', pgSql)
        console.error('Params:', params)
        throw error
      } finally {
        client.release()
      }
    } else {
      return await db.all(sql, params)
    }
  }

  static async get(sql, params = []) {
    const db = getDatabase()
    
    if (isPostgresDB()) {
      const pgSql = this.convertSqlToPostgres(sql)
      const client = await db.connect()
      try {
        const result = await client.query(pgSql, params)
        return result.rows[0]
      } catch (error) {
        console.error('❌ QueryHelper.get error:', error.message)
        console.error('SQL:', pgSql)
        console.error('Params:', params)
        throw error
      } finally {
        client.release()
      }
    } else {
      return await db.get(sql, params)
    }
  }

  static async run(sql, params = []) {
    const db = getDatabase()
    
    if (isPostgresDB()) {
      let pgSql = this.convertSqlToPostgres(sql)
      
      // Add RETURNING id for INSERT statements to get the new ID
      if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
        pgSql += ' RETURNING id'
      }
      
      const client = await db.connect()
      try {
        const result = await client.query(pgSql, params)
        
        // Return format compatible with SQLite
        return {
          lastID: result.rows && result.rows.length > 0 ? result.rows[0].id : null,
          changes: result.rowCount
        }
      } catch (error) {
        console.error('❌ QueryHelper.run error:', error.message)
        console.error('SQL:', pgSql)
        console.error('Params:', params)
        throw error
      } finally {
        client.release()
      }
    } else {
      return await db.run(sql, params)
    }
  }

  /**
   * Convert SQLite ? placeholders to PostgreSQL $1, $2, etc.
   */
  static convertSqlToPostgres(sql) {
    let paramIndex = 1
    return sql.replace(/\?/g, () => `$${paramIndex++}`)
  }
}

export default QueryHelper
