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
#define DISPLAY_ON_SECONDS         20  // Segundos que el mensaje se queda en pantalla antes de dormir
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
// 4. CONFIGURACIÓN AUTOMÁTICA DE PINES
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
  #define BUTTON_PIN  9 // Botón BOOT en el C3 SuperMini
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
  #define BUTTON_PIN  0   // Botón BOOT integrado en la placa (GPIO 0)
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

unsigned long lastPollMillis = 0;

void setup() {
    Serial.begin(115200);
    delay(300);
    Serial.println("\n========================================================");
    Serial.printf(" [XpriT Robotics] ESP-KC Iniciando en %s\n", BOARD_NAME);
    Serial.println("========================================================");

    pinMode(BUTTON_PIN, INPUT_PULLUP);
    delay(100); // Estabilizar lectura del pin

    setupDisplay();

    // Comprobar motivo del despertar
    esp_sleep_wakeup_cause_t wakeupReason = esp_sleep_get_wakeup_cause();
    bool wokeFromSleep = (wakeupReason == ESP_SLEEP_WAKEUP_EXT0 || 
                          wakeupReason == ESP_SLEEP_WAKEUP_GPIO || 
                          wakeupReason == ESP_SLEEP_WAKEUP_TIMER);

    // Solo mostrar test de color en arranque en frío (al enchufar cable/batería)
    if (!wokeFromSleep) {
        showColorCalibrationTest();
    }

    // Iniciar memoria flash no volátil
    prefs.begin("espkc", false);
    lastMessageId = prefs.getInt("last_id", 0);
    prefs.getString("my_id", myDeviceId, sizeof(myDeviceId));
    prefs.getString("partner_id", partnerId, sizeof(partnerId));
    prefs.getString("server_host", serverHost, sizeof(serverHost));

    Serial.printf("[Config] Mi ID: %s | Pareja: %s | Ultimo Msg ID: #%d\n", myDeviceId, partnerId, lastMessageId);
    Serial.printf("[Config] Servidor: %s\n", serverHost);

    // Solo forzar portal si se arranca en frío manteniendo pulsado el botón (evita falsos positivos al despertar)
    bool forcePortal = false;
    if (digitalRead(BUTTON_PIN) == LOW && !wokeFromSleep) {
        delay(600);
        if (digitalRead(BUTTON_PIN) == LOW) {
            forcePortal = true;
            Serial.println("[Boton] Boton presionado al encender -> Forzando Portal Cautivo.");
        }
    }

    bool connected = false;

    // 1. Intentar conexión directa si el usuario puso SSID en el código
    if (!forcePortal && strlen(WIFI_SSID) > 0) {
        Serial.printf("[WiFi] Intentando conexion directa a: %s ...\n", WIFI_SSID);
        showConnectingScreen(WIFI_SSID);

        WiFi.mode(WIFI_STA);
        WiFi.begin(WIFI_SSID, WIFI_PASS);

        int attempts = 0;
        while (WiFi.status() != WL_CONNECTED && attempts < 25) {
            delay(500);
            Serial.print(".");
            attempts++;
        }
        Serial.println();

        if (WiFi.status() == WL_CONNECTED) {
            connected = true;
            Serial.println("[WiFi] Conectado exitosamente con credenciales directas!");
        } else {
            Serial.println("[WiFi] No se pudo conectar a la red directa. Probando WiFiManager...");
        }
    }

    // 2. Si no conectó directamente, usar WiFiManager (Portal Cautivo)
    if (!connected) {
        WiFiManager wm;
        wm.setConnectTimeout(15);       // Tiempo maximo intentando conectar a red guardada
        wm.setConfigPortalTimeout(180); // 3 minutos de espera en modo AP antes de suspender

        // Callback visual cuando entra en modo Portal Cautivo (AP)
        wm.setAPCallback([](WiFiManager *myWM) {
            Serial.println("\n--------------------------------------------------------");
            Serial.println(" [WIFI] MODO PORTAL CAUTIVO ACTIVADO");
            Serial.printf(" [WIFI] 1. Desde tu celular o PC conectate a la red Wi-Fi: %s\n", myWM->getConfigPortalSSID().c_str());
            Serial.printf(" [WIFI] 2. Abre tu navegador en: http://%s\n", WiFi.softAPIP().toString().c_str());
            Serial.println("--------------------------------------------------------\n");

            showConfigPortalScreen(myWM->getConfigPortalSSID().c_str());
        });

        // Parámetros personalizables en el portal
        WiFiManagerParameter custom_my_id("my_id", "Mi Nombre/ID de Llavero", myDeviceId, 32);
        WiFiManagerParameter custom_partner_id("partner_id", "ID de mi Pareja/Amigo", partnerId, 32);
        WiFiManagerParameter custom_server("server", "URL Servidor (ej: https://...)", serverHost, 128);

        wm.addParameter(&custom_my_id);
        wm.addParameter(&custom_partner_id);
        wm.addParameter(&custom_server);

        if (!forcePortal) {
            showConnectingScreen("WiFi Guardado");
        }

        if (forcePortal) {
            connected = wm.startConfigPortal("XpriT-Llavero-Setup");
        } else {
            connected = wm.autoConnect("XpriT-Llavero-Setup");
        }

        // Guardar parámetros si se cambiaron en el portal web
        if (connected) {
            if (strlen(custom_my_id.getValue()) > 0) {
                strcpy(myDeviceId, custom_my_id.getValue());
                prefs.putString("my_id", myDeviceId);
            }
            if (strlen(custom_partner_id.getValue()) > 0) {
                strcpy(partnerId, custom_partner_id.getValue());
                prefs.putString("partner_id", partnerId);
            }
            if (strlen(custom_server.getValue()) > 0) {
                strcpy(serverHost, custom_server.getValue());
                prefs.putString("server_host", serverHost);
            }
        }
    }

    // Si fallaron todos los intentos de conexión Wi-Fi
    if (!connected) {
        Serial.println("\n[WiFi] No fue posible conectar al Wi-Fi.");
        showErrorScreen("Sin WiFi", "Revisa red/clave");
        delay(3000);

        #if ENABLE_DEEP_SLEEP
            enterDeepSleep(10 * 60); // Duerme 10 minutos
        #else
            Serial.println("[Modo USB] Esperando 10 segundos antes de reiniciar...");
            delay(10000);
            ESP.restart();
        #endif
    }

    // Wi-Fi conectado exitosamente
    Serial.println("\n========================================================");
    Serial.printf(" [WiFi] CONECTADO A: %s\n", WiFi.SSID().c_str());
    Serial.printf(" [WiFi] IP ASIGNADA:  %s\n", WiFi.localIP().toString().c_str());
    Serial.printf(" [WiFi] POTENCIA:     %d dBm\n", WiFi.RSSI());
    Serial.println("========================================================\n");

    showConnectedScreen();
    delay(1500);

    // Si el botón está pulsado, enviar mensaje rápido
    if (digitalRead(BUTTON_PIN) == LOW) {
        sendQuickReply();
    }

    // Primera consulta al servidor
    checkServerMessages();
    lastPollMillis = millis();

    #if ENABLE_DEEP_SLEEP
        // En modo ahorro de batería entra a Deep Sleep (despierta por botón o timer)
        enterDeepSleep(SLEEP_DURATION_MINUTES * 60);
    #else
        Serial.println("[Modo USB] Manteniendo ESP32 despierto para pruebas continuas.");
    #endif
}

