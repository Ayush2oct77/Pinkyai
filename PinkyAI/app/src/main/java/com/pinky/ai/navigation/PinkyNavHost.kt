package com.pinky.ai.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.pinky.ai.screens.home.HomeScreen
import com.pinky.ai.screens.chat.AIChatScreen
import com.pinky.ai.screens.voice.VoiceAssistantScreen

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Chat : Screen("chat")
    object Voice : Screen("voice")
    object Messages : Screen("messages")
    object Instagram : Screen("instagram")
    object Reddit : Screen("reddit")
    object Contacts : Screen("contacts")
    object Location : Screen("location")
    object ScreenShare : Screen("screen_share")
    object Assignment : Screen("assignment")
    object PhotoEditor : Screen("photo_editor")
    object PhoneInfo : Screen("phone_info")
    object Automation : Screen("automation")
    object Privacy : Screen("privacy")
}

@Composable
fun PinkyNavHost() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = Screen.Home.route) {
        composable(Screen.Home.route) { HomeScreen(navController) }
        composable(Screen.Chat.route) { AIChatScreen(navController) }
        composable(Screen.Voice.route) { VoiceAssistantScreen(navController) }
    }
}
