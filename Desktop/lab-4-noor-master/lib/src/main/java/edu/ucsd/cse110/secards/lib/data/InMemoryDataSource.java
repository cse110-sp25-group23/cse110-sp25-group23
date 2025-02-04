package edu.ucsd.cse110.secards.lib.data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import edu.ucsd.cse110.secards.lib.domain.Flashcard;
import edu.ucsd.cse110.secards.lib.util.Subject;

/**
 * Class used as a sort of "database" of decks and flashcards that exist. This
 * will be replaced with a real database in the future, but can also be used
 * for testing.
 */
public class InMemoryDataSource {
    private final Map<Integer, Flashcard> flashcards
        = new HashMap<>();
    private final Map<Integer, Subject<Flashcard>> flashcardSubjects
        = new HashMap<>();
    private final Subject<List<Flashcard>> allFlashcardsSubject
        = new Subject<>();

    public InMemoryDataSource() {
    }

    public List<Flashcard> getFlashcards() {
        return List.copyOf(flashcards.values());
    }

    public Flashcard getFlashcard(int id) {
        return flashcards.get(id);
    }

    public Subject<Flashcard> getFlashcardSubject(int id) {
        if (!flashcardSubjects.containsKey(id)) {
            var subject = new Subject<Flashcard>();
            subject.setValue(getFlashcard(id));
            flashcardSubjects.put(id, subject);
        }
        return flashcardSubjects.get(id);
    }

    public Subject<List<Flashcard>> getAllFlashcardsSubject() {
        return allFlashcardsSubject;
    }

    public void putFlashcard(Flashcard flashcard) {
        flashcards.put(flashcard.id(), flashcard);
        if (flashcardSubjects.containsKey(flashcard.id())) {
            flashcardSubjects.get(flashcard.id()).setValue(flashcard);
        }
        allFlashcardsSubject.setValue(getFlashcards());
    }

    public final static List<Flashcard> DEFAULT_CARDS = List.of(
        new Flashcard(0, "SRP", "Single Responsibility Principle"),
        new Flashcard(1, "OCP", "Open-Closed Principle"),
        new Flashcard(2, "LSP", "Liskov Substitution Principle"),
        new Flashcard(3, "ISP", "Interface Segregation Principle"),
        new Flashcard(4, "DIP", "Dependency Inversion Principle"),
        new Flashcard(5, "LKP", "Least Knowledge Principle (Law of Demeter)")
    );

    public static InMemoryDataSource fromDefault() {
        var data = new InMemoryDataSource();
        for (Flashcard flashcard : DEFAULT_CARDS) {
            data.putFlashcard(flashcard);
        }
        return data;
    }
}
