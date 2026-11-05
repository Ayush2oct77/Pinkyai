package com.pinky.ai.database

import androidx.room.Database
import androidx.room.RoomDatabase
import com.pinky.ai.database.dao.ConversationDao
import com.pinky.ai.database.entity.*

@Dao
interface AuditDao {
    @androidx.room.Insert
    suspend fun insertLog(log: AuditLogEntity): Long
}

@Database(
    entities = [
        ConversationEntity::class,
        MessageEntity::class,
        SocialCommentEntity::class,
        AppCommandEntity::class,
        AuditLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class PinkyDatabase : RoomDatabase() {
    abstract fun conversationDao(): ConversationDao
    abstract fun auditDao(): AuditDao
}
