-- ============================================================
-- MASI-CO E-shop — seed data
-- ============================================================

-- ==========================
-- KATEGORIE — hlavni
-- ==========================
INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Hotovky',           'hotovky',           'Hotova jidla ve sklenici — staci ohrat', NULL, 1),
  ('c0000000-0000-0000-0000-000000000002', 'Maso',              'maso',              'Cerstve maso z ceskych farmi',           NULL, 2),
  ('c0000000-0000-0000-0000-000000000003', 'Uzene maso',        'uzene-maso',        'Tradicne uzene maso',                    NULL, 3),
  ('c0000000-0000-0000-0000-000000000004', 'Ostatni maso',      'ostatni-maso',      'Drubez, kralik, jehneci a dalsi',        NULL, 4),
  ('c0000000-0000-0000-0000-000000000005', 'Zverina',           'zverina',           'Divoka zver z ceskych reviru',           NULL, 5),
  ('c0000000-0000-0000-0000-000000000006', 'Ryby',              'ryby',              'Cerstve ryby a morske plody',            NULL, 6),
  ('c0000000-0000-0000-0000-000000000007', 'Uzeniny',           'uzeniny',           'Tradicni ceske uzeniny',                 NULL, 7),
  ('c0000000-0000-0000-0000-000000000008', 'Ostatni sortiment', 'ostatni-sortiment', 'Dalsi produkty a doplnky',               NULL, 8);

