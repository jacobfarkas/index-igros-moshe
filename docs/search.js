/*
  SEARCH.JS — Shared search/filter logic.
  
  searchAll(query)       → returns results across all volumes (for index page)
  searchVolume(volId, q) → returns results within one volume (for volume pages)
  
  Results format:
    { volId, volTitle, sectionName, siman, desc, page, req }
*/

function _buildUrl(req, pg) {
  return 'https://hebrewbooks.org/pdfpager.aspx?req=' + req + '&pgnum=' + pg;
}

function _normalize(str) {
  // Strip common punctuation for fuzzy Hebrew matching
  return str.replace(/[\u05F3\u05F4״׳"']/g, '').trim();
}

function _match(query, siman, desc) {
  const q = _normalize(query);
  if (!q) return true;
  const target = _normalize('סימן ' + siman + ' ' + desc);
  return target.indexOf(q) !== -1;
}

function searchAll(query) {
  const results = [];
  for (const vol of VOLUMES) {
    if (!vol.sections) continue;
    for (const sec of vol.sections) {
      if (!sec.simanim) continue;
      for (const [pg, siman, desc] of sec.simanim) {
        if (_match(query, siman, desc)) {
          results.push({
            volId: vol.id,
            volTitle: vol.title,
            sectionName: sec.name,
            siman: siman,
            desc: desc,
            page: pg,
            url: _buildUrl(vol.hebrewBooksReq, pg)
          });
        }
      }
    }
  }
  return results;
}

function searchVolume(volId, query) {
  const vol = VOLUMES.find(v => v.id === volId);
  if (!vol) return [];
  const results = [];
  for (const sec of vol.sections) {
    if (!sec.simanim) continue;
    for (const [pg, siman, desc] of sec.simanim) {
      if (_match(query, siman, desc)) {
        results.push({
          sectionName: sec.name,
          siman: siman,
          desc: desc,
          page: pg,
          url: _buildUrl(vol.hebrewBooksReq, pg)
        });
      }
    }
  }
  return results;
}

function getVolume(volId) {
  return VOLUMES.find(v => v.id === volId) || null;
}

function countSimanim(vol) {
  if (!vol || !vol.sections) return 0;
  let c = 0;
  for (const s of vol.sections) c += (s.simanim ? s.simanim.length : 0);
  return c;
}
