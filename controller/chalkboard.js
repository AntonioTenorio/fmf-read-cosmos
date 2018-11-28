'use strict';

require('dotenv').config();
var DocumentClient = require('documentdb').DocumentClient;
var DocumentBase   = require('documentdb').DocumentBase;

const documentdbOptions = {
    /*host: process.env.DOCUMENTDB_ENDPOINT ,
    masterkey: process.env.DOCUMENTDB_AUTHKEY,
    database: process.env.DOCUMENTDB_DB,
    table: process.env.DOCUMENT_TABLE*/
    host: process.env.DOCUMENTDB_ENDPOINT ,
    masterkey: process.env.DOCUMENTDB_AUTHKEY,
    database: process.env.DOCUMENTDB_DB,
    table: process.env.DOCUMENT_TABLE
};

var databaseId    = documentdbOptions.database,
    collectionId  = documentdbOptions.table,
    dbLink        = 'dbs/' + databaseId,
    collLink      = dbLink + '/colls/' + collectionId;


exports.apidata = function(req, res, next) { 
    if (!req.params.game_id) return res.sendStatus(400);
    var game_id = parseInt(req.params.game_id);

    const connectionPolicy = new DocumentBase.ConnectionPolicy();
    // Deshabilita la verificacion SSH si esta en desarrollo
    
    /*if(documentdbOptions.host.indexOf('localhost') > 0){
        connectionPolicy.DisableSSLVerification = true;
    }*/

    var client = new DocumentClient( documentdbOptions.host, { masterKey: documentdbOptions.masterkey }, connectionPolicy);

    var querySpec = {
        query       : 'SELECT g.id_game_fmf, g.id_game_golstats, g.home_team, g.away_team, g.plays, g.plays_modified FROM games g WHERE g.id_game_fmf=@game_id',
        parameters  : [
            { name: '@game_id', value: game_id }
        ] 
    };

    client
        .queryDocuments(collLink, querySpec, { enableCrossPartitionQuery: true })
        .toArray(function (err, results){

            if (err) {
                return res.status(400).json(err);
            }
            
            if (typeof results[0] === 'undefined'){

                var empty = {
                    "id_game_fmf": game_id,
                    "id_game_golstats": 0,
                    "home_team": [],
                    "away_team": [],
                    "plays_heatmap": []            
                }
                return res.status(200).json(empty);
            }

            return res.status(200).json(results[0]);
        });
}