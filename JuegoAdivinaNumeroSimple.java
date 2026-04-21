// Importamos las librerias para el programa
import java.util.Scanner;  // Libreria para leer entrada del usuario
import java.util.Random;   // Libreria para generar números aleatorios

// Definir la clase pública del programa
public class JuegoAdivinaNumeroSimple {
    
    // Punto de entrada del programa
    public static void main(String[] args) {
        
        // Crear un objeto Scanner para leer datos del teclado
        Scanner teclado = new Scanner(System.in);
        
        // Crear un objeto Random para generar números aleatorios
        Random generador = new Random();
        
        // Variable para controlar si el usuario quiere seguir jugando
        boolean seguirJugando = true;
        
        // Variables para guardar estadísticas
        int totalPartidas = 0;      // Cantidad de partidas jugadas
        int totalIntentos = 0;      // Suma total de intentos
        
        // BUCLE PRINCIPAL: mientras quiera jugar, seguir ejecutando
        while (seguirJugando) {
            
            // Generar un número aleatorio entre 1 y 100
            int numeroSecreto = generador.nextInt(100) + 1;
            
            // Contar esta partida
            totalPartidas++;
            
            // Variable para guardar el número que adivina el usuario
            int adivinanza;
            
            // Variable para saber si ya ganó
            boolean gano = false;
            
            // Contador de intentos en esta partida
            int intentosPartida = 0;
            
            // Mostrar mensaje
            System.out.println("Adivina el numero entre 1 y 100");
            
            // BUCLE DE JUEGO: seguir pidiendo números hasta que adivine
            while (!gano) {
                
                // Pedir un número
                System.out.print("Tu adivinanza: ");
                adivinanza = teclado.nextInt();
                
                // Contar este intento
                intentosPartida++;
                
                // Comparar el número
                if (adivinanza < numeroSecreto) {
                    System.out.println("El numero es mayor");
                    
                } else if (adivinanza > numeroSecreto) {
                    System.out.println("El numero es menor");
                    
                } else {
                    System.out.println("Ganaste! El numero era: " + numeroSecreto);
                    System.out.println("Intentos: " + intentosPartida);
                    
                    // Guardar estadísticas
                    totalIntentos += intentosPartida;
                    
                    gano = true;
                }
            }
            
            // Preguntar si quiere jugar de nuevo
            System.out.print("Jugar de nuevo? (s/n): ");
            String respuesta = teclado.next();
            
            // Si responde 's' o 'si', seguir jugando
            if (respuesta.equals("s") || respuesta.equals("si")) {
                seguirJugando = true;
            } else {
                seguirJugando = false;
            }
        }
        
        // Cerrar el Scanner
        teclado.close();
        
        // Mostrar estadísticas finales
        System.out.println("Gracias por jugar");
        System.out.println("Total de partidas jugadas: " + totalPartidas);
        
        // Calcular y mostrar el promedio
        if (totalPartidas > 0) {
            int promedio = totalIntentos / totalPartidas;
            System.out.println("Promedio de intentos: " + promedio);
        }
    }
}
