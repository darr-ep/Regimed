const { ejecutarConsulta } = require("../config/database");
const { obtenerFechaFormateada } = require("../utils/utils");

async function consultarVerificado(curp) {
  const query = `
  SELECT datos_usuario.*, verificados.*
  FROM datos_usuario
  INNER JOIN verificados
  ON datos_usuario.usuario_id = verificados.usuario_id
  WHERE datos_usuario.curp = ?`;
  return await ejecutarConsulta(query, [curp]);
}

async function consultarVacunas(idUsuario) {
  const query = `
  SELECT vacunas.*, doctor.*
  FROM vacunas
  INNER JOIN doctor
  ON vacunas.doctor_id = doctor.doctor_id
  WHERE vacunas.usuario_id = ?
  ORDER BY vacuna_aplicada;`;
  const resultados = await ejecutarConsulta(query, [idUsuario]);

  const resultadosFormateados = resultados.map((vacuna) => ({
    ...vacuna,
    fechaAplicacion: obtenerFechaFormateada(vacuna.fechaAplicacion),
    siguienteDosis: obtenerFechaFormateada(vacuna.siguienteDosis),
  }));

  return resultadosFormateados;
}

async function consultarConsultas(idUsuario) {
  const query = `
  SELECT consultas.*, doctor.*
  FROM consultas
  INNER JOIN doctor
  ON consultas.doctor_id = doctor.doctor_id
  WHERE consultas.usuario_id = ?
  ORDER BY observaciones;`;
  const resultados = await ejecutarConsulta(query, [idUsuario]);

  const resultadosFormateados = resultados.map((vacuna) => ({
    ...vacuna,
    fechaConsulta: obtenerFechaFormateada(vacuna.fechaConsulta),
  }));

  return resultadosFormateados;
}

async function consultarEstudios(idUsuario) {
  const query = `
  SELECT estudios.*, doctor.*
  FROM estudios
  INNER JOIN doctor
  ON estudios.doctor_id = doctor.doctor_id
  WHERE estudios.usuario_id = ?
  ORDER BY tipoEstudio;`;
  const resultados = await ejecutarConsulta(query, [idUsuario]);

  const resultadosFormateados = resultados.map((vacuna) => ({
    ...vacuna,
    fechaEstudio: obtenerFechaFormateada(vacuna.fechaEstudio),
  }));

  return resultadosFormateados;
}

async function consultarHistorial(idUsuario) {
  const query = `
  SELECT historial.*, doctor.*
  FROM historial_medico AS historial
  INNER JOIN doctor
  ON historial.doctor_id = doctor.doctor_id
  WHERE historial.usuario_id = ?`;

  const resultados = await ejecutarConsulta(query, [idUsuario]);

  const resultadosFormateados = resultados.map((historial) => ({
    doctor: {
      doctor_id: historial.doctor_id,
      nombre: historial.nombre,
      cedula: historial.cedula,
    },
    ultimaModificacion: obtenerFechaFormateada(historial.ultimaModificacion), // ajusta según el campo correcto
    pp: {
      alergias: historial.alergias,
      tabaco: historial.tabaco,
      alcohol: historial.alcohol,
      drogas: historial.drogas,
      padecimientos: historial.padecimientos,
      medicamentos: historial.medicamentos,
      quirurgicos: historial.quirurgicos,
      traumatologicos: historial.traumatologicos,
      transfusionales: historial.transfusionales,
      intoleranciaMedicamentos: historial.intoleranciaMedicamentos,
      otros: historial.perPatOtros,
    },
    pnp: {
      ejercicio: historial.ejercicio,
      suplementos: historial.suplementos,
      viajesRecientes: historial.viajesRecientes,
      tatuajes: historial.tatuajes,
      perforaciones: historial.perforaciones,
      otros: historial.perNoPatOtros,
    },
    ah: {
      diabetesAbuelos: historial.diabetesAbuelos,
      diabetesPadre: historial.diabetesPadre,
      diabetesMadre: historial.diabetesMadre,
      diabetesHermanos: historial.diabetesHermanos,
      nefropatiasAbuelos: historial.nefropatiasAbuelos,
      nefropatiasPadre: historial.nefropatiasPadre,
      nefropatiasMadre: historial.nefropatiasMadre,
      nefropatiasHermanos: historial.nefropatiasHermanos,
      mentalesAbuelos: historial.mentalesAbuelos,
      mentalesPadre: historial.mentalesPadre,
      mentalesMadre: historial.mentalesMadre,
      mentalesHermanos: historial.mentalesHermanos,
      hipertensionAbuelos: historial.hipertensionAbuelos,
      hipertensionPadre: historial.hipertensionPadre,
      hipertensionMadre: historial.hipertensionMadre,
      hipertensionHermanos: historial.hipertensionHermanos,
      oncologicosAbuelos: historial.oncologicosAbuelos,
      oncologicosPadre: historial.oncologicosPadre,
      oncologicosMadre: historial.oncologicosMadre,
      oncologicosHermanos: historial.oncologicosHermanos,
      hepatopatiasAbuelos: historial.hepatopatiasAbuelos,
      hepatopatiasPadre: historial.hepatopatiasPadre,
      hepatopatiasMadre: historial.hepatopatiasMadre,
      hepatopatiasHermanos: historial.hepatopatiasHermanos,
      heredoOtrosAbuelos: historial.heredoOtrosAbuelos,
      heredoOtrosPadre: historial.heredoOtrosPadre,
      heredoOtrosMadre: historial.heredoOtrosMadre,
      heredoOtrosHermanos: historial.heredoOtrosHermanos,
    },    
  }));

  return resultadosFormateados;
}