-- ==========================
-- KATEGORIE — podkategorie Maso
-- ==========================
INSERT INTO categories (id, name, slug, description, parent_id, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Veprove maso',          'veprove-maso',          'Cerstve veprove maso',                    'c0000000-0000-0000-0000-000000000002', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Veprove droby',         'veprove-droby',         'Veprove droby a vnitrnosti',              'c0000000-0000-0000-0000-000000000002', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Hovezi maso',           'hovezi-maso',           'Prvotridni hovezi maso',                  'c0000000-0000-0000-0000-000000000002', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Hovezi droby',          'hovezi-droby',          'Hovezi droby a vnitrnosti',               'c0000000-0000-0000-0000-000000000002', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Teleci maso',           'teleci-maso',           'Kvalitni teleci maso',                    'c0000000-0000-0000-0000-000000000002', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Kureci maso',           'kureci-maso',           'Cerstve kureci maso',                     'c0000000-0000-0000-0000-000000000002', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Mlete maso a zavarka',  'mlete-maso-a-zavarka',  'Mleta masa a zavarkova masa',             'c0000000-0000-0000-0000-000000000002', 7);

-- ==========================
-- PRODUKTY — Hovezi maso
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, is_featured, sort_order) VALUES
  ('Hovezi svickova/byk 1kg',               'hovezi-svickova-byk',           'c1000000-0000-0000-0000-000000000003', 756.00, 'kg', 'in_stock',     true,  1),
  ('Hovezi svickova/krava 1kg',              'hovezi-svickova-krava',         'c1000000-0000-0000-0000-000000000003', 718.00, 'kg', 'in_stock',     false, 2),
  ('Hovezi rostena/byk 1kg',                 'hovezi-rostena-byk',            'c1000000-0000-0000-0000-000000000003', 447.00, 'kg', 'in_stock',     true,  3),
  ('Hovezi rostena/krava 1kg',               'hovezi-rostena-krava',          'c1000000-0000-0000-0000-000000000003', 371.00, 'kg', 'in_stock',     false, 4),
  ('Hovezi zadni b.k./byk 1kg',             'hovezi-zadni-bk-byk',           'c1000000-0000-0000-0000-000000000003', 367.00, 'kg', 'in_stock',     false, 5),
  ('Hovezi zadni b.k./krava 1kg',           'hovezi-zadni-bk-krava',         'c1000000-0000-0000-0000-000000000003', 348.00, 'kg', 'in_stock',     false, 6),
  ('Hovezi predni b.k. krk/byk 1kg',        'hovezi-predni-bk-krk-byk',     'c1000000-0000-0000-0000-000000000003', 327.00, 'kg', 'in_stock',     false, 7),
  ('Hovezi predni b.k. krk/krava 1kg',      'hovezi-predni-bk-krk-krava',   'c1000000-0000-0000-0000-000000000003', 301.00, 'kg', 'in_stock',     false, 8),
  ('Hovezi krajene kostky na gulas 1kg',     'hovezi-kostky-gulas',           'c1000000-0000-0000-0000-000000000003', 307.00, 'kg', 'in_stock',     false, 9),
  ('Hovezi mlete maso 1kg',                  'hovezi-mlete-maso',             'c1000000-0000-0000-0000-000000000003', 187.00, 'kg', 'in_stock',     false, 10),
  ('Hovezi licka mrazena 1kg',               'hovezi-licka-mrazena',          'c1000000-0000-0000-0000-000000000003', 393.00, 'kg', 'in_stock',     false, 11),
  ('Hovezi ohan ka 1kg',                     'hovezi-ohanka',                 'c1000000-0000-0000-0000-000000000003', 198.00, 'kg', 'in_stock',     false, 12),
  ('Hovezi kosti/harfy 1kg',                 'hovezi-kosti-harfy',            'c1000000-0000-0000-0000-000000000003',  50.00, 'kg', 'in_stock',     false, 13),
  ('Hovezi kosti morkove 1kg',               'hovezi-kosti-morkove',          'c1000000-0000-0000-0000-000000000003',  90.00, 'kg', 'in_stock',     false, 14),
  ('Hovezi Flank steak 1kg',                 'hovezi-flank-steak',            'c1000000-0000-0000-0000-000000000003', 437.00, 'kg', 'out_of_stock', false, 15),
  ('Hovezi rostena starena 1kg',             'hovezi-rostena-starena',        'c1000000-0000-0000-0000-000000000003', 558.00, 'kg', 'out_of_stock', false, 16),
  ('Hovezi chuck roll 1kg',                  'hovezi-chuck-roll',             'c1000000-0000-0000-0000-000000000003', 431.00, 'kg', 'on_order',     false, 17),
  ('Hovezi predni s kosti 1kg',              'hovezi-predni-s-kosti',         'c1000000-0000-0000-0000-000000000003', 160.00, 'kg', 'in_stock',     false, 18),
  ('Hovezi predni klizka/byk 1kg',           'hovezi-predni-klizka-byk',      'c1000000-0000-0000-0000-000000000003', 267.00, 'kg', 'in_stock',     false, 19),
  ('Hovezi predni klizka/krava 1kg',         'hovezi-predni-klizka-krava',    'c1000000-0000-0000-0000-000000000003', 255.00, 'kg', 'in_stock',     false, 20),
  ('Hovezi zadni/falesna svickova 1kg',      'hovezi-falesna-svickova',       'c1000000-0000-0000-0000-000000000003', 423.00, 'kg', 'in_stock',     false, 21),
  ('Hovezi zadni plec/byk 1kg',              'hovezi-zadni-plec-byk',         'c1000000-0000-0000-0000-000000000003', 327.00, 'kg', 'in_stock',     false, 22),
  ('Hovezi zadni plec/krava 1kg',            'hovezi-zadni-plec-krava',       'c1000000-0000-0000-0000-000000000003', 299.00, 'kg', 'in_stock',     false, 23),
  ('Hovezi zadni spodni sal 1kg',            'hovezi-zadni-spodni-sal',       'c1000000-0000-0000-0000-000000000003', 338.00, 'kg', 'out_of_stock', false, 24),
  ('Hovezi zadni/valecek 1kg',               'hovezi-zadni-valecek',          'c1000000-0000-0000-0000-000000000003', 447.00, 'kg', 'in_stock',     false, 25),
  ('Hovezi zadni vrchni sal 1kg',            'hovezi-zadni-vrchni-sal',       'c1000000-0000-0000-0000-000000000003', 358.00, 'kg', 'in_stock',     false, 26),
  ('Hovezi kosti s klouby/rezane 1kg',       'hovezi-kosti-s-klouby',         'c1000000-0000-0000-0000-000000000003',  50.00, 'kg', 'in_stock',     false, 27),
  ('Hovezi orez-HPV 1kg',                    'hovezi-orez-hpv',               'c1000000-0000-0000-0000-000000000003', 151.00, 'kg', 'out_of_stock', false, 28);

