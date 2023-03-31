A little something.

https://bee-work.netlify.app/


# Úvod
Aplikace by se dala kategoricky zařadit jako hra. Je to malý sandbox s minihrama a cílem působit na estetiku. Všechna důležitá nastavení se ukládají pod přihlášeným uživatelem do databáze, stejně jako skóre na minihrách.

Ústředním bodem je včelka, kterou lze ovládat a která za sebou zanechává mizející dráhu. Hlavním cílem je působit na estetiku a poskytnout zábavné prostředí, ve kterém si uživatel může s včelkou hrát a měnit všechny její vlastnosti. Aplikace obsahuje různé “místnosti” sloužící k různým věcem (hrací plocha, menu pro výběr miniher, obrazovka minihry), mezi kterými se dá skrz portály libovolně přelétat.

# Technologie
Web je dělaný v čistém html a css. Skripty jsou psány v TypeScriptu a kompilovány do JavaScriptu. Web je hostovaný na netlify.app. Jako server jsou využívány netlify stateless funkce, které fungují na node.js. Implementovaná databáze je MongoDB a přistupuje se k ní z netlify funkcí přes Mongoose.

# Stránky
Každá stránka je jedna místnost. Každá místnost má stejnou paletu barev. Přelétání mezi jednotlivými místnostmi univerzálně probíhá přes portály umístěné po levém nebo pravém boku místnosti (podle toho, na které straně se další místnost vyskytuje). Přelet načte novou stránku, ale snaží se zachovat dojem kontinuity, tak, aby aplikace působila jako jeden celistvý kus a ne jako více stránek složených dohromady.

Toho je dosaženo jednak díky umístění včelky na další stránce k příslušnému portálu (v levo nebo v pravo) pro vytvoření dojmu přeletu skrz portál, a druhak díky zachování směru letu - např. když uživatel letí doleva a nahoru, přiletí k portálu, a následně se objeví na další stránce (v další místnosti), stále poletí doleva a nahoru. To funguje skrz odeslání informace o stisknutých klávesách z původní stránky na další pomocí query parameters.

## index.html | Domovská Obrazovka
Slouží jako hlavní stránka - rozcestník pro ostatní stránky. Po levé straně je portál do hrací plochy, po pravé do menu na minihry.

## playground.html | Hrací plocha
Slouží k hraní si se včelkou v sandboxu. Na různých místech se v náhodném intervalu pravidelně vygeneruje malý portál, který včelku přesune na náhodné místo v místnosti předem zaznačené fialovým kolečkem.
### Menu pro změnu vlastností včelky
Umístěno v levém dolním rohu. Lze jej vyvolat tlačítkem Q nebo kliknutím na příslušnou ikonu. Umožnuje změnit následující vlastnosti včelky: rychlost, akceleraci, trvání “ocasu” včelky než zmizí, trvání ocasu včelky v režimu delšího trvání, velikost ocasu včelky.

### Kontrolní panel
Umístěn v horní části obrazovky. Obsahuje následující prvky:

- Slider na změnu barvy ocasu
- Tlačítko na zapnut/vypnutí automatického cyklování barvy ocasu
- Slider pro změnu rychlosti cyklování barvy ocasu
- Tlačítko pro změnu nebo vypnutí režimu autopilota
- Tlačítko pro zapnutí režimu malování
- Slider pro změnu rychlosti malování

### Tlačítko autopilota
Mění režim autopilota. Obsahuje dva režimy:
- “Včelka Mája”: Včelka se náhodně pohybuje a poletuje po místnosti. Navržena tak, aby nenarážela do zdí a pohybovala se rovnoměrně po celé místnosti.
- “Screensaver”: Napodobuje klasický efekt loga na spořiči obrazovky. Letí a odráží se od zdí.

### Tlačítko malování
Zapne režim malování. Nastaví přes obrazovku průhledný černý overlay a umožňuje po něm namalovat libovolnou čáru. Lze vypnout tlačítkem ESC. Když je čára příliš krátká, akce je zrušena a kreslení se neprovede.

Po nakreslení čáry overlay i čára zmizí a po trajektorii čáry začne putovat stejný “ocas” jako má včelka, tvoříc efekt živé svítící kresby.

Implementace kreslení čáry: Čára se kreslí pomocí zaznamenávání eventu o pohybu myši a umístění malého kolečka na každý zaznamenaný bod. Jelikož event o pohybu myši má relativně malou frekvenci a kvůli různé rychlosti pohybu myši je frekvence nekonzistentní, všechny zbývající body mezi dvěma zaznamenanými body jsou vyplněny pomocí algoritmu na hledání všech bodů mezi dvěma body.

### Tlačítko změny rychlosti malování
Mění rychlost, ve které efekt “ocasu” putuje po nakreslené trajektorii. Jelikož frekvence aktualizace hry je fixní kvůli implementaci skrz requestAnimationFrame, je zrychlení dosaženo přeskočeným určitého množství bodů.

