const queries = {
    getAllAlumni: 'SELECT * FROM Alumno;',
    searchDirAdmInsAl: 'SELECT * FROM remp_tabla WHERE numero_nomina = \' remp_nomina \';',
    getById: 'SELECT * FROM tabla WHERE id = @id',
    create: 'INSERT INTO tabla (campo1, campo2) VALUES (@campo1, @campo2)',
    update: 'UPDATE tabla SET campo1 = @campo1, campo2 = @campo2 WHERE id = @id',
    delete: 'DELETE FROM tabla WHERE id = @id',
    insertarRegistro: 'INSERT INTO Registro(matricula_alumno, hora_de_llegada, fecha, id_area)\
    VALUES\
        (\'@matricula_alumno\', \'@hora_de_llegada\', \'@fecha\', @id_area);',
    verificarRegistro: 'SELECT COUNT(*) FROM Registro WHERE Registro.matricula_alumno=\'@matricula_alumno\' AND Registro.hora_de_salida IS NULL;',
    marcarSalida: 'UPDATE Registro\
    SET hora_de_salida=\'@salida\'\
    WHERE Registro.hora_de_salida IS NULL AND Registro.matricula_alumno=\'@matricula_alumno\';',
    llamarTodoElAforo: 'SELECT Registro.matricula_alumno, Registro.id_area FROM Registro;',
    consultarAforoActualYTotal: 'SELECT Area.lugares_disponibles AS actuales, Area.lugares_totales AS totales FROM Area WHERE Area.id = @area_id;',
    aumentoAforo: 'UPDATE Area\
    SET Area.lugares_disponibles = (SELECT Area.lugares_disponibles AS actuales FROM Area WHERE Area.id = @area_id)+1\
    WHERE Area.id = @area_id;',
    disminuirAforo: 'UPDATE Area\
    SET Area.lugares_disponibles = (SELECT Area.lugares_disponibles AS actuales FROM Area WHERE Area.id = @area_id)-1\
    WHERE Area.id = @area_id;'
};

module.exports = queries;