-- ==========================
-- PRODUKTY — Veprove maso
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Veprova krkovice bez kosti 1kg',                     'veprova-krkovice-bez-kosti',         'c1000000-0000-0000-0000-000000000001', 147.00, 'kg', 'in_stock',      1),
  ('Veprova krkovice s kosti 1kg',                       'veprova-krkovice-s-kosti',           'c1000000-0000-0000-0000-000000000001', 136.00, 'kg', 'in_stock',      2),
  ('Veprova kyta bez kosti 1kg',                         'veprova-kyta-bez-kosti',             'c1000000-0000-0000-0000-000000000001', 113.00, 'kg', 'in_stock',      3),
  ('Veprova kyta platkovana 1kg',                        'veprova-kyta-platkovana',            'c1000000-0000-0000-0000-000000000001', 136.00, 'kg', 'in_stock',      4),
  ('Veprova kyta/nudlicky 1kg',                          'veprova-kyta-nudlicky',              'c1000000-0000-0000-0000-000000000001', 136.00, 'kg', 'in_stock',      5),
  ('Veprova panenka chlazena 1kg',                       'veprova-panenka-chlazena',           'c1000000-0000-0000-0000-000000000001', 224.00, 'kg', 'in_stock',      6),
  ('Veprova pecene bez kosti 1kg',                       'veprova-pecene-bez-kosti',           'c1000000-0000-0000-0000-000000000001', 125.00, 'kg', 'in_stock',      7),
  ('Veprova pecene s kosti 1kg',                         'veprova-pecene-s-kosti',             'c1000000-0000-0000-0000-000000000001', 114.00, 'kg', 'in_stock',      8),
  ('Veprova plec bez kosti 1kg',                         'veprova-plec-bez-kosti',             'c1000000-0000-0000-0000-000000000001', 111.00, 'kg', 'in_stock',      9),
  ('Veprovy bok bez kosti 1kg',                          'veprovy-bok-bez-kosti',              'c1000000-0000-0000-0000-000000000001', 129.00, 'kg', 'in_stock',      10),
  ('Veprovy bok s kosti 1kg',                            'veprovy-bok-s-kosti',                'c1000000-0000-0000-0000-000000000001', 128.00, 'kg', 'in_stock',      11),
  ('Veprova zebra z boku/plocha 1kg',                    'veprova-zebra-plocha',               'c1000000-0000-0000-0000-000000000001', 104.00, 'kg', 'in_stock',      12),
  ('Veprova zebra z boku/special 1kg',                   'veprova-zebra-special',              'c1000000-0000-0000-0000-000000000001', 165.00, 'kg', 'in_stock',      13),
  ('Veprove koleno zadni s kosti 1kg',                   'veprove-koleno-zadni-s-kosti',       'c1000000-0000-0000-0000-000000000001',  85.00, 'kg', 'in_stock',      14),
  ('Veprove koleno zadni bez kosti 1kg',                 'veprove-koleno-zadni-bez-kosti',     'c1000000-0000-0000-0000-000000000001', 115.00, 'kg', 'in_stock',      15),
  ('Veprove koleno predni s kosti 1kg',                  'veprove-koleno-predni-s-kosti',      'c1000000-0000-0000-0000-000000000001',  71.00, 'kg', 'in_stock',      16),
  ('Veprove mlete maso 1kg',                             'veprove-mlete-maso',                 'c1000000-0000-0000-0000-000000000001', 133.00, 'kg', 'in_stock',      17),
  ('Veprove krajene kostky na gulas z plece 1kg',        'veprove-kostky-gulas',               'c1000000-0000-0000-0000-000000000001', 134.00, 'kg', 'in_stock',      18),
  ('Veprova licka 1kg',                                  'veprova-licka',                      'c1000000-0000-0000-0000-000000000001', 259.00, 'kg', 'in_stock',      19),
  ('Veprovy T-bone steak 400g',                          'veprovy-t-bone-steak',               'c1000000-0000-0000-0000-000000000001', 197.00, 'kg', 'out_of_stock',  20),
  ('Veprova hlava pulena 1kg',                           'veprova-hlava-pulena',               'c1000000-0000-0000-0000-000000000001',  34.00, 'kg', 'in_stock',      21),
  ('Veprova kostra 1kg',                                 'veprova-kostra',                     'c1000000-0000-0000-0000-000000000001', 106.00, 'kg', 'on_order',      22),
  ('Veprova kuze 1kg',                                   'veprova-kuze',                       'c1000000-0000-0000-0000-000000000001',  11.00, 'kg', 'in_stock',      23),
  ('Veprova pecene s kosti/sekane 1kg',                  'veprova-pecene-s-kosti-sekane',      'c1000000-0000-0000-0000-000000000001', 125.00, 'kg', 'in_stock',      24),
  ('Veprova pulka 1kg',                                  'veprova-pulka',                      'c1000000-0000-0000-0000-000000000001',  96.00, 'kg', 'on_order',      25),
  ('Veprova streva 20m',                                 'veprova-streva',                     'c1000000-0000-0000-0000-000000000001', 1236.00,'ks', 'out_of_stock',  26),
  ('Veprova zebra z pecene a krkovice 1kg',              'veprova-zebra-pecene-krkovice',      'c1000000-0000-0000-0000-000000000001',  62.00, 'kg', 'in_stock',      27),
  ('Veprove nozicky 1kg',                                'veprove-nozicky',                    'c1000000-0000-0000-0000-000000000001',  29.00, 'kg', 'in_stock',      28),
  ('Veprove ocasky masite 1kg',                          'veprove-ocasky',                     'c1000000-0000-0000-0000-000000000001', 106.00, 'kg', 'in_stock',      29),
  ('Veprove palce z panenek 1kg',                        'veprove-palce-z-panenek',            'c1000000-0000-0000-0000-000000000001', 174.00, 'kg', 'in_stock',      30),
  ('Veprove sadlo hrbetni 1kg',                          'veprove-sadlo-hrbetni',              'c1000000-0000-0000-0000-000000000001',  74.00, 'kg', 'in_stock',      31),
  ('Veprovy lalok 1kg',                                  'veprovy-lalok',                      'c1000000-0000-0000-0000-000000000001',  94.00, 'kg', 'in_stock',      32),
  ('Veprovy orez libovy 1kg',                            'veprovy-orez-libovy',                'c1000000-0000-0000-0000-000000000001', 111.00, 'kg', 'out_of_stock',  33);

