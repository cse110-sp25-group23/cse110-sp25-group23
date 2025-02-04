package edu.ucsd.cse110.secards.app;
import android.app.Application;

import edu.ucsd.cse110.secards.lib.data.InMemoryDataSource;
import edu.ucsd.cse110.secards.lib.domain.FlashcardRepository;
public class SECardsApplication extends Application {
    private InMemoryDataSource dataSource;
    private FlashcardRepository flashcardRepository;

    @Override
    public void onCreate() {
        super.onCreate();

        this.dataSource = InMemoryDataSource.fromDefault();
        this.flashcardRepository = new FlashcardRepository(dataSource);
    }

    public FlashcardRepository getFlashcardRepository() {
        return flashcardRepository;
    }
}
