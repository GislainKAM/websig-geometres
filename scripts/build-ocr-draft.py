# -*- coding: utf-8 -*-
"""
Génère les fichiers CSV/JSON de brouillon à partir de la transcription visuelle
de HPSC0177.pdf (Tableau OGEC 2026, Ordre National des Géomètres du Cameroun).

STATUT : transcription relue le 2026-08-19. Voir data/ocr-draft/README.md.
Ce script n'est pas destiné à être ré-exécuté (pas de logique OCR réelle) —
c'est juste le moyen le plus fiable de committer ~242 lignes sans erreur de
copier-coller manuel. Les données sont transcrites à la main (lecture visuelle
image par image), pas produites par un moteur OCR automatique.

La relecture du 2026-08-19 a modifié tableau-ogec-2026.json à la main
(champs `statut` et `date_verification` — pas les 242 lignes elles-mêmes,
pas rejouées ici) : voir data/ocr-draft/README.md pour la méthode et la
portée exactes. Ce fichier reste la trace de la transcription initiale, pas
un reflet à jour de `statut`.
"""
import csv
import json
import os

OUTDIR = os.path.join(os.path.dirname(__file__), "..", "data", "ocr-draft")
os.makedirs(OUTDIR, exist_ok=True)

# --- Liste 1 : Géomètres autorisés (études topo, expertises, évaluations foncières, clientèle privée) ---
liste1 = [
["1","NOUNAMO F. Gustave","A011","Nounamo","Bandjoun","676 40 95 82","nounamofotso@yahoo.fr"],
["2","NLEND Albert","A033","Soprafair","B.P. 6200 Yaoundé","677 57 52 84","soprafair@yahoo.fr"],
["3","EVENGUE ELLA JOSEPH","A035","Cabinet EVENGUE","Yaoundé","677 63 29 53","josephevengueella@gmail.com"],
["4","KOUAWA Norbert","A037","Kouawa map Cameroun","B.P. 11114 Yaoundé","677 56 02 40","Kouamap88@yahoo.fr"],
["5","Cab.NJOMGANG Henri (Nchottou M Ahmed ai)","A038","Geo Design Biz Sarl","B.P. 5642 Yaoundé","670699195","henrinjomgang@yahoo.fr"],
["6","JUOMPAN-YAKAM Bertrand","A041","SGDS","B.P. 5907 Yaoundé","699 91 02 85/+33611312662","b.juompan@sgds.fr"],
["7","YAMBOU Elie","A042","Yambou","Yaoundé","699 61 01 41","yambouelie@yahoo.fr"],
["8","Cab.WEYEPE Samuel (Ze Ruben ai)","A045","CERTTOC","BP 13298 Yaoundé","699993265","weyepecerttocing@yahoo.fr"],
["9","ZE Ruben","A049","Ze Ruben","BP 34560 Yaoundé","699 97 83 81","zeruben.rz@gmail.com"],
["10","NCHOTTOU M. Ahmed","A050","NIS Sarl","BP 3726 Messa Yaoundé","674 74 11 61/620721192","ceo@nissarl.com"],
["11","NGOUAJIO MEZATIO Louis Ramel","A051","NGOMEZ ENGINEERING Sarl","BP: 5520 Yaoundé","670142970/697862315","louisramel.ngouajio@gmail.com"],
["12","NGATCHOUA Pierre Barthélémy","A052","LOTIRMAX","B.P 5316 Douala","670 94 20 30","direction@lotirmax.com"],
["13","KOUOGANG KOUAM Cyrille","A053","Geoterre SARL","B.P: 25059 Douala","691 93 67 31","cabinetgeoterre@gmail.com"],
["14","Cab.ATANGANA Pierre Dieudonné (Nchottou M Ahmed Ai)","A054","GEOIDE SARL","B.P. 4222 Yaoundé","693269116","atanganapierre2006@yahoo.fr"],
["15","OHANDJA ONANA Juste Prosper","A055","PROS ENGINEERING SARL","B.P. 1431 Yaoundé","690 69 42 18/677 64 74 89","justeohandja@gmail.com"],
["16","TAH Georges AWAZI","A056","Cam Surveys Co Ltd","Bamenda","677 26 88 41","tahawazi@yahoo.com"],
["17","KOUOH KOUOH Leonard","A057","GEOMAT-2000","B.P. 1431 Yaoundé","699 38 06 91","leonard_kouoh@yahoo.fr"],
["18","MBOGNE Sylvain","A059","PPM TOPO","Yaoundé","678 25 54 04","mbosyl@yahoo.fr"],
["19","Jerry Wylliam MANGELE","A061","CGEJM","Bertoua","696254048","cgejm2024@gmail.com"],
["20","BOUNGO Louis Marie","A062","SATEC ENGINEERING SARL","Yaoundé","677756682/696217725","lmboungo@gmail.com"],
["21","TCHOUANGMO NGANDON Armand Romual","A063","ART Engineering SARL","Yaoundé","698003340","atchouangmo@yahoo.fr"],
["22","SIEWE Marc","A064","SIMA CORPORATION","Douala","699 94 33 71","marcsiewe@yahoo.fr"],
["23","BEMBA LIMALEBA Mathurin Olivier","A065","Cabinet BEMBA TOPO","Douala","695085966/675152253","mathurinbembalimaleba@gmail.com"],
["24","TCHANA BOPA Bertin Alain","A066","BTA SURVEY SARL","Yaoundé","690050675/699097587","tchanabopa@yahoo.fr"],
["25","MBEL Célestin","A067","ETS SOYUZ GEO","Bafia","659261054","mbelcelestin@yahoo.com"],
["26","NANA Bruno","A068","Nana Geomatics","Douala","651594377","bnana@nanageomatics.com"],
["27","TCHOUKAH SOH Joseph","A069","SOH ENGINEERING","Edea","679 44 96 71","tchoukahjoseph@yahoo.fr"],
["28","TACHEU DJOMO Arnaud","A070","ATGex Consulting","Kribi","699006997/+32 465 73 21 57","arnaud1490@gmail.com"],
["29","NSIDZE KOUAGAING Ulrich Placide","A071","ALL4BUILD SARL","Douala","692026376/+32 493 89 91 82","nsidzed@yahoo.fr"],
["30","FOTSA TSOPZE Muriel Rostand","A072","Geosurvey Engineering","Maroua","672663895/656203226","geosurvey29@gmail.com"],
["31","TONFACK FOZEING Christian Claude","A073","SCP GLONAS Ltd","Douala","693272193","fozeing@gmail.com"],
["32","KODJO BIAKETCHA Gilles Alex","A074","SCP GLONAS Ltd","Douala","670 320 540","gilleskodjo@yahoo.fr"],
["33","KUEDONG Manje Phidas","A075","INNOVGEX Consulting","Douala","696 138 995","phidaskuedong@gmail.com"],
["34","GNIMPIEBA ATONFACK Jacques Bertrand","A076","Intellect Corporation Solution","Kribi","672 844 848","gnimpiebaatonfackjb@gmail.com"],
["35","KEMAYOU Frank Passy","A077","GEOMATECH","Dibombari","699 327 466","frankpassykemayou@gmail.com"],
["36","TCHUISSE TCHOUJEN Micarel Charnel","A078","LIDAR ONE","Ebolowa","698 787 902","mtchuis@gmail.com"],
["37","TOUKAP DJOMO Franck Pierre","A079","Geo Bati 3.0","Dibamba","655030815","pierretoukap@yahoo.fr"],
["38","CHRYS FOTSO Venceslas","A080","PEEV SARL","Kribi","696 088 990","peevcm@gmail.com"],
["39","LEMBE Dezalabert Daniel","A081","Cabinet LEMBE","Douala","699 60 46 31","cabinetlembe@gmail.com"],
["40","CHENDJOU NGNIENASSI Stephane","A082","CHES ENGINEERING","Douala","695 084 532","chendjoustephane71@gmail.com"],
]