async function consultarMedicamentosYconsultas(idConsulta) {
  const query = `
  SELECT consultas.*, medicamentos.*
  FROM consultas
  LEFT JOIN medicamentos
  ON consultas.consulta_id = medicamentos.consulta_id
  WHERE consultas.consulta_id = ?
  ORDER BY consultas.fechaConsulta;`;
  const resultados = await ejecutarConsulta(query, [idConsulta]);

  const resultadosFormateados = resultados.map((vacuna) => ({
    ...vacuna,
    fechaConsulta: obtenerFechaFormateada(vacuna.fechaConsulta),
  }));

  return resultadosFormateados;
}

async function consultarEstudiosConIdEstudio(idEstudio) {
  const query = `
  SELECT estudios.*, doctor.*
  FROM estudios
  INNER JOIN doctor
  ON estudios.doctor_id = doctor.doctor_id
  WHERE estudios.estudio_id = ?
  ORDER BY fechaEstudio;`;
  const resultados = await ejecutarConsulta(query, [idEstudio]);

  const resultadosFormateados = resultados.map((vacuna) => ({
    ...vacuna,
    fechaEstudio: obtenerFechaFormateada(vacuna.fechaEstudio),
  }));

  return resultadosFormateados;
}

async function registrarVacuna(
  idUsuario,
  idDoctor,
  vacunaAplicada,
  fabricante,
  numeroLote,
  numeroSerie,
  fechaAplicacion,
  dosisAdministrada,
  lugarAdministacion,
  siguienteDosis
) {
  if (!siguienteDosis) {
    siguienteDosis = "0000-00-00";
  }
  const query = `INSERT INTO vacunas (usuario_id, doctor_id, vacuna_aplicada, fabricante, numeroLote, numeroSerie, fechaAplicacion, dosisAdministrada, lugarAdministracion, siguienteDosis) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  await ejecutarConsulta(query, [
    idUsuario,
    idDoctor,
    vacunaAplicada,
    fabricante,
    numeroLote,
    numeroSerie,
    fechaAplicacion,
    dosisAdministrada,
    lugarAdministacion,
    siguienteDosis,
  ]);
}

async function registrarConsulta(
  idUsuario,
  idDoctor,
  observaciones,
  pronostico,
  planTerapeutico
) {
  const query = `INSERT INTO consultas (usuario_id, doctor_id, observaciones, pronostico, planTerapeutico) VALUES (?, ?, ?, ?, ?)`;
  resultados = await ejecutarConsulta(query, [
    idUsuario,
    idDoctor,
    observaciones,
    pronostico,
    planTerapeutico,
  ]);
  return resultados.insertId;
}

async function registrarMedicamento(
  idConsulta,
  nombre,
  viaAdministracion,
  dosis,
  frecuencia,
  duracion
) {
  const query = `INSERT INTO medicamentos (consulta_id, nombre, viaAdministracion, dosis, frecuencia, duracion) VALUES (?, ?, ?, ?, ?, ?)`;
  await ejecutarConsulta(query, [
    idConsulta,
    nombre,
    viaAdministracion,
    dosis,
    frecuencia,
    duracion,
  ]);
}

async function registrarEstudio(
  idUsuario,
  idDoctor,
  tipoEstudio,
  motivoEstudio,
  descripcion,
  resultados,
  fechaEstudio
) {
  const query = `INSERT INTO estudios (usuario_id, doctor_id, tipoEstudio, motivoEstudio, descripcion, resultados, fechaEstudio) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  resultados = await ejecutarConsulta(query, [
    idUsuario,
    idDoctor,
    tipoEstudio,
    motivoEstudio,
    descripcion,
    resultados,
    fechaEstudio,
  ]);
  return resultados.insertId;
}

