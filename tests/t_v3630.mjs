// v3.63.0: stored data (KV storage) on the Usage page's Cloudflare limits card
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');let ok=0,bad=0;const c=(n,x,d)=>{if(x)ok++;else{bad++;console.log('FAIL',n,d||'')}};
const m=/function cflStorageShape[\s\S]*?\n\}\n/.exec(src);c('shape code found',!!m);
const SITE_ENV={CF_KV_LABELS:'aaaa1111=PROD,bbbb2222=DEV'};
const f=new Function('SITE_ENV',m[0]+';return cflStorageShape')(SITE_ENV);
const r=f({st:[{dimensions:{date:'2026-11-22',namespaceId:'aaaa1111xx'},max:{byteCount:1000,keyCount:5}},{dimensions:{date:'2026-11-23',namespaceId:'aaaa1111xx'},max:{byteCount:3000000,keyCount:50}},{dimensions:{date:'2026-11-23',namespaceId:'bbbb2222yy'},max:{byteCount:500000,keyCount:9}}]});
c('latest day per store is used, not summed over days',r.stores.find(x=>x.label==='PROD').bytes===3000000&&r.total===3500000&&r.keys===59,JSON.stringify(r));
c('stores named from CF_KV_LABELS and biggest first',r.stores[0].label==='PROD'&&r.stores[1].label==='DEV');
c('no rows gives an empty total',f({st:[]}).total===0&&f({}).stores.length===0);
c('asked as its own question so a refusal loses only this part',/cflStorage\(acc, from, today\)/.test(src)&&/kvStorageAdaptiveGroups/.test(src));
c('card shows size against the 1 GB allowance',/storageBytes: 1073741824/.test(src)&&/function cflStore2/.test(src));
const pg=src.slice(src.indexOf('function cflSize'),src.indexOf('function cflRow'));
c('card code has no backticks or template markers',!/[`]|[$][{]/.test(pg)&&!/[\\]/.test(pg));
let syn=0;try{new Function(pg)}catch(e){syn++;console.log(e.message)}c('card code parses',syn===0);
console.log(ok+' pass, '+bad+' fail');process.exit(bad?1:0);
