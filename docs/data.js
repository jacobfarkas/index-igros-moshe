/*
  DATA.JS — Volume metadata + async loader.
  
  Siman data lives in json/vol1.json, json/vol2.json, etc.
  This file holds metadata and provides loadVolume() / loadAllVolumes().

  JSON format per volume:
    {
      "sections": [
        {
          "name": "Section Name",
          "simanim": [
            { "siman": "א", "title": "description text", "page": 5 },
            ...
          ]
        }
      ]
    }
*/

var VOLUMES = [
  {
    id: 1,
    title: "כרך א׳",
    subtitle: "אורח חיים (א), קדשים (א)",
    hebrewBooksReq: 916,
    sections: null  // loaded from json/vol1.json
  },
  {
    id: 2,
    title: "כרך ב׳",
    subtitle: "יורה דעה (א)",
    hebrewBooksReq: 917,
    sections: null
  },
  {
    id: 3,
    title: "כרך ג׳",
    subtitle: "",
    hebrewBooksReq: 0,
    sections: null
  },
  {
    id: 4,
    title: "כרך ד׳",
    subtitle: "חושן משפט (א), אורח חיים (ב), אבן העזר (ב)",
    hebrewBooksReq: 918,
    sections: null
  },
  {
    id: 5,
    title: "כרך ה׳",
    subtitle: "יורה דעה (ב), אורח חיים (ג), אבן העזר (ג)",
    hebrewBooksReq: 919,
    sections: null
  },
  {
    id: 6,
    title: "כרך ו׳",
    subtitle: "אורח חיים (ד), יורה דעה (ג)",
    hebrewBooksReq: 920,
    sections: null
  },
  {
    id: 7,
    title: "כרך ז׳",
    subtitle: "",
    hebrewBooksReq: 0,
    sections: null
  },
  {
    id: 8,
    title: "כרך ח׳",
    subtitle: "",
    hebrewBooksReq: 0,
    sections: null
  },
  {
    id: 9,
    title: "כרך ט׳",
    subtitle: "",
    hebrewBooksReq: 0,
    sections: null
  }
];

/*
  loadVolume(volId) — Fetch one volume's JSON data.
  Returns a promise that resolves to the volume object with sections populated.
*/
function loadVolume(volId) {
  var vol = VOLUMES.find(function(v) { return v.id === volId; });
  if (!vol) return Promise.resolve(null);
  if (vol.sections) return Promise.resolve(vol); // already loaded

  return fetch('json/vol' + volId + '.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      // Convert JSON format to internal format for compatibility with search.js
      vol.sections = data.sections.map(function(sec) {
        return {
          name: sec.name,
          simanim: sec.simanim.map(function(s) {
            return [s.page, s.siman, s.title];
          })
        };
      });
      return vol;
    })
    .catch(function() {
      vol.sections = [];
      return vol;
    });
}

/*
  loadAllVolumes() — Fetch all 9 volumes' JSON data.
  Returns a promise that resolves when all are loaded.
*/
function loadAllVolumes() {
  var promises = VOLUMES.map(function(v) {
    return loadVolume(v.id);
  });
  return Promise.all(promises);
}
