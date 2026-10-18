/*
 * =====================================================================================
 *  XpriT Robotics — ESP-KC (Llavero IoT con Mensajería P2P)
 * =====================================================================================
 *  Hardware: 
 *    - Microcontrolador: ESP32-C3 SuperMini (RISC-V)
 *    - Pantalla: TFT ST7735S 80x160 IPS (RGB)
 *    - Botón de interacción: GPIO 9 (Botón BOOT integrado en la placa)
 * 
 *  Librerías requeridas en Arduino IDE (Instalar desde el Administrador de Bibliotecas):
 *    1. "Adafruit GFX Library" (por Adafruit)
 *    2. "Adafruit ST7735 and ST7789 Library" (por Adafruit)
 *    3. "ArduinoJson" (por Benoit Blanchon, versión 6.x o 7.x)
 *    4. "WiFiManager" (por tzapu, tablatronix)
 * 
 *  Configuración de Pines ESP32-C3 SuperMini ↔ ST7735S 80x160:
 *    GND      -> GND
 *    VCC      -> 3.3V
 *    SCL/SCK  -> GPIO 4 (SPI Clock)
 *    SDA/MOSI -> GPIO 6 (SPI Data)
 *    RES/RST  -> GPIO 1 (Reset)
 *    DC       -> GPIO 3 (Data / Command)
 *    CS       -> GPIO 7 (Chip Select)
 *    BLK/LED  -> GPIO 2 (Control de Retroiluminación / Ahorro de batería)
 *    BOTÓN    -> GPIO 9 (Botón BOOT con pull-up interno)
 * =====================================================================================
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

// -------------------------------------------------------------------------------------
// CONFIGURACIÓN AUTOMÁTICA DE PINES (Detecta si es ESP32-C3 o ESP32 DevKit clásico)
// -------------------------------------------------------------------------------------
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
  #define BOARD_NAME  "ESP32 DevKit WROOM"
  #define TFT_CS      5
  #define TFT_DC      2
  #define TFT_RST     4
  #define TFT_MOSI    23 // VSPI MOSI
  #define TFT_SCLK    18 // VSPI SCK
  #define TFT_BLK     15
  #define BUTTON_PIN  0  // Botón BOOT en el ESP32 clásico (GPIO 0)
#endif

// Objeto de pantalla
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
Preferences prefs;

// Configuración por defecto (modificable vía portal cautivo)
char myDeviceId[32]    = "Lore";
char partnerId[32]     = "Fran";
char serverHost[128]   = "https://xprit-site.vercel.app"; // o la URL de tu server
int lastMessageId      = 0;

// Paleta de colores RGB565
#define COLOR_BG        0x0842 // Negro azulado profundo
#define COLOR_HEADER    0x18E3 // Azul oscuro
#define COLOR_ACCENT    0xF800 // Rojo XpriT
#define COLOR_CYAN      0x07FF // Cyan neón
#define COLOR_TEXT      0xFFFF // Blanco
#define COLOR_MUTED     0x8410 // Gris suave

// Prototipos
void setupDisplay();
void showConnectingScreen();
void showMessageUI(const char* from, const char* content, int id);
void fetchAndDrawRawImage(int messageId);
void checkServerMessages();
void sendQuickReply();
void enterDeepSleep(int sleepSeconds);

void setup() {
    Serial.begin(115200);
    delay(200);
    Serial.println("\n[XpriT ESP-KC] Iniciando Llavero IoT...");

    pinMode(BUTTON_PIN, INPUT_PULLUP);
    setupDisplay();

    // Iniciar memoria Flash no volátil
    prefs.begin("espkc", false);
    lastMessageId = prefs.getInt("last_id", 0);
    prefs.getString("my_id", myDeviceId, sizeof(myDeviceId));
    prefs.getString("partner_id", partnerId, sizeof(partnerId));
    prefs.getString("server_host", serverHost, sizeof(serverHost));

    Serial.printf("Configuracion cargada -> Mi ID: %s | Pareja: %s | Ultimo Msg: #%d\n", myDeviceId, partnerId, lastMessageId);

    // Si el usuario mantiene pulsado el botón al encender -> forzar portal Wi-Fi
    bool forcePortal = (digitalRead(BUTTON_PIN) == LOW);
    if (forcePortal) {
        tft.fillScreen(COLOR_BG);
        tft.setCursor(6, 20);
        tft.setTextColor(COLOR_ACCENT);
        tft.setTextSize(1);
        tft.println("MODO CONFIGURACION");
        tft.setTextColor(COLOR_TEXT);
        tft.println("\nConectate a WiFi:");
        tft.setTextColor(COLOR_CYAN);
        tft.println("XpriT-Llavero-Setup");
    } else {
        showConnectingScreen();
    }

    // Configuración de WiFiManager (Portal Cautivo)
    WiFiManager wm;
    wm.setConfigPortalTimeout(180); // 3 minutos de espera si no hay Wi-Fi

    WiFiManagerParameter custom_my_id("my_id", "Mi Nombre/ID de Llavero", myDeviceId, 32);
    WiFiManagerParameter custom_partner_id("partner_id", "ID de mi Pareja/Amigo", partnerId, 32);
    WiFiManagerParameter custom_server("server", "URL Servidor Web (ej: https://...)", serverHost, 128);

    wm.addParameter(&custom_my_id);
    wm.addParameter(&custom_partner_id);
    wm.addParameter(&custom_server);

    bool connected = false;
    if (forcePortal) {
        connected = wm.startConfigPortal("XpriT-Llavero-Setup");
    } else {
        connected = wm.autoConnect("XpriT-Llavero-Setup");
    }

    if (!connected) {
        Serial.println("No se pudo conectar a WiFi. Apagando para cuidar bateria...");
        tft.fillScreen(COLOR_BG);
        tft.setCursor(6, 30);
        tft.setTextColor(COLOR_ACCENT);
        tft.println("Sin WiFi / Reposo");
        delay(2000);
        enterDeepSleep(10 * 60); // Duerme 10 minutos
    }

    // Guardar parámetros si se cambiaron en el portal
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

    // Comprobar si despertó por pulsar el botón mientras estaba despierto
    if (digitalRead(BUTTON_PIN) == LOW) {
        sendQuickReply();
    }

    // Consultar nuevos mensajes
    checkServerMessages();

    // Entrar en modo Deep Sleep para que la batería dure días
    enterDeepSleep(5 * 60); // Consultar cada 5 minutos
}

void loop() {
    // No se usa loop porque el ESP32 entra en Deep Sleep al final del setup
}

// -------------------------------------------------------------------------------------
// INICIALIZACIÓN DE PANTALLA ST7735S (80x160 IPS)
// -------------------------------------------------------------------------------------
void setupDisplay() {
    pinMode(TFT_BLK, OUTPUT);
    digitalWrite(TFT_BLK, HIGH); // Encender luz de fondo

    // Inicializar para el panel de 80x160
    tft.initR(INITR_MINI160x80);
    tft.setRotation(3);       // Modo horizontal (160 px ancho x 80 px alto)
    tft.invertDisplay(true);  // Obligatorio para IPS para tener colores naturales
    tft.fillScreen(COLOR_BG);
}

void showConnectingScreen() {
    tft.fillScreen(COLOR_BG);
    tft.drawRect(0, 0, 160, 80, COLOR_HEADER);
    
    tft.setCursor(10, 20);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println("XpriT ESP-KC");
    
    tft.setTextColor(COLOR_TEXT);
    tft.setCursor(10, 36);
    tft.printf("Hola, %s!\n", myDeviceId);
    
    tft.setTextColor(COLOR_CYAN);
    tft.setCursor(10, 52);
    tft.println("Conectando WiFi...");
}

// -------------------------------------------------------------------------------------
// CONSULTA AL SERVIDOR WEB (POLLING)
// -------------------------------------------------------------------------------------
void checkServerMessages() {
    WiFiClientSecure client;
    client.setInsecure(); // Permite HTTPS sin validar certificados de raíz

    HTTPClient http;
    String url = String(serverHost) + "/api/espkc/poll?recipient=" + String(myDeviceId) + "&sinceId=" + String(lastMessageId);
    Serial.printf("[HTTP] Consultando: %s\n", url.c_str());

    http.begin(client, url);
    int httpCode = http.GET();

    if (httpCode == 200) {
        String payload = http.getString();
        Serial.printf("[HTTP] Respuesta: %s\n", payload.c_str());

        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);

        if (!error && doc["hasNew"] == true) {
            int newId = doc["message"]["id"];
            const char* from = doc["message"]["from"];
            const char* type = doc["message"]["type"];
            const char* content = doc["message"]["content"];
            bool hasImage = doc["message"]["hasImage"];

            Serial.printf(">>> NUEVO MENSAJE DETECTADO! ID: %d De: %s Tipo: %s <<<\n", newId, from, type);

            if (hasImage) {
                // Descargar y renderizar imagen binaria RGB565 (25.6 KB)
                fetchAndDrawRawImage(newId);
            } else {
                // Mostrar tarjeta de texto
                showMessageUI(from, content, newId);
            }

            // Guardar último ID para no volver a descargarlo
            lastMessageId = newId;
            prefs.putInt("last_id", newId);

            // Mantener pantalla encendida 15 segundos para que la persona lo lea
            delay(15000);
        } else {
            Serial.println("No hay mensajes nuevos.");
        }
    } else {
        Serial.printf("[HTTP] Error en consulta: %d\n", httpCode);
    }

    http.end();
}

// -------------------------------------------------------------------------------------
// DESCARGA Y RENDERIZADO DE IMAGEN BINARIA RGB565 (160x80 = 25.600 bytes)
// -------------------------------------------------------------------------------------
void fetchAndDrawRawImage(int messageId) {
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    String url = String(serverHost) + "/api/espkc/raw/" + String(messageId);
    Serial.printf("[HTTP] Descargando imagen RGB565: %s\n", url.c_str());

    http.begin(client, url);
    int httpCode = http.GET();

    if (httpCode == 200) {
        int totalBytes = http.getSize();
        Serial.printf("Tamano de imagen: %d bytes\n", totalBytes);

        // Buffer dinámico para los 25.600 bytes
        uint8_t* imgBuffer = (uint8_t*)malloc(160 * 80 * 2);
        if (imgBuffer != NULL) {
            WiFiClient* stream = http.getStreamPtr();
            int bytesRead = 0;
            
            while (http.connected() && bytesRead < 160 * 80 * 2) {
                size_t available = stream->available();
                if (available) {
                    int c = stream->readBytes(imgBuffer + bytesRead, (160 * 80 * 2) - bytesRead);
                    bytesRead += c;
                }
                delay(1);
            }

            // Dibujar la imagen completa en el display ST7735S
            tft.drawRGBBitmap(0, 0, (uint16_t*)imgBuffer, 160, 80);
            free(imgBuffer);
            Serial.println("Imagen renderizada con exito en TFT!");
        } else {
            Serial.println("Error: Memoria insuficiente para imagen");
        }
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

    // Badge ID
    tft.setCursor(124, 4);
    tft.setTextColor(COLOR_ACCENT);
    tft.printf("#%d", id);

    // Contenido del mensaje (con ajuste de línea automático)
    tft.setCursor(6, 24);
    tft.setTextColor(COLOR_TEXT);
    tft.setTextSize(1);
    tft.setTextWrap(true);
    tft.print(content);

    // Footer
    tft.drawFastHLine(0, 68, 160, COLOR_HEADER);
    tft.setCursor(4, 71);
    tft.setTextColor(COLOR_MUTED);
    tft.setTextSize(1);
    tft.print("XpriT ESP-KC Llavero");
}

// -------------------------------------------------------------------------------------
// ENVIAR RESPUESTA RÁPIDA (HEARTBEAT / "TE ESTOY PENSANDO")
// -------------------------------------------------------------------------------------
void sendQuickReply() {
    tft.fillScreen(COLOR_BG);
    tft.setCursor(10, 30);
    tft.setTextColor(COLOR_ACCENT);
    tft.setTextSize(1);
    tft.println("Enviando amor a");
    tft.setTextColor(COLOR_TEXT);
    tft.printf("-> %s...\n", partnerId);

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    String url = String(serverHost) + "/api/espkc/messages";
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    String jsonBody = "{\"from\":\"" + String(myDeviceId) + "\",\"to\":\"" + String(partnerId) + "\",\"type\":\"text\",\"content\":\"<3 Te estoy pensando!\"}";
    int httpCode = http.POST(jsonBody);

    if (httpCode == 201 || httpCode == 200) {
        tft.setCursor(10, 50);
        tft.setTextColor(COLOR_CYAN);
        tft.println("Mensaje Enviado!");
    } else {
        tft.setCursor(10, 50);
        tft.setTextColor(COLOR_ACCENT);
        tft.println("Error al enviar");
    }
    http.end();
    delay(2500);
}

// -------------------------------------------------------------------------------------
// APAGADO DE PANTALLA Y ENTRADA A DEEP SLEEP (AHORRO MÁXIMO DE BATERÍA)
// -------------------------------------------------------------------------------------
void enterDeepSleep(int sleepSeconds) {
    Serial.printf("[Power] Entrando en Deep Sleep por %d segundos...\n", sleepSeconds);

    // 1. Apagar retroiluminación y pantalla
    digitalWrite(TFT_BLK, LOW);
    tft.enableSleep(true);

    // 2. Apagar radio Wi-Fi
    WiFi.disconnect(true);
    WiFi.mode(WIFI_OFF);

    // 3. Configurar despertares: por temporizador Y por botón físico
    esp_sleep_enable_timer_wakeup((uint64_t)sleepSeconds * 1000000ULL);

#if defined(CONFIG_IDF_TARGET_ESP32C3)
    // ESP32-C3 admite wakeup en cualquier GPIO
    esp_deep_sleep_enable_gpio_wakeup(1ULL << BUTTON_PIN, ESP_GPIO_WAKEUP_GPIO_LOW);
#else
    // ESP32 clásico (WROOM) usa ext0 en pines RTC (GPIO 0 es el botón BOOT)
    esp_sleep_enable_ext0_wakeup((gpio_num_t)BUTTON_PIN, 0);
#endif

    // 4. Iniciar Deep Sleep
    esp_deep_sleep_start();
}