# --- Liste 2 : Géomètre Expert Honoraire ---
liste2 = [
["1","OMBOUDOU NDJINA Fabien","A028","B.P. 471 Dla","677 75 20 36","7.engineering@gmail.com"],
["2","NJIKI David","A032","B.P. 30610 Ydé","675 08 95 91",""],
["3","NGASSA KOUYNOU Joseph","A036","B.P. 25187 Ydé","677 75 97 73","Cameroon_survey@hotmail.com"],
["4","MBOGLE Jacques","A058","Bp 646 Edea","699 93 34 39","jmbogle2007@yahoo.fr"],
["5","KEWE Joseph","A034","B.P. 7810 Ydé","699 91 91 86","Joskewe@yahoo.fr"],
]

# --- Liste 3 : Géomètres Experts inscrits, autorisés expertises + études topographiques ---
liste3 = [
["1","LEMOGO OUAMBAPO Thierry Luc","B053","MAETUR","B.P. 1248 Yaoundé","697 63 59 35","lemogothierry@yahoo.fr"],
["2","KAFACK KENFACK Serge Bertrand","B056","SDC-MINDCAF/Nyong et So'o","Mbalmayo","674 28 94 95","skafack@gmail.com"],
["3","EVAGA EYEBE Ghislain Wilfrid","B057","Mise en disponibilité","Yaoundé","675 057 752","gwilfridevaga@gmail.com"],
["4","DJIZO TATSAKENG Eric","B058","SDC-MINDCAF/Nyong et So'o","Mbalmayo","677 81 82 45","edjizo@yahoo.fr"],
["5","MEKONG Martial Didier","B059","DCAD/MINDCAF","Yaoundé","675 97 88 94","didier_mendy@yahoo.fr"],
["6","PAWA FOHOM Rodrigue","B060","SRC-MINDCAF/Littoral","Douala","670119097/699604235","wapuslevirus95@gmail.com"],
["7","NTSAM Rodrigue","B061","SDC-MINDCAF/Boumba et Ngoko","Yokadouma","694 39 01 57","ntsam5@yahoo.com"],
["8","TCHUWANG TCHAKOUTIO Arsène","B062","SDC-MINDCAF/Wouri","Douala","675 43 35 19","arsenezz@yahoo.com"],
["9","MOUSSENI Guy Anderson","B063","DAG/MINDCAF","Yaoundé","674 34 82 80","mousgander@yahoo.fr"],
["10","MEFFO BOGNING Irene Epse LEUTOU","B064","SDC-MINDCAF/Mfoundi","Yaoundé","674830752/697300035","meffoirene2008@yahoo.fr"],
["11","MPON Agnès Christelle Epse KEDE","B065","SRP-MINDCAF/Centre","Yaoundé","651 12 34 01","agnesmpon@yahoo.com"],
["12","NDAMUKONG MESSIE Cliff","B071","SDC-MINDCAF/Mezam","Bamenda","679 28 49 36","ndamukongcliff2@gmail.com"],
["13","MANWOUE Gaspard","B072","SDC-MINDCAF/Mifi","Bafoussam","679 77 20 36","gaspard.manwoue@gmail.com"],
["14","MOUYENGA MBWANGUE Pierre","B073","SRC-MINDCAF/Est","Bertoua","675 86 61 12","pierremouyenga@yahoo.fr"],
["15","IDJOLOM ONGOLO Cunegonde","B077","DD-MINDCAF/Kadey","Batouri","699320200","idjolom@yahoo.fr"],
["16","BOMONO BESSILIKI Luc Roi","B081","DCAD/MINDCAF","Yaoundé","673715245","lucbomono@gmail.com"],
["17","NYUYKI Daniel","B082","DCAD/MINDCAF","Yaoundé","679 63 48 40","nydal2000@yahoo.co.uk"],
["18","DJONFANBE Joël","B083","DCAD/MINDCAF","Yaoundé","677677812","djonfanbe@yahoo.fr"],
["19","NGWEM Maurice Emmanuel","B084","DAG/MINDCAF","Yaoundé","674 91 89 64","ngwemmaurice@gmail.com"],
["20","TSAFACK LAPNET Armel","B085","SDC-MINDCAF/Mfoundi","Yaoundé","674 73 31 41","tsafackarmel3@gmail.com"],
["21","WAMEN NDJEUTCHAM Hervé","B086","DCAD/MINDCAF","Yaoundé","677465812","wamen98@gmail.com"],
["22","DJOUPE FOKA Marlise","B087","SRC-MINDCAF/Centre","Yaoundé","676 39 38 31","dilomarly27@gmail.com"],
["23","DJAPEN NKAMGA Gaëtan","B088","SDC-MINDCAF/Lekié","Monatélé","674 02 04 10","gaetandjapen007@yahoo.fr"],
["24","KENMOGNE TINDJOU Monique Krystel Epse TAGUETCHUEN","B089","SDC-MINDCAF/Mifi","Bafoussam","658888480","taguetchuenkrystel@gmail.com"],
["25","BISSA Lucienne Margaret","B090","SRC MINDCAF/Centre","Yaoundé","679 90 24 21","bissa_lucienne@yahoo.fr"],
["26","TSAFACK MANETSA Dorette","B098","DCAD/MINDCAF","Yaoundé","677 44 85 32","tsafackdorette@yahoo.fr"],
["27","MBAZO'O MEVA Steve Arnaud","B095","SRC-MINDCAF/Centre","Yaoundé","696219628","mbazoomeva@gmail.com"],
["28","NNANGA Nadine Gabrielle epse TANGUE","B099","SDC-MINDCAF/Mefou et Afamba","Mfou","675 22 22 75","gabrielle.nnanga@yahoo.fr"],
["29","ZHELL EPANDO Jerry Josimar","B100","PAD","Douala","652 63 66 02","jerryepando@yahoo.fr"],
["30","MAGOUH NAOUSSI Carine Epse DIFFO","B103","SDC-MINDCAF/Mefou & Akono","Ngoumou","678 08 96 72","magouh_naoussicarine@yahoo.fr"],
["31","CHE Clement MUMBARI","B105","SDC-MINDCAF/Ndian","Mundemba","679 75 18 01","che_cle2004@yahoo.com"],
["32","YEME Julienne Clarisse","B107","CUD","Douala","691241947","yemejulienneclarisse1@gmail.com"],
["33","GUEGUENG MONDE Fidéle","B108","DCAD/MINDCAF","Yaoundé","696680590","gueguengmonde@yahoo.fr"],
["34","FOTSING NZOGNE Guy Rostand","B109","SDC-MINDCAF/Mifi","Bafoussam","699253606","guyfotsing9@yahoo.fr"],
["35","DONGMO KAMDOUM Georges William","B110","SDC-MINDCAF/Moungo","Nkongsamba","671356527","georges.dongmo@gmail.com"],
["36","MESSANGA ESSAMA Patrick Ghislain","B114","SDC-MINDCAF/Bamboutos","Mbouda","691 53 00 78","patghimess@yahoo.fr"],
["37","DJAGBA Dari","B116","SDAF-MINDCAF/Mbere","Meiganga","678 73 75 33","dari.djagba@gmail.com"],
["38","FOFACK TEBON Gaspary Christopher","B117","DD-MINDEVEL/Ngoketunjia","Ndop","694669559","ftgchrist@yahoo.fr"],
["39","MBIANDA NGEUMEN A. Epse EKEU","B119","SRC-MINDCAF/Centre","Yaoundé","677 77 82 50","ariellembianda872@gmail.com"],
["40","BIYA NYAMYA Christian","B120","SRC-MINDCAF/Litorral","Douala","672 121 155","cbiya82@gmail.com"],
["41","MBENMUN NGUSAMA Claude Prospère","B121","MAETUR","Yaoundé","697031929","ngusamamcp@gmail.com"],
["42","TOUOFO Gutemberg","B123","SDC-MINDCAF/Menoua","Dschang","677 83 08 98","touofo@yahoo.fr"],
["43","POLLA KAMELA Armand Joël","B124","DD-MINDCAF/Mefou et Afamba","Mfou","677 42 42 30","pollajoel88@yahoo.fr"],
["44","ABINA David Martial","B125","SDC-MINDCAF/Mefou et Akono","Ngoumou","694 92 54 20","abinadaserge@yahoo.fr"],
["45","NKEMCHIA Fritz TENGHOMOH","B128","DD-MINDCAF/Mayo-Kani","Kaélé","674 26 79 35","fritz2002n@yahoo.com"],
["46","ANJOH TIBUK KAYOU Romeal Jacques","B130","SRD-MINDCAF/Littoral","Douala","699 41 69 29","Anjoh_romuald@gmail.com"],
["47","FAN-NDOUM Fabien","B131","SDC-MINDCAF/Mayo Danay","Yagoua","696837942","fanndoumfabine5@gmail.com"],
["48","ALI HASSANA","B132","SRC-MINDCAF/Nord","Garoua","691275519","alihassanaali61@gmail.com"],
["49","TCHATAGNE TCHINDA Achille","B134","SDC-MINDCAF/Mefou & Akono","Ngoumou","674 23 58 20","achillo_tchat@yahoo.fr"],
["50","AMOUGOU Enrique Griffon","B135","DR MINDCAF/Littoral","Douala","699628090",""],
["51","TOUGNINE Philibert Roméo","B136","SDC-MINDCAF/Wouri","Douala","652 92 84 86","rtougnine@yahoo.fr"],
["52","NDJEMBA Alain Claude","B137","DCAD/MINDCAF","Yaoundé","677 46 17 45","ndjemba2002@yahoo.fr"],
["53","OUSMANOU AMINATOU Epse ALI","B138","DCAD/MINDCAF","Yaoundé","677 24 21 70","ousaminatou@yahoo.fr"],
["54","TSANGA Jean Achille","B139","DCAD/MINDCAF","Yaoundé","677 61 45 50",""],
["55","TCHITOUO NTENZOU Fanny Stella","B143","SGDS International","Evry-Courcouronnes, France","+33 6 69 65 66 98","fanny.tchitouo@yahoo.fr"],
["56","GAHEME ZOUMTEGAI Aminatou Épse KALDAOUSSA","B148","MINDCAF","Yaoundé","675364380","adelekalda@gmail.com"],
["57","ASANJI Laurence","B150","SRC-Litorral/MINDCAF","Douala","677155265","djsanj316k@yahoo.com"],
["58","FRANKLIN NKE FOMELACK","B151","SDC-MINDCAF/Fako","Limbe","677427089","frankfomelack@hotmail.com"],
["59","DONFACK TEMATIO Blanchard","B152","SDC-MINDCAF/Sanaga Maritime","Edéa","676407387","blantematio@gmail.com"],
["60","NANA Oumarou","B155","DCAD/MINDCAF","Yaoundé","675499192","oumarou456@gmail.com"],
["61","PEKWANG Ghislain PUWAKE","B156","SDC-MINDCAF/Wouri","Douala","670347217","puwake502@yahoo.fr"],
["62","ABOUDI ESSAMA Salomé","B158","SDC-MINDCAF/Mfoundi","Yaoundé","679491838","aboudinadege5@gmail.com"],
["63","BELIBI ATEBA Pétronille Mathilde","B161","DETROA/MINTP","Yaoundé","674961478","belibi_pro2017@yahoo.fr"],
["64","WOTCHAP Jean Simplice","B162","SDC-MINDCAF/Lekié","Monatélé","675004804","w5plice@gmail.com"],
["65","Emile Magloire NGUIAMBA BOPFOURE","B163","DCAD/MINDCAF","Yaoundé","696851754","emile.nguiamba2@gmail.com"],
["66","METOUAM BITOM Jules-César","B168","PAD","Douala","675226713","mbjc2017@gmail.com"],
["67","TEMGOUA DONFACK Francois Hermann","B171","COGEC Sarl","Yaoundé","697708379","wufranc@gmail.com"],
["68","NSONGAN GABRIEL RODRIGUE","B172","DD-MINDCAF/Mifi","Bafoussam","672332915","rodrigue6962@gmail.com"],
["69","TCHIPGANG TIGANG Ghislain","B173","","Yaoundé","677304467","ttghislain@gmail.com"],
["70","GOUFAN A DONG Ruth Liliane","B174","SDC-MINDCAF/Wouri","Douala","690400187","lilianegoufan81@gmail.com"],
["71","TCHOKOUAHA WONTCHEU Herve Joel","B176","Cabinet Ze Ruben","Yaoundé","696419494","tcjoel3@gmail.com"],
["72","BIDIAS ANOK Ange Parfait","B177","DAG/MINDCAF","Yaoundé","677242764","bidiasangeparfait@gmail.com"],
["73","GUIDO MBELLA David","B178","CUD","Douala","696303208","davidguidiombella@gmail.com"],
["74","MEJIOKEU ALEX Raphael","B179","Lycee Technique Bilingue de Kribi","Kribi","694745097","mejiokeuraphael@yahoo.fr"],
["75","NGUESSI POKAM Aubin","B180","SDC-MINDCAF/Mefou & Afamba","Mfou","698 290 355","aubinpokaam@ymail.com"],
["76","LAKDJOLBE Benjamin","B184","SDC-MINDCAF/Lekie","Monatéle","694 281 266","blakdjolbe@yahoo.fr"],
["77","NZESSEU TCHOUNANG Bruno Wilfried","B185","Geoprocess","Yaoundé","697798629","nzesseubruno@gmail.com"],
["78","NKAMGA NKAMGA JOEL","B186","","Yaounde","672588025","joelnkamga@gmail.com"],
["79","DOUNGMO WAKEM YANNICK ARTHUR","B187","Organisation Mondiale de la Santé","Brazzaville, Congo","242055967071","yannickdoungmo@gmail.com"],
["80","CHEFOR YMELE DEMEVENG Derrick","B188","UNFPA","Nairobi, Kenya","695900764","demeveng@gmail.com"],
["81","FOTSO CHATUE DEYRIS Blaise","B189","SDC-MINDCAF/Mfoundi","Yaoundé","671 244 507","blaisefotso21@gmail.com"],
["82","ATANGANA Jacques Landry","B190","SIC","Yaoundé","694 250 196","atangana1991@gmail.com"],
["83","ATANGA AYANGMA Eric Bertrand","B191","ESTIA SYNERGIE","Douala","698 062 866","eatanga237@gmail.com"],
["84","SAMOUBEU KOUAKAM ALAIN","B192","PROS Engineering","Yaounde","696 231 156","alainsamoubeu@yahoo.fr"],
["85","MAFFOUO Ulrich TCHOUANWO","B194","Le Rois des Chantiers (LRC)","Libreville, Gabon","693 177 693","ulrichnakamura@gmail.com"],
["86","KENNE NZOYIM Martinien","B196","NdF Contractors","Dibamba","670 308 388","knzoyim@outlook.com"],
["87","NDAME MONGO Emile Cedric","B198","GEOTOP","Cotonou, Benin","694987987/674114880","mongoemile@gmail.com"],
["88","ETAME EKOBE Charles Martial","B197","INGEO PROJECT","Yaoundé","697 202 928","martial.etame32@yahoo.fr"],
["89","TCHOUNDJA BANGYA Suzanne Jaurelle","B199","GLOBAL MAP LUMIA","Yaoundé","691 160 610","jaurelle.bangya@gml-co.com"],
["90","MBOH MANYO Samuel OBEN","B200","SRC-MINDCAF/Centre","Yaoundé","698 689 113","mbohsamuel@yahoo.com"],
["91","ESSELEM NGANGUE Maximillien","B203","Alpha Engineering","Yaounde","694 879 365","esselemngangue@yahoo.fr"],
["92","NJIKE NGASSAM Francis","B204","SRC-MINDCAF/Ouest","Bafoussam","675 179 326","frangassam2014@gmail.com"],
["93","SUHAZEMO PROMBO Mical Epse PENKA","B206","CEGELEC Cameroun","Bertoua","678 317 942","michalprombo@gmail.com"],
["94","AYAMBA TAKU Raoul","B207","DDMI/MINDEF","Yaoundé","677 961 164","ayambatakuraoul@yahoo.com"],
["95","DONGMO WAMSA Paul Kevin","B208","KWL","Yaoundé","656553397","Kevin.paul43@yahoo.fr"],
["96","MEYO MOVIRAGNO Payrick","B210","SDC-MINDCAF/Mfoundi","Yaoundé","697570054","pmovi@yahoo.com"],
["97","DOUANLA Fadel","B211","SDC-MINDCAF/Mefou et Afamba","Mfou","690020653","fadeldouanla@gmail.com"],
["98","BELINGA Pie-Roger","B212","SDC-MINDCAF/Mfoundi","Yaoundé","693462762","pie88paolo@yahoo.fr"],
["99","MEZAAGUE Patrick Boris","B215","Cetic d'Ekali/MINSEC","Mfou","694151794","patrickmezaague@yahoo.com"],
["100","PAMEN DAMTSE Aristide Fabrice","B216","SDC-MINDCAF/Lekie","Monatele","690020653","arispamen@gmail.com"],
["101","MOFOR Oliver NGU","B218","GML","Nkolafamba","674567669 (whatsapp)","mofor_oliver.n@yahoo.com"],
["102","AYISSI Issemou Myriam Jasmine","B217","Pizarroti","Yaoundé","655927892","jasmine.ayissi@yahoo.fr"],
["103","KOUAKA KOUAKA Hermandes Junior","B219","SDC-MINDCAF/Ocean","Kribi","696684789","hermandeskouaka@gmail.com"],
["104","DONGMO KALEFACK Patrick","B220","SDC-MINDCAF/Moungo","Nkongsamba","655913165","patrickdogmok@yahoo.com"],
["105","MOUNGUE Prince BAHFOKUM","B221","CABINET PROS ENGINEERING","Yaoundé","677375909/690039133 (MTN WhatsApp)","magicprince346@gmail.com"],
["106","NJAHAN BIANDA Rolande Tatiana","B222","TRETO'O ENGINEERING Sarl","Yaoundé","696091358","tatianabianda@gmail.com"],
["107","MOUDIO MPONO Danielle Laure","B223","SRC-MINDCAF/Centre","Yaoundé","693815679","mdaniellelaure@yahoo.fr"],
["108","KAMGANG Roger","B224","CFHEC","Yaoundé","699685416","rogerkamgang@yahoo.fr"],
["109","TEMGOUA KENFACK Roussel","B225","Lycee de Lobo/MINSEC","Lobo","676012141","temgouaroussel@gmail.com"],
["110","EMOLE MAMBO Kassandra","B226","MINFOPRA","Yaoundé","699201686","kassandraemole01@gmail.com"],
["111","NGOUANDJE Arnaud","B227","Pros Engineering","Yaoundé","674129247","ngouandje@gmail.com"],
["112","NGAMENI DJIMENI Pierre Jordan","B228","Land Management and Computing Services (LM&CS)","Yaoundé","696885736","ngamenipierremoi@gmail.com"],
["113","BELIBI Benoit Roger","B229","PROS ENGINEERING","Yaoundé","695654721","benoitrogerb@gmail.com"],
["114","TENGUIA TENGUIA Vigny Jordan","B230","NGOMEZ","Yaoundé","673918955","vignyjordan130@gmail.com"],
["115","TCHOTCHA FAH Yrving Rommel","B231","","Yaoundé","696255169","rommelfah@gmail.com"],
["116","BALIABA ASSALA Eddy Patrick","B232","Cabinet NIS","Yaoundé","(+237)699951247/654983239","baliabaeddy1002@gmail.com"],
["117","NDZE SUILABAYU Francis","B233","SATEC ENGINEERING SARL","Douala","677485951","francisndze31@gmail.com"],
["118","TALLA Steve Rudich","B234","SGIC","Yaoundé","678263238","tallarudich@yahoo.fr"],
["119","MBARGA MBARGA Tobie Camille","B236","Université d'Ebolowa/Enset","Ebolowa","677526406/691175425","mbarga2005@yahoo.fr"],
["120","NTUEH MFETIE Salihou","B237","SCP GLONAS Ltd","Douala","694308243","salifntueh@yahoo.fr"],
["121","JANVIER BOUOTO Gaëtan Frank","B238","HEVECAM","Niété","697613451","bouotojanvier@gmail.com"],
["122","ATINE Vincent TABI","B239","DR/MINMAP Sud","Ebolowa","69178480","atometabivincent@gmail.com"],
["123","TIBAM Jonas Hamadou","B240","Khayroual Group S.A","Yaoundé","696811344","jonastibam97@gmail.com"],
["124","NGOUMOUN MACHE Franck Borel","B241","CETIC de Nkolbiyen/MINSEC","Mbankomo","694208419","franck2blcr@gmail.com"],
["125","FOPA KENNE Derick Martial","B242","Pros-Ingeneering","Yaoundé","696826069","fkderick@gmail.com"],
["126","JIMDJIO NGANTCHU Gyslain","B243","DLT arpenteurs géomètres","Quebec, Canada","6937788/+1 418 254 9354","njimgys29@gmail.com"],
["127","MOUNGA Jacques Michel","B244","SATEC ENGINEERING SARL","Yaoundé","699955562","mounga.jacquemichel@yahoo.fr"],
["128","ANAKEU NGUETSE Jacky F Epse DONGMO","B245","PAC International","Yaoundé","696123255","jackyfrance8@gmail.com"],
["129","TEDAYEM Gabi Franck Junior","B246","TDR Consulting","Yaoundé","696143901","tedayemfranck@gmail.com"],
["130","VACHALA Abdoul Hamid","B247","Cerbat","Maroua","693398647","varfa45@gmail.com"],
["131","DOMCHE Hugus Merleau","B248","DAET/MINTP","Yaoundé","674616595","merleau2007@yahoo.fr"],
["132","LIDOU MBOUTNGAM Abdou Wassiou","B249","","Yaoundé","695576466","abdoulidou03@gmail.com"],
["133","MBAGNA Yves Chancel","B250","","Yaoundé","690966296","yvesmbagna10@gmail.com"],
["134","TCHEBEBIA NYABA Karl Henri","B251","GEOSPACE AFRICA","Douala","697942861","karltchebs8@gmail.com"],
["135","KOFANE NTSACKO Sylvain","B252","Uni Sherbroucke","Longueuil, Canada","655337647","skofanentsacko@yahoo.com"],
["136","NANFACK TSIGUIA Franck","B253","OLAT GROUP BTP","Limbe","691524443","franctsiguia@gmail.com"],
]

