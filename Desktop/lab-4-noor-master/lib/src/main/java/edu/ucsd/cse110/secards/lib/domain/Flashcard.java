package edu.ucsd.cse110.secards.lib.domain;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Objects;

public class Flashcard {
    private final @Nullable Integer id;
    private final @NonNull String front;
    private final @NonNull String back;

    public Flashcard(@Nullable Integer id, @NonNull String front, @NonNull String back) {
        this.id = id;
        this.front = front;
        this.back = back;
    }

    public @Nullable Integer id() {
        return id;
    }

    public @NonNull String front() {
        return front;
    }

    public @NonNull String back() {
        return back;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Flashcard flashcard = (Flashcard) o;
        return Objects.equals(id, flashcard.id) && Objects.equals(front, flashcard.front) && Objects.equals(back, flashcard.back);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, front, back);
    }
}
