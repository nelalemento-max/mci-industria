# Configuración inicial de MCI

## 1. Authentication

1. Abrir Firebase Console > Authentication > Comenzar.
2. Habilitar **Correo electrónico/contraseña**.
3. Crear el usuario administrador con el correo:
   `mci.serviciosbolivia@gmail.com`
4. Definir allí una contraseña inicial segura. La contraseña no debe escribirse en el código ni en GitHub.

## 2. Firestore

1. Abrir Firebase Console > Firestore Database > Crear base de datos.
2. Seleccionar una ubicación cercana y modo producción.
3. Desde Cloud Shell, dentro del repositorio, ejecutar:

```bash
npm install
npm run deploy
```

Este comando publica la página y las reglas de seguridad de Firestore.

## 3. Primer ingreso

1. Abrir la página de MCI.
2. Pulsar **Iniciar sesión**.
3. Ingresar con el correo administrador y la contraseña creada en Firebase.
4. Desde **Usuarios**, crear las cuentas autorizadas y elegir sus servicios.
5. Desde **Datos y servicios**, publicar los valores que verán los clientes.

## 4. Android

El flujo de GitHub Actions `Publicar APK Android` genera el APK instalable y lo publica en:

`https://github.com/nelalemento-max/mci-industria/releases/download/android-latest/MCI-Industria.apk`
