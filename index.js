const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const path = require("path");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { random } = require("lodash");
const setTimeout = require("timers").setTimeout;
const fetch = require("node-fetch");
const { PDFDocument, rgb } = require("pdf-lib");
const qr = require("qrcode");
const twilio = require("twilio");
const bodyParser = require("body-parser");
const sharp = require("sharp");

const userService = require("./services/user-service");
const doctorService = require("./services/doctor-service");
const patientService = require("./services/patient-service");
const sharedService = require("./services/shared-service");

const app = express();

dotenv.config();

function generarClaveSecreta() {
  return crypto.randomBytes(32).toString("hex");
}

const claveSecreta = generarClaveSecreta();

app.use(
  session({
    secret: claveSecreta,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "src", "public")));

app.listen(process.env.DB_PORT, function () {
  console.log("Servidor activo: " + process.env.DB_PORT);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "service.regimed@gmail.com",
    pass: "hgjf ssaq kbvo wxwc",
  },
});

function generarToken(payload) {
  return jwt.sign(payload, "secreto", {
    expiresIn: "15m",
    issuer: "regimed.life",
  });
}

function generarToken3m(payload) {
  return jwt.sign(payload, "secreto", {
    expiresIn: "3m",
    issuer: "regimed.life",
  });
}

function generarTokenMedico(payload) {
  return jwt.sign(payload, "secreto", {
    issuer: "regimed.life",
  });
}

