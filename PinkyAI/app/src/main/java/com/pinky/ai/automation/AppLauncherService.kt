package com.pinky.ai.automation

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Log

data class AppCommandMapping(
    val triggerPhrase: String,
    val hindiTriggerPhrase: String,
    val appName: String,
    val packageName: String,
    val isCustom: Boolean = false
)

/**
 * Service to execute and customize "Open the App" voice commands.
 * Handles Android Intent resolution, package manager queries, and Play Store fallback.
 */
class AppLauncherService(private val context: Context) {

    // Default registered app mappings that users can edit or extend
    private val appMappings = mutableListOf(
        AppCommandMapping("open instagram", "इंस्टाग्राम खोलो", "Instagram", "com.instagram.android"),
        AppCommandMapping("open reddit", "रेडिट खोलो", "Reddit", "com.reddit.frontpage"),
        AppCommandMapping("open whatsapp", "व्हाट्सएप खोलो", "WhatsApp", "com.whatsapp"),
        AppCommandMapping("open youtube", "यूट्यूब खोलो", "YouTube", "com.google.android.youtube"),
        AppCommandMapping("open camera", "कैमरा खोलो", "Camera", "com.android.camera"),
        AppCommandMapping("open settings", "सेटिंग्स खोलो", "Settings", "com.android.settings"),
        AppCommandMapping("open chrome", "क्रोम खोलो", "Chrome", "com.android.chrome"),
        AppCommandMapping("open maps", "नक्शा खोलो", "Google Maps", "com.google.android.apps.maps")
    )

    fun getAllMappings(): List<AppCommandMapping> = appMappings.toList()

    /**
     * Add or edit an "Open App" command
     */
    fun saveMapping(mapping: AppCommandMapping) {
        val existingIndex = appMappings.indexOfFirst { 
            it.appName.equals(mapping.appName, ignoreCase = true) || 
            it.packageName.equals(mapping.packageName, ignoreCase = true)
        }
        if (existingIndex >= 0) {
            appMappings[existingIndex] = mapping
        } else {
            appMappings.add(mapping.copy(isCustom = true))
        }
    }

    /**
     * Delete a custom app mapping
     */
    fun removeMapping(packageName: String): Boolean {
        return appMappings.removeAll { it.packageName == packageName && it.isCustom }
    }

    /**
     * Resolve incoming voice command (English or Hindi) to launch the appropriate app
     */
    fun resolveAndLaunch(spokenText: String): AppLaunchResult {
        val normalized = spokenText.lowercase().trim()

        val matched = appMappings.find { mapping ->
            normalized.contains(mapping.triggerPhrase.lowercase()) ||
            normalized.contains(mapping.hindiTriggerPhrase) ||
            normalized.contains("open ${mapping.appName.lowercase()}") ||
            normalized.contains("${mapping.appName.lowercase()} खोलो")
        }

        if (matched == null) {
            return AppLaunchResult.NotFound("No registered app matches command: '$spokenText'")
        }

        return launchPackage(matched.packageName, matched.appName)
    }

    /**
     * Launches the installed package or opens Google Play Store if not installed
     */
    fun launchPackage(packageName: String, appName: String): AppLaunchResult {
        val packageManager: PackageManager = context.packageManager
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)

        return if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(launchIntent)
            Log.i("AppLauncherService", "Successfully launched $appName ($packageName)")
            AppLaunchResult.Success(appName, packageName)
        } else {
            // Not installed: launch Google Play Store intent
            try {
                val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$packageName")).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(marketIntent)
                AppLaunchResult.RedirectedToStore(appName, packageName)
            } catch (e: Exception) {
                val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=$packageName")).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(webIntent)
                AppLaunchResult.RedirectedToStore(appName, packageName)
            }
        }
    }
}

sealed class AppLaunchResult {
    data class Success(val appName: String, val packageName: String) : AppLaunchResult()
    data class RedirectedToStore(val appName: String, val packageName: String) : AppLaunchResult()
    data class NotFound(val reason: String) : AppLaunchResult()
}
