# Validaciones de PsychologyEvaluation

## Resumen

Se ha implementado un sistema centralizado y robusto de validaciones para los formularios de creación y edición de evaluaciones psicológicas (`PsychologyEvaluation`). Las validaciones están concentradas en el archivo `src/modules/psychology/utils/validations.ts` y son utilizadas por ambas páginas de formulario.

## Estructura de Validaciones

### Función Principal: `validateField`

Valida un campo individual del formulario. Recibe:
- `field`: El nombre del campo a validar
- `value`: El valor actual del campo
- `formData` (opcional): El objeto completo del formulario para validaciones condicionales

Retorna:
- `null` si el campo es válido
- `string` con el mensaje de error si es inválido

### Campos Validados

#### 1. Campos Obligatorios (Selects)

| Campo | Validación |
|-------|-----------|
| `studentId` | Debe seleccionar un estudiante |
| `classroomId` | Debe seleccionar un aula |
| `institutionId` | Debe seleccionar una institución |
| `evaluationType` | Debe seleccionar un tipo de evaluación |
| `evaluatedBy` | Debe seleccionar un evaluador |

#### 2. Campos de Fecha

**`evaluationDate`**
- ✅ Requerido
- ✅ No puede ser en el futuro
- ✅ No puede ser anterior a 1 año atrás
- Mensajes informativos según el error

**`academicYear`**
- ✅ Requerido
- ✅ Debe estar entre 2000 y el año actual
- Validación de rango válido

#### 3. Campos de Texto con Validación de Longitud

**`evaluationReason` (Motivo de Evaluación)**
- ✅ Requerido
- ✅ No permitir solo espacios en blanco
- ✅ No permitir espacios al inicio o final
- ✅ Mínimo 10 caracteres
- ✅ Máximo 500 caracteres
- Mensajes que muestran caracteres actuales/requeridos

**`observations` (Observaciones)**
- ✅ Requerido
- ✅ No permitir solo espacios en blanco
- ✅ No permitir espacios al inicio o final
- ✅ Mínimo 20 caracteres
- ✅ Máximo 1000 caracteres
- Mensajes que muestran caracteres actuales/requeridos

**`recommendations` (Recomendaciones)**
- ✅ Requerido
- ✅ No permitir solo espacios en blanco
- ✅ No permitir espacios al inicio o final
- ✅ Mínimo 20 caracteres
- ✅ Máximo 1000 caracteres
- Mensajes que muestran caracteres actuales/requeridos

#### 4. Campos de Desarrollo

| Campo | Validación |
|-------|-----------|
| `emotionalDevelopment` | Debe seleccionar un nivel de desarrollo |
| `socialDevelopment` | Debe seleccionar un nivel de desarrollo |
| `cognitiveDevelopment` | Debe seleccionar un nivel de desarrollo |
| `motorDevelopment` | Debe seleccionar un nivel de desarrollo |

#### 5. Campos Condicionales

**`followUpFrequency` (Frecuencia de Seguimiento)**
- Solo es requerido si `requiresFollowUp` es `true`
- Mensaje: "Debe especificar la frecuencia de seguimiento"

### Funciones Auxiliares

#### `validateStep(fields, formData)`
Valida todos los campos de un paso específico del formulario.

**Retorna:** `Record<string, string>` con los errores por campo

#### `validateForm(steps, formData)`
Valida todo el formulario (todos los pasos).

**Retorna:** 
```typescript
{
  isValid: boolean;
  errors: Record<string, string>;
}
```

#### `isStepComplete(fields, formData)`
Verifica si todos los campos de un paso están completos.

**Retorna:** `boolean`

#### `canAccessStep(stepIndex, steps, formData)`
Verifica si se puede acceder a un paso específico. Requiere que todos los pasos anteriores estén completos.

**Retorna:** `boolean`

#### `normalizeTextInput(value)`
Normaliza un valor de texto removiendo espacios al inicio y final.

#### `getCharacterCount(value, minChars, maxChars)`
Calcula información sobre los caracteres de un campo.

**Retorna:**
```typescript
{
  current: number;      // Caracteres actuales
  remaining: number;    // Caracteres restantes
  isValid: boolean;     // Si cumple con min/max
}
```

