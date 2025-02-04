package edu.ucsd.cse110.secards.app;

import static androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.viewmodel.ViewModelInitializer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import edu.ucsd.cse110.secards.lib.domain.Flashcard;
import edu.ucsd.cse110.secards.lib.domain.FlashcardRepository;
import edu.ucsd.cse110.secards.lib.util.Subject;

public class MainViewModel extends ViewModel {
    // Domain state (true "Model" state)
    private final FlashcardRepository flashcardRepository;

    // UI state
    private final Subject<List<Integer>> cardOrdering;
    private final Subject<Flashcard> topCard;
    private final Subject<Boolean> isShowingFront;
    private final Subject<String> displayedText;

    public static final ViewModelInitializer<MainViewModel> initializer =
            new ViewModelInitializer<>(
                    MainViewModel.class,
                    creationExtras -> {
                        var app = (SECardsApplication) creationExtras.get(APPLICATION_KEY);
                        assert app != null;
                        return new MainViewModel(app.getFlashcardRepository());
                    });

    public MainViewModel(FlashcardRepository flashcardRepository) {
        this.flashcardRepository = flashcardRepository;

        // Create the observable subjects.
        this.cardOrdering = new Subject<>();
        this.topCard = new Subject<>();
        this.isShowingFront = new Subject<>();
        this.displayedText = new Subject<>();

        // Initialize...
        isShowingFront.setValue(true);

        // When the list of cards changes (or is first loaded), reset the ordering.
        flashcardRepository.findAll().observe(cards -> {
            if (cards == null) return; // not ready yet, ignore

            var ordering = new ArrayList<Integer>();
            for (int i = 0; i < cards.size(); i++) {
                ordering.add(i);
            }
            cardOrdering.setValue(ordering);
        });

        // When the ordering changes, update the top card.
        cardOrdering.observe(ordering -> {
            if (ordering == null) return;

            var card = flashcardRepository.find(ordering.get(0)).getValue();
            if (card == null) return;
            this.topCard.setValue(card);
        });

        // When the top card changes, update the displayed text and display the front side.
        topCard.observe(card -> {
            if (card == null) return;

            displayedText.setValue(card.front());
            isShowingFront.setValue(true);
        });

        // When isShowingFront changes, update the displayed text.
        isShowingFront.observe(isShowingFront -> {
            if (isShowingFront == null) return;

            var card = topCard.getValue();
            if (card == null) return;

            var text = isShowingFront ? card.front() : card.back();
            displayedText.setValue(text);
        });
    }

    public Subject<String> getDisplayedText() {
        return displayedText;
    }

    public void flipTopCard() {
        var isShowingFront = this.isShowingFront.getValue();
        if (isShowingFront == null) return;
        this.isShowingFront.setValue(!isShowingFront);
    }

    public void stepForward() {
        var ordering = this.cardOrdering.getValue();
        if (ordering == null) return;

        var newOrdering = new ArrayList<>(ordering);
        Collections.rotate(newOrdering, -1);
        this.cardOrdering.setValue(newOrdering);
    }

    public void stepBackward() {
        var ordering = this.cardOrdering.getValue();
        if (ordering == null) return;

        var newOrdering = new ArrayList<>(ordering);
        Collections.rotate(newOrdering, 1);
        this.cardOrdering.setValue(newOrdering);
    }

    public void shuffle() {
        var ordering = this.cardOrdering.getValue();
        if (ordering == null) return;

        var newOrdering = new ArrayList<>(ordering);
        Collections.shuffle(newOrdering);
        this.cardOrdering.setValue(newOrdering);
    }
}