-- ==========================
-- PRODUKTY — Hovezi droby
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Hovezi jatra 1kg',                   'hovezi-jatra',                 'c1000000-0000-0000-0000-000000000004',  29.00, 'kg', 'in_stock', 1),
  ('Hovezi jazyk chl/mr 1kg',            'hovezi-jazyk',                 'c1000000-0000-0000-0000-000000000004', 129.00, 'kg', 'in_stock', 2),
  ('Hovezi srdce chl/mr 1kg',            'hovezi-srdce',                 'c1000000-0000-0000-0000-000000000004',  50.00, 'kg', 'in_stock', 3),
  ('Hovezi drstky/predvarene 1kg',       'hovezi-drstky-predvarene',     'c1000000-0000-0000-0000-000000000004', 113.00, 'kg', 'in_stock', 4),
  ('Hovezi drstky syrove chl/mr 1kg',    'hovezi-drstky-syrove',         'c1000000-0000-0000-0000-000000000004', 113.00, 'kg', 'in_stock', 5),
  ('Hovezi byci zlazy 1kg',              'hovezi-byci-zlazy',            'c1000000-0000-0000-0000-000000000004', 125.00, 'kg', 'in_stock', 6);

-- ==========================
-- PRODUKTY — Veprove droby
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Veprova jatra chl/mr 1kg',           'veprova-jatra',                'c1000000-0000-0000-0000-000000000002',  62.00, 'kg', 'in_stock', 1),
  ('Veprova ledvina chl/mr 1kg',         'veprova-ledvina',              'c1000000-0000-0000-0000-000000000002',  48.00, 'kg', 'in_stock', 2),
  ('Veprove srdce chl/mr 1kg',           'veprove-srdce',                'c1000000-0000-0000-0000-000000000002',  69.00, 'kg', 'in_stock', 3),
  ('Veprovy jazyk chl/mr 1kg',           'veprovy-jazyk',                'c1000000-0000-0000-0000-000000000002', 127.00, 'kg', 'in_stock', 4),
  ('Veprovy zaludek chl/mr 1kg',         'veprovy-zaludek',              'c1000000-0000-0000-0000-000000000002',  74.00, 'kg', 'in_stock', 5),
  ('Veprova krev 1kg',                   'veprova-krev',                 'c1000000-0000-0000-0000-000000000002',  43.00, 'kg', 'in_stock', 6);