# --- Liste 4 : Géomètres Topographes ---
liste4 = [
["1","NGOA MINDZE Barnabé","C150","LIMA SURVEY","Ndanko Ndelele","698147806/674933287","tebatem7@gmail.com"],
["2","PAGOUO FADANGKA Edmond","C158","DR/MINMAP Nord","Garoua","694053607","edmondpagouofadangka@gmail.com"],
["3","KEMAJOU MBAKOP Arnauld Poupon","C170","","Yaounde","691863800","arnauldkemajou19@gmail.com"],
["4","MOUAFO TAMBOU Patrick Judicael","C181","DGM/MINDEF","Yaoundé","656 978 201","patjudicael2011@gmail.com"],
["5","NGUIMDO TSAGUE Hermann","C213","DAG/MINDCAF","Yaoundé","672350897","hermannnguimdotsague@gmail.com"],
["6","FOUEJEU TIOGO Gabin","C214","ACE/ALPHA-CONSULT/GE","Kaele","656896976","gabintiogo@gmail.com"],
["7","TIOMELA AWOUMKENG Vanessa","C217","SATEC ENGINEERING Sarl","Mbankomo","658942599","tawoukeng@gmail.com"],
["8","MBIA MBIA Jean Paul","C222","SDAF-MINDCAF/Boumba et Ngoko","Yokadouma","695941482","p8mbia@gmail.com"],
["9","TAMENA FOPAMENE Marie Audrey Epse DONGMO","C230","GEO ADVANTAGE SARL","Brazzaville, Congo","690270926","marietams95@gmail.com"],
["10","FEUDJO VOUTSA Guillaume Appolinaire","C234","","","",""],
["11","SANKENG Roger Emmanuel Charly","C235","SDAF-MINDCAF/Mifi","Bafoussam","697086537","sankenroger11@gmail.com"],
["12","TAZO KENFACK Jordan Bonbaye","C236","LEICA GEOSYSTEMS LTD","Hampstead, Canada","695967011","jordantazo@gmail.com"],
["13","TOUKAP DJANBOU Laurie","C245","Fugro UK","Plymouth, England","+44 75 54 37 72 86","toukapd.laurie@gmail.com"],
["14","YOMA BEGNI Hyancithe Magui","C247","Peev","Kribi","691 218 780","hyacinthebegni01@gmail.com"],
["15","KAMENI TEGANG Zacharie","C251","IZNA Group","Nkolafamba","695813396","tegangzackarie@yahoo.com"],
["16","OUMAROU Sahabo","C253","Aeroports du Cameroun","Yaoundé","690224854","sahaboumar97@gmail.com"],
["17","HIAG Francis Vincent","C255","","Yaoundé","696777146","francisvincenthiag@gmail.com"],
["18","ONDOBO Marie Claude","C257","","Yaoundé","659179324","marieclaudeondobo@gmail.com"],
["19","NOUBISSSI WADJO Franck Derrick","C258","","Yaoundé","690558009","lewadjass.fw@gmail.com"],
["20","TEJANI FONDI Karim","C259","INTEGC/GE","Yaoundé","698476855","tejanikarim50@gmail.com"],
["21","TEUMMAH FOGANG Jospin Marcial","C260","OTEIS Conseil et Ingénierie","Montpellier, France","698899964/+33 753 78 86 65","marcial.teummah@gmail.com"],
["22","AMOUGOU OWONA Martine Audrey","C261","Shee System Sarl","Yaoundé","655072284","audrey_divine@yahoo.com"],
["23","WOWE DAMOU Jonathan Donald","C262","SIC","Yaoundé","656922532","jonathandamou@gmail.com"],
["24","NGONO NKOLO Joséphine Christiane Trésore","C263","","Yaoundé","693450516","christianengononkolo@gmail.com"],
["25","MASSIA ESSAGA Fabiola Epse TCHIDA","C265","NIS SARL","Yaoundé","696409854","essagalucrece@gmail.com"],
["26","KUICHOUO SIGNE Régis Carlos","C267","DD/MINDCAF Mefou et Akono","Ngoumou","677611697","regiscarloskuichouosigne@gmail.com"],
["27","DOUANLA TCHINDA Boris Noel","C269","","Douala","682927188","tchindaboris07@gmail.com"],
["28","MADIBA ENYOUMA Yann Wanel","C270","Centre de l'Environnement pour le Développement (CED)","Yaoundé","651248703","madibayann@gmail.com"],
["29","FOSSING Frank Marc","C272","JIUJIANG CAMEROUN SARL","Kribi","651107312","fossingfrank@gmail.com"],
["30","YAKAN Fabrice Joel","C273","SDC-MINDCAF/Mefou et Afamba","Mfou","695534461","forzamilanac1889@gmail.com"],
["31","TOUA AWONO Armel Placide","C274","SDC-MINDCAF/Mbam et Inoubou","Bafia","694121958","touaawonoarmelplacide@gmail.com"],
["32","TSOPBENG POKAM Joel Fortunat","C275","Geotop","Freetown, Sierra Leone","698728906/+232 99484562","pokam.joel@gmail.com"],
["33","HOYA Regis Pierrick Melvin","C276","NIS SARL","Yaoundé","693701361","melvinhoya@gmail.com"],
["34","YAKUM Paul NUIPING","C278","DD-MINDCAF/Sanaga Maritime","Edea","676396439","minuiping@yahoo.com"],
["35","NGO KALDJOB Marie Tatiana Epse NLEND","C280","Tracocam","Yaoundé","674845151","ngomary32@gmail.com"],
["36","FOPA KOUCHELE Fridiane Lyndaes","C281","Ets ANUTEMEH Johnson Fru","Yaoundé","694140964","fridianefopa@gmail.com"],
["37","NGAH ONANA Bernadin Fabrice","C282","SCP Glonass","Douala","656181940","tanyirolland29@gmail.com"],
["38","TANYI Roland TANYI","C283","","Yaoundé","673520195","tanyirolland29@gmail.com"],
["39","ESSAMA BOMBA Michel","C284","NIS SARL","Yaoundé","697529801","essamabombamichel@gmail.com"],
["40","EYOUM NDENGUE Michelle Paule","C286","SIC","Yaoundé","679536354","eyoummichelle80@gmail.com"],
["41","DJOU NGUELA Donald","C289","DCAD/MINDCAF","Yaoundé","696279032","djounguela@gmail.com"],
["42","ATANGANA MANI Charles","C292","DCAD/MINDCAF","Yaoundé","699189880","atanganamani712@gmail.com"],
["43","NYETAM Sylvain","C293","DGPAT/DATZF-MINEPAT","Yaoundé","674090665","nyetamsylvain@gmail.com"],
["44","BILLONG Francois-Xavier Marie","C294","Pizzaroti","Yaoundé","698290933","billongfranois@yahoo.fr"],
["45","TERI Martin","C295","MINFOPRA","Yaoundé","694432280","terimartin1999@gmail.com"],
["46","DJOUMEJEU TSOPZE Dorah","C296","Global Group Service","Yaoundé","696733347","tsopzedorah@gmail.com"],
["47","TIMO TAGUIMDJEU Peguy Wilson","C297","l'entreprise Solutions Durables","Yaoundé","691964961","wilsontimo141@gmail.com"],
["48","MBOU FOBASSO Jessica","C298","SHEE Systm","Yaoundé","696269713","jessicambou2001@gmail.com"],
["49","ANDEGUE ENAMA Roland Hervé","C299","CETP","Yaoundé","693348924","andegueenamarolandherve@gmail.com"],
["50","YAMGOUE TCHALEU Junior","C300","CFHEC","Yaoundé","652600171/690682097","yamgouejunior@gmail.com"],
["51","MANTO SOB Carole","C301","BUNS","Bamenda","650709437","carolesob3@gmail.com"],
["52","NGONO AKOUA Yves","C302","EGIS","Yaounde","699633886","ngonoakouayves@gmail.com"],
["53","FONKENG Cyril NKENFACK","C303","","Yaoundé","673159466","nkenkafackcyril@gmail.com"],
["54","MBEZELE ONDOA Gisele Emilienne","C304","SBET","Yaoundé","697182005","gmbezeleondoa@gmail.com"],
["55","MBENOUN Jean Marc Ludovic","C305","Goldineng Sarl","Douala","691331683","mbenounjmludovic@gmail.com"],
["56","BIBOUE Francis Renaud","C306","","Douala","695693143","fbiboue@gmail.com"],
["57","FONGUE TSOPMEZA Brenda Charline","C307","","Yaoundé","656857803","brendafongue@gmail.com"],
["58","ZANGUE Eric Magloire","C308","ENSTP","Yaoundé","697253393","zangue.magloire@enstp.cm"],
["59","JIRIM Emmanuel KARI","C309","DAG/MINDCAF","Yaoundé","677560858","emmaka2006@yahoo.fr"],
["60","FOH MUNAKWA Byan","C310","Geomaticable Africa","Kribi","683081834","munakwabryan@gmail.com"],
["61","FOFOU SONKOUE Severin","C311","DD-MINDCAF/Mefou et Afamba","Mfou","694155737","fsseverin86@gmail.com"],
]

