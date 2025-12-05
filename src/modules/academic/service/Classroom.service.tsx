import type { Classroom } from "../../institution/models/Institution.interface";

const API_URL = "https://jubilant-engine-g444pxjvrx6c9pj4-9080.app.github.dev/api/v1/classrooms";

export const classroomService = {
  // Get classrooms by institution ID
  async getByInstitution(institutionId: string): Promise<Classroom[]> {
    try {
      const response = await fetch(`${API_URL}/institution/${institutionId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener aulas de la institución: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Assuming the API returns an array of classrooms directly
      // Adjust this based on the actual API response structure
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      throw error;
    }
  },

  // Get classroom by ID
  async getById(classroomId: string): Promise<Classroom> {
    try {
      const response = await fetch(`${API_URL}/${classroomId}`);
      if (!response.ok) {
        throw new Error(`Error al obtener el aula: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data; // Adjust based on actual API response structure
    } catch (error) {
      console.error("Error fetching classroom:", error);
      throw error;
    }
  },
};