-- ==========================
-- PRODUKTY — Teleci maso
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Teleci kyta byk/krava/mrazena 1kg',  'teleci-kyta',                  'c1000000-0000-0000-0000-000000000005', 476.00, 'kg', 'in_stock',      1),
  ('Teleci plec byk/krava/mrazena 1kg',  'teleci-plec',                  'c1000000-0000-0000-0000-000000000005', 342.00, 'kg', 'out_of_stock',  2),
  ('Teleci svickova 1kg',                'teleci-svickova',              'c1000000-0000-0000-0000-000000000005', 952.00, 'kg', 'on_order',      3),
  ('Teleci kosti/mrazene 1kg',           'teleci-kosti',                 'c1000000-0000-0000-0000-000000000005',  74.00, 'kg', 'in_stock',      4);

-- ==========================
-- PRODUKTY — Kureci maso
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Kureci prsa 1kg',                             'kureci-prsa',                   'c1000000-0000-0000-0000-000000000006', 174.00, 'kg', 'in_stock',      1),
  ('Kureci stehna/200g az 240g/ 1kg',             'kureci-stehna',                 'c1000000-0000-0000-0000-000000000006', 103.00, 'kg', 'in_stock',      2),
  ('Kureci stehenni rizky bez kuze 1kg',           'kureci-stehenni-rizky',         'c1000000-0000-0000-0000-000000000006', 113.00, 'kg', 'in_stock',      3),
  ('Kureci ctvrtky chlazene 1kg',                 'kureci-ctvrtky',                'c1000000-0000-0000-0000-000000000006',  53.00, 'kg', 'in_stock',      4),
  ('Kureci kridla 1kg',                            'kureci-kridla',                 'c1000000-0000-0000-0000-000000000006',  53.00, 'kg', 'in_stock',      5),
  ('Kureci kridla bez letek 1kg',                  'kureci-kridla-bez-letek',       'c1000000-0000-0000-0000-000000000006',  85.00, 'kg', 'in_stock',      6),
  ('Kureci palicky 1kg',                           'kureci-palicky',                'c1000000-0000-0000-0000-000000000006',  76.00, 'kg', 'in_stock',      7),
  ('Kure cele/1,2 az 1,5kg/ 1kg',                 'kure-cele',                     'c1000000-0000-0000-0000-000000000006', 106.00, 'kg', 'in_stock',      8),
  ('Kure chlazene/nekalibrovane/ 1kg',             'kure-chlazene-nekalibrovane',   'c1000000-0000-0000-0000-000000000006',  76.00, 'kg', 'in_stock',      9),
  ('Kureci rolada/vykostene kure 1kg',             'kureci-rolada',                 'c1000000-0000-0000-0000-000000000006', 192.00, 'kg', 'in_stock',      10),
  ('Kureci prsa s.k. s kuzi-supreme 1kg',          'kureci-prsa-supreme',           'c1000000-0000-0000-0000-000000000006', 220.00, 'kg', 'in_stock',      11),
  ('Kureci prsa b.k. s kuzi 1kg',                  'kureci-prsa-bk-s-kuzi',         'c1000000-0000-0000-0000-000000000006', 179.00, 'kg', 'out_of_stock',  12),
  ('Kureci spalicky 1kg',                          'kureci-spalicky',               'c1000000-0000-0000-0000-000000000006',  91.00, 'kg', 'on_order',      13),
  ('Kureci kostry 1kg',                            'kureci-kostry',                 'c1000000-0000-0000-0000-000000000006',  35.00, 'kg', 'in_stock',      14),
  ('Kureci jatra/tacek 0,5kg/ 1kg',                'kureci-jatra',                  'c1000000-0000-0000-0000-000000000006',  46.00, 'kg', 'in_stock',      15),
  ('Kureci srdce/tacek 0,5kg/ 1kg',                'kureci-srdce',                  'c1000000-0000-0000-0000-000000000006',  57.00, 'kg', 'in_stock',      16),
  ('Kureci zaludky/tacek 0,5kg/ 1kg',              'kureci-zaludky',                'c1000000-0000-0000-0000-000000000006',  53.00, 'kg', 'in_stock',      17);

