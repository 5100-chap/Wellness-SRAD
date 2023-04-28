const queries = {
    getAll: 'SELECT * FROM tabla',
    getById: 'SELECT * FROM tabla WHERE id = @id',
    create: 'INSERT INTO tabla (campo1, campo2) VALUES (@campo1, @campo2)',
    update: 'UPDATE tabla SET campo1 = @campo1, campo2 = @campo2 WHERE id = @id',
    delete: 'DELETE FROM tabla WHERE id = @id'
};

module.exports = queries;