## Integración con los Componentes

### PsychologyCreatePage.tsx
- Importa todas las funciones de validación desde `utils/validations.ts`
- Usa `validateField` para validación en tiempo real
- Usa `validateStep` para validar pasos individuales
- Usa `validateForm` para validar el formulario completo antes de guardar
- Usa `isStepComplete` para determinar si un paso está completo
- Usa `canAccessStep` para controlar la navegación entre pasos

### PsychologyEditPage.tsx
- Misma integración que PsychologyCreatePage
- Asegura consistencia en las validaciones entre crear y editar

## Flujo de Validación

1. **En Tiempo Real** (`onChange`)
   - Se valida el campo actual usando `validateField`
   - Se muestra el error inmediatamente al usuario
   - Se actualiza el estado de errores

2. **Al Navegar Entre Pasos** (`handleNext`)
   - Se valida el paso actual usando `validateStep`
   - Si hay errores, se muestran y se impide avanzar
   - Si está válido, se permite avanzar al siguiente paso

3. **Al Enviar Formulario** (`handleSubmit`)
   - Se valida todo el formulario usando `validateForm`
   - Si hay errores, se muestran todos y se impide guardar
   - Si está válido, se procede con la confirmación y guardado

## Mejoras Implementadas

### 1. Centralización
- Todas las reglas de validación están en un solo archivo
- Fácil de mantener y actualizar
- Evita duplicación de código

### 2. Reutilización
- Las mismas funciones se usan en Create y Edit
- Asegura consistencia en las validaciones
- Reduce el código duplicado

### 3. Validaciones Mejoradas
- Mejor manejo de campos de texto (trim, espacios en blanco)
- Validación de fechas más robusta
- Mensajes de error más informativos
- Contador de caracteres

### 4. Validaciones Condicionales
- `followUpFrequency` solo se valida si `requiresFollowUp` es `true`
- Permite mayor flexibilidad en formularios complejos

### 5. Control de Navegación
- No se puede avanzar si el paso actual tiene errores
- No se puede acceder a pasos posteriores si pasos anteriores no están completos
- Asegura que el formulario se complete en orden

## Ejemplos de Mensajes de Error

- "Debe seleccionar un estudiante"
- "La fecha no puede ser en el futuro"
- "Mínimo 10 caracteres requeridos (5/10)"
- "No debe iniciar o terminar con espacios en blanco"
- "No se permiten solo espacios en blanco"
- "La fecha no puede ser anterior a un año atrás"

## Cómo Agregar Nuevas Validaciones

Para agregar una nueva validación a un campo existente o nuevo:

1. Abre `src/modules/psychology/utils/validations.ts`
2. Ubica la función `validateField`
3. Agrega un nuevo `case` para el campo o modifica uno existente
4. Implementa la lógica de validación
5. Las páginas de Create y Edit automáticamente usarán la nueva validación

### Ejemplo

```typescript
case "miNuevoCampo":
  if (!value) return "Este campo es requerido";
  if (typeof value === "string" && value.length < 5)
    return "Mínimo 5 caracteres";
  return null;
```

## Testing

Para verificar que las validaciones funcionan correctamente:

1. Navega a la página de crear evaluación psicológica
2. Intenta enviar el formulario sin llenar campos - debes ver errores
3. Completa un campo y ve que el error desaparece
4. Intenta ingresar texto con solo espacios en blanco - debe mostrar error
5. Intenta seleccionar una fecha futura - debe mostrar error
6. Intenta avanzar sin completar el paso actual - debe bloquearse

## Referencias

- Archivos modificados:
  - `/workspaces/Siguei-front/src/modules/psychology/utils/validations.ts` (nuevo)
  - `/workspaces/Siguei-front/src/modules/psychology/pages/PsychologyEvaluation/PsychologyCreatePage.tsx`
  - `/workspaces/Siguei-front/src/modules/psychology/pages/PsychologyEvaluation/PsychologyEditPage.tsx`

- Importaciones necesarias en los componentes:
  ```typescript
  import {
    validateField,
    validateStep,
    validateForm,
    isStepComplete,
    canAccessStep,
  } from "../../utils/validations";
  ```
