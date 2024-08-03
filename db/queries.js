const pool = require('./pool');

async function getAllCategories(){
    const {rows} = await pool.query(`
        Select * FROM categories
        ORDER BY name
        `);
    return rows;
}

async function getCategory(id){
    const {rows} = await pool.query('SELECT * FROM categories WHERE category_id = ($1)',[id]);
    
    return rows[0];
}

async function insertCategory(name,description){
    const result = await pool.query(`
        INSERT INTO categories(name,description)
        VALUES (($1),($2))
    `,[name,description]);

    return {name,description};
}

async function deleteCategory(categoryID){
    await pool.query('DELETE FROM categories WHERE category_id = ($1)',[categoryID]);
}


async function updateCategory(categoryID,name,description){
    const {rows} = await pool.query(`
        UPDATE categories
        SET name = ($1),
            description = ($2)
        WHERE category_id = ($3)
        RETURNING *
        `,[name,description,categoryID]);

        return rows[0]
}

async function getInstrumentsWithCategory(categoryID){
    const {rows} = await pool.query(`
        SELECT * FROM instruments 
        WHERE category_id = ($1)
        ORDER BY name`
        ,[categoryID]);
    return rows;
}

async function getAllInstruments(){
    const {rows} = await pool.query(`
        SELECT 
        I.name,I.description,I.url,price,image,number,C.name AS category, C.category_id AS category_id
        FROM instruments AS I
        INNER JOIN categories AS C
        ON C.category_id = I.category_id
        ORDER BY I.name
        LIMIT 5
        `);
   
    return rows;
}

async function getInstrument(instrumentID){
    const {rows} = await pool.query(`
        SELECT 
        I.name,I.description,I.url,price,image,number,C.name AS category,instrument_id,
        I.category_id AS category_id
        FROM instruments AS I
        INNER JOIN categories AS C
        ON C.category_id = I.category_id
        WHERE instrument_id = ($1)
        `,[instrumentID]);
    
        return rows[0];
}

async function insertInstrument(name,category,description,price,image,number){
    const {rows} = await pool.query(`
        INSERT INTO instruments(name,description,price,image,number,category_id)
        VALUES (($1),($2),($3),($4),($5),($6))
        RETURNING *
        `,[name,description,price,image,number,category]);
        
        return rows[0];
}

async function deleteInstrument(instrumentID){
    await pool.query(`
        DELETE FROM instruments
        WHERE instrument_id = ($1)
        `,[instrumentID]);
}

async function updateInstrument(instrumentID,name,category,description,price,image,number){
    const {rows} = await pool.query(`
        UPDATE instruments
        SET name = ($1),
            category_id = ($2),
            description = ($3),
            price = ($4),
            image = ($5),
            number = ($6)
        WHERE instrument_id = ($7)
        RETURNING *
        `,[name,category,description,price,image,number,instrumentID]);

        return rows[0]
}


module.exports={
    getAllCategories,
    getAllInstruments,
    getInstrument,
    insertInstrument,
    updateInstrument,
    deleteInstrument,
    getCategory,
    getInstrumentsWithCategory,
    insertCategory,
    deleteCategory,
    updateCategory
}