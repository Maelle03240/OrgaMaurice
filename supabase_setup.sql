-- ============================================
-- MAURICE 2026 · Setup complet Supabase
-- Exécute ce script dans le SQL Editor de Supabase
-- (Dashboard → SQL Editor → New query → colle tout → Run)
-- ============================================

-- 1) Supprimer les tables existantes (elles sont vides)
DROP TABLE IF EXISTS day_plans CASCADE;
DROP TABLE IF EXISTS day_types CASCADE;
DROP TABLE IF EXISTS activities CASCADE;

-- 2) Table ACTIVITIES
CREATE TABLE activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'autre',
  lieu TEXT DEFAULT '',
  prix NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Table DAY_TYPES (journées types)
CREATE TABLE day_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📅',
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#1B8FAD',
  activity_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Table DAY_PLANS (avec colonne calendar pour double calendrier)
CREATE TABLE day_plans (
  date DATE NOT NULL,
  calendar TEXT NOT NULL DEFAULT 'moi',
  activity_entries JSONB DEFAULT '[]',
  notes TEXT DEFAULT '',
  has_car BOOLEAN DEFAULT false,
  day_type_id UUID REFERENCES day_types(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (date, calendar)
);

-- 5) RLS (Row Level Security) - accès libre (app perso)
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès libre activities" ON activities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès libre day_types" ON day_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès libre day_plans" ON day_plans FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- 6) Données de départ : Activités
-- ============================================
INSERT INTO activities (name, type, lieu, prix, notes) VALUES
  ('Snorkeling Péreybère',    'plage',     'Péreybère',             0,   'Masque perso ou location ~5€'),
  ('Excursion Île Plate',     'excursion', 'Grand Baie',            50,  'Dauphins + snorkeling. Départ 9h. Réserver 1 semaine avant.'),
  ('Parachute ascensionnel',  'sport',     'Grand Baie',            60,  '~30 min. Opérateurs sur la plage.'),
  ('Rando 7 Cascades',        'rando',     'Henrietta (Chamarel)',  0,   '~2h30 AR. Départ tôt 8h. Baignade dans les vasques.'),
  ('Blue Bay Marine Park',    'plage',     'Blue Bay, côte sud',    0,   'Snorkeling gratuit. Coraux préservés, tortues possibles.'),
  ('Mahébourg Village',       'culture',   'Mahébourg',             0,   'Marché local, musée naval gratuit. 20 min de Blue Bay.'),
  ('Île aux Cerfs',           'excursion', 'Trou d''Eau Douce',    28,  'Bateau AR ~20 min. Lagon + grillades.'),
  ('Cours de surf',           'sport',     'Tamarin (côte ouest)',  50,  'Tamarin Surf Club. Débutante OK.'),
  ('L''Aventure du Sucre',    'culture',   'Beau Plan (nord)',      15,  'Musée immersif + dégustation rhums.'),
  ('Catamaran 3 îles',        'excursion', 'Grand Baie',            100, 'Coin de Mire + Île Plate + Île Gabriel. Réserver 1 mois avant !'),
  ('Tatouage souvenir',       'autre',     'Grand Baie',            90,  'Ink Nation ou Tattoo Paradise. RDV 3 semaines avant.'),
  ('Trou aux Cerfs',          'rando',     'Curepipe',              0,   'Cratère volcanique. Vue 360°.'),
  ('Plage Le Morne',          'plage',     'Le Morne (côte ouest)', 0,   'Magnifique lagon. Coucher de soleil parfait.'),
  ('Sous-marin touristique',  'excursion', 'Nord île',              80,  'Réservé à 4 pour le 11 avril !'),
  ('Belle Mare / Palmar',     'plage',     'Côte est',              0,   'La plus belle eau turquoise. Bus via Port-Louis ~1h30.'),
  ('Massage créole',          'spa',       'Grand Baie',            50,  '~1h. Idéal en duo.');

-- ============================================
-- 7) Données de départ : Journées types
-- (les activity_ids seront liés après car les UUIDs sont auto-générés)
-- ============================================

-- On va chercher les IDs des activités pour les lier aux journées types
DO $$
DECLARE
  id_rando7    UUID;
  id_lemorne   UUID;
  id_bluebay   UUID;
  id_mahebourg UUID;
  id_surf      UUID;
  id_parachute UUID;
  id_massage   UUID;
  id_catamaran UUID;
BEGIN
  SELECT id INTO id_rando7    FROM activities WHERE name = 'Rando 7 Cascades';
  SELECT id INTO id_lemorne   FROM activities WHERE name = 'Plage Le Morne';
  SELECT id INTO id_bluebay   FROM activities WHERE name = 'Blue Bay Marine Park';
  SELECT id INTO id_mahebourg FROM activities WHERE name = 'Mahébourg Village';
  SELECT id INTO id_surf      FROM activities WHERE name = 'Cours de surf';
  SELECT id INTO id_parachute FROM activities WHERE name = 'Parachute ascensionnel';
  SELECT id INTO id_massage   FROM activities WHERE name = 'Massage créole';
  SELECT id INTO id_catamaran FROM activities WHERE name = 'Catamaran 3 îles';

  INSERT INTO day_types (name, icon, description, color, activity_ids) VALUES
    ('Sud Sauvage · Cascades & Plage', '🌊', '7 Cascades le matin + Plage Le Morne l''après-midi',
     '#1B8FAD', ARRAY[id_rando7, id_lemorne]),
    ('Sud-Est · Coraux & Village', '🐠', 'Blue Bay Marine Park + Mahébourg village créole',
     '#2D6A4F', ARRAY[id_bluebay, id_mahebourg]),
    ('Weekend Surf à Tamarin', '🏄', '2 sessions surf + parachute ou massage côte ouest',
     '#E07B54', ARRAY[id_surf, id_parachute, id_massage]),
    ('Grand Final · 3 Îles', '⛵', 'Catamaran Coin de Mire + Île Plate + Île Gabriel',
     '#D4A843', ARRAY[id_catamaran]);
END $$;