## games.html | Menu her
Místnost, která slouží jako rozcestník k minihrám. Minihry jsou zobrazeny v kolečku a fungují jako portál, který včelku přesune do hry.

## avoider.html | Minihra
Minihra, jejíž cílem je vyhnout se míčkům, které přichází z náhodných stran a v náhodných úlhlech, a vydržet co nejdéle. Rychlost, velikost a frekvence generování míčků se postupně zvyšuje.

# Skripty
## global.ts
Globální skript který je přítomen na všech stránkách. Inicializuje globální proměnné a stará se o sdílenou funkcionalitu.

Jelikož je třeba, aby se tento globální skript načetl před ostatními skripty na stránce, exportuje globální array, do které ostatní skripty při svém načtení přidají odkaz na sebe, a global.ts je až bude připravená zavolá.

Inicializuje včelku, třídu starající se o klávesy, a třídu sloužící k detekci kolize. Přidává portály a tlačítka do detektoru kolize, stará se o funkcionalitu tlačítek, určuje úvodní pozici a pohyb včelky založené na query parameters a stará se o slidery na stránce.

## collisionChecker.ts
Globální třída starající se o kolizi na stránce. Singleton byl použit proto, aby nemusel běžet loop na detekci kolize u každého elementu zvlášť, což by bylo neefektivní. Exportuje array, do které lze přidat elementy s callbackem, a elementy budou zahrnuty do detekce. Třda poskytuje eventy na collisionEnter a collisionLeave. Detekce probíhá pravidelným pollováním pozice elementů (MutationObserver by byl ještě méně efektivní).

## vanishingCircle.ts
Třída generující rozmazané kolečko, které postupně mizí. U kolečka lze nastavit barvu, velikost, pozici, rychlost mizení a počáteční hodnotu průhlednosti. Update loop je statický/globální, aby se zbytečně netvořil loop na každé kolečko zvlášť. Při vytvoření nového kolečka se vytvoří element s danými vlastnostmi a přidá se do update loopu. Po dosažení průhlednosti 0 se element odebere.

Algoritmus byl optimalizovaný pro co nejlepší výkon. Frekvence update loopu, množství procesů při každém updatu, přidávání elementu do DOM, způsob odebírání elementů z arraye, caching…

## portals.ts
Třída, která se stará o portály. Při instancování se vytvoří objekt portálu s metodami jako createPortal. Třída také obsahuje statické utility metody jako generateRandomPortal. Objevení a zmizení portálů je animované skriptem.

## pencil.ts
Třída, která poskytuje funkcionalitu ke “kreslení”. Exportuje metody start, stop a changeSpeed. Umožňuje nakreslení trajektorie a její následné “kreslení”/svícení.

## controls.ts
Třída, která spravuje input klávesnice. Exportuje live readonly array, který obsahuje stav předem definovaných kláves, a metody na změnění jejich stavu.

## gameSite.ts
Univerzální skript starající se o ty prvky stránky minihry, které jsou sdílené (/univerzální). To zahrnuje menu/lobby, tabulku se skóre, pause menu a end screen.

## propUtils.ts
Obsahuje pomocné metody pro manipulaci s “uložitelnými vlastnostmi” (typ objektu napříč projektem, který definuje vlastnost, která má maximální, minimální, výchozí a aktuální hodnotu, a kterou lze uložit do localStorage/databáze/kamkoli, a následně ji aplikovat).

## bee.ts
Skript včelky. Pohyb lze ovládat klávesnicí (klávesami WASD nebo šipkami) a zahrnuje zrychlení (acceleration). Rychlost a zrychlení jsou nastavitelné. Včelka za sebou generuje “ocas”/dráhu z koleček z vanishingCircle.ts, u nichž jde skrz včelku změnit všechny jejich parametry (barva, velikost atd.). Včelka exportuje metodu pro uložení jejich vlastností do localStorage a následné aplikování.

## autopilot.ts
Skript pro náhodné poletování včelky. Změna pohybu je vybrána v náhodném časovém intervalu a směr pohybu je náhodný; pokud je včelka ovšem blízko zdi, nepůjde daným směrem, aby se předešlo nárazu do zdi.

## game.ts
Abstraktní třída abstrahující univerzální metody a funkcionalitu pro minihry. Každá minihra z této třídy čerpá. Umožňuje zobrazení achivementu, změnu stavu hry (start/stop/pause/resume) a exportuje různé proměnné.

## randomBallGenerator.ts
Skript pro generování a pohyb míčků v náhodném úhlu. Míčky se vynořují z poza obrazovky v náhodném úhlu a z náhodné strany při definované velikosti, rychlosti a frekvenci. Úhly, při kterých by míček letěl relativně k dané straně příliš šikmo nejsou připuštěny.