function enviarCorreoVerificacion(correo, token) {
  const mailOptions = {
    from: "service@regimed.life",
    to: correo,
    subject: "Verifica tu dirección de correo electrónico",
    html: `
    <!doctype html>
<html lang="en" xmlns="http://www.w3.life/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
<meta charset="utf-8" />
<meta content="width=device-width" name="viewport" />
<meta content="IE=edge" http-equiv="X-UA-Compatible" />
<meta name="x-apple-disable-message-reformatting" />
<meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
<title>Frame 27</title>
<!--[if mso]>
            <style>
                * {
                    font-family: sans-serif !important;
                }
            </style>
        <![endif]-->
<!--[if !mso]><!-->
<!-- <![endif]-->
<link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:600" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Roboto:700" rel="stylesheet" type="text/css">
<link href="https://fonts.googleapis.com/css?family=Inter:400" rel="stylesheet" type="text/css">
<style>
html {
    margin: 0 !important;
    padding: 0 !important;
}

* {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}
td {
    vertical-align: top;
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
}
a {
    text-decoration: none;
}
img {
    -ms-interpolation-mode:bicubic;
}
@media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
    u ~ div .email-container {
        min-width: 320px !important;
    }
}
@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
    u ~ div .email-container {
        min-width: 375px !important;
    }
}
@media only screen and (min-device-width: 414px) {
    u ~ div .email-container {
        min-width: 414px !important;
    }
}

</style>
<!--[if gte mso 9]>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
<style>
@media only screen and (max-device-width: 699px), only screen and (max-width: 699px) {

    .eh {
        height:auto !important;
    }
    .desktop {
        display: none !important;
        height: 0 !important;
        margin: 0 !important;
        max-height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        visibility: hidden !important;
        width: 0 !important;
    }
    .mobile {
        display: block !important;
        width: auto !important;
        height: auto !important;
        float: none !important;
    }
    .email-container {
        width: 100% !important;
        margin: auto !important;
    }
    .stack-column,
    .stack-column-center {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        direction: ltr !important;
    }
    .wid-auto {
        width:auto !important;
    }

    .table-w-full-mobile {
        width: 100%;
    }

    .text-44268512 {font-size:24px !important;}
    

    .mobile-center {
        text-align: center;
    }

    .mobile-center > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-left {
        text-align: left;
    }

    .mobile-left > table {
        display: inline-block;
        vertical-align: inherit;
    }

    .mobile-right {
        text-align: right;
    }

    .mobile-right > table {
        display: inline-block;
        vertical-align: inherit;
    }

}

</style>
</head>

<body width="100%" style="background-color:#f5f5f5;margin:0;padding:0!important;mso-line-height-rule:exactly;">
<div style="background-color:#f5f5f5">
<!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f5f5f5"/>
                </v:background>
                <![endif]-->
<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td valign="top" align="center">
<table bgcolor="#ffffff" style="margin:0 auto;" align="center" id="brick_container" cellspacing="0" cellpadding="0" border="0" width="700" class="email-container">
<tr>
<td width="700">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="680" align="center" style="vertical-align: middle; background-color:#254271;   padding-left:10px; padding-right:10px;" bgcolor="#254271">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
<tr>
<td style="vertical-align: middle;" align="center">
<div style="line-height:normal;text-align:left;"><span style="color:#ffffff;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Una vida al alcance de tus manos.</span></div>
</td>
</tr>
<tr>
<td height="10" style="height:10px; min-height:10px; line-height:10px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="700">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="600" align="center" style="background-color:#ddecf1;   padding-left:50px; padding-right:50px;" bgcolor="#ddecf1">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td align="center">
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="156" align="center"><img src="https://plugin.markaimg.com/public/e2c7dcce/EClUR6HHWTsAdXX5cEsNnb3m8zqJjN.png" width="156" border="0" style="min-width:156px; width:156px;
         height: auto; display: block;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td width="100%" style="background-color:#ffffff; border-radius:20px;  padding-left:30px; padding-right:30px;" bgcolor="#ffffff">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span class="text-44268512" style="color:#254271;font-weight:600;font-family:Roboto,Arial,sans-serif;font-size:24px;line-height:normal;text-align:left;">Verifica tu dirección de email</span></div>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Haz clic en el botón de abajo para verificar tu dirección de email.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="100%" style="vertical-align: middle; height:45px;  ">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td>
<table cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="vertical-align: middle;">
<div>
<!--[if mso]>
                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:45px;v-text-anchor:middle;width:147px;" fillcolor="#00a3ff"  stroke="f" >
                        <w:anchorlock/>
                        <center style="white-space:nowrap;display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;">Verificar email</center>
                        </v:roundrect>
                    <![endif]-->
<a href="${
      process.env.URL_TOKEN + token
    }" style="white-space:nowrap;background-color:#00a3ff; display:inline-block;text-align:center;color:#ffffff;font-weight:700;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:45px;width:147px; -webkit-text-size-adjust:none;mso-hide:all;box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.0430000014603138);">Verificar email</a>
</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Por favor, asegúrate de no compartir nunca este código con nadie.</span></div>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td>
<div style="line-height:normal;text-align:left;"><span style="color:#254271;font-weight:700;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;">Nota:</span><span style="color:#254271;font-family:Roboto,Arial,sans-serif;font-size:14px;line-height:normal;text-align:left;"> El enlace es válido durante 30 minutos</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="50" style="height:50px; min-height:50px; line-height:50px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="30" style="height:30px; min-height:30px; line-height:30px;"></td>
</tr>
<tr>
<td width="100%" align="center">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td width="100%" style="vertical-align: middle;   padding-left:30px; padding-right:30px;">
<table border="0" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align: middle;" width="40"><img src="https://plugin.markaimg.com/public/e2c7dcce/sNBppuo83WQNGCv9RKXt7fzhR75GD9.png" width="40" border="0" style="min-width:40px; width:40px;
         height: auto; display: block;"></td>
</tr>
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
</table>
</td>
</tr>
<tr>
<td width="100%" style="  padding-left:30px; padding-right:30px;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td style=" border-width: 1px 0px 0px 0px; border-color:#004073; border-style:solid;">
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
<td height="15" style="height:15px; min-height:15px; line-height:15px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Has recibido este email porque estás registrado en Regimed. Si tu no registraste este email, haz caso omiso a este mensaje.</span></div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="20" style="height:20px; min-height:20px; line-height:20px;"></td>
</tr>
<tr>
<td width="540">
<div style="line-height:normal;text-align:left;"><span style="color:#004073;font-family:Inter,Arial,sans-serif;font-size:12px;line-height:normal;text-align:left;">Gracias,<br>El equipo de Regimed</span></div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td height="40" style="height:40px; min-height:40px; line-height:40px;"></td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</div>
</body>

</html>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error al enviar el correo electrónico de verificación:",
        error
      );
    } else {
      console.log("Correo electrónico de verificación enviado:", info.response);
    }
  });
}

// * -------------------------- GETS -------------------------- * //

app.get("/", (req, res) => {
  res.render("home/index", {
    sesion: req.session.idUsuario,
  });
});

app.get("/registro", (req, res) => {
  if (!req.session.formData) {
    req.session.formData = {};
  }
  res.render("auth/registro", {
    formData: req.session.formData,
    sesion: req.session.idUsuario,
  });
});

app.get("/perfil", async (req, res) => {
  try {
    if (req.session.idDoctor) {
      return res.redirect("/doctor");
    } else if (!req.session.idUsuario) {
      return res.redirect("/");
    }

    const [datosUsuario, registrosCompartidos, vacunas, consultas, estudios, historial] = await Promise.all([
      userService.consultarUsuario(req.session.idUsuario),
      sharedService.consultarCompartidos(req.session.idUsuario),
      patientService.consultarVacunas(req.session.idUsuario),
      patientService.consultarConsultas(req.session.idUsuario),
      patientService.consultarEstudios(req.session.idUsuario),
      patientService.consultarHistorial(req.session.idUsuario),
    ]);

    console.log(vacunas)

    const telefonoVerificado = await sharedService.consultarVerificado(
      datosUsuario.telefono
    );

    res.render("perfil/perfil", {
      nombre_comp: datosUsuario.nombre_comp,
      curp: datosUsuario.curp,
      imagenAMostrar: datosUsuario.imagen,
      telefono: datosUsuario.telefono,
      nacimiento: datosUsuario.nacimiento,
      peso: datosUsuario.peso,
      estatura: datosUsuario.estatura,
      sexo: datosUsuario.sexo,
      nacionalidad: datosUsuario.nacionalidad,
      sangre: datosUsuario.sangre,
      registros: registrosCompartidos,
      sesion: req.session.idUsuario,
      telefonoVerificado: telefonoVerificado,
      vacunas: vacunas,
      consultas: consultas,
      estudios: estudios,
      historial: historial[0],
      captcha_web: process.env.CAPTCHA_WEB,
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.use(
  session({
    secret: claveSecreta,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/paciente/:curp", async (req, res) => {
  if (!req.session.idDoctor || req.session.curpPaciente !== req.params.curp) {
    return res.redirect("/");
  }
  try {
    const datosUsuario = await userService.consultarUsuarioPorCurp(
      req.params.curp
    );

    const [vacunas, consultas, estudios, historial] = await Promise.all([
      patientService.consultarVacunas(datosUsuario.usuario_id),
      patientService.consultarConsultas(datosUsuario.usuario_id),
      patientService.consultarEstudios(datosUsuario.usuario_id),
      patientService.consultarHistorial(datosUsuario.usuario_id),
    ]);

    req.session.idPaciente = datosUsuario.usuario_id;

    res.render("paciente/paciente", {
      nombre_comp: datosUsuario.nombre_comp,
      curp: req.params.curp,
      imagenAMostrar: datosUsuario.imagen,
      telefono: datosUsuario.telefono,
      nacimiento: datosUsuario.nacimiento,
      peso: datosUsuario.peso,
      estatura: datosUsuario.estatura,
      sexo: datosUsuario.sexo,
      nacionalidad: datosUsuario.nacionalidad,
      sangre: datosUsuario.sangre,
      vacunas: vacunas,
      consultas: consultas,
      estudios: estudios,
      historial: historial[0]
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/usuario/:usuario_id", async (req, res) => {
  try {
    if (!req.session.correo) {
      req.session.correo = "";
    }

    const [datosUsuario, vacunas, consultas, estudios, historial] = await Promise.all([
      userService.consultarUsuario(req.params.usuario_id),
      patientService.consultarVacunas(req.params.usuario_id),
      patientService.consultarConsultas(req.params.usuario_id),
      patientService.consultarEstudios(req.params.usuario_id),
      patientService.consultarHistorial(req.params.usuario_id),
    ]);

    res.render("visor/visor", {
      sesion: req.session.correo,
      nombre_comp: datosUsuario.nombre_comp,
      curp: datosUsuario.curp,
      imagenAMostrar: datosUsuario.imagen,
      telefono: datosUsuario.telefono,
      nacimiento: datosUsuario.nacimiento,
      peso: datosUsuario.peso,
      estatura: datosUsuario.estatura,
      sexo: datosUsuario.sexo,
      nacionalidad: datosUsuario.nacionalidad,
      sangre: datosUsuario.sangre,
      vacunas: vacunas,
      consultas: consultas,
      estudios: estudios,
      historial: historial[0]
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/acceso", (req, res) => {
  if (!req.session.correo) {
    req.session.correo = "";
  }
  res.render("auth/acceso", {
    correo: req.session.correo,
    sesion: req.session.idUsuario,
  });
});

app.get("/doctor", async (req, res) => {
  try {
    if (req.session.idUsuario && !req.session.idDoctor) {
      return res.redirect("/perfil");
    }
    if (!req.session.idUsuario) {
      return res.redirect("/");
    }

    const [datosUsuario, registrosCompartidos, vacunas, consultas, estudios, historial] = await Promise.all([
      userService.consultarUsuario(req.session.idUsuario),
      sharedService.consultarCompartidos(req.session.idUsuario),
      patientService.consultarVacunas(req.session.idUsuario),
      patientService.consultarConsultas(req.session.idUsuario),
      patientService.consultarEstudios(req.session.idUsuario),
      patientService.consultarHistorial(req.session.idUsuario),
    ]);

    const telefonoVerificado = await sharedService.consultarVerificado(
      datosUsuario.telefono
    );

    res.render("doctor/doctor", {
      nombre_comp: datosUsuario.nombre_comp,
      curp: datosUsuario.curp,
      imagenAMostrar: datosUsuario.imagen,
      telefono: datosUsuario.telefono,
      nacimiento: datosUsuario.nacimiento,
      peso: datosUsuario.peso,
      estatura: datosUsuario.estatura,
      sexo: datosUsuario.sexo,
      nacionalidad: datosUsuario.nacionalidad,
      sangre: datosUsuario.sangre,
      registros: registrosCompartidos,
      sesion: req.session.idUsuario,
      doctor: req.session.idDoctor,
      telefonoVerificado: telefonoVerificado,
      vacunas: vacunas,
      consultas: consultas,
      estudios: estudios,
      historial: historial[0],
      captcha_web: process.env.CAPTCHA_WEB,
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/cerrarSesion", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/verificacion/usuario/:correo", (req, res) => {
  res.render("auth/verificacion", {
    correo: req.params.correo,
    sesion: req.session.idUsuario,
  });
});

app.get("/verificar_correo", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", async (err, decoded) => {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const usuario = await userService.consultarUsuarioPorCorreo(
        decoded.correo
      );

      if (usuario.length === 0) {
        const nombre_comp =
          decoded.nombre +
          " " +
          decoded.apellido_paterno +
          " " +
          decoded.apellido_materno;

        await userService.registrarUsuario(
          decoded.usuario_id,
          nombre_comp,
          decoded.nombre,
          decoded.apellido_paterno,
          decoded.apellido_materno,
          decoded.correo,
          decoded.contrasenia
        );

        req.session.idUsuario = decoded.usuario_id;
        res.redirect("/perfil");
      } else {
        req.session.idUsuario = usuario[0].usuario_id;
        res.redirect("/perfil");
      }
    }
  });
});

app.get("/verificar_doctor", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", (err, decoded) => {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const consulta = `SELECT * FROM doctor WHERE usuario_id = '${decoded.usuario_id}'`;

      conexion.query(consulta, (err, rows) => {
        if (err) {
          throw err;
        } else {
          if (rows.length === 0) {
            const insertarDoctor = `INSERT INTO doctor (doctor_id, nombre, cedula, especialidad, usuario_id) VALUES ('${decoded.doctor_id}', '${decoded.nombre}', '${decoded.cedula}', '${decoded.especialidad}', '${decoded.usuario_id}')`;

            conexion.query(insertarDoctor);
            res.send("Doctor verificado");
          } else {
            res.send("Doctor ya verificado");
          }
        }
      });
    }
  });
});

app.get("/generarTokenRegistro", (req, res) => {
  generarNumeroAleatorioUnico(req, res);
});

async function generarNumeroAleatorioUnico(req, res) {
  const numeroAleatorio = random(100000, 999999);
  const tiempoActual = new Date();

  const consultaCodigo = await sharedService.consultarCodigo(
    req.session.idUsuario
  );

  if (consultaCodigo.length !== 0) {
    const tiempoAnterior = new Date(consultaCodigo[0].hora_registro);
    const tiempoRestante = Math.round(
      (Math.round(tiempoAnterior) - (Math.round(tiempoActual) - 180000)) / 1000
    );

    const numeroAleatorio = consultaCodigo[0].codigo;

    console.log("numeroAleatorio: " + numeroAleatorio);
    console.log("tiempoRestante: " + tiempoRestante);

    const token =
      process.env.URL_AGREGAR_REGISTRO +
      generarToken3m({
        usuarioId: consultaCodigo[0].usuario_id,
        numero: consultaCodigo[0].codigo,
      });

    res.json({ token, numeroAleatorio, tiempoRestante });
  } else {
    const codigoExistente = await sharedService.consultarCodigoExistente(
      numeroAleatorio
    );

    console.log("Existe 2: " + codigoExistente.length);

    if (codigoExistente.length === 0) {
      await sharedService.registrarCodigo(
        req.session.idUsuario,
        numeroAleatorio
      );

      const token =
        process.env.URL_AGREGAR_REGISTRO +
        generarToken3m({
          usuarioId: req.session.idUsuario,
          numero: numeroAleatorio,
        });

      res.json({ token, numeroAleatorio });
      const tiempoEspera = 3 * 60 * 1000;
      setTimeout(async () => {
        await sharedService.eliminarCodigo(req.session.idUsuario);
        console.log("Borrado: " + numeroAleatorio);
      }, tiempoEspera);
    } else {
      generarNumeroAleatorioUnico(req, res);
    }
  }
}

// app.get("/agregarRegistro", (req, res) => {
//   const token = req.query.token;

//   jwt.verify(token, "secreto", function (err, decoded) {
//     if (err) {
//       console.log("Token inválido");
//       res.send("Token inválido");
//     } else {
//       const consulta = `SELECT * FROM codigos_temporales WHERE usuario_id = '${decoded.usuarioId}' AND codigo = '${decoded.numero}'`;

//       conexion.query(consulta, (err, row) => {
//         if (err) {
//           throw err;
//         } else if (row.length === 0) {
//           res.send("Token inválido");
//         } else {
//           console.log(
//             "Aqui tienes que guardar los registros para que tengan relacion"
//           );
//         }
//       });
//     }
//   });
// });

app.get("/tarjeta", async (req, res) => {
  if (!req.session.idUsuario) {
    return res.redirect("/");
  }

  try {
    const datosUsuario = await userService.consultarUsuario(
      req.session.idUsuario
    );

    const existingPdfBytes = fs.readFileSync(
      path.join(__dirname, "src", "public", "pdf", "tarjeta.pdf")
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const qrData = process.env.URL_QRTARJETA + req.session.idUsuario;
    const qrWidth = 130;
    const qrHeight = 130;
    const qrOptions = {
      color: {
        width: qrWidth,
        height: qrHeight,
        dark: "#1d4370",
        light: "#ffffff00",
      },
    };

    const qrImageBytes = await new Promise((resolve, reject) => {
      qr.toBuffer(qrData, qrOptions, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });

    const qrImage = await pdfDoc.embedPng(qrImageBytes);
    const posicionQRX = page.getWidth() - page.getWidth() / 4 - qrWidth / 2;
    page.drawImage(qrImage, {
      x: posicionQRX,
      y: 77,
      width: qrWidth,
      height: qrHeight,
    });

    await agregarImagen(
      page,
      path.join(
        __dirname,
        "src",
        "public",
        "images",
        "users",
        datosUsuario.imagen
      ),
      0,
      pdfDoc
    );

    const hel = await cargarFuente("Helvetica", pdfDoc);
    const helBold = await cargarFuente("Helvetica-Bold", pdfDoc);

    const apellidos = `${datosUsuario.apellido_paterno} ${datosUsuario.apellido_materno}`;
    const nombres = datosUsuario.nombre;

    agregarTexto(page, nombres, 16, helBold, 90);
    agregarTexto(page, apellidos, 12, hel, 75);
    agregarTexto(page, "CURP: ", 7, helBold, 50, 7);
    agregarTexto(page, datosUsuario.curp, 7, hel, 50, 32);
    agregarTexto(page, "T/S: ", 7, helBold, 40, 7);
    agregarTexto(page, datosUsuario.sangre, 7, hel, 40, 22);

    const modifiedPdfBytes = await pdfDoc.save();
    const outputFilePath = path.join(
      __dirname,
      "src",
      "public",
      "temp",
      "tarjeta.pdf"
    );
    fs.writeFileSync(outputFilePath, modifiedPdfBytes);

    res.contentType("application/pdf");
    res.sendFile(outputFilePath);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).send("Error al generar el PDF: " + error.message);
  }
});

async function cargarFuente(font, pdfDoc) {
  try {
    return await pdfDoc.embedFont(font);
  } catch (error) {
    console.error("Error al cargar la fuente:", error);
    throw error;
  }
}

function calcularPosicionTexto(page, text, fontSize, font) {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  return page.getWidth() / 4 - textWidth / 2;
}

function agregarTexto(page, text, fontSize, font, y, xValue) {
  const x =
    xValue !== undefined
      ? xValue
      : calcularPosicionTexto(page, text, fontSize, font);
  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(4 / 255, 68 / 255, 115 / 255),
    weight: "600",
  });
}

async function recortarImagen(imagePath, outputImagePath, size) {
  try {
    await sharp(imagePath).resize(size, size).toFile(outputImagePath);
  } catch (error) {
    console.error("Error al recortar la imagen:", error);
    throw error;
  }
}

async function agregarImagen(page, imagePath, x, pdfDoc) {
  try {
    const size = page.getWidth() / 2;
    const y = page.getHeight() - size;

    const recortadaImagePath = path.join(
      __dirname,
      "src",
      "public",
      "temp",
      "recortada.png"
    );

    await recortarImagen(imagePath, recortadaImagePath, size);

    const imageBytes = fs.readFileSync(recortadaImagePath);
    const pdfImage = await pdfDoc.embedPng(imageBytes);

    page.drawImage(pdfImage, {
      x,
      y,
      width: size,
      height: size,
    });
  } catch (error) {
    console.error("Error al leer o cargar la imagen:", error);
    throw error;
  }
}

// * -------------------------- POSTS -------------------------- * //

app.post("/acceso", async (req, res) => {
  const datos = req.body;

  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();

  if (correo === "") {
    req.session.correo = correo;
    return res.render("auth/acceso", {
      error: "Por favor, ingrese su correo.",
      errorField: "correo",
      correo: req.session.correo,
      sesion: req.session.idUsuario,
    });
  } else if (contrasenia === "") {
    req.session.correo = correo;
    return res.render("auth/acceso", {
      error: "Por favor, ingresa la contraseña.",
      errorField: "contrasenia",
      correo: req.session.correo,
      sesion: req.session.idUsuario,
    });
  }

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  try {
    const usuario = await userService.consultarUsuarioPorCorreo(correoHash);

    if (!usuario || usuario.length === 0) {
      req.session.correo = correo;
      return res.render("auth/acceso", {
        error: "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
        errorField: "noRes",
        correo: req.session.correo,
        sesion: req.session.idUsuario,
      });
    }

    const match = await bcrypt.compare(contrasenia, usuario[0].contrasenia);

    if (!match) {
      req.session.correo = correo;
      return res.render("auth/acceso", {
        error: "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
        errorField: "noRes",
        correo: req.session.correo,
        sesion: req.session.idUsuario,
      });
    }

    const doctor = await doctorService.consultarDoctor(usuario[0].usuario_id);

    if (doctor && doctor.length > 0) {
      req.session.idDoctor = doctor[0].doctor_id;
    }
    req.session.idUsuario = usuario[0].usuario_id;
    req.session.telefono = usuario[0].telefono;
    res.redirect(doctor && doctor.length > 0 ? "/doctor" : "/perfil");
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

function enviarCorreoVerificacionDoctor(nombre, cedula, especialidad, token) {
  console.log(token);
  const mailOptions = {
    from: "service@regimed.life",
    to: "service@regimed.life",
    subject: "Verificación de Médico",
    html: `
    <p>Se ha recibido un nuevo formulario de registro de médico en la plataforma. A continuación, se detallan los datos proporcionados:</p>
    <ul>
      <li><strong>Nombre del médico:</strong> ${nombre}</li>
      <li><strong>Cédula profesional:</strong> ${cedula}</li>
      <li><strong>Especialidad:</strong> ${especialidad}</li>
    </ul>
    <p>Por favor, revisen estos datos y procedan según corresponda.
    <p><a href="http://regimed.life/verificar_doctor?token=${token}">Verifica aquí</a></p></p>
    <p>Atentamente, Regimed</p>
`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(
        "Error al enviar el correo electrónico de verificación:",
        error
      );
    } else {
      console.log("Correo electrónico de verificación enviado:", info.response);
    }
  });
}

app.post("/registroDoctor/:cedula/:especialidad/:captcha", async (req, res) => {
  const cedula = req.params.cedula;
  const especialidad = req.params.especialidad;

  const verificacionCaptcha = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.params.captcha}`,
    {
      method: "POST",
    }
  ).then((_res) => _res.json());

  if (verificacionCaptcha.success === true) {
    const consulta = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;

    conexion.query(consulta, (err, row) => {
      const nombre = row[0].nombre;

      if (err) {
        throw err;
      } else if (row[0].imagen === "usuario.png") {
        res.json({ medico: "Imagen" });
      } else {
        const uuidGen = uuid.v4();

        const hashUUID = crypto.createHash("sha256");
        hashUUID.update(uuidGen);
        const uuidHash = hashUUID.digest("hex");

        const token = generarTokenMedico({
          usuario_id: req.session.idUsuario,
          doctor_id: uuidHash,
          nombre: nombre,
          cedula: cedula,
          especialidad: especialidad,
        });

        console.log(token);

        enviarCorreoVerificacionDoctor(nombre, cedula, especialidad, token);

        res.json({ medico: "Enviado" });
      }
    });
  }
});

