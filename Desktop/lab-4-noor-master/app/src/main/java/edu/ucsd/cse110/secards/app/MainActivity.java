package edu.ucsd.cse110.secards.app;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import edu.ucsd.cse110.secards.app.databinding.ActivityMainBinding;
import edu.ucsd.cse110.secards.lib.data.InMemoryDataSource;
import edu.ucsd.cse110.secards.lib.domain.FlashcardRepository;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding view;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle(R.string.app_title);

        this.view = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(view.getRoot());
    }
}