## ostatní
- types.ts: Obsahuje univerzální typy (např. Point = { x: number; y: number };)
- utils.ts: Obsahuje globální pomocné metody.
- games.ts: Skript pro stránku games.html. Stará se o funkcionalitu portálů do miniher.
- index.ts: Skript pro stránku index.html.
- playground.ts: Skript pro stránku playground.html. Stará se o implementaci funkcionality popsané v sekci playground.html.
- screenSaverPilot.ts: Skript pro odrážení včelky od zdi pro vytvoření efektu spořiče obrazovky.
- avoider.ts: Obsahuje skript pro minihru Avoider.

# Databáze
Jako databáze byla použita MongoDB. Přistupuje se k ní ze serveru (netlify stateless funkce) skrz Mongoose. Do databáze se ukládají data uživatele, vlastnosti včelky a skóre na minihrách. Podoba odesílaných dat není na serveru ani klientu odhadována, ale je jasně definována v models.ts.

Každý endpoint zahrnuje patřičnou verifikaci dat - Zda obdržený objekt obsahuje všechna nutná data, zda jsou data validní (validace správnosti a délky e-mailu a délky hesla a uživatelského jména…), zda již data v databázi neexistují atd.

Endpoint v případě chyby vrátí patřičný HTTP kód statusu, zprávu popisující chybu, a případně samotnou zprávu chyby. Podoba tohoto objektu je definována v models.ts. V případě úspěchu endpoint vrátí kód statusu 200 a data specifické danému endopintu.

## database.ts
Poskytuje metody ke komunikaci s databází a proměnné, které klient a databáze sdílí. Je to API/prostředník/abstrakce mezi databází a klientem.

## models.ts
Obsahuje mongoose modely objektů v databázi (interface, schema a model). Slouží k jasné definici podoby modelů a poskytnutí jednotného API pro jejich vytváření.

## login-user.ts
Endpoint zodpovídající za přihlášení uživatele. Obdržené heslo je zahashováno, posoleno patřičnou solí, a porovnáno s heslem v databázi.

## register-user.ts
Endpoint zodpovídající za registraci uživatele. Ukládá se uživatelské jméno, zahashované a posolené heslo, a e-mail.

## update-user.ts
Endpoint zodpovídající za aktualizování dat uživatele.

## add-score.ts
Endpoint zodpovídající za ukládání skóre na minihrách. Za každého uživatele je vždy uloženo jen jedno skóre, a to to nejlepší.

## get-scores.ts
Endpoint zodpovídající za získávání skóre z databáze. Databáze přijímá objekt skóre, na základě kterého hledání provádí. Objekt skóre obsahuje čistě jen vlastnosti, které chce klient hledat (např. může obsahovat jen id uživatele, ale i konkrétní skóre, čas vytvoření atd.)

# Minihry
Aplikace obsahuje několik miniher. Co se týče front-endu, každá minihra sdílí stejné menu/lobby, design achivementu, tabulku se skóre, pause menu a end screen - specifické je jen samotné prostředí hry. Proto každá minihra obsahuje univerzální skript gameSite.ts, který se o tento interface stará.

Mimoto sdílí některé stejné proměnné a funkcionální metody - start, stop, pause, resume, update atd. Proto je tato funkcionalita abstrahovaná do jedné třídy, ze které konkrétní hry můžou jen začít čerpat, a všechno mají připřavené. Třída tak funguje jako game framework.

# Závěr
Aplikace byla vytvořena jako takové “potvrzení konceptu”. Neměl jsem žádnou konkrétní myšlenku, jen jsem postupně vytvářel, co mě napadlo, a chtěl jsem prozkoumat, jakým směrem se to bude rozvíjet a jak daleko se můžu v oblasti estetiky a samotného konceptu včelky dostat. Praktický přínos je tedy primárně v předvedení techniky, možností, a samotného nápadu. Hodnotu ovšem má i v estetice, zajímavosti, a skrz minihry i v zábavě. Minihry přináší výzvu a díky online skóre i soutěžení.

Zklámáním bylo, že na vývoj aplikace nebyl prakticky žádný čas. Například bylo zamýšleno obsáhnout více než 5 miniher, ale byly dokončeny jen dvě. Bylo zamýšleno aplikaci zpracovat lépe graficky. Bylo zamýšleno přidat online multiplayer. Bylo zamýšleno přidat další místnosti. Zároveň bylo zamýšleno zlepšit celkovou architekturu kódu - jelikož v typescriptu bězně nepracuji, nemám ještě tak osvojené klasické vzorce architektury.

K vyzdvihnutí je ovšem kvalita kódu. Na kvalitu, rozšiřitelnost a dodržování dobrých principů programování se soustředím vždy, a tady to nebyla vyjímka. Kód se neopakuje (DRY), je co nejkratší a nejoptimalizovanější, dodržují se programovací konvence, univerzální kusy kódu jsou abstrahované do vlastních tříd, věci nejsou hard-coded, kód je patřičně rozdělen do tříd, souborů a modulů, je abstrahovaný a kde je to možné je využíváno inheritance, je plně využíváno typů typescriptu…
