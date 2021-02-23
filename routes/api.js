const express = require('express');
const router = express.Router();
const db = require('../db');
const { Postcode, School, Busstop, Address, User, Chat, People, Like } = require('../models');
const _ = require('underscore');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const exphbs = require('express-handlebars');
const pdfCreator = require('html-pdf');

router.get('/postcodes', (req, res) =>
    Postcode.findAll({ raw: true, where: { [Op.not]: { postcode: null } } }).then(
        data => {
            let postcodes = {}
            // Getting Array of the first part of the postcode
            const pcs = [...new Set(data.map(e => e.postcode.split(' ')[0]))]
            for (var i = 0; i < pcs.length; i++) {
                //Group All postcodes starting with same part 
                postcodes[pcs[i]] = data.filter(d => d.postcode.startsWith(pcs[i]))
            }
            res.json(postcodes)
        }
    ).catch(err => {
        console.log(err);
        res.json({ error: err })
    })
);

router.get('/locations/:postcode/:filter?', async (req, res) => {
    let { postcode, filter } = req.params;

    Postcode.findByPk(postcode).then(postCode => {

        // Check if postcode exists
        postCode === null && res.json({ status: 404, error: "Postcode not found" })

        // Get 5 closest bus stops
        const busstop = async () => await db.query(`SELECT id,name,lat,lon FROM (SELECT dest.*, (3959 * acos(cos(radians(orig.latitude)) * cos(radians(dest.lat)) * cos(radians(dest.lon) - radians(orig.longitude)) + sin(radians(orig.latitude)) * sin(radians(dest.lat )))) AS distance FROM busstops dest, postcodes orig WHERE orig.id = '${postcode}' HAVING distance < 10 ORDER BY distance LIMIT 5) AS T`, { model: Busstop, mapToModel: true })
        // Get all schools in a 10-mile radius
        const schools = async () => await db.query(`SELECT  * FROM schools where postcode_id IN (SELECT id FROM (SELECT dest.id, (3959 * acos(cos(radians(orig.latitude)) * cos(radians(dest.latitude)) * cos(radians(dest.longitude) - radians(orig.longitude)) + sin(radians(orig.latitude)) * sin(radians(dest.latitude )))) AS distance FROM postcodes dest, postcodes orig WHERE orig.id = '${postcode}' HAVING distance < 10 ORDER BY distance) AS T)`, { model: School, mapToModel: true })
        // Get all addresses within this postcode
        const address = async () => await Address.findAll({ raw: true, where: { postcode_id: postcode } });

        // Check if filter is passed
        if (filter)
            switch (filter) {
                case 'bus':
                    busstop().then(data => res.json(data)).catch(err => {
                        console.log(err);
                        res.json({ error: err })
                    });
                    break;
                case 'school':
                    schools().then(data => res.json(data)).catch(err => {
                        console.log(err);
                        res.json({ error: err })
                    });
                    break;
                case 'address':
                    address().then(data => res.json(data)).catch(err => {
                        console.log(err);
                        res.json({ error: err })
                    });
                    break;
                default:
                    res.json({ error: 'undefined filter', filters: ['bus', 'school', 'address'] })
            }
        // return all data if no filter
        (async () => {
            try {
                const busstops = await busstop()
                const addresses = await address()
                const school = await schools()
                res.json({ postcode: postCode, addresses: addresses, busstops: busstops, schools: school })
            } catch (err) {
                console.log(err);
                res.json({ error: err })
            }
        })()
    }).catch(err => {
        console.log(err);
        res.json({ error: err })
    })

});

router.get('/report/:pdf?', async (req, res) => {
    let { pdf } = req.params;
    const id = 3029;

    // Get User By Id 
    User.findByPk(id, {
        // include relationships
        include: [
            { model: People, as: 'people' },
            { model: Like, as: 'likes' },
            { model: Like, as: 'liked' },
            { model: Chat, as: 'msgsent' },
            { model: Chat, as: 'msginbox' },
            { association: 'house', include: ['postcode', 'address'] }
        ]
    }
    ).then(user => {

        // Check if user exists
        user === null && res.json({ status: 404, error: "User not found" })

        // init report
        let report = {};
        report['User ID'] = `${user.id}`;
        report['Full Name'] = `${user.name} ${user.surname}`;
        report['House ID'] = `${user.house.id}`;
        report['Property type'] = ['-', 'FLAT', 'small house', 'big house', 'Villa'][user.house.propertytype];
        // Delete id & postcode_id from adress
        delete user.house.address.dataValues.id
        delete user.house.address.dataValues.postcode_id
        report['Full address'] = `${user.house.postcode.postcode}, ${_.compact(user.house.address.dataValues).join(', ')}`
        report['Number of likes given'] = user.likes.length
        report['Like IDs'] = user.likes.map(like => like.b).join('-')
        report['Number of likes received'] = user.liked.length
        report['Number of matches'] = _.intersection(user.likes.map(like => like.b), user.liked.map(like => like.a)).length
        report['Match IDs'] = _.intersection(user.likes.map(like => like.b), user.liked.map(like => like.a)).join('-')
        report['Number of chats'] = user.msgsent.length + user.msginbox.length
        report['Number of unanswered messages'] = _.difference(user.msgsent, user.msginbox).length
        report['Number of people'] = user.people.length
        report['Number of old men'] = user.people.filter(p => p.age > 45).length

        // Check if pdf is set
        if (pdf)
            pdf === "pdf" ?
                // Convert report to pdf
                exphbs.create({}).render('./views/pdf.handlebars', { report }).then(html =>
                    // Create pdf from html file containing the report
                    pdfCreator.create(html).toStream((err, stream) => {
                        if (err) {
                            console.log(err);
                            res.json({ error: err })
                        }
                        stream.pipe(res);
                        stream.on('data', data => res.write(data));
                        stream.on('end', () => res.end());
                    })
                ).catch(err => {
                    console.log(err);
                    res.json({ error: err })
                }) :
                res.json({ status: 404, error: "Invalid Params", params: ['pdf'] })
        else
            res.json(report)
    }).catch(err => {
        console.log(err);
        res.json({ error: err })
    });
});

module.exports = router;