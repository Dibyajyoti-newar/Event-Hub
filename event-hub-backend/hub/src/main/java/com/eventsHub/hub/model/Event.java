package com.eventsHub.hub.model;

import com.google.cloud.firestore.annotation.DocumentId;
import lombok.Data;
import java.util.Date; // 👈 Import the Date class
import java.util.List; // 👈 Import the List class

@Data
public class Event {
    @DocumentId
    private String id;
    private String title;
    private String college;
    private String category;
    private String description;
    private int likes;
    private Date date;

    private List<String> likedBy;
}