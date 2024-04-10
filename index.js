const bcrypt = require("bcrypt");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql");
const uuid = require("uuid");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const { random } = require("lodash");
const setTimeout = require("timers").setTimeout;

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

let conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "views")));

app.listen(process.env.PORT, function () {
  console.log("Servidor activo: ", process.env.PORT);
});

const transporter = nodemailer.createTransport({
  host: "smtp.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "service@regimed.org",
    pass: "Ori-regimed.3312!",
  },
});

function generarToken(payload) {
  return jwt.sign(payload, "secreto", {
    expiresIn: "15m",
    issuer: "regimed.org",
  });
}

function enviarCorreoVerificacion(correo, token) {
  const mailOptions = {
    from: "service@regimed.org",
    to: correo,
    subject: "Verifica tu dirección de correo electrónico",
    html: `
    <!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

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
  res.render("index");
});

app.get("/registro", (req, res) => {
  if (!req.session.formData) {
    req.session.formData = {};
  }
  res.render("registro", { formData: req.session.formData });
});

app.get("/principal", (req, res) => {
  if (!req.session.idUsuario) {
    res.redirect("/");
  } else {
    const buscar =
      "SELECT * FROM datos_personales WHERE usuario_id = '" +
      req.session.idUsuario +
      "'";

    conexion.query(buscar, (err, row) => {
      if (err) {
        throw err;
      } else {
        if (row && row.length > 0) {
          const nombre = row[0].nombre;
          const curp = row[0].curp;
          const imagen = row[0].imagen ? row[0].imagen : "Usuario.png";
          const telefono = row[0].telefono;
          var nacimiento = row[0].fecha_nac;
          if (nacimiento !== "0000-00-00") {
            const fechaNacimiento = new Date(nacimiento);
            nacimiento = fechaNacimiento.toISOString().split("T")[0];
          }
          const peso = row[0].peso;
          const estatura = row[0].estatura;
          const sexo = row[0].sexo;
          const nacionalidad = row[0].nacionalidad;
          const sangre = row[0].tipo_sangre;

          res.render("principal", {
            nombre: nombre,
            curp: curp,
            imagenAMostrar: imagen,
            telefono: telefono,
            nacimiento: nacimiento,
            peso: peso,
            estatura: estatura,
            sexo: sexo,
            nacionalidad: nacionalidad,
            sangre: sangre,
          });
        } else {
          const nombre = "";
          const curp = "";
          const imagenAMostrar = "";
          const telefono = "";
          const nacimiento = "";
          const peso = "";
          const estatura = "";
          const sexo = "";
          const nacionalidad = "";
          const sangre = "";
          res.render("principal", {
            nombre: nombre,
            curp: curp,
            imagenAMostrar: imagenAMostrar,
            telefono: telefono,
            nacimiento: nacimiento,
            peso: peso,
            estatura: estatura,
            sexo: sexo,
            nacionalidad: nacionalidad,
            sangre: sangre,
          });
        }
      }
    });
  }
});

app.get("/acceso", (req, res) => {
  if (!req.session.correo) {
    req.session.correo = "";
  }
  res.render("acceso", { correo: req.session.correo });
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

app.get("/verificacion/:correo", (req, res) => {
  res.render("verificacion", { correo: req.params.correo });
});

app.get("/verificar_correo", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", function (err, decoded) {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      console.log("Token válido. Usuario verificado:", decoded.usuario_id);

      const moverUsuarioVerificado =
        "INSERT INTO registro_usuario SELECT * FROM usuarios_no_registrados WHERE usuario_id = '" +
        decoded.usuario_id +
        "';";

      const eliminarUsuarioNoVerificado =
        "DELETE FROM usuarios_no_registrados WHERE usuario_id = '" +
        decoded.usuario_id +
        "'";

      const consultarDatos =
        "SELECT * FROM registro_usuario WHERE usuario_id = '" +
        decoded.usuario_id +
        "';";

      conexion.query(moverUsuarioVerificado, function (err) {
        if (err) {
          console.error("Error al mover usuario verificado: ", err);
          res.send("Error al mover usuario verificado");
        } else {
          conexion.query(consultarDatos, (err, rows) => {
            if (err) {
              throw err;
            } else {
              const ingresarNombreUsuario = `INSERT INTO datos_personales (nombre, curp, usuario_id, fecha_nac, estatura, peso, sexo, tipo_sangre, telefono, nacionalidad, imagen) VALUES ('${rows[0].nombre} ${rows[0].apellido_paterno} ${rows[0].apellido_materno}', '', '${decoded.usuario_id}', '0000-00-00', 0, 0, '', '', '', '', '')`;

              conexion.query(ingresarNombreUsuario, (err) => {
                if (err) {
                  console.error("Error al ingresar datos del usuario: ", err);
                  res.send("Error al ingresar datos del usuario");
                } else {
                  conexion.query(eliminarUsuarioNoVerificado, function (err) {
                    if (err) {
                      console.error(
                        "Error al eliminar usuario no verificado: ",
                        err
                      );
                      res.send("Error al eliminar usuario no verificado");
                    } else {
                      req.session.idUsuario = decoded.usuario_id;
                      res.redirect("/principal");
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.get("/generarTokenRegistro", (req, res) => {
  const numeroAleatorio = random(111111, 999999);
  const token = process.env.URL_AGREGAR_REGISTRO + generarToken({
    usuarioId: req.session.idUsuario,
    numero: numeroAleatorio,
  });
  const tiempoActual = new Date();

  const consulta = `SELECT * FROM codigos_temporales WHERE usuario_id = '${req.session.idUsuario}'`;

  conexion.query(consulta, (err, row) => {
    if (err) {
      throw err;
    } else if (row.length === 0) {
      const ingreso = `INSERT INTO codigos_temporales (usuario_id, codigo, hora_registro) VALUES ('${req.session.idUsuario}', '${numeroAleatorio}', NOW())`;

      conexion.query(ingreso, (err, row) => {
        if (err) {
          throw err;
        } else {
          res.json({ token });
          const tiempoEspera = 15 * 60 * 1000;
          setTimeout(() => {
            const borrado = `DELETE FROM codigos_temporales WHERE usuario_id = '${req.session.idUsuario}' AND codigo = '${numeroAleatorio}'`;
            conexion.query(borrado);
          }, tiempoEspera);
        }
      });
    } else {
      const tiempoAnterior = new Date(row[0].hora_registro);
      const tiempoRestante = Math.round((Math.round(tiempoAnterior) - (Math.round(tiempoActual) - 20000))/ 1000);

      const token = generarToken({
        usuarioId: row[0].usuario_id,
        numero: row[0].codigo,
      });
      res.json({ token, tiempoRestante });
    }
  });
});

app.get("/agregarRegistro", (req, res) => {
  const token = req.query.token;

  jwt.verify(token, "secreto", function (err, decoded) {
    if (err) {
      console.log("Token inválido");
      res.send("Token inválido");
    } else {
      const consulta = `SELECT * FROM codigos_temporales WHERE usuario_id = '${decoded.usuarioId}' AND codigo = '${decoded.numero}'`;

      conexion.query(consulta, (err, row) => {
        if (err) {
          throw err;
        } else if (row.length === 0) {
          res.send("Token inválido");
        } else {
          console.log(
            "Aqui tienes que guardar los registros para que tengan relacion"
          );
        }
      });
    }
  });
});

// * -------------------------- POSTS -------------------------- * //

app.post("/acceso", (req, res) => {
  const datos = req.body;

  const correo = datos.correo.trim();
  const contrasenia = datos.contrasenia.trim();

  const hashCorreo = crypto.createHash("sha256");
  hashCorreo.update(correo);
  const correoHash = hashCorreo.digest("hex");

  const buscar =
    "SELECT * FROM registro_usuario WHERE correo = '" + correoHash + "'";

  conexion.query(buscar, function (err, row) {
    if (err) {
      throw err;
    } else if (correo === "") {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "Por favor, ingrese su correo.",
        errorField: "correo",
        correo: req.session.correo,
      });
    } else if (contrasenia === "") {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "Por favor, ingresa la contraseña.",
        errorField: "contrasenia",
        correo: req.session.correo,
      });
    } else if (row.length === 0) {
      req.session.correo = correo;
      return res.render("acceso", {
        error: "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
        errorField: "noRes",
        correo: req.session.correo,
      });
    } else {
      bcrypt.compare(contrasenia, row[0].contrasenia, function (err, result) {
        if (!result) {
          req.session.correo = correo;
          return res.render("acceso", {
            error:
              "El correo o la contraseña es incorrecta. Inténtelo de nuevo.",
            errorField: "noRes",
            correo: req.session.correo,
          });
        } else {
          req.session.idUsuario = row[0].usuario_id;
          res.redirect("/principal");
        }
      });
    }
  });
});

app.post("/registro", (req, res) => {
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

  const buscar =
    "SELECT * FROM registro_usuario WHERE correo = '" + correoHash + "'";

  conexion.query(buscar, function (err, row) {
    if (err) {
      throw err;
    } else if (row.length > 0) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El correo ya está registrado.",
        errorField: "correo",
        formData: req.session.formData,
      });
    } else if (nombre === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su nombre.",
        errorField: "nombre",
        formData: req.session.formData,
      });
    } else if (!formatoNombre.test(nombre)) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El nombre solo debe contener letras y espacios.",
        errorField: "nombre",
        formData: req.session.formData,
      });
    } else if (apellido_paterno === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su apellido paterno.",
        errorField: "apellido_paterno",
        formData: req.session.formData,
      });
    } else if (apellido_materno === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su apellido materno.",
        errorField: "apellido_materno",
        formData: req.session.formData,
      });
    } else if (
      !formatoNombre.test(apellido_paterno) ||
      !formatoNombre.test(apellido_materno)
    ) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Los apellidos solo debe contener letras y espacios.",
        errorField: "apellido_paterno",
        formData: req.session.formData,
      });
    } else if (correo === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingrese su correo.",
        errorField: "correo",
        formData: req.session.formData,
      });
    } else if (!formatoCorreo) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "El correo ingresado no tiene un formato válido.",
        errorField: "correo",
        formData: req.session.formData,
      });
    } else if (contrasenia === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingresa una contraseña",
        errorField: "contrasenia",
        formData: req.session.formData,
      });
    } else if (
      contrasenia.length < longMinContraseña ||
      contrasenia.length > longMaxContraseña
    ) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error:
          "La contraseña debe tener entre " +
          longMinContraseña +
          " y " +
          longMaxContraseña +
          " caracteres.",
        errorField: "contrasenia",
        formData: req.session.formData,
      });
    } else if (!passWithMay || !passWithMin || !passWithEsp) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error:
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un carácter especial.",
        errorField: "contrasenia",
        formData: req.session.formData,
      });
    } else if (conf_contrasenia === "") {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Por favor, ingresa nuevamente la contraseña",
        errorField: "conf_contrasenia",
        formData: req.session.formData,
      });
    } else if (contrasenia !== conf_contrasenia) {
      guardarDatosFormulario(req);
      return res.render("registro", {
        error: "Las contraseñas no coinciden.",
        errorField: "dif_Contrasenia",
        formData: req.session.formData,
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
            usuario_id: uuidHash
          });

          enviarCorreoVerificacion(correo, token);

          const guardarNoVerificado =
            "INSERT INTO usuarios_no_registrados (usuario_id, nombre, apellido_paterno, apellido_materno, correo, contrasenia) VALUES ('" +
            uuidHash +
            "', '" +
            nombre +
            "', '" +
            apellido_paterno +
            "', '" +
            apellido_materno +
            "', '" +
            correoHash +
            "', '" +
            contraseniaHash +
            "')";

          conexion.query(guardarNoVerificado, function (err) {
            if (err) {
              throw err;
            } else {
              res.redirect("/verificacion/" + correo);
            }
          });
        }
      });
    }
  });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "views/img/users");
  },
  filename: function (req, file, cb) {
    // Obtener la extensión del archivo original
    const extension = file.originalname.split(".").pop();
    // Generar un nuevo nombre para el archivo que incluya la extensión
    const nuevoNombre = `${Date.now()}_${req.session.idUsuario.slice(
      -5
    )}.${extension}`;
    cb(null, nuevoNombre);
  },
});

const upload = multer({ storage: storage });

app.post("/datosPersonales", upload.single("imagen"), (req, res) => {
  const datos = req.body;

  const nombre = datos.nombre;
  const curp = datos.curp;
  const telefono = datos.telefono;
  const nacimiento = datos.nacimiento ? datos.nacimiento : "0000-00-00";
  const peso = datos.peso ? datos.peso : 0;
  const nacionalidad = datos.nacionalidad;
  const estatura = datos.estatura ? datos.estatura / 100 : 0;
  const sexo = datos.sexo;
  const sangre = datos.sangre;
  const imagen = req.file ? req.file.filename : datos.imagen;
  const imagenGuardada = datos.imagenGuardada;

  if (imagenGuardada !== "Usuario.png" && imagenGuardada !== imagen) {
    fs.unlink("views/img/users/" + imagenGuardada, (err) => {
      if (err) {
        // Manejar el error aquí
        console.error("Error al eliminar el archivo:", err);
      } else {
        console.log("Archivo eliminado exitosamente");
      }
    });
  }

  console.log(imagen);
  console.log(imagenGuardada);

  const buscar = `SELECT * FROM datos_personales WHERE usuario_id = '${req.session.idUsuario}'`;

  conexion.query(buscar, (err, rows) => {
    if (err) {
      throw err;
    } else {
      const actualizar = `UPDATE datos_personales
      SET nombre = '${nombre}', 
          curp = '${curp}', 
          telefono = '${telefono}', 
          fecha_nac = '${nacimiento}', 
          peso = '${peso}', 
          estatura = '${estatura}', 
          sexo = '${sexo}', 
          nacionalidad = '${nacionalidad}', 
          tipo_sangre = '${sangre}', 
          imagen = '${imagen}'
      WHERE usuario_id = '${req.session.idUsuario}'`;

      conexion.query(actualizar, (err, rows) => {
        if (err) {
          throw err;
        } else {
          // res.redirect("/principal");
        }
      });
    }
  });
});