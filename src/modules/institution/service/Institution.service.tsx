import type {
  Address,
  Classroom,
  ClassroomCreate,
  ContactMethod,
  Institution,
  InstitutionCompleteResponse,
  InstitutionCreateWithUsersRequest,
  InstitutionInformation,
  InstitutionStatus,
  InstitutionUpdateRequest,
  InstitutionWithUsersAndClassroomsResponse,
  Schedule,
  UserCreateRequest,
  UserResponse,
  ApiResponse,
} from '../models/Institution.interface';

// Configuración de la API
const API_BASE_URL = 'https://jubilant-engine-g444pxjvrx6c9pj4-9080.app.github.dev/api/v1/institutions';
const API_CLASSROOM_URL = 'https://jubilant-engine-g444pxjvrx6c9pj4-9080.app.github.dev/api/v1/classrooms';

// Servicio para manejar las peticiones HTTP
class InstitutionService {
  // Método privado para hacer peticiones con mejor manejo de errores
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      console.log(`🚀 Haciendo petición a: ${url}`);
      console.log('📋 Opciones:', options);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      console.log(`📡 Respuesta del servidor: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      // Se espera que todas las respuestas exitosas sigan el formato ApiResponse
      const apiResponse: ApiResponse<T> = await response.json();
      console.log('✅ Datos recibidos:', apiResponse);

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || 'La operación en la API falló.');
      }
    } catch (error) {
      console.error('💥 Error en la petición:', error);
      
      // Verificar si es un error de red/CORS
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Error de conexión: Verifica que el backend esté ejecutándose en http://localhost:9080 y que CORS esté configurado correctamente.');
      }
      
      throw error;
    }
  }

  // Listar todas las instituciones con información completa
  async getAllInstitutions(): Promise<InstitutionCompleteResponse[]> {
    return this.makeRequest<InstitutionCompleteResponse[]>(`${API_BASE_URL}`);
  }

  // Listar instituciones activas
  async getActiveInstitutions(): Promise<InstitutionCompleteResponse[]> {
    return this.makeRequest<InstitutionCompleteResponse[]>(`${API_BASE_URL}/active`);
  }

  // Listar instituciones inactivas
  async getInactiveInstitutions(): Promise<InstitutionCompleteResponse[]> {
    return this.makeRequest<InstitutionCompleteResponse[]>(`${API_BASE_URL}/inactive`);
  }

  // Obtener institución por ID con información completa
  async getInstitutionById(id: string): Promise<InstitutionWithUsersAndClassroomsResponse> {
    return this.makeRequest<InstitutionWithUsersAndClassroomsResponse>(`${API_BASE_URL}/${id}`);
  }

  // Crear institución con usuarios (director y auxiliares)
  async createInstitutionWithUsers(data: InstitutionCreateWithUsersRequest): Promise<Institution> {
    return this.makeRequest<Institution>(`${API_BASE_URL}/with-users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Listar todas las instituciones con usuarios y aulas completas
  async getAllInstitutionsWithUsersAndClassrooms(): Promise<InstitutionWithUsersAndClassroomsResponse[]> {
    return this.makeRequest<InstitutionWithUsersAndClassroomsResponse[]>(`${API_BASE_URL}/with-users-classrooms`);
  }

  // Actualizar institución
  async updateInstitution(id: string, data: InstitutionUpdateRequest): Promise<Institution> {
    return this.makeRequest<Institution>(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Eliminar institución (eliminación lógica)
  async deleteInstitution(id: string): Promise<void> {
    return this.makeRequest<void>(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  }

  // Restaurar institución eliminada
  async restoreInstitution(id: string): Promise<Institution> {
    return this.makeRequest<Institution>(`${API_BASE_URL}/${id}/restore`, {
      method: 'PUT',
    });
  }

  // Eliminar aula (eliminación lógica)
  async deleteClassroom(institutionId: string, classroomId: string): Promise<void> {
    return this.makeRequest<void>(`${API_CLASSROOM_URL}/${classroomId}`, {
      method: 'DELETE',
    });
  }

  // Actualizar aula
  async updateClassroom(classroomId: string, data: {
    classroomName: string;
    classroomAge: string;
    capacity: number;
    color: string;
  }): Promise<Classroom> {
    return this.makeRequest<Classroom>(`${API_CLASSROOM_URL}/${classroomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Restaurar aula eliminada
  async restoreClassroom(institutionId: string, classroomId: string): Promise<Classroom> {
    return this.makeRequest<Classroom>(`${API_CLASSROOM_URL}/${classroomId}/restore`, {
      method: 'PATCH',
    });
  }

  // Crear nueva aula
  async createClassroom(data: {
    classroomName: string;
    classroomAge: string;
    capacity: number;
    color: string;
    institutionId: string;
  }): Promise<Classroom> {
    return this.makeRequest<Classroom>(`${API_CLASSROOM_URL}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Exportar una instancia del servicio
export const institutionService = new InstitutionService();
export default institutionService;
