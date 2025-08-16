package com.eventsHub.hub.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.eventsHub.hub.model.Event;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class EventService {

    public List<Event> getAllEvents() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        List<Event> eventsList = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection("events").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        for (QueryDocumentSnapshot document : documents) {
            // The @DocumentId annotation now handles setting the ID automatically
            eventsList.add(document.toObject(Event.class));
        }
        return eventsList;
    }

    public Event getEventById(String eventId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("events").document(eventId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        if (document.exists()) {
            // The @DocumentId annotation handles this one as well
            return document.toObject(Event.class);
        }
        return null;
    }
}