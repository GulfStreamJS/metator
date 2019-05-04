const metator = require('../');

describe('metator', function() {
    describe('#isvi()', function() {
        this.timeout(20000);
        it('This is video? bunny.m4v', function (done) {
            metator.isvi(__dirname + '/bunny.m4v').then(res => {
                if (res) return done();
                else return done('Not!');
            }).catch(error => {
                return done(error);
            });
        });
    });
    describe('#isto()', function() {
        this.timeout(20000);
        it('This is torrent? 3652DB1AFBC5D414DBCAF5920F741FF93B1ED9E5', function (done) {
            metator.isto('3652DB1AFBC5D414DBCAF5920F741FF93B1ED9E5').then(res => {
                if (res) return done();
                else return done('Not!');
            }).catch(error => {
                return done(error);
            });
        });
    });
    describe('#isvt()', function() {
        this.timeout(20000);
        it('This is video/torrent? 6B!@#$%^5B', function (done) {
            metator.isvt('6B!@#$%^5B').then(res => {
                if (!res) return done();
                else return done('Not!');
            }).catch(error => {
                return done(error);
            });
        });
    });
    describe('#info()', function() {
        this.timeout(20000);
        it('Get info from torrent https://archive.org/download/Colgate-Comedy-Hour-S6E1/Colgate-Comedy-Hour-S6E1_archive.torrent', function (done) {
            metator.info('https://archive.org/download/Colgate-Comedy-Hour-S6E1/Colgate-Comedy-Hour-S6E1_archive.torrent').then(items => {
                if (items.length && items[0].type === 'torrent') return done();
                else return done('Not Found!');
            }).catch(error => {
                return done(error);
            });
        });
        it('Get info from local file bunny.m4v', function (done) {
            metator.info(__dirname + '/bunny.m4v').then(items => {
                if (items.length && items[0].type === 'video') return done();
                else return done('Not Found!');
            }).catch(error => {
                return done(error);
            });
        });
        it('Get info from error input 6B!@#$%^5B', function (done) {
            metator.info('6B!@#$%^5B').then(items => {
                if (!items.length) return done();
                else return done('Not Found!');
            }).catch(error => {
                return done(error);
            });
        });
    });
});