const db = require('../config/db');
const { date } = require('../lib/utils');

module.exports = {

    all(callback) {

        const query = `
        SELECT * FROM members
        ORDER BY name ASC
     `;

        db.query(query, function(err, results) {
            if(err) throw "Database error!";

            callback(results.rows);
        });
    },
    create(data, callback) {

        const query = `
        INSERT INTO members (
            name,
            avatar_url,
            gender,
            email,
            birth,
            blood,
            weight,
            height,
            instructor_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
   `;
    
    let { name, avatar_url, birth, gender, email, blood, weight, height, instructor } = data;

    const values = [
        name,
        avatar_url,
        gender,
        email,
        date(birth).iso,
        blood,
        weight,
        height,
        instructor
    ];

    db.query(query, values, function(err, results) {
        if(err) throw `Database error! ${err}`;

        callback(results.rows[0]);
    });
        
    },
    find(id, callback) {
       
    const query = `
        SELECT members.*, instructors.name AS instructor_name
        FROM members
        JOIN instructors ON instructors.id = members.instructor_id
        WHERE members.id = $1`;

       db.query(query, [id], function( err, results ) {
        if(err) throw `Database error! ${err}`;

        callback(results.rows[0]);

       });
    },
    update(data, callback) {
        const query = `
        UPDATE members SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            gender=($4),
            email=($5),
            blood=($6),
            weight=($7),
            height=($8),
            instructor_id=($9)
        WHERE id = $10
        `;

        let { id, name, avatar_url, birth, gender, email, blood, weight, height, instructor } = data;

        const values = [
            avatar_url,
            name,
            date(birth).iso,
            gender,
            email,
            blood,
            weight,
            height,
            instructor,
            id
        ];

        db.query(query, values, function(err) {
            if(err) throw `Database error! ${err}`;

            callback();
        });

    },
    delete(id, callback){
        const query = `DELETE FROM members WHERE id = $1`;
        db.query(query, [id], function(err, results) {
            if(err) throw `Database Error: ${err}`

            callback();
        });
    },
    instructorSelectOptions(callback) {
        db.query(`SELECT id, name FROM instructors`, function (err, results) {
            if(err) throw 'Database error!'

            callback(results.rows);
        });
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params;
        
        let query = "",
        filterQuery ="",
        totalQuery = `(
            SELECT count(*) FROM members
        ) AS total`


        if (filter) {
            filterQuery = `${query}
            WHERE members.name ILIKE '%${filter}%'
            OR members.email ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM members
                ${filterQuery}
            ) as total`
        }

        query = `
            SELECT members.*,${totalQuery}
            FROM members
            ${filterQuery}
            LIMIT $1
            OFFSET $2
            `;

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw `Database error! ${err}`;

            callback(results.rows);
        });
    }

 }