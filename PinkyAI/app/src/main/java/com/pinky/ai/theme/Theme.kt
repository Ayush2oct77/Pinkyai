package com.pinky.ai.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = PinkyNeonPrimary,
    onPrimary = PinkyDarkBackground,
    primaryContainer = PurpleDeep,
    onPrimaryContainer = PinkyTextPrimary,
    secondary = PurpleCosmic,
    onSecondary = PinkyDarkBackground,
    background = PinkyDarkBackground,
    onBackground = PinkyTextPrimary,
    surface = PinkyDarkSurface,
    onSurface = PinkyTextPrimary,
    surfaceVariant = GlassPinkAlpha,
    onSurfaceVariant = PinkyTextSecondary,
    outline = PinkyDarkSurfaceBorder
)

private val LightColorScheme = lightColorScheme(
    primary = PinkyNeonPrimary,
    onPrimary = PinkyTextPrimary,
    secondary = PurpleCosmic,
    background = Color(0xFFFAF5FF),
    onBackground = Color(0xFF1E112A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1E112A),
    outline = Color(0x33EC4899)
)

@Composable
fun PinkyAITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Keep signature Pinky AI styling by default
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
