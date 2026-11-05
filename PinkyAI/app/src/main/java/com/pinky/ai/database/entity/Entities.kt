package com.pinky.ai.database.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "conversations")
data class ConversationEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "created_at") val createdAt: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "last_updated_at") val lastUpdatedAt: Long = System.currentTimeMillis(),
    @ColumnInfo(name = "is_temporary") val isTemporary: Boolean = false,
    @ColumnInfo(name = "expires_at") val expiresAt: Long? = null,
    @ColumnInfo(name = "cache_size_bytes") val cacheSizeBytes: Long = 0
)

@Entity(tableName = "messages")
data class MessageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "conversation_id") val conversationId: Long,
    @ColumnInfo(name = "sender_role") val senderRole: String, // 'user', 'assistant', 'system'
    @ColumnInfo(name = "content") val content: String,
    @ColumnInfo(name = "is_synced") val isSynced: Boolean = false,
    @ColumnInfo(name = "timestamp") val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "social_interactions")
data class SocialCommentEntity(
    @PrimaryKey val commentId: String,
    @ColumnInfo(name = "platform") val platform: String, // 'instagram' or 'reddit'
    @ColumnInfo(name = "post_id") val postId: String,
    @ColumnInfo(name = "author") val author: String,
    @ColumnInfo(name = "content") val content: String,
    @ColumnInfo(name = "sentiment") val sentiment: String,
    @ColumnInfo(name = "category") val category: String,
    @ColumnInfo(name = "suggested_reply") val suggestedReply: String,
    @ColumnInfo(name = "status") val status: String,
    @ColumnInfo(name = "timestamp") val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "app_commands")
data class AppCommandEntity(
    @PrimaryKey val packageName: String,
    @ColumnInfo(name = "app_name") val appName: String,
    @ColumnInfo(name = "trigger_phrase") val triggerPhrase: String,
    @ColumnInfo(name = "hindi_trigger_phrase") val hindiTriggerPhrase: String,
    @ColumnInfo(name = "is_custom") val isCustom: Boolean = false
)

@Entity(tableName = "audit_logs")
data class AuditLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "action") val action: String,
    @ColumnInfo(name = "details") val details: String,
    @ColumnInfo(name = "category") val category: String,
    @ColumnInfo(name = "status") val status: String,
    @ColumnInfo(name = "timestamp") val timestamp: Long = System.currentTimeMillis()
)
