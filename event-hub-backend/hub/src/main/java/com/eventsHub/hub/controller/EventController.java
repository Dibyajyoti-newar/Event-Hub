package com.eventsHub.hub.controller;

import com.eventsHub.hub.model.Event;
import com.eventsHub.hub.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*") // This is the only CORS configuration needed.
@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/events")
    public List<Event> getAllEvents() throws ExecutionException, InterruptedException {
        return eventService.getAllEvents();
    }

    @GetMapping("/events/{eventId}")
    public Event getEventById(@PathVariable String eventId) throws ExecutionException, InterruptedException {
        return eventService.getEventById(eventId);
    }
}