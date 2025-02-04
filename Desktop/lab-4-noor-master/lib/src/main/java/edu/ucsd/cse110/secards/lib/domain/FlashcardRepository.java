package edu.ucsd.cse110.secards.lib.domain;

import java.util.List;

import edu.ucsd.cse110.secards.lib.data.InMemoryDataSource;
import edu.ucsd.cse110.secards.lib.util.Subject;

public class FlashcardRepository {
    private final InMemoryDataSource dataSource;

    public FlashcardRepository(InMemoryDataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Integer count() {
        return dataSource.getFlashcards().size();
    }

    public Subject<Flashcard> find(int id) {
        return dataSource.getFlashcardSubject(id);
    }

    public Subject<List<Flashcard>> findAll() {
        return dataSource.getAllFlashcardsSubject();
    }

    public void save(Flashcard flashcard) {
        dataSource.putFlashcard(flashcard);
    }
}