void loop() {
#if ENABLE_DEEP_SLEEP
    // En modo Deep Sleep no se ejecuta el loop
#else
    // Modo desarrollo por USB: bucle continuo sin apagar el ESP32
    if (digitalRead(BUTTON_PIN) == LOW) {
        delay(200); // Debounce
        Serial.println("\n[Boton] Pulsado -> Enviando respuesta rapida...");
        sendQuickReply();
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

            Serial.printf(">>> MOSTRANDO MENSAJE! ID: #%d | De: %s | Tipo: %s <<<\n", msgId, from, type);

            if (hasImage) {
                // Descargar imagen RGB565 calibrada
                fetchAndDrawRawImage(msgId);
            } else {
                // Mostrar tarjeta de texto con el mensaje recibido
                showMessageUI(from, content, msgId);
            }

            lastMessageId = msgId;
            prefs.putInt("last_id", msgId);

            // Mantener mensaje en pantalla para que el usuario pueda apreciarlo
            Serial.printf("[Pantalla] Manteniendo visible por %d segundos...\n", DISPLAY_ON_SECONDS);
            delay(DISPLAY_ON_SECONDS * 1000UL);
        } else {
            Serial.println("[HTTP] No hay mensajes registrados en el servidor para este usuario.");
            tft.fillScreen(COLOR_BG);
        }
    } else {
        Serial.printf("[HTTP] Error en consulta: Codigo %d\n", httpCode);
        char errBuf[32];
        if (httpCode > 0) {
            snprintf(errBuf, sizeof(errBuf), "HTTP Codigo %d", httpCode);
        } else {
            snprintf(errBuf, sizeof(errBuf), "Fallo de conexion");
        }
        showErrorScreen("Error Servidor", errBuf);
        delay(3000);
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

                tft.drawRGBBitmap(0, 0, p16, 160, 80);
                Serial.println("[TFT] Imagen renderizada correctamente con colores calibrados!");
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
    esp_deep_sleep_enable_gpio_wakeup(1ULL << BUTTON_PIN, ESP_GPIO_WAKEUP_GPIO_LOW);
#else
    esp_sleep_enable_ext0_wakeup((gpio_num_t)BUTTON_PIN, 0);
#endif

    esp_deep_sleep_start();
}
