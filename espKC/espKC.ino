/*
 * =====================================================================================
 *  XpriT Robotics — ESP-KC (Llavero IoT con Mensajería P2P)
 * =====================================================================================
 *  Hardware: 
 *    - Microcontrolador: ESP32-C3 SuperMini (RISC-V) o ESP32 DevKit clásico (WROOM-32)
 *    - Pantalla: TFT ST7735S 80x160 IPS (RGB)
 *    - Botón de interacción: GPIO 9 (C3 SuperMini) o GPIO 0 (ESP32 clásico)
 * 
 *  Librerías requeridas en Arduino IDE (Instalar desde el Administrador de Bibliotecas):
 *    1. "Adafruit GFX Library" (por Adafruit)
 *    2. "Adafruit ST7735 and ST7789 Library" (por Adafruit)
 *    3. "ArduinoJson" (por Benoit Blanchon, versión 6.x o 7.x)
 *    4. "WiFiManager" (por tzapu, tablatronix)
 * 
 *  =====================================================================================
 *  TABLA DE CONEXIÓN ESTÁNDAR — ESP32 DevKit (WROOM-32 clásico):
 *  -------------------------------------------------------------------------------------
 *    Pantalla ST7735S (80x160)    ESP32 DevKit (WROOM)
 *    GND                     ->   GND
 *    VCC                     ->   3.3V
 *    SCL / SCK               ->   GPIO 18 (VSPI SCK)
 *    SDA / MOSI              ->   GPIO 23 (VSPI MOSI)
 *    RES / RST               ->   GPIO 4
 *    DC                      ->   GPIO 16 (RX2)
 *    CS                      ->   GPIO 17 (TX2) [¡NUNCA GPIO 5!]
 *    BLK / LED               ->   3.3V (o GPIO 22)
 *
 *    BOTÓN A 3.3V (Recomendado):  Pata 1 -> 3.3V, Pata 2 -> GPIO 27 (D27)
 *    BOTÓN A GND (Alternativo):   Pata 1 -> GND,  Pata 2 -> GPIO 0 (o botón BOOT integrado)
 *
 *    NOTA: Si tu pantalla tiene 7 pines y NO tiene pin CS, no conectes nada a GPIO 17.
 *
 *    ¡POR QUÉ GPIO 5 FALLABA!:
 *    GPIO 5 es un "strapping pin" de arranque. Cuando una pantalla tira de GPIO 5
 *    hacia nivel bajo al encender, el ESP32 interpreta que debe bootear en modo SDIO,
 *    falla al leer la memoria Flash y lanza "invalid header: 0xffffffff".
 *    Al mover CS a GPIO 17 y DC a GPIO 16, queda 100% libre de interferencias.
 *  -------------------------------------------------------------------------------------
 *  TABLA DE CONEXIÓN — ESP32-C3 SuperMini (RISC-V):
 *  -------------------------------------------------------------------------------------
 *    GND -> GND, VCC -> 3.3V, SCL -> GPIO 4, SDA -> GPIO 6, RES -> GPIO 1,
 *    DC -> GPIO 3, CS -> GPIO 7, BLK -> GPIO 2, BOTÓN -> GPIO 9
 *  =====================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <WiFiManager.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>
#include <LittleFS.h>
#include <memory>

// =====================================================================================
// 1. CONFIGURACIÓN RÁPIDA DE WI-FI (OPCIONAL PERO RECOMENDADO PARA PRUEBAS)
// =====================================================================================
// Si completas tu red y clave aquí, el ESP32 se conectará DIRECTO sin esperar el celular.
// Si los dejas vacíos (""), usará el Portal Cautivo Wi-Fi ("XpriT-Llavero-Setup").
// NOTA: Los ESP32 solo admiten redes Wi-Fi de 2.4 GHz (no 5 GHz).
const char* WIFI_SSID = ""; // Tu red Wi-Fi (ej: "MiCasa_2.4G")
const char* WIFI_PASS = ""; // Tu clave de Wi-Fi

// =====================================================================================
// 2. MODO AHORRO DE BATERÍA (DEEP SLEEP)
// =====================================================================================
// true:  Muestra el último mensaje por DISPLAY_ON_SECONDS y entra en Deep Sleep.
//        Despierta al presionar el BOTÓN o periódicamente por temporizador.
// false: Mantiene el ESP32 despierto continuamente (ideal para pruebas con cable USB).
#define ENABLE_DEEP_SLEEP          true
#define DISPLAY_ON_SECONDS         30  // Segundos que el mensaje se queda en pantalla antes de dormir
#define SLEEP_DURATION_MINUTES     5   // Minutos que duerme antes de volver a consultar
#define POLL_INTERVAL_SECONDS      15  // Si ENABLE_DEEP_SLEEP es false, intervalo en segundos

// Si los colores se ven como en negativo (ej. blanco por negro o cyan por rojo), cámbialo a true/false:
#define INVERT_DISPLAY_COLORS      false

// =====================================================================================
// 3. IDENTIFICADORES Y SERVIDOR
// =====================================================================================
char myDeviceId[32]    = "Guada";
char partnerId[32]     = "Fran";
// URL de tu servidor Next.js (puede ser tu IP local "http://192.168.1.X:3000" o dominio de Railway/Vercel)
char serverHost[128]   = "https://xprit-robotics.com";
int lastMessageId      = 0;

// =====================================================================================
// 4. CONFIGURACIÓN DEL BOTÓN DE INTERACCIÓN (3.3V vs GND)
// =====================================================================================
// ¿A qué vas a conectar el botón?
// true:  Botón a 3.3V (Pata 1 a 3.3V, Pata 2 al GPIO). Al presionar entrega HIGH (3.3V).
//        Usa GPIO 27 en DevKit o GPIO 5 en C3 (¡NUNCA GPIO 0 porque ya está en 3.3V en la placa!).
// false: Botón a GND  (Pata 1 a GND, Pata 2 al GPIO). Al presionar entrega LOW (0V).
//        Puedes usar el botón BOOT integrado en la placa (GPIO 0 / 9) sin cables extra.
#define BUTTON_TO_3V3          true

#if BUTTON_TO_3V3
  #define BUTTON_ACTIVE_STATE  HIGH
  #define BUTTON_PIN_MODE      INPUT_PULLDOWN
  #define BUTTON_WAKE_LEVEL    1
#else
  #define BUTTON_ACTIVE_STATE  LOW
  #define BUTTON_PIN_MODE      INPUT_PULLUP
  #define BUTTON_WAKE_LEVEL    0
#endif

// =====================================================================================
// 5. CONFIGURACIÓN AUTOMÁTICA DE PINES
// =====================================================================================
#if defined(CONFIG_IDF_TARGET_ESP32C3)
  // Configuración para ESP32-C3 SuperMini (RISC-V)
  #define BOARD_NAME  "ESP32-C3 SuperMini"
  #define TFT_CS      7
  #define TFT_DC      3
  #define TFT_RST     1
  #define TFT_MOSI    6
  #define TFT_SCLK    4
  #define TFT_BLK     2
  #if BUTTON_TO_3V3
    #define BUTTON_PIN  5 // GPIO 5 libre para botón a 3.3V
  #else
    #define BUTTON_PIN  9 // Botón BOOT integrado a GND
  #endif
#else
  // Configuración para ESP32 DevKit V1 / WROOM-32 clásico (30 o 38 pines)
  // PINES 100% LIBRES DE STRAPPING (GPIO 17 y 16 no interfieren con el arranque)
  #define BOARD_NAME  "ESP32 DevKit WROOM"
  #define TFT_CS      17  // TX2 (GPIO 17 - Libre de strapping)
  #define TFT_DC      16  // RX2 (GPIO 16 - Libre de strapping)
  #define TFT_RST     4   // GPIO 4
  #define TFT_MOSI    23  // Hardware VSPI MOSI (SDA)
  #define TFT_SCLK    18  // Hardware VSPI SCLK (SCL)
  #define TFT_BLK     22  // GPIO 22 (o conectar directo a 3.3V)
  #if BUTTON_TO_3V3
    #define BUTTON_PIN  27 // D27 (RTC GPIO con pull-down para botón a 3.3V)
  #else
    #define BUTTON_PIN  0  // Botón BOOT integrado a GND (GPIO 0)
  #endif
#endif

// Objeto de pantalla y almacenamiento
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
Preferences prefs;

// =====================================================================================
// CALIBRACIÓN DE COLOR (Corrige el "Rojo que se ve Verdoso / Cyan")
// =====================================================================================
// Modo 1 (Por defecto): Byteswap (0x00F8). Convierte el verdoso en Rojo puro en ESP32.
// Modo 2: BGR swap (0x001F). Para pantallas que intercambian Rojo y Azul.
// Modo 0: RGB directo clásico (0xF800).
#define COLOR_CALIBRATION_MODE 2

#if COLOR_CALIBRATION_MODE == 1
  // Modo 1: Byteswap para pantallas con orden Little-Endian en bus SPI
  #define COLOR_BG        0x4208 // Fondo oscuro
  #define COLOR_HEADER    0xE318 // Azul
  #define COLOR_ACCENT    0x00F8 // Rojo puro XpriT (antes se veia verdoso como 0xF800)
  #define COLOR_CYAN      0xFF07 // Cyan neón
  #define COLOR_TEXT      0xFFFF // Blanco
  #define COLOR_MUTED     0x1084 // Gris
  #define COLOR_SUCCESS   0xE007 // Verde brillante
  #define COLOR_BLUE      0x1F00 // Azul puro
#elif COLOR_CALIBRATION_MODE == 2
  // Modo 2: Intercambio BGR
  #define COLOR_BG        0x0842
  #define COLOR_HEADER    0x18E3
  #define COLOR_ACCENT    0x001F // Rojo en modo BGR
  #define COLOR_CYAN      0xFFE0 // Cyan en modo BGR
  #define COLOR_TEXT      0xFFFF
  #define COLOR_MUTED     0x8410
  #define COLOR_SUCCESS   0x07E0
  #define COLOR_BLUE      0xF800
#else
  // Modo 0: RGB nativo
  #define COLOR_BG        0x0842
  #define COLOR_HEADER    0x18E3
  #define COLOR_ACCENT    0xF800
  #define COLOR_CYAN      0x07FF
  #define COLOR_TEXT      0xFFFF
  #define COLOR_MUTED     0x8410
  #define COLOR_SUCCESS   0x07E0
  #define COLOR_BLUE      0x001F
#endif

// Prototipos
void setupDisplay();
void showColorCalibrationTest();
void showConnectingScreen(const char* targetName);
void showConnectedScreen();
void showConfigPortalScreen(const char* apName);
void showIdleScreen();
void showErrorScreen(const char* title, const char* detail);
void showMessageUI(const char* from, const char* content, int id);
void fetchAndDrawRawImage(int messageId);
void checkServerMessages();
void sendQuickReply();
void enterDeepSleep(int sleepSeconds);
bool saveCachedImage(uint16_t* pixels, size_t pixelCount);
bool showCachedImage();
void showCachedContent();
void drawStatusBorder(uint16_t color);
bool connectWiFiQuick(int timeoutSeconds);

unsigned long lastPollMillis = 0;

// =====================================================================================
// FUNCIONES DE CACHÉ LOCAL (LITTLEFS Y PREFERENCES) Y BORDES DE ESTADO
// =====================================================================================

// Dibuja un marco sutil de 2 píxeles en los bordes de la pantalla (160x80)
void drawStatusBorder(uint16_t color) {
    tft.drawRect(0, 0, 160, 80, color);
    tft.drawRect(1, 1, 158, 78, color);
}

// Guarda los 25.600 bytes de la imagen calibrada en memoria Flash interna (LittleFS)
bool saveCachedImage(uint16_t* pixels, size_t pixelCount) {
    File f = LittleFS.open("/last_img.bin", "w");
    if (!f) {
        Serial.println("[LittleFS] Error: no se pudo abrir /last_img.bin para guardar.");
        return false;
    }
    size_t written = f.write((uint8_t*)pixels, pixelCount * sizeof(uint16_t));
    f.close();
    Serial.printf("[LittleFS] Imagen guardada en memoria flash (%d bytes)\n", (int)written);
    return (written == pixelCount * sizeof(uint16_t));
}

// Lee directamente línea por línea de LittleFS a la pantalla (toma solo ~15ms y 320 bytes de RAM)
bool showCachedImage() {
    if (!LittleFS.exists("/last_img.bin")) return false;
    File f = LittleFS.open("/last_img.bin", "r");
    if (!f) return false;
    if (f.size() != (160 * 80 * 2)) {
        f.close();
        return false;
    }

    uint16_t lineBuf[160];
    tft.setAddrWindow(0, 0, 160, 80);
    tft.startWrite();
    for (int y = 0; y < 80; y++) {
        f.read((uint8_t*)lineBuf, 160 * sizeof(uint16_t));
        tft.writePixels(lineBuf, 160);
    }
    tft.endWrite();
    f.close();
    return true;
}

// Muestra de inmediato lo último guardado al despertar (cero demora)
void showCachedContent() {
    bool hasCachedImage = prefs.getBool("last_has_img", false);
    if (hasCachedImage && showCachedImage()) {
        Serial.println("[Cache] Imagen mostrada instantaneamente desde memoria Flash.");
        return;
    }

    if (lastMessageId > 0) {
        char cachedFrom[32] = "";
        char cachedContent[256] = "";
        prefs.getString("last_from", cachedFrom, sizeof(cachedFrom));
        prefs.getString("last_content", cachedContent, sizeof(cachedContent));
        showMessageUI(cachedFrom, cachedContent, lastMessageId);
        Serial.println("[Cache] Mensaje de texto mostrado instantaneamente desde memoria Flash.");
        return;
    }

    // Si es el primer encendido y todavía no hay mensajes en memoria
    showIdleScreen();
}

// Intenta conectar a Wi-Fi de forma rápida en segundo plano (timeout en segundos)
bool connectWiFiQuick(int timeoutSeconds) {
    Serial.printf("[WiFi] Intentando conectar en segundo plano (max %d seg)...\n", timeoutSeconds);
    WiFi.mode(WIFI_STA);

    if (strlen(WIFI_SSID) > 0) {
        WiFi.begin(WIFI_SSID, WIFI_PASS);
    } else {
        WiFi.begin(); // Conectar a la última red guardada por el chip ESP32
    }

    int attempts = 0;
    int maxAttempts = timeoutSeconds * 2;
    while (WiFi.status() != WL_CONNECTED && attempts < maxAttempts) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("[WiFi] Conectado exitosamente a '%s' (IP: %s)\n", 
                      WiFi.SSID().c_str(), WiFi.localIP().toString().c_str());
        return true;
    }

    Serial.println("[WiFi] No se pudo conectar a ninguna red Wi-Fi en el tiempo limite.");
    return false;
}

// =====================================================================================
// SETUP PRINCIPAL
// =====================================================================================
void setup() {
    Serial.begin(115200);
    delay(200);
    Serial.println("\n========================================================");
    Serial.printf(" [XpriT Robotics] ESP-KC Iniciando en %s\n", BOARD_NAME);
    Serial.println("========================================================");

    pinMode(BUTTON_PIN, BUTTON_PIN_MODE);
    delay(50);

    setupDisplay();

    // 1. Iniciar LittleFS y Preferences
    if (!LittleFS.begin(true)) {
        Serial.println("[LittleFS] Error o particion inicializada.");
    }
    prefs.begin("espkc", false);
    lastMessageId = prefs.getInt("last_id", 0);
    prefs.getString("my_id", myDeviceId, sizeof(myDeviceId));
    prefs.getString("partner_id", partnerId, sizeof(partnerId));
    prefs.getString("server_host", serverHost, sizeof(serverHost));

    Serial.printf("[Config] Mi ID: %s | Pareja: %s | Ultimo Msg ID: #%d\n", myDeviceId, partnerId, lastMessageId);

    // Comprobar motivo del despertar
    esp_sleep_wakeup_cause_t wakeupReason = esp_sleep_get_wakeup_cause();
    bool wokeFromSleep = (wakeupReason == ESP_SLEEP_WAKEUP_EXT0 || 
                          wakeupReason == ESP_SLEEP_WAKEUP_GPIO || 
                          wakeupReason == ESP_SLEEP_WAKEUP_TIMER);

    // 2. ¡MOSTRAR IMAGEN O TEXTO DE INMEDIATO!
    // Al despertar, la pantalla se enciende y muestra el contenido guardado en 15 milisegundos
    showCachedContent();

    // 3. Comprobar pulsación del botón
    bool forcePortal = false;
    bool sendReply = false;

    if (digitalRead(BUTTON_PIN) == BUTTON_ACTIVE_STATE) {
        unsigned long pressStart = millis();
        while (digitalRead(BUTTON_PIN) == BUTTON_ACTIVE_STATE) {
            // Si mantiene pulsado más de 2 segundos:
            if (millis() - pressStart > 2000) {
                if (!wokeFromSleep && lastMessageId == 0) {
                    forcePortal = true;
                    Serial.println("[Boton] Presionado prolongado -> Forzando Portal Cautivo.");
                } else {
                    sendReply = true;
                    Serial.println("[Boton] Presionado prolongado -> Enviar mensaje rapido de amor.");
                }
                break;
            }
            delay(50);
        }
    }

    // Portal cautivo solo si es el primer arranque y no hay ninguna red configurada
    if (forcePortal || (lastMessageId == 0 && strlen(WIFI_SSID) == 0 && WiFi.SSID().length() == 0)) {
        WiFiManager wm;
        wm.setConnectTimeout(15);
        wm.setConfigPortalTimeout(180);
        showConfigPortalScreen("XpriT-Llavero-Setup");
        wm.startConfigPortal("XpriT-Llavero-Setup");
    }

    // 4. Intentar conexión Wi-Fi en segundo plano mientras el usuario ya está viendo su foto
    bool connected = connectWiFiQuick(7); // 7 segundos de espera máxima

    if (!connected) {
        // SIN WI-FI: Borde rojo sobre la imagen/texto (Modo Offline)
        Serial.println("[Estado] Sin Wi-Fi -> Borde ROJO (Modo Offline)");
        drawStatusBorder(COLOR_ACCENT); // Borde rojo
    } else {
        // CON WI-FI: Borde verde y consultar al servidor
        Serial.println("[Estado] Wi-Fi OK -> Borde VERDE");
        drawStatusBorder(COLOR_SUCCESS); // Borde verde

        if (sendReply) {
            sendQuickReply();
            // Restaurar contenido y marco verde tras enviar
            showCachedContent();
            drawStatusBorder(COLOR_SUCCESS);
        }

        // Consultar al servidor: si hay algo nuevo se descarga y actualiza la pantalla
        checkServerMessages();
    }

    // 5. Mantener la pantalla encendida para que el usuario pueda contemplarla
    Serial.printf("[Pantalla] Visible por %d segundos...\n", DISPLAY_ON_SECONDS);
    delay(DISPLAY_ON_SECONDS * 1000UL);

    #if ENABLE_DEEP_SLEEP
        // Entrar en Deep Sleep (despierta por botón o temporizador periódico)
        enterDeepSleep(SLEEP_DURATION_MINUTES * 60);
    #else
        Serial.println("[Modo USB] Manteniendo encendido para pruebas.");
        lastPollMillis = millis();
    #endif
}

void loop() {
#if ENABLE_DEEP_SLEEP
    // En modo Deep Sleep el ESP32 se apaga y no llega al loop
#else
    // Modo USB de desarrollo:
    if (digitalRead(BUTTON_PIN) == BUTTON_ACTIVE_STATE) {
        delay(200);
        Serial.println("\n[Boton] Pulsado -> Enviando respuesta rapida...");
        sendQuickReply();
        showCachedContent();
        drawStatusBorder(COLOR_SUCCESS);
        delay(1000);
        checkServerMessages();
        lastPollMillis = millis();
    }

    if (millis() - lastPollMillis >= (POLL_INTERVAL_SECONDS * 1000UL)) {
        lastPollMillis = millis();
        Serial.println("\n[Loop] Consulta periodica al servidor...");
        checkServerMessages();
    }

    delay(50);
#endif
}

// -------------------------------------------------------------------------------------
// INICIALIZACIÓN Y PANTALLAS EN EL TFT ST7735S (80x160 IPS)
// -------------------------------------------------------------------------------------
void setupDisplay() {
    pinMode(TFT_BLK, OUTPUT);
    digitalWrite(TFT_BLK, HIGH); // Encender retroiluminación

    tft.initR(INITR_MINI160x80);
    tft.setRotation(3);       // Modo apaisado (160 de ancho x 80 de alto)
    tft.invertDisplay(INVERT_DISPLAY_COLORS); // Configuración de colores reales
    tft.fillScreen(COLOR_BG);
}

void showColorCalibrationTest() {
    tft.fillScreen(0x0000); // Negro de fondo para prueba

    // 3 bloques de prueba: Rojo, Verde, Azul
    tft.fillRect(8, 8, 42, 38, COLOR_ACCENT);
    tft.fillRect(58, 8, 42, 38, COLOR_SUCCESS);
    tft.fillRect(108, 8, 42, 38, COLOR_BLUE);

    tft.setTextColor(0xFFFF);
    tft.setTextSize(1);
    tft.setCursor(12, 54);
    tft.print("ROJO");

    tft.setCursor(60, 54);
    tft.print("VERDE");

    tft.setCursor(112, 54);
    tft.print("AZUL");

    delay(2000);
}

void showConnectingScreen(const char* targetName) {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_HEADER);
    
    tft.setCursor(8, 14);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println("XpriT ESP-KC");
    
    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(8, 30);
    tft.printf("Hola, %s!\n", myDeviceId);
    
    tft.setTextColor(COLOR_CYAN);
    tft.setCursor(8, 48);
    tft.println("Conectando WiFi...");
    tft.setTextColor(COLOR_MUTED);
    tft.setCursor(8, 62);
    tft.print(targetName);
}

void showConnectedScreen() {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_SUCCESS);

    tft.setCursor(8, 14);
    tft.setTextColor(COLOR_SUCCESS);
    tft.setTextSize(1);
    tft.println("WiFi Conectado!");

    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(8, 32);
    tft.printf("Red: %s\n", WiFi.SSID().c_str());

    tft.setCursor(8, 48);
    tft.setTextColor(COLOR_CYAN);
    tft.printf("IP: %s\n", WiFi.localIP().toString().c_str());

    tft.setCursor(8, 64);
    tft.setTextColor(COLOR_MUTED);
    tft.println("Buscando mensajes...");
}

void showConfigPortalScreen(const char* apName) {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_ACCENT);

    tft.setCursor(6, 6);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println("CONFIGURAR WIFI");

    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(6, 20);
    tft.println("1. Conectate a WiFi:");
    tft.setTextColor(COLOR_CYAN);
    tft.setCursor(6, 30);
    tft.println(apName);

    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(6, 46);
    tft.println("2. Entra en navegador:");
    tft.setTextColor(COLOR_CYAN);
    tft.setCursor(6, 56);
    tft.println("http://192.168.4.1");
}

void showIdleScreen() {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_HEADER);
    tft.fillRect(0, 0, 160, 16, COLOR_HEADER);

    tft.setCursor(4, 4);
    tft.setTextColor(COLOR_CYAN);
    tft.setTextSize(1);
    tft.printf("Llavero: %s", myDeviceId);

    tft.setCursor(8, 26);
    tft.setTextColor(COLOR_TEXT);
    tft.println("Todo al dia :)");

    tft.setCursor(8, 42);
    tft.setTextColor(COLOR_MUTED);
    tft.println("Sin mensajes nuevos");

    tft.setCursor(8, 62);
    tft.setTextColor(COLOR_ACCENT);
    tft.print("XpriT ESP-KC");

    tft.setCursor(110, 62);
    tft.setTextColor(COLOR_MUTED);
    tft.printf("#%d", lastMessageId);
}

void showErrorScreen(const char* title, const char* detail) {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_ACCENT);

    tft.setCursor(8, 10);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println(title);

    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(8, 28);
    tft.println(detail);

    tft.setCursor(8, 46);
    tft.setTextColor(COLOR_MUTED);
    tft.println("Revisa Serial/URL");

    tft.setCursor(8, 62);
    tft.setTextColor(COLOR_CYAN);
    tft.printf("IP: %s", WiFi.localIP().toString().c_str());
}

// -------------------------------------------------------------------------------------
// CONSULTA AL SERVIDOR WEB (POLLING CON SOPORTE HTTP Y HTTPS CON TIMEOUT)
// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------
// CONSULTA AL SERVIDOR WEB (POLLING CON SOPORTE HTTP Y HTTPS CON TIMEOUT)
// -------------------------------------------------------------------------------------
void checkServerMessages() {
    // Consultar siempre el último mensaje dirigido a este destinatario (sin filtrar por sinceId)
    String url = String(serverHost) + "/api/espkc/poll?recipient=" + String(myDeviceId);
    Serial.printf("\n[HTTP] Consultando ultimo mensaje para '%s': %s\n", myDeviceId, url.c_str());

    HTTPClient http;
    http.setTimeout(10000); // 10 segundos maximo de espera
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);

    // Mantenemos el cliente activo durante TODO el tiempo de vida de la funcion
    std::unique_ptr<WiFiClient> client;
    if (url.startsWith("https://")) {
        WiFiClientSecure* sec = new WiFiClientSecure();
        sec->setInsecure(); // No validar certificados SSL para mayor compatibilidad
        sec->setTimeout(10);
        client.reset(sec);
    } else {
        WiFiClient* plain = new WiFiClient();
        plain->setTimeout(10);
        client.reset(plain);
    }

    if (!http.begin(*client, url)) {
        Serial.println("[HTTP] Error: no se pudo iniciar la conexion HTTP.");
        showErrorScreen("Error Conexion", "Fallo http.begin");
        return;
    }

    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        Serial.printf("[HTTP] Respuesta recibida (200 OK): %s\n", payload.c_str());

        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);

        bool hasMessage = (!error && (doc["hasMessage"] == true || doc.containsKey("message")));

        if (hasMessage && doc["message"].is<JsonObject>()) {
            int msgId = doc["message"]["id"];
            const char* from = doc["message"]["from"];
            const char* type = doc["message"]["type"];
            const char* content = doc["message"]["content"];
            bool hasImage = doc["message"]["hasImage"];

            // Comprobar si hay un mensaje nuevo respecto al que ya mostramos de la memoria local
            if (msgId != lastMessageId) {
                Serial.printf(">>> NUEVO MENSAJE DETECTADO! ID: #%d | De: %s <<<\n", msgId, from);

                if (hasImage) {
                    // Descargar imagen RGB565 calibrada y guardarla en Flash (LittleFS)
                    fetchAndDrawRawImage(msgId);
                    prefs.putBool("last_has_img", true);
                } else {
                    // Mostrar tarjeta de texto y guardarla en memoria Flash
                    showMessageUI(from, content, msgId);
                    prefs.putString("last_from", from);
                    prefs.putString("last_content", content);
                    prefs.putBool("last_has_img", false);
                }

                lastMessageId = msgId;
                prefs.putInt("last_id", msgId);

                // Marco verde confirmando nueva actualización recibida
                drawStatusBorder(COLOR_SUCCESS);
            } else {
                Serial.printf("[HTTP] Mensaje #%d ya esta en pantalla. Todo al dia.\n", msgId);
                // Confirmar marco verde indicando conexion y sincronizacion completas
                drawStatusBorder(COLOR_SUCCESS);
            }
        } else {
            Serial.println("[HTTP] No hay mensajes registrados en el servidor para este usuario.");
        }
    } else {
        Serial.printf("[HTTP] Error en consulta: Codigo %d\n", httpCode);
        // Si falla la consulta al servidor, el borde rojo advierte el problema pero la imagen sigue en pantalla
        drawStatusBorder(COLOR_ACCENT);
    }

    http.end();
}

// -------------------------------------------------------------------------------------
// DESCARGA Y RENDERIZADO DE IMAGEN BINARIA RGB565 (160x80 = 25.600 bytes)
// -------------------------------------------------------------------------------------
void fetchAndDrawRawImage(int messageId) {
    String url = String(serverHost) + "/api/espkc/raw/" + String(messageId);
    Serial.printf("[HTTP] Descargando imagen RGB565 desde: %s\n", url.c_str());

    HTTPClient http;
    http.setTimeout(15000);
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);

    std::unique_ptr<WiFiClient> client;
    if (url.startsWith("https://")) {
        WiFiClientSecure* sec = new WiFiClientSecure();
        sec->setInsecure();
        sec->setTimeout(15);
        client.reset(sec);
    } else {
        WiFiClient* plain = new WiFiClient();
        plain->setTimeout(15);
        client.reset(plain);
    }

    if (!http.begin(*client, url)) {
        Serial.println("[HTTP] Error iniciando descarga de imagen.");
        return;
    }

    int httpCode = http.GET();

    if (httpCode == 200) {
        int totalBytes = http.getSize();
        Serial.printf("[HTTP] Tamano reportado de imagen: %d bytes\n", totalBytes);

        uint8_t* imgBuffer = (uint8_t*)malloc(160 * 80 * 2);
        if (imgBuffer != NULL) {
            WiFiClient* stream = http.getStreamPtr();
            int bytesRead = 0;
            unsigned long startFetch = millis();

            while (http.connected() && bytesRead < (160 * 80 * 2) && (millis() - startFetch < 12000)) {
                size_t available = stream->available();
                if (available) {
                    int c = stream->readBytes(imgBuffer + bytesRead, (160 * 80 * 2) - bytesRead);
                    bytesRead += c;
                }
                delay(1);
            }

            Serial.printf("[HTTP] Bytes leidos: %d / 25600\n", bytesRead);
            if (bytesRead == 160 * 80 * 2) {
                uint16_t* p16 = (uint16_t*)imgBuffer;
                for (int i = 0; i < 160 * 80; i++) {
                    uint8_t byteH = imgBuffer[i * 2];
                    uint8_t byteL = imgBuffer[i * 2 + 1];
                    uint16_t rawRgb = ((uint16_t)byteH << 8) | byteL;

                    uint16_t r = (rawRgb >> 11) & 0x1F;
                    uint16_t g = (rawRgb >> 5) & 0x3F;
                    uint16_t b = rawRgb & 0x1F;

#if COLOR_CALIBRATION_MODE == 2
                    // Modo 2: Pantalla en modo BGR (el activo del usuario)
                    // Intercambiar canal Rojo y Azul para panel BGR
                    p16[i] = (b << 11) | (g << 5) | r;
#elif COLOR_CALIBRATION_MODE == 1
                    // Modo 1: Byteswap
                    p16[i] = (byteL << 8) | byteH;
#else
                    // Modo 0: RGB nativo
                    p16[i] = rawRgb;
#endif
                }

                // 1. Mostrar en pantalla
                tft.drawRGBBitmap(0, 0, p16, 160, 80);

                // 2. Guardar en memoria flash interna (LittleFS) para que esté disponible offline
                saveCachedImage(p16, 160 * 80);

                Serial.println("[TFT] Imagen renderizada y guardada en cache offline!");
            } else {
                Serial.println("[HTTP] Descarga incompleta de la imagen.");
            }
            free(imgBuffer);
        } else {
            Serial.println("[Memoria] Error: RAM insuficiente para buffer de imagen.");
        }
    } else {
        Serial.printf("[HTTP] Error descargando imagen: %d\n", httpCode);
    }
    http.end();
}

// -------------------------------------------------------------------------------------
// RENDERIZADO DE MENSAJE DE TEXTO CON UI ESTILIZADA
// -------------------------------------------------------------------------------------
void showMessageUI(const char* from, const char* content, int id) {
    tft.fillScreen(COLOR_BG);

    // Barra superior con remitente
    tft.fillRect(0, 0, 160, 16, COLOR_HEADER);
    tft.setCursor(4, 4);
    tft.setTextColor(COLOR_CYAN);
    tft.setTextSize(1);
    tft.printf("DE: %s", from);

    // Badge con ID del mensaje
    tft.setCursor(124, 4);
    tft.setTextColor(COLOR_ACCENT);
    tft.printf("#%d", id);

    // Contenido del mensaje
    tft.setCursor(6, 24);
    tft.setTextColor(COLOR_TEXT);
    tft.setTextSize(1);
    tft.setTextWrap(true);
    tft.print(content);

    // Footer inferior
    tft.drawFastHLine(0, 68, 160, COLOR_HEADER);
    tft.setCursor(4, 71);
    tft.setTextColor(COLOR_MUTED);
    tft.setTextSize(1);
    tft.print("XpriT ESP-KC Llavero");
}

// -------------------------------------------------------------------------------------
// ENVIAR RESPUESTA RÁPIDA ("TE ESTOY PENSANDO")
// -------------------------------------------------------------------------------------
void sendQuickReply() {
    tft.fillScreen(COLOR_BG);
    tft.setCursor(10, 24);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println("Enviando amor a");
    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(10, 40);
    tft.printf("-> %s...\n", partnerId);

    String url = String(serverHost) + "/api/espkc/messages";
    String jsonBody = "{\"from\":\"" + String(myDeviceId) + "\",\"to\":\"" + String(partnerId) + "\",\"type\":\"text\",\"content\":\"<3 Te estoy pensando!\"}";

    HTTPClient http;
    http.setTimeout(10000);

    std::unique_ptr<WiFiClient> client;
    if (url.startsWith("https://")) {
        WiFiClientSecure* sec = new WiFiClientSecure();
        sec->setInsecure();
        sec->setTimeout(10);
        client.reset(sec);
    } else {
        WiFiClient* plain = new WiFiClient();
        plain->setTimeout(10);
        client.reset(plain);
    }

    if (http.begin(*client, url)) {
        http.addHeader("Content-Type", "application/json");
        int httpCode = http.POST(jsonBody);

        tft.setCursor(10, 58);
        if (httpCode == 201 || httpCode == 200) {
            tft.setTextColor(COLOR_SUCCESS);
            tft.println("Mensaje Enviado!");
            Serial.println("[HTTP] Mensaje rapido enviado con exito!");
        } else {
            tft.setTextColor(COLOR_ACCENT);
            tft.printf("Error al enviar (%d)", httpCode);
            Serial.printf("[HTTP] Error enviando mensaje rapido: %d\n", httpCode);
        }
        http.end();
    }
    delay(2000);
}

// -------------------------------------------------------------------------------------
// APAGADO Y DEEP SLEEP (SOLO SE USA SI ENABLE_DEEP_SLEEP ESTÁ EN TRUE)
// -------------------------------------------------------------------------------------
void enterDeepSleep(int sleepSeconds) {
    Serial.printf("\n[Power] Entrando en Deep Sleep por %d segundos...\n", sleepSeconds);

    digitalWrite(TFT_BLK, LOW);
    tft.enableSleep(true);

    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);

    esp_sleep_enable_timer_wakeup((uint64_t)sleepSeconds * 1000000ULL);

#if defined(CONFIG_IDF_TARGET_ESP32C3)
    esp_deep_sleep_enable_gpio_wakeup(1ULL << BUTTON_PIN, BUTTON_TO_3V3 ? ESP_GPIO_WAKEUP_GPIO_HIGH : ESP_GPIO_WAKEUP_GPIO_LOW);
#else
    #if BUTTON_TO_3V3
        gpio_pulldown_en((gpio_num_t)BUTTON_PIN);
        gpio_pullup_dis((gpio_num_t)BUTTON_PIN);
    #else
        gpio_pullup_en((gpio_num_t)BUTTON_PIN);
        gpio_pulldown_dis((gpio_num_t)BUTTON_PIN);
    #endif
    esp_sleep_enable_ext0_wakeup((gpio_num_t)BUTTON_PIN, BUTTON_WAKE_LEVEL);
#endif

    esp_deep_sleep_start();
}
