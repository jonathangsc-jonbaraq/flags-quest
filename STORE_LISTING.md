# Guía de Publicación en Google Play Store — Flag Quest

Todo está preparado y firmado para que subas **Flag Quest** (`com.jonbaraq.flagquest`) a [Google Play Console](https://play.google.com/console).

---

## 1. Archivos Listos para Subir

| Recurso | Ruta en tu ordenador | Uso en Google Play Console |
| :--- | :--- | :--- |
| **Android App Bundle (`.aab`)** | `android/app/build/outputs/bundle/release/app-release.aab` | Subir en **Producción / Prueba cerrada → Crear versión** |
| **APK de Producción Firmado** | `android/app/build/outputs/apk/release/app-release.apk` | Instalación directa de prueba |
| **Llave de Firma (`Keystore`)** | `android/app/upload-keystore.jks` | **¡Guárdala en un lugar seguro!** Necesaria para futuras actualizaciones (Alias: `flagquest-key`) |
| **Icono de Alta Resolución** | `playstore_assets/icon_512x512.png` | Ficha de Play Store (512 × 512 px, PNG sin transparencia) |
| **Gráfico de Funciones** | `playstore_assets/feature_graphic_1024x500.png` | Cabecera promocional de Play Store (1024 × 500 px) |
| **Capturas de Pantalla** | `playstore_assets/screenshot_*.png` | Capturas reales de teléfono para la ficha de Play Store |
| **Política de Privacidad** | `https://github.com/jonathangsc-jonbaraq/flags-quest/blob/main/PRIVACY_POLICY.md` | URL requerida en **Contenido de la aplicación → Política de privacidad** |

---

## 2. Textos Listos para Copiar en la Ficha de Play Store

### Español (`es-ES` / `es-419`)

- **Nombre de la aplicación (máx. 30 caracteres):**
  `Flag Quest: Banderas y Países`
- **Descripción breve (máx. 80 caracteres):**
  `Domina los 197 países, banderas y capitales del mundo con retos rápidos.`
- **Descripción completa:**
  ```text
  ¡Pon a prueba tu memoria visual y domina la geografía mundial con Flag Quest!

  Flag Quest es un juego educativo rápido, limpio y adictivo diseñado para aprender los 197 países soberanos del mundo, sus banderas oficiales y sus capitales en español e inglés.

  CARACTERÍSTICAS PRINCIPALES:
  • Base de datos mundial completa: Incluye los 197 países del mundo con sus banderas de alta resolución, capitales, población y continente.
  • 3 Modalidades de Quiz: Practica adivinando el país por su bandera (Banderas), la capital de cada nación (Capitales) o el desafío combinado (Mixto).
  • Filtro por Continentes: Juega con Todo el Mundo con dificultad progresiva o entrena específicamente Europa, Asia, África, Norteamérica, Sudamérica u Oceanía.
  • Modo Supervivencia (3 Vidas): Avanza sin repeticiones mientras desbloqueas países cada vez más desafiantes y aprendes datos clave tras cada pregunta.
  • Modo Contrarreloj (60 Segundos): Responde a toda velocidad y consigue bonificaciones de +2 segundos por cada racha de 5 aciertos consecutivos.
  • Atlas Mundial Interactivo: Consulta en cualquier momento la enciclopedia integrada de los 197 países y sigue tu progreso de Dominio Mundial.
  • Sin anuncios ni compras integradas: Experiencia 100% fluida a 60 FPS con diseño Material Design 3, modo oscuro automático y vibración háptica nativa.
  ```

---

### English (`en-US`)

- **App Name (max 30 chars):**
  `Flag Quest: Flags & Capitals`
- **Short Description (max 80 chars):**
  `Master all 197 world countries, flags, and capitals in fast geography quizzes!`
- **Full Description:**
  ```text
  Test your geography skills and master every flag and capital on Earth with Flag Quest!

  Flag Quest is a fast, clean, Material Design 3 trivia game built to help you learn all 197 sovereign countries, their official flags, and their world capitals in both English and Spanish.

  KEY FEATURES:
  • Complete 197-Country Database: Covers every sovereign nation with high-resolution flags, capitals, population stats, and regions.
  • 3 Quiz Modes: Practice Flags, World Capitals, or Mixed Challenge.
  • Continent Filters: Play the entire world with progressive difficulty or focus on Europe, Asia, Africa, North America, South America, or Oceania.
  • Survival Mode (3 Lives): Advance through non-repeating questions and learn capital and population facts along the way.
  • 60-Second Timed Blitz: Race against the clock with auto-advance and +2s time bonuses on every 5-answer streak.
  • Interactive World Atlas: Browse and search all 197 countries anytime and track your World Mastery percentage.
  • Ad-Free & Privacy-First: No ads, no trackers, no personal data collection, and native Android haptic feedback.
  ```

---

## 3. Respuestas para el Cuestionario de "Contenido de la Aplicación" en Play Console

1. **Política de privacidad**: Pega la URL `https://github.com/jonathangsc-jonbaraq/flags-quest/blob/main/PRIVACY_POLICY.md`
2. **Anuncios**: Selecciona **"No, mi aplicación no contiene anuncios"**.
3. **Acceso a la aplicación**: Selecciona **"Todas las funciones están disponibles sin restricciones especiales"** (no requiere login).
4. **Clasificación de contenido (IARC)**: Categoría *Juego / Educativo / Trivia* → responde **"No"** a violencia, contenido sexual, lenguaje ofensivo, compras o intercambio de datos entre usuarios (obtendrás **PEGI 3 / Everyone**).
5. **Seguridad de los datos (Data Safety)**: Selecciona **"No, la aplicación no recopila ni comparte ningún tipo de datos de usuario"**.
