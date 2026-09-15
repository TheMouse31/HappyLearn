insert into univers (slug, nom, recompense) values
  ('football', 'Football', 'Coupe du match'),
  ('rugby', 'Rugby', 'Coupe de l’essai'),
  ('equitation', 'Équitation', 'Fer d’or'),
  ('espace', 'Espace', 'Insigne orbital')
on conflict (slug) do update set nom = excluded.nom, recompense = excluded.recompense;

insert into etapes (id, ordre, type, savoir, payload) values
  ('T00', 1, 'tutorial', 'Écrire une fraction 3/4', '{"expected":"3/4"}'),
  ('N01', 2, 'continue', null, '{}'),
  ('N02', 3, 'continue', null, '{}'),
  ('M01', 4, 'fraction-choice', 'Reconnaître une moitié 6/12', '{"expected":"6/12","distractors":["4/12","8/12"]}'),
  ('M01B', 5, 'simplify', 'Simplifier 1/2', '{"expected":"1/2","distractors":["2/3","3/4"]}'),
  ('N03', 6, 'continue', null, '{}'),
  ('M02', 7, 'number', '1/4 de 20 = 5', '{"expected":"5","distractors":["4","15"]}'),
  ('M03', 8, 'number', '3/4 de 20 = 15', '{"expected":"15","distractors":["5","18"]}'),
  ('M04', 9, 'number', '2/3 de 18 = 12', '{"expected":"12","distractors":["6","16"]}'),
  ('M05A', 10, 'number', '3/4 de 24 = 18', '{"expected":"18","distractors":["6","21"],"twoStep":1}'),
  ('M05B', 11, 'number', '1/3 de 18 = 6', '{"expected":"6","distractors":["3","8"],"twoStep":2}'),
  ('M06', 12, 'number', 'Complément 30 − 15 − 10 = 5', '{"expected":"5","distractors":["15","25"]}'),
  ('D01', 13, 'direction', 'Décision dans l’axe', '{"expected":"axe","distractors":["gauche","droite"]}'),
  ('N04', 14, 'continue', null, '{}'),
  ('L01', 15, 'method', 'Méthode fraction d’un nombre', '{}'),
  ('B01', 16, 'bilan', 'Bilan sans note', '{}'),
  ('Z01', 17, 'teaser', null, '{}')
on conflict (id) do update set
  ordre = excluded.ordre,
  type = excluded.type,
  savoir = excluded.savoir,
  payload = excluded.payload;