async function registrarHistorial(idPaciente, idDoctor, datos) {
  const query = `INSERT INTO historial_medico (
        usuario_id, doctor_id, 
        alergias, tabaco, alcohol, drogas, padecimientos, medicamentos, quirurgicos, traumatologicos, transfusionales, intoleranciaMedicamentos, perPatOtros,
        ejercicio, suplementos, viajesRecientes, tatuajes, perforaciones, perNoPatOtros,
        diabetesAbuelos, diabetesPadre, diabetesMadre, diabetesHermanos,
        nefropatiasAbuelos, nefropatiasPadre, nefropatiasMadre, nefropatiasHermanos,
        mentalesAbuelos, mentalesPadre, mentalesMadre, mentalesHermanos,
        hipertensionAbuelos, hipertensionPadre, hipertensionMadre, hipertensionHermanos,
        oncologicosAbuelos, oncologicosPadre, oncologicosMadre, oncologicosHermanos,
        hepatopatiasAbuelos, hepatopatiasPadre, hepatopatiasMadre, hepatopatiasHermanos,
        heredoOtrosAbuelos, heredoOtrosPadre, heredoOtrosMadre, heredoOtrosHermanos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        doctor_id = VALUES(doctor_id),
        alergias = VALUES(alergias),
        tabaco = VALUES(tabaco),
        alcohol = VALUES(alcohol),
        drogas = VALUES(drogas),
        padecimientos = VALUES(padecimientos),
        medicamentos = VALUES(medicamentos),
        quirurgicos = VALUES(quirurgicos),
        traumatologicos = VALUES(traumatologicos),
        transfusionales = VALUES(transfusionales),
        intoleranciaMedicamentos = VALUES(intoleranciaMedicamentos),
        perPatOtros = VALUES(perPatOtros),
        ejercicio = VALUES(ejercicio),
        suplementos = VALUES(suplementos),
        viajesRecientes = VALUES(viajesRecientes),
        tatuajes = VALUES(tatuajes),
        perforaciones = VALUES(perforaciones),
        perNoPatOtros = VALUES(perNoPatOtros),
        diabetesAbuelos = VALUES(diabetesAbuelos),
        diabetesPadre = VALUES(diabetesPadre),
        diabetesMadre = VALUES(diabetesMadre),
        diabetesHermanos = VALUES(diabetesHermanos),
        nefropatiasAbuelos = VALUES(nefropatiasAbuelos),
        nefropatiasPadre = VALUES(nefropatiasPadre),
        nefropatiasMadre = VALUES(nefropatiasMadre),
        nefropatiasHermanos = VALUES(nefropatiasHermanos),
        mentalesAbuelos = VALUES(mentalesAbuelos),
        mentalesPadre = VALUES(mentalesPadre),
        mentalesMadre = VALUES(mentalesMadre),
        mentalesHermanos = VALUES(mentalesHermanos),
        hipertensionAbuelos = VALUES(hipertensionAbuelos),
        hipertensionPadre = VALUES(hipertensionPadre),
        hipertensionMadre = VALUES(hipertensionMadre),
        hipertensionHermanos = VALUES(hipertensionHermanos),
        oncologicosAbuelos = VALUES(oncologicosAbuelos),
        oncologicosPadre = VALUES(oncologicosPadre),
        oncologicosMadre = VALUES(oncologicosMadre),
        oncologicosHermanos = VALUES(oncologicosHermanos),
        hepatopatiasAbuelos = VALUES(hepatopatiasAbuelos),
        hepatopatiasPadre = VALUES(hepatopatiasPadre),
        hepatopatiasMadre = VALUES(hepatopatiasMadre),
        hepatopatiasHermanos = VALUES(hepatopatiasHermanos),
        heredoOtrosAbuelos = VALUES(heredoOtrosAbuelos),
        heredoOtrosPadre = VALUES(heredoOtrosPadre),
        heredoOtrosMadre = VALUES(heredoOtrosMadre),
        heredoOtrosHermanos = VALUES(heredoOtrosHermanos)`;

  const values = [
    idPaciente,
    idDoctor,
    datos.alergias,
    datos.tabaco,
    datos.alcohol,
    datos.drogas,
    datos.padecimientos,
    datos.medicamentos,
    datos.quirurgicos,
    datos.traumatologicos,
    datos.transfusionales,
    datos.intoleranciaMedicamentos,
    datos.perPatOtros,
    datos.ejercicio,
    datos.suplementos,
    datos.viajesRecientes,
    datos.tatuajes,
    datos.perforaciones,
    datos.perNoPatOtros,
    datos.diabetesAbuelos,
    datos.diabetesPadre,
    datos.diabetesMadre,
    datos.diabetesHermanos,
    datos.nefropatiasAbuelos,
    datos.nefropatiasPadre,
    datos.nefropatiasMadre,
    datos.nefropatiasHermanos,
    datos.mentalesAbuelos,
    datos.mentalesPadre,
    datos.mentalesMadre,
    datos.mentalesHermanos,
    datos.hipertensionAbuelos,
    datos.hipertensionPadre,
    datos.hipertensionMadre,
    datos.hipertensionHermanos,
    datos.oncologicosAbuelos,
    datos.oncologicosPadre,
    datos.oncologicosMadre,
    datos.oncologicosHermanos,
    datos.hepatopatiasAbuelos,
    datos.hepatopatiasPadre,
    datos.hepatopatiasMadre,
    datos.hepatopatiasHermanos,
    datos.heredoOtrosAbuelos,
    datos.heredoOtrosPadre,
    datos.heredoOtrosMadre,
    datos.heredoOtrosHermanos,
  ];

  await ejecutarConsulta(query, values);
}

module.exports = {
  consultarVerificado,
  consultarVacunas,
  consultarConsultas,
  consultarEstudios,
  consultarHistorial,
  consultarMedicamentosYconsultas,
  consultarEstudiosConIdEstudio,
  registrarVacuna,
  registrarConsulta,
  registrarMedicamento,
  registrarEstudio,
  registrarHistorial,
};
