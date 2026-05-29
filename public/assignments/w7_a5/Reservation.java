package org.example;

import java.util.ArrayList;
import java.util.List;


class Room {
    private String type;
    private double price;

    public Room(String type, double price) {
        this.type = type;
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public double getPrice() {
        return price;
    }
}

public class Reservation {
    private List<Room> rooms;
    private double totalCost;
    private boolean discountApplied;
    private boolean isPaid;

    public Reservation() {
        this.rooms = new ArrayList<>();
        this.totalCost = 0;
        this.discountApplied = false;
        this.isPaid = false;
    }

    // Add a room to the reservation
    public void addRoom(Room room) {
        rooms.add(room);
        totalCost += room.getPrice();
    }

    // Apply a discount based on certain conditions
    public void applyDiscount(boolean isVIP) {
        if (isVIP) {
            totalCost *= 0.85; // 15% VIP discount
            discountApplied = true;
        } else if (rooms.size() >= 3 && totalCost > 500) {
            totalCost *= 0.90; // 10% discount for 3+ rooms and total > $500
            discountApplied = true;
        } else if (rooms.size() == 2) {
            totalCost *= 0.95; // 5% discount for exactly 2 rooms
            discountApplied = true;
        }
    }

    // Check if breakfast is included based on room types
    public boolean isBreakfastIncluded() {
        for (int i = 0; i < rooms.size(); i++) {
            if (rooms.get(i).getType().equals("Suite")) {
                return true; // Breakfast included with Suite room
            }
        }
        return false;
    }

    // Process payment
    public boolean processPayment(double paymentAmount) {
        if (paymentAmount >= totalCost) {
            isPaid = true;
            return true;
        } else if (paymentAmount > 0 && paymentAmount < totalCost) {
            totalCost -= paymentAmount; // Partial payment reduces the total cost
            return false;
        } else {
            return false; // Invalid or zero payment
        }
    }

    // Check if the reservation can be canceled based on the payment and room types
    public boolean canCancelReservation() {
        if (isPaid) {
            return false; // Cannot cancel after payment
        }
        for (int i = 0; i < rooms.size(); i++) {
            if (rooms.get(i).getType().equals("Non-refundable")) {
                return false; // Cannot cancel if any room is non-refundable
            }
        }
        return true; // Otherwise, reservation can be canceled
    }

    // Get the total cost of the reservation
    public double getTotalCost() {
        return totalCost;
    }

}