-- ==========================
-- PRODUKTY — Mlete maso a zavarka
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Mlete maso mix 50/50 1kg',            'mlete-maso-mix',               'c1000000-0000-0000-0000-000000000007', 120.00, 'kg', 'in_stock',      1),
  ('Jatrova zavarka 1kg',                 'jatrova-zavarka',              'c1000000-0000-0000-0000-000000000007', 105.00, 'kg', 'out_of_stock',  2);

-- ==========================
-- PRODUKTY — Ostatni maso
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, stock_status, sort_order) VALUES
  ('Husa/mrazena/ 1kg',                              'husa-mrazena',                  'c0000000-0000-0000-0000-000000000004', 301.00, 'kg', 'in_stock',      1),
  ('Husi stehna/mrazena/ 1kg',                        'husi-stehna',                   'c0000000-0000-0000-0000-000000000004', 530.00, 'kg', 'out_of_stock',  2),
  ('Husokachna 3,4kg /mrazena/ 1kg',                  'husokachna',                    'c0000000-0000-0000-0000-000000000004', 129.00, 'kg', 'out_of_stock',  3),
  ('Kachna 2,2-2,4kg /mrazena/ 1kg',                  'kachna-mrazena',                'c0000000-0000-0000-0000-000000000004', 118.00, 'kg', 'in_stock',      4),
  ('Kachni prsa bez kosti/mrazene/ 1kg',               'kachni-prsa',                   'c0000000-0000-0000-0000-000000000004', 272.00, 'kg', 'in_stock',      5),
  ('Kachni ctvrtky /mrazene/ 1kg',                    'kachni-ctvrtky',                'c0000000-0000-0000-0000-000000000004', 195.00, 'kg', 'in_stock',      6),
  ('Kachni jatra /bal. 0,5kg/mrazena 1kg',            'kachni-jatra',                  'c0000000-0000-0000-0000-000000000004', 159.00, 'kg', 'in_stock',      7),
  ('Kralik 1,3-1,4kg /mrazeny/ 1kg',                  'kralik-mrazeny',                'c0000000-0000-0000-0000-000000000004', 199.00, 'kg', 'in_stock',      8),
  ('Kralici stehna/mrazena/ 1kg',                      'kralici-stehna',                'c0000000-0000-0000-0000-000000000004', 167.00, 'kg', 'in_stock',      9),
  ('Kralici hrbety /bal. 0,5kg/mrazene 1kg',           'kralici-hrbety',                'c0000000-0000-0000-0000-000000000004', 224.00, 'kg', 'in_stock',      10),
  ('Slepice lehka 1,3kg /mrazena/ 1kg',                'slepice-lehka',                 'c0000000-0000-0000-0000-000000000004',  83.00, 'kg', 'in_stock',      11),
  ('Slepice tezka/mrazena/ 1kg',                       'slepice-tezka',                 'c0000000-0000-0000-0000-000000000004', 101.00, 'kg', 'in_stock',      12),
  ('Kruti prsa/chlazena/ 1kg',                         'kruti-prsa',                    'c0000000-0000-0000-0000-000000000004', 298.00, 'kg', 'in_stock',      13),
  ('Kruti steheni platek chl/mr 1kg',                  'kruti-stehenni-platek',         'c0000000-0000-0000-0000-000000000004', 212.00, 'kg', 'in_stock',      14),
  ('Kruti palicka chl/mr 1kg',                         'kruti-palicka',                 'c0000000-0000-0000-0000-000000000004', 100.00, 'kg', 'in_stock',      15),
  ('Kruti jatra /mrazene/ 1kg',                        'kruti-jatra',                   'c0000000-0000-0000-0000-000000000004',  77.00, 'kg', 'in_stock',      16),
  ('Kruta chl/mr 1kg',                                 'kruta',                         'c0000000-0000-0000-0000-000000000004', 174.00, 'kg', 'out_of_stock',  17),
  ('Jehneci koleno zadni 400-600g /mrazene/ 1kg',      'jehneci-koleno',                'c0000000-0000-0000-0000-000000000004', 422.00, 'kg', 'in_stock',      18),
  ('Veprove sele 1kg',                                 'veprove-sele',                  'c0000000-0000-0000-0000-000000000004', 121.00, 'kg', 'on_order',      19);

