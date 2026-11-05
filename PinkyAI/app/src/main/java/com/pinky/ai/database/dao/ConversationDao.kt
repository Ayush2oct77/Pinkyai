package com.pinky.ai.database.dao

import androidx.room.*
import com.pinky.ai.database.entity.ConversationEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ConversationDao {

    @Query("SELECT * FROM conversations ORDER BY last_updated_at DESC")
    fun getAllConversations(): Flow<List<ConversationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertConversation(conversation: ConversationEntity): Long

    @Query("DELETE FROM conversations WHERE is_temporary = 1 AND (expires_at IS NOT NULL AND expires_at < :currentTime)")
    suspend fun deleteExpiredTemporaryConversations(currentTime: Long): Int

    @Query("DELETE FROM messages WHERE conversation_id NOT IN (SELECT id FROM conversations)")
    suspend fun purgeOrphanMessages(): Int

    @Query("SELECT SUM(cache_size_bytes) FROM conversations WHERE is_temporary = 1")
    suspend fun getTotalTemporaryCacheBytes(): Long?

    @Query("DELETE FROM conversations")
    suspend fun clearAllConversations()
}
