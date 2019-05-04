const pt = require('parse-torrent');
const fe = require('file-exists');
const mt = require('mime-types');
const rc = require('read-chunk');
const wt = require('webtorrent');
const ft = require('file-type');
const cr = require('crypto');
const pa = require('path');
const fs = require('fs');

const info_about_video = input => {
    return new Promise(resolve => {
        if (fe.sync(input)) {
            let {mime} = ft(rc.sync(input, 0, ft.minimumBytes));
            if (mime && /video/i.test(mime)) {
                let item = {};
                let {size} = fs.statSync(input);
                item.type = 'video';
                item.path = input;
                item.size = size;
                item.name = pa.basename(input);
                item.sha1 = cr
                    .createHash('sha1')
                    .update(fs.readFileSync(input))
                    .digest('hex');
                item = {...item, ...get_episode_by_name(input)};
                return resolve([item]);
            } else {
                pt.remote(input, err => {
                    if (err) {
                        //console.error('This file is not a video/torrent');
                        return resolve([]);
                    }
                    return get_episode_by_torrent(input)
                        .then(resolve);
                });
            }
        } else if (/(^http|^magnet|[a-z0-9]{40})/i.test(input)) {
            pt.remote(input, err => {
                if (err) {
                    //console.error('This string is not a video/torrent');
                    return resolve([]);
                }
                return get_episode_by_torrent(input)
                    .then(resolve);
            });
        } else {
            //console.error('This is not a video/torrent');
            return resolve([]);
        }
    });
};

const get_episode_by_name = name => {
    if (!is_video_by_name(name)) return {};
    let res = {};
    let seasons = name.match(/[^A-Z0-9]S([0-9]{1,2})[^A-DF-Z0-9]/i);
    let episodes = name.match(/S([0-9]{1,2})[^A-DF-Z0-9]([0-9]{1,3})[^A-Z0-9]/i);
    if (!seasons && !episodes) {
        seasons = name.match(/SEASON[^A-Z0-9]([0-9]{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)[^A-Z0-9]/i);
        episodes = name.match(/SEASON[^A-Z0-9][A-Z0-9]{1,5}[^A-Z0-9]([0-9]{1,3})of[0-9]{1,3}/i);
        if (seasons && seasons.length && seasons[1].replace(/[^0-9]/ig, '') === '') {
            'one|two|three|four|five|six|seven|eight|nine|ten'
                .split('|')
                .forEach((s, i) => {
                    if (seasons[1] === s) {
                        seasons[1] = (i + 1).toString();
                    }
                });
        }
        if (!seasons && !episodes) {
            seasons = name.match(/SERIES[^A-Z0-9]([0-9]{1,3})[^A-Z0-9][0-9]{1,3}of[0-9]{1,3}/i);
            episodes = name.match(/SERIES[^A-Z0-9][0-9]{1,3}[^A-Z0-9]([0-9]{1,3})of[0-9]{1,3}/i);
        }
    }
    if (seasons && seasons[1]) {
        res.season = parseInt(seasons[1]).toString();
    }
    if (episodes && episodes[2]) {
        if (episodes[1] && !res.season) {
            res.season = parseInt(episodes[1]).toString();
        }
        res.episode = parseInt(episodes[2]).toString();
    }
    return (res.season || res.episode) ? res : {};
};

const get_episode_by_torrent = torrent => {
    return new Promise(resolve => {
        let list = [];
        const cl = new wt();
        let t = cl.add(torrent);
        let i = 1;
        let meta = setInterval(() => {
            i++;
            if (i >= 10) {
                clearInterval(meta);
                try {
                    cl.destroy(err => err ? console.error(err) : '');
                } catch (e) {
                }
                return resolve(list);
            }
        }, 2000);
        t.on('metadata', () => {
            clearInterval(meta);
            t.files.forEach(info => {
                let item = {};
                item.type = 'torrent';
                item.size = info.length || '';
                item.name = info.name || '';
                item.hash = info._torrent.infoHash || '';
                if (!is_video_by_name(item.name)) return {};
                item = {...item, ...get_episode_by_name(item.name)};
                list.push(item);
            });
            try {
                cl.destroy(err => err ? console.error(err) : '');
            } catch (e) {
            }
            return resolve(list);
        });
    });
};

const is_video_by_name = name => {
    return /video/i.test(mt.lookup(name) || '') &&
        !(/trailer|teaser|preview|sample/i.test(name));
};

const is_video = input => {
    return info_about_video(input)
        .then(list => {
            if (list && list.length && list[0].type === 'video') {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
};

const is_torrent = input => {
    return info_about_video(input)
        .then(list => {
            if (list && list.length && list[0].type === 'torrent') {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
};

const is_video_torrent = input => {
    return Promise.all([
        is_video(input),
        is_torrent(input)
    ]).then(res => {
        let [video, torrent] = res;
        if (video || torrent) {
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    });
};

module.exports.gebt = get_episode_by_torrent;
module.exports.gebn = get_episode_by_name;
module.exports.ivbn = is_video_by_name;
module.exports.isvt = is_video_torrent;
module.exports.isvi = is_video;
module.exports.isto = is_torrent;
module.exports.info = info_about_video;