-- ==========================
-- PRODUKTY — Hotovky
-- ==========================
INSERT INTO products (name, slug, category_id, price, unit, weight_info, stock_status, is_featured, sort_order) VALUES
  ('Svickova na smetane 900ml',                  'svickova-na-smetane',            'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      true,  1),
  ('Hovezi gulas 900ml',                          'hovezi-gulas',                   'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      true,  2),
  ('Segedinsky gulas 900ml',                      'segedinsky-gulas',               'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 3),
  ('Koprova omacka 900ml',                        'koprova-omacka',                 'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 4),
  ('Rajska omacka 900ml',                         'rajska-omacka',                  'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 5),
  ('Stepanska omacka 900ml',                      'stepanska-omacka',               'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 6),
  ('Hamburska veprova kyta 900ml',                'hamburska-veprova-kyta',         'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 7),
  ('Hovezi rostena na zampionech 900ml',          'hovezi-rostena-na-zampionech',   'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'out_of_stock',  false, 8),
  ('Rozlitany hovezi ptacek 900ml',               'rozlitany-hovezi-ptacek',        'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 9),
  ('Domaci paprikova klobasa 900ml',              'domaci-paprikova-klobasa',       'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'out_of_stock',  false, 10),
  ('Mexicke fazole 900ml',                        'mexicke-fazole',                 'c0000000-0000-0000-0000-000000000001', 178.00, 'ks', '900ml', 'in_stock',      false, 11),
  ('Gulasova polevka 900ml',                      'gulasova-polevka',               'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 12),
  ('Drstkova polevka 900ml',                      'drstkova-polevka',               'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 13),
  ('Bramborova s houbami 900ml',                  'bramborova-s-houbami',           'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 14),
  ('Cockova polevka 900ml',                       'cockova-polevka',                'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 15),
  ('Frankfurtska s parkem 900ml',                 'frankfurtska-s-parkem',          'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 16),
  ('Hovezi vyvar s jatrovou zavarkou 900ml',      'hovezi-vyvar-jatrova-zavarka',   'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 17),
  ('Hovezi vyvar s nudlemi 900ml',                'hovezi-vyvar-s-nudlemi',         'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 18),
  ('Kulajda 900ml',                               'kulajda',                        'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'in_stock',      false, 19),
  ('Kureci vyvar s nudlemi 900ml',                'kureci-vyvar-s-nudlemi',         'c0000000-0000-0000-0000-000000000001',  99.00, 'ks', '900ml', 'out_of_stock',  false, 20);

-- ==========================
-- SITE SETTINGS
-- ==========================
INSERT INTO site_settings (key, value) VALUES
  ('min_order_amount',    '{"value": 1000}'),
  ('free_shipping_from',  '{"value": 0}'),
  ('delivery_areas',      '{"areas": ["Praha a okoli", "Praha-vychod", "Mlada Boleslav", "Kladno", "Melnik", "Nymburk"]}'),
  ('store_address',       '{"company": "Masi-co s.r.o.", "street": "Zahradni 466", "zip": "250 64", "city": "Mesice", "region": "Praha-vychod"}'),
  ('contact',             '{"email": "info@masi-co.cz", "phone": "+420 123 456 789"}'),
  ('social_links',        '{"facebook": "", "instagram": "", "tiktok": "", "website": "https://masi-co.cz"}'),
  ('order_cutoff_time',   '{"hour": 12, "note": "Objednavky do 12:00 expedujeme tentyz den"}');