app.post("/registro", async (req, res) => {
  const datos = req.body;

  const nombre = datos.nombre.trim();
  const apellido_paterno = datos.apellido_paterno.trim();
  const apellido_materno = datos.apellido_materno.trim();
  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();
  const conf_contrasenia = datos.conf_contrasenia.trim();

  function guardarDatosFormulario(req) {
    req.session.formData = {
      nombre: nombre,
      apellido_paterno: apellido_paterno,
      apellido_materno: apellido_materno,
      correo: correo,
    };
  }

  const saltRounds = 10;
  const formatoNombre = /^[a-zA-ZÁáÉéÍíÓóÚúÜü\s]*$/;
  const formatoCorreo = /^\S+@\S+\.\S+$/.test(correo);
  const longMinContraseña = 8;
  const longMaxContraseña = 30;
  const passWithMay = /[A-Z]/.test(contrasenia);
  const passWithMin = /[a-z]/.test(contrasenia);
  const passWithEsp = /[$&+,:;=?@#|'<>.^*()%!-]/.test(contrasenia);

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  const usuario = await userService.consultarUsuarioPorCorreo(correoHash);

  if (usuario.length > 0) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "El correo ya está registrado.",
      errorField: "correo",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (nombre === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingrese su nombre.",
      errorField: "nombre",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (!formatoNombre.test(nombre)) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "El nombre solo debe contener letras y espacios.",
      errorField: "nombre",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (apellido_paterno === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingrese su apellido paterno.",
      errorField: "apellido_paterno",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (apellido_materno === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingrese su apellido materno.",
      errorField: "apellido_materno",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (
    !formatoNombre.test(apellido_paterno) ||
    !formatoNombre.test(apellido_materno)
  ) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Los apellidos solo debe contener letras y espacios.",
      errorField: "apellido_paterno",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (correo === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingrese su correo.",
      errorField: "correo",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (!formatoCorreo) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "El correo ingresado no tiene un formato válido.",
      errorField: "correo",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (contrasenia === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingresa una contraseña",
      errorField: "contrasenia",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (
    contrasenia.length < longMinContraseña ||
    contrasenia.length > longMaxContraseña
  ) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error:
        "La contraseña debe tener entre " +
        longMinContraseña +
        " y " +
        longMaxContraseña +
        " caracteres.",
      errorField: "contrasenia",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (!passWithMay || !passWithMin || !passWithEsp) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error:
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un carácter especial.",
      errorField: "contrasenia",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (conf_contrasenia === "") {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Por favor, ingresa nuevamente la contraseña",
      errorField: "conf_contrasenia",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else if (contrasenia !== conf_contrasenia) {
    guardarDatosFormulario(req);
    return res.render("auth/registro", {
      error: "Las contraseñas no coinciden.",
      errorField: "dif_Contrasenia",
      formData: req.session.formData,
      sesion: req.session.idUsuario,
    });
  } else {
    bcrypt.hash(contrasenia, saltRounds, function (err, hash) {
      if (err) {
        console.error("Error al hashear la contraseña: ", err);
      } else {
        const contraseniaHash = hash;
        const uuidGen = uuid.v4();

        const hashUUID = crypto.createHash("sha256");
        hashUUID.update(uuidGen);
        const uuidHash = hashUUID.digest("hex");

        const token = generarToken({
          usuario_id: uuidHash,
          nombre: nombre,
          apellido_paterno: apellido_paterno,
          apellido_materno: apellido_materno,
          correo: correoHash,
          contrasenia: contraseniaHash,
        });

        enviarCorreoVerificacion(correo, token);

        res.redirect("/verificacion/usuario/" + correo);
      }
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "src", "public", "images", "users"));
  },

  filename: function (req, file, cb) {
    // Obtener la extensión del archivo original
    const extension = file.originalname.split(".").pop();
    // Generar un nuevo nombre para el archivo que incluya la extensión
    const nuevoNombre = `${req.session.idUsuario.slice(
      -5
    )}_${Date.now()}.${extension}`;
    cb(null, nuevoNombre);
  },
});

const upload = multer({ storage: storage });

app.post("/datosUsuario", upload.single("imagen"), async (req, res) => {
  const datos = req.body;

  const nombre = datos.nombre;
  const curp = datos.curp;
  const telefono = datos.telefono;
  const nacimiento = datos.nacimiento ? datos.nacimiento : "0000-00-00";
  const peso = datos.peso ? datos.peso : 0;
  const estatura = datos.estatura ? datos.estatura / 100 : 0;
  const sexo = datos.sexo;
  const nacionalidad = datos.nacionalidad;
  const sangre = datos.sangre;
  let imagen = req.file ? req.file.filename : datos.imagen;
  const imagenGuardada = datos.imagenGuardada;

  if (imagenGuardada !== imagen && imagenGuardada !== "usuario.png") {
    fs.unlink(
      path.join(__dirname, "src", "public", "images", "users", imagenGuardada),
      (err) => {
        if (err) {
          console.error("Error al eliminar el archivo:", err);
        } else {
          console.log("Archivo eliminado exitosamente");
        }
      }
    );
  }

  if (telefono !== req.session.telefono) {
    await sharedService.eliminarVerificacion(req.session.idUsuario);
  }

  try {
    await userService.actualizarUsuario(
      req.session.idUsuario,
      nombre,
      curp,
      telefono,
      nacimiento,
      peso,
      estatura,
      sexo,
      nacionalidad,
      sangre,
      imagen
    );
    res.status(200).json({ mensaje: "Datos actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar los datos:", error);
    res.status(500).json({ mensaje: "Error al actualizar los datos" });
  }
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/verificarCurpPaciente/:curpPaciente", async (req, res) => {
  const verificado = await patientService.consultarVerificado(
    req.params.curpPaciente
  );

  try {
    if (verificado.length !== 0) {
      const telefono = verificado[0].telefono;
      const verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_SERVICE)
        .verifications.create({
          to: telefono,
          channel: "sms",
          locale: "es",
        });

      console.log(verificationCheck);
      res.json({ codigo: "Enviado", telefono: telefono });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al enviar la verificación");
  }
});

app.post(
  "/verificarCodigoPaciente/:telefonoPaciente/:codigo/:curpPaciente",
  async (req, res) => {
    const telefono = req.params.telefonoPaciente;
    const codigo = req.params.codigo;
    const curp = req.params.curpPaciente;

    try {
      const verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_SERVICE)
        .verificationChecks.create({ to: telefono, code: codigo });

      console.log(verificationCheck);

      if (verificationCheck.status === "approved") {
        req.session.curpPaciente = curp;
        res.json({ codigo: "Valido", curp: curp });
      } else {
        res.json({ codigo: "Erroneo" });
      }
    } catch (error) {
      res.json({ codigo: "Erroneo" });
    }
  }
);

app.post("/verificarNumeroTelefonico", async (req, res) => {
  const datosUsuario = await userService.consultarUsuario(
    req.session.idUsuario
  );

  let telefono = datosUsuario.telefono.replace(/\s/g, "");

  console.log(telefono);
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verifications.create({
        to: telefono,
        channel: "sms",
        locale: "es",
      });

    console.log(verificationCheck);
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al enviar la verificación");
  }
});

app.post("/verificarCodigoTelefono/:inputCodigo", async (req, res) => {
  const datosUsuario = await userService.consultarUsuario(
    req.session.idUsuario
  );
  const codigo = req.params.inputCodigo;

  const telefono = datosUsuario.telefono.replace(/\s/g, "");

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_SERVICE)
      .verificationChecks.create({ to: telefono, code: codigo });

    console.log(verificationCheck);

    if (verificationCheck.status === "approved") {
      console.log("Valido");
      res.json({ codigo: "Valido" });
      await sharedService.registrarVerificacion(
        req.session.idUsuario,
        telefono
      );
    } else {
      console.log("Invalido");
      res.json({ codigo: "Erroneo" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Hubo un error al verificar el código");
  }
});

app.post("/verificarRegistro/:codigo/:captcha", async (req, res) => {
  const verificacionCaptcha = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.params.captcha}`,
    {
      method: "POST",
    }
  ).then((_res) => _res.json());

  if (verificacionCaptcha.success === true) {
    const consultaCodigo = await sharedService.consultarCodigoExistente(
      req.params.codigo
    );

    console.log(consultaCodigo[0]);
    console.log(consultaCodigo[0].usuario_id);
    console.log(consultaCodigo[0].codigo);

    if (consultaCodigo.length === 0) {
      res.json({ usuario: "Inexistente" });
    } else if (consultaCodigo[0].usuario_id === req.session.idUsuario) {
      res.json({ usuario: "Mismo" });
    } else {
      console.log("Usuario: " + req.session.idUsuario);
      console.log("Doctor : " + consultaCodigo[0].usuario_id);

      const consultarRegistros =
        await sharedService.consultarCompartidoExistente(
          req.session.idUsuario,
          consultaCodigo[0].usuario_id
        );

      if (consultarRegistros.length === 0) {
        await sharedService.registrarCompartido(
          req.session.idUsuario,
          consultaCodigo[0].usuario_id
        );
        await sharedService.registrarCompartido(
          consultaCodigo[0].usuario_id,
          req.session.idUsuario
        );

        await sharedService.eliminarCodigo(req.session.idUsuario);
        await sharedService.eliminarCodigo(consultaCodigo[0].usuario_id);

        res.json({ usuario: "Ingresado" });
      } else {
        res.json({ usuario: "Existente" });
      }
    }
  }
});

app.post("/agregarVacuna", async (req, res) => {
  const datos = req.body;

  const vacunaAplicada = datos.vacunaAplicada || "";
  const fabricante = datos.fabricante || "";
  const numeroLote = datos.numeroLote || "";
  const numeroSerie = datos.numeroSerie || "";
  const fechaAplicacion = datos.fechaAplicacion || "";
  const dosisAdministrada = datos.dosisAdministrada || "";
  const lugarAdministracion = datos.lugarAdministacion || "";

  try {
    await patientService.registrarVacuna(
      req.session.idPaciente,
      req.session.idDoctor,
      vacunaAplicada,
      fabricante,
      numeroLote,
      numeroSerie,
      fechaAplicacion,
      dosisAdministrada,
      lugarAdministracion
    );
    res.status(200).json({ mensaje: "Vacuna agregada correctamente" });
  } catch (error) {
    console.error("Error al agregar la vacuna:", error);
    res.status(500).json({ mensaje: "Error al agregar la vacuna" });
  }
});

app.post("/agregarConsulta", async (req, res) => {
  console.log(req.body);

  const { datosConsulta, medicamentos } = req.body;

  try {
    const idConsulta = await patientService.registrarConsulta(
      req.session.idPaciente,
      req.session.idDoctor,
      datosConsulta.observaciones,
      datosConsulta.pronostico,
      datosConsulta.planTerapeutico
    );

    for (const medicamento of medicamentos) {
      await patientService.registrarMedicamento(
        idConsulta,
        medicamento.medicamento__nombre,
        medicamento.medicamento__viaAdministracion,
        medicamento.medicamento__dosis,
        medicamento.medicamento__frecuencia,
        medicamento.medicamento__duracion
      );
    }
    res.status(200).json({ mensaje: "Consulta agregada correctamente" });
  } catch (error) {
    console.error("Error al agregar la consulta:", error);
    res.status(500).json({ mensaje: "Error al agregar la consulta" });
  }
});

app.post("/agregarEstudio", async (req, res) => {
  console.log(req.body);

  const datos = req.body;

  const tipoEstudio = datos.tipoEstudio;
  const motivoEstudio = datos.motivoEstudio;
  const descripcion = datos.descripcion;
  const resultados = datos.resultados;
  const fechaEstudio = datos.fechaEstudio;

  try {
    await patientService.registrarEstudio(
      req.session.idPaciente,
      req.session.idDoctor,
      tipoEstudio,
      motivoEstudio,
      descripcion,
      resultados,
      fechaEstudio
    );
    res.status(200).json({ mensaje: "Estudio agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar el estudio:", error);
    res.status(500).json({ mensaje: "Error al agregar el estudio" });
  }
});

app.get("/medicamentos/:consultaId", async (req, res) => {
  const idConsulta = req.params.consultaId;

  try {
    const medicamentos = await patientService.consultarMedicamentosYconsultas(
      idConsulta
    );

    res.json(medicamentos);
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/estudio/:estudioId", async (req, res) => {
  const idEstudio = req.params.estudioId;

  try {
    const estudio = await patientService.consultarEstudiosConIdEstudio (
      idEstudio
    );

    res.json(estudio);
  } catch (error) {
    console.error("Error al obtener el estudio:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.post("/editarHistorial", async (req, res) => {
  const datos = req.body;

  const historialMedico = {
    alergias: datos.alergias || "",
    tabaco: datos.tabaco || "",
    alcohol: datos.alcohol || "",
    drogas: datos.drogas || "",
    padecimientos: datos.padecimientos || "",
    medicamentos: datos.medicamentos || "",
    quirurgicos: datos.quirurgicos || "",
    traumatologicos: datos.traumatologicos || "",
    transfusionales: datos.transfusionales || "",
    intoleranciaMedicamentos: datos.intoleranciaMedicamentos || "",
    perPatOtros: datos.perPatOtros || "",
    ejercicio: datos.ejercicio || "",
    suplementos: datos.suplementos || "",
    viajesRecientes: datos.viajesRecientes || "",
    tatuajes: datos.tatuajes || "",
    perforaciones: datos.perforaciones || "",
    perNoPatOtros: datos.perNoPatOtros || "",
    diabetesAbuelos: datos.diabetesAbuelos || "",
    diabetesPadre: datos.diabetesPadre || "",
    diabetesMadre: datos.diabetesMadre || "",
    diabetesHermanos: datos.diabetesHermanos || "",
    nefropatiasAbuelos: datos.nefropatiasAbuelos || "",
    nefropatiasPadre: datos.nefropatiasPadre || "",
    nefropatiasMadre: datos.nefropatiasMadre || "",
    nefropatiasHermanos: datos.nefropatiasHermanos || "",
    mentalesAbuelos: datos.mentalesAbuelos || "",
    mentalesPadre: datos.mentalesPadre || "",
    mentalesMadre: datos.mentalesMadre || "",
    mentalesHermanos: datos.mentalesHermanos || "",
    hipertensionAbuelos: datos.hipertensionAbuelos || "",
    hipertensionPadre: datos.hipertensionPadre || "",
    hipertensionMadre: datos.hipertensionMadre || "",
    hipertensionHermanos: datos.hipertensionHermanos || "",
    oncologicosAbuelos: datos.oncologicosAbuelos || "",
    oncologicosPadre: datos.oncologicosPadre || "",
    oncologicosMadre: datos.oncologicosMadre || "",
    oncologicosHermanos: datos.oncologicosHermanos || "",
    hepatopatiasAbuelos: datos.hepatopatiasAbuelos || "",
    hepatopatiasPadre: datos.hepatopatiasPadre || "",
    hepatopatiasMadre: datos.hepatopatiasMadre || "",
    hepatopatiasHermanos: datos.hepatopatiasHermanos || "",
    heredoOtrosAbuelos: datos.heredoOtrosAbuelos || "",
    heredoOtrosPadre: datos.heredoOtrosPadre || "",
    heredoOtrosMadre: datos.heredoOtrosMadre || "",
    heredoOtrosHermanos: datos.heredoOtrosHermanos || ""
  };

  try {
    await patientService.registrarHistorial(
      req.session.idPaciente,
      req.session.idDoctor,
      historialMedico
    );
    res.status(200).json({ mensaje: "Historial médico actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el historial médico:", error);
    res.status(500).json({ mensaje: "Error al actualizar el historial médico" });
  }
});