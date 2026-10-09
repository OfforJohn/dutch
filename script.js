const samples=[
 "Hoi mam, mijn telefoon is kapot dit is mijn nieuwe nummer. Kan je me snel helpen met een betaling van 485 euro? Ik betaal het morgen terug. Spoed!",
 "PostNL: Uw pakket kon niet worden bezorgd. Betaal €1,95 verzendkosten binnen 24 uur via https://postnl-bezorging-nl.xyz/pakket",
 "Beste klant, uw laatste factuur is niet betaald. Uw abonnement wordt vandaag geblokkeerd. Log direct in en verifieer uw gegevens: http://bit.ly/3xYz",
 "Hey! Zin om zaterdag te voetballen? We beginnen om 14:00 bij het park."
];
const rules=[
 {re:/(nieuw(e)? nummer|telefoon is kapot|mijn oude telefoon)/i,w:30,t:"Iemand zegt een nieuw nummer te hebben. Bel het oude nummer om te checken."},
 {re:/(spoed|snel|direct|vandaag nog|binnen 24 uur|onmiddellijk|zo snel mogelijk)/i,w:20,t:"Er wordt haast gemaakt. Oplichters willen dat je niet nadenkt."},
 {re:/(€|euro|betaal|betaling|overmaken|tikkie|geld)/i,w:15,t:"Er wordt om geld of een betaling gevraagd."},
 {re:/https?:\/\/|www\./i,w:15,t:"Het bericht bevat een link. Klik niet, ga zelf naar de officiële site."},
 {re:/(bit\.ly|tinyurl|t\.co|\.xyz|\.top|\.info|\.click|-nl\.|nl-)/i,w:25,t:"De link is verkort of heeft een vreemd domein."},
 {re:/(geblokkeerd|verloopt|afgesloten|opgeschort|laatste waarschuwing)/i,w:20,t:"Er wordt gedreigd met blokkeren of afsluiten."},
 {re:/(verifieer|bevestig uw|inloggegevens|wachtwoord|pincode|code die je krijgt)/i,w:25,t:"Er wordt gevraagd om in te loggen of gegevens te bevestigen."},
 {re:/(beste klant|geachte klant)/i,w:10,t:"Je wordt niet bij naam aangesproken."}
];
const $=s=>document.querySelector(s);
document.querySelectorAll('.samples button').forEach(b=>b.addEventListener('click',()=>{$('#msg').value=samples[b.dataset.s];check()}));
$('#run').addEventListener('click',check);
function check(){
 const txt=$('#msg').value.trim(), r=$('#result');
 if(!txt){r.innerHTML='<h3>Resultaat</h3><p class="empty">Plak eerst de tekst van een bericht in het vak.</p>';return}
 let score=0,hits=[];
 rules.forEach(x=>{if(x.re.test(txt)){score+=x.w;hits.push(x.t)}});
 score=Math.min(score,100);
 let cls,title,advice,color;
 if(score>=50){cls='verdict-high';title='Grote kans op fraude.';advice='Reageer niet, klik niet en betaal niets. Meld het bericht.';color='#FF7621'}
 else if(score>=20){cls='verdict-mid';title='Let op.';advice='Er zitten verdachte signalen in. Check bij de afzender via een ander kanaal.';color='#FFAC24'}
 else{cls='verdict-low';title='Geen duidelijke signalen.';advice='We zien niks verdachts. Blijf wel opletten bij links en betaalverzoeken.';color='#2F9A92'}
 const esc=s=>s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 r.innerHTML=`<h3><span class="badge ${cls}">${title}</span></h3><p style="margin:0">Risicoscore: <b>${score}/100</b></p>
 <div class="meter" role="img" aria-label="Risicoscore ${score} van 100"><i></i></div>
 ${hits.length?'<ul>'+hits.map(h=>'<li>'+esc(h)+'</li>').join('')+'</ul>':''}
 <p style="margin:14px 0 0"><b>Advies:</b> ${advice}</p>`;
 requestAnimationFrame(()=>{const i=r.querySelector('.meter i');i.style.background=color;i.style.width=Math.max(score,4)+'%'});
}
