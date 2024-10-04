package com.dermavisionai

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.bumptech.glide.Glide

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val imageView = ImageView(this)
        setContentView(imageView)

        // Load the GIF using Glide
        Glide.with(this)
            .asGif()
            .load(R.drawable.splash_screen)  // Name of the GIF in the drawable folder
            .into(imageView)

        // Duration of splash screen (in milliseconds)
        Handler().postDelayed({
            // Start the MainActivity after the splash screen
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()  // Close SplashActivity
        }, 3000)  // 3 seconds for splash screen
    }
}