HEADERS_AGREMENT = ["numero", "nom", "numero_agrement", "cabinet", "adresse", "contact", "email"]
HEADERS_HONORAIRE = ["numero", "nom", "numero_agrement", "adresse", "contact", "email"]
HEADERS_MATRICULE = ["numero", "nom", "matricule", "lieu_service", "adresse", "contact", "email"]

def write_csv(filename, headers, rows):
    path = os.path.join(OUTDIR, filename)
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(headers)
        w.writerows(rows)
    return path

def rows_to_dicts(headers, rows):
    return [dict(zip(headers, r)) for r in rows]

paths = []
paths.append(write_csv("01-geometres-autorises.csv", HEADERS_AGREMENT, liste1))
paths.append(write_csv("02-geometres-experts-honoraires.csv", HEADERS_HONORAIRE, liste2))
paths.append(write_csv("03-geometres-experts.csv", HEADERS_MATRICULE, liste3))
paths.append(write_csv("04-geometres-topographes.csv", HEADERS_MATRICULE, liste4))

combined = {
    "source": "HPSC0177.pdf · Tableau OGEC 2026, Ordre National des Géomètres du Cameroun",
    # Tenu à jour à la main dans tableau-ogec-2026.json depuis la relecture du
    # 2026-08-19 — cette chaîne ne l'est plus si le script est relancé un
    # jour. Voir la note en tête de fichier et data/ocr-draft/README.md.
    "statut": "transcription relue le 2026-08-19 (échantillon large : 100% des listes 1 et 2, échantillon substantiel des listes 3 et 4, plus contrôle structurel intégral. Voir data/ocr-draft/README.md). Certitude au caractère près non garantie sur l'intégralité des numéros de téléphone.",
    "date_transcription": "2026-08-17",
    "date_verification": "2026-08-19",
    "listes": {
        "geometres_autorises": rows_to_dicts(HEADERS_AGREMENT, liste1),
        "geometres_experts_honoraires": rows_to_dicts(HEADERS_HONORAIRE, liste2),
        "geometres_experts": rows_to_dicts(HEADERS_MATRICULE, liste3),
        "geometres_topographes": rows_to_dicts(HEADERS_MATRICULE, liste4),
    },
    "totaux": {
        "geometres_autorises": len(liste1),
        "geometres_experts_honoraires": len(liste2),
        "geometres_experts": len(liste3),
        "geometres_topographes": len(liste4),
        "total": len(liste1) + len(liste2) + len(liste3) + len(liste4),
    },
}
json_path = os.path.join(OUTDIR, "tableau-ogec-2026.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)

print("Fichiers écrits :")
for p in paths:
    print(" -", p)
print(" -", json_path)
print("Total lignes :", combined["totaux"]["total"])
