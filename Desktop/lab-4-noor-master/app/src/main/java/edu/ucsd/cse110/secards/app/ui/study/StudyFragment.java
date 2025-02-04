package edu.ucsd.cse110.secards.app.ui.study;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.lifecycle.ViewModelProvider;
import edu.ucsd.cse110.secards.app.MainViewModel;
import edu.ucsd.cse110.secards.app.databinding.FragmentStudyBinding;


public class StudyFragment extends Fragment {
    private MainViewModel activityModel;
    private FragmentStudyBinding view;

    public StudyFragment() {
        // Required empty public constructor
    }

    public static StudyFragment newInstance() {
        StudyFragment fragment = new StudyFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        var modelOwner = requireActivity();
        var modelFactory = ViewModelProvider.Factory.from(MainViewModel.initializer);
        var modelProvider = new ViewModelProvider(modelOwner, modelFactory);
        this.activityModel = modelProvider.get(MainViewModel.class);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = FragmentStudyBinding.inflate(inflater, container, false);

        setupMvp();
        return view.getRoot();
    }
    private void setupMvp() {
        activityModel.getDisplayedText().observe(text -> view.cardText.setText(text));

        view.card.setOnClickListener(v -> activityModel.flipTopCard());
        view.nextButton.setOnClickListener(v -> activityModel.stepForward());
        view.prevButton.setOnClickListener(v -> activityModel.stepBackward());
        view.shuffleButton.setOnClickListener(v -> activityModel.shuffle());
    }
}