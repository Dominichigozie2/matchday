export type Venue = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  categories: string[];
  type: string;
  rating: number;
  pricePerHour: number; // ₦, 0 = free
  amenities: string[];
};

export const venues: Venue[] = [
  { id: "v1", name: "Teslim Balogun Annex", area: "Surulere", lat: 6.4992, lng: 3.3602, categories: ["football", "relay-race"], type: "Turf pitch", rating: 4.6, pricePerHour: 25000, amenities: ["Floodlights", "Changing rooms", "Parking"] },
  { id: "v2", name: "Campos Mini Stadium", area: "Lagos Island", lat: 6.4561, lng: 3.3901, categories: ["football"], type: "Turf pitch", rating: 4.4, pricePerHour: 18000, amenities: ["Floodlights", "Seating"] },
  { id: "v3", name: "Mobolaji Johnson Arena", area: "Onikan", lat: 6.4435, lng: 3.4031, categories: ["football", "relay-race"], type: "Stadium", rating: 4.8, pricePerHour: 60000, amenities: ["Track", "Floodlights", "Medical", "Parking"] },
  { id: "v4", name: "Admiralty Courts", area: "Lekki Phase 1", lat: 6.4466, lng: 3.4735, categories: ["basketball", "volleyball"], type: "Outdoor court", rating: 4.5, pricePerHour: 10000, amenities: ["Floodlights", "Water"] },
  { id: "v5", name: "Ikoyi Club Courts", area: "Ikoyi", lat: 6.4492, lng: 3.4361, categories: ["lawn-tennis", "badminton", "table-tennis"], type: "Club courts", rating: 4.9, pricePerHour: 15000, amenities: ["Clubhouse", "Showers", "Coaching"] },
  { id: "v6", name: "Yaba Tech Sports Centre", area: "Yaba", lat: 6.5183, lng: 3.3727, categories: ["football", "basketball", "table-tennis", "volleyball"], type: "Sports centre", rating: 4.3, pricePerHour: 8000, amenities: ["Changing rooms", "Snacks"] },
  { id: "v7", name: "National Stadium Courts", area: "Surulere", lat: 6.4969, lng: 3.3651, categories: ["basketball", "volleyball", "relay-race", "badminton"], type: "Outdoor court", rating: 4.2, pricePerHour: 6000, amenities: ["Track", "Parking"] },
  { id: "v8", name: "Elegushi Beach Courts", area: "Lekki", lat: 6.4289, lng: 3.4958, categories: ["volleyball"], type: "Beach court", rating: 4.7, pricePerHour: 12000, amenities: ["Beach bar", "Showers"] },
  { id: "v9", name: "Freedom Park", area: "Lagos Island", lat: 6.4509, lng: 3.3962, categories: ["chess", "ludo", "table-tennis"], type: "Park", rating: 4.6, pricePerHour: 0, amenities: ["Shade", "Food court", "Wi-Fi"] },
  { id: "v10", name: "Ikeja City Park Hub", area: "Ikeja", lat: 6.6012, lng: 3.3509, categories: ["ludo", "chess", "table-tennis"], type: "Park", rating: 4.4, pricePerHour: 0, amenities: ["Shade", "Café"] },
  { id: "v11", name: "Agege Township Stadium", area: "Agege", lat: 6.6248, lng: 3.3152, categories: ["football", "relay-race"], type: "Stadium", rating: 4.1, pricePerHour: 30000, amenities: ["Track", "Seating"] },
  { id: "v12", name: "UNILAG Sports Centre", area: "Akoka", lat: 6.5157, lng: 3.3975, categories: ["football", "basketball", "relay-race", "lawn-tennis", "volleyball", "badminton"], type: "Sports centre", rating: 4.5, pricePerHour: 9000, amenities: ["Track", "Courts", "Parking"] },
  { id: "v13", name: "The Board Room Lounge", area: "Gbagada", lat: 6.5532, lng: 3.3878, categories: ["ludo", "chess"], type: "Lounge", rating: 4.5, pricePerHour: 3000, amenities: ["AC", "Drinks"] },
];
