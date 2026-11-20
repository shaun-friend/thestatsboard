const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const g=JSON.parse(fs.readFileSync('w/sponsorlist_gate.json','utf8'));let f=0;const ck=(n,o,d)=>{console.log((o?'ok  ':'FAIL')+' '+n+(o?'':' '+(d||'')));if(!o)f++};
ck('page and API are behind the club PIN',g.g);
const html=fs.readFileSync('w/sponsorlist_page.html','utf8');
const rep={ok:true,season:'2026-2027',teams:[{team:'11039',name:'Ivybridge 1XV'},{team:'22',name:'The Vandals'}],sponsors:[
{id:'a',name:'Vets4Pets',players:[{no:'1',name:'Alan Aye',hid:false,team:'11039',teamName:'Ivybridge 1XV'},{no:'2',name:'Bob, "Bobby" Bee',hid:false,team:'22',teamName:'The Vandals'},{no:'1',name:'Alan Aye',hid:false,team:'22',teamName:'The Vandals'}]},
{id:'b',name:'Thatchers',players:[{no:'3',name:'',hid:true,team:'22',teamName:'The Vandals'}]},
{id:'c',name:'Dart Motors',players:[]}]};
const b=await chromium.launch();const p=await b.newPage({viewport:{width:400,height:800},acceptDownloads:true});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.route('**/*',r=>{const u=new URL(r.request().url());
 if(u.pathname==='/sponsor-list')return r.fulfill({status:200,contentType:'text/html',body:html});
 if(u.pathname==='/api/sponsors')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rep)});
 return r.fulfill({status:200,body:''})});
await p.goto('https://thestatsboard.co.uk/sponsor-list');await p.waitForSelector('.sp');
let x=await p.innerText('#ls');
ck('all sponsors show by default, including one with no players',/Vets4Pets/.test(x)&&/Thatchers/.test(x)&&/Dart Motors/.test(x)&&/No players yet/.test(x),x);
ck('a player on two teams is listed once in all teams',(x.match(/Alan Aye/g)||[]).length===1);
ck('under 18 names are not shown',/Name not shown/.test(x));
ck('summary counts',/3\s*Sponsors/.test(await p.innerText('#sm'))&&/3\s*Sponsored players/.test(await p.innerText('#sm')),await p.innerText('#sm'));
await p.selectOption('#tm','22');x=await p.innerText('#ls');
ck('team filter keeps only that team and drops sponsors with none',/Vets4Pets/.test(x)&&/Thatchers/.test(x)&&!/Dart Motors/.test(x)&&/Bob/.test(x)&&/Alan Aye/.test(x));
await p.selectOption('#tm','11039');x=await p.innerText('#ls');
ck('another team',/Alan Aye/.test(x)&&!/Thatchers/.test(x)&&!/Bob/.test(x));
await p.selectOption('#tm','');
const [d]=await Promise.all([p.waitForEvent('download'),p.click('#ex')]);const fn=d.suggestedFilename();const txt=fs.readFileSync(await d.path(),'utf8');
ck('export is a csv named for the team and season',fn==='sponsors-all-teams-2026-2027.csv',fn);
ck('export has header, quoted commas and quotes, and the empty sponsor',/Sponsor,Player,Team/.test(txt)&&txt.indexOf('"Bob, ""Bobby"" Bee"')>0&&/Dart Motors,,/.test(txt)&&/Name not shown \(under 18\)/.test(txt),txt);
ck('export lists a player on two teams once',(txt.match(/Alan Aye/g)||[]).length===1);
await p.selectOption('#tm','22');const [d2]=await Promise.all([p.waitForEvent('download'),p.click('#ex')]);
ck('team export is named for the team',d2.suggestedFilename()==='sponsors-the-vandals-2026-2027.csv'&&!/Dart Motors/.test(fs.readFileSync(await d2.path(),'utf8')),d2.suggestedFilename());
ck('no script errors',!errs.length,errs.join('|'));
ck('fits a phone',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
await b.close();console.log(f?'FAILED '+f:'ALL OK');process.exit(f?1:0)})();
