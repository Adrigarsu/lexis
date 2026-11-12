# EP-01 · Cuenta y primer uso

## HU-01 · Registrarme

Must · RF-01, RF-02, RNF-10, RNF-11

Como visitante, quiero registrarme con email, contraseña y nombre de usuario, para guardar mi progreso en la nube.

- Dado que relleno datos válidos, declaro tener 14 años o más y acepto la política de privacidad, cuando pulso "Crear cuenta", entonces se crea la cuenta y recibo un email de verificación.
- Dado un nombre de usuario que ya existe, cuando intento registrarme, entonces veo un aviso y no se crea la cuenta.
- Dada una contraseña de menos de 12 caracteres, cuando intento registrarme, entonces veo el requisito y no se crea la cuenta.
- Dado que no marco la casilla de edad o la de privacidad, cuando intento continuar, entonces el formulario me indica qué falta.

## HU-02 · Verificar mi email

Must · RF-03

Como nuevo usuario, quiero verificar mi email, para poder empezar a estudiar.

- Dado que me acabo de registrar, cuando escribo el código de 6 cifras recibido por email antes de 10 minutos, entonces la cuenta queda verificada; tras 5 códigos erróneos debo pedir otro, y puedo reenviarlo cada 60 s.
- Dado que escribí mal mi email, cuando pulso "Corregir" en la pantalla de verificación, entonces lo cambio ahí mismo y recibo un código nuevo, sin volver atrás.

## HU-03 · Iniciar y cerrar sesión

Must · RF-04, RNF-10

Como estudiante, quiero iniciar y cerrar sesión, para usar mi cuenta en varios dispositivos.

- Dadas unas credenciales correctas, cuando inicio sesión, entonces veo el panel de inicio con mi progreso.
- Dadas unas credenciales incorrectas, cuando inicio sesión, entonces veo un mensaje genérico que no revela si el email existe.
- Dados 5 intentos fallidos seguidos, cuando lo intento de nuevo, entonces se me pide un CAPTCHA.
- Dado que cierro sesión, cuando otra persona abre la app en ese dispositivo, entonces no ve ninguno de mis datos.

## HU-04 · Recuperar mi contraseña

Must · RF-04

Como estudiante que ha olvidado su contraseña, quiero restablecerla por email, para no perder mi cuenta.

- Dado que pido recuperar la contraseña, cuando escribo mi email, entonces veo el mismo mensaje exista o no la cuenta, y si existe recibo un enlace.
- Dado que abro el enlace, cuando escribo una contraseña nueva válida, entonces puedo iniciar sesión con ella y el enlace deja de funcionar.

## HU-05 · Configurar mis metas al empezar

Must · RF-08

Como nuevo estudiante, quiero indicar cuánto quiero estudiar, para que la app se adapte a mi ritmo desde el primer día.

- Dado que entro por primera vez, cuando acabo la bienvenida, entonces elijo minutos al día, palabras nuevas al día y días de descanso por semana, con valores por defecto ya puestos (2 días de descanso).
- Dado que confirmo las metas, cuando llego al inicio, entonces la sesión guiada usa esos valores.

## HU-06 · Cambiar mis metas

Must · RF-09

Como estudiante, quiero cambiar mis metas cuando quiera, para ajustarlas a cada época.

- Dado que cambio las palabras nuevas al día en ajustes, cuando empiezo la siguiente sesión, entonces se aplica el nuevo límite.

## HU-07 · Cambiar mis datos de cuenta

Should · RF-05

Como estudiante, quiero cambiar mi email, contraseña o nombre de usuario, para mantener mi cuenta al día.

- Dado que cambio el email, cuando confirmo, entonces recibo un email de verificación en la dirección nueva y el cambio no se aplica hasta verificarla.
- Dado que cambio la contraseña, cuando confirmo, entonces se me pide la contraseña actual.

## HU-08 · Descargar mis datos

Must · RF-06

Como estudiante, quiero descargar todos mis datos, para tener una copia o llevármelos a otro sitio.

- Dado que pulso "Descargar mis datos", cuando termina, entonces obtengo un archivo JSON con mi cuenta, ajustes, tarjetas propias y todo el historial de estudio.

## HU-09 · Borrar mi cuenta

Must · RF-07, RNF-20

Como estudiante, quiero borrar mi cuenta, para que no quede ningún dato mío en la app.

- Dado que pulso "Borrar cuenta", cuando confirmo con mi contraseña, entonces se borran mi cuenta y todos mis datos y se cierra la sesión.
- Dado que he borrado la cuenta, cuando leo el mensaje final, entonces se me informa de que mis datos desaparecerán de las copias de seguridad en un máximo de 4 semanas.
