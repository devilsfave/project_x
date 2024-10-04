// src/types.ts

export interface PredictionResult {
    predictedClass: string;
    probabilities: {
      [className: string]: string; 
    };
  }
  
  // Doctor interface
  export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    // Add other relevant doctor details here, like location, rating, etc.
  }
  
  // Appointment interface
  export interface Appointment {
    id: string;
    date: string; // ISO date string (YYYY-MM-DD)
    time: string; // 24-hour time string (HH:mm)
    location: string; // Name of the facility
    userId: string;
    // You can add more fields as needed (e.g., doctorId, status, etc.)
  }