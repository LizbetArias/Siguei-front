/**
 * Validaciones para Psychology Evaluation
 * Centraliza todas las reglas de validación para formularios de creación y edición
 */

import type { CreatePsychologicalEvaluationDto } from "../models/psychology.model";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida un campo individual de la evaluación psicológica
 */
export const validateField = (
  field: keyof CreatePsychologicalEvaluationDto,
  value: string | number | boolean | undefined,
  formData?: CreatePsychologicalEvaluationDto
): string | null => {
  switch (field) {
    // Campos requeridos - Selects
    case "studentId":
      return !value || value === "" ? "Debe seleccionar un estudiante" : null;

    case "classroomId":
      return !value || value === "" ? "Debe seleccionar un aula" : null;

    case "institutionId":
      return !value || value === "" ? "Debe seleccionar una institución" : null;

    case "evaluationType":
      return !value || value === "" ? "Debe seleccionar un tipo de evaluación" : null;

    case "evaluatedBy":
      return !value || value === "" ? "Debe seleccionar un evaluador" : null;

    // Campos de fecha
    case "evaluationDate": {
      if (!value) return "La fecha de evaluación es requerida";
      
      const selectedDate = new Date(String(value));
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Fin del día actual
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      
      // Validar que no sea una fecha futura
      if (selectedDate > today) {
        return "La fecha no puede ser en el futuro";
      }
      
      // Validar que no sea más antigua de un año
      if (selectedDate < oneYearAgo) {
        return "La fecha no puede ser anterior a un año atrás";
      }
      
      return null;
    }

    // Campo de año académico (readonly, pero lo validamos por si acaso)
    case "academicYear": {
      if (!value) return "El año académico es requerido";
      const yearNum = Number(value);
      const currentYear = new Date().getFullYear();
      if (yearNum < 2000 || yearNum > currentYear) {
        return "El año académico debe ser válido";
      }
      return null;
    }

    // Campos de texto requeridos con longitud mínima/máxima
    case "evaluationReason": {
      if (!value) return "El motivo de evaluación es requerido";
      
      const stringValue = String(value);
      const trimmedValue = stringValue.trim();
      
      // Validar que no sea solo espacios en blanco
      if (trimmedValue.length === 0) {
        return "No se permiten solo espacios en blanco";
      }
      
      // Validar que no tenga espacios al inicio o final
      if (stringValue !== trimmedValue) {
        return "No debe iniciar o terminar con espacios en blanco";
      }
      
      // Validar longitud mínima
      if (trimmedValue.length < 10) {
        return `Mínimo 10 caracteres requeridos (${trimmedValue.length}/10)`;
      }
      
      // Validar longitud máxima
      if (stringValue.length > 500) {
        return `Máximo 500 caracteres permitidos (${stringValue.length}/500)`;
      }
      
      return null;
    }

    case "observations": {
      if (!value) return "Las observaciones son requeridas";
      
      const stringValue = String(value);
      const trimmedValue = stringValue.trim();
      
      if (trimmedValue.length === 0) {
        return "No se permiten solo espacios en blanco";
      }
      
      if (stringValue !== trimmedValue) {
        return "No debe iniciar o terminar con espacios en blanco";
      }
      
      if (trimmedValue.length < 20) {
        return `Mínimo 20 caracteres requeridos (${trimmedValue.length}/20)`;
      }
      
      if (stringValue.length > 1000) {
        return `Máximo 1000 caracteres permitidos (${stringValue.length}/1000)`;
      }
      
      return null;
    }

    case "recommendations": {
      if (!value) return "Las recomendaciones son requeridas";
      
      const stringValue = String(value);
      const trimmedValue = stringValue.trim();
      
      if (trimmedValue.length === 0) {
        return "No se permiten solo espacios en blanco";
      }
      
      if (stringValue !== trimmedValue) {
        return "No debe iniciar o terminar con espacios en blanco";
      }
      
      if (trimmedValue.length < 20) {
        return `Mínimo 20 caracteres requeridos (${trimmedValue.length}/20)`;
      }
      
      if (stringValue.length > 1000) {
        return `Máximo 1000 caracteres permitidos (${stringValue.length}/1000)`;
      }
      
      return null;
    }

    // Campos de desarrollo (opcionales pero si se seleccionan deben tener valor)
    case "emotionalDevelopment":
    case "socialDevelopment":
    case "cognitiveDevelopment":
    case "motorDevelopment":
      return !value || value === "" ? "Debe seleccionar un nivel de desarrollo" : null;

    // Campo condicional
    case "followUpFrequency": {
      // Si requiereFollowUp es true, entonces followUpFrequency es requerido
      if (formData?.requiresFollowUp && (!value || value === "")) {
        return "Debe especificar la frecuencia de seguimiento";
      }
      return null;
    }

    default:
      return null;
  }
};

/**
 * Valida todos los campos de un paso específico
 */
export const validateStep = (
  fields: string[],
  formData: CreatePsychologicalEvaluationDto
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach((field) => {
    const value = formData[field as keyof CreatePsychologicalEvaluationDto];
    const error = validateField(
      field as keyof CreatePsychologicalEvaluationDto,
      value,
      formData
    );
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

/**
 * Valida todo el formulario (todos los pasos)
 */
export const validateForm = (
  steps: Array<{ fields: string[] }>,
  formData: CreatePsychologicalEvaluationDto
): ValidationResult => {
  const allErrors: Record<string, string> = {};

  steps.forEach((step) => {
    const stepErrors = validateStep(step.fields, formData);
    Object.assign(allErrors, stepErrors);
  });

  return {
    isValid: Object.keys(allErrors).length === 0,
    errors: allErrors,
  };
};

/**
 * Verifica si un paso está completo (todos los campos tienen valores)
 */
export const isStepComplete = (
  fields: string[],
  formData: CreatePsychologicalEvaluationDto
): boolean => {
  return fields.every((field) => {
    const value = formData[field as keyof CreatePsychologicalEvaluationDto];

    // Campo especial que siempre es válido
    if (field === "requiresFollowUp") return true;

    // Campo condicional de frecuencia
    if (field === "followUpFrequency") {
      return !formData.requiresFollowUp || (value !== "" && value !== undefined && value !== null);
    }

    // Otros campos
    return value !== "" && value !== undefined && value !== null;
  });
};

/**
 * Verifica si se puede acceder a un paso específico
 */
export const canAccessStep = (
  stepIndex: number,
  steps: Array<{ fields: string[] }>,
  formData: CreatePsychologicalEvaluationDto
): boolean => {
  // Acceso al primer paso siempre
  if (stepIndex === 0) return true;

  // Verificar que todos los pasos anteriores estén completos
  for (let i = 0; i < stepIndex; i++) {
    if (!isStepComplete(steps[i].fields, formData)) {
      return false;
    }
  }
  return true;
};

/**
 * Normaliza un valor de texto (trimming)
 */
export const normalizeTextInput = (value: string): string => {
  return value.trim();
};

/**
 * Obtiene el mensaje de caracteres remanentes para un campo de texto
 */
export const getCharacterCount = (
  value: string,
  minChars: number,
  maxChars: number
): { current: number; remaining: number; isValid: boolean } => {
  const current = value.length;
  const remaining = maxChars - current;
  const isValid = current >= minChars && current <= maxChars;

  return { current, remaining, isValid };
};
