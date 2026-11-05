package com.pinky.ai

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import androidx.room.Room
import com.pinky.ai.database.PinkyDatabase

class PinkyApplication : Application() {

    lateinit var database: PinkyDatabase
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        // Initialize local encrypted Room database
        database = Room.databaseBuilder(
            applicationContext,
            PinkyDatabase::class.java,
            "pinky_ai_local.db"
        ).fallbackToDestructiveMigration().build()

        createNotificationChannels()

        // Schedule daily background Room database maintenance routine
        com.pinky.ai.database.DatabaseCleanupWorker.schedule(this)
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            // Screen Sharing Channel
            val screenChannel = NotificationChannel(
                CHANNEL_SCREEN_SHARE,
                "Screen Sharing Active",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Shows an active persistent notification when screen sharing is enabled."
            }

            // Voice Assistant Channel
            val voiceChannel = NotificationChannel(
                CHANNEL_VOICE,
                "Pinky Voice Assistant",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Ongoing notification for wake-word and voice processing."
            }

            // Location Sharing Channel
            val locationChannel = NotificationChannel(
                CHANNEL_LOCATION_SHARE,
                "Live Location Sharing",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Notifies user whenever live location is actively being shared."
            }

            // Automation & Alerts Channel
            val alertChannel = NotificationChannel(
                CHANNEL_AUTOMATION,
                "Pinky Automations & Alerts",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Alerts for smart automation triggers and social comment moderation."
            }

            notificationManager.createNotificationChannels(
                listOf(screenChannel, voiceChannel, locationChannel, alertChannel)
            )
        }
    }

    companion object {
        lateinit var instance: PinkyApplication
            private set

        const val CHANNEL_SCREEN_SHARE = "pinky_channel_screen_share"
        const val CHANNEL_VOICE = "pinky_channel_voice"
        const val CHANNEL_LOCATION_SHARE = "pinky_channel_location_share"
        const val CHANNEL_AUTOMATION = "pinky_channel_automation"
    }
}
