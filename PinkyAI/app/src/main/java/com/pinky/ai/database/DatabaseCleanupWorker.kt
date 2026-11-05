package com.pinky.ai.database

import android.content.Context
import android.util.Log
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.pinky.ai.PinkyApplication
import com.pinky.ai.database.entity.AuditLogEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

/**
 * Background Maintenance Routine:
 * Clears expired temporary AI conversation cache from the Room database to optimize local storage usage.
 * Scheduled via Android WorkManager to run during device idle and charging windows.
 */
class DatabaseCleanupWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val db = PinkyApplication.instance.database
        val conversationDao = db.conversationDao()
        val auditDao = db.auditDao()

        val currentTime = System.currentTimeMillis()
        Log.i(TAG, "Starting Room Database Temporary Conversation Cache Maintenance Routine at $currentTime")

        try {
            // 1. Calculate pre-cleanup temporary cache size
            val initialCacheBytes = conversationDao.getTotalTemporaryCacheBytes() ?: 0L

            // 2. Delete expired temporary conversation sessions
            val deletedCount = conversationDao.deleteExpiredTemporaryConversations(currentTime)

            // 3. Purge orphan message rows from deleted conversations
            val purgedMessages = conversationDao.purgeOrphanMessages()

            // 4. Calculate post-cleanup temporary cache size
            val remainingCacheBytes = conversationDao.getTotalTemporaryCacheBytes() ?: 0L
            val reclaimedBytes = (initialCacheBytes - remainingCacheBytes).coerceAtLeast(0L)

            // 5. Check SQLite database vacuum necessity and log audit record
            auditDao.insertLog(
                AuditLogEntity(
                    action = "ROOM_CACHE_MAINTENANCE",
                    details = "Purged $deletedCount expired temporary conversation caches and $purgedMessages messages. Reclaimed ${reclaimedBytes / (1024 * 1024)} MB.",
                    category = "storage",
                    status = "success",
                    timestamp = currentTime
                )
            )

            Log.i(TAG, "Cache Maintenance Complete: Purged $deletedCount sessions, reclaimed $reclaimedBytes bytes.")
            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Error executing Room cache maintenance routine", e)
            Result.retry()
        }
    }

    companion object {
        const val TAG = "DatabaseCleanupWorker"
        const val WORK_NAME = "pinky_room_cache_maintenance"

        /**
         * Schedules the daily maintenance routine with battery and idle constraints.
         */
        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiresBatteryNotLow(true)
                .setRequiresDeviceIdle(true)
                .build()

            val cleanupRequest = PeriodicWorkRequestBuilder<DatabaseCleanupWorker>(
                24, TimeUnit.HOURS,
                1, TimeUnit.HOURS // 1-hour flex interval
            )
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                cleanupRequest
            )
        }
    }
}
